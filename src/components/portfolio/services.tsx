'use client'

import { motion } from 'framer-motion'
import {
  AppWindow,
  Briefcase,
  Building2,
  Gauge,
  Globe,
  GraduationCap,
  LifeBuoy,
  MoonStar,
  ShoppingCart,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const services = [
  {
    icon: Globe,
    title: 'Landing Page',
    desc: 'Halaman promosi produk atau jasa yang menjual, cepat loading, dan SEO-friendly. Cocok buat kampanye iklan.',
  },
  {
    icon: Building2,
    title: 'Company Profile',
    desc: 'Website profil perusahaan yang profesional: tentang kami, layanan, galeri, dan form kontak yang terhubung WhatsApp.',
  },
  {
    icon: ShoppingCart,
    title: 'Toko Online',
    desc: 'E-commerce lengkap: katalog produk, keranjang, checkout, notifikasi order, sampai integrasi pembayaran.',
  },
  {
    icon: AppWindow,
    title: 'Web App Custom',
    desc: 'Aplikasi web sesuai kebutuhan unik bisnis: sistem kasir, booking, manajemen stok, absensi, dan lainnya.',
  },
  {
    icon: MoonStar,
    title: 'Aplikasi Masjid',
    desc: 'Sistem informasi masjid modern: jadwal sholat otomatis di TV, pengumuman jamaah, laporan infaq, dan agenda kajian — semua dalam satu dashboard.',
  },
  {
    icon: Briefcase,
    title: 'Aplikasi Kantor',
    desc: 'Digitalisasi kantor & instansi: absensi pegawai, surat-menyurat digital, arsip dokumen, dan manajemen agenda agar kerja lebih rapi dan cepat.',
  },
  {
    icon: GraduationCap,
    title: 'Aplikasi Pembelajaran',
    desc: 'Platform belajar untuk sekolah & bimbel: login kode siswa, materi per bab, kuis interaktif, dan dasbor guru untuk pantau nilai siswa real-time — seperti CERDASIA.',
  },
  {
    icon: Gauge,
    title: 'Dashboard & Admin Panel',
    desc: 'Pantau penjualan, stok, dan performa bisnis lewat dashboard interaktif dengan grafik yang gampang dibaca.',
  },
  {
    icon: LifeBuoy,
    title: 'Maintenance & Support',
    desc: 'Update konten, perbaikan bug, backup rutin, dan monitoring agar website selalu aman dan up-to-date.',
  },
]

export function Services() {
  return (
    <section id="layanan" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Layanan
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Apa Saja yang Bisa Saya Bikin?
          </h2>
          <p className="mt-4 text-zinc-400">
            Dari website sederhana sampai aplikasi web kompleks — semua
            dikerjakan serius, komunikatif, dan tepat waktu.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
            >
              <Card className="group h-full border-zinc-800 bg-zinc-900/50 transition-colors hover:border-orange-500/40 hover:bg-zinc-900">
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 transition-transform group-hover:scale-110">
                    <s.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg text-zinc-100">
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed text-zinc-400">
                    {s.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
