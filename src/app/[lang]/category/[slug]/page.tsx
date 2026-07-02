import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { toolSlugs } from "../../../../config/tools";

interface Feature {
  name: string;
  id: string;
  info: string;
  time: string;
  q: string;
  icon: string;
}

interface CategoryData {
  title: string;
  icon: string;
  desc: string;
  bgGradient: string;
  glowColor: string;
  features: Feature[];
}

// Fungsi untuk membaca file kategori sesuai bahasa
function getCategoryData(lang: string, slug: string): CategoryData | null {
  const filePath = path.join(process.cwd(), "content", lang, "categories", `${slug}.json`);
  const fallbackPath = path.join(process.cwd(), "content", "id", "categories", `${slug}.json`);
  
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    // Jika file tidak ada, pakai fallback bahasa Indonesia
    if (fs.existsSync(fallbackPath)) {
      return JSON.parse(fs.readFileSync(fallbackPath, "utf8"));
    }
    return null;
  } catch (error) {
    console.error(`Error loading category ${slug} for lang ${lang}:`, error);
    return null;
  }
}

// Daftar slug yang valid
const validSlugs = ["personality", "astrology", "local", "viral"];

export default function CategoryPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = params;

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const category = getCategoryData(lang, slug);
  if (!category) notFound();

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${category.bgGradient} text-white py-10 px-4 sm:px-6 overflow-hidden`}>
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full ${category.glowColor} blur-[100px] -z-10 pointer-events-none`} />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 pb-6 border-b border-white/10">
          <span className="text-4xl sm:text-5xl drop-shadow-lg">{category.icon}</span>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">{category.title}</h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">{category.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {category.features.map((feature) => {
            const isTool = toolSlugs.includes(feature.id);
            const href = isTool
              ? `/${lang}/tools/${feature.id}`
              : `/${lang}/test/${feature.id}`;

            return (
              <Link
                key={feature.id}
                href={href}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:bg-white/[0.08] flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">{feature.icon}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                    →
                  </span>
                </div>
                <h3 className="font-bold text-white text-[15px] mb-1.5 leading-tight">{feature.name}</h3>
                <p className="text-[11px] md:text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">{feature.info}</p>
                
                <div className="mt-auto flex items-center justify-between text-[10px] font-bold text-slate-500 pt-3 border-t border-white/5 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md">
                    ⏱️ {feature.time}
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md">
                    📝 {feature.q}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}