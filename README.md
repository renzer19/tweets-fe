# 🐦 Chirp - Micro-Blogging API Gateway (Frontend)
### 🚀 Live Demo: GDG OC BINUS BANDUNG - 27 MEI 2026

Repository ini berisi *source code* bagian antarmuka pengguna (Frontend) untuk sesi *live demo* di acara **Google Developer Groups (GDG) on Campus - BINUS Bandung**.

Proyek "Chirp" (Mini Twitter Clone) ini mendemonstrasikan implementasi integrasi API, manajemen *state* untuk autentikasi (JWT), dan simulasi respons infrastruktur *backend* (seperti *Rate Limiting* dan *Error Handling*) di sisi klien.

---

## 🛠️ Tech Stack
* **Build Tool:** Vite
* **Library:** React.js
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Hooks (`useState`, `useEffect`)

---

## ✨ Fitur Utama (Live Demo Scenarios)
1. **Authentication Flow:** Simulasi Register & Login dengan token JWT.
2. **Timeline (GET):** Mengambil data (tweets) secara *real-time* dari backend Express.
3. **Compose Tweet (POST):** Mengirim data baru dengan menyertakan *Authorization Header* (Bearer Token).
4. **Rate Limit Demo (PATCH):** Fitur "Like" yang sengaja disiapkan untuk memancing *error* `429 Too Many Requests` jika ditekan secara *brute-force*, mendemonstrasikan pertahanan *backend*.

---

## ⚙️ Persiapan (Prerequisites)
Pastikan kamu sudah memiliki [Node.js](https://nodejs.org/) (direkomendasikan versi 18 atau terbaru) terinstal di komputermu sebelum menjalankan proyek ini.

---

## 🚀 SETUP & INSTALASI

### 1. Clone Repository
Buka terminal dan jalankan perintah berikut:
```bash
git clone (https://github.com/renzer19/tweets-fe.git)
cd front-end-gdg-oc
npm install
