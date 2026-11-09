import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

type CleanResultLike = Record<string, unknown> & { error?: string }

export async function POST(req: NextRequest) {
  try {
    // dynamic import: kalau jsdom gagal di-load, error masuk catch dan
    // dikembalikan sebagai JSON (bukan halaman error rahasia)
    const { cleanArticle, cleanFromUrl } = await import('@/lib/auto-clean')

    const body = (await req.json()) as { url?: string; html?: string }
    const url = (body.url || '').trim()
    const html = (body.html || '').trim()

    if (!url && !html) {
      return NextResponse.json(
        { error: 'Masukkan URL artikel atau tempel HTML-nya.' },
        { status: 400 },
      )
    }

    let result: CleanResultLike
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        return NextResponse.json(
          { error: 'URL harus diawali http:// atau https://' },
          { status: 400 },
        )
      }
      result = await cleanFromUrl(url)
    } else {
      result = cleanArticle({ html })
    }

    return NextResponse.json(result, { status: result.error ? 422 : 200 })
  } catch (e) {
    const err = e as { message?: string; stack?: string }
    return NextResponse.json(
      {
        error: `Gagal memproses: ${err.message || 'unknown'}`,
        hint: err.stack?.split('\n').slice(0, 4).join(' | ') || '',
      },
      { status: 500 },
    )
  }
}
