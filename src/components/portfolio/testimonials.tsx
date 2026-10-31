'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    quote:
      'Aplikasi kasirnya bikin warung saya jadi rapi. Rekap penjualan otomatis tiap hari, gak perlu lagi catat manual di buku. Pokoknya worth it!',
    name: 'Bu Sari',
    role: 'Pemilik Warung Makan',
    initials: 'BS',
  },
  {
    quote:
      'Aplikasi masjidnya sangat membantu pengurus. Jadwal sholat tampil otomatis di TV, laporan infaq jadi rapi tiap bulan, dan jamaah senang bisa lihat pengumuman dari HP.',
    name: 'H. Ahmad Syafri',
    role: 'Ketua DKM Masjid Jami Solok',
    initials: 'HA',
  },
  {
    quote:
      'Toko online-nya jauh melebihi ekspektasi. Proses revisi cepat, komunikasi enak, dan sekarang orderan dari WhatsApp turun karena semua langsung di web.',
    name: 'Raka Wijaya',
    role: 'Owner Lunaria Fashion',
    initials: 'RW',
  },
  {
    quote:
      'Dasbor guru CERDASIA-nya juara. Nilai kuis siswa masuk otomatis, jadi gak perlu koreksi satu-satu. Siswa pun semangat karena nilainya langsung kelihatan.',
    name: 'Ibu Ratna Sari',
    role: 'Guru Matematika, SMPN 1 Solok',
    initials: 'RS',
  },
  {
    quote:
      'Anak saya jadi rajin belajar karena kuisnya seperti game. Tiap selesai belajar, dia pamer nilai yang naik terus ke kami.',
    name: 'Dedi Firmansyah',
    role: 'Orang Tua Siswa',
    initials: 'DF',
  },
  {
    quote:
      'Absensi dan surat-menyurat di kantor kami sekarang rapi semua. Cari arsip dokumen tinggal klik, gak perlu bongkar lemari lagi.',
    name: 'Yandra Putra',
    role: 'Staf Administrasi Instansi',
    initials: 'YP',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Testimoni
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Kata Mereka yang Sudah Pakai Jasa Saya
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Card className="flex h-full flex-col border-zinc-800 bg-zinc-900/50">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className="size-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-zinc-800 pt-4">
                    <span className="flex size-10 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-400">
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">
                        {t.name}
                      </p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
