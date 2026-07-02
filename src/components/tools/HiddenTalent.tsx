"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Bakat Terpendam",
    badge: "Ultra Premium",
    subtitle: "Ungkap potensi alami yang belum kamu sadari selama ini berdasarkan numerologi nama Pythagorean.",
    shareBtn: "Bagikan",
    inputs: {
      namePlaceholder: "Masukkan namamu...",
      analyze: "🔮 Ungkap Bakat Terpendam",
      computing: "Membaca Numerologi...",
      emptyMessage: "Masukkan nama Anda untuk mengungkap bakat terpendam.",
    },
    labels: {
      numerology: "Numerologi",
      develop: "Cara Mengembangkan",
      career: "Prospek Karir",
      luckyColor: "Warna Keberuntungan",
      quote: "Kutipan Inspirasi",
    },
    disclaimer: "*Berdasarkan numerologi nama Pythagorean. Bakat adalah potensi, bukan takdir mutlak.",
    quote: "\"Bakat terpendam adalah peta menuju versi terbaik dirimu.\"",
  },
  en: {
    title: "Hidden Talent",
    badge: "Ultra Premium",
    subtitle: "Reveal your natural potential that you haven't realized yet, based on Pythagorean name numerology.",
    shareBtn: "Share",
    inputs: {
      namePlaceholder: "Enter your name...",
      analyze: "🔮 Reveal Hidden Talent",
      computing: "Reading Numerology...",
      emptyMessage: "Enter your name to reveal your hidden talent.",
    },
    labels: {
      numerology: "Numerology",
      develop: "How to Develop",
      career: "Career Prospects",
      luckyColor: "Lucky Color",
      quote: "Inspirational Quote",
    },
    disclaimer: "*Based on Pythagorean name numerology. Talent is potential, not absolute destiny.",
    quote: "\"Hidden talent is the map to your best self.\"",
  },
  es: {
    title: "Talento Oculto",
    badge: "Ultra Premium",
    subtitle: "Revela tu potencial natural que aún no has realizado, basado en la numerología pitagórica del nombre.",
    shareBtn: "Compartir",
    inputs: {
      namePlaceholder: "Ingresa tu nombre...",
      analyze: "🔮 Revelar Talento Oculto",
      computing: "Leyendo Numerología...",
      emptyMessage: "Ingresa tu nombre para revelar tu talento oculto.",
    },
    labels: {
      numerology: "Numerología",
      develop: "Cómo Desarrollar",
      career: "Perspectivas Profesionales",
      luckyColor: "Color de la Suerte",
      quote: "Cita Inspiradora",
    },
    disclaimer: "*Basado en la numerología pitagórica del nombre. El talento es potencial, no destino absoluto.",
    quote: "\"El talento oculto es el mapa hacia tu mejor versión.\"",
  },
};

// ========== MULTI-LANGUAGE TALENT DATABASE ==========
const TALENT_DATA_ML: Record<number, any> = {
  1: {
    icon: "👑",
    data: {
      id: {
        title: "Kepemimpinan & Inovasi",
        desc: "Anda memiliki bakat alami untuk memimpin, memulai sesuatu dari nol, dan menginspirasi orang lain. Anda tidak suka mengikuti aturan, Anda lebih suka membuat aturan sendiri. Jiwa pionir ini membuat Anda unggul dalam situasi yang membutuhkan keberanian dan visi ke depan.",
        caraMengembangkan: "Ambil peran sebagai ketua dalam proyek kelompok. Biasakan mengambil keputusan dan bertanggung jawab atas hasilnya. Ikuti pelatihan kepemimpinan atau public speaking.",
        prospekKarir: "CEO, entrepreneur, manajer proyek, direktur kreatif, pemimpin organisasi sosial.",
        warnaKeberuntungan: "Merah & Emas",
        quote: "Seorang pemimpin sejati tidak menciptakan pengikut, tapi menciptakan pemimpin baru.",
      },
      en: {
        title: "Leadership & Innovation",
        desc: "You have a natural talent for leading, starting things from scratch, and inspiring others. You don't like following rules; you prefer making your own. This pioneering spirit makes you excel in situations that require courage and foresight.",
        caraMengembangkan: "Take the role of chairperson in group projects. Get used to making decisions and taking responsibility for outcomes. Attend leadership or public speaking training.",
        prospekKarir: "CEO, entrepreneur, project manager, creative director, social organization leader.",
        warnaKeberuntungan: "Red & Gold",
        quote: "A true leader doesn't create followers, but creates new leaders.",
      },
      es: {
        title: "Liderazgo e Innovación",
        desc: "Tienes un talento natural para liderar, comenzar cosas desde cero e inspirar a otros. No te gusta seguir reglas; prefieres hacer las tuyas propias. Este espíritu pionero te hace sobresalir en situaciones que requieren coraje y previsión.",
        caraMengembangkan: "Toma el rol de presidente en proyectos grupales. Acostúmbrate a tomar decisiones y asumir la responsabilidad de los resultados. Asiste a entrenamientos de liderazgo o oratoria.",
        prospekKarir: "CEO, emprendedor, gerente de proyectos, director creativo, líder de organizaciones sociales.",
        warnaKeberuntungan: "Rojo & Oro",
        quote: "Un verdadero líder no crea seguidores, sino que crea nuevos líderes.",
      },
    },
  },
  2: {
    icon: "🤝",
    data: {
      id: {
        title: "Empati & Diplomasi",
        desc: "Anda memiliki kepekaan luar biasa terhadap perasaan orang lain. Bakat terpendam Anda adalah menjadi penengah, pendengar yang baik, dan perekat hubungan. Anda bisa merasakan apa yang tidak diucapkan dan menciptakan harmoni di mana pun Anda berada.",
        caraMengembangkan: "Latih mendengar aktif tanpa menghakimi. Cobalah menjadi mediator dalam konflik kecil. Pelajari psikologi dasar atau komunikasi non-verbal.",
        prospekKarir: "Konselor, mediator, psikolog, humas, diplomat, tenaga kesehatan.",
        warnaKeberuntungan: "Biru Muda & Putih",
        quote: "Telinga yang mendengar lebih berharga dari seribu kata yang diucapkan.",
      },
      en: {
        title: "Empathy & Diplomacy",
        desc: "You have extraordinary sensitivity to others' feelings. Your hidden talent is being a mediator, a good listener, and a relationship glue. You can feel what is unspoken and create harmony wherever you are.",
        caraMengembangkan: "Practice active listening without judging. Try being a mediator in small conflicts. Learn basic psychology or non-verbal communication.",
        prospekKarir: "Counselor, mediator, psychologist, public relations, diplomat, healthcare worker.",
        warnaKeberuntungan: "Light Blue & White",
        quote: "A listening ear is more valuable than a thousand spoken words.",
      },
      es: {
        title: "Empatía y Diplomacia",
        desc: "Tienes una sensibilidad extraordinaria hacia los sentimientos de los demás. Tu talento oculto es ser mediador, buen oyente y pegamento de relaciones. Puedes sentir lo que no se dice y crear armonía dondequiera que estés.",
        caraMengembangkan: "Practica la escucha activa sin juzgar. Intenta ser mediador en pequeños conflictos. Aprende psicología básica o comunicación no verbal.",
        prospekKarir: "Consejero, mediador, psicólogo, relaciones públicas, diplomático, trabajador de salud.",
        warnaKeberuntungan: "Azul Claro & Blanco",
        quote: "Un oído que escucha vale más que mil palabras habladas.",
      },
    },
  },
  3: {
    icon: "🎨",
    data: {
      id: {
        title: "Kreativitas & Ekspresi",
        desc: "Anda memiliki bakat luar biasa dalam mengekspresikan ide, emosi, dan imajinasi. Kata-kata, warna, atau nada adalah media Anda. Anda bisa membuat orang tertawa, menangis, atau terinspirasi hanya dengan cara Anda bercerita.",
        caraMengembangkan: "Tulis jurnal harian, buat konten kreatif (video, tulisan, musik), ikuti kelas seni atau teater. Jangan takut tampil beda.",
        prospekKarir: "Penulis, aktor, musisi, desainer grafis, konten kreator, illustrator.",
        warnaKeberuntungan: "Kuning & Oranye",
        quote: "Kreativitas adalah kecerdasan yang sedang bermain.",
      },
      en: {
        title: "Creativity & Expression",
        desc: "You have an extraordinary talent for expressing ideas, emotions, and imagination. Words, colors, or tones are your media. You can make people laugh, cry, or be inspired just by how you tell a story.",
        caraMengembangkan: "Keep a daily journal, create creative content (video, writing, music), take art or theater classes. Don't be afraid to stand out.",
        prospekKarir: "Writer, actor, musician, graphic designer, content creator, illustrator.",
        warnaKeberuntungan: "Yellow & Orange",
        quote: "Creativity is intelligence having fun.",
      },
      es: {
        title: "Creatividad y Expresión",
        desc: "Tienes un talento extraordinario para expresar ideas, emociones e imaginación. Las palabras, los colores o los tonos son tus medios. Puedes hacer reír, llorar o inspirar a las personas solo con la forma en que cuentas una historia.",
        caraMengembangkan: "Lleva un diario diario, crea contenido creativo (video, escritura, música), toma clases de arte o teatro. No tengas miedo de destacar.",
        prospekKarir: "Escritor, actor, músico, diseñador gráfico, creador de contenido, ilustrador.",
        warnaKeberuntungan: "Amarillo & Naranja",
        quote: "La creatividad es inteligencia divirtiéndose.",
      },
    },
  },
  4: {
    icon: "📊",
    data: {
      id: {
        title: "Ketekunan & Organisasi",
        desc: "Anda memiliki bakat untuk membangun sistem, menata kekacauan, dan menyelesaikan apa yang dimulai. Anda adalah tulang punggung yang bisa diandalkan. Dunia butuh orang seperti Anda yang mengubah mimpi menjadi kenyataan lewat kerja keras terstruktur.",
        caraMengembangkan: "Biasakan membuat to-do list dan jadwal harian. Pelajari manajemen waktu. Ambil proyek yang butuh detail dan konsistensi.",
        prospekKarir: "Manajer operasional, akuntan, arsitek, insinyur, administrator, event organizer.",
        warnaKeberuntungan: "Hijau & Coklat",
        quote: "Kesuksesan bukan tentang bakat, tapi tentang konsistensi.",
      },
      en: {
        title: "Perseverance & Organization",
        desc: "You have a talent for building systems, organizing chaos, and finishing what you start. You are a reliable backbone. The world needs people like you who turn dreams into reality through structured hard work.",
        caraMengembangkan: "Get into the habit of making to-do lists and daily schedules. Learn time management. Take on projects that require detail and consistency.",
        prospekKarir: "Operations manager, accountant, architect, engineer, administrator, event organizer.",
        warnaKeberuntungan: "Green & Brown",
        quote: "Success is not about talent, but about consistency.",
      },
      es: {
        title: "Perseverancia y Organización",
        desc: "Tienes talento para construir sistemas, organizar el caos y terminar lo que empiezas. Eres una columna vertebral confiable. El mundo necesita personas como tú que convierten los sueños en realidad a través del trabajo duro estructurado.",
        caraMengembangkan: "Adquiere el hábito de hacer listas de tareas y horarios diarios. Aprende gestión del tiempo. Asume proyectos que requieran detalle y consistencia.",
        prospekKarir: "Gerente de operaciones, contador, arquitecto, ingeniero, administrador, organizador de eventos.",
        warnaKeberuntungan: "Verde & Marrón",
        quote: "El éxito no es cuestión de talento, sino de consistencia.",
      },
    },
  },
  5: {
    icon: "🌍",
    data: {
      id: {
        title: "Adaptasi & Petualangan",
        desc: "Anda memiliki bakat untuk beradaptasi dengan cepat di lingkungan baru, belajar hal baru, dan menemukan peluang di mana orang lain melihat masalah. Anda adalah jiwa bebas yang berkembang di tengah perubahan.",
        caraMengembangkan: "Coba hobi baru setiap bulan, bepergian ke tempat asing, belajar bahasa baru. Jangan takut keluar dari zona nyaman.",
        prospekKarir: "Travel blogger, jurnalis lapangan, sales, pemandu wisata, fotografer alam, pramugari.",
        warnaKeberuntungan: "Biru & Hijau Toska",
        quote: "Hidup dimulai di ujung zona nyamanmu.",
      },
      en: {
        title: "Adaptation & Adventure",
        desc: "You have a talent for adapting quickly to new environments, learning new things, and finding opportunities where others see problems. You are a free spirit who thrives in change.",
        caraMengembangkan: "Try a new hobby every month, travel to foreign places, learn a new language. Don't be afraid to step out of your comfort zone.",
        prospekKarir: "Travel blogger, field journalist, sales, tour guide, nature photographer, flight attendant.",
        warnaKeberuntungan: "Blue & Teal",
        quote: "Life begins at the end of your comfort zone.",
      },
      es: {
        title: "Adaptación y Aventura",
        desc: "Tienes talento para adaptarte rápidamente a nuevos entornos, aprender cosas nuevas y encontrar oportunidades donde otros ven problemas. Eres un espíritu libre que prospera en el cambio.",
        caraMengembangkan: "Prueba un nuevo hobby cada mes, viaja a lugares extranjeros, aprende un nuevo idioma. No tengas miedo de salir de tu zona de confort.",
        prospekKarir: "Bloguero de viajes, periodista de campo, ventas, guía turístico, fotógrafo de naturaleza, auxiliar de vuelo.",
        warnaKeberuntungan: "Azul & Verde Azulado",
        quote: "La vida comienza al final de tu zona de confort.",
      },
    },
  },
  6: {
    icon: "🤱",
    data: {
      id: {
        title: "Pengasuhan & Harmoni",
        desc: "Anda memiliki bakat untuk merawat, melindungi, dan menciptakan kehangatan. Anda adalah tempat orang lain berlindung saat lelah. Kehadiran Anda membawa kedamaian dan ketenangan, seperti pelukan hangat.",
        caraMengembangkan: "Jadi relawan di panti asuhan atau panti jompo. Pelajari seni memasak atau dekorasi rumah. Latih menjadi pendengar yang baik.",
        prospekKarir: "Guru, perawat, konselor keluarga, desainer interior, koki, terapis.",
        warnaKeberuntungan: "Merah Muda & Hijau Muda",
        quote: "Kebahagiaan sejati adalah saat kau bisa membuat orang lain tersenyum.",
      },
      en: {
        title: "Nurturing & Harmony",
        desc: "You have a talent for caring, protecting, and creating warmth. You are a refuge for others when they are tired. Your presence brings peace and calm, like a warm hug.",
        caraMengembangkan: "Volunteer at an orphanage or nursing home. Learn the art of cooking or home decoration. Practice being a good listener.",
        prospekKarir: "Teacher, nurse, family counselor, interior designer, chef, therapist.",
        warnaKeberuntungan: "Pink & Light Green",
        quote: "True happiness is when you can make others smile.",
      },
      es: {
        title: "Crianza y Armonía",
        desc: "Tienes talento para cuidar, proteger y crear calidez. Eres un refugio para otros cuando están cansados. Tu presencia trae paz y calma, como un abrazo cálido.",
        caraMengembangkan: "Sé voluntario en un orfanato o residencia de ancianos. Aprende el arte de cocinar o decorar el hogar. Practica ser un buen oyente.",
        prospekKarir: "Maestro, enfermero, consejero familiar, diseñador de interiores, chef, terapeuta.",
        warnaKeberuntungan: "Rosa & Verde Claro",
        quote: "La verdadera felicidad es cuando puedes hacer sonreír a los demás.",
      },
    },
  },
  7: {
    icon: "🔍",
    data: {
      id: {
        title: "Analisis & Spiritual",
        desc: "Anda memiliki bakat untuk melihat hal-hal yang tidak kasat mata, menganalisis pola rumit, dan mencari makna di balik realitas. Anda suka menyendiri untuk merenung, dan dari situlah ide-ide cemerlang lahir.",
        caraMengembangkan: "Meditasi rutin, baca buku filsafat atau sains. Pelajari data science atau psikologi. Tulis jurnal refleksi harian.",
        prospekKarir: "Peneliti, data scientist, filsuf, konsultan strategi, penulis spiritual, detektif.",
        warnaKeberuntungan: "Ungu & Perak",
        quote: "Kebenaran tidak selalu terlihat, tapi selalu bisa ditemukan.",
      },
      en: {
        title: "Analysis & Spirituality",
        desc: "You have a talent for seeing invisible things, analyzing complex patterns, and seeking meaning behind reality. You like to be alone to reflect, and that's where brilliant ideas are born.",
        caraMengembangkan: "Regular meditation, read philosophy or science books. Study data science or psychology. Write a daily reflection journal.",
        prospekKarir: "Researcher, data scientist, philosopher, strategy consultant, spiritual writer, detective.",
        warnaKeberuntungan: "Purple & Silver",
        quote: "Truth is not always visible, but it can always be found.",
      },
      es: {
        title: "Análisis y Espiritualidad",
        desc: "Tienes talento para ver cosas invisibles, analizar patrones complejos y buscar significado detrás de la realidad. Te gusta estar solo para reflexionar, y ahí es donde nacen las ideas brillantes.",
        caraMengembangkan: "Meditación regular, lee libros de filosofía o ciencia. Estudia ciencia de datos o psicología. Escribe un diario de reflexión diario.",
        prospekKarir: "Investigador, científico de datos, filósofo, consultor estratégico, escritor espiritual, detective.",
        warnaKeberuntungan: "Púrpura & Plata",
        quote: "La verdad no siempre es visible, pero siempre se puede encontrar.",
      },
    },
  },
  8: {
    icon: "💰",
    data: {
      id: {
        title: "Manajemen & Kelimpahan",
        desc: "Anda memiliki bakat untuk mengelola uang, sumber daya, dan kekuasaan. Anda melihat peluang bisnis di mana orang lain melihat kekacauan. Anda lahir untuk membangun kerajaan dan meninggalkan warisan.",
        caraMengembangkan: "Belajar investasi, baca buku finansial, ambil kursus manajemen bisnis. Latih negosiasi dan kepemimpinan.",
        prospekKarir: "Pengusaha, bankir, manajer keuangan, real estate agent, konsultan bisnis.",
        warnaKeberuntungan: "Hitam & Emas",
        quote: "Kekayaan bukan tujuan, tapi alat untuk menciptakan dampak.",
      },
      en: {
        title: "Management & Abundance",
        desc: "You have a talent for managing money, resources, and power. You see business opportunities where others see chaos. You were born to build an empire and leave a legacy.",
        caraMengembangkan: "Learn investing, read financial books, take business management courses. Practice negotiation and leadership.",
        prospekKarir: "Entrepreneur, banker, financial manager, real estate agent, business consultant.",
        warnaKeberuntungan: "Black & Gold",
        quote: "Wealth is not a goal, but a tool to create impact.",
      },
      es: {
        title: "Gestión y Abundancia",
        desc: "Tienes talento para administrar dinero, recursos y poder. Ves oportunidades de negocio donde otros ven caos. Naciste para construir un imperio y dejar un legado.",
        caraMengembangkan: "Aprende inversiones, lee libros financieros, toma cursos de administración de empresas. Practica la negociación y el liderazgo.",
        prospekKarir: "Emprendedor, banquero, gerente financiero, agente inmobiliario, consultor de negocios.",
        warnaKeberuntungan: "Negro & Oro",
        quote: "La riqueza no es un objetivo, sino una herramienta para crear impacto.",
      },
    },
  },
  9: {
    icon: "🕊️",
    data: {
      id: {
        title: "Kemanusiaan & Seni",
        desc: "Anda memiliki bakat untuk melihat keindahan di tempat yang tidak terduga dan peduli pada nasib umat manusia. Anda adalah seniman hati, dermawan sejati, dan pembawa damai. Karya Anda bisa menggerakkan banyak orang.",
        caraMengembangkan: "Ikut kegiatan sosial, belajar melukis atau menulis puisi. Relawan di lembaga kemanusiaan. Ekspresikan empati lewat seni.",
        prospekKarir: "Aktivis, seniman, pekerja sosial, penulis inspiratif, dokter relawan, kurator seni.",
        warnaKeberuntungan: "Putih & Perak",
        quote: "Cinta adalah satu-satunya energi yang bertambah saat dibagikan.",
      },
      en: {
        title: "Humanity & Art",
        desc: "You have a talent for seeing beauty in unexpected places and caring about humanity's fate. You are a heart artist, true philanthropist, and peacemaker. Your work can move many people.",
        caraMengembangkan: "Join social activities, learn painting or poetry writing. Volunteer at humanitarian institutions. Express empathy through art.",
        prospekKarir: "Activist, artist, social worker, inspirational writer, volunteer doctor, art curator.",
        warnaKeberuntungan: "White & Silver",
        quote: "Love is the only energy that increases when shared.",
      },
      es: {
        title: "Humanidad y Arte",
        desc: "Tienes talento para ver la belleza en lugares inesperados y preocuparte por el destino de la humanidad. Eres un artista del corazón, filántropo verdadero y pacificador. Tu trabajo puede conmover a muchas personas.",
        caraMengembangkan: "Únete a actividades sociales, aprende pintura o escritura de poesía. Sé voluntario en instituciones humanitarias. Expresa empatía a través del arte.",
        prospekKarir: "Activista, artista, trabajador social, escritor inspirador, médico voluntario, curador de arte.",
        warnaKeberuntungan: "Blanco & Plata",
        quote: "El amor es la única energía que aumenta cuando se comparte.",
      },
    },
  },
  11: {
    icon: "🌟",
    data: {
      id: {
        title: "Intuisi & Pencerahan",
        desc: "Anda memiliki bakat spiritual yang kuat: intuisi tajam, mimpi yang sering menjadi nyata, kemampuan membaca energi orang. Anda terlahir untuk menjadi guru atau pencerah. Namun, bakat ini juga membuat Anda mudah lelah secara emosional.",
        caraMengembangkan: "Meditasi rutin, jurnal mimpi, belajar energi healing. Hindari keramaian berlebihan. Cari mentor spiritual.",
        prospekKarir: "Motivator spiritual, life coach, konselor holistik, penulis buku inspiratif, pemimpin retreat.",
        warnaKeberuntungan: "Lavender & Putih",
        quote: "Dengarkan bisikan hati, karena di sanalah suara Tuhan bersemayam.",
      },
      en: {
        title: "Intuition & Enlightenment",
        desc: "You have strong spiritual talent: sharp intuition, dreams that often come true, ability to read people's energy. You were born to be a teacher or enlightener. However, this talent also makes you emotionally tired easily.",
        caraMengembangkan: "Regular meditation, dream journal, learn energy healing. Avoid excessive crowds. Find a spiritual mentor.",
        prospekKarir: "Spiritual motivator, life coach, holistic counselor, inspirational book writer, retreat leader.",
        warnaKeberuntungan: "Lavender & White",
        quote: "Listen to the whisper of the heart, for there dwells the voice of God.",
      },
      es: {
        title: "Intuición e Iluminación",
        desc: "Tienes un fuerte talento espiritual: intuición aguda, sueños que a menudo se hacen realidad, habilidad para leer la energía de las personas. Naciste para ser maestro o iluminador. Sin embargo, este talento también te cansa emocionalmente fácilmente.",
        caraMengembangkan: "Meditación regular, diario de sueños, aprende sanación energética. Evita multitudes excesivas. Encuentra un mentor espiritual.",
        prospekKarir: "Motivador espiritual, life coach, consejero holístico, escritor de libros inspiradores, líder de retiros.",
        warnaKeberuntungan: "Lavanda & Blanco",
        quote: "Escucha el susurro del corazón, porque allí habita la voz de Dios.",
      },
    },
  },
  22: {
    icon: "🏛️",
    data: {
      id: {
        title: "Membangun Peradaban",
        desc: "Anda memiliki bakat untuk mewujudkan mimpi besar yang dampaknya terasa hingga generasi mendatang. Anda adalah arsitek perubahan, pembangun jembatan antara visi dan realitas. Bakat ini langka dan besar tanggung jawabnya.",
        caraMengembangkan: "Belajar manajemen proyek skala besar, cari mentor yang sudah sukses, bangun tim yang solid. Jangan takut bermimpi besar.",
        prospekKarir: "Pemimpin proyek nasional, CEO perusahaan besar, arsitek kota, inovator teknologi.",
        warnaKeberuntungan: "Biru Dongker & Emas",
        quote: "Mimpi besar bukanlah ilusi, tapi cetak biru yang menunggu tanganmu mewujudkannya.",
      },
      en: {
        title: "Civilization Building",
        desc: "You have a talent for realizing big dreams whose impact is felt for generations. You are an architect of change, a bridge builder between vision and reality. This talent is rare and carries great responsibility.",
        caraMengembangkan: "Learn large-scale project management, find a successful mentor, build a solid team. Don't be afraid to dream big.",
        prospekKarir: "National project leader, large company CEO, city architect, technology innovator.",
        warnaKeberuntungan: "Navy Blue & Gold",
        quote: "Big dreams are not illusions, but blueprints waiting for your hands to realize them.",
      },
      es: {
        title: "Construcción de Civilización",
        desc: "Tienes talento para realizar grandes sueños cuyo impacto se siente durante generaciones. Eres un arquitecto del cambio, un constructor de puentes entre la visión y la realidad. Este talento es raro y conlleva una gran responsabilidad.",
        caraMengembangkan: "Aprende gestión de proyectos a gran escala, encuentra un mentor exitoso, construye un equipo sólido. No tengas miedo de soñar en grande.",
        prospekKarir: "Líder de proyecto nacional, CEO de gran empresa, arquitecto urbano, innovador tecnológico.",
        warnaKeberuntungan: "Azul Marino & Oro",
        quote: "Los grandes sueños no son ilusiones, sino planos que esperan tus manos para realizarlos.",
      },
    },
  },
  33: {
    icon: "🕯️",
    data: {
      id: {
        title: "Guru Cinta Universal",
        desc: "Anda memiliki bakat untuk menyembuhkan luka batin orang lain dan mengajarkan cinta tanpa syarat. Kehadiran Anda membawa ketenangan dan harapan. Anda adalah guru sejati yang tidak pernah lelah berbagi kebaikan.",
        caraMengembangkan: "Pelajari psikologi transpersonal, menjadi mentor, buka kelas berbagi. Jaga energi Anda dengan rutin menyendiri.",
        prospekKarir: "Guru spiritual, terapis holistik, pemimpin yayasan sosial, penulis buku transformasional.",
        warnaKeberuntungan: "Emas & Putih",
        quote: "Cinta adalah bahasa yang dipahami semua hati, tanpa perlu diterjemahkan.",
      },
      en: {
        title: "Universal Love Teacher",
        desc: "You have a talent for healing others' inner wounds and teaching unconditional love. Your presence brings calm and hope. You are a true teacher who never tires of sharing goodness.",
        caraMengembangkan: "Study transpersonal psychology, become a mentor, open sharing classes. Maintain your energy by regularly spending time alone.",
        prospekKarir: "Spiritual teacher, holistic therapist, social foundation leader, transformational book writer.",
        warnaKeberuntungan: "Gold & White",
        quote: "Love is a language understood by all hearts, without needing translation.",
      },
      es: {
        title: "Maestro de Amor Universal",
        desc: "Tienes talento para sanar las heridas internas de otros y enseñar amor incondicional. Tu presencia trae calma y esperanza. Eres un verdadero maestro que nunca se cansa de compartir bondad.",
        caraMengembangkan: "Estudia psicología transpersonal, conviértete en mentor, abre clases de intercambio. Mantén tu energía pasando tiempo a solas regularmente.",
        prospekKarir: "Maestro espiritual, terapeuta holístico, líder de fundación social, escritor de libros transformacionales.",
        warnaKeberuntungan: "Oro & Blanco",
        quote: "El amor es un lenguaje entendido por todos los corazones, sin necesidad de traducción.",
      },
    },
  },
};

// ========== FUNGSI NUMEROLOGI NAMA (tetap) ==========
function getNumerologyNumber(name: string): number {
  const letterValues: Record<string, number> = {
    a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
    j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
    s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
  };
  const clean = name.toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  for (let ch of clean) total += letterValues[ch] || 0;
  const reduce = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    if (num > 9) return reduce(String(num).split('').reduce((a,b) => a + parseInt(b), 0));
    return num;
  };
  return reduce(total);
}

// ========== KOMPONEN UTAMA ==========
export default function HiddenTalent() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [talent, setTalent] = useState<any>(null);
  const [talentNumber, setTalentNumber] = useState<number | null>(null);

  const handleReveal = () => {
    if (!name.trim()) return;
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      const num = getNumerologyNumber(name);
      const rawData = TALENT_DATA_ML[num] || TALENT_DATA_ML[1];
      const data = rawData.data[lang] || rawData.data["id"];
      setTalentNumber(num);
      setTalent({ ...rawData, ...data });
      setAnalyzed(true);
      setLoading(false);
    }, 1200);
  };

  const handleShare = async () => {
    if (!talent) return;
    const text = `${dict.title}: ${talent.title}\n${dict.labels.numerology}: ${talentNumber}\n${talent.desc.substring(0, 100)}...\n\n${dict.labels.develop}: ${talent.caraMengembangkan}\n\n${dict.disclaimer}`;
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
        <div className="text-6xl mb-2">🌟✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        {analyzed && talent && (
          <button
            onClick={handleShare}
            className="absolute right-0 top-0 md:relative md:mt-3 inline-flex items-center gap-1 text-xs bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 transition"
          >
            📤 {dict.shareBtn}
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.inputs.namePlaceholder}
          className="w-full bg-slate-900/60 border border-amber-500/30 rounded-xl px-5 py-4 text-center text-lg focus:ring-2 focus:ring-amber-500 outline-none transition"
        />
        <button
          onClick={handleReveal}
          disabled={loading || !name.trim()}
          className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 font-bold tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
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
      {!loading && !analyzed && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">{dict.inputs.emptyMessage}</p>
        </div>
      )}

      {/* Results */}
      {!loading && analyzed && talent && (
        <div className="mt-10 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Main Card */}
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl bg-gradient-to-br from-amber-950/30 to-orange-950/30">
            <div className="relative z-10 text-center">
              <div className="text-7xl mb-3">{talent.icon}</div>
              <div className="inline-block px-3 py-1 bg-amber-500/20 rounded-full text-xs mb-2">
                {dict.labels.numerology} {talentNumber}
              </div>
              <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                {talent.title}
              </h3>
              <p className="text-slate-200 text-sm mt-4 leading-relaxed">{talent.desc}</p>
            </div>
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌱</span>
                <h4 className="font-bold text-emerald-300">{dict.labels.develop}</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{talent.caraMengembangkan}</p>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💼</span>
                <h4 className="font-bold text-blue-300">{dict.labels.career}</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{talent.prospekKarir}</p>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎨</span>
                <h4 className="font-bold text-purple-300">{dict.labels.luckyColor}</h4>
              </div>
              <p className="text-slate-300 text-sm">{talent.warnaKeberuntungan}</p>
            </div>
            <div className="bg-amber-950/30 backdrop-blur-md border border-amber-900/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💬</span>
                <h4 className="font-bold text-amber-300">{dict.labels.quote}</h4>
              </div>
              <p className="text-amber-200/80 text-sm italic">“{talent.quote}”</p>
            </div>
          </div>

          {/* Quote & Disclaimer */}
          <div className="text-center p-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/30">
            <p className="text-amber-200 text-sm font-medium italic">"{dict.quote}"</p>
          </div>
          <div className="text-center text-[10px] text-slate-500 pt-3 opacity-70 border-t border-slate-800">
            {dict.disclaimer}
          </div>

          {/* INJEKSI PAYWALL MULAI DARI SINI */}
          <PremiumPaywall 
            toolName={dict.title} 
            resultId={talentNumber?.toString() || "unknown"} 
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
        input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}