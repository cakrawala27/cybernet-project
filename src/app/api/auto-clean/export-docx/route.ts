import { NextRequest, NextResponse } from 'next/server'
import { fetchAllImages, slugify, type ExportBody } from '@/lib/export-images'

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
    const sourceUrl = (body.sourceUrl || '').trim()

    // 1. Sedot gambar → JPEG base64 (data URI) supaya DOCX tetap utuh saat di-share,
    //    tanpa bergantung hotlink situs asal.
    const assets = await fetchAllImages(images, DOCX_IMG_W, 30, 74)

    // 2. Rakit HTML bersih: Judul (ukuran H1 besar) + teks opsional + semua gambar
    const parts: string[] = []
    parts.push(
      `<h1 style="font-size: 32px; font-weight: bold; line-height: 1.3; margin: 0 0 16px 0;">${escapeHtml(title)}</h1>`,
    )
    if (sourceUrl) {
      parts.push(
        `<p style="font-size: 9pt; color: #888888; margin: 0 0 24px 0;">Sumber: ${escapeHtml(sourceUrl)}</p>`,
      )
    }
    if (paragraphs.length > 0) {
      for (const p of paragraphs) {
        parts.push(`<p style="font-size: 11pt; line-height: 1.5; margin: 0 0 12px 0;">${escapeHtml(p)}</p>`)
      }
    }
    for (const img of assets) {
      const dataUri = `data:image/jpeg;base64,${img.buffer.toString('base64')}`
      parts.push(`<img src="${dataUri}" alt="Gambar artikel" />`)
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head><body>${parts.join('\n')}</body></html>`

    // 3. HTML → DOCX
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
