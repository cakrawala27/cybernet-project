import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

export type CleanedImage = { src: string; alt: string }

export type CleanResult = {
  title: string
  mainImage: string | null
  images: CleanedImage[]
  htmlImages: string
  contentHtml: string
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
    const key = src.split('#')[0]
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

  // 7. Gabungkan gambar konten + fallback DOM awal (dedupe, urut sesuai dokumen)
  const merged: CleanedImage[] = []
  const seen = new Set<string>()
  for (const img of [...collectImages(contentDom.window.document, baseUrl), ...preCleanImages]) {
    const key = img.src.split('#')[0]
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(img)
  }

  // 8. Tentukan gambar utama: lead image Readability → og:image → gambar pertama
  const leadImage = resolveUrl(article.lead_image_url, baseUrl)
  const mainImage = leadImage || ogImage || merged[0]?.src || null
  if (mainImage) {
    const idx = merged.findIndex((i) => i.src === mainImage)
    if (idx > 0) merged.splice(idx, 1)
    if (idx !== 0) merged.unshift({ src: mainImage, alt: 'Gambar utama artikel' })
  }

  // 9. Hasil: judul + semua gambar (tanpa teks)
  const title = (article.title || '').trim() || 'Tanpa Judul'
  const imgsHtml = merged
    .map((i) => `<img src="${i.src}" alt="${escapeHtml(i.alt || 'Gambar artikel')}" />`)
    .join('\n')
  const htmlImages = `<h1>${escapeHtml(title)}</h1>\n${imgsHtml}`

  // 10. Artikel utuh (teks + gambar) — opsional di UI
  const contentHtml = contentDoc.body.innerHTML.trim()

  return {
    title,
    mainImage,
    images: merged.slice(0, 40),
    htmlImages,
    contentHtml,
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
