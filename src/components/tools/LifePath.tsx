"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ==========================================
// PART 1: KAMUS UI 3 BAHASA & DATA INDONESIA
// ==========================================
const UI_DICT: Record<string, any> = {
  id: {
    title: "Angka Jalan Takdir", 
    subtitle: "Kalkulator Numerologi untuk mengetahui rute perjalanan hidup, kekuatan tersembunyi, dan takdirmu.",
    buttonLabel: "✨ Hitung Jalan Takdir", loadingText: "Menghitung getaran angka...",
    sharePrefix: "Jalan Takdirku adalah Angka ", shareSuffix: "Temukan milikmu di AksaraDiri!",
    element: "Elemen", lucky: "Angka Hoki", strength: "Kekuatan Utama", weakness: "Tantangan", 
    career: "Panggilan Karir", love: "Bahasa Cinta", daily: "Pesan Harian untukmu:",
    shareBtn: "📤 Bagikan Hasil", disclaimer: "*Numerologi bersifat reflektif, bukan ramalan mutlak. Gunakan untuk memahami diri."
  },
  en: {
    title: "Life Path Number", 
    subtitle: "Numerology calculator to discover your life's journey, hidden strengths, and destiny.",
    buttonLabel: "✨ Calculate Life Path", loadingText: "Calculating number vibrations...",
    sharePrefix: "My Life Path is Number ", shareSuffix: "Find yours at AksaraDiri!",
    element: "Element", lucky: "Lucky Numbers", strength: "Core Strength", weakness: "Challenges", 
    career: "Career Path", love: "Love Language", daily: "Daily Wisdom for you:",
    shareBtn: "📤 Share Result", disclaimer: "*Numerology is reflective, not an absolute prophecy."
  },
  es: {
    title: "Número de Vida", 
    subtitle: "Calculadora de numerología para descubrir tu viaje, fortalezas ocultas y destino.",
    buttonLabel: "✨ Calcular Número", loadingText: "Calculando vibraciones...",
    sharePrefix: "Mi Número de Vida es ", shareSuffix: "¡Descubre el tuyo en AksaraDiri!",
    element: "Elemento", lucky: "Números de Suerte", strength: "Fortaleza Principal", weakness: "Desafíos", 
    career: "Camino Profesional", love: "Lenguaje del Amor", daily: "Sabiduría diaria para ti:",
    shareBtn: "📤 Compartir Resultado", disclaimer: "*La numerología es reflexiva, no una profecía absoluta."
  }
};

const dataID: Record<string, any> = {
  "1": {
    title: "Angka 1 – Sang Pelopor",
    desc: "Anda terlahir sebagai pemimpin alami, mandiri, dan penuh inovasi. Angka 1 melambangkan awal yang baru, keberanian untuk berdiri sendiri, dan dorongan kuat untuk mencapai puncak. Anda tidak suka mengikuti aturan orang lain dan lebih suka menciptakan jalan Anda sendiri.",
    element: "Api",
    luckyNumber: [1, 10, 19, 28],
    strength: "Berani, mandiri, inovatif, percaya diri, pelopor",
    weakness: "Keras kepala, egois, tidak sabar, sulit menerima kritik",
    career: "Pengusaha, Manajer, Penemu, Sutradara, Politisi",
    love: "Butuh pasangan yang mandiri dan tidak mengekang kebebasannya.",
    quote: "Satu-satunya cara untuk memprediksi masa depan adalah dengan menciptakannya.",
    spiritual: "Percayalah pada insting pertamamu, itu adalah suara jiwamu.",
    dailyAffirmation: "Afirmasi: Aku adalah pencipta takdirku sendiri."
  },
  "2": {
    title: "Angka 2 – Sang Penengah",
    desc: "Anda adalah pembawa kedamaian, sangat peka terhadap perasaan orang lain, dan mengutamakan harmoni. Angka 2 melambangkan kemitraan, diplomasi, dan intuisi. Anda berkembang pesat saat bekerja sama dengan orang lain dan memiliki bakat alami untuk meredakan konflik.",
    element: "Air",
    luckyNumber: [2, 11, 20, 29],
    strength: "Empatis, diplomatis, setia, penyayang, pendengar yang baik",
    weakness: "Terlalu sensitif, menghindari konflik, mudah dimanfaatkan",
    career: "Konselor, Diplomat, Terapis, Musisi, Mediator",
    love: "Sangat romantis dan menjadikan hubungan sebagai prioritas utama.",
    quote: "Kedamaian tidak bisa dijaga dengan paksaan; ia hanya bisa diraih dengan pemahaman.",
    spiritual: "Kekuatan sejatimu ada pada kelembutan hatimu.",
    dailyAffirmation: "Afirmasi: Hatiku adalah sumber kedamaian bagi sekitarku."
  },
  "3": {
    title: "Angka 3 – Sang Komunikator",
    desc: "Anda adalah jiwa pesta yang penuh dengan kreativitas, ekspresi diri, dan tawa. Angka 3 melambangkan komunikasi, seni, dan karisma. Anda memiliki kemampuan untuk menyembuhkan orang lain melalui kata-kata, seni, atau sekadar kehadiran Anda yang ceria.",
    element: "Udara",
    luckyNumber: [3, 12, 21, 30],
    strength: "Kreatif, optimis, karismatik, pandai bicara, humoris",
    weakness: "Kurang fokus, mudah bosan, menghindari tanggung jawab berat",
    career: "Penulis, Aktor, Jurnalis, Desainer, Seniman",
    love: "Membutuhkan pasangan yang bisa diajak tertawa dan berbagi ide liar.",
    quote: "Kreativitas adalah kecerdasan yang bersenang-senang.",
    spiritual: "Ekspresikan dirimu, karena suaramu menyembuhkan dunia.",
    dailyAffirmation: "Afirmasi: Aku mengekspresikan diriku dengan bebas dan penuh sukacita."
  },
  "4": {
    title: "Angka 4 – Sang Pembangun",
    desc: "Anda adalah fondasi yang kokoh dalam masyarakat. Pekerja keras, logis, dan sangat dapat diandalkan. Angka 4 melambangkan struktur, sistem, dan ketekunan. Anda lebih percaya pada hasil kerja keras daripada keberuntungan atau jalan pintas.",
    element: "Tanah",
    luckyNumber: [4, 13, 22, 31],
    strength: "Disiplin, praktis, setia, terorganisir, tangguh",
    weakness: "Kaku, terlalu konservatif, workaholic, pesimis",
    career: "Arsitek, Insinyur, Akuntan, Manajer Proyek, Ahli IT",
    love: "Menunjukkan cinta melalui tindakan nyata dan menjamin rasa aman finansial.",
    quote: "Masa depan bergantung pada apa yang kamu lakukan hari ini.",
    spiritual: "Kerja keras yang tulus adalah bentuk ibadah tertinggi.",
    dailyAffirmation: "Afirmasi: Aku membangun hidupku di atas fondasi yang kokoh."
  },
  "5": {
    title: "Angka 5 – Jiwa Petualang",
    desc: "Kebebasan adalah oksigen bagi Anda. Anda tidak bisa diam di satu tempat dan selalu mencari pengalaman baru. Angka 5 melambangkan perubahan, adaptasi, dan keberanian mengambil risiko. Anda hidup untuk menjelajahi dunia dan mencicipi setiap sisi kehidupan.",
    element: "Api",
    luckyNumber: [5, 14, 23, 32],
    strength: "Berani, adaptif, energik, berpikiran terbuka, progresif",
    weakness: "Impulsif, takut komitmen, gelisah, kurang disiplin",
    career: "Pemandu Wisata, Konsultan, Sales, Jurnalis Lepas, Atlet",
    love: "Akan melarikan diri jika pasangannya mulai posesif atau mengekang.",
    quote: "Kebebasan bukanlah tidak adanya komitmen, tapi kemampuan memilih komitmenmu.",
    spiritual: "Temukan kedamaian di tengah perubahan yang konstan.",
    dailyAffirmation: "Afirmasi: Aku menyambut perubahan dengan hati terbuka."
  },
  "6": {
    title: "Angka 6 – Sang Pengasuh",
    desc: "Anda memiliki naluri alami untuk merawat, melindungi, dan melayani orang lain. Angka 6 melambangkan cinta kasih, tanggung jawab keluarga, dan keadilan. Orang-orang selalu datang kepada Anda untuk meminta nasihat atau bersandar saat mereka rapuh.",
    element: "Air",
    luckyNumber: [6, 15, 24, 33],
    strength: "Penyayang, protektif, bertanggung jawab, idealis, adil",
    weakness: "Suka mengatur, terlalu berkorban, mengabaikan diri sendiri",
    career: "Guru, Dokter, Perawat, Konselor Pernikahan, Desainer Interior",
    love: "Memberikan cinta tanpa batas dan menjadikan keluarga sebagai pusat semesta.",
    quote: "Cinta dan welas asih adalah kebutuhan, bukan kemewahan.",
    spiritual: "Jangan lupa menuangkan cinta untuk dirimu sendiri terlebih dahulu.",
    dailyAffirmation: "Afirmasi: Aku memberikan cinta dan pantas menerima cinta."
  },
  "7": {
    title: "Angka 7 – Pencari Kebenaran",
    desc: "Anda adalah sang filsuf yang selalu mempertanyakan makna di balik segalanya. Angka 7 melambangkan kebijaksanaan, spiritualitas, dan kedalaman intelektual. Anda sering butuh waktu menyendiri untuk merenung dan mengisi ulang energi batin Anda.",
    element: "Udara",
    luckyNumber: [7, 16, 25],
    strength: "Analitis, intuitif, bijaksana, spiritual, perfeksionis",
    weakness: "Penyendiri, sinis, terlalu kritis, sulit percaya pada orang lain",
    career: "Ilmuwan, Peneliti, Detektif, Akademisi, Filsuf",
    love: "Membutuhkan koneksi jiwa yang mendalam, bukan sekadar ketertarikan fisik.",
    quote: "Mengenal diri sendiri adalah awal dari semua kebijaksanaan.",
    spiritual: "Kesunyian adalah kanvas di mana jiwamu berbicara paling keras.",
    dailyAffirmation: "Afirmasi: Aku percaya pada kebijaksanaan alam bawah sadarku."
  },
  "8": {
    title: "Angka 8 – Sang Eksekutif",
    desc: "Anda lahir dengan energi kesuksesan material, ambisi, dan kekuasaan. Angka 8 melambangkan karma, keseimbangan antara materi dan spiritual, serta otoritas. Anda adalah magnet kekayaan, tetapi harus belajar menggunakan kekuatan itu untuk kebaikan bersama.",
    element: "Tanah",
    luckyNumber: [8, 17, 26],
    strength: "Ambisius, visioner, cerdas secara finansial, pemimpin kuat",
    weakness: "Materialistis, gila kerja, dominan, mengabaikan emosi",
    career: "CEO, Investor, Ahli Hukum, Pengembang Real Estate",
    love: "Mencari pasangan yang setara dan bisa menjadi tim solid dalam meraih sukses.",
    quote: "Kesuksesan bukan tentang berapa banyak uang yang kamu hasilkan, tapi dampak yang kamu buat.",
    spiritual: "Kekuatan sejati lahir ketika materi melayani tujuan spiritual.",
    dailyAffirmation: "Afirmasi: Aku adalah saluran kelimpahan dan kesuksesan yang positif."
  },
  "9": {
    title: "Angka 9 – Sang Dermawan",
    desc: "Anda adalah jiwa tua yang memiliki empati tak terbatas untuk penderitaan dunia. Angka 9 melambangkan penyelesaian, kemanusiaan, dan cinta universal. Tujuan hidup Anda adalah untuk melayani, menyembuhkan, dan membawa pencerahan bagi orang banyak.",
    element: "Api",
    luckyNumber: [9, 18, 27],
    strength: "Welas asih, idealis, pemaaf, visioner, bijaksana",
    weakness: "Naif, mudah kecewa pada dunia, emosional, melupakan diri sendiri",
    career: "Aktivis, Relawan, Penyembuh, Pekerja Sosial, Seniman",
    love: "Sangat romantis, namun terkadang cintanya lebih besar untuk umat manusia daripada pasangannya.",
    quote: "Tujuan hidup manusia adalah untuk melayani, dan untuk menunjukkan kasih sayang.",
    spiritual: "Melepaskan masa lalu adalah kunci untuk mencapai pencerahanmu.",
    dailyAffirmation: "Afirmasi: Aku melepaskan apa yang tidak lagi melayaniku dengan damai."
  },
  "11": {
    title: "Angka 11 – Pencerah Spiritual (Master Number)",
    desc: "Sebagai Master Number, Anda memiliki intuisi yang berbatasan dengan kemampuan psikis. Anda adalah saluran pencerahan, inspirasi, dan cahaya bagi orang lain. Beban hidup Anda seringkali berat karena Anda dituntut untuk menjadi contoh kebangkitan spiritual.",
    element: "Udara",
    luckyNumber: [11, 29],
    strength: "Sangat intuitif, inspiratif, empatik, karismatik, visioner",
    weakness: "Cemas berlebihan, gugup, mudah stres, ekspektasi tidak realistis",
    career: "Guru Spiritual, Motivator, Terapis Alternatif, Seniman Berpengaruh",
    love: "Bisa membaca pikiran pasangannya dan menuntut kejujuran emosional yang mutlak.",
    quote: "Tugasmu bukan untuk mencari cinta, melainkan mencari penghalang di dalam dirimu yang menahannya.",
    spiritual: "Intuisi adalah kompasmu, jangan pernah meragukannya.",
    dailyAffirmation: "Afirmasi: Aku adalah cahaya yang membimbing diriku dan orang lain."
  },
  "22": {
    title: "Angka 22 – Master Pembangun (Master Number)",
    desc: "Angka paling kuat dalam numerologi. Anda memiliki potensi untuk mengubah mimpi paling mustahil menjadi kenyataan yang kokoh. Anda menggabungkan visi spiritual angka 11 dengan kepraktisan angka 4. Anda ditakdirkan untuk meninggalkan warisan besar di dunia.",
    element: "Tanah",
    luckyNumber: [22],
    strength: "Visi luar biasa, eksekutor andal, pemimpin karismatik, praktis",
    weakness: "Takut gagal, terbebani oleh potensi diri, terlalu menuntut",
    career: "Arsitek Skala Besar, Pemimpin Negara, Pendiri Yayasan Global",
    love: "Setia dan membangun kerajaan masa depan bersama pasangannya.",
    quote: "Apa pun yang pikiran manusia bisa bayangkan dan yakini, itu bisa dicapai.",
    spiritual: "Pikiran besar menuntut tindakan besar. Jangan takut pada potensimu.",
    dailyAffirmation: "Afirmasi: Aku mewujudkan mimpi besarku menjadi kenyataan nyata."
  },
  "33": {
    title: "Angka 33 – Master Guru (Master Number)",
    desc: "Dikenal sebagai angka 'Cinta Tanpa Syarat'. Anda adalah penyembuh bagi para penyembuh. Fokus utama Anda adalah mengangkat kesadaran spiritual umat manusia. Anda tidak mementingkan ego, melainkan pengabdian total kepada kebaikan tertinggi.",
    element: "Air",
    luckyNumber: [33],
    strength: "Cinta tanpa syarat, penyembuh, penuh pengorbanan, sangat bijak",
    weakness: "Memikul beban dunia, sering dimanfaatkan, lupa pada batas diri",
    career: "Pemimpin Spiritual Terkemuka, Pekerja Kemanusiaan Global",
    love: "Mencintai tanpa mengharapkan balasan apa pun, pengabdian murni.",
    quote: "Hanya nyawa yang dijalani untuk orang lain yang layak dihidupi.",
    spiritual: "Cintamu menyembuhkan dunia, tapi mulailah dengan menyembuhkan dirimu.",
    dailyAffirmation: "Afirmasi: Cintaku adalah kekuatan penyembuh yang tak terbatas."
  }
};
// ==========================================
// PART 2: DATA INGGRIS (EN) & SPANYOL (ES)
// ==========================================
const dataEN: Record<string, any> = {
  "1": {
    title: "Number 1 – The Pioneer",
    desc: "You are born as a natural leader, independent, and full of innovation. Number 1 represents new beginnings, the courage to stand alone, and a strong drive to reach the top. You dislike following others' rules and prefer creating your own path.",
    element: "Fire",
    luckyNumber: [1, 10, 19, 28],
    strength: "Brave, independent, innovative, confident, trailblazer",
    weakness: "Stubborn, selfish, impatient, struggles with criticism",
    career: "Entrepreneur, Manager, Inventor, Director, Politician",
    love: "Needs an independent partner who doesn't restrict their freedom.",
    quote: "The only way to predict the future is to create it.",
    spiritual: "Trust your first instinct, it is the voice of your soul.",
    dailyAffirmation: "Affirmation: I am the creator of my own destiny."
  },
  "2": {
    title: "Number 2 – The Mediator",
    desc: "You are a peacemaker, highly sensitive to others' feelings, and prioritize harmony. Number 2 represents partnership, diplomacy, and intuition. You thrive when cooperating with others and have a natural talent for defusing conflicts.",
    element: "Water",
    luckyNumber: [2, 11, 20, 29],
    strength: "Empathetic, diplomatic, loyal, loving, good listener",
    weakness: "Overly sensitive, avoids conflict, easily taken advantage of",
    career: "Counselor, Diplomat, Therapist, Musician, Mediator",
    love: "Very romantic and makes the relationship a top priority.",
    quote: "Peace cannot be kept by force; it can only be achieved by understanding.",
    spiritual: "Your true strength lies in your gentleness.",
    dailyAffirmation: "Affirmation: My heart is a source of peace for my surroundings."
  },
  "3": {
    title: "Number 3 – The Communicator",
    desc: "You are the life of the party, full of creativity, self-expression, and laughter. Number 3 represents communication, art, and charisma. You have the ability to heal others through your words, art, or simply your cheerful presence.",
    element: "Air",
    luckyNumber: [3, 12, 21, 30],
    strength: "Creative, optimistic, charismatic, articulate, humorous",
    weakness: "Lacks focus, easily bored, avoids heavy responsibilities",
    career: "Writer, Actor, Journalist, Designer, Artist",
    love: "Needs a partner to laugh with and share wild ideas.",
    quote: "Creativity is intelligence having fun.",
    spiritual: "Express yourself, because your voice heals the world.",
    dailyAffirmation: "Affirmation: I express myself freely and joyfully."
  },
  "4": {
    title: "Number 4 – The Builder",
    desc: "You are a solid foundation in society. Hardworking, logical, and highly reliable. Number 4 represents structure, systems, and perseverance. You believe more in the results of hard work than in luck or shortcuts.",
    element: "Earth",
    luckyNumber: [4, 13, 22, 31],
    strength: "Disciplined, practical, loyal, organized, resilient",
    weakness: "Rigid, overly conservative, workaholic, pessimistic",
    career: "Architect, Engineer, Accountant, Project Manager, IT Expert",
    love: "Shows love through real actions and guarantees financial security.",
    quote: "The future depends on what you do today.",
    spiritual: "Sincere hard work is the highest form of worship.",
    dailyAffirmation: "Affirmation: I build my life on a solid foundation."
  },
  "5": {
    title: "Number 5 – The Adventurer",
    desc: "Freedom is oxygen for you. You cannot stay in one place and are always seeking new experiences. Number 5 represents change, adaptation, and risk-taking. You live to explore the world and taste every side of life.",
    element: "Fire",
    luckyNumber: [5, 14, 23, 32],
    strength: "Brave, adaptive, energetic, open-minded, progressive",
    weakness: "Impulsive, fears commitment, restless, lacks discipline",
    career: "Tour Guide, Consultant, Sales, Freelance Journalist, Athlete",
    love: "Will run away if their partner becomes possessive or restrictive.",
    quote: "Freedom is not the absence of commitments, but the ability to choose yours.",
    spiritual: "Find peace amidst constant change.",
    dailyAffirmation: "Affirmation: I welcome change with an open heart."
  },
  "6": {
    title: "Number 6 – The Caregiver",
    desc: "You have a natural instinct to nurture, protect, and serve others. Number 6 represents compassion, family responsibility, and justice. People always come to you for advice or to lean on when they are fragile.",
    element: "Water",
    luckyNumber: [6, 15, 24, 33],
    strength: "Loving, protective, responsible, idealistic, fair",
    weakness: "Bossy, over-sacrificing, neglects self",
    career: "Teacher, Doctor, Nurse, Marriage Counselor, Interior Designer",
    love: "Gives boundless love and makes family the center of the universe.",
    quote: "Love and compassion are necessities, not luxuries.",
    spiritual: "Do not forget to pour love into yourself first.",
    dailyAffirmation: "Affirmation: I give love and deserve to receive love."
  },
  "7": {
    title: "Number 7 – The Truth Seeker",
    desc: "You are the philosopher who always questions the meaning behind everything. Number 7 represents wisdom, spirituality, and intellectual depth. You often need time alone to reflect and recharge your inner energy.",
    element: "Air",
    luckyNumber: [7, 16, 25],
    strength: "Analytical, intuitive, wise, spiritual, perfectionist",
    weakness: "Loner, cynical, overly critical, hard to trust others",
    career: "Scientist, Researcher, Detective, Academic, Philosopher",
    love: "Needs a deep soul connection, not just physical attraction.",
    quote: "Knowing yourself is the beginning of all wisdom.",
    spiritual: "Silence is the canvas where your soul speaks the loudest.",
    dailyAffirmation: "Affirmation: I trust the wisdom of my subconscious mind."
  },
  "8": {
    title: "Number 8 – The Executive",
    desc: "You were born with the energy of material success, ambition, and power. Number 8 represents karma, balance between material and spiritual, and authority. You are a wealth magnet but must learn to use that power for the common good.",
    element: "Earth",
    luckyNumber: [8, 17, 26],
    strength: "Ambitious, visionary, financially smart, strong leader",
    weakness: "Materialistic, workaholic, dominant, ignores emotions",
    career: "CEO, Investor, Lawyer, Real Estate Developer",
    love: "Seeks an equal partner to be a solid team in achieving success.",
    quote: "Success isn't about how much money you make, it's about the difference you make.",
    spiritual: "True power is born when material serves a spiritual purpose.",
    dailyAffirmation: "Affirmation: I am a channel of abundance and positive success."
  },
  "9": {
    title: "Number 9 – The Philanthropist",
    desc: "You are an old soul with boundless empathy for the world's suffering. Number 9 represents completion, humanity, and universal love. Your life's purpose is to serve, heal, and bring enlightenment to the masses.",
    element: "Fire",
    luckyNumber: [9, 18, 27],
    strength: "Compassionate, idealistic, forgiving, visionary, wise",
    weakness: "Naive, easily disappointed, emotional, forgets self",
    career: "Activist, Volunteer, Healer, Social Worker, Artist",
    love: "Very romantic, but sometimes loves humanity more than their partner.",
    quote: "The purpose of human life is to serve, and to show compassion.",
    spiritual: "Letting go of the past is the key to your enlightenment.",
    dailyAffirmation: "Affirmation: I peacefully release what no longer serves me."
  },
  "11": {
    title: "Number 11 – Spiritual Illuminator (Master)",
    desc: "As a Master Number, your intuition borders on psychic ability. You are a channel of enlightenment, inspiration, and light for others. Your life burden is often heavy because you are meant to be an example of spiritual awakening.",
    element: "Air",
    luckyNumber: [11, 29],
    strength: "Highly intuitive, inspiring, empathetic, charismatic, visionary",
    weakness: "Over-anxious, nervous, easily stressed, unrealistic expectations",
    career: "Spiritual Teacher, Motivator, Alternative Therapist, Influential Artist",
    love: "Can read their partner's mind and demands absolute emotional honesty.",
    quote: "Your task is not to seek for love, but merely to seek all the barriers within yourself.",
    spiritual: "Intuition is your compass, never doubt it.",
    dailyAffirmation: "Affirmation: I am the light that guides myself and others."
  },
  "22": {
    title: "Number 22 – Master Builder (Master)",
    desc: "The most powerful number in numerology. You have the potential to turn the most impossible dreams into solid reality. You combine the spiritual vision of 11 with the practicality of 4. You are destined to leave a massive legacy.",
    element: "Earth",
    luckyNumber: [22],
    strength: "Incredible vision, reliable executor, charismatic leader, practical",
    weakness: "Fear of failure, burdened by potential, overly demanding",
    career: "Large-Scale Architect, State Leader, Global Foundation Founder",
    love: "Loyal and builds a future empire alongside their partner.",
    quote: "Whatever the mind of man can conceive and believe, it can achieve.",
    spiritual: "Great minds demand great actions. Do not fear your potential.",
    dailyAffirmation: "Affirmation: I manifest my grand dreams into solid reality."
  },
  "33": {
    title: "Number 33 – Master Teacher (Master)",
    desc: "Known as the number of 'Unconditional Love'. You are a healer to the healers. Your main focus is raising the spiritual consciousness of humanity. You disregard ego in favor of total devotion to the highest good.",
    element: "Water",
    luckyNumber: [33],
    strength: "Unconditional love, healer, self-sacrificing, extremely wise",
    weakness: "Carries the world's burdens, easily used, forgets boundaries",
    career: "Prominent Spiritual Leader, Global Humanitarian Worker",
    love: "Loves without expecting anything in return, pure devotion.",
    quote: "Only a life lived for others is a life worthwhile.",
    spiritual: "Your love heals the world, but start by healing yourself.",
    dailyAffirmation: "Affirmation: My love is a boundless healing force."
  }
};

const dataES: Record<string, any> = {
  "1": {
    title: "Número 1 – El Pionero",
    desc: "Naciste como un líder natural, independiente y lleno de innovación. El número 1 representa nuevos comienzos, el valor de estar solo y un fuerte impulso por llegar a la cima. No te gusta seguir las reglas de los demás.",
    element: "Fuego",
    luckyNumber: [1, 10, 19, 28],
    strength: "Valiente, independiente, innovador, seguro, pionero",
    weakness: "Terco, egoísta, impaciente, no acepta críticas",
    career: "Emprendedor, Gerente, Inventor, Director, Político",
    love: "Necesita una pareja independiente que no restrinja su libertad.",
    quote: "La única forma de predecir el futuro es creándolo.",
    spiritual: "Confía en tu primer instinto, es la voz de tu alma.",
    dailyAffirmation: "Afirmación: Soy el creador de mi propio destino."
  },
  "2": {
    title: "Número 2 – El Mediador",
    desc: "Eres un pacificador, muy sensible a los sentimientos de los demás y priorizas la armonía. El número 2 representa la asociación, la diplomacia y la intuición. Prosperas al cooperar con otros y tienes un talento natural para calmar conflictos.",
    element: "Agua",
    luckyNumber: [2, 11, 20, 29],
    strength: "Empático, diplomático, leal, cariñoso, buen oyente",
    weakness: "Demasiado sensible, evita conflictos, fácil de aprovechar",
    career: "Consejero, Diplomático, Terapeuta, Músico, Mediador",
    love: "Muy romántico y hace de la relación una prioridad máxima.",
    quote: "La paz no se puede mantener por la fuerza; solo se logra comprendiendo.",
    spiritual: "Tu verdadera fuerza reside en tu gentileza.",
    dailyAffirmation: "Afirmación: Mi corazón es una fuente de paz para mi entorno."
  },
  "3": {
    title: "Número 3 – El Comunicador",
    desc: "Eres el alma de la fiesta, lleno de creatividad, autoexpresión y risas. El número 3 representa la comunicación, el arte y el carisma. Tienes la capacidad de sanar a otros a través de tus palabras, arte o presencia alegre.",
    element: "Aire",
    luckyNumber: [3, 12, 21, 30],
    strength: "Creativo, optimista, carismático, elocuente, humorístico",
    weakness: "Falta de enfoque, se aburre rápido, evita responsabilidades",
    career: "Escritor, Actor, Periodista, Diseñador, Artista",
    love: "Necesita una pareja con quien reír y compartir ideas locas.",
    quote: "La creatividad es la inteligencia divirtiéndose.",
    spiritual: "Exprésate, porque tu voz sana al mundo.",
    dailyAffirmation: "Afirmación: Me expreso libremente y con alegría."
  },
  "4": {
    title: "Número 4 – El Constructor",
    desc: "Eres una base sólida en la sociedad. Trabajador, lógico y muy confiable. El número 4 representa estructura, sistemas y perseverancia. Crees más en los resultados del trabajo duro que en la suerte o los atajos.",
    element: "Tierra",
    luckyNumber: [4, 13, 22, 31],
    strength: "Disciplinado, práctico, leal, organizado, resiliente",
    weakness: "Rígido, conservador, adicto al trabajo, pesimista",
    career: "Arquitecto, Ingeniero, Contador, Gerente, Experto TI",
    love: "Muestra amor con acciones reales y garantiza seguridad financiera.",
    quote: "El futuro depende de lo que hagas hoy.",
    spiritual: "El trabajo duro y sincero es la forma más elevada de adoración.",
    dailyAffirmation: "Afirmación: Construyo mi vida sobre una base sólida."
  },
  "5": {
    title: "Número 5 – El Aventurero",
    desc: "La libertad es oxígeno para ti. No puedes quedarte en un lugar y siempre buscas nuevas experiencias. El número 5 representa cambio, adaptación y toma de riesgos. Vives para explorar el mundo y probar cada lado de la vida.",
    element: "Fuego",
    luckyNumber: [5, 14, 23, 32],
    strength: "Valiente, adaptativo, enérgico, mente abierta, progresivo",
    weakness: "Impulsivo, teme el compromiso, inquieto, indisciplinado",
    career: "Guía Turístico, Consultor, Ventas, Periodista, Atleta",
    love: "Huirá si su pareja se vuelve posesiva o restrictiva.",
    quote: "La libertad no es la ausencia de compromisos, sino la capacidad de elegirlos.",
    spiritual: "Encuentra la paz en medio del cambio constante.",
    dailyAffirmation: "Afirmación: Acojo el cambio con el corazón abierto."
  },
  "6": {
    title: "Número 6 – El Cuidador",
    desc: "Tienes un instinto natural para nutrir, proteger y servir a otros. El número 6 representa compasión, responsabilidad familiar y justicia. La gente siempre acude a ti en busca de consejos o para apoyarse cuando están frágiles.",
    element: "Agua",
    luckyNumber: [6, 15, 24, 33],
    strength: "Amoroso, protector, responsable, idealista, justo",
    weakness: "Mandón, se sacrifica demasiado, se descuida a sí mismo",
    career: "Maestro, Médico, Enfermera, Consejero, Diseñador de Interiores",
    love: "Da amor sin límites y hace de la familia el centro del universo.",
    quote: "El amor y la compasión son necesidades, no lujos.",
    spiritual: "No olvides verter amor en ti mismo primero.",
    dailyAffirmation: "Afirmación: Doy amor y merezco recibir amor."
  },
  "7": {
    title: "Número 7 – Buscador de la Verdad",
    desc: "Eres el filósofo que siempre cuestiona el significado detrás de todo. El número 7 representa sabiduría, espiritualidad y profundidad intelectual. A menudo necesitas tiempo a solas para reflexionar y recargar tu energía.",
    element: "Aire",
    luckyNumber: [7, 16, 25],
    strength: "Analítico, intuitivo, sabio, espiritual, perfeccionista",
    weakness: "Solitario, cínico, demasiado crítico, le cuesta confiar",
    career: "Científico, Investigador, Detective, Académico, Filósofo",
    love: "Necesita una conexión profunda del alma, no solo atracción física.",
    quote: "Conocerse a sí mismo es el comienzo de toda sabiduría.",
    spiritual: "El silencio es el lienzo donde tu alma habla más fuerte.",
    dailyAffirmation: "Afirmación: Confío en la sabiduría de mi subconsciente."
  },
  "8": {
    title: "Número 8 – El Ejecutivo",
    desc: "Naciste con la energía del éxito material, la ambición y el poder. El número 8 representa el karma, el equilibrio entre lo material y lo espiritual, y la autoridad. Eres un imán de riqueza, pero debes aprender a usarla para el bien común.",
    element: "Tierra",
    luckyNumber: [8, 17, 26],
    strength: "Ambicioso, visionario, inteligente con el dinero, líder fuerte",
    weakness: "Materialista, adicto al trabajo, dominante, ignora emociones",
    career: "CEO, Inversor, Abogado, Desarrollador Inmobiliario",
    love: "Busca un compañero igualitario para formar un equipo sólido.",
    quote: "El éxito no se trata de cuánto dinero ganas, sino de la diferencia que haces.",
    spiritual: "El verdadero poder nace cuando lo material sirve a un propósito espiritual.",
    dailyAffirmation: "Afirmación: Soy un canal de abundancia y éxito positivo."
  },
  "9": {
    title: "Número 9 – El Filántropo",
    desc: "Eres un alma vieja con una empatía ilimitada por el sufrimiento del mundo. El número 9 representa la finalización, la humanidad y el amor universal. El propósito de tu vida es servir, sanar y llevar iluminación a las masas.",
    element: "Fuego",
    luckyNumber: [9, 18, 27],
    strength: "Compasivo, idealista, perdonador, visionario, sabio",
    weakness: "Ingenuo, se decepciona fácil, emocional, se olvida de sí",
    career: "Activista, Voluntario, Sanador, Trabajador Social, Artista",
    love: "Muy romántico, pero a veces ama a la humanidad más que a su pareja.",
    quote: "El propósito de la vida humana es servir y mostrar compasión.",
    spiritual: "Dejar ir el pasado es la clave para tu iluminación.",
    dailyAffirmation: "Afirmación: Libero en paz lo que ya no me sirve."
  },
  "11": {
    title: "Número 11 – Iluminador (Maestro)",
    desc: "Como Número Maestro, tu intuición bordea la habilidad psíquica. Eres un canal de iluminación, inspiración y luz para otros. La carga de tu vida suele ser pesada porque estás destinado a ser un ejemplo de despertar espiritual.",
    element: "Aire",
    luckyNumber: [11, 29],
    strength: "Muy intuitivo, inspirador, empático, carismático, visionario",
    weakness: "Excesivamente ansioso, nervioso, se estresa fácil, expectativas irreales",
    career: "Maestro Espiritual, Motivador, Terapeuta Alternativo, Artista Influyente",
    love: "Puede leer la mente de su pareja y exige honestidad emocional absoluta.",
    quote: "Tu tarea no es buscar el amor, sino buscar todas las barreras dentro de ti que lo bloquean.",
    spiritual: "La intuición es tu brújula, nunca la dudes.",
    dailyAffirmation: "Afirmación: Soy la luz que guía a mí mismo y a los demás."
  },
  "22": {
    title: "Número 22 – Maestro Constructor",
    desc: "El número más poderoso en numerología. Tienes el potencial de convertir los sueños más imposibles en una realidad sólida. Combinas la visión espiritual del 11 con la practicidad del 4. Estás destinado a dejar un legado masivo.",
    element: "Tierra",
    luckyNumber: [22],
    strength: "Increíble visión, ejecutor confiable, líder carismático, práctico",
    weakness: "Miedo al fracaso, abrumado por su potencial, muy exigente",
    career: "Arquitecto de Gran Escala, Líder Estatal, Fundador Global",
    love: "Leal y construye un imperio futuro junto a su pareja.",
    quote: "Cualquier cosa que la mente del hombre pueda concebir y creer, puede lograrse.",
    spiritual: "Las grandes mentes exigen grandes acciones. No temas a tu potencial.",
    dailyAffirmation: "Afirmación: Manifiesto mis grandes sueños en una realidad sólida."
  },
  "33": {
    title: "Número 33 – Maestro de Maestros",
    desc: "Conocido como el número del 'Amor Incondicional'. Eres un sanador para los sanadores. Tu enfoque principal es elevar la conciencia espiritual de la humanidad. Ignoras el ego en favor de la devoción total al bien supremo.",
    element: "Agua",
    luckyNumber: [33],
    strength: "Amor incondicional, sanador, sacrificado, extremadamente sabio",
    weakness: "Lleva las cargas del mundo, es usado fácilmente, olvida límites",
    career: "Líder Espiritual Prominente, Trabajador Humanitario Global",
    love: "Ama sin esperar nada a cambio, pura devoción.",
    quote: "Solo una vida vivida para los demás es una vida que vale la pena vivir.",
    spiritual: "Tu amor sana al mundo, pero comienza por sanarte a ti mismo.",
    dailyAffirmation: "Afirmación: Mi amor es una fuerza sanadora ilimitada."
  }
};

// Penggabungan Database
const DICTIONARY: Record<string, any> = { id: dataID, en: dataEN, es: dataES };
// ==========================================
// PART 3: LOGIKA PERHITUNGAN & INISIASI KOMPONEN
// ==========================================
export default function LifePathNumber({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  
  // Memilih kamus antarmuka dan data numerologi berdasarkan bahasa aktif
  const ui = UI_DICT[activeLang] || UI_DICT["id"];
  const db = DICTIONARY[activeLang] || DICTIONARY["id"];

  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [dailyWisdom, setDailyWisdom] = useState("");

  // Fungsi Inti: Menghitung Angka Jalan Takdir
  const calculateLifePath = (dob: string): number => {
    // Hilangkan tanda strip (-) dan ubah menjadi array angka
    const digits = dob.replace(/-/g, "").split("").map(Number);
    let total = digits.reduce((a, b) => a + b, 0);
    
    // Fungsi rekursif untuk mengecilkan angka sampai 1-9, kecuali 11, 22, 33
    const reduceNum = (num: number): number => {
      if (num === 11 || num === 22 || num === 33) return num;
      if (num > 9) {
        const next = String(num).split("").map(Number).reduce((a, b) => a + b, 0);
        return reduceNum(next);
      }
      return num;
    };
    
    return reduceNum(total);
  };

  // Fungsi Inti: Meracik Pesan Harian Dinamis (Berdasarkan Bahasa)
  const generateDailyWisdom = (lifePath: number, dateStr: string): string => {
    const info = db[lifePath.toString()];
    if (!info) return "";
    
    // Racikan kalimat sesuai bahasa
    let msg1, msg2;
    if (activeLang === "en") {
      msg1 = `believe in your first step today.`;
      msg2 = `Your greatest strength today is`;
    } else if (activeLang === "es") {
      msg1 = `cree en tu primer paso hoy.`;
      msg2 = `Tu mayor fuerza hoy es`;
    } else {
      msg1 = `percayalah pada langkah pertamamu hari ini.`;
      msg2 = `Kekuatan terbesarmu hari ini adalah`;
    }

    const messages = [
      `✨ ${info.title.split("–")[0].trim()}: ${msg1}`,
      `🌿 ${msg2} "${info.strength.split(",")[0].toLowerCase()}".`,
      `💫 "${info.quote.substring(0, 50)}..."`,
      `🍀 ${ui.lucky}: ${info.luckyNumber[Math.floor(Math.random() * info.luckyNumber.length)]}.`
    ];
    
    // Membuat angka seed konsisten dari tanggal agar pesannya tetap sama seharian
    const seed = dateStr.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return messages[seed % messages.length];
  };

  // Handler: Tombol Hitung Diklik
  const handleCalculate = () => {
    if (!birthDate) return;
    setLoading(true);
    setResult(null);
    
    // Efek simulasi loading 1.3 detik agar terasa natural
    setTimeout(() => {
      const lp = calculateLifePath(birthDate);
      setResult(lp);
      setDailyWisdom(generateDailyWisdom(lp, birthDate));
      setLoading(false);
    }, 1300);
  };

  // Handler: Tombol Share Diklik
  const handleShare = async () => {
    if (!result) return;
    const info = db[result.toString()];
    const text = `${ui.sharePrefix}${result} - ${info.title}. ${info.desc.substring(0, 100)}... ${ui.shareSuffix}`;
    
    if (navigator.share) {
      try { await navigator.share({ title: ui.title, text }); } catch (e) {}
    } else {
      // Fallback ke WhatsApp Web jika API Share tidak didukung
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  // Mengambil info data dari result yang sudah dikalkulasi
  const info = result ? db[result.toString()] : null;
// ==========================================
  // PART 4: ANTARMUKA UI (ULTRA PREMIUM)
  // ==========================================
  return (
    <div className="max-w-2xl mx-auto text-white font-sans px-4 py-6">
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-2 drop-shadow-2xl">🔢✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
          {ui.title}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">{ui.subtitle}</p>
      </div>

      {/* INPUT FORM */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white text-center [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        <button
          onClick={handleCalculate}
          disabled={loading || !birthDate}
          className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_auto] animate-gradient-x font-bold text-lg hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-purple-500/30"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              {ui.loadingText}
            </span>
          ) : ui.buttonLabel}
        </button>
      </div>

      {/* LOADING ANIMATION */}
      {loading && (
        <div className="flex justify-center mt-12">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-pink-500 animate-spin"></div>
          </div>
        </div>
      )}

      {/* RESULT CARD */}
      {result !== null && !loading && info && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* GLOW EFFECTS */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>

            {/* MAIN NUMBER */}
            <div className="text-center relative z-10">
              <span className="inline-block text-8xl font-black bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
                {result}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                {info.title}
              </h3>
              <div className="flex justify-center gap-2 mt-3">
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10 font-medium tracking-wide">
                  {ui.element}: {info.element}
                </span>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10 font-medium tracking-wide">
                  {ui.lucky}: {info.luckyNumber.slice(0,3).join(", ")}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 space-y-5 text-slate-200 leading-relaxed text-sm md:text-base border-b border-white/10 pb-8 text-center">
              <p>{info.desc}</p>
            </div>

            {/* 4-GRID TRAITS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-emerald-500/10 p-5 rounded-xl border border-emerald-500/20">
                <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">✨ {ui.strength}</h4>
                <p className="text-sm text-slate-200 mt-2">{info.strength}</p>
              </div>
              <div className="bg-rose-500/10 p-5 rounded-xl border border-rose-500/20">
                <h4 className="text-rose-400 font-bold text-xs uppercase tracking-wider">⚠️ {ui.weakness}</h4>
                <p className="text-sm text-slate-200 mt-2">{info.weakness}</p>
              </div>
              <div className="bg-cyan-500/10 p-5 rounded-xl border border-cyan-500/20">
                <h4 className="text-cyan-400 font-bold text-xs uppercase tracking-wider">💼 {ui.career}</h4>
                <p className="text-sm text-slate-200 mt-2">{info.career}</p>
              </div>
              <div className="bg-pink-500/10 p-5 rounded-xl border border-pink-500/20">
                <h4 className="text-pink-400 font-bold text-xs uppercase tracking-wider">❤️ {ui.love}</h4>
                <p className="text-sm text-slate-200 mt-2">{info.love}</p>
              </div>
            </div>

            {/* QUOTE & SPIRITUAL */}
            <div className="mt-6 p-6 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
              <p className="text-amber-200 italic text-sm font-medium">📖 "{info.quote}"</p>
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">🧘 {info.spiritual}</p>
            </div>

            {/* DAILY WISDOM */}
            <div className="mt-6 p-5 bg-white/5 rounded-xl border border-white/10 text-center animate-pulse-slow">
              <p className="text-purple-200 text-sm">🌟 <span className="font-bold">{ui.daily}</span> {dailyWisdom}</p>
              <p className="text-slate-400 text-xs mt-3 font-semibold tracking-wide uppercase">{info.dailyAffirmation}</p>
            </div>

            {/* SHARE BUTTON */}
            <button
              onClick={handleShare}
              className="mt-8 w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider border border-white/20"
            >
              {ui.shareBtn}
            </button>

            <p className="text-center text-[10px] text-slate-500 mt-6 italic">{ui.disclaimer}</p>
            
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
              toolName={ui.title} 
              resultId={result.toString()} 
            />
</>
            {/* SAMPAI SINI */}

          </div>
        </div>
      )}
      
      {/* CUSTOM CSS ANIMATIONS */}
      <style jsx>{`
        @keyframes gradient-x { 
          0% { background-position: 0% 50%; } 
          50% { background-position: 100% 50%; } 
          100% { background-position: 0% 50%; } 
        }
        .animate-gradient-x { background-size: 200% auto; animation: gradient-x 2s ease infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}