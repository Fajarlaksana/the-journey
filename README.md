<div align="center">

<br/>

# 🚗 TheJourney

### *Platform media otomotif modern untuk memamerkan mobil modifikasi dari berbagai event.*
### *A modern automotive media platform for showcasing modified cars from automotive events.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-Auth-purple?style=flat-square)](https://next-auth.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br/>

[🚀 Live Demo](#) · [📖 Dokumentasi](#-daftar-isi--table-of-contents) · [🐛 Report Bug](issues) · [✨ Request Feature](issues)

<br/>

---

</div>

## 📋 Daftar Isi / Table of Contents

- [Tentang Proyek / About](#-tentang-proyek--about)
- [Fitur / Features](#-fitur--features)
- [Tech Stack](#-tech-stack)
- [Memulai / Getting Started](#-memulai--getting-started)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
- [Struktur Proyek / Project Structure](#-struktur-proyek--project-structure)
- [API Endpoints](#-api-endpoints)
- [Design & Performance](#-design--performance)
- [Deployment](#-deployment)
- [Kontribusi / Contributing](#-kontribusi--contributing)
- [Lisensi / License](#-lisensi--license)

<br/>

---

## 🌟 Tentang Proyek / About

**🇮🇩 Bahasa Indonesia**

**TheJourney** adalah platform media otomotif berkinerja tinggi yang dirancang untuk memamerkan mobil-mobil modifikasi dari berbagai event otomotif. Platform ini hadir dalam dua bagian utama: **website publik** untuk pengunjung yang ingin menjelajahi build mobil, dan **admin dashboard** untuk pengelolaan konten secara lengkap.

**🇬🇧 English**

**TheJourney** is a high-performance automotive media platform designed to showcase modified cars from automotive events. It comes in two main parts: a **public website** for visitors to explore car builds, and a full-featured **admin dashboard** for content management.

<br/>

---

## ✨ Fitur / Features

### 🌐 Public Website

| Halaman / Page | Deskripsi / Description |
|---|---|
| 🏠 **Homepage** | Hero section, featured builds, car of the month, latest & trending builds |
| 🚗 **Car Builds** | Browse semua build dengan pencarian & filter (brand, kategori, event) / Browse all builds with search & filters |
| 📄 **Car Detail** | Full gallery (6 foto), spesifikasi, penghargaan, related builds / Full gallery (6 images), specs, awards, related builds |
| 📅 **Event Timeline** | Jelajahi event berdasarkan tahun, lihat semua mobil per event / Browse events by year, view all cars per event |
| 🔍 **SEO Optimized** | Metadata, OpenGraph, structured data, sitemap.xml, robots.txt |

### 🔧 Admin Dashboard

| Fitur / Feature | Deskripsi / Description |
|---|---|
| 🔐 **Authentication** | Login aman dengan NextAuth / Secure login with NextAuth |
| 📊 **Dashboard** | Statistik overview & recent builds / Overview stats & recent builds |
| 🚗 **Car Management** | CRUD operasi untuk semua build / CRUD operations for all car builds |
| 🖼️ **Image Upload** | Drag & drop upload, tepat 6 gambar per mobil / Drag & drop, exactly 6 images per car |
| 📅 **Event Management** | Kelola event otomotif / Manage automotive events |
| 🏷️ **Brand Management** | Kelola merek mobil / Manage car brands |
| 🗂️ **Category Management** | Kelola kategori modifikasi / Manage modification categories |
| 🏆 **Award Management** | Kelola penghargaan event / Manage event awards |

<br/>

---

## 🛠 Tech Stack

| Layer | Teknologi / Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), shadcn/ui |
| **Fonts** | Inter + Oswald |
| **Hosting (recommended)** | [Vercel](https://vercel.com/) + [Railway](https://railway.app/) / [Supabase](https://supabase.com/) |

<br/>

---

## 🚀 Memulai / Getting Started

### Prasyarat / Prerequisites

**🇮🇩** Pastikan sudah menginstal:

**🇬🇧** Make sure you have installed:

- [Node.js](https://nodejs.org/) `>= 18.x`
- [PostgreSQL](https://www.postgresql.org/) database
- [npm](https://www.npmjs.com/) atau/or [yarn](https://yarnpkg.com/)

### Instalasi / Installation

```bash
# 1. Clone repository
git clone https://github.com/Fajarlaksana/thejourney.git

# 2. Masuk ke direktori / Navigate to directory
cd thejourney

# 3. Install dependencies
npm install

# 4. Setup environment variables (lihat bagian berikutnya / see next section)
cp .env.example .env

# 5. Setup database
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema ke database / Push schema to database
npm run db:seed       # Seed data awal / Seed initial data

# 6. Jalankan development server / Start development server
npm run dev
```

Buka / Open [http://localhost:3000](http://localhost:3000) di browser.

### Default Admin Credentials

**🇮🇩** Setelah menjalankan seed script, gunakan kredensial berikut:

**🇬🇧** After running the seed script, use these credentials:

```
Email    : admin@thejourney.com
Password : admin123
```

> ⚠️ **Penting / Important:** Ganti password default sebelum deploy ke production! / Change the default password before deploying to production!

<br/>

---

## 🔑 Environment Variables

Buat file `.env` dari template / Create `.env` from template:

```bash
cp .env.example .env
```

Isi variabel berikut / Fill in the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/thejourney?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

<br/>

---

## 🗄 Database

### Skema / Schema

| Tabel / Table | Deskripsi / Description |
|---|---|
| `User` | Admin users untuk dashboard / Admin users for dashboard |
| `Event` | Event otomotif (nama, tahun, lokasi) / Automotive events (name, year, location) |
| `Brand` | Merek mobil (Toyota, Nissan, BMW, dll.) / Car brands |
| `Category` | Kategori modifikasi (JDM, Stance, Track, dll.) / Modification categories |
| `Award` | Penghargaan event (Winner, Best Engine, dll.) / Event awards |
| `Car` | Build mobil beserta spesifikasi / Car builds with specifications |
| `CarImage` | Gambar mobil, tepat 6 per mobil / Car images, exactly 6 per car |

### Relasi / Relationships

```
Event ──────→ has many → Cars
Car ──────→ belongs to → Brand
Car ──────→ belongs to → Category
Car ──────→ belongs to → Event
Car ──────→ may have  → Award
Car ──────→ has many  → CarImages (6 images)
```

### Scripts Database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema ke database / Push schema to database
npm run db:migrate    # Jalankan migrasi / Run migrations
npm run db:seed       # Seed data awal / Seed initial data
```

<br/>

---

## 📁 Struktur Proyek / Project Structure

```
thejourney/
│
├── 📄 next.config.js              # Next.js configuration
├── 📄 tailwind.config.js          # Tailwind CSS configuration
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 package.json                # Dependencies & scripts
├── 📄 .env.example                # Environment variables template
│
├── 📂 prisma/
│   ├── schema.prisma              # Database schema (User, Event, Brand, Car, dll.)
│   └── seed.ts                    # Seed data awal / Initial seed data
│
├── 📂 public/
│   └── uploads/                   # Gambar yang diupload / Uploaded images
│
└── 📂 src/
    │
    ├── 📂 app/                    # Next.js App Router
    │   ├── 📂 admin/              # Halaman admin dashboard / Admin dashboard pages
    │   ├── 📂 api/                # Public API routes
    │   ├── 📂 builds/             # Halaman publik car builds / Public car build pages
    │   ├── 📂 events/             # Halaman publik events / Public event pages
    │   ├── layout.tsx             # Root layout
    │   ├── page.tsx               # Homepage
    │   ├── sitemap.ts             # Dynamic sitemap generator
    │   └── robots.ts              # Robots.txt generator
    │
    ├── 📂 components/
    │   ├── 📂 admin/              # Komponen admin / Admin components
    │   ├── 📂 builds/             # Komponen build / Build-related components
    │   ├── 📂 cars/               # Komponen tampilan mobil / Car display components
    │   ├── 📂 events/             # Komponen event / Event components
    │   ├── 📂 homepage/           # Section homepage / Homepage sections
    │   ├── 📂 navigation/         # Navbar & Footer
    │   └── 📂 ui/                 # Base UI components
    │
    └── 📂 lib/
        ├── prisma.ts              # Prisma client singleton
        └── utils.ts               # Utility functions
```

<br/>

---

## 🔌 API Endpoints

### Public

| Method | Endpoint | Deskripsi / Description |
|---|---|---|
| `GET` | `/api/cars` | Daftar semua mobil yang dipublish / List all published cars |
| `GET` | `/api/cars/[slug]` | Detail mobil / Car details |
| `GET` | `/api/events` | Daftar semua event / List all events |
| `GET` | `/api/events/[slug]` | Detail event / Event details |

### Admin (Protected)

| Method | Endpoint | Deskripsi / Description |
|---|---|---|
| `POST` | `/admin/api/cars` | Buat build baru / Create car build |
| `DELETE` | `/admin/api/cars/[id]` | Hapus build / Delete car build |
| `PATCH` | `/admin/api/cars/[id]/toggle` | Toggle status publish / Toggle publish status |
| `POST` | `/admin/api/upload` | Upload gambar / Upload image |
| `DELETE` | `/admin/api/events/[id]` | Hapus event / Delete event |
| `DELETE` | `/admin/api/brands/[id]` | Hapus brand / Delete brand |
| `DELETE` | `/admin/api/categories/[id]` | Hapus kategori / Delete category |
| `DELETE` | `/admin/api/awards/[id]` | Hapus penghargaan / Delete award |

<br/>

---

## 🎨 Design & Performance

### Visual Style
- 🖤 Dark theme dengan aksen warna merah / Dark theme with red accent colors
- 📸 Foto otomotif berukuran besar / Large automotive photography
- 🗞️ Minimal UI dengan editorial layout
- 🔤 Typography kuat: **Inter** + **Oswald**

### Animasi / Animations
- Page transitions dengan Framer Motion
- Hover effects pada card & tombol / Hover effects on cards & buttons
- Image reveal animations
- Smooth scroll effects & gallery transitions

### Performance
- Next.js Image optimization
- Lazy loading untuk gambar / Lazy loading for images
- Server-side rendering (SSR)
- Static generation untuk halaman mobil / Static generation for car pages
- Minimal JavaScript bundle

### SEO
- Next.js Metadata API
- OpenGraph tags untuk social sharing / for social sharing
- Twitter cards
- Structured data (JSON-LD)
- Dynamic sitemap.xml & robots.txt

### Security
- Autentikasi aman dengan NextAuth / Secure authentication with NextAuth
- Protected admin routes
- Input & file upload validation
- SQL injection prevention (Prisma ORM)
- XSS protection

<br/>

---

## 🚢 Deployment

### Environment Variables (Production)

```env
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-strong-production-secret
```

### Recommended Stack

| Layanan / Service | Kegunaan / Purpose |
|---|---|
| [Vercel](https://vercel.com/) | Hosting Next.js (terbaik / best for Next.js) |
| [Railway](https://railway.app/) | PostgreSQL database |
| [Supabase](https://supabase.com/) | Alternatif PostgreSQL / Alternative PostgreSQL |

### Build & Start Commands

```bash
npm run build    # Build untuk production / Build for production
npm run start    # Jalankan production server / Start production server
```

<br/>

---

## 📜 Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm run start         # Production server
npm run lint          # Run ESLint
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema ke database
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed initial data
```

<br/>

---

## 🤝 Kontribusi / Contributing

**🇮🇩** Kontribusi sangat disambut! Silakan buat issue atau pull request.

**🇬🇧** Contributions are welcome! Feel free to open an issue or submit a pull request.

```bash
# 1. Fork repository ini / Fork this repository

# 2. Buat branch baru / Create a new branch
git checkout -b feature/nama-fitur

# 3. Commit perubahan / Commit your changes
git commit -m "feat: tambah fitur X"

# 4. Push ke branch / Push to branch
git push origin feature/nama-fitur

# 5. Buka Pull Request / Open a Pull Request
```

<br/>
---

<div align="center">

Dibuat dengan ❤️ untuk para pecinta otomotif di seluruh dunia

*Built with ❤️ for car enthusiasts worldwide*

<br/>

**TheJourney — Every build has a story.**

</div>
