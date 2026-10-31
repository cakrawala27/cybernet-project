'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Github,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

const WA_NUMBER = '6281261926601'

const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  'Halo, saya ingin berkonsultasi mengenai pembuatan website',
)}`

/** Susun pesan brief project lalu kirim via WhatsApp. */
function buildWaBriefUrl(opts: {
  nama: string
  kontak: string
  jenis: string
  pesan: string
}) {
  const lines = [
    'Halo, saya ingin berkonsultasi mengenai project website.',
    '',
    `Nama / Brand: ${opts.nama}`,
    `Kontak: ${opts.kontak}`,
  ]
  if (opts.jenis) lines.push(`Jenis Project: ${opts.jenis}`)
  lines.push('', 'Kebutuhan:', opts.pesan)
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

const projectTypes = [
  'Landing Page',
  'Company Profile',
  'Toko Online',
  'Web App Custom',
  'Aplikasi Masjid',
  'Aplikasi Kantor',
  'Aplikasi Sekolah / Pembelajaran',
  'Lainnya',
]

export function Contact() {
  const { toast } = useToast()
  const [nama, setNama] = useState('')
  const [kontak, setKontak] = useState('')
  const [jenis, setJenis] = useState('')
  const [pesan, setPesan] = useState('')
  const [sending, setSending] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama.trim() || !kontak.trim() || !pesan.trim()) {
      toast({
        title: 'Lengkapi dulu ya',
        description: 'Nama, kontak, dan pesan wajib diisi.',
        variant: 'destructive',
      })
      return
    }
    setSending(true)

    // Buka WhatsApp dengan brief yang sudah terformat (tab baru)
    window.open(
      buildWaBriefUrl({ nama, kontak, jenis, pesan }),
      '_blank',
      'noopener,noreferrer',
    )

    setTimeout(() => {
      setSending(false)
      setNama('')
      setKontak('')
      setJenis('')
      setPesan('')
      toast({
        title: 'Brief Siap Terkirim!',
        description:
          'WhatsApp terbuka di tab baru dengan brief Anda — tinggal tekan kirim.',
      })
    }, 600)
  }

  const contactItems = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+62 812-6192-6601',
      href: WA_LINK,
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'Arena27project@gmail.com',
      href: 'mailto:Arena27project@gmail.com',
    },
    {
      icon: MapPin,
      label: 'Lokasi',
      value: 'Solok, Sumatera Barat (remote-friendly)',
      href: undefined,
    },
    {
      icon: Clock,
      label: 'Jam Aktif',
      value: 'Senin–Sabtu, 09.00–21.00 WIB',
      href: undefined,
    },
  ]

  const socials = [
    { icon: Globe, label: 'Website Arena27', href: 'https://arena27.my.id/' },
    { icon: Github, label: 'GitHub', href: 'https://github.com' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  ]

  return (
    <section
      id="kontak"
      className="scroll-mt-24 border-t border-zinc-800/60 bg-zinc-900/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Kontak
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Siap Mulai Project Anda?
          </h2>
          <p className="mt-4 text-zinc-400">
            Ceritakan kebutuhan Anda — konsultasi awal gratis, tanpa
            paksaan. Kami balas maksimal 24 jam.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* info kiri */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="space-y-4 lg:col-span-2"
          >
            {contactItems.map((c) => {
              const Wrapper = c.href ? 'a' : 'div'
              return (
                <Wrapper
                  key={c.label}
                  {...(c.href
                    ? {
                        href: c.href,
                        target: '_blank',
                        rel: 'noreferrer',
                      }
                    : {})}
                  className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-orange-500/40"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                    <c.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-500">{c.label}</p>
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {c.value}
                    </p>
                  </div>
                </Wrapper>
              )
            })}

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <p className="mb-3 text-xs text-zinc-500">Temukan saya di</p>
              <div className="flex gap-2">
                {socials.map((s) => (
                  <Button
                    key={s.label}
                    variant="outline"
                    size="icon"
                    asChild
                    aria-label={s.label}
                    className="size-10 border-zinc-700 bg-zinc-950 text-zinc-400 hover:bg-zinc-800 hover:text-orange-400"
                  >
                    <a href={s.href} target="_blank" rel="noreferrer">
                      <s.icon className="size-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* form kanan */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="border-zinc-800 bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="text-lg text-zinc-100">
                  Formulir Project Brief
                </CardTitle>
                <p className="text-sm text-zinc-500">
                  Isi singkat saja — brief Anda langsung terkirim ke WhatsApp
                  kami.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nama" className="text-zinc-300">
                        Nama / Nama Brand
                      </Label>
                      <Input
                        id="nama"
                        placeholder="cth: Warung Bu Sari"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="border-zinc-700 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-orange-500/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kontak" className="text-zinc-300">
                        WhatsApp / Email Aktif
                      </Label>
                      <Input
                        id="kontak"
                        placeholder="cth: 0812xxxx / nama@email.com"
                        value={kontak}
                        onChange={(e) => setKontak(e.target.value)}
                        className="border-zinc-700 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-orange-500/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jenis" className="text-zinc-300">
                      Jenis Project
                    </Label>
                    <Select value={jenis} onValueChange={setJenis}>
                      <SelectTrigger
                        id="jenis"
                        className="w-full border-zinc-700 bg-zinc-950/60 text-zinc-100"
                      >
                        <SelectValue placeholder="Pilih jenis project" />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                        {projectTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pesan" className="text-zinc-300">
                      Ceritakan Kebutuhan Anda
                    </Label>
                    <Textarea
                      id="pesan"
                      placeholder="cth: Saya punya toko baju dan mau jualan online, butuh katalog produk + tombol order WhatsApp..."
                      rows={5}
                      value={pesan}
                      onChange={(e) => setPesan(e.target.value)}
                      className="resize-none border-zinc-700 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-orange-500/40"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400 sm:w-auto"
                  >
                    <Send className="size-4" />
                    {sending ? 'Mengirim...' : 'Kirim Brief Project'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
