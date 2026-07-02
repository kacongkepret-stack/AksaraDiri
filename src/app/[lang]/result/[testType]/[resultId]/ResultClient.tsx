"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import PremiumPaywall from "../../../../../components/PremiumPaywall";

interface ResultData {
  type: string;
  name: string;
  description: string;
  traits: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
}

const translations = {
  id: {
    resultTitle: "Hasil Tes Kepribadian",
    confidenceLabel: "Tingkat Keyakinan",
    strengths: "Kelebihan Utama",
    weaknesses: "Tantangan & Kelemahan",
    share: "Bagikan Hasil",
    retake: "Ulangi Tes",
    home: "Kembali ke Beranda"
  },
  en: {
    resultTitle: "Personality Test Result",
    confidenceLabel: "Confidence Level",
    strengths: "Core Strengths",
    weaknesses: "Challenges & Weaknesses",
    share: "Share Result",
    retake: "Retake Test",
    home: "Back to Home"
  },
  es: {
    resultTitle: "Resultado del Test",
    confidenceLabel: "Nivel de Confianza",
    strengths: "Fortalezas Principales",
    weaknesses: "Desafíos y Debilidades",
    share: "Compartir Resultado",
    retake: "Repetir Test",
    home: "Volver al Inicio"
  }
};

export default function ResultClient({
  result,
  lang,
  testType,
  resultId,
}: {
  result: ResultData;
  lang: string;
  testType: string;
  resultId: string;
}) {
  const searchParams = useSearchParams();
  const urlConfidence = searchParams.get("confidence");
  
  // STATE MOUNT GUARD MUTLAK
  const [isMounted, setIsMounted] = useState(false);
  const [confidence, setConfidence] = useState<string | null>(null);

  const t = translations[lang as keyof typeof translations] || translations.id;

  useEffect(() => {
    setIsMounted(true);
    if (urlConfidence) {
      setConfidence(urlConfidence);
    } else {
      const saved = localStorage.getItem(`${testType}_confidence`);
      if (saved) setConfidence(saved);
    }
  }, [urlConfidence, testType]);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#22d3ee", "#a855f7", "#f43f5e"],
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      confetti.reset();
    };
  }, [isMounted]);

  const handleShare = () => {
    const text = `${t.resultTitle}: ${result.type} - ${result.name}! Cek tipe karakter Anda juga di AksaraDiri.`;
    const url = `https://aksaradiri.my.id/${lang}/result/${testType}/${resultId}`;
    if (navigator.share) {
      navigator.share({ title: t.resultTitle, text, url });
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        "_blank"
      );
    }
  };

  // BENTENG PERTAHANAN SKELETON
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(34,211,238,0.4)]"></div>
        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse">Menyiapkan Hasil...</p>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="relative min-h-screen bg-transparent text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="relative z-10 max-w-xl w-full bg-slate-900/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
        
        <h2 className="text-sm text-cyan-400 font-bold uppercase tracking-widest mb-2">
          {t.resultTitle}
        </h2>
        <h1 className="text-4xl font-black mb-1 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          {result.type}
        </h1>
        <p className="text-xl text-cyan-300/90 mb-6 font-medium">“{result.name}”</p>

        {confidence && (
          <div className="mt-2 mb-6 bg-white/5 rounded-full px-5 py-2 inline-flex items-center gap-2 border border-white/10 shadow-inner">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.confidenceLabel}</span>
            <span className="text-xl font-black text-cyan-400">{confidence}%</span>
          </div>
        )}

        <p className="text-slate-300 text-sm leading-relaxed mb-6 text-justify bg-white/[0.01] p-4 rounded-xl border border-white/5">
          {result.description}
        </p>

        <div className="space-y-3 mb-8 text-left">
          {Object.entries(result.traits).map(([key, val]) => (
            <div key={key} className="bg-transparent/40 p-2.5 rounded-lg border border-white/[0.02]">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                <span>{key}</span>
                <span className="text-cyan-400">{val}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 shadow-sm">
            <h3 className="text-xs uppercase font-black text-emerald-400 mb-2.5 tracking-widest flex items-center gap-1">
              <span>✓</span> {t.strengths}
            </h3>
            <ul className="space-y-1.5">
              {result.strengths.map((s) => (
                <li key={s} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 shadow-sm">
            <h3 className="text-xs uppercase font-black text-rose-400 mb-2.5 tracking-widest flex items-center gap-1">
              <span>✗</span> {t.weaknesses}
            </h3>
            <ul className="space-y-1.5">
              {result.weaknesses.map((w) => (
                <li key={w} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center border-b border-white/5 pb-8">
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-white/20 transition-all active:scale-95"
          >
            📤 {t.share}
          </button>

          <Link
            href={`/${lang}/test/${testType}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 px-5 py-3 text-xs font-black uppercase tracking-wider text-cyan-300 hover:bg-cyan-500/30 transition-all active:scale-95"
          >
            🔁 {t.retake}
          </Link>

          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-white/10 transition-all active:scale-95"
          >
            🏠 {t.home}
          </Link>
        </div>

        <div className="mt-8 pt-2">
          <PremiumPaywall 
            toolName={`Tes ${testType.toUpperCase()}`} 
            resultId={`${testType}-${resultId}`} 
          />
        </div>

      </div>
    </div>
  );
}