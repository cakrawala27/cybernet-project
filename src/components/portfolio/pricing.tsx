'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const plans = [
  {
    name: 'Landing Page',
    price: 'Rp 750rb',
    period: '/project',
    desc: 'Buat promosi produk, jasa, atau bisnis yang butuh halaman menjual.',
    features: [
      '1 halaman responsif (HP & desktop)',
      'Desain modern & custom',
      'SEO dasar + tombol WhatsApp',
      'Form kontak / pendaftaran',
      'Revisi 2x',
      'Selesai 3–5 hari kerja',
    ],
    highlighted: false,
    cta: 'Pilih Paket Ini',
  },
  {
    name: 'Company Profile',
    price: 'Rp 1,5jt',
    period: '/project',
    desc: 'Buat UMKM & perusahaan yang mau tampil profesional di internet.',
    features: [
      'Sampai 5 halaman lengkap',
      'Galeri, tim, layanan, blog',
      'Dashboard edit konten sendiri',
      'SEO optimasi + Google Maps',
      'Domain & hosting (panduan 1 thn)',
      'Revisi 3x',
      'Selesai 7–10 hari kerja',
    ],
    highlighted: true,
    cta: 'Paling Laris — Order',
  },
  {
    name: 'Web App Custom',
    price: 'Mulai Rp 3,5jt',
    period: '/project',
    desc: 'Buat bisnis, sekolah & instansi yang butuh sistem: kasir, aplikasi masjid, aplikasi kantor, aplikasi pembelajaran, booking, stok, dll.',
    features: [
      'Fitur custom sesuai kebutuhan',
      'Database + dashboard admin',
      'Multi-user & hak akses',
      'Laporan & export Excel/PDF',
      'Maintenance gratis 1 bulan',
      'Revisi sesuai kesepakatan',
      'Timeline jelas bertahap',
    ],
    highlighted: false,
    cta: 'Diskusikan Kebutuhan',
  },
]

export function Pricing() {
  return (
    <section
      id="harga"
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
            Paket Harga
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Harga Transparan, Tanpa Biaya Tersembunyi
          </h2>
          <p className="mt-4 text-zinc-400">
            Pilih paket sesuai kebutuhan. Semua paket termasuk konsultasi
            gratis di awal — harga final disepakati sebelum pengerjaan.
          </p>
        </motion.div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full"
            >
              <Card
                className={`relative flex h-full flex-col ${
                  p.highlighted
                    ? 'border-orange-500/50 bg-zinc-900 shadow-xl shadow-orange-500/10'
                    : 'border-zinc-800 bg-zinc-900/50'
                }`}
              >
                {p.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1 bg-orange-500 font-semibold text-zinc-950">
                    <Sparkles className="size-3" /> Paling Laris
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-zinc-100">
                    {p.name}
                  </CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-orange-400">
                      {p.price}
                    </span>
                    <span className="text-sm text-zinc-500">{p.period}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {p.desc}
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-orange-400" />
                        <span className="text-zinc-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className={`w-full font-semibold ${
                      p.highlighted
                        ? 'bg-orange-500 text-zinc-950 hover:bg-orange-400'
                        : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                    }`}
                  >
                    <a href="#kontak">{p.cta}</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Butuh fitur di luar paket?{' '}
          <a href="#kontak" className="text-orange-400 hover:underline">
            Chat saja
          </a>{' '}
          — harga bisa disesuaikan dengan scope kerja.
        </p>
      </div>
    </section>
  )
}
