"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

const DICTIONARY: Record<string, any> = {
  id: {
    title: "Shio Premium", badge: "Ultra Premium",
    subtitle: "Analisis shio, elemen, kecocokan, dan energi harian personal berdasarkan astrologi Cina klasik.",
    shareBtn: "📤 Bagikan Hasil",
    inputs: { yearLabel: "Tahun Lahir", randomBtn: "🎲 Acak Tahun", placeholderYear: "Tahun lahir" },
    labels: {
      element: "Elemen", yinYang: "Yin/Yang", luckyColor: "Warna Keberuntungan", direction: "Arah",
      traits: "Sifat Utama", love: "Asmara", career: "Panggilan Karir", health: "Kesehatan",
      match: "Paling Cocok", challenge: "Tantangan Dengan", scoreThisYear: "Skor Tahun Ini",
      dailyPrediction: "Prediksi Harian", luckyNumber: "Angka Keberuntungan",
      disclaimer: "*Berdasarkan astrologi Cina klasik. Hasil bersifat prediktif dan motivasional.",
      quote: "\"Shio adalah peta karakter, bukan penjara takdir. Kita tetap bebas memilih.\""
    }
  },
  en: {
    title: "Premium Chinese Zodiac", badge: "Ultra Premium",
    subtitle: "Analysis of zodiac, element, compatibility, and daily personal energy based on classical astrology.",
    shareBtn: "📤 Share Result",
    inputs: { yearLabel: "Birth Year", randomBtn: "🎲 Random Year", placeholderYear: "Birth year" },
    labels: {
      element: "Element", yinYang: "Yin/Yang", luckyColor: "Lucky Color", direction: "Direction",
      traits: "Core Traits", love: "Love & Romance", career: "Career Path", health: "Health",
      match: "Best Match", challenge: "Challenging With", scoreThisYear: "This Year's Score",
      dailyPrediction: "Daily Prediction", luckyNumber: "Lucky Number",
      disclaimer: "*Based on classical Chinese astrology. Results are predictive and motivational.",
      quote: "\"The zodiac is a map of character, not a prison of fate. We are free to choose.\""
    }
  },
  es: {
    title: "Zodíaco Chino Premium", badge: "Ultra Premium",
    subtitle: "Análisis del zodíaco, elemento, compatibilidad y energía diaria basado en astrología clásica.",
    shareBtn: "📤 Compartir Resultado",
    inputs: { yearLabel: "Año de Nacimiento", randomBtn: "🎲 Año Aleatorio", placeholderYear: "Año de nacimiento" },
    labels: {
      element: "Elemento", yinYang: "Yin/Yang", luckyColor: "Color de la Suerte", direction: "Dirección",
      traits: "Rasgos Principales", love: "Amor y Romance", career: "Camino Profesional", health: "Salud",
      match: "Mejor Combinación", challenge: "Desafío Con", scoreThisYear: "Puntaje del Año",
      dailyPrediction: "Predicción Diaria", luckyNumber: "Número de la Suerte",
      disclaimer: "*Basado en la astrología china clásica. Los resultados son predictivos y motivacionales.",
      quote: "\"El zodíaco es un mapa del carácter, no una prisión del destino. Somos libres de elegir.\""
    }
  }
};

type ShioKey = "Tikus" | "Kerbau" | "Macan" | "Kelinci" | "Naga" | "Ular" | "Kuda" | "Kambing" | "Monyet" | "Ayam" | "Anjing" | "Babi";

const SHIO_ORDER: ShioKey[] = [
  "Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi"
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const SHIO_DATA_ML: Record<ShioKey, any> = {
  Tikus: {
    icon: "🐀",
    data: {
      id: {
        element: "Air", yinYang: "Yang", luckyColor: "Hitam, Biru, Emas", direction: "Utara", season: "Musim Dingin",
        traits: ["Strategis", "Analitis", "Persuasif", "Cerdik"],
        desc: "Tikus adalah master taktik yang mampu melihat peluang di tengah krisis. Mereka unggul karena timing presisi dan kemampuan membaca arah angin. Di balik penampilan sederhana, tersimpan ambisi besar dan kecerdasan luar biasa.",
        love: "Membutuhkan stimulasi intelektual. Sangat setia namun menjaga kemandirian emosional. Pasangan ideal harus bisa mengimbangi kecepatan berpikir mereka.",
        career: "Sangat tajam dalam negosiasi bisnis, manajemen risiko, dan strategi digital. Mereka unggul mengambil keputusan cepat.",
        health: "Rentan terhadap gangguan kecemasan akibat otak yang terus bekerja; butuh manajemen stres seperti meditasi.",
        match: ["Naga", "Monyet", "Kerbau"], challenge: ["Kuda"],
        dailyTips: ["Fokus pada networking hari ini. Koneksi barumu akan membuka pintu.", "Jangan terlalu analitis dalam cinta. Biarkan hati berbicara.", "Keuangan membaik, simpan untuk darurat."]
      },
      en: {
        element: "Water", yinYang: "Yang", luckyColor: "Black, Blue, Gold", direction: "North", season: "Winter",
        traits: ["Strategic", "Analytical", "Persuasive", "Clever"],
        desc: "The Rat is a master tactician who spots opportunities in crisis. They excel through precise timing and reading the wind. Behind a simple look lies great ambition and intelligence.",
        love: "Needs intellectual stimulation. Loyal but emotionally independent. An ideal partner must match their thinking speed.",
        career: "Sharp in business negotiations, risk management, and digital strategy. They excel in quick decision-making.",
        health: "Prone to anxiety because their brain never stops; needs strict stress management like meditation.",
        match: ["Dragon", "Monkey", "Ox"], challenge: ["Horse"],
        dailyTips: ["Focus on networking today. New connections will open doors.", "Don't over-analyze love. Let your heart speak.", "Finances are improving, save for emergencies."]
      },
      es: {
        element: "Agua", yinYang: "Yang", luckyColor: "Negro, Azul, Oro", direction: "Norte", season: "Invierno",
        traits: ["Estratégico", "Analítico", "Persuasivo", "Astuto"],
        desc: "La Rata es un maestro táctico que ve oportunidades en la crisis. Sobresalen por su precisión y lectura del entorno. Detrás de su sencillez hay gran ambición e inteligencia.",
        love: "Necesita estimulación intelectual. Leal pero emocionalmente independiente. Su pareja debe seguir su ritmo mental.",
        career: "Agudo en negociaciones, gestión de riesgos y estrategia digital. Destacan tomando decisiones rápidas.",
        health: "Propenso a la ansiedad porque su cerebro nunca se detiene; necesita manejo del estrés como la meditación.",
        match: ["Dragón", "Mono", "Buey"], challenge: ["Caballo"],
        dailyTips: ["Concéntrate en el networking hoy. Nuevas conexiones abrirán puertas.", "No analices demasiado el amor. Deja hablar al corazón.", "Las finanzas mejoran, ahorra para emergencias."]
      }
    }
  },
  Kerbau: {
    icon: "🐂",
    data: {
      id: {
        element: "Tanah", yinYang: "Yin", luckyColor: "Kuning, Coklat, Hijau Tua", direction: "Timur Laut", season: "Musim Dingin",
        traits: ["Tekun", "Disiplin", "Otoriter", "Stabil"],
        desc: "Kerbau melambangkan fondasi yang tak tergoyahkan. Mereka eksekutor yang menyelesaikan tugas tanpa mengeluh, membangun kesuksesan lewat konsistensi jangka panjang layaknya batu karang.",
        love: "Pasangan tradisional yang sangat menghargai stabilitas. Mereka menunjukkan cinta lewat tindakan nyata, bukan kata-kata manis.",
        career: "Pilar utama dalam manufaktur, teknik, keuangan, atau struktur besar. Mereka adalah andalan di saat krisis.",
        health: "Fisik kuat, namun waspadai kekakuan sendi akibat terlalu kaku bekerja. Peregangan rutin sangat dianjurkan.",
        match: ["Tikus", "Ayam", "Ular"], challenge: ["Kambing"],
        dailyTips: ["Rutinitas membosankan? Coba hobi baru untuk menyegarkan pikiran.", "Hindari konflik di tempat kerja. Dengarkan dulu.", "Energi fisikmu sedang prima. Selesaikan pekerjaan tertunda."]
      },
      en: {
        element: "Earth", yinYang: "Yin", luckyColor: "Yellow, Brown, Dark Green", direction: "Northeast", season: "Winter",
        traits: ["Diligent", "Disciplined", "Authoritative", "Stable"],
        desc: "The Ox symbolizes an unshakable foundation. They complete tasks without complaint, building success through long-term consistency like a solid rock.",
        love: "A traditional partner who values stability. They show love through real actions, not sweet words.",
        career: "A main pillar in manufacturing, engineering, or large structures. They are the backbone in times of crisis.",
        health: "Strong physical health, but beware of joint stiffness from working too rigidly. Regular stretching is recommended.",
        match: ["Rat", "Rooster", "Snake"], challenge: ["Goat"],
        dailyTips: ["Boring routine? Try a new hobby to refresh your mind.", "Avoid conflict at work. Listen first.", "Physical energy is prime. Finish pending tasks."]
      },
      es: {
        element: "Tierra", yinYang: "Yin", luckyColor: "Amarillo, Marrón, Verde Oscuro", direction: "Noreste", season: "Invierno",
        traits: ["Diligente", "Disciplinado", "Autoritario", "Estable"],
        desc: "El Buey simboliza una base inquebrantable. Completan tareas sin quejarse, construyendo éxito a través de consistencia a largo plazo como una roca sólida.",
        love: "Una pareja tradicional que valora la estabilidad. Muestran amor con acciones reales, no con palabras dulces.",
        career: "Pilar principal en manufactura, ingeniería o grandes estructuras. Son la columna vertebral en crisis.",
        health: "Fuerte salud física, pero cuidado con la rigidez articular por trabajar rígidamente. Se recomienda estiramiento.",
        match: ["Rata", "Gallo", "Serpiente"], challenge: ["Cabra"],
        dailyTips: ["¿Rutina aburrida? Prueba un nuevo pasatiempo.", "Evita conflictos en el trabajo. Escucha primero.", "Tu energía física es excelente. Termina tareas pendientes."]
      }
    }
  },
  Macan: {
    icon: "🐅",
    data: {
      id: {
        element: "Kayu", yinYang: "Yang", luckyColor: "Oranye, Biru, Hitam", direction: "Timur", season: "Musim Semi",
        traits: ["Revolusioner", "Berani", "Magnetis", "Kompetitif"],
        desc: "Macan tidak mengikuti aturan, mereka membuatnya. Sebagai pemimpin karismatik, mereka sering menjadi pusat perhatian dan tak ragu mengambil risiko ekstrem demi visi yang mereka yakini.",
        love: "Intens dan penuh gairah. Mereka mencari pasangan dengan ambisi sama besarnya dan tidak takut berargumen.",
        career: "Sangat cocok sebagai entrepreneur, perwira militer, atau pemimpin industri kreatif. Berkembang di lingkungan kompetitif.",
        health: "Jaga kesehatan jantung; hindari gaya hidup terlalu cepat tanpa jeda. Olahraga ekstrem bisa jadi pelampiasan.",
        match: ["Kuda", "Anjing", "Naga"], challenge: ["Monyet"],
        dailyTips: ["Ambisi tinggi hari ini, tapi jangan lupakan tim.", "Cinta butuh kelembutan sesekali. Beri kejutan kecil.", "Dengarkan masukan kolega, mungkin ada perspektif baru."]
      },
      en: {
        element: "Wood", yinYang: "Yang", luckyColor: "Orange, Blue, Black", direction: "East", season: "Spring",
        traits: ["Revolutionary", "Brave", "Magnetic", "Competitive"],
        desc: "The Tiger doesn't follow rules, they make them. As a charismatic leader, they don't hesitate to take extreme risks for their vision. They have magnetic energy.",
        love: "Intense and passionate. They seek a partner with equal ambition who isn't afraid to argue.",
        career: "Suitable as an entrepreneur, military officer, or creative industry leader. Thrives in competitive environments.",
        health: "Watch your heart health; avoid a fast lifestyle without breaks. Extreme sports are a good outlet.",
        match: ["Horse", "Dog", "Dragon"], challenge: ["Monkey"],
        dailyTips: ["Ambition is high today, but don't forget the team.", "Love needs gentleness. Give a small surprise.", "Listen to colleagues, there might be new perspectives."]
      },
      es: {
        element: "Madera", yinYang: "Yang", luckyColor: "Naranja, Azul, Negro", direction: "Este", season: "Primavera",
        traits: ["Revolucionario", "Valiente", "Magnético", "Competitivo"],
        desc: "El Tigre no sigue reglas, las crea. Como líder carismático, no duda en tomar riesgos extremos por su visión. Tienen una energía magnética.",
        love: "Intenso y apasionado. Busca una pareja con igual ambición que no tema discutir.",
        career: "Ideal como emprendedor, oficial militar o líder creativo. Prospera en entornos competitivos.",
        health: "Cuida tu corazón; evita un estilo de vida acelerado sin descansos. Los deportes extremos son buena salida.",
        match: ["Caballo", "Perro", "Dragón"], challenge: ["Mono"],
        dailyTips: ["La ambición es alta, pero no olvides al equipo.", "El amor necesita ternura. Da una pequeña sorpresa.", "Escucha a tus colegas, puede haber nuevas perspectivas."]
      }
    }
  },
  Kelinci: {
    icon: "🐇",
    data: {
      id: {
        element: "Kayu", yinYang: "Yin", luckyColor: "Merah Muda, Lavender, Hijau", direction: "Timur", season: "Musim Semi",
        traits: ["Diplomatis", "Pragmatis", "Artistis", "Hati-hati"],
        desc: "Kelinci adalah sosok di balik layar yang menggerakkan dunia lewat diplomasi. Menghindari konfrontasi langsung, mereka peka terhadap estetika dan membaca situasi dengan luar biasa.",
        love: "Sangat mendambakan kedamaian rumah tangga. Akan melakukan apa pun untuk menjaga harmoni, kadang berkorban terlalu banyak.",
        career: "Mahir di bidang hukum, konseling, diplomasi, atau seni. Unggul dalam pekerjaan yang butuh kebijaksanaan tinggi.",
        health: "Sistem pencernaan dipengaruhi emosi; hindari makan saat tertekan. Yoga dan meditasi sangat membantu.",
        match: ["Kambing", "Babi", "Anjing"], challenge: ["Ayam"],
        dailyTips: ["Cocok menyelesaikan urusan administratif. Kerapian membawa hoki.", "Jangan terlalu sensitif pada komentar orang.", "Buka diri untuk obrolan santai, ada inspirasi di sana."]
      },
      en: {
        element: "Wood", yinYang: "Yin", luckyColor: "Pink, Lavender, Green", direction: "East", season: "Spring",
        traits: ["Diplomatic", "Pragmatic", "Artistic", "Cautious"],
        desc: "The Rabbit moves the world through behind-the-scenes diplomacy. Avoiding direct confrontation, they are sensitive to aesthetics and read situations exceptionally well.",
        love: "Craves domestic peace. Will do anything to maintain harmony, sometimes sacrificing too much.",
        career: "Skilled in law, counseling, diplomacy, or art. Excels in jobs requiring high wisdom and tact.",
        health: "Digestion is affected by emotions; avoid eating when stressed. Yoga and meditation are very helpful.",
        match: ["Goat", "Pig", "Dog"], challenge: ["Rooster"],
        dailyTips: ["Good day for administrative tasks. Neatness brings luck.", "Don't be too sensitive to people's comments.", "Open up to casual chats, inspiration awaits there."]
      },
      es: {
        element: "Madera", yinYang: "Yin", luckyColor: "Rosa, Lavanda, Verde", direction: "Este", season: "Primavera",
        traits: ["Diplomático", "Pragmático", "Artístico", "Cauteloso"],
        desc: "El Conejo mueve el mundo mediante diplomacia discreta. Evitando la confrontación, son sensibles a la estética y leen las situaciones excepcionalmente bien.",
        love: "Anhela la paz doméstica. Hará cualquier cosa para mantener la armonía, a veces sacrificando demasiado.",
        career: "Hábil en derecho, consejería, diplomacia o arte. Destaca en trabajos que requieren sabiduría y tacto.",
        health: "La digestión se ve afectada por las emociones; evita comer estresado. El yoga y la meditación ayudan mucho.",
        match: ["Cabra", "Cerdo", "Perro"], challenge: ["Gallo"],
        dailyTips: ["Buen día para tareas administrativas. El orden trae suerte.", "No seas demasiado sensible a los comentarios.", "Ábrete a charlas informales, hay inspiración allí."]
      }
    }
  },
  Naga: {
    icon: "🐉",
    data: {
      id: {
        element: "Tanah", yinYang: "Yang", luckyColor: "Emas, Putih, Perak", direction: "Tenggara", season: "Musim Semi",
        traits: ["Dominan", "Visioner", "Energik", "Karismatik"],
        desc: "Naga melambangkan kekuatan absolut. Mereka lahir untuk menang dan memiliki standar sangat tinggi bagi diri sendiri maupun orang lain. Aura mereka begitu kuat sehingga sulit diabaikan.",
        love: "Protektif dan dominan. Akan memberikan segalanya bagi pasangan yang menghargai dedikasi mereka. Waspadai sikap posesif.",
        career: "Tokoh kunci di pemerintahan, CEO startup, atau pionir teknologi baru. Suka tantangan besar.",
        health: "Energi vital sangat tinggi, rawan peradangan jika tidak mengelola emosi. Istirahat cukup adalah kunci.",
        match: ["Tikus", "Monyet", "Ayam"], challenge: ["Anjing"],
        dailyTips: ["Ide besarmu mulai terlihat. Presentasikan ke atasan.", "Kesehatan mental butuh perhatian. Luangkan waktu untuk diri sendiri.", "Hindari konflik ego dengan kolega."]
      },
      en: {
        element: "Earth", yinYang: "Yang", luckyColor: "Gold, White, Silver", direction: "Southeast", season: "Spring",
        traits: ["Dominant", "Visionary", "Energetic", "Charismatic"],
        desc: "The Dragon symbolizes absolute power. Born to win, they set extremely high standards for themselves and others. Their strong aura is impossible to ignore.",
        love: "Protective and dominant. Gives everything to an appreciative partner. Beware of possessiveness.",
        career: "Key figures in government, startup CEOs, or tech pioneers. Loves big challenges.",
        health: "High vital energy, but prone to inflammation if emotions run high. Adequate rest is key.",
        match: ["Rat", "Monkey", "Rooster"], challenge: ["Dog"],
        dailyTips: ["Your big idea is showing. Present it to your boss.", "Mental health needs attention. Take time for yourself.", "Avoid ego conflicts with colleagues."]
      },
      es: {
        element: "Tierra", yinYang: "Yang", luckyColor: "Oro, Blanco, Plata", direction: "Sureste", season: "Primavera",
        traits: ["Dominante", "Visionario", "Enérgico", "Carismático"],
        desc: "El Dragón simboliza el poder absoluto. Nacido para ganar, establece altos estándares para sí mismo y para los demás. Su fuerte aura es imposible de ignorar.",
        love: "Protector y dominante. Da todo a una pareja agradecida. Cuidado con la posesividad.",
        career: "Figuras clave en el gobierno, CEOs o pioneros tecnológicos. Ama los grandes desafíos.",
        health: "Alta energía vital, pero propenso a la inflamación si las emociones se desbordan. El descanso es clave.",
        match: ["Rata", "Mono", "Gallo"], challenge: ["Perro"],
        dailyTips: ["Tu gran idea se asoma. Preséntala a tu jefe.", "La salud mental necesita atención. Dedícate tiempo.", "Evita conflictos de ego con colegas."]
      }
    }
  },
  Ular: {
    icon: "🐍",
    data: {
      id: {
        element: "Api", yinYang: "Yin", luckyColor: "Hitam, Merah, Ungu", direction: "Selatan", season: "Musim Panas",
        traits: ["Intuitif", "Misterius", "Bijaksana", "Skeptis"],
        desc: "Ular adalah pemikir filosofis yang bergerak secara senyap. Memiliki kemampuan melihat motif tersembunyi dan jarang dikelabui penampilan luar. Kebijaksanaan mereka matang lebih awal.",
        love: "Sangat posesif karena mencintai dengan kedalaman luar biasa. Butuh waktu lama untuk benar-benar percaya.",
        career: "Ahli riset, intelijen, psikolog, atau konsultan strategi. Unggul dalam analisis mendalam.",
        health: "Gaya hidup cenderung sedentari; perbanyak aktivitas fisik untuk sirkulasi darah.",
        match: ["Kerbau", "Ayam", "Monyet"], challenge: ["Babi"],
        dailyTips: ["Intuisimu sangat tajam hari ini. Percaya firasat.", "Jangan terlalu curiga pada pasangan. Komunikasi terbuka lebih baik.", "Keuangan stabil, cocok untuk investasi diri."]
      },
      en: {
        element: "Fire", yinYang: "Yin", luckyColor: "Black, Red, Purple", direction: "South", season: "Summer",
        traits: ["Intuitive", "Mysterious", "Wise", "Skeptical"],
        desc: "The Snake is a silent, philosophical thinker. Has the ability to see hidden motives and is rarely fooled by appearances. Their wisdom matures early.",
        love: "Very possessive due to incredible depth of love. Takes a long time to truly trust.",
        career: "Research expert, intelligence, psychologist, or strategy consultant. Excels in deep analysis.",
        health: "Tends toward a sedentary lifestyle; increase physical activity for better circulation.",
        match: ["Ox", "Rooster", "Monkey"], challenge: ["Pig"],
        dailyTips: ["Your intuition is sharp today. Trust your gut.", "Don't be overly suspicious of your partner.", "Finances are stable, good for self-investment."]
      },
      es: {
        element: "Fuego", yinYang: "Yin", luckyColor: "Negro, Rojo, Púrpura", direction: "Sur", season: "Verano",
        traits: ["Intuitivo", "Misterioso", "Sabio", "Escéptico"],
        desc: "La Serpiente es un pensador silencioso y filosófico. Puede ver motivos ocultos y rara vez se deja engañar. Su sabiduría madura temprano.",
        love: "Muy posesivo debido a la increíble profundidad del amor. Tarda mucho en confiar realmente.",
        career: "Experto en investigación, inteligencia, psicólogo o consultor estratégico. Destaca en análisis profundo.",
        health: "Tiende a un estilo de vida sedentario; aumenta la actividad física para mejor circulación.",
        match: ["Buey", "Gallo", "Mono"], challenge: ["Cerdo"],
        dailyTips: ["Tu intuición es aguda hoy. Confía en tu instinto.", "No seas demasiado desconfiado con tu pareja.", "Finanzas estables, buenas para invertir en ti mismo."]
      }
    }
  },
  Kuda: {
    icon: "🐎",
    data: {
      id: {
        element: "Api", yinYang: "Yang", luckyColor: "Merah, Hijau, Kuning", direction: "Selatan", season: "Musim Panas",
        traits: ["Independen", "Eksploratif", "Agresif", "Optimis"],
        desc: "Kuda tidak bisa dikurung. Simbol kebebasan dan mobilitas, kemampuan mereka bangkit dari kegagalan sangat cepat. Akan mati kebosanan jika terjebak rutinitas monoton.",
        love: "Jujur dan apa adanya. Membutuhkan pasangan yang memberikan ruang bernapas dan tidak mengekang.",
        career: "Sangat baik di bidang humas, jurnalisme lapangan, atlet profesional, atau event. Butuh lingkungan dinamis.",
        health: "Kesehatan paru-paru dan stamina adalah aset utama; waspadai kecelakaan akibat terburu-buru.",
        match: ["Macan", "Anjing", "Kambing"], challenge: ["Tikus"],
        dailyTips: ["Energi sosialmu tinggi. Manfaatkan untuk perluas jaringan.", "Jangan buat keputusan finansial terburu-buru.", "Pasangan butuh perhatian. Ajak jalan-jalan."]
      },
      en: {
        element: "Fire", yinYang: "Yang", luckyColor: "Red, Green, Yellow", direction: "South", season: "Summer",
        traits: ["Independent", "Exploratory", "Aggressive", "Optimistic"],
        desc: "The Horse cannot be caged. Symbolizing freedom and mobility, they recover from failure extremely fast. Will die of boredom in a monotonous routine.",
        love: "Honest and straightforward. Needs a partner who provides breathing room and doesn't restrict them.",
        career: "Excellent in PR, field journalism, professional sports, or events. Needs a dynamic environment.",
        health: "Lung health and stamina are main assets; beware of accidents from rushing.",
        match: ["Tiger", "Dog", "Goat"], challenge: ["Rat"],
        dailyTips: ["High social energy today. Use it to expand your network.", "Don't make hasty financial decisions.", "Your partner needs attention. Go for a walk."]
      },
      es: {
        element: "Fuego", yinYang: "Yang", luckyColor: "Rojo, Verde, Amarillo", direction: "Sur", season: "Verano",
        traits: ["Independiente", "Explorador", "Agresivo", "Optimista"],
        desc: "El Caballo no puede ser enjaulado. Símbolo de libertad y movilidad, se recupera del fracaso muy rápido. Morirá de aburrimiento en una rutina monótona.",
        love: "Honesto y directo. Necesita una pareja que le dé espacio y no lo restrinja.",
        career: "Excelente en relaciones públicas, periodismo de campo o deportes. Necesita un entorno dinámico.",
        health: "La salud pulmonar y la resistencia son sus principales activos; cuidado con los accidentes por prisas.",
        match: ["Tigre", "Perro", "Cabra"], challenge: ["Rata"],
        dailyTips: ["Alta energía social hoy. Úsala para expandir tu red.", "No tomes decisiones financieras apresuradas.", "Tu pareja necesita atención. Vayan a caminar."]
      }
    }
  },
  Kambing: {
    icon: "🐐",
    data: {
      id: {
        element: "Tanah", yinYang: "Yin", luckyColor: "Hijau, Merah Muda, Putih", direction: "Barat Daya", season: "Musim Panas",
        traits: ["Empati", "Estetik", "Altruis", "Sensitif"],
        desc: "Kambing memiliki kepekaan sosial sangat tinggi. Sering menjadi perekat dalam kelompok dan berbakat menciptakan keindahan. Sisi sensitif membuat mereka mudah terluka dan bergantung pada validasi.",
        love: "Sangat mengandalkan perasaan. Butuh pasangan stabil sebagai sandaran emosional. Romantisme sangat berarti.",
        career: "Sukses sebagai desainer, penulis, pengajar, atau pekerja sosial. Bekerja terbaik di lingkungan apresiatif.",
        health: "Waspadai masalah ginjal. Stres bisa memicu sakit kepala migrain.",
        match: ["Kelinci", "Babi", "Kuda"], challenge: ["Kerbau"],
        dailyTips: ["Kreativitas mekar. Luangkan waktu untuk berkarya.", "Jangan terlalu pikirkan pendapat orang. Percaya instingmu.", "Ada kabar baik dari rekan lama."]
      },
      en: {
        element: "Earth", yinYang: "Yin", luckyColor: "Green, Pink, White", direction: "Southwest", season: "Summer",
        traits: ["Empathetic", "Aesthetic", "Altruistic", "Sensitive"],
        desc: "The Goat has very high social sensitivity. Often the glue in a group with a talent for creating beauty. Their sensitive side makes them easily hurt and reliant on validation.",
        love: "Relies heavily on feelings. Needs a stable partner as an emotional anchor. Romance means everything.",
        career: "Successful as designers, writers, teachers, or social workers. Works best in an appreciative environment.",
        health: "Beware of kidney issues. Stress can trigger migraine headaches.",
        match: ["Rabbit", "Pig", "Horse"], challenge: ["Ox"],
        dailyTips: ["Creativity is blooming. Take time to create.", "Don't overthink people's opinions. Trust your instincts.", "Good news from an old colleague awaits."]
      },
      es: {
        element: "Tierra", yinYang: "Yin", luckyColor: "Verde, Rosa, Blanco", direction: "Suroeste", season: "Verano",
        traits: ["Empático", "Estético", "Altruista", "Sensible"],
        desc: "La Cabra tiene alta sensibilidad social. A menudo es el pegamento del grupo con talento para crear belleza. Su lado sensible los hace vulnerables y dependientes de validación.",
        love: "Depende mucho de los sentimientos. Necesita una pareja estable como ancla emocional. El romance lo es todo.",
        career: "Exitosos como diseñadores, escritores, maestros o trabajadores sociales. Trabajan mejor en entornos apreciativos.",
        health: "Cuidado con problemas renales. El estrés puede desencadenar migrañas.",
        match: ["Conejo", "Cerdo", "Caballo"], challenge: ["Buey"],
        dailyTips: ["La creatividad florece. Tómate tiempo para crear.", "No pienses demasiado en las opiniones. Confía en tu instinto.", "Te esperan buenas noticias de un viejo colega."]
      }
    }
  },
  Monyet: {
    icon: "🐒",
    data: {
      id: {
        element: "Logam", yinYang: "Yang", luckyColor: "Putih, Emas, Biru", direction: "Barat", season: "Musim Gugur",
        traits: ["Inovatif", "Gesit", "Persuasif", "Licik"],
        desc: "Monyet adalah sang jenius taktis. Mampu melihat solusi di tengah kebuntuan dan punya kemampuan persuasif tinggi. Kadang dianggap 'licik', padahal hanya terlalu cepat berpikir.",
        love: "Cerdas dan humoris. Hubungan tak pernah bosan, tapi sulit berkomitmen karena takut kehilangan kebebasan.",
        career: "Sektor IT, investasi, hiburan, atau pengembang sistem kompleks. Unggul memecahkan masalah kreatif.",
        health: "Sering insomnia karena otak sulit berhenti berpikir; meditasi adalah keharusan.",
        match: ["Naga", "Tikus", "Ular"], challenge: ["Macan"],
        dailyTips: ["Ide gilamu bisa jadi terobosan. Presentasikan.", "Ketegasan dalam hubungan membuatmu lebih dipercaya.", "Hindari spekulasi berisiko hari ini."]
      },
      en: {
        element: "Metal", yinYang: "Yang", luckyColor: "White, Gold, Blue", direction: "West", season: "Autumn",
        traits: ["Innovative", "Agile", "Persuasive", "Cunning"],
        desc: "The Monkey is a tactical genius. Able to see solutions in deadlocks with high persuasive skills. Sometimes deemed 'cunning', but they just think too fast.",
        love: "Smart and humorous. Relationships are never boring, but they struggle with commitment to keep their freedom.",
        career: "IT sector, investments, entertainment, or complex systems. Excels in creative problem solving.",
        health: "Often suffers from insomnia as the brain won't stop; meditation is a must.",
        match: ["Dragon", "Rat", "Snake"], challenge: ["Tiger"],
        dailyTips: ["Your crazy idea could be a breakthrough. Present it.", "Decisiveness in relationships builds trust.", "Avoid risky speculation today."]
      },
      es: {
        element: "Metal", yinYang: "Yang", luckyColor: "Blanco, Oro, Azul", direction: "Oeste", season: "Otoño",
        traits: ["Innovador", "Ágil", "Persuasivo", "Astuto"],
        desc: "El Mono es un genio táctico. Capaz de ver soluciones en puntos muertos con gran persuasión. A veces se le considera 'astuto', pero solo piensa muy rápido.",
        love: "Inteligente y divertido. Las relaciones nunca aburren, pero luchan con el compromiso por miedo a perder libertad.",
        career: "Sector TI, inversiones, entretenimiento o sistemas complejos. Destaca en la resolución creativa de problemas.",
        health: "Sufre de insomnio porque el cerebro no se detiene; la meditación es obligatoria.",
        match: ["Dragón", "Rata", "Serpiente"], challenge: ["Tigre"],
        dailyTips: ["Tu idea loca podría ser un gran avance. Preséntala.", "La decisión en las relaciones genera confianza.", "Evita especulaciones riesgosas hoy."]
      }
    }
  },
  Ayam: {
    icon: "🐓",
    data: {
      id: {
        element: "Logam", yinYang: "Yin", luckyColor: "Emas, Coklat, Kuning", direction: "Barat", season: "Musim Gugur",
        traits: ["Perfeksionis", "Metodis", "Vokal", "Disiplin"],
        desc: "Ayam adalah pengawas detail yang ketat dengan standar moral tinggi. Tidak segan mengkritik ketidakefisienan. Terkadang dianggap 'sok tahu', namun niatnya selalu untuk hasil terbaik.",
        love: "Terlihat kaku di luar, namun merencanakan masa depan pasangan dengan sangat rapi. Kesetiaan teruji waktu.",
        career: "Kompeten sebagai auditor, editor, pengawas proyek. Ahli dalam detail dan prosedur.",
        health: "Jaga pola makan; sistem pencernaan sering menjadi titik lemah akibat perfeksionisme berujung stres.",
        match: ["Kerbau", "Ular", "Naga"], challenge: ["Kelinci"],
        dailyTips: ["Cocok membersihkan ruang kerja. Produktivitas akan melonjak.", "Jangan terlalu keras pada pasangan atas kesalahan kecil.", "Ada peluang karir, tunjukkan analisamu."]
      },
      en: {
        element: "Metal", yinYang: "Yin", luckyColor: "Gold, Brown, Yellow", direction: "West", season: "Autumn",
        traits: ["Perfectionist", "Methodical", "Vocal", "Disciplined"],
        desc: "The Rooster is a strict detail overseer with high moral standards. Doesn't hesitate to criticize inefficiency. Often seen as a 'know-it-all' but genuinely wants the best.",
        love: "Looks rigid outside, but neatly plans their partner's future. Loyalty is time-tested.",
        career: "Competent as an auditor, editor, or project supervisor. Expert in details and procedures.",
        health: "Watch your diet; the digestive system is a weak point due to stress from perfectionism.",
        match: ["Ox", "Snake", "Dragon"], challenge: ["Rabbit"],
        dailyTips: ["Good day to clean your workspace. Productivity will soar.", "Don't be too hard on your partner for small mistakes.", "Career opportunity ahead, show your analysis."]
      },
      es: {
        element: "Metal", yinYang: "Yin", luckyColor: "Oro, Marrón, Amarillo", direction: "Oeste", season: "Otoño",
        traits: ["Perfeccionista", "Metódico", "Vocal", "Disciplinado"],
        desc: "El Gallo es un estricto supervisor de detalles con altos estándares morales. No duda en criticar la ineficiencia. A menudo visto como 'sabelotodo', pero realmente quiere lo mejor.",
        love: "Parece rígido por fuera, pero planifica el futuro de su pareja. Su lealtad está probada por el tiempo.",
        career: "Competente como auditor, editor o supervisor. Experto en detalles y procedimientos.",
        health: "Cuida tu dieta; el sistema digestivo es un punto débil debido al estrés del perfeccionismo.",
        match: ["Buey", "Serpiente", "Dragón"], challenge: ["Conejo"],
        dailyTips: ["Buen día para limpiar tu espacio. La productividad se disparará.", "No seas duro con tu pareja por pequeños errores.", "Oportunidad profesional a la vista, muestra tu análisis."]
      }
    }
  },
  Anjing: {
    icon: "🐕",
    data: {
      id: {
        element: "Tanah", yinYang: "Yang", luckyColor: "Merah, Hijau, Ungu", direction: "Barat Laut", season: "Musim Gugur",
        traits: ["Setia", "Jujur", "Waspada", "Protektif"],
        desc: "Anjing adalah simbol loyalitas absolut dan keadilan. Mereka memiliki radar bawaan untuk mendeteksi ketidakjujuran. Membela yang lemah adalah insting alami mereka, membuat mereka dihormati banyak orang.",
        love: "Pasangan paling setia di seluruh zodiak. Mereka butuh waktu untuk percaya, tapi jika sudah, mereka tidak akan pernah berkhianat.",
        career: "Polisi, perawat, hakim, atau aktivis LSM. Mereka butuh pekerjaan yang memiliki makna moral.",
        health: "Kecemasan tentang masalah dunia bisa menyebabkan insomnia dan kelelahan kronis. Kurangi konsumsi berita.",
        match: ["Macan", "Kelinci", "Kuda"], challenge: ["Naga"],
        dailyTips: ["Insting pelindungmu muncul hari ini. Teman butuh bantuanmu.", "Kejujuran selalu menang, jangan tutupi fakta.", "Luangkan waktu untuk relaksasi di alam."]
      },
      en: {
        element: "Earth", yinYang: "Yang", luckyColor: "Red, Green, Purple", direction: "Northwest", season: "Autumn",
        traits: ["Loyal", "Honest", "Cautious", "Protective"],
        desc: "The Dog symbolizes absolute loyalty and justice. They have an innate radar for dishonesty. Defending the weak is their natural instinct, making them widely respected.",
        love: "The most loyal partner in the zodiac. Takes time to trust, but once they do, they never betray.",
        career: "Police, nurse, judge, or NGO activist. They need a job with moral meaning.",
        health: "Anxiety about world issues can cause insomnia and chronic fatigue. Reduce news consumption.",
        match: ["Tiger", "Rabbit", "Horse"], challenge: ["Dragon"],
        dailyTips: ["Your protective instincts kick in today. A friend needs help.", "Honesty always wins, don't hide the facts.", "Take time for relaxation in nature."]
      },
      es: {
        element: "Tierra", yinYang: "Yang", luckyColor: "Rojo, Verde, Púrpura", direction: "Noroeste", season: "Otoño",
        traits: ["Leal", "Honesto", "Cauteloso", "Protector"],
        desc: "El Perro simboliza lealtad y justicia absoluta. Tienen un radar innato para la deshonestidad. Defender a los débiles es su instinto, lo que los hace muy respetados.",
        love: "La pareja más leal del zodíaco. Tarda en confiar, pero cuando lo hace, nunca traiciona.",
        career: "Policía, enfermero, juez o activista. Necesitan un trabajo con significado moral.",
        health: "La ansiedad por problemas mundiales causa insomnio y fatiga. Reduce el consumo de noticias.",
        match: ["Tigre", "Conejo", "Caballo"], challenge: ["Dragón"],
        dailyTips: ["Tus instintos protectores despiertan hoy. Un amigo necesita ayuda.", "La honestidad siempre gana, no ocultes los hechos.", "Tómate un tiempo para relajarte en la naturaleza."]
      }
    }
  },
  Babi: {
    icon: "🐖",
    data: {
      id: {
        element: "Air", yinYang: "Yin", luckyColor: "Kuning, Abu-abu, Coklat", direction: "Utara", season: "Musim Dingin",
        traits: ["Penyayang", "Dermawan", "Tekun", "Tulus"],
        desc: "Babi adalah penikmat hidup yang memiliki hati emas. Mereka jarang mendendam dan selalu mencoba melihat kebaikan dalam diri semua orang. Kebaikan murni ini terkadang dimanfaatkan oleh orang yang licik.",
        love: "Sangat memanjakan pasangan dengan makanan enak dan kenyamanan rumah. Hubungan penuh kehangatan tanpa banyak drama.",
        career: "Hospitality, koki, dokter hewan, atau filantropis. Mereka suka membuat orang lain merasa nyaman.",
        health: "Hindari makan berlebihan (stress-eating). Pencernaan dan metabolisme tubuh perlu dijaga dengan olahraga teratur.",
        match: ["Kambing", "Kelinci", "Macan"], challenge: ["Ular"],
        dailyTips: ["Kebaikanmu hari ini akan berbalik padamu berkali lipat.", "Waspadai orang yang mencoba memanfaatkan kemurahan hatimu.", "Nikmati makan malam enak sebagai hadiah untuk dirimu."]
      },
      en: {
        element: "Water", yinYang: "Yin", luckyColor: "Yellow, Gray, Brown", direction: "North", season: "Winter",
        traits: ["Compassionate", "Generous", "Diligent", "Sincere"],
        desc: "The Pig enjoys life and has a heart of gold. They rarely hold grudges and always try to see the good in everyone. This pure kindness is sometimes exploited by cunning people.",
        love: "Spoils their partner with good food and home comfort. Relationships are full of warmth without much drama.",
        career: "Hospitality, chef, veterinarian, or philanthropist. They love making others feel comfortable.",
        health: "Avoid stress-eating. Digestion and metabolism need to be maintained with regular exercise.",
        match: ["Goat", "Rabbit", "Tiger"], challenge: ["Snake"],
        dailyTips: ["Your kindness today will return to you manifold.", "Beware of people trying to exploit your generosity.", "Enjoy a good dinner as a reward for yourself."]
      },
      es: {
        element: "Agua", yinYang: "Yin", luckyColor: "Amarillo, Gris, Marrón", direction: "Norte", season: "Invierno",
        traits: ["Compasivo", "Generoso", "Diligente", "Sincero"],
        desc: "El Cerdo disfruta de la vida y tiene un corazón de oro. Rara vez guardan rencor y siempre intentan ver lo bueno en todos. Su pura bondad a veces es explotada por astutos.",
        love: "Mima a su pareja con buena comida y comodidad. Las relaciones están llenas de calidez sin mucho drama.",
        career: "Hospitalidad, chef, veterinario o filántropo. Les encanta hacer sentir cómodos a los demás.",
        health: "Evita comer por estrés. La digestión y el metabolismo deben mantenerse con ejercicio regular.",
        match: ["Cabra", "Conejo", "Tigre"], challenge: ["Serpiente"],
        dailyTips: ["Tu amabilidad de hoy te regresará multiplicada.", "Cuidado con quienes intentan explotar tu generosidad.", "Disfruta de una buena cena como recompensa para ti."]
      }
    }
  }
};

export default function ChineseZodiacPremium({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"];

  const [birthYear, setBirthYear] = useState<string>("");
  const [result, setResult] = useState<ShioKey | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [dailyTip, setDailyTip] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [luckyNum, setLuckyNum] = useState<number>(0);

  const calculateShio = (year: number): ShioKey => {
    const offset = (year - 4) % 12;
    const index = offset >= 0 ? offset : 12 + offset;
    return SHIO_ORDER[index];
  };

  const handleCalculate = () => {
    const yearNum = parseInt(birthYear, 10);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const shio = calculateShio(yearNum);
      const d = new Date();
      const dateStr = `${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
      const hashVal = hashString(shio + yearNum + dateStr);

      const sData = SHIO_DATA_ML[shio].data[activeLang];
      const tipIndex = hashVal % sData.dailyTips.length;
      
      setDailyTip(sData.dailyTips[tipIndex]);
      setScore(60 + (hashVal % 38)); 
      setLuckyNum((hashVal % 99) + 1);

      setResult(shio);
      setLoading(false);
    }, 1200);
  };

  const handleRandom = () => {
    const randomYear = Math.floor(Math.random() * (2015 - 1970 + 1)) + 1970;
    setBirthYear(randomYear.toString());
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `${dict.title} - ${result} ${SHIO_DATA_ML[result].icon}\n${SHIO_DATA_ML[result].data[activeLang].desc.substring(0, 100)}...`;
    if (navigator.share) {
      navigator.share({ title: dict.title, text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const activeData = result ? SHIO_DATA_ML[result].data[activeLang] : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pb-20 text-white font-sans selection:bg-red-500/30">
      
      <div className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight drop-shadow-2xl flex justify-center items-center gap-3">
          ⛩️ {dict.title}
        </h1>
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-red-500/20 mb-4">
          {dict.badge}
        </div>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {dict.subtitle}
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-900/80 border border-red-500/30 p-6 rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.1)] backdrop-blur-xl relative z-20">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-red-400 uppercase tracking-widest mb-3 ml-1">
              {dict.inputs.yearLabel}
            </label>
            {/* PERUBAHAN KRUSIAL: flex-col untuk HP, sm:flex-row untuk PC */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="1990"
                className="w-full sm:flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-center"
              />
              <button 
                onClick={handleRandom} 
                className="w-full sm:w-auto px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-sm font-bold flex items-center justify-center gap-2"
              >
                {dict.inputs.randomBtn}
              </button>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            disabled={loading || !birthYear || birthYear.length < 4}
            className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 font-black text-lg transition-all disabled:opacity-50 shadow-lg shadow-red-500/25"
          >
            {loading ? "..." : "🔮 CEK SHIO SAYA"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center mt-16">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      )}

      {result && activeData && !loading && (
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-gradient-to-br from-[#1a0b0b] to-[#0a0a0a] border border-red-500/20 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 relative z-10">
                <div className="text-8xl lg:text-9xl drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">{SHIO_DATA_ML[result].icon}</div>
                <div className="text-center sm:text-left">
                  <h2 className="text-4xl lg:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">
                    Shio {result}
                  </h2>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                    <span className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-300 uppercase tracking-widest">{dict.labels.element} {activeData.element}</span>
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-slate-300 uppercase tracking-widest">{activeData.yinYang}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                <div>
                  <p className="text-slate-300 leading-relaxed text-lg">{activeData.desc}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-2xl">
                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">❤️ {dict.labels.love}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{activeData.love}</p>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl">
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">💼 {dict.labels.career}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{activeData.career}</p>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl sm:col-span-2">
                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">🌿 {dict.labels.health}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{activeData.health}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-gradient-to-b from-red-950/40 to-slate-900/80 border border-red-500/30 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative">
              <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                {dict.labels.dailyPrediction}
              </h3>
              
              <div className="mb-6">
                <p className="text-2xl font-black text-white mb-1">{score}<span className="text-sm text-slate-500 font-medium">/100</span></p>
                <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-red-600 to-yellow-400 h-full rounded-full" style={{ width: `${score}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">{dict.labels.scoreThisYear}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-sm text-red-100 italic leading-relaxed">"{dailyTip}"</p>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dict.labels.luckyNumber}</span>
                  <span className="text-xl font-black text-yellow-400">{luckyNum}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a]/80 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
              <ul className="space-y-4">
                <li className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{dict.labels.luckyColor}</span>
                  <span className="text-sm font-semibold text-slate-200">{activeData.luckyColor}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{dict.labels.direction}</span>
                  <span className="text-sm font-semibold text-slate-200">{activeData.direction}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">{dict.labels.match}</span>
                  <div className="flex flex-wrap gap-2">
                    {activeData.match.map((m: string) => (
                      <span key={m} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-bold">{m}</span>
                    ))}
                  </div>
                </li>
                <li className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">{dict.labels.challenge}</span>
                  <div className="flex flex-wrap gap-2">
                    {activeData.challenge.map((c: string) => (
                      <span key={c} className="px-3 py-1 bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg text-xs font-bold">{c}</span>
                    ))}
                  </div>
                </li>
              </ul>
            </div>

            <button onClick={handleShare} className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-sm uppercase tracking-widest transition-all">
              {dict.shareBtn}
            </button>
          </div>
          
        </div>
      )}

      {/* INJEKSI PAYWALL MULAI DARI SINI */}
      {result && !loading && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          
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
            resultId={`${result}-${birthYear}`} 
          />
</>
        </div>
      )}
      {/* SAMPAI SINI */}

      <div className="mt-16 text-center">
        <p className="text-xs text-slate-500 italic max-w-md mx-auto">{dict.labels.disclaimer}</p>
      </div>

    </div>
  );
}