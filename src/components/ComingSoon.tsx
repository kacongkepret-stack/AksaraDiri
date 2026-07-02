import Link from "next/link";

export default function ComingSoon({ slug }: { slug: string }) {
  const displayName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl">🚧</span>
        <h1 className="text-2xl font-black text-white mt-4 mb-2">
          {displayName}
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Fitur ini sedang dalam pengembangan. Kami sedang menyiapkan konten terbaik untuk kamu.
        </p>
        <Link
          href="/id"
          className="inline-flex items-center rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-all"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}