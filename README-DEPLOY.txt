CYBERNET PROJECT — Source Code Siap Deploy
Leeyork — jasa pembuatan website & web app (Solok, Sumatera Barat)
=============================================================

ISI PAKET
---------
src/                Kode aplikasi (Next.js 16 + TypeScript + Tailwind 4)
public/             Aset (termasuk latar belakang bg-luxury-clean.png)
prisma/             Skema database (opsional, belum dipakai situs ini)
package.json        Daftar dependensi
bun.lock            Lockfile (kalau pakai bun)
next.config.ts, tsconfig.json, tailwind.config.ts,
postcss.config.mjs, components.json, eslint.config.mjs
.gitignore
.env.example        Contoh environment variable


CARA PUSH KE GITHUB (dari laptop lo)
------------------------------------
1. Ekstrak zip ini, buka terminal di foldernya.

2. Buat repo baru di https://github.com/new
   - Nama bebas, contoh: cybernet-project
   - JANGAN centang "Add a README" biar kosong.
   - Private atau Public terserah (Private = lebih aman).

3. Jalankan (ganti NAMAUSER dengan username GitHub lo):

   git init
   git add .
   git commit -m "Cybernet Project - website portofolio"
   git branch -M main
   git remote add origin https://github.com/NAMAUSER/cybernet-project.git
   git push -u origin main

   Kalau diminta login, pakai Personal Access Token (bukan password):
   GitHub > Settings > Developer settings > Personal access tokens.


CARA DEPLOY KE VERCEL (BIAR ONLINE 24 JAM)
------------------------------------------
1. Buka https://vercel.com dan login pakai akun GitHub.

2. Klik "Add New... > Project" lalu pilih repo cybernet-project.

3. Vercel otomatis deteksi Next.js — TIDAK perlu set apa-apa.
   (Tidak butuh database. Biarkan kolom Environment Variables kosong.)

4. Klik Deploy, tunggu 1-2 menit.

5. Selesai! Lo dapat alamat seperti:
   https://cybernet-project.vercel.app
   Kalau punya domain sendiri (misal arena27.my.id), tinggal hubungkan
   di Settings > Domains.

CATATAN
-------
- Situs ini 100% frontend, tidak butuh .env / database untuk jalan.
- Update kode: edit -> git add . -> git commit -m "..." -> git push.
  Vercel otomatis redeploy setiap kali push.
