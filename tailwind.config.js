/** @type {import('tailwindcss').Config} */
module.exports = {
  // BAGIAN INI YANG TADI KOSONG/ERROR
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{json,md}", // Supaya warna dari JSON (seperti 'from-indigo-600') terbaca
  ],
  theme: {
    extend: {
      // Kita tambahkan efek glow halus agar tidak Notepad banget
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}