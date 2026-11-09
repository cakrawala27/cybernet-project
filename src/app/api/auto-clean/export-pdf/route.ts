import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { fetchAllImages, slugify, type ExportBody } from '@/lib/export-images'

export const runtime = 'nodejs'
export const maxDuration = 60

// A4 dalam point
const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 48
const CONTENT_W = PAGE_W - MARGIN * 2

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExportBody
    const title = (body.title || 'Artikel').trim().slice(0, 300)
    const images = (body.images || []).filter((s) => /^https?:\/\//i.test(s)).slice(0, 30)
    const paragraphs = (body.paragraphs || []).slice(0, 300)
    const sourceUrl = (body.sourceUrl || '').trim()

    // 1. Sedot semua gambar server-side (gambar di-embed → PDF tetap utuh saat di-share)
    const assets = await fetchAllImages(images, 1200, 30, 72)

    // 2. Susun PDF A4
    const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })

    let y = MARGIN

    // — Judul BESAR (dengan ukuran, sesuai kebutuhan)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.setTextColor(20, 20, 20)
    const titleLines: string[] = doc.splitTextToSize(title, CONTENT_W)
    for (const line of titleLines) {
      if (y + 30 > PAGE_H - MARGIN) {
        doc.addPage()
        y = MARGIN
      }
      doc.text(line, MARGIN, y + 22)
      y += 30
    }
    y += 4

    // — Sumber artikel (kecil, abu-abu)
    if (sourceUrl) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      const srcLines: string[] = doc.splitTextToSize(`Sumber: ${sourceUrl}`, CONTENT_W)
      for (const line of srcLines) {
        doc.text(line, MARGIN, y + 9)
        y += 11
      }
    }
    y += 10

    // — Paragraf teks (hanya kalau user aktifkan "sertakan teks artikel")
    if (paragraphs.length > 0) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(40, 40, 40)
      for (const para of paragraphs) {
        const lines: string[] = doc.splitTextToSize(para, CONTENT_W)
        const tinggiParagraf = lines.length * 15
        if (y + tinggiParagraf > PAGE_H - MARGIN) {
          doc.addPage()
          y = MARGIN
        }
        for (const line of lines) {
          doc.text(line, MARGIN, y + 11)
          y += 15
        }
        y += 8
      }
    }

    // — Semua gambar: utama dulu, lalu gambar dalam artikel (urut dokumen)
    for (const img of assets) {
      const maxH = PAGE_H - MARGIN * 2
      const scale = Math.min(CONTENT_W / img.width, maxH / img.height)
      const drawW = img.width * scale
      const drawH = img.height * scale
      if (y + drawH + 16 > PAGE_H - MARGIN) {
        doc.addPage()
        y = MARGIN
      }
      const x = MARGIN + (CONTENT_W - drawW) / 2
      doc.addImage(
        new Uint8Array(img.buffer),
        'JPEG',
        x,
        y,
        drawW,
        drawH,
        img.url.slice(-60),
        'FAST',
      )
      y += drawH + 16
    }

    // — Footer tiap halaman
    const total = doc.getNumberOfPages()
    for (let p = 1; p <= total; p++) {
      doc.setPage(p)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Dibuat dengan Cybernet Auto Clean · hal. ${p}/${total}`,
        PAGE_W / 2,
        PAGE_H - 18,
        { align: 'center' },
      )
    }

    // 3. Kirim file
    const bytes = new Uint8Array(doc.output('arraybuffer'))
    const fname = `${slugify(title)}.pdf`
    return new NextResponse(bytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fname}"; filename*=UTF-8''${encodeURIComponent(fname)}`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    const err = e as { message?: string }
    return NextResponse.json(
      { error: `Gagal membuat PDF: ${err.message || 'unknown'}` },
      { status: 500 },
    )
  }
}
