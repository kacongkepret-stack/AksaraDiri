"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Hewan Pelindung",
    badge: "Ultra Premium",
    subtitle: "Temukan hewan penjaga (Spirit Animal) yang merepresentasikan energi, arketipe psikologis, dan kekuatan tersembunyi dari nama Anda.",
    shareBtn: "Bagikan",
    inputs: {
      namePlaceholder: "Ketik nama lengkap Anda di sini...",
      analyze: "🐾 Pindai Energi Hewan",
      computing: "Menyelaraskan Aura...",
      emptyMessage: "Masukkan nama Anda untuk memulai pemindaian hewan pelindung.",
    },
    labels: {
      yourEntity: "Entitas Penjaga Anda",
      element: "Elemen Inti",
      superpower: "Superpower",
      blindspot: "Blind Spot",
      disclaimer: "*Metrik pemetaan arketipe ini menggunakan algoritma hash deterministik berdasarkan nama input. Dirancang untuk tujuan refleksi diri dan hiburan.",
      quote: "\"Hewan pelindung adalah cermin dari jiwa terdalammu.\"",
    },
  },
  en: {
    title: "Spirit Animal",
    badge: "Ultra Premium",
    subtitle: "Discover the spirit animal that represents your energy, psychological archetype, and hidden strength based on your name.",
    shareBtn: "Share",
    inputs: {
      namePlaceholder: "Enter your full name here...",
      analyze: "🐾 Scan Animal Energy",
      computing: "Aligning Aura...",
      emptyMessage: "Enter your name to start scanning for your spirit animal.",
    },
    labels: {
      yourEntity: "Your Guardian Entity",
      element: "Core Element",
      superpower: "Superpower",
      blindspot: "Blind Spot",
      disclaimer: "*This archetype mapping uses a deterministic hash algorithm based on name input. Designed for self-reflection and entertainment.",
      quote: "\"The spirit animal is a mirror of your deepest soul.\"",
    },
  },
  es: {
    title: "Animal Espiritual",
    badge: "Ultra Premium",
    subtitle: "Descubre el animal espiritual que representa tu energía, arquetipo psicológico y fuerza oculta según tu nombre.",
    shareBtn: "Compartir",
    inputs: {
      namePlaceholder: "Ingresa tu nombre completo aquí...",
      analyze: "🐾 Escanear Energía Animal",
      computing: "Alineando Aura...",
      emptyMessage: "Ingresa tu nombre para comenzar a escanear tu animal espiritual.",
    },
    labels: {
      yourEntity: "Tu Entidad Guardiana",
      element: "Elemento Central",
      superpower: "Superpoder",
      blindspot: "Punto Ciego",
      disclaimer: "*Este mapeo de arquetipos utiliza un algoritmo hash determinístico basado en el nombre. Diseñado para la autoreflexión y el entretenimiento.",
      quote: "\"El animal espiritual es un espejo de tu alma más profunda.\"",
    },
  },
};

// ========== DATABASE HEWAN PELINDUNG MULTI-BAHASA ==========
const ANIMAL_DATABASE_ML = [
  {
    nameKey: "Serigala",
    archetypeKey: "Sang Penjaga Kawanan",
    emoji: "🐺",
    elementKey: "Bumi & Malam",
    gradientBg: "from-slate-900 to-gray-900 border-slate-700",
    gradientText: "from-slate-300 to-gray-400",
    data: {
      id: {
        name: "Serigala",
        archetype: "Sang Penjaga Kawanan",
        element: "Bumi & Malam",
        desc: "Serigala melambangkan kecerdasan instingtual, kebebasan, dan kesetiaan mutlak. Anda memiliki intuisi yang sangat tajam dan tahu kapan harus bertarung sendirian atau bekerja sama dengan tim.",
        superpower: "Mampu membaca niat tersembunyi orang lain dan sangat loyal pada lingkaran terdekat (Inner Circle).",
        blindspot: "Terkadang terlalu protektif atau sulit mempercayai orang baru di luar kelompok Anda.",
      },
      en: {
        name: "Wolf",
        archetype: "The Pack Guardian",
        element: "Earth & Night",
        desc: "The wolf represents instinctual intelligence, freedom, and absolute loyalty. You have very sharp intuition and know when to fight alone or work with a team.",
        superpower: "Able to read others' hidden intentions and deeply loyal to your inner circle.",
        blindspot: "Sometimes overly protective or distrustful of new people outside your group.",
      },
      es: {
        name: "Lobo",
        archetype: "El Guardián de la Manada",
        element: "Tierra y Noche",
        desc: "El lobo representa inteligencia instintiva, libertad y lealtad absoluta. Tienes una intuición muy aguda y sabes cuándo luchar solo o trabajar en equipo.",
        superpower: "Capaz de leer las intenciones ocultas de otros y muy leal a tu círculo íntimo.",
        blindspot: "A veces demasiado protector o desconfiado de nuevas personas fuera de tu grupo.",
      },
    },
  },
  {
    nameKey: "Elang",
    archetypeKey: "Sang Visioner Langit",
    emoji: "🦅",
    elementKey: "Udara & Cahaya",
    gradientBg: "from-sky-900/60 to-blue-950/80 border-sky-700/50",
    gradientText: "from-sky-300 to-blue-400",
    data: {
      id: {
        name: "Elang",
        archetype: "Sang Visioner Langit",
        element: "Udara & Cahaya",
        desc: "Elang adalah simbol visi, kejernihan mental, dan kebebasan. Anda memiliki kemampuan untuk melihat 'gambaran besar' (Big Picture) ketika orang lain terjebak pada detail kecil yang merepotkan.",
        superpower: "Fokus laser pada tujuan dan tidak mudah terdistraksi oleh drama atau gosip murahan.",
        blindspot: "Bisa terkesan arogan atau terlalu berjarak secara emosional dengan orang di bawah Anda.",
      },
      en: {
        name: "Eagle",
        archetype: "The Sky Visionary",
        element: "Air & Light",
        desc: "The eagle is a symbol of vision, mental clarity, and freedom. You can see the big picture when others get stuck on minor details.",
        superpower: "Laser focus on goals and not easily distracted by drama or gossip.",
        blindspot: "Can come across as arrogant or emotionally distant to those below you.",
      },
      es: {
        name: "Águila",
        archetype: "El Visionario del Cielo",
        element: "Aire y Luz",
        desc: "El águila es símbolo de visión, claridad mental y libertad. Puedes ver el panorama general cuando otros se atascan en pequeños detalles.",
        superpower: "Enfoque láser en objetivos y no te distraes fácilmente con drama o chismes.",
        blindspot: "Puede parecer arrogante o emocionalmente distante para quienes están por debajo de ti.",
      },
    },
  },
  {
    nameKey: "Beruang",
    archetypeKey: "Sang Pelindung Tangguh",
    emoji: "🐻",
    elementKey: "Bumi & Alam",
    gradientBg: "from-amber-900/70 to-orange-950/80 border-amber-700/50",
    gradientText: "from-amber-400 to-orange-500",
    data: {
      id: {
        name: "Beruang",
        archetype: "Sang Pelindung Tangguh",
        element: "Bumi & Alam",
        desc: "Beruang membawa energi kekuatan, keberanian, dan landasan yang kokoh. Anda adalah tempat berlindung bagi orang-orang yang sedang menghadapi masa sulit.",
        superpower: "Resiliensi (daya tahan) mental yang luar biasa. Anda selalu bisa bangkit seberat apa pun hantamannya.",
        blindspot: "Kecenderungan memendam amarah yang bisa meledak hebat jika batas kesabaran dilewati.",
      },
      en: {
        name: "Bear",
        archetype: "The Sturdy Protector",
        element: "Earth & Nature",
        desc: "The bear carries energy of strength, courage, and solid foundation. You are a shelter for those facing hard times.",
        superpower: "Extraordinary mental resilience. You always rise no matter how hard the hit.",
        blindspot: "Tendency to suppress anger that can explode when patience is exhausted.",
      },
      es: {
        name: "Oso",
        archetype: "El Protector Robusto",
        element: "Tierra y Naturaleza",
        desc: "El oso lleva energía de fuerza, coraje y base sólida. Eres un refugio para quienes enfrentan tiempos difíciles.",
        superpower: "Resiliencia mental extraordinaria. Siempre te levantas sin importar el golpe.",
        blindspot: "Tendencia a reprimir la ira que puede explotar cuando se agota la paciencia.",
      },
    },
  },
  {
    nameKey: "Burung Hantu",
    archetypeKey: "Sang Pengamat Bijak",
    emoji: "🦉",
    elementKey: "Udara & Kosmos",
    gradientBg: "from-indigo-900/70 to-violet-950/80 border-indigo-700/50",
    gradientText: "from-indigo-300 to-violet-400",
    data: {
      id: {
        name: "Burung Hantu",
        archetype: "Sang Pengamat Bijak",
        element: "Udara & Kosmos",
        desc: "Mewakili kebijaksanaan kuno, kemampuan melihat di tengah kegelapan, dan kepekaan supranatural. Anda tahu hal-hal yang tidak diucapkan oleh orang lain.",
        superpower: "Analisis tajam, pemikir filosofis, dan pemberi nasihat paling objektif di lingkaran Anda.",
        blindspot: "Sering overthinking (terlalu banyak berpikir) hingga menunda eksekusi di dunia nyata.",
      },
      en: {
        name: "Owl",
        archetype: "The Wise Observer",
        element: "Air & Cosmos",
        desc: "Represents ancient wisdom, ability to see in darkness, and supernatural sensitivity. You know what others leave unspoken.",
        superpower: "Sharp analysis, philosophical thinker, most objective advisor in your circle.",
        blindspot: "Often overthinking, delaying real-world execution.",
      },
      es: {
        name: "Búho",
        archetype: "El Observador Sabio",
        element: "Aire y Cosmos",
        desc: "Representa sabiduría antigua, capacidad de ver en la oscuridad y sensibilidad sobrenatural. Sabes lo que otros dejan sin decir.",
        superpower: "Análisis agudo, pensador filosófico, asesor más objetivo en tu círculo.",
        blindspot: "A menudo piensas demasiado, retrasando la ejecución en el mundo real.",
      },
    },
  },
  {
    nameKey: "Harimau",
    archetypeKey: "Sang Petarung Soliter",
    emoji: "🐅",
    elementKey: "Api & Hutan",
    gradientBg: "from-orange-800/60 to-red-950/80 border-orange-600/50",
    gradientText: "from-orange-400 to-red-500",
    data: {
      id: {
        name: "Harimau",
        archetype: "Sang Petarung Soliter",
        element: "Api & Hutan",
        desc: "Harimau adalah personifikasi gairah, keberanian ekstrem, dan kemandirian. Anda digerakkan oleh insting kuat dan tidak pernah ragu mengambil panggung utama.",
        superpower: "Karisma yang mengintimidasi namun memikat. Mampu mengeksekusi rencana dengan kecepatan kilat.",
        blindspot: "Ego yang tinggi dan kesulitan menerima kritik, bahkan dari orang yang berniat baik.",
      },
      en: {
        name: "Tiger",
        archetype: "The Solitary Warrior",
        element: "Fire & Forest",
        desc: "The tiger personifies passion, extreme courage, and independence. You are driven by strong instinct and never hesitate to take center stage.",
        superpower: "Intimidating yet captivating charisma. Executes plans at lightning speed.",
        blindspot: "High ego and difficulty accepting criticism, even from well-meaning people.",
      },
      es: {
        name: "Tigre",
        archetype: "El Guerrero Solitario",
        element: "Fuego y Bosque",
        desc: "El tigre personifica pasión, coraje extremo e independencia. Te mueve un instinto fuerte y nunca dudas en tomar el centro del escenario.",
        superpower: "Carisma intimidante pero cautivador. Ejecuta planes a velocidad de rayo.",
        blindspot: "Ego elevado y dificultad para aceptar críticas, incluso de personas bien intencionadas.",
      },
    },
  },
  {
    nameKey: "Rubah",
    archetypeKey: "Sang Ahli Strategi",
    emoji: "🦊",
    elementKey: "Bumi & Kelicikan",
    gradientBg: "from-rose-900/60 to-orange-900/80 border-rose-700/50",
    gradientText: "from-rose-400 to-orange-400",
    data: {
      id: {
        name: "Rubah",
        archetype: "Sang Ahli Strategi",
        element: "Bumi & Kelicikan",
        desc: "Rubah melambangkan kelincahan mental, kemampuan beradaptasi, dan taktik cerdik. Anda ahli mencari jalan pintas untuk menyelesaikan masalah rumit.",
        superpower: "Adaptasi instan di lingkungan mana pun dan ahli membalikkan situasi sulit menjadi keuntungan.",
        blindspot: "Sering disalahpahami sebagai orang yang manipulatif karena selalu mencari celah dari aturan.",
      },
      en: {
        name: "Fox",
        archetype: "The Strategy Master",
        element: "Earth & Cunning",
        desc: "The fox represents mental agility, adaptability, and clever tactics. You excel at finding shortcuts to solve complex problems.",
        superpower: "Instant adaptation anywhere and skilled at turning tough situations into advantages.",
        blindspot: "Often misunderstood as manipulative because you always look for loopholes in rules.",
      },
      es: {
        name: "Zorro",
        archetype: "El Maestro de la Estrategia",
        element: "Tierra y Astucia",
        desc: "El zorro representa agilidad mental, adaptabilidad y tácticas astutas. Destacas en encontrar atajos para resolver problemas complejos.",
        superpower: "Adaptación instantánea en cualquier lugar y habilidad para convertir situaciones difíciles en ventajas.",
        blindspot: "A menudo malinterpretado como manipulador porque siempre buscas lagunas en las reglas.",
      },
    },
  },
  {
    nameKey: "Rusa",
    archetypeKey: "Sang Pembawa Kedamaian",
    emoji: "🦌",
    elementKey: "Bumi & Daun",
    gradientBg: "from-emerald-900/60 to-green-950/80 border-emerald-700/50",
    gradientText: "from-emerald-300 to-green-400",
    data: {
      id: {
        name: "Rusa",
        archetype: "Sang Pembawa Kedamaian",
        element: "Bumi & Daun",
        desc: "Mewakili kelembutan, keanggunan, dan sensitivitas tinggi. Anda menyelesaikan masalah dengan diplomasi dan kasih sayang, bukan kekerasan.",
        superpower: "Empati tingkat tinggi yang mampu meredakan ketegangan dan menyembuhkan trauma emosional orang lain.",
        blindspot: "Terlalu mudah mengorbankan batasan pribadi (boundaries) demi menghindari konflik.",
      },
      en: {
        name: "Deer",
        archetype: "The Peacebringer",
        element: "Earth & Leaf",
        desc: "Represents gentleness, grace, and high sensitivity. You solve problems with diplomacy and compassion, not violence.",
        superpower: "High-level empathy that can ease tension and heal others' emotional trauma.",
        blindspot: "Too quick to sacrifice personal boundaries to avoid conflict.",
      },
      es: {
        name: "Ciervo",
        archetype: "El Portador de Paz",
        element: "Tierra y Hoja",
        desc: "Representa dulzura, gracia y alta sensibilidad. Resuelves problemas con diplomacia y compasión, no violencia.",
        superpower: "Empatía de alto nivel que puede aliviar tensiones y sanar el trauma emocional de otros.",
        blindspot: "Demasiado rápido para sacrificar límites personales para evitar conflictos.",
      },
    },
  },
  {
    nameKey: "Lumba-lumba",
    archetypeKey: "Sang Penyelaras Harmoni",
    emoji: "🐬",
    elementKey: "Air & Gelombang",
    gradientBg: "from-cyan-900/60 to-blue-900/80 border-cyan-700/50",
    gradientText: "from-cyan-300 to-blue-400",
    data: {
      id: {
        name: "Lumba-lumba",
        archetype: "Sang Penyelaras Harmoni",
        element: "Air & Gelombang",
        desc: "Lumba-lumba adalah simbol kecerdasan sosial, komunikasi, dan keceriaan murni. Anda tahu cara menikmati hidup dan membawa kebahagiaan bagi orang lain.",
        superpower: "Kecerdasan emosional (EQ) absolut. Mampu mencairkan suasana paling kaku sekalipun.",
        blindspot: "Sering menggunakan humor atau kesibukan untuk lari dari konfrontasi emosional yang serius.",
      },
      en: {
        name: "Dolphin",
        archetype: "The Harmony Harmonizer",
        element: "Water & Wave",
        desc: "The dolphin is a symbol of social intelligence, communication, and pure joy. You know how to enjoy life and bring happiness to others.",
        superpower: "Absolute emotional intelligence (EQ). Able to defuse even the stiffest atmosphere.",
        blindspot: "Often uses humor or busyness to avoid serious emotional confrontation.",
      },
      es: {
        name: "Delfín",
        archetype: "El Armonizador de la Armonía",
        element: "Agua y Ola",
        desc: "El delfín es símbolo de inteligencia social, comunicación y alegría pura. Sabes disfrutar la vida y traer felicidad a otros.",
        superpower: "Inteligencia emocional (EQ) absoluta. Capaz de desactivar incluso la atmósfera más tensa.",
        blindspot: "A menudo usa el humor o el ajetreo para evitar confrontaciones emocionales serias.",
      },
    },
  },
  {
    nameKey: "Kucing Hutan",
    archetypeKey: "Penjaga Bayangan",
    emoji: "🐈‍⬛",
    elementKey: "Malam & Rahasia",
    gradientBg: "from-purple-900/60 to-fuchsia-950/80 border-purple-700/50",
    gradientText: "from-purple-400 to-fuchsia-400",
    data: {
      id: {
        name: "Kucing Hutan",
        archetype: "Penjaga Bayangan",
        element: "Malam & Rahasia",
        desc: "Merepresentasikan independensi, ketenangan, dan pelindung rahasia. Anda tidak membutuhkan validasi eksternal untuk merasa berharga.",
        superpower: "Sangat mandiri dan tidak bisa dimanipulasi oleh siapa pun. Pemegang rahasia terbaik.",
        blindspot: "Terlalu tertutup (emotionally unavailable), membuat orang yang tulus kesulitan mendekati Anda.",
      },
      en: {
        name: "Lynx",
        archetype: "The Shadow Guardian",
        element: "Night & Secrets",
        desc: "Represents independence, calmness, and secret protector. You don't need external validation to feel worthy.",
        superpower: "Very independent and cannot be manipulated. Best secret keeper.",
        blindspot: "Too emotionally unavailable, making it hard for sincere people to approach you.",
      },
      es: {
        name: "Lince",
        archetype: "El Guardián de las Sombras",
        element: "Noche y Secretos",
        desc: "Representa independencia, calma y protector de secretos. No necesitas validación externa para sentirte valioso.",
        superpower: "Muy independiente e inmanipulable. Mejor guardián de secretos.",
        blindspot: "Demasiado emocionalmente no disponible, dificultando que personas sinceras se acerquen.",
      },
    },
  },
  {
    nameKey: "Kura-kura",
    archetypeKey: "Sang Pejalan Stabil",
    emoji: "🐢",
    elementKey: "Air & Logam",
    gradientBg: "from-teal-900/60 to-emerald-950/80 border-teal-700/50",
    gradientText: "from-teal-300 to-emerald-400",
    data: {
      id: {
        name: "Kura-kura",
        archetype: "Sang Pejalan Stabil",
        element: "Air & Logam",
        desc: "Simbol ketekunan, umur panjang, dan perlindungan diri. Anda memenangkan perlombaan kehidupan dengan konsistensi, bukan kecepatan impulsif.",
        superpower: "Kesabaran tanpa batas dan fondasi hidup yang sangat stabil serta minim risiko kehancuran.",
        blindspot: "Sangat resisten terhadap perubahan zaman dan lambat dalam mengambil keputusan krusial.",
      },
      en: {
        name: "Turtle",
        archetype: "The Steady Walker",
        element: "Water & Metal",
        desc: "Symbol of perseverance, longevity, and self-protection. You win life's race with consistency, not impulsive speed.",
        superpower: "Boundless patience and a very stable life foundation with minimal risk of collapse.",
        blindspot: "Highly resistant to change and slow in making crucial decisions.",
      },
      es: {
        name: "Tortuga",
        archetype: "El Caminante Constante",
        element: "Agua y Metal",
        desc: "Símbolo de perseverancia, longevidad y autoprotección. Ganas la carrera de la vida con consistencia, no velocidad impulsiva.",
        superpower: "Paciencia infinita y una base de vida muy estable con mínimo riesgo de colapso.",
        blindspot: "Altamente resistente al cambio y lento para tomar decisiones cruciales.",
      },
    },
  },
  {
    nameKey: "Naga",
    archetypeKey: "Sang Katalis Perubahan",
    emoji: "🐉",
    elementKey: "Api & Eter",
    gradientBg: "from-red-900/70 to-rose-950/80 border-red-700/50",
    gradientText: "from-red-400 to-rose-500",
    data: {
      id: {
        name: "Naga",
        archetype: "Sang Katalis Perubahan",
        element: "Api & Eter",
        desc: "Entitas mistis yang melambangkan kekuatan transmutasi, kepemimpinan mutlak, dan keberuntungan besar. Kehadiran Anda selalu membawa perubahan.",
        superpower: "Kemampuan menciptakan keajaiban dari kehancuran. Anda terlahir untuk melakukan hal-hal besar.",
        blindspot: "Bisa terlalu mendominasi atau tanpa sadar 'membakar' orang-orang yang tidak bisa mengimbangi energi Anda.",
      },
      en: {
        name: "Dragon",
        archetype: "The Change Catalyst",
        element: "Fire & Ether",
        desc: "Mystical entity symbolizing transmutation power, absolute leadership, and great fortune. Your presence always brings change.",
        superpower: "Ability to create miracles from destruction. You are born to do great things.",
        blindspot: "Can be too dominant or unconsciously 'burn' those who can't match your energy.",
      },
      es: {
        name: "Dragón",
        archetype: "El Catalizador del Cambio",
        element: "Fuego y Éter",
        desc: "Entidad mística que simboliza poder de transmutación, liderazgo absoluto y gran fortuna. Tu presencia siempre trae cambio.",
        superpower: "Capacidad de crear milagros desde la destrucción. Naciste para hacer grandes cosas.",
        blindspot: "Puede ser demasiado dominante o 'quemar' inconscientemente a quienes no pueden igualar tu energía.",
      },
    },
  },
  {
    nameKey: "Kupu-kupu",
    archetypeKey: "Sang Jiwa Transformasi",
    emoji: "🦋",
    elementKey: "Udara & Bunga",
    gradientBg: "from-fuchsia-900/60 to-pink-950/80 border-fuchsia-700/50",
    gradientText: "from-fuchsia-300 to-pink-400",
    data: {
      id: {
        name: "Kupu-kupu",
        archetype: "Sang Jiwa Transformasi",
        element: "Udara & Bunga",
        desc: "Simbol kelahiran kembali dan evolusi tanpa henti. Anda menjalani berbagai fase kehidupan yang drastis dan selalu keluar dengan lebih indah.",
        superpower: "Adaptabilitas tingkat tinggi. Mampu meninggalkan masa lalu dan bertransformasi tanpa penyesalan.",
        blindspot: "Kurangnya stabilitas atau komitmen jangka panjang karena selalu mencari pengalaman baru.",
      },
      en: {
        name: "Butterfly",
        archetype: "The Transformation Soul",
        element: "Air & Flower",
        desc: "Symbol of rebirth and endless evolution. You go through drastic life phases and always emerge more beautiful.",
        superpower: "High-level adaptability. Able to leave the past and transform without regret.",
        blindspot: "Lack of long-term stability or commitment due to always seeking new experiences.",
      },
      es: {
        name: "Mariposa",
        archetype: "El Alma de la Transformación",
        element: "Aire y Flor",
        desc: "Símbolo de renacimiento y evolución sin fin. Pasas por fases de vida drásticas y siempre emerges más bello.",
        superpower: "Adaptabilidad de alto nivel. Capaz de dejar el pasado y transformarte sin arrepentimiento.",
        blindspot: "Falta de estabilidad o compromiso a largo plazo debido a la búsqueda constante de nuevas experiencias.",
      },
    },
  },
];

// ========== FUNGSI HASH DETERMINISTIK ==========
function getAnimalHash(name: string): number {
  const cleanName = name.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (cleanName.length === 0) return 0;
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % ANIMAL_DATABASE_ML.length;
}

// ========== KOMPONEN UTAMA ==========
export default function SpiritAnimal() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
    if (!name.trim()) return;
    setLoading(true);
    setAnalyzed(false);
    setResult(null);

    setTimeout(() => {
      const index = getAnimalHash(name);
      const selectedAnimal = ANIMAL_DATABASE_ML[index];
      const animalData = selectedAnimal.data[lang] || selectedAnimal.data["id"];
      setResult({
        ...selectedAnimal,
        name: animalData.name,
        archetype: animalData.archetype,
        element: animalData.element,
        desc: animalData.desc,
        superpower: animalData.superpower,
        blindspot: animalData.blindspot,
      });
      setAnalyzed(true);
      setLoading(false);

      import("canvas-confetti")
        .then((mod) => {
          mod.default({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        })
        .catch(() => {});
    }, 1800);
  };

  const handleReset = () => {
    setName("");
    setResult(null);
    setAnalyzed(false);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `${dict.title}: ${result.emoji} ${result.name} - ${result.archetype}\n\n${result.desc}\n✨ ${dict.labels.superpower}: ${result.superpower}\n⚠️ ${dict.labels.blindspot}: ${result.blindspot}\n\n${dict.labels.disclaimer}`;
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
        <div className="flex justify-center gap-2 text-5xl mb-2">
          <span className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '2s' }}>🐺</span>
          <span className="animate-bounce" style={{ animationDelay: '200ms', animationDuration: '2s' }}>🦅</span>
          <span className="animate-bounce" style={{ animationDelay: '400ms', animationDuration: '2s' }}>🐉</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <label className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2 block pl-2">
            {dict.inputs.namePlaceholder}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.inputs.namePlaceholder}
            maxLength={50}
            className="w-full bg-slate-900/60 border border-emerald-500/30 rounded-xl px-5 py-3 text-center font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder-slate-500"
          />
          <div className="flex gap-3 mt-5">
            <button 
              onClick={handleScan} 
              disabled={loading || !name.trim()} 
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {loading ? dict.inputs.computing : dict.inputs.analyze}
            </button>
            {result && !loading && (
              <button 
                onClick={handleReset} 
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center text-lg" 
                title="Reset"
              >
                🔄
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-center my-12 flex-col items-center gap-3">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-emerald-400 text-xs font-mono tracking-widest animate-pulse">SCANNING...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !analyzed && !result && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">{dict.inputs.emptyMessage}</p>
        </div>
      )}

      {/* Result Section */}
      {!loading && analyzed && result && (
        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className={`relative overflow-hidden bg-gradient-to-br ${result.gradientBg} border border-white/20 rounded-2xl p-6 shadow-2xl`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 text-center">
              <div className="text-8xl drop-shadow-2xl mb-3 hover:scale-110 transition-transform duration-300 cursor-default">
                {result.emoji}
              </div>
              <p className="text-slate-300 text-[10px] font-black tracking-[0.3em] uppercase mb-1">
                {dict.labels.yourEntity}
              </p>
              <h3 className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${result.gradientText} bg-clip-text text-transparent drop-shadow-sm`}>
                {result.name}
              </h3>
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-black/40 rounded-full border border-white/10">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">{result.archetype}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4 relative z-10">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <p className="text-slate-200 text-sm leading-relaxed">{result.desc}</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{dict.labels.element}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${result.gradientText} bg-clip-text text-transparent`}>
                    {result.element}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/20">
                  <p className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span>✨</span> {dict.labels.superpower}
                  </p>
                  <p className="text-slate-200 text-xs leading-relaxed">{result.superpower}</p>
                </div>
                <div className="bg-rose-900/20 p-4 rounded-xl border border-rose-500/20">
                  <p className="flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span>⚠️</span> {dict.labels.blindspot}
                  </p>
                  <p className="text-slate-200 text-xs leading-relaxed">{result.blindspot}</p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="relative z-10 mt-6 text-center p-4 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl border border-emerald-500/30">
              <p className="text-emerald-200 text-sm font-medium italic">"{dict.labels.quote}"</p>
            </div>

            {/* Disclaimer */}
            <div className="relative z-10 mt-6 text-center text-[10px] text-slate-500 pt-3 opacity-70 border-t border-slate-800">
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
              resultId={result.id} 
            />
            {/* SAMPAI SINI */}

          </div>
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
        input::placeholder {
          color: #64748b;
        }
      `}</style>
    </div>
  );
}