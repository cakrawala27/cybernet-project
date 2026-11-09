import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

export type CleanedImage = { src: string; alt: string }

export type CleanResult = {
  title: string
  mainImage: string | null
  images: CleanedImage[]
  /** HTML: judul (H1 berukuran) + semua gambar saja (tanpa teks). */
  htmlImages: string
  /** HTML lengkap: judul (H1 berukuran) + artikel utuh bersih (teks + gambar urut asli). */
  htmlFull: string
  contentHtml: string
  /** Paragraf teks bersih (fallback untuk export PDF/DOCX). */
  textParagraphs: string[]
  sourceUrl?: string
}

export type CleanError = { error: string }

/**
 * Selector elemen sampah — dihapus SEBELUM Readability bekerja
 * supaya thumbnail artikel lain/iklan tidak ikut terbawa.
 */
const JUNK_SELECTORS = [
  'script',
  'style',
  'noscript',
  'nav',
  'header',
  'footer',
  'aside',
  'form',
  'iframe',
  '.ad-container',
  '.ads-box',
  '.advertisement',
  '.sponsor-content',
  '.share-buttons',
  '.social-share',
  '.article-share',
  '.sharedaddy',
  '.related-posts',
  '.pos-terkait',
  '.related-articles',
  '.read-more',
  '.post-navigation',
  '.newsletter-signup',
  '.subscribe-box',
  '.comments-section',
  '#comments',
  '#disqus_thread',
  '.sidebar',
  '.nav-menu',
  '.header-wrapper',
  '.site-header',
  '.site-footer',
  '.logo',
  '.site-logo',
  '.custom-logo',
  '.header-logo',
  '.brand-logo',
  'img[alt*="logo" i]',
  'img[src*="logo" i]',
  '[id*="google_ads"]',
  '[class*="banner-ads"]',
  '.wp-block-query',
  '.td-related-box',
  '.jetpack-related-posts',
  '.yarpp-related',
]

/** Pola URL/alt yang jelas bukan gambar konten. */
const IMG_JUNK_RE =
  /(logo|sprite|icon|emoji|avatar|blank|placeholder|spacer|pixel|tracking|ads?[-_.]|advert|sponsor|iklan|doubleclick|googletagmanager|analytics|1x1|gravatar)/i

function resolveUrl(src: string | null | undefined, base?: string): string | null {
  if (!src) return null
  const s = src.trim()
  if (!s || s.startsWith('data:')) return null
  try {
    return new URL(s, base && base.length > 0 ? base : undefined).href
  } catch {
    return null
  }
}

function isJunkImage(src: string, alt: string): boolean {
  return IMG_JUNK_RE.test(src) || (alt.length > 0 && IMG_JUNK_RE.test(alt))
}

/** Kunci dedupe gambar: buang query, dan untuk og-generator/optimizer ikuti gambar asalnya. */
function imgKey(src: string, base?: string): string {
  try {
    const u = new URL(src, base)
    // og dynamic image / next optimizer: gambar asal ada di query (src|url|image)
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
    return src.split('#')[0]
  }
}

/** og-generator = gambar overlay judul (mis. /api/og?src=...) — bukan foto artikel asli. */
function isOgWrapper(src: string, base?: string): boolean {
  try {
    const u = new URL(src, base)
    return /(api\/og|og-image|ogimage|\/og\?)/i.test(u.pathname + u.search)
  } catch {
    return false
  }
}

function imgSizeAttr(img: Element): number {
  const w = Number.parseInt(img.getAttribute('width') || '0', 10) || 0
  const h = Number.parseInt(img.getAttribute('height') || '0', 10) || 0
  return Math.max(w, h)
}

/** Kumpulkan gambar konten dari sebuah dokumen DOM. */
function collectImages(doc: Document, base?: string): CleanedImage[] {
  const seen = new Set<string>()
  const out: CleanedImage[] = []
  doc.querySelectorAll('img').forEach((img) => {
    const raw =
      img.getAttribute('data-src') ||
      img.getAttribute('data-lazy-src') ||
      img.getAttribute('data-original') ||
      img.getAttribute('data-featured') ||
      img.getAttribute('src') ||
      ''
    const src = resolveUrl(raw, base)
    if (!src) return
    const alt = (img.getAttribute('alt') || '').trim()
    if (isJunkImage(src, alt)) return
    // gambar kecil eksplisit (ikon/emoji) — buang
    const size = imgSizeAttr(img)
    if (size > 0 && size < 80) return
    const key = imgKey(src, base)
    if (seen.has(key)) return
    seen.add(key)
    out.push({ src, alt })
  })
  return out
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Bersihkan artikel: sisakan Judul + semua gambar (utama & dalam artikel).
 * contentHtml tetap disertakan (artikel utuh hasil Readability) untuk opsi
 * "sertakan teks" di sisi UI.
 */
export function cleanArticle(input: {
  url?: string
  html?: string
}): CleanResult | CleanError {
  const baseUrl = input.url
  const rawHtml = input.html

  if (!rawHtml) return { error: 'HTML artikel kosong.' }

  // 1. Muat HTML mentah
  const dom = new JSDOM(rawHtml, { url: baseUrl })
  const doc = dom.window.document

  // 2. Ambil og:image sebagai kandidat gambar utama (sebelum dibersihkan)
  const ogImage = resolveUrl(
    doc
      .querySelector('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"]')
      ?.getAttribute('content'),
    baseUrl,
  )

  // 3. PRECISION CLEAN: hapus semua elemen sampah sebelum Readability
  for (const selector of JUNK_SELECTORS) {
    try {
      doc.querySelectorAll(selector).forEach((el) => el.remove())
    } catch {
      // selector tidak valid di jsdom — abaikan
    }
  }

  // 4. Snapshot gambar dari DOM awal (fallback kalau Readability telan gambar)
  const preCleanImages = collectImages(doc, baseUrl)

  // 5. Readability
  const reader = new Readability(doc.cloneNode(true) as Document)
  const article = reader.parse()
  if (!article || !article.content) {
    return { error: 'Konten utama tidak ditemukan di halaman ini.' }
  }

  // 6. Perbaiki gambar di dalam konten hasil Readability
  const contentDom = new JSDOM(article.content, { url: baseUrl })
  const contentDoc = contentDom.window.document

  contentDoc.querySelectorAll('img').forEach((img) => {
    const raw =
      img.getAttribute('data-src') ||
      img.getAttribute('data-lazy-src') ||
      img.getAttribute('data-original') ||
      img.getAttribute('src') ||
      ''
    const src = resolveUrl(raw, baseUrl)
    if (!src || isJunkImage(src, (img.getAttribute('alt') || '').trim())) {
      img.remove()
      return
    }
    img.setAttribute('src', src)
    img.removeAttribute('srcset')
    img.removeAttribute('sizes')
    img.removeAttribute('loading')
    img.setAttribute('style', 'max-width:100%;height:auto;')
  })

  // hapus tag kosong
  contentDoc.querySelectorAll('p, div, span, figure, figcaption').forEach((el) => {
    if (!el.textContent?.trim() && !el.querySelector('img')) el.remove()
  })

  // 7. Gabungkan gambar konten + fallback DOM awal (dedupe cerdas: og-overlay vs foto asli)
  const merged: CleanedImage[] = []
  const keyIdx = new Map<string, number>()
  for (const img of [...collectImages(contentDom.window.document, baseUrl), ...preCleanImages]) {
    const key = imgKey(img.src, baseUrl)
    const ogWrap = isOgWrapper(img.src, baseUrl)
    const idx = keyIdx.get(key)
    if (idx === undefined) {
      keyIdx.set(key, merged.length)
      merged.push(img)
      continue
    }
    // sudah ada: og-overlay kalah dari foto asli
    if (ogWrap && !isOgWrapper(merged[idx].src, baseUrl)) continue
    if (!ogWrap && isOgWrapper(merged[idx].src, baseUrl)) merged[idx] = img
  }

  // 8. Tentukan gambar utama: lead image Readability → og:image → gambar pertama.
  //    Kalau kandidatnya og-overlay tapi ada foto asli, pakai foto asli.
  const leadImage = resolveUrl(article.lead_image_url, baseUrl)
  const kandidat = [leadImage, ogImage, merged[0]?.src || null].filter(Boolean) as string[]
  let mainImage = kandidat[0] || null
  if (mainImage && isOgWrapper(mainImage, baseUrl)) {
    const asli = merged.find((i) => !isOgWrapper(i.src, baseUrl))
    if (asli) mainImage = asli.src
  }
  if (mainImage) {
    const idx = merged.findIndex((i) => i.src === mainImage)
    if (idx > 0) merged.splice(idx, 1)
    if (idx !== 0) merged.unshift({ src: mainImage, alt: 'Gambar utama artikel' })
  }

  // 9. Paragraf teks bersih (opsional: disertakan di PDF/DOCX kalau user aktifkan)
  const textParagraphs = Array.from(contentDoc.querySelectorAll('p'))
    .map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 1)
    .slice(0, 300)

  // 10. Hasil: judul DENGAN UKURAN (inline style → terbawa saat ditempel ke editor/Word)
  const title = (article.title || '').trim() || 'Tanpa Judul'
  const judulHtml = `<h1 style="font-size:32px;line-height:1.3;font-weight:700;margin:0 0 20px 0;">${escapeHtml(title)}</h1>`
  const imgsHtml = merged
    .map(
      (i) =>
        `<img src="${i.src}" alt="${escapeHtml(i.alt || 'Gambar artikel')}" style="max-width:100%;height:auto;display:block;margin:16px auto;" />`,
    )
    .join('\n')
  const htmlImages = `${judulHtml}\n${imgsHtml}`

  // 11. Artikel utuh (teks + gambar urut asli) — default hasil bersih
  const contentHtml = contentDoc.body.innerHTML.trim()
  const htmlFull = `${judulHtml}\n${contentHtml}`

  return {
    title,
    mainImage,
    images: merged.slice(0, 40),
    htmlImages,
    htmlFull,
    contentHtml,
    textParagraphs,
    sourceUrl: baseUrl,
  }
}

/** Sedot halaman dari URL lalu bersihkan (dengan retry utk situs yang flaky). */
export async function cleanFromUrl(url: string): Promise<CleanResult | CleanError> {
  const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
  const percobaanMaks = 3
  let errorTerakhir = ''

  for (let i = 1; i <= percobaanMaks; i++) {
    let res: Response
    try {
      res = await fetch(url, {
        headers: {
          'User-Agent': UA,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
      })
    } catch (e) {
      const cause =
        e instanceof Error && e.cause instanceof Error ? e.cause.message : ''
      errorTerakhir = cause || (e instanceof Error ? e.message : 'unknown')
      if (i < percobaanMaks) {
        await new Promise((r) => setTimeout(r, 700 * i))
        continue
      }
      return {
        error: `Gagal mengakses situs setelah ${percobaanMaks}x percobaan (${errorTerakhir}). Coba lagi atau tempel HTML manual.`,
      }
    }

    if (res.status === 403 || res.status === 429 || res.status >= 500) {
      errorTerakhir = `HTTP ${res.status}`
      if (i < percobaanMaks) {
        await new Promise((r) => setTimeout(r, 700 * i))
        continue
      }
      return {
        error: `Situs menolak permintaan (${errorTerakhir}) setelah ${percobaanMaks}x percobaan. Tempel HTML manual lewat mode "tempel HTML".`,
      }
    }

    if (!res.ok) {
      return { error: `Situs menjawab HTTP ${res.status}. Coba URL lain atau tempel HTML manual.` }
    }

    const html = await res.text()
    if (html.length > 5_000_000) {
      return { error: 'Halaman terlalu besar (>5 MB).' }
    }
    return cleanArticle({ url, html })
  }
  return { error: 'Gagal mengakses situs.' }
}
