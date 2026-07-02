import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ResultClient from "./ResultClient";

export const dynamic = "force-dynamic";

interface ResultData {
  type: string;
  name: string;
  description: string;
  traits: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
}

function getResultData(
  lang: string,
  testType: string
): Record<string, ResultData> | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      lang,
      "results",
      `${testType}.json`
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch {
    return null;
  }
}

// Terjemahan untuk teks statis di server component (hanya error message)
const translations = {
  id: {
    resultNotFound: "Hasil tidak ditemukan untuk tipe ini.",
    back: "Kembali",
  },
  en: {
    resultNotFound: "Result not found for this type.",
    back: "Back",
  },
  es: {
    resultNotFound: "Resultado no encontrado para este tipo.",
    back: "Volver",
  },
};

export default function ResultPage({
  params,
}: {
  params: { lang: string; testType: string; resultId: string };
}) {
  const { lang, testType, resultId } = params;
  const allResults = getResultData(lang, testType);
  if (!allResults) return notFound();

  const result = allResults[resultId];
  if (!result) {
    const t = translations[lang as keyof typeof translations] || translations.id;
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>{t.resultNotFound}</p>
        <a href={`/${lang}`} className="ml-2 underline">
          {t.back}
        </a>
      </div>
    );
  }

  return <ResultClient result={result} lang={lang} testType={testType} resultId={resultId} />;
}