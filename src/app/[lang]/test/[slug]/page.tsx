import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import QuizEngine from "./QuizEngine";
import ComingSoon from "../../../../components/ComingSoon";
import { testSlugs } from "../../../../config/tests";

interface TestData {
  title: string;
  description: string;
  timeEstimation: string;
  questions: any[];
  scoringType?: string;
}

function safeReadJSON(filePath: string): any | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error parsing JSON at ${filePath}:`, e);
    return null;
  }
}

function getTestData(lang: string, slug: string): TestData | null {
  const contentDir = path.join(process.cwd(), "content");
  // Coba file bahasa target
  let data = safeReadJSON(path.join(contentDir, lang, `${slug}.json`));
  if (data) return data;
  // Fallback ke Indonesia
  data = safeReadJSON(path.join(contentDir, "id", `${slug}.json`));
  if (data) {
    console.warn(`⚠️ Using fallback (id) for ${slug} – missing/broken ${lang} translation`);
    return data;
  }
  return null;
}

export async function generateStaticParams() {
  const languages = ["en", "id", "es"];
  return languages.flatMap(lang =>
    testSlugs.map(slug => ({ lang, slug }))
  );
}

export default function TestPage({ params }: { params: { lang: string; slug: string } }) {
  const data = getTestData(params.lang, params.slug);

  if (!data) {
    return <ComingSoon slug={params.slug} />;
  }

  if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
    notFound();
  }

  return (
    <div className="flex-1 flex items-center justify-center py-10 px-4 md:px-6 relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="max-w-2xl w-full bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative z-10">
        <div className="bg-white/5 border-b border-white/10 p-5 md:p-6 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {data.title}
          </h1>
        </div>
        <div className="p-6 md:p-10">
          <QuizEngine data={data} lang={params.lang} slug={params.slug} />
        </div>
      </div>
    </div>
  );
}