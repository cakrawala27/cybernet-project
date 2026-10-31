'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'Berapa lama pengerjaan 1 project?',
    a: 'Tergantung kompleksitas. Landing page umumnya 3–5 hari kerja, company profile 7–10 hari, dan web app custom 2–4 minggu. Timeline detail selalu saya kasih tertulis sebelum pengerjaan dimulai, jadi lo bisa monitor progres.',
  },
  {
    q: 'Apakah bisa revisi kalau hasilnya kurang cocok?',
    a: 'Bisa. Setiap paket sudah termasuk jatah revisi (2x–3x tergantung paket). Revisi di sini termasuk perubahan warna, teks, layout, dan penyesuaian fitur kecil. Komunikasi kita lakukan via WhatsApp biar cepat dan jelas.',
  },
  {
    q: 'Teknologi apa yang dipakai?',
    a: 'Saya pakai stack modern: Next.js (React), Tailwind CSS, dan database Prisma/SQLite atau PostgreSQL. Stack ini yang dipakai perusahaan besar dunia, jadi web lo bakal cepat, aman, dan gampang dikembangkan ke depannya.',
  },
  {
    q: 'Apakah ada garansi setelah website jadi?',
    a: 'Ada. Semua project dapat garansi perbaikan bug gratis selama 30 hari setelah serah terima. Paket web app custom dapat maintenance gratis 1 bulan: update kecil, monitoring, dan perbaikan error.',
  },
  {
    q: 'Gimana sistem pembayarannya?',
    a: 'DP 50% untuk mulai pengerjaan, pelunasan 50% setelah project selesai dan disetujui. Bisa via transfer bank atau e-wallet. Untuk project besar (web app custom), pembayaran bisa dicicil per tahap/progress.',
  },
  {
    q: 'Saya gak punya domain & hosting, gimana?',
    a: 'Tenang, saya bantu urus dari nol. Saya pandu proses pembelian domain dan hosting (biaya di luar jasa, sekitar Rp 300rb–1jt/tahun tergantung kebutuhan), lalu saya yang setup sampai website online.',
  },
  {
    q: 'Bisa bikin aplikasi belajar online untuk sekolah atau bimbel?',
    a: 'Bisa banget. Contohnya CERDASIA — aplikasi pembelajaran dengan login kode siswa, materi per bab, kuis interaktif, dan dasbor guru untuk memantau nilai siswa. Demonya bisa langsung dicoba di bagian Demo di atas, lengkap dengan dasbor admin gurunya.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Pertanyaan yang Sering Ditanya
          </h2>
          <p className="mt-4 text-zinc-400">
            Masih ada yang mau ditanya? Langsung chat aja, gratis konsultasi.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5"
          >
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-zinc-800 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-[15px] font-medium text-zinc-100 hover:text-orange-400 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-zinc-400">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
