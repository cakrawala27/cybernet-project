'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const links = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#layanan', label: 'Layanan' },
  { href: '#portofolio', label: 'Portofolio' },
  { href: '#demo', label: 'Demo' },
  { href: '#harga', label: 'Harga' },
  { href: '#faq', label: 'FAQ' },
  { href: '#kontak', label: 'Kontak' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#beranda"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
          aria-label="Cybernet Project — kembali ke beranda"
        >
          <Image
            src="/images/logo-mark-light.png"
            alt="Logo Cybernet Project"
            width={423}
            height={256}
            priority
            className="h-8 w-auto"
          />
          <span>
            Cybernet<span className="text-orange-400"> Project</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-orange-400"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400 sm:inline-flex"
          >
            <a href="#kontak">
              <Rocket className="size-4" /> Mulai Project
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="outline"
                size="icon"
                aria-label="Buka menu navigasi"
                className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 hover:text-orange-400"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-zinc-800 bg-zinc-950 [&>button]:text-zinc-400"
            >
              <SheetTitle className="text-left text-zinc-100">
                <span className="flex items-center gap-2">
                  <Image
                    src="/images/logo-mark-light.png"
                    alt="Logo Cybernet Project"
                    width={423}
                    height={256}
                    className="h-7 w-auto"
                  />
                  Cybernet<span className="text-orange-400"> Project</span>
                </span>
              </SheetTitle>
              <ul className="mt-6 space-y-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-orange-400"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-6 w-full bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400"
              >
                <a href="#kontak" onClick={() => setOpen(false)}>
                  <Rocket className="size-4" /> Mulai Project
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
