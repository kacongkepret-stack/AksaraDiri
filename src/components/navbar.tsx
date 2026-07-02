"use client";

import Link from "next/link";

export default function Navbar({ lang, dict }: { lang: string; dict: any }) {
  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <span className="text-xl font-black tracking-tighter text-white">
            Persona<span className="text-cyan-400">Hub</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <Link href={`/${lang}/category/personality`} className="hover:text-cyan-400 transition-colors">{dict.nav.personality}</Link>
          <Link href={`/${lang}/category/astrology`} className="hover:text-cyan-400 transition-colors">{dict.nav.astrology}</Link>
          <Link href={`/${lang}/category/local`} className="hover:text-cyan-400 transition-colors">{dict.nav.local}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <select 
            defaultValue={lang}
            onChange={(e) => window.location.href = `/${e.target.value}`}
            className="bg-white/5 border border-white/10 text-[10px] font-bold text-white rounded px-2 py-1 outline-none cursor-pointer hover:bg-white/10"
          >
            <option value="id" className="bg-slate-900">ID</option>
            <option value="en" className="bg-slate-900">EN</option>
            <option value="es" className="bg-slate-900">ES</option>
          </select>
        </div>
      </div>
    </header>
  );
}