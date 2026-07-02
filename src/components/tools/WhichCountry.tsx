"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Destinasi Geografis Ideal", badge: "Ultra Premium",
    subtitle: "Sadar atau tidak, kepribadian Anda sangat selaras dengan kultur negara tertentu. Jawab 10 pertanyaan analisis psikometrik ini untuk menemukan belahan bumi yang seharusnya menjadi 'rumah' Anda.",
    shareBtn: "Bagikan", startBtn: "Mulai Uji Geografis 🧭",
    analyzing: "Menganalisis Profil Gaya Hidup...", syncing: "Menyinkronkan topografi, kultur arsitektur, dan dinamika sosial...",
    retakeBtn: "🔄 Analisis Ulang", progressLabel: "Analisis Profil",
    resultBadge: "Destinasi Paling Sinkron Ditemukan",
    disclaimer: "*Analisis ini mengukur bobot preferensi psikologis Anda dari 10 parameter (arsitektur, kuliner, filosofi kerja) terhadap kondisi geografis dan kultural negara global secara akurat.",
    quote: "\"Rumah bukan hanya tempat, tapi perasaan bahwa kamu berada di frekuensi yang tepat.\"",
    labels: { workLife: "Budaya Kerja (Work-Life)", socialVibe: "Dinamika Sosial" }
  },
  en: {
    title: "Ideal Geographic Destination", badge: "Ultra Premium",
    subtitle: "Whether you realize it or not, your personality aligns with a certain country's culture. Answer these 10 psychometric questions to find which hemisphere should be your 'home'.",
    shareBtn: "Share", startBtn: "Start Geographic Test 🧭",
    analyzing: "Analyzing Lifestyle Profile...", syncing: "Synchronizing topography, architectural culture, and social dynamics...",
    retakeBtn: "🔄 Retake Analysis", progressLabel: "Profile Analysis",
    resultBadge: "Most Synchronized Destination Found",
    disclaimer: "*This analysis measures your psychological preference weight from 10 parameters (architecture, cuisine, work philosophy) against the geographical and cultural conditions of global countries accurately.",
    quote: "\"Home is not just a place, but a feeling that you are on the right frequency.\"",
    labels: { workLife: "Work-Life Culture", socialVibe: "Social Dynamics" }
  },
  es: {
    title: "Destino Geográfico Ideal", badge: "Ultra Premium",
    subtitle: "Lo quieras o no, tu personalidad se alinea con la cultura de cierto país. Responde estas 10 preguntas psicométricas para encontrar qué hemisferio debería ser tu 'hogar'.",
    shareBtn: "Compartir", startBtn: "Iniciar Prueba Geográfica 🧭",
    analyzing: "Analizando Perfil de Estilo de Vida...", syncing: "Sincronizando topografía, cultura arquitectónica y dinámicas sociales...",
    retakeBtn: "🔄 Reanálisis", progressLabel: "Análisis de Perfil",
    resultBadge: "Destino Más Sincronizado Encontrado",
    disclaimer: "*Este análisis mide el peso de tus preferencias psicológicas a partir de 10 parámetros frente a las condiciones geográficas y culturales de países globales con precisión.",
    quote: "\"El hogar no es solo un lugar, sino una sensación de que estás en la frecuencia correcta.\"",
    labels: { workLife: "Cultura Trabajo-Vida", socialVibe: "Dinámica Social" }
  }
};

// ========== DATABASE NEGARA MULTI-BAHASA ==========
const COUNTRIES_DB_ML: Record<string, any> = {
  JP: {
    emoji: "🇯🇵", gradientBg: "from-rose-900/60 to-red-950/80 border-rose-500/30", gradientText: "from-rose-300 to-red-500",
    data: {
      id: { name: "Jepang", archetype: "Harmoni Futuristik & Tradisi", desc: "Anda menyukai keteraturan, kebersihan mutlak, dan perpaduan antara teknologi canggih dengan budaya kuno yang masih kental.", workLife: "Dedikasi tinggi pada karir (Kaizen), namun diimbangi dengan apresiasi mendalam pada estetika alam dan hobi spesifik.", socialVibe: "Introver friendly. Masyarakat sangat menghargai privasi dan kesopanan di ruang publik." },
      en: { name: "Japan", archetype: "Futuristic Harmony & Tradition", desc: "You love order, absolute cleanliness, and the blend of advanced technology with deeply rooted ancient culture.", workLife: "High dedication to career (Kaizen), balanced with deep appreciation for nature aesthetics and specific hobbies.", socialVibe: "Introvert friendly. Society greatly values privacy and politeness in public spaces." },
      es: { name: "Japón", archetype: "Armonía Futurista y Tradición", desc: "Te encanta el orden, la limpieza absoluta y la mezcla de tecnología avanzada con una cultura antigua profundamente arraigada.", workLife: "Alta dedicación a la carrera (Kaizen), equilibrada con una profunda apreciación por la estética natural.", socialVibe: "Amigable para introvertidos. La sociedad valora mucho la privacidad y la cortesía." }
    }
  },
  CH: {
    emoji: "🇨🇭", gradientBg: "from-slate-800/60 to-red-950/80 border-red-500/30", gradientText: "from-slate-200 to-red-400",
    data: {
      id: { name: "Swiss", archetype: "Ketenangan & Kualitas Mutlak", desc: "Anda mendambakan kedamaian, bentang alam pegunungan yang dramatis, dan sistem hidup yang berjalan sangat presisi seperti jam tangan.", workLife: "Sangat seimbang (Excellent Work-Life Balance). Pekerjaan efisien, sisa waktu dihabiskan untuk menikmati alam dan keluarga.", socialVibe: "Eksklusif dan tenang. Tidak suka basa-basi yang berlebihan, sangat menghargai kualitas di atas kuantitas." },
      en: { name: "Switzerland", archetype: "Serenity & Absolute Quality", desc: "You crave peace, dramatic mountain landscapes, and a life system that runs as precisely as a watch.", workLife: "Very balanced. Efficient work, remaining time spent enjoying nature and family.", socialVibe: "Exclusive and calm. Dislikes excessive small talk, values quality over quantity." },
      es: { name: "Suiza", archetype: "Serenidad y Calidad Absoluta", desc: "Anhelas paz, paisajes montañosos dramáticos y un sistema de vida que funciona con la precisión de un reloj.", workLife: "Muy equilibrado. Trabajo eficiente, el tiempo restante se dedica a disfrutar la naturaleza y la familia.", socialVibe: "Exclusivo y tranquilo. No le gustan las conversaciones triviales excesivas, valora la calidad." }
    }
  },
  IT: {
    emoji: "🇮🇹", gradientBg: "from-emerald-900/60 to-red-950/80 border-emerald-500/30", gradientText: "from-emerald-400 to-red-400",
    data: {
      id: { name: "Italia", archetype: "Romantisme & Gairah Hidup", desc: "Hidup bagi Anda adalah seni. Anda mencintai sejarah, arsitektur klasik, makanan lezat, dan ekspresi emosi yang bebas.", workLife: "Hidup untuk dinikmati, bukan sekadar untuk bekerja (La Dolce Vita). Menikmati momen kecil adalah ritual paling penting.", socialVibe: "Sangat hangat, komunal, dan ekspresif. Keluarga dan meja makan adalah pusat interaksi sosial." },
      en: { name: "Italy", archetype: "Romanticism & Passion for Life", desc: "Life for you is art. You love history, classical architecture, delicious food, and free emotional expression.", workLife: "Live to enjoy, not just to work (La Dolce Vita). Enjoying small moments is the most important ritual.", socialVibe: "Very warm, communal, and expressive. Family and the dining table are centers of social interaction." },
      es: { name: "Italia", archetype: "Romanticismo y Pasión por la Vida", desc: "La vida para ti es arte. Amas la historia, la arquitectura clásica, la comida deliciosa y la expresión libre.", workLife: "Vive para disfrutar, no solo para trabajar (La Dolce Vita). Disfrutar los pequeños momentos es esencial.", socialVibe: "Muy cálido, comunal y expresivo. La familia y la mesa son centros de interacción social." }
    }
  },
  NZ: {
    emoji: "🇳🇿", gradientBg: "from-teal-900/60 to-cyan-950/80 border-teal-500/30", gradientText: "from-teal-300 to-cyan-400",
    data: {
      id: { name: "Selandia Baru", archetype: "Kebebasan & Petualangan Alam", desc: "Anda adalah jiwa petualang yang tidak suka dikekang tembok beton kota. Anda butuh ruang terbuka hijau dan udara yang segar.", workLife: "Sangat rileks. Pekerjaan hanyalah alat untuk membiayai petualangan akhir pekan di alam liar.", socialVibe: "Egaliter (setara), ramah, dan sangat santai. Tidak memedulikan status sosial kelas atas atau pakaian bermerek." },
      en: { name: "New Zealand", archetype: "Freedom & Nature Adventure", desc: "You are an adventurous soul who dislikes being confined by city concrete walls. You need open green spaces and fresh air.", workLife: "Very relaxed. Work is just a means to fund weekend adventures in the wild.", socialVibe: "Egalitarian, friendly, and very laid-back. Doesn't care about high social status or branded clothing." },
      es: { name: "Nueva Zelanda", archetype: "Libertad y Aventura Natural", desc: "Eres un alma aventurera a la que no le gusta estar confinada por los muros de la ciudad. Necesitas espacios verdes.", workLife: "Muy relajado. El trabajo es solo un medio para financiar aventuras de fin de semana en la naturaleza.", socialVibe: "Igualitario, amigable y muy tranquilo. No le importa el alto estatus social ni la ropa de marca." }
    }
  },
  CA: {
    emoji: "🇨🇦", gradientBg: "from-red-900/60 to-rose-950/80 border-red-500/30", gradientText: "from-red-300 to-rose-400",
    data: {
      id: { name: "Kanada", archetype: "Toleransi & Harmoni Sosial", desc: "Anda mencari lingkungan yang aman, inklusif, dan menerima perbedaan. Anda menyukai cuaca dingin dan jaminan sosial yang baik.", workLife: "Stabil dan minim tekanan ekstrem. Keamanan sosial dan kesehatan mental sangat dijamin oleh sistem kehidupan.", socialVibe: "Terkenal sangat sopan, ramah, dan menghargai keberagaman budaya (Multikultural)." },
      en: { name: "Canada", archetype: "Tolerance & Social Harmony", desc: "You seek a safe, inclusive environment that embraces differences. You like cold weather and good social security.", workLife: "Stable with minimal extreme pressure. Social security and mental health are well guaranteed.", socialVibe: "Known to be very polite, friendly, and appreciative of cultural diversity (Multicultural)." },
      es: { name: "Canadá", archetype: "Tolerancia y Armonía Social", desc: "Buscas un entorno seguro e inclusivo que acepte las diferencias. Te gusta el clima frío y una buena seguridad social.", workLife: "Estable con mínima presión extrema. La seguridad social y la salud mental están bien garantizadas.", socialVibe: "Conocido por ser muy educado, amable y apreciar la diversidad cultural (Multicultural)." }
    }
  },
  SG: {
    emoji: "🇸🇬", gradientBg: "from-amber-900/60 to-red-950/80 border-amber-500/30", gradientText: "from-amber-400 to-red-500",
    data: {
      id: { name: "Singapura", archetype: "Akselerasi Karir & Efisiensi", desc: "Anda ambisius, menyukai kecepatan kota metropolis, efisiensi transportasi mutlak, dan kehidupan modern yang serba praktis.", workLife: "Kompetitif dan bergerak cepat (Fast-paced). Sangat cocok untuk mereka yang ingin melesatkan karir dan pundi finansial.", socialVibe: "Praktis, super aman, dan berorientasi pada aturan pasti. Masyarakat yang sangat modern dan multinasional." },
      en: { name: "Singapore", archetype: "Career Acceleration & Efficiency", desc: "You are ambitious, enjoy the speed of a metropolis, absolute transport efficiency, and modern, practical life.", workLife: "Competitive and fast-paced. Very suitable for those who want to accelerate their career and finances.", socialVibe: "Practical, super safe, and rule-oriented. A very modern and multinational society." },
      es: { name: "Singapur", archetype: "Aceleración Profesional y Eficiencia", desc: "Eres ambicioso, disfrutas la velocidad de una metrópolis, la eficiencia absoluta del transporte y la vida práctica.", workLife: "Competitivo y de ritmo rápido. Muy adecuado para quienes quieren acelerar su carrera y sus finanzas.", socialVibe: "Práctico, súper seguro y orientado a reglas. Una sociedad muy moderna y multinacional." }
    }
  }
};
// ========== PERTANYAAN KUIS MULTI-BAHASA (FULL 10 SOAL) ==========
const getQuestions = (lang: string): any[] => {
  const baseQuestions = [
    {
      id: 1,
      question: {
        id: "Bagaimana gambaran akhir pekan impian Anda?",
        en: "What does your dream weekend look like?",
        es: "¿Cómo es tu fin de semana de ensueño?"
      },
      options: [
        { text: { id: "Menjelajah kafe tersembunyi dan pusat perbelanjaan di kota metropolitan.", en: "Exploring hidden cafes and shopping malls in a metropolitan city.", es: "Explorando cafés escondidos y centros comerciales en una ciudad metropolitana." }, pointsTo: ["JP", "SG"] },
        { text: { id: "Mendaki gunung atau menikmati udara sejuk di tepi danau yang tenang.", en: "Hiking mountains or enjoying cool air by a quiet lake.", es: "Escalando montañas o disfrutando del aire fresco junto a un lago tranquilo." }, pointsTo: ["CH", "NZ"] },
        { text: { id: "Menikmati kuliner lokal dan mengobrol bersama teman hingga larut malam.", en: "Enjoying local cuisine and chatting with friends late into the night.", es: "Disfrutando de la gastronomía local y charlando con amigos hasta altas horas de la noche." }, pointsTo: ["IT"] },
        { text: { id: "Bersantai di rumah sambil menikmati cuaca bersalju atau hujan.", en: "Relaxing at home enjoying snowy or rainy weather.", es: "Relajándome en casa disfrutando del clima nevado o lluvioso." }, pointsTo: ["CA", "CH"] }
      ]
    },
    {
      id: 2,
      question: {
        id: "Apa filosofi Anda terhadap sebuah pekerjaan?",
        en: "What is your philosophy towards work?",
        es: "¿Cuál es tu filosofía hacia el trabajo?"
      },
      options: [
        { text: { id: "Karir adalah medan perang. Saya ingin mencapai puncak kesuksesan finansial.", en: "Career is a battlefield. I want to reach the peak of financial success.", es: "La carrera es un campo de batalla. Quiero alcanzar la cima del éxito financiero." }, pointsTo: ["SG", "JP"] },
        { text: { id: "Pekerjaan itu penting, tapi keseimbangan kehidupan pribadi jauh lebih berharga.", en: "Work is important, but work-life balance is far more valuable.", es: "El trabajo es importante, pero el equilibrio entre la vida laboral y personal es mucho más valioso." }, pointsTo: ["CH", "CA"] },
        { text: { id: "Pekerjaan hanyalah cara untuk membiayai hobi dan petualangan saya.", en: "Work is just a way to fund my hobbies and adventures.", es: "El trabajo es solo una forma de financiar mis pasatiempos y aventuras." }, pointsTo: ["NZ"] },
        { text: { id: "Kerja secukupnya saja. Hidup ini terlalu singkat untuk tidak dinikmati.", en: "Work just enough. Life is too short not to enjoy.", es: "Trabaja lo justo. La vida es demasiado corta para no disfrutarla." }, pointsTo: ["IT"] }
      ]
    },
    {
      id: 3,
      question: {
        id: "Pemandangan seperti apa yang membuat batin Anda damai?",
        en: "What kind of scenery brings peace to your soul?",
        es: "¿Qué tipo de paisaje trae paz a tu alma?"
      },
      options: [
        { text: { id: "Gedung pencakar langit futuristik yang menyala gemerlap di malam hari.", en: "Futuristic skyscrapers brightly lit up at night.", es: "Rascacielos futuristas brillantemente iluminados por la noche." }, pointsTo: ["SG", "JP"] },
        { text: { id: "Hamparan rumput hijau luas yang berbatasan dengan laut atau gunung es.", en: "Vast expanses of green grass bordering the sea or ice mountains.", es: "Vastas extensiones de hierba verde que bordean el mar o montañas de hielo." }, pointsTo: ["NZ", "CH"] },
        { text: { id: "Bangunan bersejarah dengan arsitektur kuno dan jalanan berbatu estetik.", en: "Historic buildings with ancient architecture and aesthetic cobblestone streets.", es: "Edificios históricos con arquitectura antigua y estéticas calles empedradas." }, pointsTo: ["IT", "JP"] },
        { text: { id: "Hutan pinus yang tertutup salju dan pondok kayu yang menyala hangat.", en: "Snow-covered pine forests and warmly lit wooden cabins.", es: "Bosques de pinos cubiertos de nieve y cabañas de madera cálidamente iluminadas." }, pointsTo: ["CA", "CH"] }
      ]
    },
    {
      id: 4,
      question: {
        id: "Bagaimana cara Anda berinteraksi dalam lingkungan sosial?",
        en: "How do you interact in a social environment?",
        es: "¿Cómo interactúas en un entorno social?"
      },
      options: [
        { text: { id: "Saya sangat menjaga privasi. Tidak suka mencampuri urusan orang lain.", en: "I highly guard my privacy. I don't like meddling in other people's business.", es: "Guardo mucho mi privacidad. No me gusta entrometerme en los asuntos ajenos." }, pointsTo: ["JP", "CH"] },
        { text: { id: "Ramah, santai, dan mudah mengobrol dengan siapa saja tanpa melihat status.", en: "Friendly, relaxed, and easy to chat with anyone regardless of status.", es: "Amable, relajado y fácil de conversar con cualquiera sin importar el estatus." }, pointsTo: ["NZ", "CA"] },
        { text: { id: "Saya sangat ekspresif, suka bercerita panjang lebar, dan sangat komunal.", en: "I am very expressive, love telling long stories, and highly communal.", es: "Soy muy expresivo, me encanta contar historias largas y muy comunal." }, pointsTo: ["IT"] },
        { text: { id: "Saya efisien. Saya berjejaring (networking) demi tujuan profesional.", en: "I am efficient. I network for professional purposes.", es: "Soy eficiente. Hago contactos para propósitos profesionales." }, pointsTo: ["SG"] }
      ]
    },
    {
      id: 5,
      question: {
        id: "Tipe cuaca seperti apa yang paling Anda sukai atau toleransi?",
        en: "What type of weather do you prefer or tolerate best?",
        es: "¿Qué tipo de clima prefieres o toleras mejor?"
      },
      options: [
        { text: { id: "Dingin menggigit dan bersalju tebal sama sekali bukan masalah bagi saya.", en: "Biting cold and heavy snow are not a problem for me at all.", es: "El frío cortante y la nieve intensa no son un problema para mí en absoluto." }, pointsTo: ["CA", "CH"] },
        { text: { id: "4 Musim yang jelas agar pemandangan berganti secara dinamis.", en: "4 distinct seasons so the scenery changes dynamically.", es: "4 estaciones distintas para que el paisaje cambie dinámicamente." }, pointsTo: ["JP", "IT"] },
        { text: { id: "Tropis hangat sepanjang tahun, asalkan AC di dalam ruangan sangat dingin.", en: "Warm tropical all year round, as long as the indoor AC is very cold.", es: "Cálido tropical todo el año, siempre que el aire acondicionado interior esté muy frío." }, pointsTo: ["SG"] },
        { text: { id: "Sejuk, berangin, dan terkadang hujan. Cocok untuk memakai jaket outdoor.", en: "Cool, windy, and sometimes rainy. Perfect for wearing an outdoor jacket.", es: "Fresco, ventoso y a veces lluvioso. Perfecto para usar una chaqueta de exterior." }, pointsTo: ["NZ"] }
      ]
    },
    {
      id: 6,
      question: {
        id: "Apa preferensi utama Anda soal kuliner?",
        en: "What is your main preference regarding food?",
        es: "¿Cuál es tu principal preferencia con respecto a la comida?"
      },
      options: [
        { text: { id: "Makanan yang bersih, sehat, presisi, dan memiliki presentasi visual tinggi.", en: "Clean, healthy, precise food with high visual presentation.", es: "Comida limpia, saludable, precisa y con una alta presentación visual." }, pointsTo: ["JP", "CH"] },
        { text: { id: "Kuliner yang cepat, praktis, namun sangat beragam dari berbagai budaya.", en: "Fast, practical culinary options, yet highly diverse from various cultures.", es: "Opciones culinarias rápidas, prácticas y muy diversas de varias culturas." }, pointsTo: ["SG", "CA"] },
        { text: { id: "Pesta karbohidrat! Pasta, pizza, dan makan lambat sambil mengobrol.", en: "Carb fest! Pasta, pizza, and eating slowly while chatting.", es: "¡Fiesta de carbohidratos! Pasta, pizza y comer despacio mientras charlamos." }, pointsTo: ["IT"] },
        { text: { id: "Barbekyu santai di luar ruangan dengan bahan-bahan segar dari peternakan.", en: "Relaxed outdoor BBQ with fresh ingredients straight from the farm.", es: "Barbacoa relajada al aire libre con ingredientes frescos directamente de la granja." }, pointsTo: ["NZ"] }
      ]
    },
    {
      id: 7,
      question: {
        id: "Bagaimana cara Anda lebih suka bepergian sehari-hari?",
        en: "How do you prefer to commute daily?",
        es: "¿Cómo prefieres viajar a diario?"
      },
      options: [
        { text: { id: "Kereta super cepat atau MRT yang tidak pernah terlambat satu menit pun.", en: "Super fast trains or MRT that are never a minute late.", es: "Trenes súper rápidos o metro que nunca se retrasan ni un minuto." }, pointsTo: ["JP", "SG", "CH"] },
        { text: { id: "Mengemudi mobil SUV menyusuri jalanan alam yang sepi dan indah.", en: "Driving an SUV along quiet and beautiful nature roads.", es: "Conducir un SUV por carreteras naturales hermosas y tranquilas." }, pointsTo: ["NZ", "CA"] },
        { text: { id: "Naik skuter klasik atau berjalan kaki melewati gang-gang bersejarah.", en: "Riding a classic scooter or walking through historic alleys.", es: "Montar en un scooter clásico o caminar por callejones históricos." }, pointsTo: ["IT"] },
        { text: { id: "Menggunakan sepeda di kota dengan jalur khusus yang sangat aman.", en: "Using a bicycle in a city with very safe dedicated lanes.", es: "Andar en bicicleta en una ciudad con carriles dedicados muy seguros." }, pointsTo: ["CH", "JP"] }
      ]
    },
    {
      id: 8,
      question: {
        id: "Gaya hunian (arsitektur) seperti apa yang Anda impikan?",
        en: "What kind of residential architecture do you dream of?",
        es: "¿Qué tipo de arquitectura residencial sueñas?"
      },
      options: [
        { text: { id: "Apartemen mewah berteknologi tinggi di pusat kota yang praktis.", en: "High-tech luxury apartment in a practical city center.", es: "Apartamento de lujo de alta tecnología en un centro de la ciudad práctico." }, pointsTo: ["SG", "JP"] },
        { text: { id: "Rumah kayu minimalis berkonsep Zen atau Chalet di lereng pegunungan.", en: "Minimalist Zen-concept wooden house or a Chalet on a mountain slope.", es: "Casa de madera minimalista de concepto Zen o un chalet en la ladera de una montaña." }, pointsTo: ["CH", "JP", "CA"] },
        { text: { id: "Vila pedesaan bernuansa klasik dengan balkon yang menghadap ke kebun.", en: "Classic countryside villa with a balcony facing a garden.", es: "Villa rural clásica con balcón que da a un jardín." }, pointsTo: ["IT"] },
        { text: { id: "Rumah modern berhalaman rumput sangat luas tanpa pagar yang tinggi.", en: "Modern house with a massive lawn and no high fences.", es: "Casa moderna con un enorme césped y sin vallas altas." }, pointsTo: ["NZ", "CA"] }
      ]
    },
    {
      id: 9,
      question: {
        id: "Bagaimana pandangan Anda terhadap 'Aturan' di masyarakat?",
        en: "What is your view on 'Rules' in society?",
        es: "¿Cuál es tu visión sobre las 'Reglas' en la sociedad?"
      },
      options: [
        { text: { id: "Aturan adalah segalanya. Ketertiban dan kedisiplinan tidak boleh dilanggar.", en: "Rules are everything. Order and discipline must not be violated.", es: "Las reglas lo son todo. El orden y la disciplina no deben ser violados." }, pointsTo: ["JP", "SG"] },
        { text: { id: "Aturan itu penting demi keamanan, tapi kesopanan antar warga lebih utama.", en: "Rules are important for safety, but politeness among citizens is paramount.", es: "Las reglas son importantes para la seguridad, pero la cortesía entre los ciudadanos es primordial." }, pointsTo: ["CA", "CH"] },
        { text: { id: "Aturan itu fleksibel. Yang penting kita menikmati hidup tanpa menyakiti orang.", en: "Rules are flexible. The key is to enjoy life without hurting anyone.", es: "Las reglas son flexibles. La clave es disfrutar la vida sin lastimar a nadie." }, pointsTo: ["IT"] },
        { text: { id: "Saya suka kebebasan mutlak dan hidup santai tanpa banyak intervensi.", en: "I like absolute freedom and a relaxed life without much intervention.", es: "Me gusta la libertad absoluta y una vida relajada sin mucha intervención." }, pointsTo: ["NZ"] }
      ]
    },
    {
      id: 10,
      question: {
        id: "Jika harus memilih, apa 'Tujuan Akhir' hidup Anda?",
        en: "If you had to choose, what is your 'Ultimate Goal' in life?",
        es: "Si tuvieras que elegir, ¿cuál es tu 'Meta Final' en la vida?"
      },
      options: [
        { text: { id: "Meraih kemapanan finansial dan pengakuan atas karya saya.", en: "Achieving financial stability and recognition for my work.", es: "Lograr la estabilidad financiera y el reconocimiento por mi trabajo." }, pointsTo: ["SG", "JP"] },
        { text: { id: "Menikmati setiap detik kehidupan dengan cinta, seni, makanan, dan tawa.", en: "Enjoying every second of life with love, art, food, and laughter.", es: "Disfrutando cada segundo de la vida con amor, arte, comida y risas." }, pointsTo: ["IT"] },
        { text: { id: "Mengeksplorasi setiap sudut keindahan dunia dengan bebas merdeka.", en: "Exploring every corner of the world's beauty with absolute freedom.", es: "Explorando cada rincón de la belleza del mundo con absoluta libertad." }, pointsTo: ["NZ"] },
        { text: { id: "Hidup tenang, sangat aman, dan damai bersama keluarga yang terjamin.", en: "Living a calm, very safe, and peaceful life with a secure family.", es: "Vivir una vida tranquila, muy segura y pacífica con una familia protegida." }, pointsTo: ["CH", "CA"] }
      ]
    }
  ];

  return baseQuestions.map(q => ({
    ...q,
    question: q.question[lang as keyof typeof q.question] || q.question.id,
    options: q.options.map(opt => ({
      text: opt.text[lang as keyof typeof opt.text] || opt.text.id,
      pointsTo: opt.pointsTo,
    })),
  }));
};
// ========== KOMPONEN UTAMA ==========
export default function WhichCountry({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"];

  const [step, setStep] = useState<"INTRO" | "QUIZ" | "LOADING" | "RESULT">("INTRO");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    JP: 0, CH: 0, IT: 0, NZ: 0, CA: 0, SG: 0
  });
  const [resultId, setResultId] = useState<string | null>(null);

  const questions = getQuestions(activeLang);

  const startQuiz = () => {
    setScores({ JP: 0, CH: 0, IT: 0, NZ: 0, CA: 0, SG: 0 });
    setCurrentQIndex(0);
    setResultId(null);
    setStep("QUIZ");
  };

  const handleAnswer = (pointsTo: string[]) => {
    const newScores = { ...scores };
    pointsTo.forEach(countryId => {
      newScores[countryId] += 1;
    });
    setScores(newScores);
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      processResult(newScores);
    }
  };

  const processResult = (finalScores: Record<string, number>) => {
    setStep("LOADING");
    setTimeout(() => {
      let maxScore = -1;
      let winner = "JP"; // Fallback
      Object.entries(finalScores).forEach(([countryId, score]) => {
        if (score > maxScore) {
          maxScore = score;
          winner = countryId;
        }
      });
      setResultId(winner);
      setStep("RESULT");
      import("canvas-confetti").then((mod) => {
        mod.default({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }).catch(() => {});
    }, 2500);
  };

  const shareResult = async () => {
    if (!resultId) return;
    const country = COUNTRIES_DB_ML[resultId];
    const countryData = country.data[activeLang] || country.data["id"];
    const text = `${dict.title}: ${countryData.name} ${country.emoji}\n${countryData.archetype}\n\n${countryData.desc.substring(0, 100)}...\n\n${dict.disclaimer}`;
    
    if (navigator.share) {
      try { await navigator.share({ title: dict.title, text }); } catch(e) {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
      } catch (err) {
        alert("Failed to copy.");
      }
    }
  };

  // ================= RENDERERS =================

  if (step === "INTRO") {
    return (
      <div className="max-w-3xl mx-auto text-white font-sans px-4 py-12 text-center">
        <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>🌍✈️</div>
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg pb-2">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm md:text-base mt-4 max-w-lg mx-auto leading-relaxed">
          {dict.subtitle}
        </p>
        <button 
          onClick={startQuiz}
          className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] uppercase tracking-wider"
        >
          {dict.startBtn}
        </button>
      </div>
    );
  }

  if (step === "LOADING") {
    return (
      <div className="max-w-3xl mx-auto text-white flex flex-col justify-center items-center py-20 px-4">
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-blue-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-indigo-500/20 border-b-blue-500 rounded-full animate-spin animate-reverse"></div>
          <span className="text-3xl animate-pulse">✈️</span>
        </div>
        <h3 className="text-cyan-400 font-bold tracking-[0.2em] uppercase animate-pulse text-center">
          {dict.analyzing}
        </h3>
        <p className="text-slate-400 text-xs mt-2 text-center">{dict.syncing}</p>
      </div>
    );
  }

  if (step === "QUIZ") {
    const currentQ = questions[currentQIndex];
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6 animate-in fade-in duration-300">
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
            <span>{dict.progressLabel}</span>
            <span className="text-cyan-400">{currentQIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <h3 className="relative z-10 text-xl md:text-2xl font-bold text-slate-100 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>
          <div className="space-y-3 relative z-10">
            {currentQ.options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.pointsTo)}
                className="w-full text-left p-4 md:p-5 rounded-2xl bg-black/40 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/50 hover:pl-6 transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-colors border border-white/5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm md:text-base font-medium text-slate-200 group-hover:text-white leading-relaxed">
                    {opt.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
// ==== RESULT STATE ====
  const resultData = resultId ? COUNTRIES_DB_ML[resultId] : null;
  const countryData = resultData ? (resultData.data[activeLang] || resultData.data["id"]) : null;

  if (step === "RESULT" && resultData && countryData) {
    return (
      <div className="max-w-3xl mx-auto text-white font-sans px-4 py-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold tracking-widest text-slate-300 uppercase mb-4 shadow-sm">
            {dict.resultBadge}
          </span>
        </div>

        <div className={`bg-gradient-to-br ${resultData.gradientBg} backdrop-blur-xl border rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none mix-blend-overlay"></div>

          <div className="text-center relative z-10">
            <div className="text-8xl drop-shadow-2xl mb-4 hover:scale-110 transition-transform duration-300 cursor-default">
              {resultData.emoji}
            </div>
            <h3 className={`text-4xl md:text-6xl font-black bg-gradient-to-b ${resultData.gradientText} bg-clip-text text-transparent drop-shadow-sm pb-1`}>
              {countryData.name}
            </h3>
            <div className="mt-4">
              <span className="text-xs md:text-sm font-bold text-slate-100 uppercase tracking-widest bg-black/30 px-5 py-2.5 rounded-lg border border-white/10 shadow-inner">
                {countryData.archetype}
              </span>
            </div>
          </div>

          <div className="mt-10 space-y-4 relative z-10">
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-slate-200 text-sm leading-relaxed font-medium">{countryData.desc}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>💼</span> {dict.labels.workLife}
                </p>
                <p className="text-slate-200 text-xs leading-relaxed font-medium">{countryData.workLife}</p>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>🤝</span> {dict.labels.socialVibe}
                </p>
                <p className="text-slate-200 text-xs leading-relaxed font-medium">{countryData.socialVibe}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 text-center p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/30">
            <p className="text-cyan-200 text-sm font-medium italic">{dict.quote}</p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <button onClick={shareResult} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all uppercase tracking-wider text-slate-100">
              📤 {dict.shareBtn}
            </button>
            <button onClick={startQuiz} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 text-xs font-bold transition-all uppercase tracking-wider">
              {dict.retakeBtn}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-500 border-t border-slate-800 pt-4 max-w-lg mx-auto">
          {dict.disclaimer}
        </div>
        
        {/* ============================================= */}
        {/* 🟢 INJEKSI PAYWALL DILETAKKAN DI SINI 🟢 */}
        {/* ============================================= */}
        
            <>

            <PremiumPaywall 
          toolName={dict.title} 
          resultId={resultId || "which-country-result"} 
        />
</>
        {/* ============================================= */}
        
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-in {
            animation: fade-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }
          .animate-reverse {
            animation-direction: reverse;
          }
        `}</style>
      </div>
    );
  }

  return null;
}