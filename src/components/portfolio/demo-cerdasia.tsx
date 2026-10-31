'use client'

import { useState } from 'react'
import { BookOpen, Feather, LogOut, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

type Siswa = { kode: string; nama: string; kelas: string }
type Soal = { tanya: string; opsi: string[]; jawaban: number }
type Mapel = {
  id: string
  nama: string
  bab: string
  emoji: string
  chip: string
  bar: string
  progress: number
  soal: Soal[]
}
type Row = {
  nama: string
  kelas: string
  kuis: string
  nilai: number
  kamu?: boolean
}

const SISWA_DB: Record<string, Siswa> = {
  SISWA123: { kode: 'SISWA123', nama: 'Rizky Ramadhan', kelas: 'VIII A' },
  SISWA456: { kode: 'SISWA456', nama: 'Aulia Putri', kelas: 'VIII B' },
}

const MAPEL: Mapel[] = [
  {
    id: 'mtk',
    nama: 'Matematika',
    bab: 'Aljabar Dasar',
    emoji: '🧮',
    chip: 'bg-amber-500/15 text-amber-400',
    bar: 'bg-amber-400',
    progress: 66,
    soal: [
      {
        tanya: 'Jika 2x + 3 = 11, berapakah nilai x?',
        opsi: ['2', '3', '4', '5'],
        jawaban: 2,
      },
      {
        tanya: 'Hasil dari 3² + 4² adalah…',
        opsi: ['12', '25', '49', '14'],
        jawaban: 1,
      },
      {
        tanya: 'Bentuk sederhana dari a + a + a adalah…',
        opsi: ['3a', 'a³', '3 + a', 'aa'],
        jawaban: 0,
      },
    ],
  },
  {
    id: 'ipa',
    nama: 'IPA',
    bab: 'Fotosintesis',
    emoji: '🌱',
    chip: 'bg-green-500/15 text-green-400',
    bar: 'bg-green-400',
    progress: 40,
    soal: [
      {
        tanya: 'Fotosintesis terjadi pada bagian tumbuhan yang mengandung…',
        opsi: ['Klorofil', 'Kambium', 'Xilem', 'Floem'],
        jawaban: 0,
      },
      {
        tanya: 'Gas yang diserap tumbuhan saat fotosintesis adalah…',
        opsi: ['Oksigen', 'Nitrogen', 'Karbon dioksida', 'Hidrogen'],
        jawaban: 2,
      },
      {
        tanya: 'Gas yang dihasilkan sebagai sampingan fotosintesis adalah…',
        opsi: ['Karbon dioksida', 'Oksigen', 'Glukosa', 'Air'],
        jawaban: 1,
      },
    ],
  },
  {
    id: 'bing',
    nama: 'Bahasa Inggris',
    bab: 'Simple Present Tense',
    emoji: '🔤',
    chip: 'bg-sky-500/15 text-sky-400',
    bar: 'bg-sky-400',
    progress: 25,
    soal: [
      {
        tanya: 'She ___ to school every day.',
        opsi: ['go', 'goes', 'going', 'gone'],
        jawaban: 1,
      },
      {
        tanya: 'They ___ football on Sunday.',
        opsi: ['plays', 'play', 'playing', 'played'],
        jawaban: 1,
      },
      {
        tanya: 'My mother ___ rice every morning.',
        opsi: ['cook', 'cooks', 'cooked', 'cooking'],
        jawaban: 1,
      },
    ],
  },
]

const GURU_SISWA: Row[] = [
  {
    nama: 'Aulia Putri',
    kelas: 'VIII B',
    kuis: 'IPA · Fotosintesis',
    nilai: 90,
  },
  {
    nama: 'Bayu Saputra',
    kelas: 'VIII A',
    kuis: 'Matematika · Aljabar',
    nilai: 78,
  },
  {
    nama: 'Citra Maharani',
    kelas: 'VIII A',
    kuis: 'B. Inggris · Simple Present',
    nilai: 88,
  },
  {
    nama: 'Dimas Pratama',
    kelas: 'VIII B',
    kuis: 'Matematika · Aljabar',
    nilai: 55,
  },
  {
    nama: 'Eka Wulandari',
    kelas: 'VIII A',
    kuis: 'IPA · Fotosintesis',
    nilai: 82,
  },
  {
    nama: 'Fajar Nugraha',
    kelas: 'VIII B',
    kuis: 'B. Inggris · Simple Present',
    nilai: 68,
  },
]

export function DemoCerdasia() {
  const { toast } = useToast()
  const [kode, setKode] = useState('')
  const [siswa, setSiswa] = useState<Siswa | null>(null)
  const [mainTab, setMainTab] = useState<'siswa' | 'guru'>('siswa')
  const [kuisAktif, setKuisAktif] = useState<Mapel | null>(null)
  const [soalIdx, setSoalIdx] = useState(0)
  const [dipilih, setDipilih] = useState<number | null>(null)
  const [benar, setBenar] = useState(0)
  const [hasil, setHasil] = useState<{ mapel: Mapel; nilai: number } | null>(
    null
  )
  const [attempt, setAttempt] = useState<Row | null>(null)
  const [selesai, setSelesai] = useState<string[]>([])

  const login = () => {
    const k = kode.trim().toUpperCase()
    const found = SISWA_DB[k]
    if (!found) {
      toast({
        title: 'Kode tidak ditemukan',
        description: 'Demo: coba kode SISWA123 atau SISWA456.',
        variant: 'destructive',
      })
      return
    }
    setSiswa(found)
    setMainTab('siswa')
    toast({
      title: `Selamat datang, ${found.nama.split(' ')[0]}!`,
      description: 'Jelajahi materi dan kerjakan kuisnya ya.',
    })
  }

  const logout = () => {
    setSiswa(null)
    setKode('')
    setMainTab('siswa')
    setKuisAktif(null)
    setHasil(null)
    setAttempt(null)
    setSelesai([])
    setBenar(0)
    setSoalIdx(0)
    setDipilih(null)
  }

  const infoDaftar = () =>
    toast({
      title: 'Mode Demo',
      description:
        'Di aplikasi asli, pendaftaran & reset kode dikelola guru lewat dasbor admin.',
    })

  const mulaiKuis = (m: Mapel) => {
    setKuisAktif(m)
    setSoalIdx(0)
    setDipilih(null)
    setBenar(0)
    setHasil(null)
  }

  const jawab = () => {
    if (!kuisAktif || dipilih === null) return
    const soal = kuisAktif.soal[soalIdx]
    const benerBaru = benar + (dipilih === soal.jawaban ? 1 : 0)
    if (soalIdx === kuisAktif.soal.length - 1) {
      const nilai = Math.round((benerBaru / kuisAktif.soal.length) * 100)
      setBenar(benerBaru)
      setAttempt({
        nama: siswa?.nama ?? 'Siswa Demo',
        kelas: siswa?.kelas ?? 'VIII A',
        kuis: `${kuisAktif.nama} · ${kuisAktif.bab}`,
        nilai,
      })
      setSelesai((prev) =>
        prev.includes(kuisAktif.id) ? prev : [...prev, kuisAktif.id]
      )
      setHasil({ mapel: kuisAktif, nilai })
      setKuisAktif(null)
      setDipilih(null)
      return
    }
    setBenar(benerBaru)
    setSoalIdx((i) => i + 1)
    setDipilih(null)
  }

  // ===== dasbor guru =====
  const rows: Row[] = attempt
    ? [{ ...attempt, kamu: true }, ...GURU_SISWA]
    : GURU_SISWA
  const avg = Math.round(
    rows.reduce((a, r) => a + r.nilai, 0) / rows.length
  )
  const remedial = rows.filter((r) => r.nilai < 75).length
  const guruStats = [
    { label: 'Total Siswa', value: '28' },
    { label: 'Rata-rata Kelas', value: String(avg) },
    { label: 'Kuis Dinilai', value: String(156 + (attempt ? 1 : 0)) },
    { label: 'Perlu Remedial', value: String(remedial) },
  ]

  const statSiswa = [
    { label: 'Rata-rata', value: attempt ? String(attempt.nilai) : '—' },
    { label: 'Kuis Selesai', value: String(selesai.length) },
    { label: 'Peringkat', value: '3 / 28' },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/25 bg-zinc-950/85 shadow-2xl shadow-amber-500/5">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 bg-zinc-950/60 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-300">
            <Feather className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-[0.25em] text-amber-400">
              CERDASIA
            </p>
            <p className="text-[11px] text-zinc-500">
              Menceraskan Anak Bangsa
            </p>
          </div>
        </div>

        {siswa ? (
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
              {(['siswa', 'guru'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setMainTab(t)}
                  aria-pressed={mainTab === t}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    mainTab === t
                      ? 'bg-amber-400 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {t === 'siswa' ? 'Siswa' : 'Dasbor Guru'}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Keluar dari demo"
              onClick={logout}
              className="size-8 bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-red-400"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        ) : (
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-300"
          >
            Mode Demo
          </Badge>
        )}
      </div>

      <div className="p-5 sm:p-8">
        {/* ===== LOGIN ===== */}
        {!siswa && (
          <div className="mx-auto flex max-w-sm flex-col items-center py-4 text-center">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-full bg-amber-400/20 blur-2xl"
              />
              <span className="relative flex size-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-zinc-900 text-amber-300">
                <Feather className="size-8" />
              </span>
            </div>
            <h3 className="mt-5 text-2xl font-extrabold tracking-[0.25em] text-amber-400">
              CERDASIA
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Menceraskan Anak Bangsa
            </p>

            <div className="mt-6 w-full space-y-2 text-left">
              <Label htmlFor="kode-siswa" className="text-zinc-300">
                Kode Siswa
              </Label>
              <Input
                id="kode-siswa"
                placeholder="Masukkan Kode Siswa"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') login()
                }}
                className="border-zinc-700 bg-zinc-950/60 text-center tracking-widest text-zinc-100 placeholder:tracking-normal placeholder:text-zinc-600 focus-visible:ring-amber-500/40"
              />
              <Button
                onClick={login}
                className="w-full bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300"
              >
                Masuk
              </Button>
              <p className="text-center text-[11px] text-zinc-600">
                Demo: coba kode{' '}
                <span className="font-mono text-amber-400">SISWA123</span> atau{' '}
                <span className="font-mono text-amber-400">SISWA456</span>
              </p>
            </div>

            <div className="mt-5 space-y-1 text-xs">
              <button
                onClick={infoDaftar}
                className="block w-full text-amber-400/80 underline-offset-2 hover:text-amber-300 hover:underline"
              >
                Belum punya kode? Daftar di sini
              </button>
              <button
                onClick={infoDaftar}
                className="block w-full text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
              >
                Kode hilang? Hubungi Guru
              </button>
            </div>

            <p className="mt-8 text-[10px] text-zinc-600">
              © 2026 Developed by Cybernet Project
            </p>
          </div>
        )}

        {/* ===== HASIL KUIS ===== */}
        {siswa && hasil && (
          <div className="mx-auto flex max-w-sm flex-col items-center py-4 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-500/10 text-amber-300">
              <Trophy className="size-8" />
            </span>
            <h3 className="mt-4 text-xl font-bold text-zinc-100">
              Kuis Selesai!
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {hasil.mapel.nama} · {hasil.mapel.bab}
            </p>
            <p className="mt-4 text-5xl font-extrabold text-amber-400">
              {hasil.nilai}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Benar {benar} dari {hasil.mapel.soal.length} soal
            </p>
            <p className="mt-3 text-sm text-zinc-300">
              {hasil.nilai >= 75
                ? 'Kerja bagus! Pertahankan ya.'
                : 'Semangat! Baca materinya lagi, lalu coba ulang.'}
            </p>
            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => mulaiKuis(hasil.mapel)}
                className="w-full border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-900 hover:text-amber-300 sm:flex-1"
              >
                Ulangi Kuis
              </Button>
              <Button
                onClick={() => setHasil(null)}
                className="w-full bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300 sm:flex-1"
              >
                Kembali ke Materi
              </Button>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Nilai ini langsung tercatat di Dasbor Guru.
            </p>
          </div>
        )}

        {/* ===== KUIS ===== */}
        {siswa && !hasil && kuisAktif && (
          <div className="mx-auto max-w-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  Kuis {kuisAktif.nama}
                </p>
                <p className="text-xs text-zinc-500">{kuisAktif.bab}</p>
              </div>
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-300"
              >
                Soal {soalIdx + 1} / {kuisAktif.soal.length}
              </Badge>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
                style={{
                  width: `${((soalIdx + 1) / kuisAktif.soal.length) * 100}%`,
                }}
              />
            </div>

            <p className="mt-6 text-lg font-semibold leading-relaxed text-zinc-100">
              {kuisAktif.soal[soalIdx].tanya}
            </p>
            <div className="mt-4 grid gap-2">
              {kuisAktif.soal[soalIdx].opsi.map((o, i) => (
                <button
                  key={o}
                  onClick={() => setDipilih(i)}
                  aria-pressed={dipilih === i}
                  className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                    dipilih === i
                      ? 'border-amber-400 bg-amber-500/10 font-medium text-amber-200'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <span className="mr-2 font-mono text-xs text-zinc-500">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {o}
                </button>
              ))}
            </div>
            <Button
              onClick={jawab}
              disabled={dipilih === null}
              className="mt-5 w-full bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40 sm:w-auto"
            >
              {soalIdx === kuisAktif.soal.length - 1
                ? 'Selesai & Lihat Nilai'
                : 'Jawab & Lanjut'}
            </Button>
          </div>
        )}

        {/* ===== SISWA: MATERI ===== */}
        {siswa && !hasil && !kuisAktif && mainTab === 'siswa' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  Halo, {siswa.nama.split(' ')[0]}!
                </p>
                <p className="text-xs text-zinc-500">
                  Kelas {siswa.kelas} · SMP Negeri 1 Solok · Semester Ganjil
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-300"
              >
                Kode: {siswa.kode}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {statSiswa.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center"
                >
                  <p className="text-lg font-bold text-amber-400">{s.value}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
              <BookOpen className="size-4 text-amber-400" /> Pilih mapel untuk
              mulai kuis
            </p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MAPEL.map((m) => {
                const done = selesai.includes(m.id)
                return (
                  <div
                    key={m.id}
                    className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-lg ${m.chip}`}
                      >
                        {m.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-zinc-100">
                            {m.nama}
                          </p>
                          {done && (
                            <Badge className="border-amber-500/40 bg-amber-500/10 text-[9px] text-amber-300">
                              Selesai
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">
                          {m.bab} · {m.soal.length} soal
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${m.bar}`}
                        style={{ width: `${done ? 100 : m.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-zinc-500">
                      Progres {done ? 100 : m.progress}%
                    </p>
                    <Button
                      onClick={() => mulaiKuis(m)}
                      size="sm"
                      className={`mt-3 w-full ${
                        done
                          ? 'border border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                          : 'bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300'
                      }`}
                    >
                      {done ? 'Ulangi Kuis' : 'Mulai Kuis'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ===== DASBOR GURU ===== */}
        {siswa && !hasil && !kuisAktif && mainTab === 'guru' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  Dasbor Guru
                </p>
                <p className="text-xs text-zinc-500">
                  Kelas VIII · SMP Negeri 1 Solok · Semester Ganjil
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-300"
              >
                Admin
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {guruStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center"
                >
                  <p className="text-xl font-bold text-amber-400">{s.value}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-zinc-950/60 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Siswa</th>
                    <th className="px-4 py-2.5 font-medium">Kelas</th>
                    <th className="px-4 py-2.5 font-medium">Kuis Terakhir</th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Nilai
                    </th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {rows.map((r, i) => (
                    <tr key={`${r.nama}-${i}`} className="bg-zinc-900/40">
                      <td className="px-4 py-2.5 font-medium text-zinc-100">
                        {r.nama}
                        {r.kamu && (
                          <span className="ml-1.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-300">
                            baru
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-400">{r.kelas}</td>
                      <td className="px-4 py-2.5 text-zinc-400">{r.kuis}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-zinc-100">
                        {r.nilai}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge
                          variant="outline"
                          className={
                            r.nilai >= 75
                              ? 'border-green-500/40 bg-green-500/10 text-green-400'
                              : 'border-red-500/40 bg-red-500/10 text-red-400'
                          }
                        >
                          {r.nilai >= 75 ? 'Tuntas' : 'Remedial'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-zinc-600">
              Data contoh. Pada aplikasi asli, nilai tercatat otomatis setiap
              siswa menyelesaikan kuis — termasuk yang barusan kamu kerjakan.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
