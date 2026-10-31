import Image from 'next/image'

const quickLinks = [
  { href: '#layanan', label: 'Layanan' },
  { href: '#portofolio', label: 'Portofolio' },
  { href: '#demo', label: 'Demo' },
  { href: '#harga', label: 'Harga' },
  { href: '#faq', label: 'FAQ' },
  { href: '#kontak', label: 'Kontak' },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="flex items-center justify-center gap-2 font-bold text-zinc-100 md:justify-start">
            <Image
              src="/images/logo-mark-light.png"
              alt="Logo Cybernet Project"
              width={423}
              height={256}
              className="h-7 w-auto"
            />
            Cybernet<span className="text-orange-400"> Project</span>
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Jasa pembuatan website & web app untuk UMKM, instansi, dan masjid —
            Solok, Sumatera Barat.
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-xs text-zinc-400 transition-colors hover:text-orange-400"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Leeyork — Cybernet Project. Dibuat dengan Next.js.
        </p>
      </div>
    </footer>
  )
}
