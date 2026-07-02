"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== KAMUS UI & DATABASE WARNA 3 BAHASA ==========
const DICTIONARY: Record<string, any> = {
  id: {
    ui: {
      title: "🎨 Warna Keberuntungan",
      subtitle: "Temukan warna yang membawa harmoni dan energi positif untukmu",
      btn: "Dapatkan Warna",
      loading: "Menentukan...",
      shareBtn: "📤 Bagikan",
      sharePrefix: "Warna keberuntunganku hari ini adalah",
      disclaimer: "*Warna ini unik untukmu setiap hari. Gunakan pada pakaian atau aksesoris untuk menarik energi baik.",
      copied: "Hasil disalin ke clipboard!"
    },
    colors: [
      { name: "Merah", hex: "#ef4444", meaning: "Keberanian, gairah, dan energi tinggi. Hari ini cocok untuk mengambil tindakan berani." },
      { name: "Biru", hex: "#3b82f6", meaning: "Ketenangan, komunikasi, dan kejernihan pikiran. Ekspresikan perasaanmu." },
      { name: "Hijau", hex: "#22c55e", meaning: "Kesuburan, pertumbuhan, dan keseimbangan. Fokus pada kesehatan dan alam." },
      { name: "Ungu", hex: "#a855f7", meaning: "Spiritualitas, intuisi, dan kemewahan. Dengarkan kata hatimu." },
      { name: "Pink", hex: "#ec4899", meaning: "Cinta, kasih sayang, dan penerimaan. Bukalah hati untuk memberi dan menerima." },
      { name: "Oranye", hex: "#f97316", meaning: "Kreativitas, antusiasme, dan optimisme. Curahkan ide-idemu." },
      { name: "Kuning", hex: "#eab308", meaning: "Kebahagiaan, kecerdasan, dan energi surya. Hari yang cerah untuk belajar." },
      { name: "Hitam", hex: "#111111", meaning: "Kekuatan, misteri, dan perlindungan. Saatnya introspeksi diri." },
      { name: "Putih", hex: "#ffffff", meaning: "Kemurnian, awal baru, dan kedamaian. Lepaskan masa lalu." },
      { name: "Emas", hex: "#fbbf24", meaning: "Kemakmuran, kejayaan, dan pencapaian. Kesuksesan sedang mendekat." }
    ]
  },
  en: {
    ui: {
      title: "🎨 Lucky Color",
      subtitle: "Discover the color that brings you harmony and positive energy",
      btn: "Get Color",
      loading: "Determining...",
      shareBtn: "📤 Share",
      sharePrefix: "My lucky color today is",
      disclaimer: "*This color is unique to you every day. Wear it or use it as an accessory to attract good energy.",
      copied: "Result copied to clipboard!"
    },
    colors: [
      { name: "Red", hex: "#ef4444", meaning: "Courage, passion, and high energy. Today is perfect for taking bold action." },
      { name: "Blue", hex: "#3b82f6", meaning: "Calmness, communication, and mental clarity. Express your feelings." },
      { name: "Green", hex: "#22c55e", meaning: "Fertility, growth, and balance. Focus on health and nature." },
      { name: "Purple", hex: "#a855f7", meaning: "Spirituality, intuition, and luxury. Listen to your heart." },
      { name: "Pink", hex: "#ec4899", meaning: "Love, affection, and acceptance. Open your heart to give and receive." },
      { name: "Orange", hex: "#f97316", meaning: "Creativity, enthusiasm, and optimism. Pour out your ideas." },
      { name: "Yellow", hex: "#eab308", meaning: "Happiness, intelligence, and solar energy. A bright day for learning." },
      { name: "Black", hex: "#111111", meaning: "Power, mystery, and protection. Time for self-introspection." },
      { name: "White", hex: "#ffffff", meaning: "Purity, new beginnings, and peace. Let go of the past." },
      { name: "Gold", hex: "#fbbf24", meaning: "Prosperity, glory, and achievement. Success is approaching." }
    ]
  },
  es: {
    ui: {
      title: "🎨 Color de la Suerte",
      subtitle: "Descubre el color que te trae armonía y energía positiva",
      btn: "Obtener Color",
      loading: "Determinando...",
      shareBtn: "📤 Compartir",
      sharePrefix: "Mi color de la suerte hoy es",
      disclaimer: "*Este color es único para ti cada día. Úsalo en ropa o accesorios para atraer buena energía.",
      copied: "¡Resultado copiado al portapapeles!"
    },
    colors: [
      { name: "Rojo", hex: "#ef4444", meaning: "Coraje, pasión y alta energía. Hoy es perfecto para tomar acciones audaces." },
      { name: "Azul", hex: "#3b82f6", meaning: "Calma, comunicación y claridad mental. Expresa tus sentimientos." },
      { name: "Verde", hex: "#22c55e", meaning: "Fertilidad, crecimiento y equilibrio. Concéntrate en la salud y la naturaleza." },
      { name: "Púrpura", hex: "#a855f7", meaning: "Espiritualidad, intuición y lujo. Escucha a tu corazón." },
      { name: "Rosa", hex: "#ec4899", meaning: "Amor, afecto y aceptación. Abre tu corazón para dar y recibir." },
      { name: "Naranja", hex: "#f97316", meaning: "Creatividad, entusiasmo y optimismo. Vierte tus ideas." },
      { name: "Amarillo", hex: "#eab308", meaning: "Felicidad, inteligencia y energía solar. Un día brillante para aprender." },
      { name: "Negro", hex: "#111111", meaning: "Poder, misterio y protección. Es hora de la introspección." },
      { name: "Blanco", hex: "#ffffff", meaning: "Pureza, nuevos comienzos y paz. Deja ir el pasado." },
      { name: "Oro", hex: "#fbbf24", meaning: "Prosperidad, gloria y logros. El éxito se acerca." }
    ]
  }
};

function getDailyHash(): number {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function LuckyColor({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"];
  const ui = dict.ui;
  const activeColors = dict.colors;

  // Menyimpan index warna, bukan objeknya, agar bisa berubah otomatis jika bahasa di-switch
  const [colorIndex, setColorIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const generateDailyColor = () => {
    setIsLoading(true);
    setTimeout(() => {
      const hash = getDailyHash();
      const index = hash % activeColors.length;
      setColorIndex(index);
      setIsLoading(false);
      setIsGenerated(true);
    }, 500);
  };

  const handleGenerate = () => {
    if (isLoading) return;
    generateDailyColor();
  };

  const handleShare = async () => {
    if (colorIndex === null) return;
    const color = activeColors[colorIndex];
    const shareText = `${ui.sharePrefix} ${color.name}. ✨ ${color.meaning}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: ui.title, text: shareText });
      } catch (e) { console.log(e); }
    } else {
      navigator.clipboard.writeText(shareText);
      alert(ui.copied);
    }
  };

  const color = colorIndex !== null ? activeColors[colorIndex] : null;

  return (
    <div className="w-full max-w-md mx-auto font-sans selection:bg-purple-500/30 px-4 py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
          {ui.title}
        </h2>
        <p className="text-slate-400 text-xs">{ui.subtitle}</p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 shadow-lg shadow-purple-500/25"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {ui.loading}
          </span>
        ) : (
          ui.btn
        )}
      </button>

      {isGenerated && color && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="text-center">
              <div
                className="w-28 h-28 rounded-full mx-auto shadow-lg border-2 border-white/20 transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: color.hex }}
              />
              <h3 className="text-xl font-bold text-white mt-4">{color.name}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mt-2">{color.meaning}</p>
              <button
                onClick={handleShare}
                className="mt-5 text-xs flex items-center justify-center gap-2 mx-auto bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-5 py-2 transition-all"
              >
                📤 {ui.shareBtn}
              </button>

              <p className="text-center text-[10px] text-slate-500 mt-5 italic">{ui.disclaimer}</p>

              {/* INJEKSI PAYWALL MULAI DARI SINI */}
              
            <>
<div className="flex justify-center mt-6 mb-8 border-t border-white/10 pt-6">
              <button 
                onClick={handleShare} 
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-sm font-bold uppercase tracking-wider transition-all active:scale-95 gap-2"
              >
                📤 "Bagikan Hasil"
              </button>
            </div>
            <PremiumPaywall 
                toolName={ui.title.replace("🎨 ", "")} 
                resultId={color.name} 
              />
</>
              {/* SAMPAI SINI */}

            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[10px] text-slate-500 mt-6 italic">
        {ui.disclaimer}
      </div>
    </div>
  );
}