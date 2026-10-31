'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  CalendarCheck,
  Coins,
  ExternalLink,
  GraduationCap,
  MoonStar,
  Newspaper,
  School,
  Shirt,
  Store,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const categories = [
  'Semua',
  'Web App',
  'Portal Berita',
  'Edukasi',
  'E-Commerce',
  'Company Profile',
  'Dashboard',
] as const

type Category = (typeof categories)[number]

const projects: {
  title: string
  cat: Exclude<Category, 'Semua'>
  desc: string
  url: string
  icon: typeof Store
  grad: string
  tags: string[]
  hasDemo?: boolean
  href?: string
}[] = [
  {
    title: 'Arena27 — Portal Berita',
    cat: 'Portal Berita',
    desc: 'Portal berita olahraga yang sudah live: Liga Champions, Liga Indonesia, MotoGP, NBA, sampai esports PUBG Mobile. Update konten harian.',
    url: 'arena27.my.id',
    icon: Newspaper,
    grad: 'from-orange-500/25 via-amber-500/10 to-zinc-900',
    tags: ['Next.js', 'SEO', 'CMS'],
    hasDemo: true,
    href: 'https://arena27.my.id/',
  },
  {
    title: 'KasirKu — POS Warung',
    cat: 'Web App',
    desc: 'Aplikasi kasir online untuk warung makan: input pesanan, struk otomatis, dan laporan penjualan harian.',
    url: 'kasirku.id',
    icon: Store,
    grad: 'from-orange-500/20 via-rose-500/10 to-zinc-900',
    tags: ['Next.js', 'Prisma', 'SQLite'],
    hasDemo: true,
  },
  {
    title: 'Sistem Informasi Masjid',
    cat: 'Web App',
    desc: 'Jadwal sholat otomatis di TV masjid, pengumuman jamaah, laporan infaq transparan, dan agenda kajian rutin.',
    url: 'masjiddigital.id',
    icon: MoonStar,
    grad: 'from-amber-500/20 via-orange-500/10 to-zinc-900',
    tags: ['Next.js', 'Prisma', 'Display TV'],
  },
  {
    title: 'Aplikasi Kantor — Arsip & Absensi',
    cat: 'Web App',
    desc: 'Digitalisasi kantor: absensi pegawai online, surat-menyurat digital, arsip dokumen, dan agenda rapat terpusat.',
    url: 'adminkantor.id',
    icon: Briefcase,
    grad: 'from-yellow-500/20 via-amber-500/10 to-zinc-900',
    tags: ['Next.js', 'PostgreSQL', 'Multi-user'],
  },
  {
    title: 'CERDASIA — Platform Belajar',
    cat: 'Edukasi',
    desc: 'Aplikasi belajar siswa dengan login kode siswa, kuis interaktif per mapel, dan dasbor guru untuk memantau nilai & remedial secara real-time.',
    url: 'cerdasia.id',
    icon: GraduationCap,
    grad: 'from-yellow-400/25 via-amber-500/10 to-zinc-900',
    tags: ['Next.js', 'Prisma', 'Multi-user'],
    hasDemo: true,
  },
  {
    title: 'Lunaria Fashion',
    cat: 'E-Commerce',
    desc: 'Toko online brand lokal: katalog 200+ produk, keranjang, checkout, dan notifikasi order via WhatsApp.',
    url: 'lunariafashion.com',
    icon: Shirt,
    grad: 'from-rose-500/20 via-pink-500/10 to-zinc-900',
    tags: ['Next.js', 'Tailwind', 'Midtrans'],
  },
  {
    title: 'FinTrack UMKM',
    cat: 'Dashboard',
    desc: 'Dashboard keuangan UMKM: catat pemasukan-pengeluaran, grafik arus kas, dan rekap pajak bulanan.',
    url: 'fintrack.id',
    icon: Coins,
    grad: 'from-amber-500/20 via-yellow-500/10 to-zinc-900',
    tags: ['React', 'Recharts', 'API'],
  },
  {
    title: 'SMK Bina Nusantara',
    cat: 'Company Profile',
    desc: 'Website sekolah: profil jurusan, berita, agenda, galeri kegiatan, dan form pendaftaran siswa baru.',
    url: 'smkbinanusantara.sch.id',
    icon: School,
    grad: 'from-sky-500/20 via-cyan-500/10 to-zinc-900',
    tags: ['Next.js', 'SEO', 'CMS'],
  },
  {
    title: 'GoFutsal Booking',
    cat: 'Web App',
    desc: 'Sistem booking lapangan futsal online: jadwal real-time, pembayaran DP, dan konfirmasi otomatis.',
    url: 'gofutsal.id',
    icon: CalendarCheck,
    grad: 'from-violet-500/20 via-purple-500/10 to-zinc-900',
    tags: ['Next.js', 'Socket.io', 'PostgreSQL'],
  },
]

export function Portfolio() {
  const [active, setActive] = useState<Category>('Semua')

  const filtered =
    active === 'Semua' ? projects : projects.filter((p) => p.cat === active)

  return (
    <section
      id="portofolio"
      className="scroll-mt-24 border-y border-zinc-800/60 bg-zinc-900/30 py-20 sm:py-24"
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
            Portofolio
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Project yang Pernah Kami Kerjakan
          </h2>
          <p className="mt-4 text-zinc-400">
            Beberapa contoh hasil kerja dari berbagai industri — termasuk
            project yang sudah live dan bisa lo kunjungi langsung.
          </p>
        </motion.div>

        <Tabs
          value={active}
          onValueChange={(v) => setActive(v as Category)}
          className="mt-10"
        >
          <TabsList className="mx-auto flex w-fit flex-wrap justify-center gap-1 bg-zinc-900 p-1">
            {categories.map((c) => (
              <TabsTrigger
                key={c}
                value={c}
                className="text-zinc-400 data-[state=active]:bg-orange-500 data-[state=active]:font-semibold data-[state=active]:text-zinc-950"
              >
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-orange-500/40"
            >
              {/* browser mockup */}
              <div className="border-b border-zinc-800">
                <div className="flex items-center gap-1.5 px-4 pt-3">
                  <span className="size-2.5 rounded-full bg-zinc-700" />
                  <span className="size-2.5 rounded-full bg-zinc-700" />
                  <span className="size-2.5 rounded-full bg-zinc-700" />
                  <span className="ml-2 flex-1 truncate rounded-t-md bg-zinc-950/70 px-3 py-1 text-[11px] text-zinc-500">
                    https://{p.url}
                  </span>
                </div>
                <div
                  className={`relative mx-0 mt-3 flex h-40 items-center justify-center bg-gradient-to-br ${p.grad}`}
                >
                  <p.icon className="size-14 text-zinc-200/80 transition-transform duration-300 group-hover:scale-110" />
                  {p.href ? (
                    <Badge className="absolute right-3 top-3 border-orange-500/40 bg-orange-500/20 text-[10px] text-orange-200">
                      Project Live
                    </Badge>
                  ) : p.hasDemo ? (
                    <Badge className="absolute right-3 top-3 border-orange-500/40 bg-orange-500/15 text-[10px] text-orange-300">
                      Ada demo live
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-zinc-100">{p.title}</h3>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-zinc-700 text-[10px] text-zinc-400"
                  >
                    {p.cat}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {p.desc}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 hover:text-orange-300 hover:underline"
                  >
                    Kunjungi Situs <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
