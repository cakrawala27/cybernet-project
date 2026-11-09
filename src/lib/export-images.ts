import sharp from 'sharp'
import { JSDOM } from 'jsdom'

export type ImageAsset = {
  url: string
  buffer: Buffer
  width: number
  height: number
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const MAX_BYTES = 15_000_000

/**
 * Sedot satu gambar dari URL → konversi/resize jadi JPEG via sharp.
 * Return null kalau gagal (situs blokir, SVG tanpa ukuran, dsb) —
 * pemanggil cukup melewati gambar itu.
 */
export async function fetchImage(
  url: string,
  maxWidth: number,
  quality = 74,
): Promise<ImageAsset | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': UA,
          Accept: 'image/avif,image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8',
          Referer: new URL(url).origin + '/',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = Buffer.from(await res.arrayBuffer())
      if (raw.length < 100 || raw.length > MAX_BYTES) throw new Error('ukuran tak wajar')

      const meta = await sharp(raw, { failOn: 'none' }).metadata()
      const w = Number(meta.width) || 0
      const h = Number(meta.height) || 0
      if (w < 60 || h < 40) throw new Error('terlalu kecil / tak terbaca')

      let pipe = sharp(raw, { failOn: 'none' })
      if (w > maxWidth) pipe = pipe.resize({ width: maxWidth, withoutEnlargement: true })
      const out = await pipe.jpeg({ quality }).toBuffer({ resolveWithObject: true })
      if (out.data.length < 100) throw new Error('hasil kosong')

      return { url, buffer: out.data, width: out.info.width, height: out.info.height }
    } catch {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 500))
        continue
      }
      return null
    }
  }
  return null
}

/** Ambil banyak gambar dengan konkurensi kecil (serverless-friendly). */
export async function fetchAllImages(
  urls: string[],
  maxWidth: number,
  limit = 30,
  quality = 74,
): Promise<ImageAsset[]> {
  const unik = [...new Set(urls)].slice(0, limit)
  const hasil: ImageAsset[] = []
  const batchSize = 4
  for (let i = 0; i < unik.length; i += batchSize) {
    const batch = unik.slice(i, i + batchSize)
    const settled = await Promise.all(batch.map((u) => fetchImage(u, maxWidth, quality)))
    for (const img of settled) {
      if (img) hasil.push(img)
    }
  }
  return hasil
}

/** Nama file aman dari judul artikel. */
export function slugify(s: string): string {
  const slug = s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return slug || 'artikel'
}

export type ExportBody = {
  title?: string
  images?: string[]
  paragraphs?: string[]
  contentHtml?: string
  sourceUrl?: string
}

/** Kunci dedupe gambar (path tanpa query; og-generator/optimizer diikuti gambar asalnya). */
export function imgKeyPath(src: string): string {
  try {
    const u = new URL(src)
    for (const p of ['src', 'url', 'image']) {
      const q = u.searchParams.get(p)
      if (q && (q.startsWith('/') || /^https?:/i.test(q))) {
        try {
          return new URL(q, u).origin + new URL(q, u).pathname
        } catch {
          /* lanjut */
        }
      }
    }
    return u.origin + u.pathname
  } catch {
    return src
  }
}

export type ContentItem =
  | { type: 'h'; text: string }
  | { type: 'p'; text: string }
  | { type: 'img'; src: string }

function bersihkanTeks(t: string | null | undefined): string {
  return (t || '').replace(/\s+/g, ' ').trim()
}

/**
 * Parse contentHtml artikel bersih → urutan item alami:
 * subjudul, paragraf, gambar (tepat di posisinya, bukan semua gambar di akhir).
 */
export function parseContentHtml(contentHtml: string, judulUtama: string): ContentItem[] {
  if (!contentHtml.trim()) return []
  const dom = new JSDOM(`<body><div id="root">${contentHtml}</div></body>`)
  const root = dom.window.document.getElementById('root')
  if (!root) return []

  const items: ContentItem[] = []

  function pushImgsDalam(el: Element) {
    el.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src')
      if (src && /^https?:\/\//i.test(src)) items.push({ type: 'img', src })
    })
  }

  function prosesBlock(el: Element) {
    // punya sub-block → telusuri isi, jangan ambil textContent gabungan
    const adaSubBlock = el.querySelector(
      'p, div, ul, ol, li, blockquote, figure, h1, h2, h3, h4, h5, h6, table',
    )
    if (adaSubBlock) {
      el.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
          const t = bersihkanTeks(node.textContent)
          if (t) items.push({ type: 'p', text: t })
          return
        }
        if (node.nodeType !== 1) return
        const e = node as Element
        if (e.tagName === 'IMG') {
          const src = e.getAttribute('src')
          if (src && /^https?:\/\//i.test(src)) items.push({ type: 'img', src })
        } else if (/^H[2-6]$/.test(e.tagName)) {
          const t = bersihkanTeks(e.textContent)
          if (t) items.push({ type: 'h', text: t })
          pushImgsDalam(e)
        } else if (e.tagName === 'H1') {
          const t = bersihkanTeks(e.textContent)
          if (t && t !== bersihkanTeks(judulUtama)) items.push({ type: 'h', text: t })
        } else {
          prosesBlock(e)
        }
      })
      return
    }

    // leaf block: teks utuh + gambar di dalamnya
    const tag = el.tagName
    const t = bersihkanTeks(el.textContent)
    if (tag === 'UL' || tag === 'OL') {
      el.querySelectorAll(':scope > li').forEach((li) => {
        const lt = bersihkanTeks(li.textContent)
        if (lt) items.push({ type: 'p', text: `• ${lt}` })
        pushImgsDalam(li)
      })
      return
    }
    if (t && (tag === 'H2' || tag === 'H3' || tag === 'H4' || tag === 'H5' || tag === 'H6')) {
      items.push({ type: 'h', text: t })
    } else if (t) {
      items.push({ type: 'p', text: t })
    }
    pushImgsDalam(el)
  }

  // telusuri anak root: img polos, elemen block, dan teks lepas
  root.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      const e = node as Element
      if (e.tagName === 'IMG') {
        const src = e.getAttribute('src')
        if (src && /^https?:\/\//i.test(src)) items.push({ type: 'img', src })
        return
      }
      prosesBlock(e)
      return
    }
    if (node.nodeType === 3) {
      const t = bersihkanTeks(node.textContent)
      if (t) items.push({ type: 'p', text: t })
    }
  })

  // buang p kosong beruntun & batasi
  return items.slice(0, 600)
}
