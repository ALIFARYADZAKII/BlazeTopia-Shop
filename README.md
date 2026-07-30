# BlazeTopia Shop

Toko online untuk pemesanan role in-game berbasis Supabase.

## 🚀 Cara Deploy

### Opsi 1: Netlify (Gratis)
1. Upload semua file ke repository GitHub
2. Login ke netlify.com → New site from Git
3. Pilih repo → Deploy
4. Selesai! URL akan otomatis dibuat

### Opsi 2: Vercel (Gratis)
1. Upload semua file ke repository GitHub
2. Login ke vercel.com → Add New → Project
3. Pilih repo → Deploy
4. Selesai!

### Opsi 3: GitHub Pages
1. Upload semua file ke repo GitHub
2. Settings → Pages → Branch: main → Save
3. Akses di `https://username.github.io/repo-name`

## 🔧 Persiapan Supabase
1. Buat akun di supabase.com (gratis)
2. Buat project baru
3. Buat table `orders` dengan kolom:
   - `id` (uuid, primary key, default gen_random_uuid())
   - `item` (text)
   - `price` (text)
   - `growId` (text)
   - `worldName` (text)
   - `email` (text)
   - `uid` (text)
   - `username` (text)
   - `timestamp` (bigint)
   - `status` (text, default 'pending')
   - `proofUrl` (text)
   - `proofUploaded` (bigint)
4. Enable Row Level Security (RLS) dengan policy:
   - `INSERT` untuk semua (anon)
   - `SELECT` untuk authenticated users
   - `UPDATE` untuk authenticated users

## 📁 Struktur File
