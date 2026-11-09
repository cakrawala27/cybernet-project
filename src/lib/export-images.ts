import sharp from 'sharp'

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
  sourceUrl?: string
}
