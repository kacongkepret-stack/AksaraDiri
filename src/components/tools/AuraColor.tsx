"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Warna Aura",
    badge: "Ultra Premium",
    subtitle: "Temukan energi spiritualmu berdasarkan nama atau tanggal lahir. Ramalan aura modern yang terintegrasi dengan kearifan lokal.",
    shareBtn: "Bagikan",
    inputs: {
      namePlaceholder: "Masukkan namamu...",
      dateLabel: "Tanggal Lahir",
      nameTab: "Berdasarkan Nama",
      dateTab: "Berdasarkan Tanggal Lahir",
      analyze: "🔮 Lihat Warna Aura",
      computing: "Menemukan Aurarmu...",
      emptyMessage: "Pilih metode dan isi data untuk mengungkap warna aura Anda.",
    },
    labels: {
      karakter: "Karakter Utama",
      kekuatan: "Kekuatan",
      tantangan: "Tantangan",
      karir: "Karir Cocok",
      cinta: "Cinta & Hubungan",
      pesan: "Pesan Spiritual",
      quote: "\"Aura adalah cerminan getaran jiwa. Kenali warnamu, kenali dirimu.\"",
      disclaimer: "*Hasil ini bersifat inspiratif dan tidak menggantikan nasihat profesional. Nikmati sebagai cermin diri.",
    },
  },
  en: {
    title: "Aura Color",
    badge: "Ultra Premium",
    subtitle: "Discover your spiritual energy based on your name or birth date. Modern aura reading integrated with local wisdom.",
    shareBtn: "Share",
    inputs: {
      namePlaceholder: "Enter your name...",
      dateLabel: "Birth Date",
      nameTab: "By Name",
      dateTab: "By Birth Date",
      analyze: "🔮 Reveal Aura Color",
      computing: "Finding your aura...",
      emptyMessage: "Choose a method and fill in the data to reveal your aura color.",
    },
    labels: {
      karakter: "Main Character",
      kekuatan: "Strengths",
      tantangan: "Challenges",
      karir: "Suitable Career",
      cinta: "Love & Relationships",
      pesan: "Spiritual Message",
      quote: "\"Aura is the reflection of your soul's vibration. Know your color, know yourself.\"",
      disclaimer: "*This result is inspirational and does not replace professional advice. Enjoy as a mirror of yourself.",
    },
  },
  es: {
    title: "Color del Aura",
    badge: "Ultra Premium",
    subtitle: "Descubre tu energía espiritual basada en tu nombre o fecha de nacimiento. Lectura moderna de aura integrada con sabiduría local.",
    shareBtn: "Compartir",
    inputs: {
      namePlaceholder: "Ingresa tu nombre...",
      dateLabel: "Fecha de Nacimiento",
      nameTab: "Por Nombre",
      dateTab: "Por Fecha de Nacimiento",
      analyze: "🔮 Revelar Color del Aura",
      computing: "Encontrando tu aura...",
      emptyMessage: "Elige un método y completa los datos para revelar el color de tu aura.",
    },
    labels: {
      karakter: "Carácter Principal",
      kekuatan: "Fortalezas",
      tantangan: "Desafíos",
      karir: "Carrera Adecuada",
      cinta: "Amor y Relaciones",
      pesan: "Mensaje Espiritual",
      quote: "\"El aura es el reflejo de la vibración de tu alma. Conoce tu color, conócete a ti mismo.\"",
      disclaimer: "*Este resultado es inspiracional y no reemplaza el consejo profesional. Disfrútalo como un espejo de ti mismo.",
    },
  },
};

// ========== MULTI-LANGUAGE AURA DATABASE ==========
const AURA_DATA_ML: Record<string, Record<string, any>> = {
  Merah: {
    id: {
      nama: "Merah",
      deskripsi: "Aura merah melambangkan energi vital, gairah, dan keberanian. Anda memiliki semangat hidup yang membara dan tidak takut mengambil risiko. Anda adalah penggerak, pelopor, dan pemimpin alami.",
      karakter: "Dinamis, kompetitif, bersemangat, tegas, dan sangat percaya diri.",
      kekuatan: "Kemampuan memotivasi diri dan orang lain, berani mengambil keputusan sulit, energi tak terbatas.",
      tantangan: "Cenderung impulsif, mudah marah, kurang sabar, kadang terlalu dominan.",
      karir: "Pemimpin proyek, atlet, entrepreneur, manajer eksekutif, militer.",
      cinta: "Anda mencintai dengan penuh gairah dan kesetiaan. Butuh pasangan yang bisa mengimbangi energi dan tidak takut dengan intensitas Anda.",
      pesan: "Salurkan api dalam dirimu untuk membangun, bukan membakar. Istirahatlah sebelum kelelahan.",
    },
    en: {
      nama: "Red",
      deskripsi: "Red aura symbolizes vital energy, passion, and courage. You have a burning zest for life and are not afraid to take risks. You are a mover, pioneer, and natural leader.",
      karakter: "Dynamic, competitive, enthusiastic, decisive, and very confident.",
      kekuatan: "Ability to motivate yourself and others, courage to make tough decisions, boundless energy.",
      tantangan: "Prone to impulsiveness, easily angered, impatient, sometimes too dominant.",
      karir: "Project leader, athlete, entrepreneur, executive manager, military.",
      cinta: "You love with passion and loyalty. Need a partner who can match your energy and is not afraid of your intensity.",
      pesan: "Channel the fire within you to build, not burn. Rest before exhaustion.",
    },
    es: {
      nama: "Rojo",
      deskripsi: "El aura roja simboliza energía vital, pasión y coraje. Tienes un ardiente entusiasmo por la vida y no temes asumir riesgos. Eres un motor, pionero y líder nato.",
      karakter: "Dinámico, competitivo, entusiasta, decidido y muy seguro.",
      kekuatan: "Capacidad para motivarte a ti mismo y a los demás, valentía para tomar decisiones difíciles, energía ilimitada.",
      tantangan: "Propenso a la impulsividad, se enoja fácilmente, impaciente, a veces demasiado dominante.",
      karir: "Líder de proyectos, atleta, emprendedor, gerente ejecutivo, militar.",
      cinta: "Amas con pasión y lealtad. Necesitas una pareja que pueda igualar tu energía y no le tema a tu intensidad.",
      pesan: "Canaliza el fuego interior para construir, no quemar. Descansa antes del agotamiento.",
    },
  },
  Jingga: {
    id: {
      nama: "Jingga",
      deskripsi: "Aura jingga adalah warna kreativitas, optimisme, dan kegembiraan. Anda membawa semangat baru ke mana pun pergi, seperti matahari terbit yang menyapa dunia.",
      karakter: "Kreatif, ceria, sosial, optimis, dan penuh ide segar.",
      kekuatan: "Mudah beradaptasi, pandai membangun relasi, selalu melihat sisi positif.",
      tantangan: "Kurang fokus, mudah bosan, terkadang terlalu impulsif.",
      karir: "Desainer, musisi, marketing kreatif, event organizer, guru TK.",
      cinta: "Anda mencari pasangan yang bisa diajak tertawa dan berpetualang. Hubungan yang membosankan akan membuat Anda layu.",
      pesan: "Jangan takut bersinar, tapi ingatlah untuk tetap membumi.",
    },
    en: {
      nama: "Orange",
      deskripsi: "Orange aura is the color of creativity, optimism, and joy. You bring a fresh spirit wherever you go, like the sunrise greeting the world.",
      karakter: "Creative, cheerful, social, optimistic, full of fresh ideas.",
      kekuatan: "Adaptable, good at building relationships, always sees the positive side.",
      tantangan: "Lack of focus, easily bored, sometimes too impulsive.",
      karir: "Designer, musician, creative marketing, event organizer, kindergarten teacher.",
      cinta: "You seek a partner who can laugh and go on adventures with you. A boring relationship will wither you.",
      pesan: "Don't be afraid to shine, but remember to stay grounded.",
    },
    es: {
      nama: "Naranja",
      deskripsi: "El aura naranja es el color de la creatividad, el optimismo y la alegría. Llevas un espíritu fresco a dondequiera que vayas, como el amanecer saludando al mundo.",
      karakter: "Creativo, alegre, sociable, optimista, lleno de ideas frescas.",
      kekuatan: "Adaptable, bueno para construir relaciones, siempre ve el lado positivo.",
      tantangan: "Falta de enfoque, se aburre fácilmente, a veces demasiado impulsivo.",
      karir: "Diseñador, músico, marketing creativo, organizador de eventos, maestro de jardín de infancia.",
      cinta: "Buscas una pareja que pueda reír y aventurarse contigo. Una relación aburrida te marchitará.",
      pesan: "No temas brillar, pero recuerda mantener los pies en la tierra.",
    },
  },
  Kuning: {
    id: {
      nama: "Kuning",
      deskripsi: "Aura kuning adalah warna kecerdasan, kebahagiaan, dan komunikasi. Anda memiliki pikiran yang tajam dan kemampuan menyampaikan ide dengan memikat.",
      karakter: "Cerdas, komunikatif, ceria, analitis, dan penuh rasa ingin tahu.",
      kekuatan: "Belajar cepat, pandai memecahkan masalah, humoris dan disukai banyak orang.",
      tantangan: "Sering overthinking, mudah gelisah, kadang terlalu mengkritik.",
      karir: "Peneliti, jurnalis, pengacara, konsultan, guru, youtuber.",
      cinta: "Anda butuh pasangan yang bisa diajak diskusi mendalam. Otak adalah organ paling seksi bagi Anda.",
      pesan: "Berikan ruang bagi pikiranmu untuk beristirahat. Tidak semua masalah harus segera dipecahkan.",
    },
    en: {
      nama: "Yellow",
      deskripsi: "Yellow aura is the color of intelligence, happiness, and communication. You have a sharp mind and captivating communication skills.",
      karakter: "Intelligent, communicative, cheerful, analytical, curious.",
      kekuatan: "Fast learner, good problem solver, humorous and well-liked.",
      tantangan: "Often overthinking, easily restless, sometimes too critical.",
      karir: "Researcher, journalist, lawyer, consultant, teacher, YouTuber.",
      cinta: "You need a partner who can engage in deep discussions. The brain is the sexiest organ to you.",
      pesan: "Give your mind room to rest. Not every problem needs to be solved immediately.",
    },
    es: {
      nama: "Amarillo",
      deskripsi: "El aura amarilla es el color de la inteligencia, la felicidad y la comunicación. Tienes una mente aguda y habilidades de comunicación cautivadoras.",
      karakter: "Inteligente, comunicativo, alegre, analítico, curioso.",
      kekuatan: "Aprendizaje rápido, buen solucionador de problemas, humorístico y querido.",
      tantangan: "A menudo piensa demasiado, se inquieta fácilmente, a veces demasiado crítico.",
      karir: "Investigador, periodista, abogado, consultor, profesor, YouTuber.",
      cinta: "Necesitas una pareja que pueda entablar discusiones profundas. El cerebro es el órgano más sexy para ti.",
      pesan: "Da a tu mente espacio para descansar. No todos los problemas necesitan resolverse de inmediato.",
    },
  },
  Hijau: {
    id: {
      nama: "Hijau",
      deskripsi: "Aura hijau adalah warna keseimbangan, penyembuhan, dan pertumbuhan. Anda adalah pribadi yang menenangkan dan membawa kedamaian bagi sekitar.",
      karakter: "Penyayang, sabar, harmonis, setia, dan suka menolong.",
      kekuatan: "Empati tinggi, pendengar yang baik, mudah memaafkan.",
      tantangan: "Terlalu mengorbankan diri, sulit berkata tidak, kadang pasif.",
      karir: "Dokter, perawat, psikolog, konselor, guru, petani, pekerja lingkungan.",
      cinta: "Anda mencintai dengan lembut dan tulus. Pasangan Anda akan merasa sangat dihargai dan diperhatikan.",
      pesan: "Jangan lupa merawat diri sendiri, sama seperti Anda merawat orang lain.",
    },
    en: {
      nama: "Green",
      deskripsi: "Green aura is the color of balance, healing, and growth. You are a calming presence and bring peace to those around you.",
      karakter: "Loving, patient, harmonious, loyal, and helpful.",
      kekuatan: "High empathy, good listener, forgiving.",
      tantangan: "Over-sacrificing, difficulty saying no, sometimes passive.",
      karir: "Doctor, nurse, psychologist, counselor, teacher, farmer, environmental worker.",
      cinta: "You love gently and sincerely. Your partner will feel very valued and cared for.",
      pesan: "Don't forget to take care of yourself, just as you take care of others.",
    },
    es: {
      nama: "Verde",
      deskripsi: "El aura verde es el color del equilibrio, la sanación y el crecimiento. Eres una presencia calmante y traes paz a quienes te rodean.",
      karakter: "Amoroso, paciente, armonioso, leal y servicial.",
      kekuatan: "Alta empatía, buen oyente, indulgente.",
      tantangan: "Sobresacrificio, dificultad para decir no, a veces pasivo.",
      karir: "Médico, enfermero, psicólogo, consejero, maestro, agricultor, trabajador ambiental.",
      cinta: "Amas con suavidad y sinceridad. Tu pareja se sentirá muy valorada y cuidada.",
      pesan: "No olvides cuidarte a ti mismo, igual que cuidas a los demás.",
    },
  },
  Biru: {
    id: {
      nama: "Biru",
      deskripsi: "Aura biru adalah warna ketenangan, kebijaksanaan, dan spiritualitas. Anda memiliki kedalaman batin yang luar biasa dan mampu menenangkan badai di sekitar.",
      karakter: "Tenang, bijaksana, intuitif, jujur, dan spiritual.",
      kekuatan: "Pemikir kritis, dapat diandalkan, pandai menjaga rahasia.",
      tantangan: "Terlalu kaku, susah bergaul dengan orang baru, kadang dingin.",
      karir: "Hakim, peneliti, programmer, arsitek, filsuf, pemuka agama.",
      cinta: "Anda butuh pasangan yang bisa diajak berdiskusi tentang makna hidup. Cinta bagi Anda adalah pertemuan jiwa.",
      pesan: "Izinkan dirimu untuk bersikap fleksibel. Tidak semua hal harus hitam putih.",
    },
    en: {
      nama: "Blue",
      deskripsi: "Blue aura is the color of calmness, wisdom, and spirituality. You have remarkable inner depth and can calm storms around you.",
      karakter: "Calm, wise, intuitive, honest, and spiritual.",
      kekuatan: "Critical thinker, reliable, good at keeping secrets.",
      tantangan: "Too rigid, hard to socialize with new people, sometimes cold.",
      karir: "Judge, researcher, programmer, architect, philosopher, religious leader.",
      cinta: "You need a partner who can discuss the meaning of life with you. Love for you is a meeting of souls.",
      pesan: "Allow yourself to be flexible. Not everything is black and white.",
    },
    es: {
      nama: "Azul",
      deskripsi: "El aura azul es el color de la calma, la sabiduría y la espiritualidad. Tienes una profundidad interior notable y puedes calmar tormentas a tu alrededor.",
      karakter: "Tranquilo, sabio, intuitivo, honesto y espiritual.",
      kekuatan: "Pensador crítico, confiable, bueno guardando secretos.",
      tantangan: "Demasiado rígido, difícil socializar con gente nueva, a veces frío.",
      karir: "Juez, investigador, programador, arquitecto, filósofo, líder religioso.",
      cinta: "Necesitas una pareja que pueda discutir el sentido de la vida contigo. El amor para ti es un encuentro de almas.",
      pesan: "Permítete ser flexible. No todo es blanco y negro.",
    },
  },
  Ungu: {
    id: {
      nama: "Ungu",
      deskripsi: "Aura ungu adalah warna spiritualitas, intuisi, dan kebijaksanaan tingkat tinggi. Anda terhubung dengan alam semesta secara mendalam.",
      karakter: "Intuitif, mistis, kreatif, visioner, dan karismatik.",
      kekuatan: "Membaca situasi dengan tepat, inspiratif, daya tarik kuat.",
      tantangan: "Mudah cemas, overthinking, kadang merasa tidak dipahami.",
      karir: "Seniman, motivator, konselor spiritual, pemimpin retreat, penulis.",
      cinta: "Anda mencari pasangan yang juga memiliki kedalaman spiritual. Cinta sejati adalah perjalanan jiwa.",
      pesan: "Percayalah pada intuisimu, tapi jangan lupa untuk tetap grounded.",
    },
    en: {
      nama: "Purple",
      deskripsi: "Purple aura is the color of spirituality, intuition, and high wisdom. You are deeply connected to the universe.",
      karakter: "Intuitive, mystical, creative, visionary, charismatic.",
      kekuatan: "Reads situations accurately, inspirational, strong charisma.",
      tantangan: "Easily anxious, overthinking, sometimes feels misunderstood.",
      karir: "Artist, motivator, spiritual counselor, retreat leader, writer.",
      cinta: "You seek a partner who also has spiritual depth. True love is a soul journey.",
      pesan: "Trust your intuition, but don't forget to stay grounded.",
    },
    es: {
      nama: "Morado",
      deskripsi: "El aura morada es el color de la espiritualidad, la intuición y la alta sabiduría. Estás profundamente conectado con el universo.",
      karakter: "Intuitivo, místico, creativo, visionario, carismático.",
      kekuatan: "Lee las situaciones con precisión, inspirador, fuerte carisma.",
      tantangan: "Se ansía fácilmente, piensa demasiado, a veces se siente incomprendido.",
      karir: "Artista, motivador, consejero espiritual, líder de retiros, escritor.",
      cinta: "Buscas una pareja que también tenga profundidad espiritual. El amor verdadero es un viaje del alma.",
      pesan: "Confía en tu intuición, pero no olvides mantener los pies en la tierra.",
    },
  },
  Putih: {
    id: {
      nama: "Putih",
      deskripsi: "Aura putih adalah warna kemurnian, perlindungan, dan pencerahan. Anda memiliki hati yang bersih dan niat yang tulus.",
      karakter: "Tulus, jujur, damai, penolong, dan berpikiran terbuka.",
      kekuatan: "Mudah memaafkan, sangat intuitif, membawa kedamaian.",
      tantangan: "Terlalu naif, mudah dimanfaatkan, kadang terlalu idealis.",
      karir: "Pekerja sosial, pemuka agama, terapis, aktivis kemanusiaan.",
      cinta: "Anda mencintai tanpa syarat, terkadang sampai lupa diri. Butuh pasangan yang juga tulus.",
      pesan: "Kemurnian hatimu adalah anugerah, tapi tetap jaga batasan agar tidak terluka.",
    },
    en: {
      nama: "White",
      deskripsi: "White aura is the color of purity, protection, and enlightenment. You have a clean heart and sincere intentions.",
      karakter: "Sincere, honest, peaceful, helpful, open-minded.",
      kekuatan: "Easy to forgive, highly intuitive, brings peace.",
      tantangan: "Too naive, easily taken advantage of, sometimes too idealistic.",
      karir: "Social worker, religious leader, therapist, humanitarian activist.",
      cinta: "You love unconditionally, sometimes forgetting yourself. Need a partner who is also sincere.",
      pesan: "Your purity of heart is a gift, but maintain boundaries to avoid being hurt.",
    },
    es: {
      nama: "Blanco",
      deskripsi: "El aura blanca es el color de la pureza, la protección y la iluminación. Tienes un corazón limpio e intenciones sinceras.",
      karakter: "Sincero, honesto, pacífico, servicial, de mente abierta.",
      kekuatan: "Fácil de perdonar, muy intuitivo, trae paz.",
      tantangan: "Demasiado ingenuo, fácilmente aprovechado, a veces demasiado idealista.",
      karir: "Trabajador social, líder religioso, terapeuta, activista humanitario.",
      cinta: "Amas incondicionalmente, a veces olvidándote de ti mismo. Necesitas una pareja que también sea sincera.",
      pesan: "Tu pureza de corazón es un regalo, pero mantén límites para no lastimarte.",
    },
  },
  Hitam: {
    id: {
      nama: "Hitam",
      deskripsi: "Aura hitam melambangkan misteri, kekuatan, dan perlindungan. Anda memiliki ketahanan mental yang luar biasa dan mampu bangkit dari keterpurukan.",
      karakter: "Misterius, kuat, mandiri, protektif, dan sangat tangguh.",
      kekuatan: "Tidak mudah goyah, bisa diandalkan dalam krisis, keputusan tegas.",
      tantangan: "Sulit terbuka, kadang terlalu defensif, terlihat dingin.",
      karir: "Detektif, investigator, manajer krisis, arkeolog, penulis novel misteri.",
      cinta: "Anda butuh pasangan yang sabar dan mau menembus tembok pertahanan Anda. Sekali terbuka, Anda sangat setia.",
      pesan: "Kekuatanmu adalah perisai, tapi jangan biarkan ia menjadi tembok yang mengurung.",
    },
    en: {
      nama: "Black",
      deskripsi: "Black aura symbolizes mystery, strength, and protection. You have extraordinary mental resilience and can rise from adversity.",
      karakter: "Mysterious, strong, independent, protective, and very tough.",
      kekuatan: "Unwavering, reliable in crisis, decisive.",
      tantangan: "Hard to open up, sometimes too defensive, appears cold.",
      karir: "Detective, investigator, crisis manager, archaeologist, mystery novel writer.",
      cinta: "You need a patient partner willing to break through your defenses. Once open, you are fiercely loyal.",
      pesan: "Your strength is a shield, but don't let it become a wall that imprisons you.",
    },
    es: {
      nama: "Negro",
      deskripsi: "El aura negra simboliza misterio, fuerza y protección. Tienes una resiliencia mental extraordinaria y puedes levantarte de la adversidad.",
      karakter: "Misterioso, fuerte, independiente, protector y muy duro.",
      kekuatan: "Inquebrantable, confiable en crisis, decisivo.",
      tantangan: "Difícil abrirse, a veces demasiado defensivo, parece frío.",
      karir: "Detective, investigador, gestor de crisis, arqueólogo, escritor de novelas de misterio.",
      cinta: "Necesitas una pareja paciente que esté dispuesta a atravesar tus defensas. Una vez abierto, eres ferozmente leal.",
      pesan: "Tu fuerza es un escudo, pero no dejes que se convierta en un muro que te aprisione.",
    },
  },
  Emas: {
    id: {
      nama: "Emas",
      deskripsi: "Aura emas adalah warna kelimpahan, kebijaksanaan, dan pencapaian tertinggi. Anda memiliki potensi untuk mencapai hal-hal luar biasa dalam hidup.",
      karakter: "Berwibawa, bijaksana, murah hati, percaya diri, dan sukses.",
      kekuatan: "Kepemimpinan alami, kemampuan menginspirasi, kemakmuran.",
      tantangan: "Bisa menjadi sombong, terlalu materialistis, lupa bersyukur.",
      karir: "CEO, pemimpin spiritual, filantropis, pengusaha sukses, duta besar.",
      cinta: "Anda mencari pasangan yang juga memiliki visi besar dan bisa menjadi mitra sejajar.",
      pesan: "Kesuksesan sejati adalah saat bisa berbagi cahayamu dengan orang lain.",
    },
    en: {
      nama: "Gold",
      deskripsi: "Gold aura is the color of abundance, wisdom, and highest achievement. You have the potential to achieve extraordinary things in life.",
      karakter: "Authoritative, wise, generous, confident, and successful.",
      kekuatan: "Natural leadership, ability to inspire, prosperity.",
      tantangan: "Can be arrogant, too materialistic, forgets to be grateful.",
      karir: "CEO, spiritual leader, philanthropist, successful entrepreneur, ambassador.",
      cinta: "You seek a partner who also has a great vision and can be an equal partner.",
      pesan: "True success is when you can share your light with others.",
    },
    es: {
      nama: "Oro",
      deskripsi: "El aura dorada es el color de la abundancia, la sabiduría y el mayor logro. Tienes el potencial de lograr cosas extraordinarias en la vida.",
      karakter: "Autoritario, sabio, generoso, seguro y exitoso.",
      kekuatan: "Liderazgo natural, capacidad de inspirar, prosperidad.",
      tantangan: "Puede ser arrogante, demasiado materialista, olvida ser agradecido.",
      karir: "CEO, líder espiritual, filántropo, empresario exitoso, embajador.",
      cinta: "Buscas una pareja que también tenga una gran visión y pueda ser un socio igualitario.",
      pesan: "El verdadero éxito es cuando puedes compartir tu luz con los demás.",
    },
  },
  Perak: {
    id: {
      nama: "Perak",
      deskripsi: "Aura perak adalah warna inti, kemurnian batin, dan koneksi dengan alam semesta. Anda memiliki intuisi yang sangat tajam.",
      karakter: "Intuitif, fleksibel, kreatif, sensitif, dan visioner.",
      kekuatan: "Membaca energi, kemampuan adaptasi tinggi, pandai memediasi.",
      tantangan: "Moody, mudah terpengaruh, kadang kurang percaya diri.",
      karir: "Konsultan, mediator, penasihat spiritual, desainer, musisi.",
      cinta: "Anda butuh pasangan yang menghargai kepekaan Anda dan tidak menuntut terlalu banyak.",
      pesan: "Percayalah pada kemampuannya membaca situasi. Tapi jangan ragu meminta pendapat orang lain.",
    },
    en: {
      nama: "Silver",
      deskripsi: "Silver aura is the color of core, inner purity, and connection with the universe. You have very sharp intuition.",
      karakter: "Intuitive, flexible, creative, sensitive, and visionary.",
      kekuatan: "Reads energy, high adaptability, good at mediating.",
      tantangan: "Moody, easily influenced, sometimes lacks confidence.",
      karir: "Consultant, mediator, spiritual advisor, designer, musician.",
      cinta: "You need a partner who appreciates your sensitivity and doesn't demand too much.",
      pesan: "Trust your ability to read situations. But don't hesitate to ask for others' opinions.",
    },
    es: {
      nama: "Plata",
      deskripsi: "El aura plateada es el color del núcleo, la pureza interior y la conexión con el universo. Tienes una intuición muy aguda.",
      karakter: "Intuitivo, flexible, creativo, sensible y visionario.",
      kekuatan: "Lee energías, alta adaptabilidad, bueno mediando.",
      tantangan: "Cambiante, fácilmente influenciable, a veces falta confianza.",
      karir: "Consultor, mediador, asesor espiritual, diseñador, músico.",
      cinta: "Necesitas una pareja que aprecie tu sensibilidad y no exija demasiado.",
      pesan: "Confía en tu capacidad para leer situaciones. Pero no dudes en pedir la opinión de los demás.",
    },
  },
  "Merah Muda": {
    id: {
      nama: "Merah Muda",
      deskripsi: "Aura merah muda adalah warna cinta tanpa syarat, kelembutan, dan penerimaan. Anda memancarkan kasih sayang yang menenangkan.",
      karakter: "Penyayang, lembut, romantis, pemaaf, dan suka menolong.",
      kekuatan: "Membuat orang merasa nyaman, mudah memaafkan, sangat setia.",
      tantangan: "Terlalu naif, mudah dimanfaatkan, kadang kurang tegas.",
      karir: "Konselor, perawat, guru PAUD, pekerja sosial, terapis seni.",
      cinta: "Anda adalah pasangan impian bagi yang mencari kehangatan. Tapi jangan sampai cinta buta.",
      pesan: "Cintailah dirimu sendiri seperti kau mencintai orang lain.",
    },
    en: {
      nama: "Pink",
      deskripsi: "Pink aura is the color of unconditional love, gentleness, and acceptance. You radiate calming affection.",
      karakter: "Loving, gentle, romantic, forgiving, and helpful.",
      kekuatan: "Makes people feel comfortable, easy to forgive, very loyal.",
      tantangan: "Too naive, easily taken advantage of, sometimes lacks assertiveness.",
      karir: "Counselor, nurse, preschool teacher, social worker, art therapist.",
      cinta: "You are the dream partner for those seeking warmth. But don't fall into blind love.",
      pesan: "Love yourself as you love others.",
    },
    es: {
      nama: "Rosa",
      deskripsi: "El aura rosa es el color del amor incondicional, la ternura y la aceptación. Irradias un afecto calmante.",
      karakter: "Amoroso, gentil, romántico, indulgente y servicial.",
      kekuatan: "Hace sentir cómodas a las personas, fácil de perdonar, muy leal.",
      tantangan: "Demasiado ingenuo, fácilmente aprovechado, a veces le falta asertividad.",
      karir: "Consejero, enfermero, maestro de preescolar, trabajador social, terapeuta de arte.",
      cinta: "Eres la pareja soñada para quienes buscan calidez. Pero no caigas en el amor ciego.",
      pesan: "Ámate a ti mismo como amas a los demás.",
    },
  },
};

// Daftar warna aura (urutan tetap untuk algoritma)
const AURA_COLORS = ["Merah", "Jingga", "Kuning", "Hijau", "Biru", "Ungu", "Putih", "Hitam", "Emas", "Perak", "Merah Muda"];

// Fungsi deterministik dari nama
function getAuraFromName(name: string): string {
  let hash = 0;
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  return AURA_COLORS[Math.abs(hash) % AURA_COLORS.length];
}

// Fungsi deterministik dari tanggal lahir
function getAuraFromDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const sum = day + month + year;
  return AURA_COLORS[sum % AURA_COLORS.length];
}

// Helper gradient background (sama seperti di ArahRezeki)
const getBgGradient = (aura: string): string => {
  const gradients: Record<string, string> = {
    Merah: "from-red-500/30 to-red-600/20",
    Jingga: "from-orange-500/30 to-orange-600/20",
    Kuning: "from-yellow-500/30 to-amber-500/20",
    Hijau: "from-green-500/30 to-emerald-600/20",
    Biru: "from-blue-500/30 to-cyan-600/20",
    Ungu: "from-purple-500/30 to-indigo-600/20",
    Putih: "from-white/30 to-slate-400/20",
    Hitam: "from-black/50 to-slate-800/30",
    Emas: "from-yellow-600/30 to-amber-700/20",
    Perak: "from-gray-400/30 to-slate-500/20",
    "Merah Muda": "from-pink-400/30 to-rose-500/20",
  };
  return gradients[aura] || "from-slate-500/30 to-slate-600/20";
};

// Komponen utama
export default function AuraColor() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [inputType, setInputType] = useState<"name" | "date">("name");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [resultAura, setResultAura] = useState<string | null>(null);

  // Data aura yang sudah sesuai bahasa
  const auraData = useMemo(() => {
    if (!resultAura) return null;
    const dataPerLang = AURA_DATA_ML[resultAura];
    return dataPerLang ? dataPerLang[lang] : dataPerLang?.["id"];
  }, [resultAura, lang]);

  const handleAnalyze = () => {
    if (inputType === "name" && !name.trim()) return;
    if (inputType === "date" && !date) return;
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      let aura = "";
      if (inputType === "name") aura = getAuraFromName(name);
      else aura = getAuraFromDate(date);
      setResultAura(aura);
      setAnalyzed(true);
      setLoading(false);
    }, 800);
  };

  const handleShare = async () => {
    if (!resultAura || !auraData) return;
    const text = `${dict.title}: ${auraData.nama}\n${auraData.deskripsi.substring(0, 100)}...\n\n${dict.labels.karakter}: ${auraData.karakter}\n${dict.labels.pesan}: ${auraData.pesan}\n\n${dict.labels.disclaimer}`;
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
        <div className="text-6xl mb-2">🌈✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        
      </div>

      {/* Input Section */}
      <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
        <div className="flex gap-2 mb-4 bg-black/30 p-1 rounded-xl">
          <button
            onClick={() => setInputType("name")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              inputType === "name"
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "hover:bg-white/10"
            }`}
          >
            {dict.inputs.nameTab}
          </button>
          <button
            onClick={() => setInputType("date")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              inputType === "date"
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "hover:bg-white/10"
            }`}
          >
            {dict.inputs.dateTab}
          </button>
        </div>

        {inputType === "name" ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.inputs.namePlaceholder}
            className="w-full bg-slate-900/60 border border-purple-500/30 rounded-xl px-5 py-3 text-center focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-purple-300 text-xs font-bold px-1 uppercase tracking-widest">
              {dict.inputs.dateLabel}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900/60 border border-purple-500/30 rounded-xl px-5 py-3 text-center [color-scheme:dark] focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || (inputType === "name" ? !name : !date)}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          {loading ? dict.inputs.computing : dict.inputs.analyze}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-12 flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-purple-400 text-xs font-mono tracking-widest animate-pulse">
            COMPUTING...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !analyzed && (
        <div className="mt-8 text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-300 text-sm">{dict.inputs.emptyMessage}</p>
        </div>
      )}

      {/* Results */}
      {!loading && analyzed && resultAura && auraData && (
        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Main Card */}
          <div
            className={`relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl bg-gradient-to-br ${getBgGradient(
              resultAura
            )}`}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${getBgGradient(
                  resultAura
                )} shadow-[0_0_30px_rgba(0,0,0,0.5)] shrink-0 border-4 border-slate-900`}
              >
                <span className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                  {auraData.nama.substring(0, 3)}
                </span>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-black bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
                  {auraData.nama}
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed mb-3">{auraData.deskripsi}</p>
              </div>
            </div>
          </div>

          {/* Detailed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎭</span>
                <h4 className="font-bold text-purple-200">{dict.labels.karakter}</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{auraData.karakter}</p>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✨</span>
                <h4 className="font-bold text-emerald-300">{dict.labels.kekuatan}</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{auraData.kekuatan}</p>
            </div>
            <div className="bg-rose-950/30 backdrop-blur-md border border-rose-900/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <h4 className="font-bold text-rose-300">{dict.labels.tantangan}</h4>
              </div>
              <p className="text-rose-200/70 text-sm leading-relaxed">{auraData.tantangan}</p>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-md border border-blue-900/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💼</span>
                <h4 className="font-bold text-blue-300">{dict.labels.karir}</h4>
              </div>
              <p className="text-blue-200/70 text-sm leading-relaxed">{auraData.karir}</p>
            </div>
            <div className="bg-pink-950/30 backdrop-blur-md border border-pink-900/50 rounded-2xl p-5 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">❤️</span>
                <h4 className="font-bold text-pink-300">{dict.labels.cinta}</h4>
              </div>
              <p className="text-pink-200/70 text-sm leading-relaxed">{auraData.cinta}</p>
            </div>
          </div>

          {/* Pesan & Quote */}
          <div className="text-center p-5 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/30">
            <p className="text-amber-200 text-sm font-medium italic">
              💬 {dict.labels.pesan}: "{auraData.pesan}"
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
            <p className="text-purple-200 text-sm font-medium italic">"{dict.labels.quote}"</p>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-[10px] text-slate-500 pt-3 opacity-70 border-t border-slate-800">
            {dict.labels.disclaimer}
          </div>

          {/* INJEKSI PAYWALL */}
          
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
            resultId={resultAura} 
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
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