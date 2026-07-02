"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Option = { text: string; type: string };
type Question = {
  id: string;
  dimension?: string;
  question: string;
  options: Option[];
  correctAnswer?: string;
};
type TestData = {
  title: string;
  description: string;
  timeEstimation: string;
  scoringType?: string;
  questions: Question[];
};

// Terjemahan untuk teks UI kuis (bukan konten soal)
const translations = {
  id: {
    start: "Mulai Tes",
    calculating: "Menghitung...",
    question: "Soal",
    of: "dari",
    loading: "Memproses hasil..."
  },
  en: {
    start: "Start Test",
    calculating: "Calculating...",
    question: "Question",
    of: "of",
    loading: "Processing results..."
  },
  es: {
    start: "Comenzar Test",
    calculating: "Calculando...",
    question: "Pregunta",
    of: "de",
    loading: "Procesando resultados..."
  }
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TEST_LIMITS: Record<string, number> = {
  "mbti": 20,
  "iq": 15,
  "eq": 12,
  "introvert": 10,
  "introvert-extrovert": 10,
  "love-language": 10,
  "attachment-style": 10,
  "mental-age": 10,
  "creativity": 10,
  "leadership": 12,
  "stress-type": 10
};

export default function QuizEngine({
  data,
  lang,
  slug,
}: {
  data: TestData;
  lang: string;
  slug: string;
}) {
  const router = useRouter();
  const t = translations[lang as keyof typeof translations] || translations.id;
  const scoringType = data.scoringType || "mbti";

  const [hasStarted, setHasStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mbtiCounts, setMbtiCounts] = useState<Record<string, number>>({});
  const [answerMap, setAnswerMap] = useState<Record<string, string>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const startQuiz = () => {
    const targetCount = TEST_LIMITS[slug] || data.questions.length;

    if (slug === "mbti") {
      const dims = ["EI", "SN", "TF", "JP"];
      const perDim = Math.floor(targetCount / 4);
      let picked: Question[] = [];
      for (const dim of dims) {
        const pool = data.questions.filter((q) => q.dimension === dim);
        const sh = shuffleArray(pool);
        picked = picked.concat(sh.slice(0, perDim));
      }
      picked = shuffleArray(picked);
      setQuestions(picked);
      setMbtiCounts({});
    } else {
      const shuffled = shuffleArray(data.questions);
      setQuestions(shuffled.slice(0, targetCount));
      if (scoringType === "correct") setAnswerMap({});
      else setMbtiCounts({});
    }
    setCurrentIndex(0);
    setHasStarted(true);
    setIsFinishing(false);
  };

  const handleAnswer = (optionType: string) => {
    if (scoringType === "correct") {
      const newMap = { ...answerMap, [questions[currentIndex].id]: optionType };
      setAnswerMap(newMap);
      if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
      else processResultCorrect(newMap);
    } else {
      const newCounts = { ...mbtiCounts, [optionType]: (mbtiCounts[optionType] || 0) + 1 };
      setMbtiCounts(newCounts);
      if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
      else processResultMBTI(newCounts);
    }
  };

  const processResultCorrect = (finalAnswers: Record<string, string>) => {
    setIsFinishing(true);
    let correct = 0;
    questions.forEach((q) => {
      if (finalAnswers[q.id] === q.correctAnswer) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    let resultId = "beginner";
    if (score >= 80) resultId = "genius";
    else if (score >= 50) resultId = "average";
    localStorage.setItem(`${slug}_result`, resultId);
    localStorage.setItem(`${slug}_confidence`, score.toString());
    router.push(`/${lang}/result/${slug}/${resultId}?confidence=${score}`);
  };

  // LOGIKA PEMROSESAN MBTI & KATEGORI KEPRIBADIAN / SKALA DENGAN MAPPING DINAMIS
  const processResultMBTI = (finalCounts: Record<string, number>) => {
    setIsFinishing(true);
    let resultId = "";
    
    if (slug === "mbti") {
      const E = finalCounts["E"] || 0, I = finalCounts["I"] || 0;
      const S = finalCounts["S"] || 0, N = finalCounts["N"] || 0;
      const T = finalCounts["T"] || 0, F = finalCounts["F"] || 0;
      const J = finalCounts["J"] || 0, P = finalCounts["P"] || 0;
      resultId = (E >= I ? "e" : "i") + (S >= N ? "s" : "n") + (T >= F ? "t" : "f") + (J >= P ? "j" : "p");
    } else {
      // 1. Ekstrak pilihan huruf terbanyak dari jawaban user (A, B, C, atau D)
      const dims = Object.keys(finalCounts);
      const topLetter = dims.length ? dims.reduce((a, b) => finalCounts[a] > finalCounts[b] ? a : b) : "";
      
      // 2. Baca properti 'resultMapping' secara dinamis langsung dari struktur JSON soal
      const mapping = (data as any).resultMapping;
      if (mapping) {
        // Balikkan struktur objek map dari {"em": "A"} menjadi {"A": "em"} agar bisa dievaluasi
        const invertedMapping = Object.fromEntries(
          Object.entries(mapping).map(([key, value]) => [value, key])
        );
        // Set resultId ke ID target (em, sr, ss, sa). Jika mapping luput, gunakan fallback huruf kecil biasa
        resultId = invertedMapping[topLetter] || topLetter.toLowerCase();
      } else {
        resultId = topLetter.toLowerCase();
      }
    }

    const total = Object.values(finalCounts).reduce((a, b) => a + b, 0);
    if (total > 0) {
      const maxCount = Math.max(...Object.values(finalCounts));
      const confidence = Math.round((maxCount / total) * 100);
      localStorage.setItem(`${slug}_result`, resultId);
      localStorage.setItem(`${slug}_confidence`, confidence.toString());
      router.push(`/${lang}/result/${slug}/${resultId}?confidence=${confidence}`);
    } else {
      router.push(`/${lang}/result/${slug}/${resultId}`);
    }
  };

  // ========== PERHITUNGAN ELEMEN RENDER (ARSITEKTUR ZERO-UNMOUNT) ==========
  const q = questions.length > 0 ? questions[currentIndex] : null;
  const progress = questions.length > 0 ? Math.round((currentIndex / questions.length) * 100) : 0;

  return (
    <div suppressHydrationWarning className="w-full">
      
      {/* 1. LAYER LOADING (Sembunyi/Muncul murni menggunakan kelas CSS) */}
      <div className={isFinishing ? "block" : "hidden"}>
        <div className="text-center py-12">
          <div className="animate-spin text-5xl mb-6">⚙️</div>
          <h2 className="text-xl font-bold text-white">{t.loading}</h2>
        </div>
      </div>

      {/* 2. LAYER HALAMAN AWAL KUIS (Sembunyi/Muncul murni menggunakan kelas CSS) */}
      <div className={!hasStarted && !isFinishing ? "block" : "hidden"}>
        <div className="text-center">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 mb-6 text-3xl items-center justify-center">
            {slug === "iq" ? "🧩" : "🧠"}
          </div>
          <p className="text-slate-300 text-sm mb-8">{data.description}</p>
          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-10 rounded-xl hover:scale-105 transition-transform"
          >
            {t.start}
          </button>
        </div>
      </div>

      {/* 3. LAYER KARTU PERTANYAAN AKTIF (Sembunyi/Muncul murni menggunakan kelas CSS) */}
      <div className={hasStarted && !isFinishing && q ? "block" : "hidden"}>
        {q && (
          <div className="w-full">
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-3">
                <span>{t.question} {currentIndex + 1}/{questions.length}</span>
                <span className="text-cyan-400">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-300" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
            <h2 className="text-lg font-bold text-white mb-8 text-center">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.type)}
                  className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all text-sm text-slate-300 hover:text-white flex items-center"
                >
                  <span className="w-8 font-bold text-slate-500">{String.fromCharCode(65 + i)}.</span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}