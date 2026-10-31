'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '25+', label: 'Project Selesai' },
  { value: '18+', label: 'Klien Puas' },
  { value: '3 Thn', label: 'Pengalaman' },
  { value: '4.9/5', label: 'Rating Klien' },
]

const WA_LINK =
  'https://wa.me/6281261926601?text=Halo%20kak%2C%20saya%20mau%20diskusi%20project%20web'

export function Hero() {
  return (
    <section id="beranda" className="relative scroll-mt-24 overflow-hidden">
      {/* background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-2 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Badge className="gap-2 border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-orange-400">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
            </span>
            Tersedia untuk project baru
          </Badge>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl">
            Ubah Ide Jadi{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Web App
            </span>{' '}
            yang Cepat &amp; Modern
          </h1>

          <p className="mt-5 max-w-xl leading-relaxed text-zinc-400">
            Saya Leeyork, founder Cybernet Project — web developer dari Solok,
            Sumatera Barat. Saya bantu UMKM, instansi, sekolah, dan pengelola
            masjid bikin landing page, toko online, aplikasi kantor, aplikasi
            masjid, aplikasi belajar, sampai web app custom — responsive,
            cepat, dan gampang dipakai.
            Mau lihat dulu sebelum order? Coba demo interaktifnya langsung di
            website ini.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400"
            >
              <a href="#demo">
                Coba Demo Live <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-900 hover:text-orange-400"
            >
              <a href={WA_LINK} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> Chat WhatsApp
              </a>
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-xl font-bold text-orange-400">
                  {s.value}
                </dd>
                <dd className="mt-0.5 text-xs text-zinc-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* code editor mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="relative hidden lg:block"
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-orange-500/5">
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <span className="size-3 rounded-full bg-red-500/80" />
              <span className="size-3 rounded-full bg-yellow-500/80" />
              <span className="size-3 rounded-full bg-orange-500/80" />
              <span className="ml-3 rounded-md bg-zinc-950/80 px-3 py-1 text-xs text-zinc-500">
                cybernetproject — app.ts
              </span>
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-7">
              <code>
                <span className="text-purple-400">const</span>{' '}
                <span className="text-zinc-100">project</span>{' '}
                <span className="text-zinc-500">=</span>{' '}
                <span className="text-purple-400">await</span>{' '}
                <span className="text-orange-400">cybernet.build</span>
                <span className="text-zinc-300">({'{'}</span>
                {'\n'}
                {'  '}
                <span className="text-sky-300">klien</span>
                <span className="text-zinc-500">:</span>{' '}
                <span className="text-amber-300">
                  &apos;Warung Bu Sari&apos;
                </span>
                <span className="text-zinc-500">,</span>
                {'\n'}
                {'  '}
                <span className="text-sky-300">produk</span>
                <span className="text-zinc-500">:</span>{' '}
                <span className="text-amber-300">
                  &apos;Aplikasi Kasir&apos;
                </span>
                <span className="text-zinc-500">,</span>
                {'\n'}
                {'  '}
                <span className="text-sky-300">stack</span>
                <span className="text-zinc-500">:</span>{' '}
                <span className="text-zinc-300">[</span>
                <span className="text-amber-300">&apos;Next.js&apos;</span>
                <span className="text-zinc-500">,</span>{' '}
                <span className="text-amber-300">&apos;Prisma&apos;</span>
                <span className="text-zinc-300">]</span>
                <span className="text-zinc-500">,</span>
                {'\n'}
                {'  '}
                <span className="text-sky-300">hasil</span>
                <span className="text-zinc-500">:</span>{' '}
                <span className="text-amber-300">
                  &apos;Omzet naik 40%&apos;
                </span>
                <span className="text-zinc-500">,</span>
                {'\n'}
                <span className="text-zinc-300">{'}'})</span>
                <span className="text-zinc-500">;</span>
              </code>
            </pre>
            <div className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-950/80 px-5 py-3 text-xs text-zinc-400">
              <Check className="size-4 text-orange-400" />
              build sukses — deployed dalam 12 detik
            </div>
          </div>

          {/* floating chips */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-8 top-10 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs shadow-xl"
          >
            <p className="font-semibold text-orange-400">Next.js 16</p>
            <p className="text-zinc-500">App Router</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
            className="absolute -right-6 bottom-12 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs shadow-xl"
          >
            <p className="font-semibold text-orange-400">100% Responsive</p>
            <p className="text-zinc-500">Mobile &amp; Desktop</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
