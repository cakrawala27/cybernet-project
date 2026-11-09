import { NextRequest, NextResponse } from 'next/server'
import { cleanArticle, cleanFromUrl } from '@/lib/auto-clean'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { url?: string; html?: string }
    const url = (body.url || '').trim()
    const html = (body.html || '').trim()

    if (!url && !html) {
      return NextResponse.json(
        { error: 'Masukkan URL artikel atau tempel HTML-nya.' },
        { status: 400 },
      )
    }

    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        return NextResponse.json(
          { error: 'URL harus diawali http:// atau https://' },
          { status: 400 },
        )
      }
      const result = await cleanFromUrl(url)
      return NextResponse.json(result, { status: 'error' in result ? 422 : 200 })
    }

    const result = cleanArticle({ html })
    return NextResponse.json(result, { status: 'error' in result ? 422 : 200 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json(
      { error: `Gagal memproses (${msg}). Coba tempel HTML manual.` },
      { status: 500 },
    )
  }
}
