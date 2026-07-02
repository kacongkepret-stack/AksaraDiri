"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Pasaran Jawa",
    badge: "Ultra Premium",
    subtitle: "Makna, karakter, dan ramalan dari 5 pasaran: Legi, Pahing, Pon, Wage, Kliwon. Kearifan lokal untuk introspeksi diri.",
    shareBtn: "Bagikan",
    inputs: {
      selectPasaran: "Pilih Pasaran",
      emptyMessage: "Pilih salah satu pasaran di atas untuk melihat detail lengkapnya.",
    },
    labels: {
      neptu: "Neptu",
      element: "Elemen",
      direction: "Arah",
      philosophy: "Filosofi",
      character: "Karakter",
      strength: "Kelebihan",
      weakness: "Kekurangan",
      career: "Karir Cocok",
      love: "Asmara",
      wealth: "Rezeki",
      match: "Paling Cocok dengan Pasaran",
      avoid: "Kurang Cocok dengan Pasaran",
      ritual: "Ritual Tradisional",
      fortune: "Ramalan Hari Ini",
      showFortune: "🔮 Lihat Ramalan Hari Ini",
      hideFortune: "🙈 Tutup Ramalan",
    },
    disclaimer: "*Pasaran Jawa digunakan untuk menentukan hari baik, watak, dan ramalan tradisional. Percaya atau tidak, tetap baik untuk introspeksi.",
    quote: "\"Weton adalah peta, bukan penjara. Kita tetap bebas memilih jalan hidup.\"",
  },
  en: {
    title: "Javanese Pasaran",
    badge: "Ultra Premium",
    subtitle: "Meanings, characters, and forecasts of the 5 pasaran: Legi, Pahing, Pon, Wage, Kliwon. Local wisdom for self-reflection.",
    shareBtn: "Share",
    inputs: {
      selectPasaran: "Select Pasaran",
      emptyMessage: "Choose one of the pasaran above to see complete details.",
    },
    labels: {
      neptu: "Neptu",
      element: "Element",
      direction: "Direction",
      philosophy: "Philosophy",
      character: "Character",
      strength: "Strength",
      weakness: "Weakness",
      career: "Suitable Career",
      love: "Love",
      wealth: "Wealth",
      match: "Most Compatible Pasaran",
      avoid: "Less Compatible Pasaran",
      ritual: "Traditional Ritual",
      fortune: "Today's Fortune",
      showFortune: "🔮 See Today's Fortune",
      hideFortune: "🙈 Hide Fortune",
    },
    disclaimer: "*Javanese Pasaran is used to determine good days, character, and traditional forecasts. Believe it or not, it remains good for introspection.",
    quote: "\"Weton is a map, not a prison. We are still free to choose our life path.\"",
  },
  es: {
    title: "Pasaran Javanés",
    badge: "Ultra Premium",
    subtitle: "Significados, caracteres y pronósticos de los 5 pasaran: Legi, Pahing, Pon, Wage, Kliwon. Sabiduría local para la introspección.",
    shareBtn: "Compartir",
    inputs: {
      selectPasaran: "Seleccionar Pasaran",
      emptyMessage: "Elige uno de los pasaran arriba para ver los detalles completos.",
    },
    labels: {
      neptu: "Neptu",
      element: "Elemento",
      direction: "Dirección",
      philosophy: "Filosofía",
      character: "Carácter",
      strength: "Fortaleza",
      weakness: "Debilidad",
      career: "Carrera Adecuada",
      love: "Amor",
      wealth: "Riqueza",
      match: "Pasaran Más Compatible",
      avoid: "Pasaran Menos Compatible",
      ritual: "Ritual Tradicional",
      fortune: "Pronóstico de Hoy",
      showFortune: "🔮 Ver Pronóstico de Hoy",
      hideFortune: "🙈 Ocultar Pronóstico",
    },
    disclaimer: "*El Pasaran Javanés se utiliza para determinar buenos días, carácter y pronósticos tradicionales. Lo creas o no, sigue siendo bueno para la introspección.",
    quote: "\"Weton es un mapa, no una prisión. Seguimos siendo libres de elegir nuestro camino de vida.\"",
  },
};

// ========== MULTI-LANGUAGE DATABASE PASARAN ==========
const PASARAN_DATA_ML = [
  {
    id: 1,
    nameKey: "Legi",
    symbol: "🌾",
    neptu: 5,
    elementKey: "Udara",
    directionKey: "Timur",
    color: "Kuning & Putih",
    tree: "Nanas",
    data: {
      id: {
        philosophy: "Legi berasal dari kata 'legit' (manis). Melambangkan kemanisan dalam kehidupan, keluwesan, dan optimisme. Orang Legi mudah bergaul, ceria, dan memiliki banyak teman.",
        character: "Luwes, ramah, optimis, mudah beradaptasi, suka bersosialisasi.",
        strength: "Networking luas, mudah percaya, kreatif, humoris.",
        weakness: "Ceroboh, mudah terdistraksi, kurang konsisten, boros.",
        career: "Sales, marketing, humas, guru, entertainer, travel agent.",
        love: "Pasangan yang ideal adalah yang bisa mengimbangi sifat ceria dan tidak terlalu posesif.",
        wealth: "Rezeki datang dari relasi dan komunikasi. Cocok kerja tim.",
        match: ["Pahing", "Pon", "Kliwon"],
        avoid: ["Wage"],
        ritual: "Selamatan dengan nasi tumpeng dan jajan pasar untuk memanjatkan rasa syukur.",
        dailyFortune: "Hari baik untuk bersosialisasi dan menjalin kemitraan baru.",
      },
      en: {
        philosophy: "Legi comes from the word 'legit' (sweet). Symbolizes sweetness in life, flexibility, and optimism. Legi people are sociable, cheerful, and have many friends.",
        character: "Flexible, friendly, optimistic, adaptable, likes socializing.",
        strength: "Wide networking, trusting, creative, humorous.",
        weakness: "Careless, easily distracted, inconsistent, wasteful.",
        career: "Sales, marketing, public relations, teacher, entertainer, travel agent.",
        love: "The ideal partner is someone who can match their cheerful nature and is not too possessive.",
        wealth: "Fortune comes from relationships and communication. Suitable for teamwork.",
        match: ["Pahing", "Pon", "Kliwon"],
        avoid: ["Wage"],
        ritual: "Selamatan with tumpeng rice and traditional snacks to express gratitude.",
        dailyFortune: "Good day for socializing and forming new partnerships.",
      },
      es: {
        philosophy: "Legi proviene de la palabra 'legit' (dulce). Simboliza dulzura en la vida, flexibilidad y optimismo. Las personas Legi son sociables, alegres y tienen muchos amigos.",
        character: "Flexible, amigable, optimista, adaptable, le gusta socializar.",
        strength: "Amplia red de contactos, confiado, creativo, humorístico.",
        weakness: "Descuidado, se distrae fácilmente, inconsistente, derrochador.",
        career: "Ventas, marketing, relaciones públicas, profesor, animador, agente de viajes.",
        love: "La pareja ideal es alguien que pueda igualar su naturaleza alegre y no sea demasiado posesivo.",
        wealth: "La fortuna viene de las relaciones y la comunicación. Adecuado para trabajo en equipo.",
        match: ["Pahing", "Pon", "Kliwon"],
        avoid: ["Wage"],
        ritual: "Selamatan con arroz tumpeng y aperitivos tradicionales para expresar gratitud.",
        dailyFortune: "Buen día para socializar y formar nuevas asociaciones.",
      },
    },
  },
  {
    id: 2,
    nameKey: "Pahing",
    symbol: "💰",
    neptu: 9,
    elementKey: "Api",
    directionKey: "Selatan",
    color: "Merah & Hitam",
    tree: "Mangga",
    data: {
      id: {
        philosophy: "Pahing berarti 'pahit' dalam konteks perjuangan. Melambangkan keteguhan, ambisi materi, dan kemampuan mengelola kekayaan.",
        character: "Tegas, ambisius, mandiri, pekerja keras, kalkulatif.",
        strength: "Pintar mengelola uang, disiplin, percaya diri, tangguh.",
        weakness: "Materialistis, keras kepala, mudah curiga, kurang ekspresif.",
        career: "Bankir, akuntan, pengusaha, manajer keuangan, investor.",
        love: "Mencari pasangan yang stabil, dewasa, dan bisa diajak kerja sama finansial.",
        wealth: "Rezeki melimpah jika fokus pada usaha mandiri dan investasi jangka panjang.",
        match: ["Legi", "Kliwon", "Wage"],
        avoid: ["Pon"],
        ritual: "Zakat atau sedekah pada hari Jumat untuk melancarkan rezeki.",
        dailyFortune: "Hari baik untuk transaksi besar dan negosiasi kontrak.",
      },
      en: {
        philosophy: "Pahing means 'bitter' in the context of struggle. Symbolizes steadfastness, material ambition, and the ability to manage wealth.",
        character: "Firm, ambitious, independent, hardworking, calculating.",
        strength: "Good with money, disciplined, confident, resilient.",
        weakness: "Materialistic, stubborn, suspicious, inexpressive.",
        career: "Banker, accountant, entrepreneur, financial manager, investor.",
        love: "Seeking a stable, mature partner who can collaborate financially.",
        wealth: "Abundant fortune if focusing on independent business and long-term investment.",
        match: ["Legi", "Kliwon", "Wage"],
        avoid: ["Pon"],
        ritual: "Give zakat or charity on Friday to smooth fortune.",
        dailyFortune: "Good day for large transactions and contract negotiations.",
      },
      es: {
        philosophy: "Pahing significa 'amargo' en el contexto de la lucha. Simboliza firmeza, ambición material y capacidad para gestionar la riqueza.",
        character: "Firme, ambicioso, independiente, trabajador, calculador.",
        strength: "Bueno con el dinero, disciplinado, seguro, resistente.",
        weakness: "Materialista, terco, suspicaz, inexpresivo.",
        career: "Banquero, contador, emprendedor, gerente financiero, inversor.",
        love: "Busca una pareja estable y madura que pueda colaborar financieramente.",
        wealth: "Fortuna abundante si se enfoca en negocio independiente e inversión a largo plazo.",
        match: ["Legi", "Kliwon", "Wage"],
        avoid: ["Pon"],
        ritual: "Da zakat o caridad los viernes para facilitar la fortuna.",
        dailyFortune: "Buen día para grandes transacciones y negociaciones de contratos.",
      },
    },
  },
  {
    id: 3,
    nameKey: "Pon",
    symbol: "🌊",
    neptu: 7,
    elementKey: "Air",
    directionKey: "Barat",
    color: "Biru Tua & Putih",
    tree: "Kelapa",
    data: {
      id: {
        philosophy: "Pon berasal dari kata 'puna' yang berarti tahan uji. Melambangkan ketenangan batin, strategi, dan daya tahan mental.",
        character: "Tenang, bijaksana, diplomatis, problem solver, pendiam.",
        strength: "Kendali emosi baik, pemaaf, pandai menyimpan rahasia.",
        weakness: "Manipulatif, pendendam, sulit terbuka, terlalu analitis.",
        career: "Konsultan, psikolog, mediator, peneliti, strategi militer.",
        love: "Butuh pasangan yang sabar dan bisa mendengar cerita panjangnya.",
        wealth: "Rezeki mengalir perlahan tapi pasti. Cocok bisnis waralaba atau royalti.",
        match: ["Wage", "Legi", "Kliwon"],
        avoid: ["Pahing"],
        ritual: "Bersedekah air minum atau menanam pohon.",
        dailyFortune: "Hari baik untuk menyelesaikan konflik dan introspeksi.",
      },
      en: {
        philosophy: "Pon comes from the word 'puna' meaning endurance. Symbolizes inner peace, strategy, and mental resilience.",
        character: "Calm, wise, diplomatic, problem solver, quiet.",
        strength: "Good emotional control, forgiving, keeps secrets well.",
        weakness: "Manipulative, vengeful, hard to open up, overly analytical.",
        career: "Consultant, psychologist, mediator, researcher, military strategist.",
        love: "Needs a patient partner who can listen to long stories.",
        wealth: "Wealth flows slowly but surely. Suitable for franchise or royalty business.",
        match: ["Wage", "Legi", "Kliwon"],
        avoid: ["Pahing"],
        ritual: "Give drinking water charity or plant a tree.",
        dailyFortune: "Good day for resolving conflicts and introspection.",
      },
      es: {
        philosophy: "Pon proviene de la palabra 'puna' que significa resistencia. Simboliza paz interior, estrategia y resiliencia mental.",
        character: "Tranquilo, sabio, diplomático, solucionador de problemas, callado.",
        strength: "Buen control emocional, indulgente, guarda secretos bien.",
        weakness: "Manipulador, vengativo, difícil de abrirse, demasiado analítico.",
        career: "Consultor, psicólogo, mediador, investigador, estratega militar.",
        love: "Necesita una pareja paciente que pueda escuchar largas historias.",
        wealth: "La riqueza fluye lenta pero segura. Adecuado para negocios de franquicia o regalías.",
        match: ["Wage", "Legi", "Kliwon"],
        avoid: ["Pahing"],
        ritual: "Da caridad de agua potable o planta un árbol.",
        dailyFortune: "Buen día para resolver conflictos e introspección.",
      },
    },
  },
  {
    id: 4,
    nameKey: "Wage",
    symbol: "🌱",
    neptu: 4,
    elementKey: "Tanah",
    directionKey: "Utara",
    color: "Coklat & Hijau",
    tree: "Bambu",
    data: {
      id: {
        philosophy: "Wage berarti 'upah' atau imbalan. Melambangkan kerja keras, kejujuran, dan kepraktisan.",
        character: "Jujur, pekerja keras, setia, praktis, tekun.",
        strength: "Disiplin, bisa diandalkan, hemat, konsisten.",
        weakness: "Kaku, susah kompromi, terlalu serius, lambat beradaptasi.",
        career: "Petani, buruh, teknisi, arsitek, akuntan, manajer lapangan.",
        love: "Pasangan yang menghargai kesetiaan dan tidak suka drama.",
        wealth: "Rezeki dari keringat sendiri. Hindari utang konsumtif.",
        match: ["Pon", "Pahing", "Kliwon"],
        avoid: ["Legi"],
        ritual: "Selamatan bumi dengan hasil panen atau kue tradisional.",
        dailyFortune: "Hari baik untuk memulai proyek jangka panjang.",
      },
      en: {
        philosophy: "Wage means 'wage' or reward. Symbolizes hard work, honesty, and practicality.",
        character: "Honest, hardworking, loyal, practical, diligent.",
        strength: "Disciplined, reliable, thrifty, consistent.",
        weakness: "Rigid, hard to compromise, too serious, slow to adapt.",
        career: "Farmer, laborer, technician, architect, accountant, field manager.",
        love: "Partner who appreciates loyalty and dislikes drama.",
        wealth: "Wealth from own sweat. Avoid consumer debt.",
        match: ["Pon", "Pahing", "Kliwon"],
        avoid: ["Legi"],
        ritual: "Earth selamatan with harvest or traditional cakes.",
        dailyFortune: "Good day to start long-term projects.",
      },
      es: {
        philosophy: "Wage significa 'salario' o recompensa. Simboliza trabajo duro, honestidad y practicidad.",
        character: "Honesto, trabajador, leal, práctico, diligente.",
        strength: "Disciplinado, confiable, ahorrativo, consistente.",
        weakness: "Rígido, difícil de comprometer, demasiado serio, lento para adaptarse.",
        career: "Granjero, obrero, técnico, arquitecto, contador, gerente de campo.",
        love: "Pareja que valora la lealtad y no le gusta el drama.",
        wealth: "Riqueza del propio sudor. Evita deudas de consumo.",
        match: ["Pon", "Pahing", "Kliwon"],
        avoid: ["Legi"],
        ritual: "Selamatan de tierra con cosecha o pasteles tradicionales.",
        dailyFortune: "Buen día para comenzar proyectos a largo plazo.",
      },
    },
  },
  {
    id: 5,
    nameKey: "Kliwon",
    symbol: "⭐",
    neptu: 8,
    elementKey: "Eter",
    directionKey: "Tengah",
    color: "Ungu & Hitam",
    tree: "Beringin",
    data: {
      id: {
        philosophy: "Kliwon dianggap paling sakral, berasal dari kata 'kliwon' yang berarti 'sempurna' atau 'puncak'. Melambangkan intuisi, spiritualitas, dan kewibawaan.",
        character: "Intuitif, kharismatik, misterius, spiritual, visioner.",
        strength: "Batin tajam, menarik perhatian, pandai mempengaruhi.",
        weakness: "Moody, sulit ditebak, keras kepala, mudah stres.",
        career: "Peneliti spiritual, motivator, pemimpin ritual, dukun, artis.",
        love: "Pasangan yang juga sensitif dan menghargai dunia spiritual.",
        wealth: "Rezeki bisa datang tiba-tiba melalui mimpi atau firasat. Cocok bisnis yang berhubungan dengan misteri (astrologi, konsultasi).",
        match: ["Pahing", "Pon", "Wage"],
        avoid: ["Legi"],
        ritual: "Mandi kembang setanam, puasa mutih, atau tirakat pada malam Jumat Kliwon.",
        dailyFortune: "Hari baik untuk meditasi dan berdoa memohon petunjuk.",
      },
      en: {
        philosophy: "Kliwon is considered the most sacred, from the word 'kliwon' meaning 'perfect' or 'peak'. Symbolizes intuition, spirituality, and authority.",
        character: "Intuitive, charismatic, mysterious, spiritual, visionary.",
        strength: "Sharp inner sense, attracts attention, good at influencing.",
        weakness: "Moody, unpredictable, stubborn, easily stressed.",
        career: "Spiritual researcher, motivator, ritual leader, shaman, artist.",
        love: "Partner who is also sensitive and appreciates the spiritual world.",
        wealth: "Wealth can come suddenly through dreams or premonitions. Suitable for mystery-related business (astrology, consulting).",
        match: ["Pahing", "Pon", "Wage"],
        avoid: ["Legi"],
        ritual: "Bath with setanam flowers, mutih fasting, or meditation on Friday Kliwon night.",
        dailyFortune: "Good day for meditation and praying for guidance.",
      },
      es: {
        philosophy: "Kliwon es considerado el más sagrado, de la palabra 'kliwon' que significa 'perfecto' o 'pico'. Simboliza intuición, espiritualidad y autoridad.",
        character: "Intuitivo, carismático, misterioso, espiritual, visionario.",
        strength: "Agudo sentido interior, atrae la atención, bueno para influir.",
        weakness: "Cambiante, impredecible, terco, fácilmente estresado.",
        career: "Investigador espiritual, motivador, líder de rituales, chamán, artista.",
        love: "Pareja que también es sensible y aprecia el mundo espiritual.",
        wealth: "La riqueza puede llegar repentinamente a través de sueños o premoniciones. Adecuado para negocios relacionados con el misterio (astrología, consultoría).",
        match: ["Pahing", "Pon", "Wage"],
        avoid: ["Legi"],
        ritual: "Baño con flores setanam, ayuno mutih o meditación en la noche del viernes Kliwon.",
        dailyFortune: "Buen día para meditar y rezar pidiendo guía.",
      },
    },
  },
];

// Elemen dan arah dalam multi-bahasa
const ELEMENTS: Record<string, Record<string, string>> = {
  id: { Udara: "Udara", Api: "Api", Air: "Air", Tanah: "Tanah", Eter: "Eter (Spiritual)" },
  en: { Udara: "Air", Api: "Fire", Air: "Water", Tanah: "Earth", Eter: "Ether (Spiritual)" },
  es: { Udara: "Aire", Api: "Fuego", Air: "Agua", Tanah: "Tierra", Eter: "Éter (Espiritual)" },
};

const DIRECTIONS: Record<string, Record<string, string>> = {
  id: { Timur: "Timur", Selatan: "Selatan", Barat: "Barat", Utara: "Utara", Tengah: "Tengah" },
  en: { Timur: "East", Selatan: "South", Barat: "West", Utara: "North", Tengah: "Center" },
  es: { Timur: "Este", Selatan: "Sur", Barat: "Oeste", Utara: "Norte", Tengah: "Centro" },
};

// ========== KOMPONEN UTAMA ==========
export default function HariPasaran() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];
  const elements = ELEMENTS[lang] || ELEMENTS["id"];
  const directions = DIRECTIONS[lang] || DIRECTIONS["id"];

  const [selected, setSelected] = useState(PASARAN_DATA_ML[0]);
  const [showFortune, setShowFortune] = useState(false);
  const [analyzed, setAnalyzed] = useState(true); // karena langsung menampilkan data saat pertama kali

  // Data pasaran dalam bahasa yang dipilih
  const pasaranData = useMemo(() => {
    const data = selected.data[lang] || selected.data["id"];
    return {
      ...selected,
      name: selected.nameKey,
      element: elements[selected.elementKey] || selected.elementKey,
      direction: directions[selected.directionKey] || selected.directionKey,
      philosophy: data.philosophy,
      character: data.character,
      strength: data.strength,
      weakness: data.weakness,
      career: data.career,
      love: data.love,
      wealth: data.wealth,
      match: data.match,
      avoid: data.avoid,
      ritual: data.ritual,
      dailyFortune: data.dailyFortune,
    };
  }, [selected, lang, elements, directions]);

  const handleShare = async () => {
    const text = `${dict.title}: ${pasaranData.symbol} ${pasaranData.name}\n${dict.labels.neptu}: ${pasaranData.neptu} | ${dict.labels.element}: ${pasaranData.element} | ${dict.labels.direction}: ${pasaranData.direction}\n${dict.labels.philosophy}: ${pasaranData.philosophy.substring(0, 100)}...\n\n${dict.labels.ritual}: ${pasaranData.ritual}\n\n${dict.disclaimer}`;
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

  return (
    <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6">
      {/* Header with badge & share */}
      <div className="text-center mb-8 relative">
        <div className="text-6xl mb-2">🌙📅</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Pilihan Pasaran (Tab-style) */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {PASARAN_DATA_ML.map((p) => {
          const name = p.nameKey;
          const isActive = selected.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelected(p);
                setShowFortune(false);
              }}
              className={`px-5 py-2 rounded-full font-bold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg scale-105"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {p.symbol} {name}
            </button>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-slate-900/90 to-amber-950/40 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center">
            <span className="text-6xl">{pasaranData.symbol}</span>
            <h3 className="text-3xl font-bold mt-2 text-amber-300">{pasaranData.name}</h3>
            <div className="inline-flex flex-wrap justify-center gap-3 mt-2 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">
                {dict.labels.neptu} {pasaranData.neptu}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full">
                {dict.labels.element} {pasaranData.element}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full">
                {dict.labels.direction} {pasaranData.direction}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <p className="text-slate-200 text-sm leading-relaxed italic">{pasaranData.philosophy}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <div className="space-y-3">
              <div className="bg-emerald-500/10 p-3 rounded-xl">
                <p className="text-emerald-400 text-xs font-bold uppercase">✨ {dict.labels.character}</p>
                <p className="text-slate-200 text-sm">{pasaranData.character}</p>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-xl">
                <p className="text-emerald-400 text-xs font-bold uppercase">⭐ {dict.labels.strength}</p>
                <p className="text-slate-200 text-sm">{pasaranData.strength}</p>
              </div>
              <div className="bg-rose-500/10 p-3 rounded-xl">
                <p className="text-rose-400 text-xs font-bold uppercase">⚠️ {dict.labels.weakness}</p>
                <p className="text-slate-200 text-sm">{pasaranData.weakness}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-500/10 p-3 rounded-xl">
                <p className="text-blue-400 text-xs font-bold uppercase">💼 {dict.labels.career}</p>
                <p className="text-slate-200 text-sm">{pasaranData.career}</p>
              </div>
              <div className="bg-pink-500/10 p-3 rounded-xl">
                <p className="text-pink-400 text-xs font-bold uppercase">❤️ {dict.labels.love}</p>
                <p className="text-slate-200 text-sm">{pasaranData.love}</p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-xl">
                <p className="text-amber-400 text-xs font-bold uppercase">💰 {dict.labels.wealth}</p>
                <p className="text-slate-200 text-sm">{pasaranData.wealth}</p>
              </div>
            </div>
          </div>

          {/* Kecocokan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/30">
              <p className="text-indigo-300 text-xs font-bold uppercase">🤝 {dict.labels.match}</p>
              <p className="text-slate-200 text-sm mt-1">
                {pasaranData.match.map((m: string) => (
                  <span key={m} className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs mr-2">{m}</span>
                ))}
              </p>
            </div>
            <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
              <p className="text-rose-300 text-xs font-bold uppercase">⚠️ {dict.labels.avoid}</p>
              <p className="text-slate-200 text-sm mt-1">
                {pasaranData.avoid.map((a: string) => (
                  <span key={a} className="inline-block px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs mr-2">{a}</span>
                ))}
              </p>
            </div>
          </div>

          {/* Ritual */}
          <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <p className="text-amber-300 text-xs font-bold uppercase">🕯️ {dict.labels.ritual}</p>
            <p className="text-slate-200 text-sm">{pasaranData.ritual}</p>
          </div>

          {/* Tombol Ramalan */}
          <button
            onClick={() => setShowFortune(!showFortune)}
            className="mt-5 w-full py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-semibold flex items-center justify-center gap-2"
          >
            {showFortune ? dict.labels.hideFortune : dict.labels.showFortune}
          </button>

          {showFortune && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl text-center animate-in fade-in slide-in-from-bottom-3 duration-300">
              <p className="text-purple-200 text-xs font-mono">{dict.labels.fortune}: {pasaranData.dailyFortune}</p>
            </div>
          )}

          {/* Quote */}
          <div className="mt-6 text-center p-3 bg-white/5 rounded-lg">
            <p className="text-amber-200 text-xs italic">✨ “{dict.quote}”</p>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-[10px] text-slate-500 mt-6 pt-2 border-t border-white/10 italic">
            {dict.disclaimer}
          </p>

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
            toolName={dict.title} 
            resultId={pasaranData.name} 
          />
</>
          {/* SAMPAI SINI */}

        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}