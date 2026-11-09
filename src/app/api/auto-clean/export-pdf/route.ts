import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
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

// A4 dalam point
const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 48
const CONTENT_W = PAGE_W - MARGIN * 2

type RenderItem =
  | { type: 'h'; text: string }
  | { type: 'p'; text: string }
  | { type: 'img'; asset: ImageAsset }

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExportBody
    const title = (body.title || 'Artikel').trim().slice(0, 300)
    const images = (body.images || []).filter((s) => /^https?:\/\//i.test(s)).slice(0, 30)
    const paragraphs = (body.paragraphs || []).slice(0, 300)
    const contentHtml = (body.contentHtml || '').slice(0, 400_000)
    const sourceUrl = (body.sourceUrl || '').trim()

    // 1. Ubah artikel bersih → urutan item alami (subjudul / paragraf / gambar)
    const items = parseContentHtml(contentHtml, title)

    // 2. Kumpulkan semua URL gambar yang harus di-embed (utama + dalam artikel, dedupe)
    const imgUrls: string[] = []
    const pushUrl = (u: string) => {
      if (!imgUrls.some((x) => imgKeyPath(x) === imgKeyPath(u))) imgUrls.push(u)
    }
    for (const it of items) if (it.type === 'img') pushUrl(it.src)
    for (const u of images) pushUrl(u)

    // 3. Sedot semua gambar server-side → di-embed (PDF tetap utuh saat di-share)
    const assets = await fetchAllImages(imgUrls, 1200, 32, 72)
    const byKey = new Map<string, ImageAsset>()
    for (const a of assets) byKey.set(imgKeyPath(a.url), a)
    const pakaiAsset = (src: string): ImageAsset | null => byKey.get(imgKeyPath(src)) || null

    // 4. Susun urutan render: gambar utama dulu, lalu isi artikel, sisanya gambar belum terpakai
    const render: RenderItem[] = []
    const terpakai = new Set<string>()

    const mainAsset = images[0] ? pakaiAsset(images[0]) : null
    if (mainAsset) {
      render.push({ type: 'img', asset: mainAsset })
      terpakai.add(imgKeyPath(mainAsset.url))
    }

    const adaIsi = items.some((it) => it.type === 'h' || it.type === 'p')
    for (const it of items) {
      if (it.type === 'h') render.push({ type: 'h', text: it.text })
      else if (it.type === 'p') render.push({ type: 'p', text: it.text })
      else {
        const asset = pakaiAsset(it.src)
        if (asset && !terpakai.has(imgKeyPath(asset.url))) {
          render.push({ type: 'img', asset })
          terpakai.add(imgKeyPath(asset.url))
        }
      }
    }

    // fallback: konten tak terstruktur → paragraf polos
    if (!adaIsi && paragraphs.length > 0) {
      for (const p of paragraphs) render.push({ type: 'p', text: p })
    }

    // gambar yang belum terpakai (mis. gambar utama berbeda dari konten) → taruh di akhir
    for (const u of images) {
      const asset = pakaiAsset(u)
      if (asset && !terpakai.has(imgKeyPath(asset.url))) {
        render.push({ type: 'img', asset })
        terpakai.add(imgKeyPath(asset.url))
      }
    }

    // 5. Susun PDF A4
    const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
    let y = MARGIN

    const pastiMuat = (tinggi: number) => {
      if (y + tinggi > PAGE_H - MARGIN) {
        doc.addPage()
        y = MARGIN
      }
    }

    // — Judul BESAR (dengan ukuran)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.setTextColor(20, 20, 20)
    const titleLines: string[] = doc.splitTextToSize(title, CONTENT_W)
    for (const line of titleLines) {
      pastiMuat(30)
      doc.text(line, MARGIN, y + 22)
      y += 30
    }
    y += 4

    // — Sumber artikel
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
    y += 12

    // — Isi artikel (artikel lengkap: subjudul, paragraf, gambar urut asli)
    for (const item of render) {
      if (item.type === 'img') {
        const img = item.asset
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
      } else if (item.type === 'h') {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        doc.setTextColor(30, 30, 30)
        const lines: string[] = doc.splitTextToSize(item.text, CONTENT_W)
        pastiMuat(lines.length * 17 + 10)
        y += 8
        for (const line of lines) {
          doc.text(line, MARGIN, y + 12)
          y += 17
        }
        y += 4
      } else {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(11)
        doc.setTextColor(40, 40, 40)
        const lines: string[] = doc.splitTextToSize(item.text, CONTENT_W)
        const tinggi = lines.length * 15
        // paragraf yang melebihi satu halaman → pecah per baris dengan page-break aman
        pastiMuat(Math.min(tinggi, 120))
        for (const line of lines) {
          if (y + 15 > PAGE_H - MARGIN) {
            doc.addPage()
            y = MARGIN
          }
          doc.text(line, MARGIN, y + 11)
          y += 15
        }
        y += 8
      }
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

    // 6. Kirim file
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
