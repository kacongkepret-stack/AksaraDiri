"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Angka Keberuntungan",
    badge: "Ultra Premium",
    subtitle: "Temukan angka keberuntungan personal Anda + makna tersembunyi di baliknya berdasarkan numerologi.",
    shareBtn: "Bagikan",
    inputs: {
      generate: "✨ Ambil Angka Keberuntungan ✨",
      generating: "Menyusun angka...",
      birthdayLabel: "Personalisasi dengan tanggal lahir (numerologi)",
      copyBtn: "📋 Salin Angka & Arti",
      historyLabel: "Riwayat Terakhir",
    },
    labels: {
      yourNumber: "Angka Keberuntungan Anda",
      meaning: "Makna",
      disclaimer: "*Gunakan angka ini sebagai referensi positif untuk keputusan Anda hari ini.",
      note: "Setiap angka memiliki getaran energi unik dalam numerologi.",
      birthdayNote: "Angka dihasilkan dari Life Path + energi acak.",
      randomNote: "Angka dihasilkan secara acak murni. Centang opsi tanggal lahir untuk hasil lebih personal.",
    },
    quote: "\"Angka bukanlah takdir, tapi peta yang membantumu menavigasi kehidupan.\"",
  },
  en: {
    title: "Lucky Number",
    badge: "Ultra Premium",
    subtitle: "Discover your personal lucky number + the hidden meaning behind it based on numerology.",
    shareBtn: "Share",
    inputs: {
      generate: "✨ Get Lucky Number ✨",
      generating: "Compiling number...",
      birthdayLabel: "Personalize with birth date (numerology)",
      copyBtn: "📋 Copy Number & Meaning",
      historyLabel: "Last History",
    },
    labels: {
      yourNumber: "Your Lucky Number",
      meaning: "Meaning",
      disclaimer: "*Use this number as a positive reference for your decisions today.",
      note: "Every number has a unique energy vibration in numerology.",
      birthdayNote: "Number generated from Life Path + random energy.",
      randomNote: "Number generated purely random. Check birth date option for more personal result.",
    },
    quote: "\"Numbers are not destiny, but a map to help you navigate life.\"",
  },
  es: {
    title: "Número de la Suerte",
    badge: "Ultra Premium",
    subtitle: "Descubre tu número de la suerte personal + el significado oculto detrás de él basado en numerología.",
    shareBtn: "Compartir",
    inputs: {
      generate: "✨ Obtener Número de la Suerte ✨",
      generating: "Compilando número...",
      birthdayLabel: "Personalizar con fecha de nacimiento (numerología)",
      copyBtn: "📋 Copiar Número y Significado",
      historyLabel: "Último Historial",
    },
    labels: {
      yourNumber: "Tu Número de la Suerte",
      meaning: "Significado",
      disclaimer: "*Usa este número como referencia positiva para tus decisiones hoy.",
      note: "Cada número tiene una vibración energética única en numerología.",
      birthdayNote: "Número generado a partir del Camino de Vida + energía aleatoria.",
      randomNote: "Número generado puramente al azar. Marca la opción de fecha de nacimiento para un resultado más personal.",
    },
    quote: "\"Los números no son el destino, sino un mapa para ayudarte a navegar la vida.\"",
  },
};

// ========== DATABASE ARTI ANGKA MULTI-BAHASA ==========
const NUMBER_MEANINGS_ML: Record<number, Record<string, string>> = {
  1: {
    id: "Angka pemimpin. Anda memiliki energi untuk memulai sesuatu yang baru.",
    en: "Leader number. You have the energy to start something new.",
    es: "Número líder. Tienes la energía para comenzar algo nuevo.",
  },
  2: {
    id: "Keseimbangan dan kemitraan. Saatnya menjalin hubungan harmonis.",
    en: "Balance and partnership. Time to build harmonious relationships.",
    es: "Equilibrio y asociación. Es momento de construir relaciones armoniosas.",
  },
  3: {
    id: "Kreativitas dan ekspresi. Gunakan bakat Anda untuk berkomunikasi.",
    en: "Creativity and expression. Use your talent to communicate.",
    es: "Creatividad y expresión. Usa tu talento para comunicarte.",
  },
  4: {
    id: "Stabilitas dan kerja keras. Bangun fondasi yang kokoh untuk masa depan.",
    en: "Stability and hard work. Build a solid foundation for the future.",
    es: "Estabilidad y trabajo duro. Construye una base sólida para el futuro.",
  },
  5: {
    id: "Kebebasan dan petualangan. Jangan takut mengambil risiko terukur.",
    en: "Freedom and adventure. Don't be afraid to take calculated risks.",
    es: "Libertad y aventura. No tengas miedo de tomar riesgos calculados.",
  },
  6: {
    id: "Cinta dan tanggung jawab. Fokus pada keluarga dan komunitas.",
    en: "Love and responsibility. Focus on family and community.",
    es: "Amor y responsabilidad. Enfócate en la familia y la comunidad.",
  },
  7: {
    id: "Introspeksi dan kebijaksanaan. Waktu yang tepat untuk merenung dan belajar.",
    en: "Introspection and wisdom. The right time to reflect and learn.",
    es: "Introspección y sabiduría. El momento adecuado para reflexionar y aprender.",
  },
  8: {
    id: "Kelimpahan dan kekuasaan. Peluang finansial besar sedang mendekat.",
    en: "Abundance and power. Big financial opportunities are approaching.",
    es: "Abundancia y poder. Se acercan grandes oportunidades financieras.",
  },
  9: {
    id: "Kemanusiaan dan kebijaksanaan. Bagikan kebaikan kepada orang lain.",
    en: "Humanity and wisdom. Share kindness with others.",
    es: "Humanidad y sabiduría. Comparte bondad con los demás.",
  },
  10: {
    id: "Awal baru dan potensi penuh. Anda berada di jalur yang benar.",
    en: "New beginning and full potential. You are on the right path.",
    es: "Nuevo comienzo y potencial completo. Estás en el camino correcto.",
  },
  11: {
    id: "Intuisi tinggi dan pencerahan. Dengarkan suara hati Anda.",
    en: "High intuition and enlightenment. Listen to your inner voice.",
    es: "Alta intuición y iluminación. Escucha tu voz interior.",
  },
  12: {
    id: "Harmoni dan penyelesaian. Siklus lama berakhir, siklus baru dimulai.",
    en: "Harmony and completion. Old cycles end, new cycles begin.",
    es: "Armonía y finalización. Los ciclos antiguos terminan, los nuevos comienzan.",
  },
  13: {
    id: "Transformasi. Perubahan besar akan membawa kebaikan.",
    en: "Transformation. Big changes will bring goodness.",
    es: "Transformación. Grandes cambios traerán bondad.",
  },
  14: {
    id: "Adaptasi. Fleksibilitas adalah kunci kesuksesan Anda.",
    en: "Adaptation. Flexibility is the key to your success.",
    es: "Adaptación. La flexibilidad es la clave de tu éxito.",
  },
  15: {
    id: "Pengaruh magnetis. Anda akan menarik orang dan peluang.",
    en: "Magnetic influence. You will attract people and opportunities.",
    es: "Influencia magnética. Atraerás personas y oportunidades.",
  },
  16: {
    id: "Pelepasan. Lepaskan apa yang tidak lagi melayani Anda.",
    en: "Release. Let go of what no longer serves you.",
    es: "Liberación. Suelta lo que ya no te sirve.",
  },
  17: {
    id: "Kekuatan spiritual. Iman Anda akan diuji dan diperkuat.",
    en: "Spiritual strength. Your faith will be tested and strengthened.",
    es: "Fuerza espiritual. Tu fe será probada y fortalecida.",
  },
  18: {
    id: "Materialisme seimbang. Keuangan baik, tapi jangan lupakan hati.",
    en: "Balanced materialism. Finances are good, but don't forget the heart.",
    es: "Materialismo equilibrado. Las finanzas están bien, pero no olvides el corazón.",
  },
  19: {
    id: "Kemandirian. Percaya pada kemampuan diri sendiri.",
    en: "Independence. Believe in your own abilities.",
    es: "Independencia. Cree en tus propias habilidades.",
  },
  20: {
    id: "Kebangkitan. Waktu istirahat dan menyegarkan pikiran.",
    en: "Awakening. Time to rest and refresh the mind.",
    es: "Despertar. Tiempo para descansar y refrescar la mente.",
  },
  21: {
    id: "Pencapaian dunia. Sukses yang layak dirayakan.",
    en: "Worldly achievement. Success worth celebrating.",
    es: "Logro mundano. Éxito digno de celebrar.",
  },
  22: {
    id: "Master Builder. Anda mampu mewujudkan mimpi besar menjadi nyata.",
    en: "Master Builder. You can turn big dreams into reality.",
    es: "Maestro Constructor. Puedes convertir grandes sueños en realidad.",
  },
  23: {
    id: "Dukungan dari alam semesta. Mintalah bantuan, itu akan datang.",
    en: "Support from the universe. Ask for help, it will come.",
    es: "Apoyo del universo. Pide ayuda, llegará.",
  },
  24: {
    id: "Harmoni rumah tangga. Keluarga menjadi sumber energi positif.",
    en: "Household harmony. Family becomes a source of positive energy.",
    es: "Armonía del hogar. La familia se convierte en fuente de energía positiva.",
  },
  25: {
    id: "Perubahan positif melalui pengalaman. Jalan terjal akan berbuah manis.",
    en: "Positive change through experience. The rocky road will bear sweet fruit.",
    es: "Cambio positivo a través de la experiencia. El camino rocoso dará frutos dulces.",
  },
  26: {
    id: "Keseimbangan memberi dan menerima. Jangan terlalu ekstrem.",
    en: "Balance of giving and receiving. Don't be too extreme.",
    es: "Equilibrio de dar y recibir. No seas demasiado extremo.",
  },
  27: {
    id: "Empati tinggi. Anda bisa menyembuhkan luka orang lain.",
    en: "High empathy. You can heal others' wounds.",
    es: "Alta empatía. Puedes curar las heridas de los demás.",
  },
  28: {
    id: "Kekayaan melalui kerja cerdas, bukan hanya keras.",
    en: "Wealth through smart work, not just hard work.",
    es: "Riqueza a través del trabajo inteligente, no solo del trabajo duro.",
  },
  29: {
    id: "Kepekaan psikis. Percaya pada firasat Anda.",
    en: "Psychic sensitivity. Trust your gut feelings.",
    es: "Sensibilidad psíquica. Confía en tus corazonadas.",
  },
  30: {
    id: "Ekspresi artistik. Biarkan jiwa Anda berbicara lewat karya.",
    en: "Artistic expression. Let your soul speak through your work.",
    es: "Expresión artística. Deja que tu alma hable a través de tu obra.",
  },
  31: {
    id: "Kepraktisan dan ambisi. Tetap fokus pada tujuan.",
    en: "Practicality and ambition. Stay focused on your goals.",
    es: "Práctica y ambición. Mantente enfocado en tus metas.",
  },
  32: {
    id: "Persatuan dalam keragaman. Bekerja sama dengan orang berbeda.",
    en: "Unity in diversity. Work with different people.",
    es: "Unidad en la diversidad. Trabaja con personas diferentes.",
  },
  33: {
    id: "Guru spiritual. Anda bisa menjadi teladan bagi banyak orang.",
    en: "Spiritual teacher. You can be a role model for many.",
    es: "Maestro espiritual. Puedes ser un modelo a seguir para muchos.",
  },
  34: {
    id: "Kedisiplinan. Konsistensi membawa hasil luar biasa.",
    en: "Discipline. Consistency brings amazing results.",
    es: "Disciplina. La consistencia trae resultados asombrosos.",
  },
  35: {
    id: "Optimisme. Lihat sisi baik dari setiap masalah.",
    en: "Optimism. See the good side of every problem.",
    es: "Optimismo. Ve el lado bueno de cada problema.",
  },
  36: {
    id: "Tanggung jawab sosial. Terlibat dalam kegiatan amal.",
    en: "Social responsibility. Engage in charitable activities.",
    es: "Responsabilidad social. Participa en actividades benéficas.",
  },
  37: {
    id: "Kebijaksanaan dari pengalaman. Belajar dari masa lalu sangat berharga.",
    en: "Wisdom from experience. Learning from the past is invaluable.",
    es: "Sabiduría de la experiencia. Aprender del pasado es invaluable.",
  },
  38: {
    id: "Efisiensi. Lakukan lebih dengan sumber daya yang ada.",
    en: "Efficiency. Do more with existing resources.",
    es: "Eficiencia. Haz más con los recursos existentes.",
  },
  39: {
    id: "Idealisme tinggi. Jangan kecewa jika realita berbeda.",
    en: "High idealism. Don't be disappointed if reality differs.",
    es: "Alto idealismo. No te decepciones si la realidad es diferente.",
  },
  40: {
    id: "Fondasi baru. Mulai proyek besar dengan perencanaan matang.",
    en: "New foundation. Start big projects with careful planning.",
    es: "Nueva base. Comienza grandes proyectos con una planificación cuidadosa.",
  },
  41: {
    id: "Kesabaran. Hasil terbaik membutuhkan waktu.",
    en: "Patience. The best results take time.",
    es: "Paciencia. Los mejores resultados toman tiempo.",
  },
  42: {
    id: "Keseimbangan alam. Jaga hubungan dengan lingkungan.",
    en: "Natural balance. Maintain your relationship with the environment.",
    es: "Equilibrio natural. Mantén tu relación con el medio ambiente.",
  },
  43: {
    id: "Transformasi emosional. Belajar melepaskan dendam.",
    en: "Emotional transformation. Learn to let go of grudges.",
    es: "Transformación emocional. Aprende a dejar ir los rencores.",
  },
  44: {
    id: "Stabilitas ganda. Fondasi sangat kuat, gunakan untuk membantu orang lain.",
    en: "Double stability. Very strong foundation, use it to help others.",
    es: "Doble estabilidad. Base muy sólida, úsala para ayudar a otros.",
  },
  45: {
    id: "Perjalanan dan eksplorasi. Bepergian membawa keberuntungan.",
    en: "Journey and exploration. Travel brings luck.",
    es: "Viaje y exploración. Viajar trae suerte.",
  },
  46: {
    id: "Kedewasaan dalam cinta. Hubungan yang dewasa dan saling menghormati.",
    en: "Maturity in love. Mature and respectful relationship.",
    es: "Madurez en el amor. Relación madura y respetuosa.",
  },
  47: {
    id: "Ketenangan batin. Meditasi membawa jawaban.",
    en: "Inner peace. Meditation brings answers.",
    es: "Paz interior. La meditación trae respuestas.",
  },
  48: {
    id: "Kesuksesan terukur. Evaluasi ulang strategi finansial.",
    en: "Measurable success. Re-evaluate your financial strategy.",
    es: "Éxito medible. Reevalúa tu estrategia financiera.",
  },
  49: {
    id: "Puncak kebijaksanaan. Saatnya berbagi ilmu.",
    en: "Peak of wisdom. Time to share knowledge.",
    es: "Cima de la sabiduría. Es momento de compartir conocimiento.",
  },
  50: {
    id: "Kebebasan total. Jangan biarkan siapa pun mengendalikan Anda.",
    en: "Total freedom. Don't let anyone control you.",
    es: "Libertad total. No dejes que nadie te controle.",
  },
};

// Fungsi untuk mendapatkan arti angka dengan fallback ke reduksi numerologi (multi-bahasa)
const getMeaning = (num: number, lang: string): string => {
  if (NUMBER_MEANINGS_ML[num] && NUMBER_MEANINGS_ML[num][lang]) {
    return NUMBER_MEANINGS_ML[num][lang];
  }
  // Reduksi numerologi untuk angka > 50 atau tidak ada
  const reduce = (n: number): number => {
    if (n === 11 || n === 22 || n === 33) return n;
    if (n <= 9) return n;
    return reduce(n.toString().split('').reduce((a,b) => a + parseInt(b), 0));
  };
  const root = reduce(num);
  const baseMeanings: Record<number, Record<string, string>> = {
    1: { id: "kepemimpinan", en: "leadership", es: "liderazgo" },
    2: { id: "keseimbangan", en: "balance", es: "equilibrio" },
    3: { id: "kreativitas", en: "creativity", es: "creatividad" },
    4: { id: "stabilitas", en: "stability", es: "estabilidad" },
    5: { id: "kebebasan", en: "freedom", es: "libertad" },
    6: { id: "cinta", en: "love", es: "amor" },
    7: { id: "introspeksi", en: "introspection", es: "introspección" },
    8: { id: "kelimpahan", en: "abundance", es: "abundancia" },
    9: { id: "kemanusiaan", en: "humanity", es: "humanidad" },
    11: { id: "pencerahan", en: "enlightenment", es: "iluminación" },
    22: { id: "master builder", en: "master builder", es: "maestro constructor" },
    33: { id: "guru spiritual", en: "spiritual teacher", es: "maestro espiritual" },
  };
  const attr = baseMeanings[root]?.[lang] || baseMeanings[root]?.id || "energi unik";
  if (lang === "en") return `Number ${num} carries the energy of ${attr}.`;
  if (lang === "es") return `El número ${num} lleva la energía de ${attr}.`;
  return `Angka ${num} membawa energi ${attr}.`;
};

// Fungsi untuk menghasilkan Life Path Number dari tanggal lahir
const getLifePathNumber = (dob: string): number => {
  if (!dob) return 0;
  const sum = dob.replace(/-/g, '').split('').reduce((a,b) => a + parseInt(b), 0);
  const reduce = (n: number): number => {
    if (n === 11 || n === 22 || n === 33) return n;
    if (n > 9) return reduce(n.toString().split('').reduce((a,b) => a + parseInt(b), 0));
    return n;
  };
  return reduce(sum);
};

// ========== KOMPONEN UTAMA ==========
export default function LuckyNumber() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [number, setNumber] = useState<number | null>(null);
  const [meaning, setMeaning] = useState<string>("");
  const [history, setHistory] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [useBirthday, setUseBirthday] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const generateNumber = useCallback(() => {
    setIsRolling(true);
    setAnalyzed(false);
    let counter = 0;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 100) + 1;
      setNumber(rand);
      setMeaning("Memutar energi...");
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        let finalNum: number;
        if (useBirthday && dateOfBirth) {
          const lifePath = getLifePathNumber(dateOfBirth);
          const randomPart = Math.floor(Math.random() * 90) + 1;
          finalNum = (lifePath + randomPart) % 100;
          if (finalNum === 0) finalNum = 100;
        } else {
          finalNum = Math.floor(Math.random() * 100) + 1;
        }
        setNumber(finalNum);
        setMeaning(getMeaning(finalNum, lang));
        setHistory(prev => [finalNum, ...prev.slice(0, 2)]);
        setAnalyzed(true);
        setIsRolling(false);
      }
    }, 50);
  }, [useBirthday, dateOfBirth, lang]);

  const handleShare = async () => {
    if (!number) return;
    const text = `${dict.title}: ${number}\n${dict.labels.meaning}: ${meaning}\n\n${dict.quote}\n\n${dict.labels.disclaimer}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dict.title, text });
      } catch (e) {
        console.warn(e);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
      } catch (err) {
        alert("Failed to copy.");
      }
    }
  };

  const getColorClass = (num: number | null) => {
    if (!num) return "from-gray-500 to-gray-600";
    if (num >= 80) return "from-emerald-500 to-green-600";
    if (num >= 60) return "from-blue-500 to-cyan-600";
    if (num >= 40) return "from-amber-500 to-orange-600";
    if (num >= 20) return "from-purple-500 to-pink-600";
    return "from-rose-500 to-red-600";
  };

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* Header with badge & share */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">🍀✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Opsi tanggal lahir */}
      <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-md shadow-xl mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useBirthday}
            onChange={(e) => setUseBirthday(e.target.checked)}
            className="w-4 h-4 accent-amber-500"
          />
          <span className="text-sm font-medium">{dict.inputs.birthdayLabel}</span>
        </label>
        {useBirthday && (
          <div className="mt-3 flex flex-col gap-1">
            <label className="text-amber-300 text-[10px] font-bold uppercase tracking-widest">Tanggal Lahir</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full bg-slate-900/60 border border-amber-500/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 [color-scheme:dark]"
            />
          </div>
        )}
      </div>

      {/* Tombol Generate */}
      <button
        onClick={generateNumber}
        disabled={isRolling}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 font-black text-lg tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
      >
        {isRolling ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {dict.inputs.generating}
          </span>
        ) : (
          dict.inputs.generate
        )}
      </button>

      {/* Loading state saat rolling */}
      {isRolling && (
        <div className="flex justify-center my-12 flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400 text-xs font-mono tracking-widest animate-pulse">ROLLING...</p>
        </div>
      )}

      {/* Empty state sebelum generate pertama */}
      {!isRolling && !analyzed && !number && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">Klik tombol di atas untuk mendapatkan angka keberuntunganmu.</p>
        </div>
      )}

      {/* Hasil Angka */}
      {!isRolling && analyzed && number && (
        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="text-center p-4 rounded-xl bg-gradient-to-r ${getColorClass(number)} bg-opacity-20">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400 mb-1">{dict.labels.yourNumber}</p>
              <div className={`text-8xl md:text-9xl font-black bg-gradient-to-r ${getColorClass(number)} bg-clip-text text-transparent drop-shadow-sm`}>
                {number}
              </div>
              <div className="mt-4 text-amber-100 text-sm md:text-base italic max-w-md mx-auto">
                “{meaning}”
              </div>
            </div>

            {/* Copy button */}
            <div className="flex justify-center mt-5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${number} - ${meaning}`);
                  alert("Copied!");
                }}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-2"
              >
                📋 {dict.inputs.copyBtn}
              </button>
            </div>

            {/* Riwayat */}
            {history.length > 1 && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 text-center">{dict.inputs.historyLabel}</p>
                <div className="flex justify-center gap-3">
                  {history.slice(1).map((h, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-sm font-mono">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quote */}
          <div className="text-center p-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/30">
            <p className="text-amber-200 text-sm font-medium italic">"{dict.quote}"</p>
          </div>

          {/* Penjelasan numerologi */}
          <div className="text-center text-[10px] text-slate-500 bg-white/5 p-4 rounded-xl border border-white/5">
            <p>
              {useBirthday && dateOfBirth 
                ? `✨ ${dict.labels.birthdayNote}`
                : `✨ ${dict.labels.randomNote}`}
            </p>
            <p className="mt-1">{dict.labels.note}</p>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-[10px] text-slate-500 pt-3 opacity-70 border-t border-slate-800">
            {dict.labels.disclaimer}
          </div>

          {/* INJEKSI PAYWALL MULAI DARI SINI */}
          
            <div className="flex justify-center mt-6 mb-8 border-t border-white/10 pt-6">
              <button 
                onClick={handleShare} 
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-sm font-bold uppercase tracking-wider transition-all active:scale-95 gap-2"
              >
                📤 {dict.shareBtn || "Bagikan Hasil"}
              </button>
            </div>
            <PremiumPaywall 
            toolName={dict.title} 
            resultId="LuckyNumber" 
          />
          {/* SAMPAI SINI */}

        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}