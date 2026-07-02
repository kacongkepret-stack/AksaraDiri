import Link from "next/link";
import Script from "next/script";

// ========== DATABASE HALAMAN DEPAN (MEGA SEO SILO STRUCTURE) ==========
const HOME_DATA: Record<string, any> = {
  id: {
    hero: {
      badge: "ALGORITMA BARU 2026",
      title: "Kenali Diri Anda Lebih Dalam",
      subtitle: "Jelajahi matriks kepribadian Anda melalui perpaduan sains psikologi modern dan kebijaksanaan numerologi kuno secara akurat.",
      ctaText: "Mulai Jelajahi",
      ctaLink: "/test/mbti"
    },
    popularTitle: "Paling Banyak Diuji",
    seoListTitle: "Direktori Lengkap Analisis & Alat AksaraDiri",
    categories: [
      { id: "cat1", icon: "🧠", title: "Kepribadian", desc: "Tes psikometrik, MBTI, dan analisis karakter.", href: "/category/personality", color: "from-cyan-500/20 to-blue-500/10" },
      { id: "cat2", icon: "✨", title: "Zodiak", desc: "Ramalan bintang, kompatibilitas, dan horoskop.", href: "/category/astrology", color: "from-purple-500/20 to-pink-500/10" },
      { id: "cat3", icon: "📜", title: "Lokal", desc: "Primbon Jawa, Kalender Bali, Weton & Neptu.", href: "/category/local", color: "from-amber-500/20 to-orange-500/10" },
      { id: "cat4", icon: "🃏", title: "Viral", desc: "Kartu takdir, cek aura, dan kuis viral menarik.", href: "/category/viral", color: "from-rose-500/20 to-red-500/10" }
    ],
    popular: [
      { id: "p1", icon: "🧩", title: "16 Tipe Kepribadian", users: "1.2M+ Uji", href: "/test/mbti" },
      { id: "p2", icon: "📜", title: "Kalkulator Weton", users: "950K+ Uji", href: "/tools/weton" },
      { id: "p3", icon: "✨", title: "Profil Zodiak", users: "880K+ Uji", href: "/tools/zodiac" },
      { id: "p4", icon: "🧠", title: "Tes Mini IQ", users: "750K+ Uji", href: "/test/iq" },
      { id: "p5", icon: "❤️", title: "Kalkulator Cinta", users: "600K+ Uji", href: "/tools/love-calculator" },
      { id: "p6", icon: "🃏", title: "Kartu Takdir", users: "500K+ Uji", href: "/tools/destiny-card" }
    ],
    groupedTools: [
      {
        categoryTitle: "🧠 Psikologi & Kepribadian",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300",
        hoverColor: "hover:text-cyan-400",
        tools: [
          { title: "16 Tipe Kepribadian", desc: "Temukan pola kepribadian sejatimu berdasarkan teori Myers-Briggs.", href: "/test/mbti" },
          { title: "Tes Mini IQ", desc: "Ukur kemampuan logika visual dan pemecahan masalah.", href: "/test/iq" },
          { title: "Kecerdasan Emosional (EQ)", desc: "Analisis tingkat kendali emosi & interaksi sosial Anda.", href: "/test/eq" },
          { title: "Introvert / Ekstrovert", desc: "Ukur spektrum energi sosial dan cara Anda mengisi ulang daya.", href: "/test/introvert-extrovert" },
          { title: "Bahasa Cinta", desc: "Cara dominan mengekspresikan dan menerima kasih sayang.", href: "/test/love-language" },
          { title: "Gaya Keterikatan", desc: "Pola hubungan dan ikatan emosional masa lalu.", href: "/test/attachment-style" },
          { title: "Usia Mental", desc: "Tingkat kedewasaan pola pikir dibanding usia biologis.", href: "/test/mental-age" },
          { title: "Tes Kreativitas", desc: "Ukur potensi, inovasi, dan imajinasi otak kanan Anda.", href: "/test/creativity" },
          { title: "Gaya Kepemimpinan", desc: "Cara Anda memimpin tim & mengambil keputusan krusial.", href: "/test/leadership" },
          { title: "Tipe Stres", desc: "Pola stres pemicu & strategi mengatasi tekanan.", href: "/test/stress-type" }
        ]
      },
      {
        categoryTitle: "📜 Kearifan Lokal",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400",
        hoverColor: "hover:text-amber-400",
        tools: [
          { title: "Kalkulator Weton", desc: "Perhitungan neptu hari dan pasaran kelahiran Anda.", href: "/tools/weton" },
          { title: "Kalkulator Neptu", desc: "Sistem numerologi Jawa kuno untuk melihat nasib.", href: "/tools/neptu" },
          { title: "Kalender Jawa", desc: "Konversi tanggal masehi ke sistem penanggalan Jawa.", href: "/tools/kalender-jawa" },
          { title: "Kalender Bali", desc: "Sistem penanggalan Saka dan Pawukon Bali.", href: "/tools/kalender-bali" },
          { title: "Hari Pasaran", desc: "Cek siklus pancawara (Legi, Pahing, Pon, Wage, Kliwon).", href: "/tools/hari-pasaran" },
          { title: "Nama Bayi Jawa", desc: "Generator nama bermakna baik berdasar filosofi Jawa.", href: "/tools/nama-bayi-jawa" },
          { title: "Arah Rezeki", desc: "Panduan arah keberuntungan berdasar hitungan primbon.", href: "/tools/arah-rezeki" },
          { title: "Watak Kelahiran", desc: "Analisis tabiat dasar berdasarkan tanggal lahir Nusantara.", href: "/tools/watak-kelahiran" },
          { title: "Tafsir Arti Mimpi", desc: "Kamus primbon untuk menerjemahkan simbol mimpi.", href: "/tools/arti-mimpi" },
          { title: "Hari Baik Nikah", desc: "Kalkulasi tanggal optimal untuk pernikahan berdasar neptu.", href: "/tools/hari-baik-nikah" },
          { title: "Primbon Jodoh", desc: "Cek tingkat kecocokan dan harmoni pasangan ala Jawa.", href: "/tools/primbon-jodoh" }
        ]
      },
      {
        categoryTitle: "✨ Astrologi & Numerologi",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400",
        hoverColor: "hover:text-purple-400",
        tools: [
          { title: "Profil Zodiak", desc: "Analisis mendalam elemen, planet, dan sifat zodiak Anda.", href: "/tools/zodiac" },
          { title: "Zodiac Match", desc: "Kalkulator persentase cinta antar dua zodiak.", href: "/tools/zodiac-match" },
          { title: "Shio (Zodiak China)", desc: "Temukan elemen dan hewan pelindung tahun kelahiran Anda.", href: "/tools/shio" },
          { title: "Kalkulator Numerologi", desc: "Analisis nama dan tanggal lahir menggunakan angka mistis.", href: "/tools/numerology" },
          { title: "Angka Keberuntungan", desc: "Temukan nomor hoki harian berdasarkan data kelahiran.", href: "/tools/lucky-number" },
          { title: "Warna Keberuntungan", desc: "Aura warna yang membawa vibrasi positif untuk Anda.", href: "/tools/lucky-color" },
          { title: "Horoskop Harian", desc: "Ramalan bintang harian untuk panduan karir dan asmara.", href: "/tools/horoscope" },
          { title: "Life Path Number", desc: "Jalur takdir dan tujuan hidup utama berdasarkan numerologi.", href: "/tools/life-path" },
          { title: "Makna Hari Lahir", desc: "Psikologi di balik hari Anda dilahirkan ke dunia.", href: "/tools/birth-meaning" }
        ]
      },
      {
        categoryTitle: "🃏 Hiburan & Kuis Viral",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500",
        hoverColor: "hover:text-rose-400",
        tools: [
          { title: "Kartu Takdir Semesta", desc: "Tarik kartu mistis untuk afirmasi dan petunjuk hari ini.", href: "/tools/destiny-card" },
          { title: "Roda Keberuntungan", desc: "Putar roda takdir untuk pengambilan keputusan acak.", href: "/tools/fortune-wheel" },
          { title: "Kehidupan Masa Lalu", desc: "Kuis hiburan reinkarnasi dan profesi Anda di masa lampau.", href: "/tools/past-life" },
          { title: "Kuis Destinasi Negara", desc: "Geografi psikologis: Negara mana yang cocok untukmu?", href: "/tools/which-country" },
          { title: "Bakat Tersembunyi", desc: "Deteksi potensi terpendam yang belum Anda asah.", href: "/tools/hidden-talent" },
          { title: "Spirit Animal", desc: "Temukan hewan roh penjaga yang mewakili energi Anda.", href: "/tools/spirit-animal" },
          { title: "Aura Color", desc: "Cek spektrum warna energi yang memancar dari tubuh Anda.", href: "/tools/aura-color" },
          { title: "Inisial Jodoh", desc: "Algoritma hash untuk memprediksi inisial cinta sejatimu.", href: "/tools/soulmate-initials" },
          { title: "Ship Name Generator", desc: "Gabungkan namamu dan pasangan menjadi nama couple unik.", href: "/tools/ship-name-generator" },
          { title: "Kalkulator Cinta", desc: "Hitung persentase kecocokan nama Anda dan si dia.", href: "/tools/love-calculator" },
          { title: "Makna Nama", desc: "Bongkar arti tersembunyi dan karakteristik dari nama Anda.", href: "/tools/name-meaning" }
        ]
      }
    ]
  },
  en: {
    hero: { badge: "NEW ALGORITHM 2026", title: "Know Yourself Deeper", subtitle: "Explore your personality matrix through a blend of modern psychology and ancient numerology accurately.", ctaText: "Start Exploring", ctaLink: "/test/mbti" },
    popularTitle: "Most Tested Tools",
    seoListTitle: "Complete AksaraDiri Tool Directory",
    categories: [
      { id: "cat1", icon: "🧠", title: "Personality", desc: "Psychometric tests, MBTI, and character analysis.", href: "/category/personality", color: "from-cyan-500/20 to-blue-500/10" },
      { id: "cat2", icon: "✨", title: "Astrology", desc: "Zodiac readings, compatibility, and horoscopes.", href: "/category/astrology", color: "from-purple-500/20 to-pink-500/10" },
      { id: "cat3", icon: "📜", title: "Local", desc: "Javanese primbon, neptu, and birth calculations.", href: "/category/local", color: "from-amber-500/20 to-orange-500/10" },
      { id: "cat4", icon: "🃏", title: "Viral", desc: "Destiny cards, aura checks, and trending quizzes.", href: "/category/viral", color: "from-rose-500/20 to-red-500/10" }
    ],
    popular: [
      { id: "p1", icon: "🧩", title: "16 Personalities", users: "1.2M+ Tests", href: "/test/mbti" },
      { id: "p2", icon: "📜", title: "Weton Calculator", users: "950K+ Tests", href: "/tools/weton" },
      { id: "p3", icon: "✨", title: "Zodiac Profile", users: "880K+ Tests", href: "/tools/zodiac" },
      { id: "p4", icon: "🧠", title: "Mini IQ Test", users: "750K+ Tests", href: "/test/iq" },
      { id: "p5", icon: "❤️", title: "Love Calculator", users: "600K+ Tests", href: "/tools/love-calculator" },
      { id: "p6", icon: "🃏", title: "Destiny Card", users: "500K+ Tests", href: "/tools/destiny-card" }
    ],
    groupedTools: [
      {
        categoryTitle: "🧠 Psychology & Personality",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300",
        hoverColor: "hover:text-cyan-400",
        tools: [
          { title: "16 Personalities", desc: "Find your true personality pattern based on Myers-Briggs.", href: "/test/mbti" },
          { title: "Mini IQ Test", desc: "Measure your visual logic and problem-solving skills.", href: "/test/iq" },
          { title: "Emotional Intelligence", desc: "Analyze your emotional control and social interaction.", href: "/test/eq" },
          { title: "Introvert / Extrovert", desc: "Measure your social energy spectrum.", href: "/test/introvert-extrovert" },
          { title: "Love Language", desc: "Your dominant way of expressing and receiving love.", href: "/test/love-language" },
          { title: "Attachment Style", desc: "Patterns of past emotional relationships and bonds.", href: "/test/attachment-style" },
          { title: "Mental Age", desc: "The maturity level of your mindset vs biological age.", href: "/test/mental-age" },
          { title: "Creativity Test", desc: "Measure your right-brain innovation and imagination.", href: "/test/creativity" },
          { title: "Leadership Style", desc: "How you lead a team and make crucial decisions.", href: "/test/leadership" },
          { title: "Stress Type", desc: "Stress trigger patterns and coping strategies.", href: "/test/stress-type" }
        ]
      },
      {
        categoryTitle: "📜 Local Wisdom",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400",
        hoverColor: "hover:text-amber-400",
        tools: [
          { title: "Weton Calculator", desc: "Javanese neptu calculation based on birth date.", href: "/tools/weton" },
          { title: "Neptu Calculator", desc: "Ancient Javanese numerology system to foresee destiny.", href: "/tools/neptu" },
          { title: "Javanese Calendar", desc: "Convert standard dates to the Javanese calendar system.", href: "/tools/kalender-jawa" },
          { title: "Balinese Calendar", desc: "Balinese Saka and Pawukon calendar system.", href: "/tools/kalender-bali" },
          { title: "Market Day", desc: "Check Javanese 5-day cycle (Legi, Pahing, Pon, Wage, Kliwon).", href: "/tools/hari-pasaran" },
          { title: "Javanese Baby Names", desc: "Meaningful name generator based on Javanese philosophy.", href: "/tools/nama-bayi-jawa" },
          { title: "Fortune Direction", desc: "Lucky direction guide based on primbon calculations.", href: "/tools/arah-rezeki" },
          { title: "Birth Character", desc: "Basic trait analysis based on Archipelago birth dates.", href: "/tools/watak-kelahiran" },
          { title: "Dream Meaning", desc: "Primbon dictionary to translate dream symbols.", href: "/tools/arti-mimpi" },
          { title: "Wedding Day", desc: "Optimal date calculation for marriage based on neptu.", href: "/tools/hari-baik-nikah" },
          { title: "Soulmate Primbon", desc: "Check partner compatibility and harmony Javanese style.", href: "/tools/primbon-jodoh" }
        ]
      },
      {
        categoryTitle: "✨ Astrology & Numerology",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400",
        hoverColor: "hover:text-purple-400",
        tools: [
          { title: "Zodiac Profile", desc: "In-depth analysis of your zodiac sign and planets.", href: "/tools/zodiac" },
          { title: "Zodiac Match", desc: "Love percentage calculator between two zodiacs.", href: "/tools/zodiac-match" },
          { title: "Chinese Zodiac", desc: "Find the element and guardian animal of your birth year.", href: "/tools/shio" },
          { title: "Numerology", desc: "Name and birth date analysis using mystical numbers.", href: "/tools/numerology" },
          { title: "Lucky Number", desc: "Find your daily lucky number based on birth data.", href: "/tools/lucky-number" },
          { title: "Lucky Color", desc: "The color aura that brings positive vibration for you.", href: "/tools/lucky-color" },
          { title: "Daily Horoscope", desc: "Daily star forecast for career and romance guidance.", href: "/tools/horoscope" },
          { title: "Life Path Number", desc: "Your main destiny path and life purpose based on numerology.", href: "/tools/life-path" },
          { title: "Birth Day Meaning", desc: "The psychology behind the day you were born.", href: "/tools/birth-meaning" }
        ]
      },
      {
        categoryTitle: "🃏 Entertainment & Viral Quizzes",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500",
        hoverColor: "hover:text-rose-400",
        tools: [
          { title: "Destiny Card", desc: "Draw mystical cards for affirmations and guidance today.", href: "/tools/destiny-card" },
          { title: "Wheel of Fortune", desc: "Spin the wheel of destiny for random decision making.", href: "/tools/fortune-wheel" },
          { title: "Past Life", desc: "Reincarnation and past profession entertainment quiz.", href: "/tools/past-life" },
          { title: "Ideal Country", desc: "Psychological geography: Which country fits you best?", href: "/tools/which-country" },
          { title: "Hidden Talent", desc: "Detect latent potential you haven't honed yet.", href: "/tools/hidden-talent" },
          { title: "Spirit Animal", desc: "Find the guardian spirit animal representing your energy.", href: "/tools/spirit-animal" },
          { title: "Aura Color", desc: "Check the energy color spectrum radiating from your body.", href: "/tools/aura-color" },
          { title: "Soulmate Initials", desc: "Hash algorithm to predict your true love's initials.", href: "/tools/soulmate-initials" },
          { title: "Ship Name", desc: "Combine your name and your partner's into a unique couple name.", href: "/tools/ship-name-generator" },
          { title: "Love Calculator", desc: "Calculate the compatibility percentage of you and your crush.", href: "/tools/love-calculator" },
          { title: "Name Meaning", desc: "Uncover hidden meanings and characteristics of your name.", href: "/tools/name-meaning" }
        ]
      }
    ]
  },
  es: {
    hero: { badge: "NUEVO ALGORITMO 2026", title: "Conócete Más Profundamente", subtitle: "Explora tu matriz de personalidad a través de una mezcla de ciencia moderna y numerología antigua.", ctaText: "Empezar", ctaLink: "/test/mbti" },
    popularTitle: "Herramientas Más Usadas",
    seoListTitle: "Directorio Completo de Herramientas",
    categories: [
      { id: "cat1", icon: "🧠", title: "Personalidad", desc: "Pruebas psicométricas y análisis de carácter.", href: "/category/personality", color: "from-cyan-500/20 to-blue-500/10" },
      { id: "cat2", icon: "✨", title: "Astrología", desc: "Lecturas del zodiaco, compatibilidad y horóscopos.", href: "/category/astrology", color: "from-purple-500/20 to-pink-500/10" },
      { id: "cat3", icon: "📜", title: "Local", desc: "Primbon javanés y cálculos de nacimiento.", href: "/category/local", color: "from-amber-500/20 to-orange-500/10" },
      { id: "cat4", icon: "🃏", title: "Viral", desc: "Cartas del destino, auras y cuestionarios virales.", href: "/category/viral", color: "from-rose-500/20 to-red-500/10" }
    ],
    popular: [
      { id: "p1", icon: "🧩", title: "16 Personalidades", users: "1.2M+ Pruebas", href: "/test/mbti" },
      { id: "p2", icon: "📜", title: "Calculadora Weton", users: "950K+ Pruebas", href: "/tools/weton" },
      { id: "p3", icon: "✨", title: "Perfil Zodiacal", users: "880K+ Pruebas", href: "/tools/zodiac" },
      { id: "p4", icon: "🧠", title: "Prueba de CI", users: "750K+ Pruebas", href: "/test/iq" },
      { id: "p5", icon: "❤️", title: "Calculadora de Amor", users: "600K+ Pruebas", href: "/tools/love-calculator" },
      { id: "p6", icon: "🃏", title: "Carta del Destino", users: "500K+ Pruebas", href: "/tools/destiny-card" }
    ],
    groupedTools: [
      {
        categoryTitle: "🧠 Psicología y Personalidad",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300",
        hoverColor: "hover:text-cyan-400",
        tools: [
          { title: "16 Personalidades", desc: "Encuentra tu verdadero patrón de personalidad.", href: "/test/mbti" },
          { title: "Prueba de CI", desc: "Mide tu lógica visual y resolución de problemas.", href: "/test/iq" },
          { title: "Inteligencia Emocional", desc: "Analiza tu control emocional e interacción social.", href: "/test/eq" },
          { title: "Introvertido / Extrovertido", desc: "Mide tu espectro de energía social.", href: "/test/introvert-extrovert" },
          { title: "Lenguaje del Amor", desc: "Tu forma dominante de expresar y recibir amor.", href: "/test/love-language" },
          { title: "Estilo de Apego", desc: "Patrones de relaciones y lazos emocionales pasados.", href: "/test/attachment-style" },
          { title: "Edad Mental", desc: "Nivel de madurez de tu mentalidad vs edad biológica.", href: "/test/mental-age" },
          { title: "Prueba de Creatividad", desc: "Mide tu innovación e imaginación.", href: "/test/creativity" },
          { title: "Estilo de Liderazgo", desc: "Cómo lideras y tomas decisiones cruciales.", href: "/test/leadership" },
          { title: "Tipo de Estrés", desc: "Patrones de activación del estrés y afrontamiento.", href: "/test/stress-type" }
        ]
      },
      {
        categoryTitle: "📜 Sabiduría Local",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400",
        hoverColor: "hover:text-amber-400",
        tools: [
          { title: "Calculadora Weton", desc: "Cálculo del neptu javanés basado en nacimiento.", href: "/tools/weton" },
          { title: "Calculadora Neptu", desc: "Antiguo sistema de numerología javanesa.", href: "/tools/neptu" },
          { title: "Calendario Javanés", desc: "Convierte fechas estándar al calendario javanés.", href: "/tools/kalender-jawa" },
          { title: "Calendario Balinés", desc: "Sistema de calendario balinés Saka y Pawukon.", href: "/tools/kalender-bali" },
          { title: "Día de Mercado", desc: "Ciclo javanés de 5 días (Legi, Pahing, Pon, Wage, Kliwon).", href: "/tools/hari-pasaran" },
          { title: "Nombres Javaneses", desc: "Generador de nombres con significado de la filosofía javanesa.", href: "/tools/nama-bayi-jawa" },
          { title: "Dirección de la Fortuna", desc: "Guía de dirección de la suerte basada en cálculos primbon.", href: "/tools/arah-rezeki" },
          { title: "Carácter de Nacimiento", desc: "Análisis de rasgos básicos basados en fechas del Archipiélago.", href: "/tools/watak-kelahiran" },
          { title: "Significado de Sueños", desc: "Diccionario primbon para traducir símbolos oníricos.", href: "/tools/arti-mimpi" },
          { title: "Día para Bodas", desc: "Cálculo de fecha óptima para el matrimonio.", href: "/tools/hari-baik-nikah" },
          { title: "Primbon de Almas", desc: "Verifica la compatibilidad y armonía de la pareja.", href: "/tools/primbon-jodoh" }
        ]
      },
      {
        categoryTitle: "✨ Astrología y Numerología",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400",
        hoverColor: "hover:text-purple-400",
        tools: [
          { title: "Perfil del Zodiaco", desc: "Análisis profundo de tu signo zodiacal y planetas.", href: "/tools/zodiac" },
          { title: "Compatibilidad del Zodiaco", desc: "Calculadora de porcentaje de amor entre dos zodiacos.", href: "/tools/zodiac-match" },
          { title: "Zodiaco Chino", desc: "Encuentra el elemento y animal guardián de tu año de nacimiento.", href: "/tools/shio" },
          { title: "Numerología", desc: "Análisis de nombre y nacimiento usando números místicos.", href: "/tools/numerology" },
          { title: "Número de la Suerte", desc: "Encuentra tu número de la suerte diario.", href: "/tools/lucky-number" },
          { title: "Color de la Suerte", desc: "El aura de color que trae vibración positiva para ti.", href: "/tools/lucky-color" },
          { title: "Horóscopo Diario", desc: "Pronóstico estelar diario para guía en carrera y romance.", href: "/tools/horoscope" },
          { title: "Camino de Vida", desc: "Tu principal camino del destino basado en la numerología.", href: "/tools/life-path" },
          { title: "Día de Nacimiento", desc: "La psicología detrás del día en que naciste.", href: "/tools/birth-meaning" }
        ]
      },
      {
        categoryTitle: "🃏 Entretenimiento Viral",
        titleGradient: "text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500",
        hoverColor: "hover:text-rose-400",
        tools: [
          { title: "Carta del Destino", desc: "Saca cartas místicas para afirmaciones y guía hoy.", href: "/tools/destiny-card" },
          { title: "Rueda de la Fortuna", desc: "Gira la rueda del destino para decisiones aleatorias.", href: "/tools/fortune-wheel" },
          { title: "Vida Pasada", desc: "Cuestionario de entretenimiento sobre reencarnación.", href: "/tools/past-life" },
          { title: "País Ideal", desc: "Geografía psicológica: ¿Qué país te encaja mejor?", href: "/tools/which-country" },
          { title: "Talento Oculto", desc: "Detecta potencial latente que aún no has pulido.", href: "/tools/hidden-talent" },
          { title: "Animal Espiritual", desc: "Encuentra el espíritu guardián que representa tu energía.", href: "/tools/spirit-animal" },
          { title: "Color de Aura", desc: "Revisa el espectro de color de energía que irradia tu cuerpo.", href: "/tools/aura-color" },
          { title: "Iniciales del Amor", desc: "Algoritmo hash para predecir las iniciales de tu amor.", href: "/tools/soulmate-initials" },
          { title: "Nombres de Pareja", desc: "Combina tu nombre y el de tu pareja en uno único.", href: "/tools/ship-name-generator" },
          { title: "Calculadora de Amor", desc: "Calcula el porcentaje de compatibilidad tuyo y de tu interés.", href: "/tools/love-calculator" },
          { title: "Significado del Nombre", desc: "Descubre significados ocultos y características de tu nombre.", href: "/tools/name-meaning" }
        ]
      }
    ]
  }
};

export default function HomePage({ params }: { params: { lang: string } }) {
  const currentLang = params.lang || "id";
  const data = HOME_DATA[currentLang] || HOME_DATA["id"];
  const fixLink = (url: string) => `/${currentLang}${url}`;

  // JSON-LD untuk SEO Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AksaraDiri",
    "url": "https://aksaradiri.my.id",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "All",
    "description": data.hero.subtitle,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col overflow-x-hidden">
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Background Glow Premium - Transisi gradasi yang lebih halus dan elegan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] md:w-[1100px] md:h-[650px] bg-gradient-to-b from-indigo-600/15 to-purple-600/5 blur-[100px] md:blur-[140px] rounded-[100%] pointer-events-none" />

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 sm:px-6 pt-12 md:pt-16 pb-20">
        
        {/* HERO SECTION & GRID CATEGORIES */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center min-h-[auto] md:min-h-[70vh]">
          
          <div className="text-left space-y-5 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-cyan-400">{data.hero.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] md:leading-[0.9]">
              {data.hero.title.split(" ").map((word: string, i: number) => (
                <span key={i} className={i >= 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400" : ""}>{word}{" "}</span>
              ))}
            </h1>
            <h2 className="text-slate-400 text-sm md:text-base lg:text-lg max-w-md leading-relaxed font-medium">{data.hero.subtitle}</h2>
            <div className="pt-2 md:pt-4">
              <Link href={fixLink(data.hero.ctaLink)} className="group relative px-6 md:px-8 py-3.5 md:py-4 bg-white text-slate-950 text-sm md:text-base font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] inline-block">
                {data.hero.ctaText} <span className="group-hover:translate-x-1.5 transition-transform inline-block duration-300">→</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-8 lg:mt-0">
            {data.categories.map((cat: any) => (
              <Link key={cat.id} href={fixLink(cat.href)} className="group relative p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-white/5 bg-white/[0.03] backdrop-blur-xl overflow-hidden hover:border-white/15 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/50">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <span className="text-3xl md:text-4xl mb-3 md:mb-4 block group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{cat.icon}</span>
                <h3 className="text-lg md:text-xl font-bold mb-1 text-white">{cat.title}</h3>
                <p className="text-[11px] md:text-xs text-slate-400 font-medium leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* POPULAR ITEMS (6 Item Tertinggi) */}
        <div className="max-w-6xl w-full mt-16 md:mt-10">
          <div className="flex items-center gap-3 mb-5 md:mb-6">
            <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{data.popularTitle}</h3>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {data.popular.map((item: any) => (
              <Link key={item.id} href={fixLink(item.href)} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 md:p-4 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group backdrop-blur-md shadow-lg shadow-black/20 hover:-translate-y-0.5">
                <span className="text-xl md:text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{item.icon}</span>
                <div className="min-w-0">
                  <h4 className="text-xs md:text-sm font-semibold text-slate-200 group-hover:text-white truncate transition-colors">{item.title}</h4>
                  <p className="text-[9px] md:text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] animate-pulse" /> {item.users}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* MEGA REPOSITORY DIRECTORY UNTUK SEO GOOGLE (40+ TOOLS) */}
        <div className="max-w-6xl w-full mt-24 md:mt-28 border-t border-white/5 pt-12 md:pt-16">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">
              {data.seoListTitle}
            </h3>
            <p className="text-slate-500 text-[11px] md:text-xs mt-3 max-w-lg mx-auto px-4 leading-relaxed">
              Jelajahi seluruh ekosistem kuis, analisis, dan kalkulator takdir yang tersedia secara gratis di platform kami.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-12 lg:gap-y-16">
            {data.groupedTools.map((group: any, gIdx: number) => (
              <div key={gIdx} className="flex flex-col bg-white/[0.01] p-6 md:p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors duration-500">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <h4 className={`text-base md:text-lg font-black tracking-wide ${group.titleGradient}`}>
                    {group.categoryTitle}
                  </h4>
                  <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1"></div>
                </div>
                {/* Tools Grid dalam tiap Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  {group.tools.map((tool: any, tIdx: number) => (
                    <div key={tIdx} className="group/tool flex flex-col">
                      <Link href={fixLink(tool.href)} className={`text-slate-300 font-bold ${group.hoverColor} transition-colors duration-300 block mb-1.5 text-sm`}>
                        {tool.title}
                      </Link>
                      <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 group-hover/tool:text-slate-400 transition-colors duration-300">
                        {tool.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </main>
    </div>
  );
}