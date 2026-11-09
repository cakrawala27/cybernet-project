import { NextRequest, NextResponse } from 'next/server'
import {
  fetchAllImages,
  parseContentHtml,
  imgKeyPath,
  slugify,
  type ExportBody,
  type ImageAsset,
} from '@/lib/export-images'

export const runtime = 'nodejs'
export const maxDuration = 60

/** Lebar maks gambar di Word A4 (margin 1 in → area teks ±602 px @96dpi). */
const DOCX_IMG_W = 600

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExportBody
    const title = (body.title || 'Artikel').trim().slice(0, 300)
    const images = (body.images || []).filter((s) => /^https?:\/\//i.test(s)).slice(0, 30)
    const paragraphs = (body.paragraphs || []).slice(0, 300)
    const contentHtml = (body.contentHtml || '').slice(0, 400_000)
    const sourceUrl = (body.sourceUrl || '').trim()

    // 1. Artikel bersih → urutan item alami (subjudul / paragraf / gambar urut asli)
    const items = parseContentHtml(contentHtml, title)

    // 2. URL gambar yang di-embed — BIAR RAPI:
    //    - artikel terstruktur: HANYA gambar di dalam isi artikel + gambar utama
    //      kalau belum muncul di isi (ditaruh di bawah judul)
    //    - mode ringkas/fallback: daftar gambar hasil scrape (tanpa teks)
    const structured = items.length > 0
    const imgUrls: string[] = []
    const pushUrl = (u: string) => {
      if (!imgUrls.some((x) => imgKeyPath(x) === imgKeyPath(u))) imgUrls.push(u)
    }
    for (const it of items) if (it.type === 'img') pushUrl(it.src)
    if (images[0]) pushUrl(images[0])
    if (!structured) for (const u of images) pushUrl(u)

    // 3. Sedot gambar → JPEG base64 (data URI) supaya DOCX tetap utuh saat di-share
    const assets = await fetchAllImages(imgUrls, DOCX_IMG_W, structured ? 20 : 30, 74)
    const byKey = new Map<string, ImageAsset>()
    for (const a of assets) byKey.set(imgKeyPath(a.url), a)
    const pakaiAsset = (src: string): ImageAsset | null => byKey.get(imgKeyPath(src)) || null

    // 4. Rakit HTML: judul besar + gambar utama + isi artikel urut asli + sisa gambar
    const parts: string[] = []
    parts.push(
      `<h1 style="font-size: 32px; font-weight: bold; line-height: 1.3; margin: 0 0 16px 0;">${escapeHtml(title)}</h1>`,
    )
    if (sourceUrl) {
      parts.push(
        `<p style="font-size: 9pt; color: #888888; margin: 0 0 20px 0;">Sumber: ${escapeHtml(sourceUrl)}</p>`,
      )
    }

    const terpakai = new Set<string>()
    const imgHtml = (src: string): string | null => {
      const asset = pakaiAsset(src)
      if (!asset || terpakai.has(imgKeyPath(asset.url))) return null
      terpakai.add(imgKeyPath(asset.url))
      return `<img src="data:image/jpeg;base64,${asset.buffer.toString('base64')}" alt="Gambar artikel" />`
    }

    // gambar utama tepat di bawah judul — hanya kalau belum ada di isi artikel
    if (images[0]) {
      const mainKey = imgKeyPath(images[0])
      const sudahDiisi = items.some(
        (it) => it.type === 'img' && imgKeyPath(it.src) === mainKey,
      )
      if (!sudahDiisi) {
        const html = imgHtml(images[0])
        if (html) parts.push(html)
      }
    }

    // isi artikel mengikuti urutan asli; sisa gambar TIDAK ditambahkan
    for (const it of items) {
      if (it.type === 'h') {
        parts.push(
          `<h2 style="font-size: 15pt; font-weight: bold; margin: 18px 0 8px 0;">${escapeHtml(it.text)}</h2>`,
        )
      } else if (it.type === 'p') {
        parts.push(
          `<p style="font-size: 11pt; line-height: 1.5; margin: 0 0 12px 0;">${escapeHtml(it.text)}</p>`,
        )
      } else {
        const html = imgHtml(it.src)
        if (html) parts.push(html)
      }
    }

    // fallback (konten tak terstruktur / mode ringkas): teks dulu, lalu gambar
    if (!structured && paragraphs.length > 0) {
      for (const p of paragraphs) {
        parts.push(
          `<p style="font-size: 11pt; line-height: 1.5; margin: 0 0 12px 0;">${escapeHtml(p)}</p>`,
        )
      }
    }
    if (!structured) {
      for (const u of images) {
        const html = imgHtml(u)
        if (html) parts.push(html)
      }
    }

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head><body>${parts.join('\n')}</body></html>`

    // 5. HTML → DOCX
    const { default: HTMLtoDOCX } = await import('html-to-docx')
    const docxBuf = await HTMLtoDOCX(html, null, {
      title,
      description: `Artikel bersih dari ${sourceUrl || 'sumber'}`,
      creator: 'Cybernet Auto Clean',
      lastModifiedBy: 'Cybernet Auto Clean',
      footer: true,
      pageNumber: true,
    })

    const buf = Buffer.from(docxBuf as ArrayBuffer | Uint8Array | Buffer)
    const fname = `${slugify(title)}.docx`
    return new NextResponse(new Uint8Array(buf) as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fname}"; filename*=UTF-8''${encodeURIComponent(fname)}`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    const err = e as { message?: string }
    return NextResponse.json(
      { error: `Gagal membuat DOCX: ${err.message || 'unknown'}` },
      { status: 500 },
    )
  }
}
