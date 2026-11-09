'use client'

import { useState } from 'react'
import {
  Check,
  Copy,
  FileText,
  Link2,
  Loader2,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import type { CleanResult } from '@/lib/auto-clean'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // fallback untuk browser lama / konteks non-secure
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

export function AutoClean() {
  const { toast } = useToast()
  const [url, setUrl] = useState('')
  const [pasteMode, setPasteMode] = useState(false)
  const [html, setHtml] = useState('')
  const [includeText, setIncludeText] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CleanResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const salin = async (key: string, text: string) => {
    const ok = await copyText(text)
    if (ok) {
      setCopied(key)
      toast({ title: 'Tersalin! ✅', description: 'Tinggal tempel di tujuan.' })
      setTimeout(() => setCopied(null), 2000)
    } else {
      toast({ title: 'Gagal menyalin ❌', description: 'Salin manual dari kotak teks ya.' })
    }
  }

  const proses = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = pasteMode ? { html } : { url }
      const res = await fetch('/api/auto-clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as CleanResult & { error?: string }
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const semuaImg = result ? result.images.map((i) => `[IMG]${i.src}[/IMG]`).join('\n') : ''

  return (
    <section
      id="auto-clean"
      className="scroll-mt-24 border-y border-zinc-800/60 bg-zinc-900/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-orange-400">
            <Sparkles className="size-4" /> Auto Clean
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Bersihkan Artikel dari Link
          </h2>
          <p className="mt-4 text-zinc-400">
            Tempel link artikel dari situs lain — otomatis diambil yang bersih:{' '}
            <span className="font-medium text-zinc-200">judul + semua gambar</span>{' '}
            (gambar utama &amp; gambar di dalam artikel), tanpa iklan, menu, dan
            elemen sampah.
          </p>
        </div>

        {/* form */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
          {!pasteMode ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && url.trim()) proses()
                  }}
                  placeholder="https://situs.com/artikel-yang-mau-dibersihkan"
                  aria-label="URL artikel sumber"
                  className="border-zinc-700 bg-zinc-950 pl-9 text-zinc-100 placeholder:text-zinc-600"
                />
              </div>
              <Button
                onClick={proses}
                disabled={loading || (!pasteMode && !url.trim()) || (pasteMode && !html.trim())}
                className="bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Memproses…
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" /> Bersihkan
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="Tempel HTML mentah artikel di sini (view-source → copy semua)…"
                aria-label="HTML mentah artikel"
                rows={6}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              />
              <Button
                onClick={proses}
                disabled={loading || !html.trim()}
                className="w-full bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400 sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Memproses…
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" /> Bersihkan HTML
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPasteMode((v) => !v)}
              className="text-xs text-zinc-500 underline-offset-4 hover:text-orange-400 hover:underline"
            >
              {pasteMode ? '← pakai link URL saja' : 'situsnya diblokir? tempel HTML manual →'}
            </button>
            <div className="flex items-center gap-2">
              <Switch id="sertakan-teks" checked={includeText} onCheckedChange={setIncludeText} />
              <Label htmlFor="sertakan-teks" className="cursor-pointer text-xs text-zinc-400">
                <FileText className="mr-1 inline size-3.5" />
                Sertakan teks artikel
              </Label>
            </div>
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            <p className="font-semibold">Gagal memproses</p>
            <p className="mt-1 text-red-300/90">{error}</p>
          </div>
        )}

        {/* hasil */}
        {result && (
          <div className="mx-auto mt-8 max-w-3xl space-y-6">
            {/* judul */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Judul Artikel
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-zinc-100">
                    {result.title}
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => salin('judul', result.title)}
                  className="shrink-0 border-zinc-700 text-zinc-300 hover:text-orange-400"
                >
                  {copied === 'judul' ? <Check className="size-4" /> : <Copy className="size-4" />}
                  Salin
                </Button>
              </div>
            </div>

            {/* tombol salin massal */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => salin('html-img', result.htmlImages)}
                className="flex-1 bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400"
              >
                {copied === 'html-img' ? <Check className="size-4" /> : <Copy className="size-4" />}
                Salin HTML (Judul + {result.images.length} gambar)
              </Button>
              <Button
                onClick={() => salin('semua-img', semuaImg)}
                variant="outline"
                className="flex-1 border-zinc-700 font-semibold text-zinc-200 hover:text-orange-400"
              >
                {copied === 'semua-img' ? <Check className="size-4" /> : <Copy className="size-4" />}
                Salin Semua [IMG]
              </Button>
            </div>

            {/* gambar utama */}
            {result.mainImage && (
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
                <p className="border-b border-zinc-800 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-orange-400">
                  🖼️ Gambar Utama
                </p>
                <img
                  src={result.mainImage}
                  alt="Gambar utama artikel"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="max-h-96 w-full object-contain bg-zinc-950"
                />
                <div className="flex gap-2 px-5 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => salin('main-img', `[IMG]${result.mainImage}[/IMG]`)}
                    className="border-zinc-700 text-xs text-zinc-300 hover:text-orange-400"
                  >
                    {copied === 'main-img' ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    Salin [IMG]
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => salin('main-url', result.mainImage || '')}
                    className="border-zinc-700 text-xs text-zinc-300 hover:text-orange-400"
                  >
                    {copied === 'main-url' ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    Salin URL
                  </Button>
                </div>
              </div>
            )}

            {/* gambar dalam artikel */}
            {result.images.length > 1 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  📷 Gambar Dalam Artikel ({result.images.length - 1})
                </p>
                <div className="mt-4 max-h-[32rem] overflow-y-auto pr-1">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {result.images.slice(1).map((img, idx) => (
                      <figure
                        key={img.src}
                        className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
                      >
                        <img
                          src={img.src}
                          alt={img.alt || `Gambar ${idx + 2}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-40 w-full object-cover object-top"
                        />
                        <figcaption className="flex gap-2 p-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => salin(`img-${idx}`, `[IMG]${img.src}[/IMG]`)}
                            className="h-7 flex-1 border-zinc-700 text-[11px] text-zinc-300 hover:text-orange-400"
                          >
                            {copied === `img-${idx}` ? (
                              <Check className="size-3" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                            [IMG]
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => salin(`url-${idx}`, img.src)}
                            className="h-7 flex-1 border-zinc-700 text-[11px] text-zinc-300 hover:text-orange-400"
                          >
                            {copied === `url-${idx}` ? (
                              <Check className="size-3" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                            URL
                          </Button>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-zinc-600">
                  Catatan: kalau ada gambar yang tampil rusak, situs asalnya memblokir
                  tampilan dari luar (hotlink) — URL-nya tetap valid untuk disalin.
                </p>
              </div>
            )}

            {/* daftar [IMG] siap tempel */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Format [IMG] — siap tempel ke editor
              </p>
              <pre className="mt-3 max-h-48 overflow-y-auto whitespace-pre-wrap break-all rounded-lg bg-zinc-950 p-3 font-mono text-[11px] leading-relaxed text-zinc-400">
                {semuaImg}
              </pre>
            </div>

            {/* teks artikel opsional */}
            {includeText && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    📄 Teks Artikel (HTML bersih)
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => salin('teks', result.contentHtml)}
                    className="border-zinc-700 text-xs text-zinc-300 hover:text-orange-400"
                  >
                    {copied === 'teks' ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    Salin HTML
                  </Button>
                </div>
                <div
                  className="prose prose-sm prose-invert mt-4 max-h-96 max-w-none overflow-y-auto text-sm leading-relaxed text-zinc-300 [&_img]:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: result.contentHtml }}
                />
              </div>
            )}

            {result.sourceUrl && (
              <p className="text-center text-[11px] text-zinc-600">
                Sumber: {result.sourceUrl}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
