"use client";

export default function LanguageSwitcher({ lang }: { lang: string }) {
  return (
    <select
      defaultValue={lang}
      onChange={(e) => {
        window.location.href = `/${e.target.value}`;
      }}
      className="bg-white/5 border border-white/10 text-white rounded-lg font-semibold text-sm py-2 px-3 focus:ring-2 focus:ring-cyan-500 cursor-pointer outline-none transition-colors hover:bg-white/10"
    >
      <option value="id" className="bg-slate-900 text-white">ID</option>
      <option value="en" className="bg-slate-900 text-white">EN</option>
      <option value="es" className="bg-slate-900 text-white">ES</option>
    </select>
  );
}