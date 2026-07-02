"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Neptu & Weton Jawa",
    badge: "Ultra Premium",
    subtitle: "Primbon lengkap: watak, arah rezeki, hari baik, dan pantangan berdasarkan weton kelahiran Anda.",
    shareBtn: "Bagikan",
    inputs: {
      birthDay: "Hari Lahir",
      pasaran: "Pasaran",
      analyze: "🔮 Hitung Weton & Neptu 🔮",
      computing: "Menghitung Neptu...",
      emptyMessage: "Pilih hari lahir dan pasaran untuk mengetahui neptu dan ramalan lengkap Anda.",
    },
    labels: {
      neptu: "Neptu (nilai weton)",
      watak: "Watak Dasar",
      strength: "Kelebihan",
      weakness: "Kekurangan",
      rezeki: "Arah Rezeki",
      color: "Warna Berkah",
      element: "Elemen",
      goodDay: "Hari Baik",
      badDay: "Hari Naas (Sangar)",
      caution: "Pantangan Khusus",
      match: "Kecocokan Jodoh",
      matchDesc: "Neptu yang cocok",
      matchNote: "Jika pasangan memiliki neptu tersebut, hubungan akan harmonis dan langgeng.",
      disclaimer: "*Primbon berdasarkan kitab primbon Jawa klasik. Hasil bersifat reflektif.",
      quote: "Weton bukan penentu mutlak, namun sebagai petunjuk untuk mengenali diri agar bisa terus memperbaiki.",
    },
  },
  en: {
    title: "Javanese Neptu & Weton",
    badge: "Ultra Premium",
    subtitle: "Complete primbon: character, direction of fortune, good days, and taboos based on your Javanese birth weton.",
    shareBtn: "Share",
    inputs: {
      birthDay: "Birth Day",
      pasaran: "Pasaran",
      analyze: "🔮 Calculate Weton & Neptu 🔮",
      computing: "Calculating Neptu...",
      emptyMessage: "Select birth day and pasaran to know your neptu and complete forecast.",
    },
    labels: {
      neptu: "Neptu (weton value)",
      watak: "Basic Character",
      strength: "Strength",
      weakness: "Weakness",
      rezeki: "Direction of Fortune",
      color: "Blessed Color",
      element: "Element",
      goodDay: "Good Day",
      badDay: "Bad Day (Sangar)",
      caution: "Special Taboo",
      match: "Love Compatibility",
      matchDesc: "Compatible neptu",
      matchNote: "If your partner has those neptu, the relationship will be harmonious and lasting.",
      disclaimer: "*Based on classical Javanese primbon books. Results are reflective.",
      quote: "Weton is not an absolute determinant, but a guide to know yourself so you can keep improving.",
    },
  },
  es: {
    title: "Neptu y Weton Javanés",
    badge: "Ultra Premium",
    subtitle: "Primbon completo: carácter, dirección de la fortuna, días buenos y tabúes según tu weton de nacimiento javanés.",
    shareBtn: "Compartir",
    inputs: {
      birthDay: "Día de Nacimiento",
      pasaran: "Pasaran",
      analyze: "🔮 Calcular Weton y Neptu 🔮",
      computing: "Calculando Neptu...",
      emptyMessage: "Selecciona el día de nacimiento y pasaran para conocer tu neptu y pronóstico completo.",
    },
    labels: {
      neptu: "Neptu (valor weton)",
      watak: "Carácter Básico",
      strength: "Fortaleza",
      weakness: "Debilidad",
      rezeki: "Dirección de la Fortuna",
      color: "Color Bendecido",
      element: "Elemento",
      goodDay: "Buen Día",
      badDay: "Día Malo (Sangar)",
      caution: "Tabú Especial",
      match: "Compatibilidad Amorosa",
      matchDesc: "Neptu compatibles",
      matchNote: "Si tu pareja tiene esos neptu, la relación será armoniosa y duradera.",
      disclaimer: "*Basado en libros clásicos de primbon javanés. Los resultados son reflexivos.",
      quote: "El Weton no es un determinante absoluto, sino una guía para conocerte a ti mismo y poder seguir mejorando.",
    },
  },
};

// ========== DATA HARI DAN PASARAN (tetap) ==========
const HARI_LIST = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PASARAN_LIST = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

const HARI_NILAI: Record<string, number> = {
  Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9
};

const PASARAN_NILAI: Record<string, number> = {
  Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8
};

// ========== NEPTU CHARACTER MULTI-BAHASA ==========
// Setiap neptu memiliki data untuk id, en, es
const NEPTU_CHARACTER_ML: Record<number, Record<string, any>> = {
  7: {
    id: {
      watak: "Pendiam, berwibawa, penuh misteri",
      positif: "Cerdas, intuitif, bisa dipercaya menjaga rahasia",
      negatif: "Sulit bergaul, kadang angkuh, suka menyendiri",
      rezeki: "Arah Utara dan Timur Laut",
      warna: "Biru Tua & Putih",
      elemen: "Air",
      hariBaik: "Selasa, Kamis",
      hariNaas: "Sabtu",
      pantangan: "Jangan memulai usaha di hari Jumat Wage",
    },
    en: {
      watak: "Quiet, authoritative, mysterious",
      positif: "Smart, intuitive, trustworthy in keeping secrets",
      negatif: "Hard to socialize, sometimes arrogant, likes to be alone",
      rezeki: "North and Northeast directions",
      warna: "Navy Blue & White",
      elemen: "Water",
      hariBaik: "Tuesday, Thursday",
      hariNaas: "Saturday",
      pantangan: "Don't start a business on Friday Wage",
    },
    es: {
      watak: "Tranquilo, autoritario, misterioso",
      positif: "Inteligente, intuitivo, confiable para guardar secretos",
      negatif: "Difícil socializar, a veces arrogante, le gusta estar solo",
      rezeki: "Direcciones Norte y Noreste",
      warna: "Azul Marino & Blanco",
      elemen: "Agua",
      hariBaik: "Martes, Jueves",
      hariNaas: "Sábado",
      pantangan: "No empieces un negocio el viernes Wage",
    },
    jodohIdeal: [11, 16, 9, 4]
  },
  8: {
    id: {
      watak: "Pekerja keras, jujur, agak kaku",
      positif: "Tekun, disiplin, bisa diandalkan",
      negatif: "Keras kepala, perfeksionis, gampang stres",
      rezeki: "Arah Timur dan Tenggara",
      warna: "Coklat & Hijau Tua",
      elemen: "Tanah",
      hariBaik: "Senin, Rabu",
      hariNaas: "Minggu",
      pantangan: "Jangan percaya begitu saja pada orang baru",
    },
    en: {
      watak: "Hardworking, honest, somewhat rigid",
      positif: "Diligent, disciplined, reliable",
      negatif: "Stubborn, perfectionist, easily stressed",
      rezeki: "East and Southeast directions",
      warna: "Brown & Dark Green",
      elemen: "Earth",
      hariBaik: "Monday, Wednesday",
      hariNaas: "Sunday",
      pantangan: "Don't trust new people easily",
    },
    es: {
      watak: "Trabajador, honesto, algo rígido",
      positif: "Diligente, disciplinado, confiable",
      negatif: "Terco, perfeccionista, se estresa fácilmente",
      rezeki: "Direcciones Este y Sureste",
      warna: "Marrón & Verde Oscuro",
      elemen: "Tierra",
      hariBaik: "Lunes, Miércoles",
      hariNaas: "Domingo",
      pantangan: "No confíes fácilmente en gente nueva",
    },
    jodohIdeal: [12, 8, 5, 13]
  },
  9: {
    id: {
      watak: "Ramah, mudah bergaul, suka petualangan",
      positif: "Optimis, energik, berani mengambil risiko",
      negatif: "Kurang konsisten, mudah bosan, boros",
      rezeki: "Arah Selatan dan Barat Daya",
      warna: "Kuning & Oranye",
      elemen: "Api",
      hariBaik: "Jumat, Minggu",
      hariNaas: "Selasa",
      pantangan: "Jangan meminjamkan uang tanpa perjanjian",
    },
    en: {
      watak: "Friendly, sociable, loves adventure",
      positif: "Optimistic, energetic, risk-taker",
      negatif: "Inconsistent, easily bored, wasteful",
      rezeki: "South and Southwest directions",
      warna: "Yellow & Orange",
      elemen: "Fire",
      hariBaik: "Friday, Sunday",
      hariNaas: "Tuesday",
      pantangan: "Don't lend money without an agreement",
    },
    es: {
      watak: "Amigable, sociable, ama la aventura",
      positif: "Optimista, enérgico, arriesgado",
      negatif: "Inconsistente, se aburre fácilmente, derrochador",
      rezeki: "Direcciones Sur y Suroeste",
      warna: "Amarillo & Naranja",
      elemen: "Fuego",
      hariBaik: "Viernes, Domingo",
      hariNaas: "Martes",
      pantangan: "No prestes dinero sin un acuerdo",
    },
    jodohIdeal: [9, 14, 6, 11]
  },
  10: {
    id: {
      watak: "Pembawa damai, pekerja keras, setia",
      positif: "Diplomatis, sabar, pengertian",
      negatif: "Mudah dimanfaatkan, overthinking",
      rezeki: "Arah Barat dan Barat Laut",
      warna: "Biru Langit & Putih",
      elemen: "Udara",
      hariBaik: "Kamis, Sabtu",
      hariNaas: "Rabu",
      pantangan: "Jangan terlalu percaya pada orang asing",
    },
    en: {
      watak: "Peacemaker, hardworking, loyal",
      positif: "Diplomatic, patient, understanding",
      negatif: "Easily taken advantage of, overthinking",
      rezeki: "West and Northwest directions",
      warna: "Sky Blue & White",
      elemen: "Air",
      hariBaik: "Thursday, Saturday",
      hariNaas: "Wednesday",
      pantangan: "Don't trust strangers too much",
    },
    es: {
      watak: "Pacificador, trabajador, leal",
      positif: "Diplomático, paciente, comprensivo",
      negatif: "Fácilmente aprovechado, piensa demasiado",
      rezeki: "Direcciones Oeste y Noroeste",
      warna: "Azul Cielo & Blanco",
      elemen: "Aire",
      hariBaik: "Jueves, Sábado",
      hariNaas: "Miércoles",
      pantangan: "No confíes demasiado en los extraños",
    },
    jodohIdeal: [10, 15, 7, 12]
  },
  11: {
    id: {
      watak: "Visioner, kreatif, emosional",
      positif: "Intuitif, inspiratif, pandai bicara",
      negatif: "Moody, overthinking, mudah stres",
      rezeki: "Arah Tenggara dan Timur",
      warna: "Merah & Emas",
      elemen: "Api",
      hariBaik: "Senin, Kamis",
      hariNaas: "Jumat",
      pantangan: "Jangan mengambil keputusan saat marah",
    },
    en: {
      watak: "Visionary, creative, emotional",
      positif: "Intuitive, inspirational, articulate",
      negatif: "Moody, overthinking, easily stressed",
      rezeki: "Southeast and East directions",
      warna: "Red & Gold",
      elemen: "Fire",
      hariBaik: "Monday, Thursday",
      hariNaas: "Friday",
      pantangan: "Don't make decisions when angry",
    },
    es: {
      watak: "Visionario, creativo, emocional",
      positif: "Intuitivo, inspirador, elocuente",
      negatif: "Cambiante, piensa demasiado, se estresa fácilmente",
      rezeki: "Direcciones Sureste y Este",
      warna: "Rojo & Oro",
      elemen: "Fuego",
      hariBaik: "Lunes, Jueves",
      hariNaas: "Viernes",
      pantangan: "No tomes decisiones cuando estés enojado",
    },
    jodohIdeal: [13, 9, 4, 6]
  },
  12: {
    id: {
      watak: "Penolong, ikhlas, agak pemalu",
      positif: "Empati tinggi, dermawan, tulus",
      negatif: "Mudah dimanfaatkan, kurang percaya diri",
      rezeki: "Arah Barat Daya dan Selatan",
      warna: "Hijau Muda & Putih",
      elemen: "Air",
      hariBaik: "Selasa, Sabtu",
      hariNaas: "Kamis",
      pantangan: "Jangan malas bergerak, banyak rezeki datang dari usaha",
    },
    en: {
      watak: "Helpful, sincere, somewhat shy",
      positif: "High empathy, generous, genuine",
      negatif: "Easily taken advantage of, lacks confidence",
      rezeki: "Southwest and South directions",
      warna: "Light Green & White",
      elemen: "Water",
      hariBaik: "Tuesday, Saturday",
      hariNaas: "Thursday",
      pantangan: "Don't be lazy to move; much fortune comes from effort",
    },
    es: {
      watak: "Servicial, sincero, algo tímido",
      positif: "Alta empatía, generoso, genuino",
      negatif: "Fácilmente aprovechado, falta de confianza",
      rezeki: "Direcciones Suroeste y Sur",
      warna: "Verde Claro & Blanco",
      elemen: "Agua",
      hariBaik: "Martes, Sábado",
      hariNaas: "Jueves",
      pantangan: "No seas perezoso para moverte; gran parte de la fortuna viene del esfuerzo",
    },
    jodohIdeal: [12, 17, 8, 10]
  },
  13: {
    id: {
      watak: "Dinamis, inovatif, suka tantangan",
      positif: "Kreatif, berani, cepat belajar",
      negatif: "Impulsif, kurang sabar, moody",
      rezeki: "Arah Timur dan Utara",
      warna: "Oranye & Hitam",
      elemen: "Tanah",
      hariBaik: "Minggu, Rabu",
      hariNaas: "Senin",
      pantangan: "Jangan menghina orang lain, bisa jadi bumerang",
    },
    en: {
      watak: "Dynamic, innovative, loves challenges",
      positif: "Creative, brave, fast learner",
      negatif: "Impulsive, impatient, moody",
      rezeki: "East and North directions",
      warna: "Orange & Black",
      elemen: "Earth",
      hariBaik: "Sunday, Wednesday",
      hariNaas: "Monday",
      pantangan: "Don't insult others; it might backfire",
    },
    es: {
      watak: "Dinámico, innovador, ama los desafíos",
      positif: "Creativo, valiente, aprende rápido",
      negatif: "Impulsivo, impaciente, cambia de humor",
      rezeki: "Direcciones Este y Norte",
      warna: "Naranja & Negro",
      elemen: "Tierra",
      hariBaik: "Domingo, Miércoles",
      hariNaas: "Lunes",
      pantangan: "No insultes a los demás; podría volverse en tu contra",
    },
    jodohIdeal: [15, 11, 6, 8]
  },
  14: {
    id: {
      watak: "Pemimpin alami, ambisius, bertanggung jawab",
      positif: "Efisien, percaya diri, sukses materi",
      negatif: "Workaholic, keras kepala, kurang ekspresif",
      rezeki: "Arah Selatan dan Tenggara",
      warna: "Merah & Hitam",
      elemen: "Api",
      hariBaik: "Selasa, Jumat",
      hariNaas: "Kamis",
      pantangan: "Jangan mengabaikan kesehatan demi pekerjaan",
    },
    en: {
      watak: "Natural leader, ambitious, responsible",
      positif: "Efficient, confident, materially successful",
      negatif: "Workaholic, stubborn, inexpressive",
      rezeki: "South and Southeast directions",
      warna: "Red & Black",
      elemen: "Fire",
      hariBaik: "Tuesday, Friday",
      hariNaas: "Thursday",
      pantangan: "Don't neglect health for work",
    },
    es: {
      watak: "Líder nato, ambicioso, responsable",
      positif: "Eficiente, seguro de sí mismo, exitoso materialmente",
      negatif: "Adicto al trabajo, terco, inexpresivo",
      rezeki: "Direcciones Sur y Sureste",
      warna: "Rojo & Negro",
      elemen: "Fuego",
      hariBaik: "Martes, Viernes",
      hariNaas: "Jueves",
      pantangan: "No descuides la salud por el trabajo",
    },
    jodohIdeal: [16, 12, 7, 9]
  },
  15: {
    id: {
      watak: "Artistik, sensitif, romantis",
      positif: "Kreatif, peka, ramah",
      negatif: "Overthinking, mudah cemas, kurang praktis",
      rezeki: "Arah Barat dan Timur Laut",
      warna: "Ungu & Perak",
      elemen: "Air",
      hariBaik: "Rabu, Sabtu",
      hariNaas: "Selasa",
      pantangan: "Jangan memendam perasaan terlalu lama",
    },
    en: {
      watak: "Artistic, sensitive, romantic",
      positif: "Creative, perceptive, friendly",
      negatif: "Overthinking, anxious, impractical",
      rezeki: "West and Northeast directions",
      warna: "Purple & Silver",
      elemen: "Water",
      hariBaik: "Wednesday, Saturday",
      hariNaas: "Tuesday",
      pantangan: "Don't hold in feelings for too long",
    },
    es: {
      watak: "Artístico, sensible, romántico",
      positif: "Creativo, perceptivo, amigable",
      negatif: "Piensa demasiado, ansioso, poco práctico",
      rezeki: "Direcciones Oeste y Noreste",
      warna: "Púrpura & Plata",
      elemen: "Agua",
      hariBaik: "Miércoles, Sábado",
      hariNaas: "Martes",
      pantangan: "No guardes los sentimientos por demasiado tiempo",
    },
    jodohIdeal: [17, 13, 8, 10]
  },
  16: {
    id: {
      watak: "Bijaksana, tenang, suka merenung",
      positif: "Analitis, mandiri, bisa memberi nasihat",
      negatif: "Terisolasi, pesimis, sulit bergaul",
      rezeki: "Arah Timur Laut dan Utara",
      warna: "Hitam & Abu-abu",
      elemen: "Tanah",
      hariBaik: "Kamis, Minggu",
      hariNaas: "Jumat",
      pantangan: "Jangan terlalu keras pada diri sendiri",
    },
    en: {
      watak: "Wise, calm, contemplative",
      positif: "Analytical, independent, good advisor",
      negatif: "Isolated, pessimistic, hard to socialize",
      rezeki: "Northeast and North directions",
      warna: "Black & Gray",
      elemen: "Earth",
      hariBaik: "Thursday, Sunday",
      hariNaas: "Friday",
      pantangan: "Don't be too hard on yourself",
    },
    es: {
      watak: "Sabio, tranquilo, contemplativo",
      positif: "Analítico, independiente, buen consejero",
      negatif: "Aislado, pesimista, difícil socializar",
      rezeki: "Direcciones Noreste y Norte",
      warna: "Negro & Gris",
      elemen: "Tierra",
      hariBaik: "Jueves, Domingo",
      hariNaas: "Viernes",
      pantangan: "No seas demasiado duro contigo mismo",
    },
    jodohIdeal: [18, 14, 9, 11]
  },
  17: {
    id: {
      watak: "Karismatik, pemberani, tegas",
      positif: "Memimpin, melindungi, berwibawa",
      negatif: "Otoriter, mudah marah, sulit menerima kritik",
      rezeki: "Arah Selatan dan Barat Daya",
      warna: "Merah & Emas",
      elemen: "Api",
      hariBaik: "Senin, Selasa",
      hariNaas: "Minggu",
      pantangan: "Jangan bertindak gegabah saat emosi",
    },
    en: {
      watak: "Charismatic, brave, firm",
      positif: "Leads, protects, authoritative",
      negatif: "Authoritarian, easily angered, hard to accept criticism",
      rezeki: "South and Southwest directions",
      warna: "Red & Gold",
      elemen: "Fire",
      hariBaik: "Monday, Tuesday",
      hariNaas: "Sunday",
      pantangan: "Don't act recklessly when emotional",
    },
    es: {
      watak: "Carismático, valiente, firme",
      positif: "Lidera, protege, autoritario",
      negatif: "Autoritario, se enoja fácilmente, difícil aceptar críticas",
      rezeki: "Direcciones Sur y Suroeste",
      warna: "Rojo & Oro",
      elemen: "Fuego",
      hariBaik: "Lunes, Martes",
      hariNaas: "Domingo",
      pantangan: "No actúes imprudentemente cuando estés emocionado",
    },
    jodohIdeal: [13, 9, 6, 10]
  },
  18: {
    id: {
      watak: "Penyayang, idealis, suka menolong",
      positif: "Dermawan, peduli lingkungan, artistik",
      negatif: "Terlalu berkorban, mudah kecewa",
      rezeki: "Arah Barat Laut dan Barat",
      warna: "Hijau & Coklat",
      elemen: "Air",
      hariBaik: "Rabu, Jumat",
      hariNaas: "Sabtu",
      pantangan: "Jangan abaikan diri sendiri demi orang lain",
    },
    en: {
      watak: "Loving, idealistic, helpful",
      positif: "Generous, environmentally conscious, artistic",
      negatif: "Overly sacrificing, easily disappointed",
      rezeki: "Northwest and West directions",
      warna: "Green & Brown",
      elemen: "Water",
      hariBaik: "Wednesday, Friday",
      hariNaas: "Saturday",
      pantangan: "Don't neglect yourself for others",
    },
    es: {
      watak: "Amoroso, idealista, servicial",
      positif: "Generoso, consciente del medio ambiente, artístico",
      negatif: "Se sacrifica demasiado, fácilmente decepcionado",
      rezeki: "Direcciones Noroeste y Oeste",
      warna: "Verde & Marrón",
      elemen: "Agua",
      hariBaik: "Miércoles, Viernes",
      hariNaas: "Sábado",
      pantangan: "No te descuides por los demás",
    },
    jodohIdeal: [14, 10, 7, 9]
  }
};

// Fallback untuk neptu yang tidak terdefinisi (misal 19 dst) gunakan neptu 15
const getNeptuCharacter = (neptu: number, lang: string) => {
  const data = NEPTU_CHARACTER_ML[neptu] || NEPTU_CHARACTER_ML[15];
  const charData = data[lang] || data["id"];
  return {
    watak: charData.watak,
    positif: charData.positif,
    negatif: charData.negatif,
    rezeki: charData.rezeki,
    warna: charData.warna,
    elemen: charData.elemen,
    hariBaik: charData.hariBaik,
    hariNaas: charData.hariNaas,
    pantangan: charData.pantangan,
    jodohIdeal: data.jodohIdeal
  };
};

// ========== KOMPONEN UTAMA ==========
export default function NeptuJawa() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [hari, setHari] = useState("Minggu");
  const [pasaran, setPasaran] = useState("Legi");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      const nilaiHari = HARI_NILAI[hari];
      const nilaiPasaran = PASARAN_NILAI[pasaran];
      const neptu = nilaiHari + nilaiPasaran;
      const karakter = getNeptuCharacter(neptu, lang);
      setResult({
        hari,
        pasaran,
        nilaiHari,
        nilaiPasaran,
        neptu,
        karakter
      });
      setAnalyzed(true);
      setLoading(false);
    }, 800);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `${dict.title}: ${result.hari} ${result.pasaran}\n${dict.labels.neptu}: ${result.neptu}\n${dict.labels.watak}: ${result.karakter.watak}\n\n${dict.labels.quote}\n\n${dict.labels.disclaimer}`;
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
        <div className="text-6xl mb-2">📜🌾</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-amber-300 text-xs font-bold px-1 uppercase tracking-widest">{dict.inputs.birthDay}</label>
            <select 
              value={hari} 
              onChange={(e) => setHari(e.target.value)} 
              className="w-full bg-slate-900/60 border border-amber-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-all"
            >
              {HARI_LIST.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-amber-300 text-xs font-bold px-1 uppercase tracking-widest">{dict.inputs.pasaran}</label>
            <select 
              value={pasaran} 
              onChange={(e) => setPasaran(e.target.value)} 
              className="w-full bg-slate-900/60 border border-amber-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-all"
            >
              {PASARAN_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 font-bold tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          {loading ? dict.inputs.computing : dict.inputs.analyze}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-12 flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-400 text-xs font-mono tracking-widest animate-pulse">COMPUTING...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !analyzed && !result && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">{dict.inputs.emptyMessage}</p>
        </div>
      )}

      {/* Results */}
      {!loading && analyzed && result && (
        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Main Card */}
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl bg-gradient-to-br from-amber-950/30 to-orange-950/30">
            <div className="relative z-10 text-center">
              <div className="text-3xl font-bold">
                {result.hari} <span className="text-amber-400">{result.pasaran}</span>
              </div>
              <div className="mt-2 text-6xl font-black text-amber-400">{result.neptu}</div>
              <p className="text-slate-400 text-sm mt-1">{dict.labels.neptu}</p>
              <div className="inline-flex gap-2 mt-2 text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                <span>{dict.inputs.birthDay}: {result.nilaiHari}</span> + <span>{dict.inputs.pasaran}: {result.nilaiPasaran}</span>
              </div>
            </div>
          </div>

          {/* Watak & Karakter */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5">
            <h3 className="text-amber-300 font-bold text-lg flex items-center gap-2 mb-3">
              <span className="text-xl">🧠</span> {dict.labels.watak}
            </h3>
            <p className="text-slate-200 text-base">{result.karakter.watak}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-emerald-500/10 p-3 rounded-lg">
                <p className="text-emerald-300 text-[10px] font-bold uppercase">✨ {dict.labels.strength}</p>
                <p className="text-slate-200 text-sm">{result.karakter.positif}</p>
              </div>
              <div className="bg-rose-500/10 p-3 rounded-lg">
                <p className="text-rose-300 text-[10px] font-bold uppercase">⚠️ {dict.labels.weakness}</p>
                <p className="text-slate-200 text-sm">{result.karakter.negatif}</p>
              </div>
            </div>
          </div>

          {/* Rezeki, Warna, Elemen, Hari Baik - Grid 4 kolom */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 p-3 rounded-xl text-center">
              <p className="text-amber-400 text-[10px] font-bold uppercase">🧭 {dict.labels.rezeki}</p>
              <p className="text-slate-200 text-sm font-semibold">{result.karakter.rezeki}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl text-center">
              <p className="text-amber-400 text-[10px] font-bold uppercase">🎨 {dict.labels.color}</p>
              <p className="text-slate-200 text-sm font-semibold">{result.karakter.warna}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl text-center">
              <p className="text-amber-400 text-[10px] font-bold uppercase">🌿 {dict.labels.element}</p>
              <p className="text-slate-200 text-sm font-semibold">{result.karakter.elemen}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl text-center">
              <p className="text-amber-400 text-[10px] font-bold uppercase">📅 {dict.labels.goodDay}</p>
              <p className="text-slate-200 text-sm font-semibold">{result.karakter.hariBaik}</p>
            </div>
          </div>

          {/* Hari Naas & Pantangan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-950/30 backdrop-blur-md border border-red-900/50 rounded-2xl p-4">
              <p className="text-red-300 text-xs font-bold uppercase">⚠️ {dict.labels.badDay}</p>
              <p className="text-slate-200 text-sm mt-1">{result.karakter.hariNaas}</p>
              <p className="text-[10px] text-slate-400 mt-1">Hindari memulai usaha penting di hari ini.</p>
            </div>
            <div className="bg-yellow-950/30 backdrop-blur-md border border-yellow-900/50 rounded-2xl p-4">
              <p className="text-yellow-300 text-xs font-bold uppercase">🚫 {dict.labels.caution}</p>
              <p className="text-slate-200 text-sm mt-1">{result.karakter.pantangan}</p>
            </div>
          </div>

          {/* Kecocokan Jodoh */}
          <div className="bg-amber-950/30 backdrop-blur-md border border-amber-900/50 rounded-2xl p-5">
            <h4 className="text-amber-300 font-bold text-sm flex items-center gap-2 mb-2">
              <span>💑</span> {dict.labels.match}
            </h4>
            <p className="text-slate-200 text-sm">
              {dict.labels.matchDesc}: <strong>{result.karakter.jodohIdeal.join(", ")}</strong>.<br/>
              {dict.labels.matchNote}
            </p>
            <p className="text-[10px] text-slate-400 mt-2">*Berdasarkan primbon Betaljemur Adammakna.</p>
          </div>

          {/* Quote */}
          <div className="text-center p-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/30">
            <p className="text-amber-200 text-sm font-medium italic">✨ "{dict.labels.quote}"</p>
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
            resultId={result.neptu?.toString() || "neptu"} 
          />
          {/* SAMPAI SINI */}

        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        select option {
          background-color: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}