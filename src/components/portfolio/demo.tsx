'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  GraduationCap,
  Minus,
  MousePointerClick,
  Plus,
  Receipt,
  RotateCcw,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import { DemoCerdasia } from '@/components/portfolio/demo-cerdasia'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

type Product = {
  id: number
  name: string
  price: number
  emoji: string
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Kopi Susu', price: 8000, emoji: '☕' },
  { id: 2, name: 'Es Teh', price: 5000, emoji: '🧋' },
  { id: 3, name: 'Nasi Goreng', price: 15000, emoji: '🍚' },
  { id: 4, name: 'Mie Ayam', price: 12000, emoji: '🍜' },
  { id: 5, name: 'Ayam Geprek', price: 17000, emoji: '🍗' },
  { id: 6, name: 'Roti Bakar', price: 10000, emoji: '🍞' },
  { id: 7, name: 'French Fries', price: 12000, emoji: '🍟' },
  { id: 8, name: 'Es Jeruk', price: 7000, emoji: '🍊' },
]

type CartItem = { product: Product; qty: number }

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

export function DemoSection() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [paid, setPaid] = useState(false)
  const [demoTab, setDemoTab] = useState<'kasir' | 'cerdasia'>('kasir')

  const totalQty = useMemo(
    () => cart.reduce((acc, c) => acc + c.qty, 0),
    [cart]
  )
  const total = useMemo(
    () => cart.reduce((acc, c) => acc + c.qty * c.product.price, 0),
    [cart]
  )

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const found = prev.find((c) => c.product.id === p.id)
      if (found) {
        return prev.map((c) =>
          c.product.id === p.id ? { ...c, qty: c.qty + 1 } : c
        )
      }
      return [...prev, { product: p, qty: 1 }]
    })
  }

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c
        )
        .filter((c) => c.qty > 0)
    )
  }

  const removeItem = (id: number) =>
    setCart((prev) => prev.filter((c) => c.product.id !== id))

  const pay = () => {
    if (cart.length === 0) return
    setPaid(true)
    setReceiptOpen(true)
  }

  const newTransaction = () => {
    setCart([])
    setPaid(false)
    setReceiptOpen(false)
  }

  return (
    <section id="demo" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge className="border border-orange-500/30 bg-orange-500/10 text-orange-400">
            Demo Interaktif
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Coba Langsung Web App-nya, Bukan Cuma Lihat Gambar
          </h2>
          <p className="mt-4 text-zinc-400">
            Dua demo yang bisa langsung dicoba: <strong className="font-semibold text-zinc-200">KasirKu POS</strong> untuk
            warung & bisnis, dan <strong className="font-semibold text-zinc-200">CERDASIA</strong> — aplikasi belajar siswa
            lengkap dengan dasbor guru. Semuanya berfungsi penuh, bukan
            sekadar gambar.
          </p>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-orange-400">
            <MousePointerClick className="size-4" /> Klik-klik saja, semua tombolnya aktif
          </p>
        </motion.div>

        {/* pemilih demo */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Button
            onClick={() => setDemoTab('kasir')}
            aria-pressed={demoTab === 'kasir'}
            className={`gap-2 font-semibold ${
              demoTab === 'kasir'
                ? 'bg-orange-500 text-zinc-950 hover:bg-orange-400'
                : 'border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            <Receipt className="size-4" /> KasirKu POS
          </Button>
          <Button
            onClick={() => setDemoTab('cerdasia')}
            aria-pressed={demoTab === 'cerdasia'}
            className={`gap-2 font-semibold ${
              demoTab === 'cerdasia'
                ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300'
                : 'border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            <GraduationCap className="size-4" /> CERDASIA — E-Learning
          </Button>
        </div>

        {demoTab === 'kasir' && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
            {/* app top bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                  <Receipt className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    KasirKu — POS
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Warung Bu Sari · Kasir 01
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-orange-500/40 bg-orange-500/10 text-[10px] text-orange-300"
              >
                Mode Demo
              </Badge>
            </div>

            <div className="grid gap-0 lg:grid-cols-5">
              {/* products */}
              <div className="p-5 lg:col-span-3">
                <p className="mb-4 text-sm font-medium text-zinc-400">
                  Daftar Menu
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PRODUCTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      aria-label={`Tambah ${p.name} ke keranjang`}
                      className="group flex flex-col items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center transition-all hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-zinc-800 active:scale-95"
                    >
                      <span className="text-3xl transition-transform group-hover:scale-110">
                        {p.emoji}
                      </span>
                      <span className="mt-1 text-xs font-medium text-zinc-200">
                        {p.name}
                      </span>
                      <span className="text-xs font-semibold text-orange-400">
                        {rupiah(p.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* cart */}
              <div className="border-t border-zinc-800 bg-zinc-950/40 p-5 lg:col-span-2 lg:border-l lg:border-t-0">
                <div className="mb-4 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <ShoppingCart className="size-4 text-orange-400" />
                    Keranjang
                    {totalQty > 0 && (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-zinc-950">
                        {totalQty}
                      </span>
                    )}
                  </p>
                  {cart.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCart([])}
                      className="h-8 text-xs text-zinc-500 hover:bg-zinc-900 hover:text-red-400"
                    >
                      <RotateCcw className="size-3.5" /> Reset
                    </Button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 text-center">
                    <ShoppingCart className="mb-2 size-8 text-zinc-700" />
                    <p className="text-sm text-zinc-500">Keranjang kosong</p>
                    <p className="mt-1 text-xs text-zinc-600">
                      Klik menu di sebelah kiri untuk mulai
                    </p>
                  </div>
                ) : (
                  <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {cart.map((c) => (
                      <li
                        key={c.product.id}
                        className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-2.5"
                      >
                        <span className="text-2xl">{c.product.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-200">
                            {c.product.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {rupiah(c.product.price)} × {c.qty}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Kurangi ${c.product.name}`}
                            onClick={() => changeQty(c.product.id, -1)}
                            className="size-7 rounded-md border-zinc-700 bg-zinc-900 p-0 text-zinc-300 hover:bg-zinc-800"
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-6 text-center text-sm font-semibold text-zinc-200">
                            {c.qty}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Tambah ${c.product.name}`}
                            onClick={() => changeQty(c.product.id, 1)}
                            className="size-7 rounded-md border-zinc-700 bg-zinc-900 p-0 text-zinc-300 hover:bg-zinc-800"
                          >
                            <Plus className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Hapus ${c.product.name}`}
                            onClick={() => removeItem(c.product.id)}
                            className="size-7 rounded-md p-0 text-zinc-600 hover:bg-zinc-800 hover:text-red-400"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 space-y-3">
                  <Separator className="bg-zinc-800" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Total</span>
                    <span className="text-xl font-bold text-orange-400">
                      {rupiah(total)}
                    </span>
                  </div>
                  <Button
                    onClick={pay}
                    disabled={cart.length === 0}
                    className="w-full bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400 disabled:opacity-40"
                  >
                    <Receipt className="size-4" /> Bayar Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {demoTab === 'cerdasia' && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <DemoCerdasia />
          </motion.div>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500">
          Demo ini cuma salah satu contoh. Web app untuk bisnis lo bisa custom
          fitur, desain, dan alurnya —{' '}
          <a href="#kontak" className="text-orange-400 hover:underline">
            diskusikan sekarang
          </a>
          .
        </p>
      </div>

      {/* receipt dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-zinc-100">
              <CheckCircle2 className="size-5 text-orange-400" />
              {paid ? 'Pembayaran Berhasil!' : 'Struk Transaksi'}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Contoh struk digital yang dihasilkan aplikasi kasir.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 p-4 font-mono text-xs text-zinc-300">
            <div className="mb-3 text-center">
              <p className="text-sm font-bold tracking-wider text-zinc-100">
                WARUNG BU SARI
              </p>
              <p className="text-[10px] text-zinc-500">
                Jl. Merdeka No. 123, Solok
              </p>
            </div>
            <Separator className="mb-3 border-zinc-800" />
            <ul className="space-y-1.5">
              {cart.map((c) => (
                <li key={c.product.id} className="flex justify-between gap-2">
                  <span className="truncate">
                    {c.product.name} ×{c.qty}
                  </span>
                  <span>{rupiah(c.qty * c.product.price)}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-3 border-zinc-800" />
            <div className="flex justify-between text-sm font-bold text-orange-400">
              <span>TOTAL</span>
              <span>{rupiah(total)}</span>
            </div>
            <p className="mt-1 flex justify-between text-[10px] text-zinc-500">
              <span>Metode</span>
              <span>Tunai (Lunas)</span>
            </p>
            <p className="mt-3 text-center text-[10px] text-zinc-500">
              Terima kasih atas kunjungannya
            </p>
          </div>

          <Button
            onClick={newTransaction}
            className="w-full bg-orange-500 font-semibold text-zinc-950 hover:bg-orange-400"
          >
            <RotateCcw className="size-4" /> Transaksi Baru
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  )
}
