"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PremiumPaywall from "../PremiumPaywall";

// ========== MULTI-LANGUAGE DICTIONARY ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Primbon Jodoh Jawa",
    badge: "Ultra Premium",
    subtitle: "Hitung kecocokan weton berdasarkan neptu hari & pasaran. Perpaduan primbon klasik dan kearifan lokal.",
    shareBtn: "Bagikan",
    inputs: {
      groomLabel: "🪔 Weton 1 (Anda)",
      brideLabel: "💖 Weton 2 (Pasangan)",
      analyze: "🔮 Hitung Kecocokan Jodoh 🔮",
      computing: "Menghitung Neptu & Kecocokan...",
      emptyMessage: "Pilih weton kedua calon mempelai untuk melihat hasil kecocokan.",
    },
    labels: {
      totalNeptu: "Total Neptu",
      remainder: "Sisa bagi 7",
      ritual: "Ritual & Saran Perbaikan",
      ritualLabel: "Ritual tradisional",
      solutionLabel: "Solusi modern",
      color: "Warna",
      element: "Elemen",
      vibe: "Getaran",
      specialRitual: "Ruwatan Khusus untuk Sisa 4 (Pati)",
      important: "🔔 Penting",
      disclaimer: "*Primbon berdasarkan kitab Primbon Betaljemur Adammakna. Hasil bersifat reflektif. Doa dan usaha tetap utama.",
      quote: "Primbon adalah petunjuk, bukan hukum mati. Banyak pasangan dengan hasil 'Pati' yang justru langgeng karena kesadaran dan usaha.",
    },
    sisaMeanings: {
      0: { title: "🌾 SANDANG", shortDesc: "Sangat Baik – kehidupan berkecukupan, sandang pangan melimpah." },
      1: { title: "🍚 PANGAN", shortDesc: "Baik – rezeki melimpah, namun waspadai kesombongan." },
      2: { title: "💖 CINTA", shortDesc: "Cukup – hubungan penuh kasih, tapi rawan masalah ekonomi." },
      3: { title: "🕯️ LARA", shortDesc: "Kurang – sering sakit-sakitan atau konflik batin." },
      4: { title: "⚰️ PATI", shortDesc: "Buruk (rawan) – potensi perceraian, kematian, atau bencana rumah tangga." },
      5: { title: "🛡️ PESTHI", shortDesc: "Sangat Baik – rukun, damai, dan panjang umur." },
      6: { title: "🌾 LUMBUNG", shortDesc: "Cukup – rezeki berlimpah tapi butuh usaha ekstra menjaga keharmonisan." },
    },
  },
  en: {
    title: "Javanese Primbon Matchmaking",
    badge: "Ultra Premium",
    subtitle: "Calculate weton compatibility based on birth day & Javanese pasaran. Blend of classic primbon and local wisdom.",
    shareBtn: "Share",
    inputs: {
      groomLabel: "🪔 Weton 1 (You)",
      brideLabel: "💖 Weton 2 (Partner)",
      analyze: "🔮 Calculate Compatibility 🔮",
      computing: "Calculating Neptu & Compatibility...",
      emptyMessage: "Select both partners' weton to see compatibility results.",
    },
    labels: {
      totalNeptu: "Total Neptu",
      remainder: "Remainder of 7",
      ritual: "Ritual & Improvement Advice",
      ritualLabel: "Traditional ritual",
      solutionLabel: "Modern solution",
      color: "Color",
      element: "Element",
      vibe: "Vibration",
      specialRitual: "Special Ritual for Remainder 4 (Pati)",
      important: "🔔 Important",
      disclaimer: "*Primbon based on Betaljemur Adammakna scripture. Results are reflective. Prayer and effort remain paramount.",
      quote: "Primbon is a guide, not absolute law. Many couples with 'Pati' result stay strong because of awareness and effort.",
    },
    sisaMeanings: {
      0: { title: "🌾 SANDANG", shortDesc: "Very Good – abundant life, sufficient clothing and food." },
      1: { title: "🍚 PANGAN", shortDesc: "Good – abundant sustenance, but beware of arrogance." },
      2: { title: "💖 CINTA", shortDesc: "Fair – loving relationship, but prone to financial issues." },
      3: { title: "🕯️ LARA", shortDesc: "Poor – often sick or inner conflict." },
      4: { title: "⚰️ PATI", shortDesc: "Bad (risky) – potential divorce, death, or household disaster." },
      5: { title: "🛡️ PESTHI", shortDesc: "Very Good – harmonious, peaceful, long life." },
      6: { title: "🌾 LUMBUNG", shortDesc: "Fair – abundant wealth but need extra effort to maintain harmony." },
    },
  },
  es: {
    title: "Compatibilidad Primbon Javanés",
    badge: "Ultra Premium",
    subtitle: "Calcula la compatibilidad de weton basada en día de nacimiento y pasaran javanés. Mezcla de primbon clásico y sabiduría local.",
    shareBtn: "Compartir",
    inputs: {
      groomLabel: "🪔 Weton 1 (Tú)",
      brideLabel: "💖 Weton 2 (Pareja)",
      analyze: "🔮 Calcular Compatibilidad 🔮",
      computing: "Calculando Neptu y Compatibilidad...",
      emptyMessage: "Selecciona el weton de ambos para ver los resultados de compatibilidad.",
    },
    labels: {
      totalNeptu: "Neptu Total",
      remainder: "Resto de 7",
      ritual: "Ritual y Consejos de Mejora",
      ritualLabel: "Ritual tradicional",
      solutionLabel: "Solución moderna",
      color: "Color",
      element: "Elemento",
      vibe: "Vibración",
      specialRitual: "Ritual Especial para Resto 4 (Pati)",
      important: "🔔 Importante",
      disclaimer: "*Primbon basado en el manuscrito Betaljemur Adammakna. Los resultados son reflexivos. La oración y el esfuerzo siguen siendo primordiales.",
      quote: "El primbon es una guía, no una ley absoluta. Muchas parejas con resultado 'Pati' se mantienen fuertes gracias a la conciencia y el esfuerzo.",
    },
    sisaMeanings: {
      0: { title: "🌾 SANDANG", shortDesc: "Muy Bueno – vida abundante, comida y ropa suficientes." },
      1: { title: "🍚 PANGAN", shortDesc: "Bueno – sustento abundante, pero cuidado con la arrogancia." },
      2: { title: "💖 CINTA", shortDesc: "Regular – relación amorosa, pero propensa a problemas financieros." },
      3: { title: "🕯️ LARA", shortDesc: "Malo – a menudo enfermo o conflicto interno." },
      4: { title: "⚰️ PATI", shortDesc: "Malo (riesgoso) – posible divorcio, muerte o desastre doméstico." },
      5: { title: "🛡️ PESTHI", shortDesc: "Muy Bueno – armonioso, pacífico, vida larga." },
      6: { title: "🌾 LUMBUNG", shortDesc: "Regular – abundancia de riqueza pero se necesita esfuerzo extra para mantener la armonía." },
    },
  },
};

// ========== DATA HARI DAN PASARAN (tetap karena istilah lokal) ==========
const HARI_LIST = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PASARAN_LIST = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

const HARI_NILAI: Record<string, number> = {
  Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9
};

const PASARAN_NILAI: Record<string, number> = {
  Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8
};

// ========== MAKNA SISA BAGI 7 (MULTI-BAHASA) ==========
const SISA_MEANINGS_ML: Record<number, Record<string, any>> = {
  0: {
    id: {
      title: "🌾 SANDANG",
      shortDesc: "Sangat Baik – kehidupan berkecukupan, sandang pangan melimpah.",
      desc: "Pasangan dengan sisa 0 (Sandang) dipercaya akan hidup dalam kecukupan. Sandang artinya pakaian, melambangkan segala kebutuhan dasar yang mudah terpenuhi. Rezeki mengalir lancar, tidak pernah kesulitan dalam hal materi. Dalam rumah tangga, pasangan ini cenderung harmonis, saling mendukung, dan jarang terjadi perselisihan serius. Mereka akan dikaruniai keturunan yang baik dan kehidupan yang tenteram. Namun, waspadalah terhadap rasa cepat puas yang bisa membuat stagnasi. Teruslah bersyukur dan berkembang.",
      ritual: "Tidak ada ritual khusus yang diperlukan. Cukup perbanyak sedekah dan syukuran kecil setiap bulan.",
      solution: "Pertahankan komunikasi terbuka dan jangan lupa untuk terus merawat cinta dengan kejutan-kejutan kecil.",
      color: "Hijau & Emas",
      element: "Tanah",
      vibe: "Harmonis, Stabil, Berkah",
      quote: "🥥 'Kecukupan bukanlah akhir, melainkan awal untuk berbagi lebih banyak.'"
    },
    en: {
      title: "🌾 SANDANG (Clothing)",
      shortDesc: "Very Good – abundant life, sufficient clothing and food.",
      desc: "Couples with remainder 0 (Sandang) are believed to live in sufficiency. Sandang means clothing, symbolizing all basic needs easily met. Fortune flows smoothly, never struggling materially. In household, they tend to be harmonious, supportive, and rarely have serious conflicts. They will be blessed with good offspring and a peaceful life. However, beware of complacency that can cause stagnation. Keep being grateful and growing.",
      ritual: "No special ritual needed. Just increase charity and small thanksgiving each month.",
      solution: "Maintain open communication and don't forget to nurture love with small surprises.",
      color: "Green & Gold",
      element: "Earth",
      vibe: "Harmonious, Stable, Blessed",
      quote: "🥥 'Sufficiency is not an end, but a beginning to share more.'"
    },
    es: {
      title: "🌾 SANDANG (Ropa)",
      shortDesc: "Muy Bueno – vida abundante, comida y ropa suficientes.",
      desc: "Se cree que las parejas con resto 0 (Sandang) viven en suficiencia. Sandang significa ropa, simbolizando todas las necesidades básicas fácilmente satisfechas. La fortuna fluye sin problemas, nunca luchan materialmente. En el hogar, tienden a ser armoniosos, solidarios y rara vez tienen conflictos graves. Serán bendecidos con buena descendencia y una vida pacífica. Sin embargo, cuidado con la complacencia que puede causar estancamiento. Sigan agradecidos y creciendo.",
      ritual: "No se necesita un ritual especial. Solo aumenten la caridad y pequeñas acciones de gracias cada mes.",
      solution: "Mantengan una comunicación abierta y no olviden alimentar el amor con pequeñas sorpresas.",
      color: "Verde & Oro",
      element: "Tierra",
      vibe: "Armonioso, Estable, Bendecido",
      quote: "🥥 'La suficiencia no es un fin, sino un comienzo para compartir más.'"
    },
  },
  1: {
    id: {
      title: "🍚 PANGAN",
      shortDesc: "Baik – rezeki melimpah, namun waspadai kesombongan.",
      desc: "Sisa 1 (Pangan) adalah pertanda baik. Pangan artinya makanan, menandakan pasangan ini tidak akan pernah kelaparan. Rezeki datang dari berbagai arah, usaha yang dijalankan cenderung lancar. Namun, ada potensi kesombongan atau sifat pamer yang bisa mengundang iri hati. Dalam rumah tangga, hubungan cukup harmonis asal kedua pihak tidak terlalu egois. Mereka juga mudah mendapat pertolongan saat kesusahan. Hati-hati dengan sikap boros.",
      ritual: "Disarankan melakukan selamatan tahunan, bagi-bagi makanan kepada tetangga atau anak yatim untuk menolak kesombongan.",
      solution: "Perbanyak rasa syukur, hindari berhutang untuk hal konsumtif, dan tanamkan sikap rendah hati.",
      color: "Kuning & Oranye",
      element: "Api",
      vibe: "Berkah, Berlimpah, Waspada Ego",
      quote: "🍛 'Rezeki yang melimpah harus dibagi, bukan disimpan dalam gudang keserakahan.'"
    },
    en: {
      title: "🍚 PANGAN (Food)",
      shortDesc: "Good – abundant sustenance, but beware of arrogance.",
      desc: "Remainder 1 (Pangan) is a good sign. Pangan means food, indicating this couple will never go hungry. Fortune comes from various directions, their endeavors tend to be smooth. However, there is potential for arrogance or showing off that can invite envy. In household, the relationship is quite harmonious as long as both are not too selfish. They also easily get help when in trouble. Beware of wasteful spending.",
      ritual: "It is recommended to hold an annual selamatan, sharing food with neighbors or orphans to ward off arrogance.",
      solution: "Increase gratitude, avoid debt for consumptive things, and cultivate humility.",
      color: "Yellow & Orange",
      element: "Fire",
      vibe: "Blessed, Abundant, Beware Ego",
      quote: "🍛 'Abundant sustenance must be shared, not stored in the warehouse of greed.'"
    },
    es: {
      title: "🍚 PANGAN (Comida)",
      shortDesc: "Bueno – sustento abundante, pero cuidado con la arrogancia.",
      desc: "El resto 1 (Pangan) es una buena señal. Pangan significa comida, indicando que esta pareja nunca pasará hambre. La fortuna viene de varias direcciones, sus emprendimientos tienden a ser fluidos. Sin embargo, hay potencial de arrogancia o presumir que puede invitar a la envidia. En el hogar, la relación es bastante armoniosa siempre que ambos no sean demasiado egoístas. También obtienen ayuda fácilmente cuando están en problemas. Cuidado con los gastos derrochadores.",
      ritual: "Se recomienda realizar una selamatan anual, compartir comida con vecinos o huérfanos para alejar la arrogancia.",
      solution: "Aumenta la gratitud, evita deudas por cosas consumistas y cultiva la humildad.",
      color: "Amarillo & Naranja",
      element: "Fuego",
      vibe: "Bendecido, Abundante, Cuidado con el Ego",
      quote: "🍛 'El sustento abundante debe compartirse, no almacenarse en el almacén de la codicia.'"
    },
  },
  2: {
    id: {
      title: "💖 CINTA",
      shortDesc: "Cukup – hubungan penuh kasih, tapi rawan masalah ekonomi.",
      desc: "Sisa 2 (Cinta) menunjukkan hubungan yang sangat romantis dan penuh kasih sayang. Pasangan ini saling memuja dan selalu berusaha menyenangkan satu sama lain. Namun, kelemahan biasanya ada pada bidang finansial: sering kesulitan mengatur keuangan, boros untuk kesenangan sesaat, atau penghasilan tidak stabil. Jika tidak dikelola dengan baik, masalah ekonomi bisa memicu pertengkaran. Sebaliknya, jika keduanya pandai mengatur uang, hubungan ini akan sangat bahagia.",
      ritual: "Disarankan ritual 'Tumbuk Tepung' atau melakukan usaha bersama (misal berdagang kecil-kecilan) untuk memperkuat rezeki.",
      solution: "Buat anggaran rumah tangga yang ketat, pisahkan uang kebutuhan dan hiburan. Saling ingatkan jika salah satu mulai boros.",
      color: "Merah Muda & Putih",
      element: "Air",
      vibe: "Romantis, Asmara, Tantangan Finansial",
      quote: "💞 'Cinta tanpa uang bagaikan perahu tanpa dayung. Nikmati rasa, tapi jangan lupa mencari rezeki.'"
    },
    en: {
      title: "💖 LOVE",
      shortDesc: "Fair – loving relationship, but prone to financial issues.",
      desc: "Remainder 2 (Love) indicates a very romantic and affectionate relationship. This couple adores each other and always tries to please one another. However, weakness is usually in the financial field: often difficulty managing money, wasteful spending on momentary pleasures, or unstable income. If not managed well, financial problems can trigger arguments. Conversely, if both are good at managing money, this relationship will be very happy.",
      ritual: "Suggested ritual 'Tumbuk Tepung' or doing business together (e.g., small trading) to strengthen fortune.",
      solution: "Create a strict household budget, separate needs and entertainment money. Remind each other if one starts being wasteful.",
      color: "Pink & White",
      element: "Water",
      vibe: "Romantic, Affectionate, Financial Challenge",
      quote: "💞 'Love without money is like a boat without oars. Enjoy the feeling, but don't forget to seek fortune.'"
    },
    es: {
      title: "💖 AMOR",
      shortDesc: "Regular – relación amorosa, pero propensa a problemas financieros.",
      desc: "El resto 2 (Amor) indica una relación muy romántica y afectuosa. Esta pareja se adora mutuamente y siempre trata de complacerse. Sin embargo, la debilidad suele estar en el ámbito financiero: a menudo dificultad para administrar el dinero, gastos derrochadores en placeres momentáneos o ingresos inestables. Si no se maneja bien, los problemas financieros pueden desencadenar discusiones. Por el contrario, si ambos son buenos administrando el dinero, esta relación será muy feliz.",
      ritual: "Se sugiere el ritual 'Tumbuk Tepung' o hacer negocios juntos (por ejemplo, pequeño comercio) para fortalecer la fortuna.",
      solution: "Crea un presupuesto doméstico estricto, separa el dinero para necesidades y entretenimiento. Recuérdense mutuamente si uno comienza a ser derrochador.",
      color: "Rosa & Blanco",
      element: "Agua",
      vibe: "Romántico, Afectuoso, Desafío Financiero",
      quote: "💞 'El amor sin dinero es como un barco sin remos. Disfruta el sentimiento, pero no olvides buscar fortuna.'"
    },
  },
  3: {
    id: {
      title: "🕯️ LARA",
      shortDesc: "Kurang – sering sakit-sakitan atau konflik batin.",
      desc: "Sisa 3 (Lara) artinya sakit atau nestapa. Pasangan dengan neptu bersisa 3 sering mengalami masalah kesehatan fisik atau mental. Bisa juga sering bertengkar karena hal sepele, stres, atau merasa tidak bahagia meski secara materi cukup. Lara bukan berarti selalu celaka, tapi perlu perhatian ekstra dalam menjaga kesehatan dan emosi. Masing-masing pihak cenderung sensitif dan mudah tersinggung. Jika tidak dikelola, rumah tangga bisa terasa berat.",
      ritual: "Ritual 'Tolak Lara' berupa mandi bersama dengan air kembang setaman (7 bunga) pada malam Jumat Kliwon, serta membaca doa tolak bala.",
      solution: "Rutin olahraga bersama, kelola stres dengan meditasi, dan jangan ragu konsultasi ke psikolog atau tokoh spiritual. Perkuat imun dengan makan sehat.",
      color: "Putih & Abu-abu",
      element: "Udara",
      vibe: "Rentan Sakit, Perlu Perhatian Khusus",
      quote: "🌿 'Kesehatan adalah mahkota yang hanya terlihat oleh yang sakit. Jaga tubuh dan pikiranmu.'"
    },
    en: {
      title: "🕯️ LARA (Sickness)",
      shortDesc: "Poor – often sick or inner conflict.",
      desc: "Remainder 3 (Lara) means sickness or sorrow. Couples with remainder 3 often experience physical or mental health problems. They may also argue over trivial matters, stress, or feel unhappy even if materially sufficient. Lara does not always mean disaster, but needs extra attention in maintaining health and emotions. Each party tends to be sensitive and easily offended. If not managed, household can feel heavy.",
      ritual: "'Tolak Lara' ritual: bathing together with flower water (7 kinds of flowers) on Friday Kliwon night, and reading prayer to avert calamity.",
      solution: "Regular exercise together, manage stress with meditation, and don't hesitate to consult a psychologist or spiritual figure. Boost immunity with healthy eating.",
      color: "White & Gray",
      element: "Air",
      vibe: "Prone to Illness, Needs Special Attention",
      quote: "🌿 'Health is a crown only seen by the sick. Take care of your body and mind.'"
    },
    es: {
      title: "🕯️ LARA (Enfermedad)",
      shortDesc: "Malo – a menudo enfermo o conflicto interno.",
      desc: "El resto 3 (Lara) significa enfermedad o aflicción. Las parejas con resto 3 a menudo experimentan problemas de salud física o mental. También pueden discutir por cosas triviales, estrés o sentirse infelices aunque sean materialmente suficientes. Lara no siempre significa desastre, pero necesita atención extra para mantener la salud y las emociones. Cada parte tiende a ser sensible y se ofende fácilmente. Si no se maneja, el hogar puede sentirse pesado.",
      ritual: "Ritual 'Tolak Lara': bañarse juntos con agua de flores (7 tipos de flores) en la noche del viernes Kliwon, y leer una oración para evitar calamidades.",
      solution: "Ejercicio regular juntos, manejar el estrés con meditación, y no duden en consultar a un psicólogo o figura espiritual. Aumenten la inmunidad con alimentación saludable.",
      color: "Blanco & Gris",
      element: "Aire",
      vibe: "Propenso a Enfermedades, Necesita Atención Especial",
      quote: "🌿 'La salud es una corona que solo ven los enfermos. Cuida tu cuerpo y mente.'"
    },
  },
  4: {
    id: {
      title: "⚰️ PATI",
      shortDesc: "Buruk (rawan) – potensi perceraian, kematian, atau bencana rumah tangga.",
      desc: "Sisa 4 (Pati) adalah angka paling rawan dalam primbon jodoh. Pati artinya mati. Ini bisa diartikan kematian fisik (salah satu pasangan meninggal lebih awal), kematian hubungan (perceraian), atau matinya kebahagiaan dalam rumah tangga. Banyak kitab primbon klasik yang sangat tidak menyarankan pasangan dengan sisa 4 untuk menikah tanpa ruwatan besar. Namun perlu diingat: primbon hanyalah pedoman, bukan takdir mutlak. Banyak pasangan dengan sisa 4 yang berhasil melewati ujian berat dan justru semakin kuat. Kuncinya adalah kesadaran dan ritual tolak bala yang tulus.",
      ritual: "Ritual 'Ruwatan Pati' cukup kompleks: melakukan selamatan 'Memetri Bumi', menanam pohon sebagai simbol kehidupan, mandi kembang setaman di hari kelahiran masing-masing, serta puasa mutih 3 hari berturut-turut disertai doa khusus. Bisa juga meminta bantuan dukun atau pemangku adat untuk ruwatan massal.",
      solution: "Perkuat fondasi spiritual, perbanyak ibadah bersama, selalu minta petunjuk dalam setiap keputusan besar. Hindari ego dan pertengkaran keras. Jangan pernah mengucap kata 'cerai' meski dalam keadaan marah. Jika perlu, ikuti konseling pranikah atau pasca-nikah oleh tokoh agama.",
      color: "Hitam & Merah Tua",
      element: "Tanah & Api",
      vibe: "Ujian Berat, Butuh Ruwatan, Potensi Transformasi",
      quote: "🔥 'Kematian bukan akhir. Setiap ujian adalah cambuk untuk bangkit lebih kuat. Berpulanglah pada Yang Kuasa.'"
    },
    en: {
      title: "⚰️ PATI (Death)",
      shortDesc: "Bad (risky) – potential divorce, death, or household disaster.",
      desc: "Remainder 4 (Pati) is the most vulnerable number in primbon matchmaking. Pati means death. This can mean physical death (one partner dies early), death of relationship (divorce), or death of happiness in the household. Many classical primbon books strongly advise couples with remainder 4 not to marry without a major ruwatan. But remember: primbon is just a guide, not absolute destiny. Many couples with remainder 4 have passed severe trials and become stronger. The key is awareness and sincere ritual to avert calamity.",
      ritual: "'Ruwatan Pati' ritual is quite complex: holding 'Memetri Bumi' selamatan, planting a tree as a symbol of life, bathing with flower water on each birthday, and fasting mutih for 3 consecutive days with special prayers. Can also ask for help from a shaman or traditional leader for mass ruwatan.",
      solution: "Strengthen spiritual foundation, increase joint worship, always ask for guidance in every big decision. Avoid ego and harsh arguments. Never utter the word 'divorce' even when angry. If necessary, attend premarital or post-marital counseling by a religious figure.",
      color: "Black & Dark Red",
      element: "Earth & Fire",
      vibe: "Heavy Trials, Needs Ruwatan, Potential Transformation",
      quote: "🔥 'Death is not the end. Every trial is a whip to rise stronger. Return to the Almighty.'"
    },
    es: {
      title: "⚰️ PATI (Muerte)",
      shortDesc: "Malo (riesgoso) – posible divorcio, muerte o desastre doméstico.",
      desc: "El resto 4 (Pati) es el número más vulnerable en la compatibilidad del primbon. Pati significa muerte. Puede significar muerte física (un cónyuge muere temprano), muerte de la relación (divorcio) o muerte de la felicidad en el hogar. Muchos libros clásicos de primbon aconsejan firmemente que las parejas con resto 4 no se casen sin un gran ruwatan. Pero recuerda: el primbon es solo una guía, no un destino absoluto. Muchas parejas con resto 4 han superado pruebas severas y se han vuelto más fuertes. La clave es la conciencia y el ritual sincero para evitar calamidades.",
      ritual: "El ritual 'Ruwatan Pati' es bastante complejo: realizar una selamatan 'Memetri Bumi', plantar un árbol como símbolo de vida, bañarse con agua de flores en cada cumpleaños, y ayunar mutih durante 3 días consecutivos con oraciones especiales. También se puede pedir ayuda a un chamán o líder tradicional para un ruwatan masivo.",
      solution: "Fortalezcan la base espiritual, aumenten la adoración conjunta, siempre pidan orientación en cada decisión importante. Eviten el ego y las discusiones acaloradas. Nunca pronuncien la palabra 'divorcio' incluso cuando estén enojados. Si es necesario, asistan a consejería prematrimonial o posmatrimonial con una figura religiosa.",
      color: "Negro & Rojo Oscuro",
      element: "Tierra & Fuego",
      vibe: "Pruebas Duras, Necesita Ruwatan, Potencial de Transformación",
      quote: "🔥 'La muerte no es el fin. Cada prueba es un látigo para levantarse más fuerte. Regresen al Todopoderoso.'"
    },
  },
  5: {
    id: {
      title: "🛡️ PESTHI",
      shortDesc: "Sangat Baik – rukun, damai, dan panjang umur.",
      desc: "Sisa 5 (Pesthi) adalah sisa terbaik setelah Sandang dan Pangan. Pesthi artinya sehat, rukun, harmonis. Pasangan dengan neptu bersisa 5 akan hidup dalam kedamaian luar biasa. Mereka jarang bertengkar, mudah memaafkan, dan saling mengayomi. Kesehatan fisik dan mental cenderung prima. Rezeki cukup, tidak melimpah tapi selalu ada. Rumah tangga ini menjadi contoh bagi lingkungan sekitarnya. Panjang umur dan keturunan yang berbakti. Inilah idaman primbon.",
      ritual: "Cukup dengan syukuran rutin setiap tahun (tingkeban atau selamatan) dan sedekah bumi.",
      solution: "Pertahankan sikap saling menghormati. Jangan sampai rasa nyaman membuat lupa merawat cinta. Tetaplah berkencan dan memberi kejutan.",
      color: "Hijau & Biru",
      element: "Air & Tanah",
      vibe: "Harmonis, Damai, Panjang Umur",
      quote: "🏡 'Kedamaian bukanlah ketiadaan badai, tapi kemampuan berlabuh bersama di tengah gelombang.'"
    },
    en: {
      title: "🛡️ PESTHI (Health & Harmony)",
      shortDesc: "Very Good – harmonious, peaceful, long life.",
      desc: "Remainder 5 (Pesthi) is the best remainder after Sandang and Pangan. Pesthi means healthy, harmonious, peaceful. Couples with remainder 5 will live in extraordinary peace. They rarely argue, forgive easily, and protect each other. Physical and mental health tend to be excellent. Fortune is sufficient, not abundant but always present. This household becomes an example to the surrounding community. Long life and devoted offspring. This is the primbon ideal.",
      ritual: "Simply with regular annual thanksgiving (tingkeban or selamatan) and earth alms.",
      solution: "Maintain mutual respect. Don't let comfort make you forget to nurture love. Keep dating and giving surprises.",
      color: "Green & Blue",
      element: "Water & Earth",
      vibe: "Harmonious, Peaceful, Long Life",
      quote: "🏡 'Peace is not the absence of storms, but the ability to anchor together amid waves.'"
    },
    es: {
      title: "🛡️ PESTHI (Salud y Armonía)",
      shortDesc: "Muy Bueno – armonioso, pacífico, vida larga.",
      desc: "El resto 5 (Pesthi) es el mejor resto después de Sandang y Pangan. Pesthi significa saludable, armonioso, pacífico. Las parejas con resto 5 vivirán en una paz extraordinaria. Rara vez discuten, perdonan fácilmente y se protegen mutuamente. La salud física y mental tiende a ser excelente. La fortuna es suficiente, no abundante pero siempre presente. Este hogar se convierte en un ejemplo para la comunidad circundante. Larga vida y descendencia devota. Este es el ideal del primbon.",
      ritual: "Simplemente con un agradecimiento anual regular (tingkeban o selamatan) y limosna a la tierra.",
      solution: "Mantengan el respeto mutuo. No dejen que la comodidad haga que olviden alimentar el amor. Sigan teniendo citas y dando sorpresas.",
      color: "Verde & Azul",
      element: "Agua & Tierra",
      vibe: "Armonioso, Pacífico, Vida Larga",
      quote: "🏡 'La paz no es la ausencia de tormentas, sino la capacidad de anclar juntos en medio de las olas.'"
    },
  },
  6: {
    id: {
      title: "🌾 LUMBUNG",
      shortDesc: "Cukup – rezeki berlimpah tapi butuh usaha ekstra menjaga keharmonisan.",
      desc: "Sisa 6 (Lumbung) artinya keranjang padi. Pasangan ini akan sangat kaya raya secara materi, namun risiko ketidakharmonisan cukup tinggi. Mereka bisa bertengkar karena urusan harta, atau merasa lebih unggul satu sama lain. Lumbung perlu dijaga agar tidak dimakan tikus (konflik). Jika mampu mengelola ego dan komunikasi, rumah tangga ini bisa menjadi sangat makmur dan bahagia.",
      ritual: "Ritual 'Buka Lumbung' dengan membagikan sembako kepada fakir miskin setiap panen raya atau setiap tahun sekali.",
      solution: "Transparansi keuangan mutlak. Bagi peran secara adil. Jangan pernah menyimpan uang secara sembunyi-sembunyi.",
      color: "Emas & Coklat",
      element: "Tanah",
      vibe: "Kemakmuran, Tantangan Komunikasi",
      quote: "🌽 'Lumbung yang lapang tak akan berarti jika hati sempit. Berbagilah, maka cinta akan mekar.'"
    },
    en: {
      title: "🌾 LUMBUNG (Rice Barn)",
      shortDesc: "Fair – abundant wealth but need extra effort to maintain harmony.",
      desc: "Remainder 6 (Lumbung) means a rice barn. This couple will be very wealthy materially, but the risk of disharmony is quite high. They may argue over wealth or feel superior to each other. The barn must be guarded so that it is not eaten by rats (conflicts). If they can manage ego and communication, this household can become very prosperous and happy.",
      ritual: "'Buka Lumbung' ritual: distributing basic food to the poor every harvest or once a year.",
      solution: "Absolute financial transparency. Divide roles fairly. Never hide money secretly.",
      color: "Gold & Brown",
      element: "Earth",
      vibe: "Prosperity, Communication Challenge",
      quote: "🌽 'A spacious barn means nothing if the heart is narrow. Share, then love will bloom.'"
    },
    es: {
      title: "🌾 LUMBUNG (Granero de Arroz)",
      shortDesc: "Regular – abundancia de riqueza pero se necesita esfuerzo extra para mantener la armonía.",
      desc: "El resto 6 (Lumbung) significa un granero de arroz. Esta pareja será muy rica materialmente, pero el riesgo de desarmonía es bastante alto. Pueden discutir por la riqueza o sentirse superiores el uno al otro. El granero debe ser vigilado para que no sea comido por ratas (conflictos). Si pueden manejar el ego y la comunicación, este hogar puede volverse muy próspero y feliz.",
      ritual: "Ritual 'Buka Lumbung': distribuir alimentos básicos a los pobres cada cosecha o una vez al año.",
      solution: "Transparencia financiera absoluta. Dividir los roles de manera justa. Nunca escondan dinero en secreto.",
      color: "Oro & Marrón",
      element: "Tierra",
      vibe: "Prosperidad, Desafío de Comunicación",
      quote: "🌽 'Un granero espacioso no significa nada si el corazón es estrecho. Compartan, entonces el amor florecerá.'"
    },
  },
};

function getSisaMeaning(sisa: number, lang: string) {
  const data = SISA_MEANINGS_ML[sisa];
  if (data && data[lang]) return data[lang];
  return SISA_MEANINGS_ML[0]?.[lang] || SISA_MEANINGS_ML[0]?.id;
}

// Fungsi mendapatkan pesan khusus untuk Pati (sisa 4) multi-bahasa
function getPatiAdvice(lang: string): string {
  if (lang === "en") {
    return "🔮 *Special Ruwatan for Pati (Remainder 4)* 🔮\n\n1. Earth Ruwatan: Sacrifice a black chicken and bury its head in the yard as a symbol of 'burying' bad luck.\n2. Bathe with water containing 7 kinds of flowers on Friday Kliwon night or the night of 1 Suro.\n3. Fast mutih for 3 consecutive days (only white rice and water), starting on one partner's birthday.\n4. Hold a 'Tumpeng Putih' slametan with special prayers asking for bad fate to be turned into blessing.\n5. Give charity to orphans or distribute food to the poor.\n\nAfter the ritual, couples are expected to draw closer to God, always guard their speech, and not be easily emotional.";
  }
  if (lang === "es") {
    return "🔮 *Ruwatan Especial para Pati (Resto 4)* 🔮\n\n1. Ruwatan de Tierra: Sacrificar un pollo negro y enterrar su cabeza en el patio como símbolo de 'enterrar' la mala suerte.\n2. Bañarse con agua que contenga 7 tipos de flores en la noche del viernes Kliwon o la noche del 1 Suro.\n3. Ayunar mutih durante 3 días consecutivos (solo arroz blanco y agua), comenzando en el cumpleaños de uno de los cónyuges.\n4. Realizar una slametan 'Tumpeng Putih' con oraciones especiales pidiendo que el mal destino se convierta en bendición.\n5. Dar limosna a huérfanos o distribuir comida a los pobres.\n\nDespués del ritual, se espera que las parejas se acerquen a Dios, cuiden su habla y no se emocionen fácilmente.";
  }
  // default Indonesian
  return "🔮 *Ruwatan Pati (Khusus untuk sisa 4)* 🔮\n\n1. Ruwatan Bumi: Menyembelih ayam hitam dan memendam kepalanya di halaman rumah sebagai simbol 'mengubur' kesialan.\n2. Mandi dengan air yang berisi 7 macam bunga (mawar, kenanga, melati, cempaka, kantil, sedap malam, dan kamboja) pada malam Jumat Kliwon atau malam 1 Suro.\n3. Puasa mutih selama 3 hari berturut-turut (hanya makan nasi putih dan air putih), dimulai pada hari kelahiran salah satu pasangan.\n4. Menggelar slametan 'Tumpeng Putih' dengan doa khusus memohon diubahnya takdir buruk menjadi berkah.\n5. Melakukan sedekah bumi atau bagi-bagi makanan ke panti asuhan.\n\nSetelah ritual, pasangan diharapkan lebih mendekatkan diri kepada Tuhan, selalu menjaga lisan, dan tidak mudah emosi.";
}

// Fungsi hitung weton
function hitungWeton(hari: string, pasaran: string): { neptu: number; label: string } {
  const neptu = (HARI_NILAI[hari] || 0) + (PASARAN_NILAI[pasaran] || 0);
  return { neptu, label: `${hari} ${pasaran}` };
}

// ========== KOMPONEN UTAMA ==========
export default function PrimbonJodoh() {
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = DICTIONARY[lang] || DICTIONARY["id"];

  const [hari1, setHari1] = useState("Minggu");
  const [pasaran1, setPasaran1] = useState("Legi");
  const [hari2, setHari2] = useState("Senin");
  const [pasaran2, setPasaran2] = useState("Pahing");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      const weton1 = hitungWeton(hari1, pasaran1);
      const weton2 = hitungWeton(hari2, pasaran2);
      const totalNeptu = weton1.neptu + weton2.neptu;
      const sisa = totalNeptu % 7;
      const match = getSisaMeaning(sisa, lang);
      const patiAdvice = sisa === 4 ? getPatiAdvice(lang) : null;
      setResult({
        weton1,
        weton2,
        totalNeptu,
        sisa,
        match,
        patiAdvice
      });
      setAnalyzed(true);
      setLoading(false);
    }, 1200);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `${dict.title}: ${result.weton1.label} (${result.weton1.neptu}) ❤️ ${result.weton2.label} (${result.weton2.neptu})\n${dict.labels.totalNeptu}: ${result.totalNeptu} (${dict.labels.remainder} ${result.sisa})\n${result.match.title}: ${result.match.shortDesc}\n\n${dict.labels.disclaimer}`;
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
        <div className="text-6xl mb-2">💑✨</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg pb-1">
          {dict.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-base align-top">
            ✨{dict.badge}
          </span>
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">{dict.subtitle}</p>
        {analyzed && result && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-amber-400 text-xs font-bold uppercase tracking-widest">{dict.inputs.groomLabel}</label>
            <div className="flex gap-2">
              <select value={hari1} onChange={(e) => setHari1(e.target.value)} className="flex-1 bg-slate-900/60 border border-amber-500/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                {HARI_LIST.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={pasaran1} onChange={(e) => setPasaran1(e.target.value)} className="flex-1 bg-slate-900/60 border border-amber-500/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                {PASARAN_LIST.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-rose-400 text-xs font-bold uppercase tracking-widest">{dict.inputs.brideLabel}</label>
            <div className="flex gap-2">
              <select value={hari2} onChange={(e) => setHari2(e.target.value)} className="flex-1 bg-slate-900/60 border border-rose-500/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none">
                {HARI_LIST.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={pasaran2} onChange={(e) => setPasaran2(e.target.value)} className="flex-1 bg-slate-900/60 border border-rose-500/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none">
                {PASARAN_LIST.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-pink-600 font-bold tracking-wide hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
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
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl bg-gradient-to-br from-slate-900/90 to-black/80">
            <div className="relative z-10 text-center">
              <div className="flex flex-wrap justify-center gap-3 text-lg font-bold">
                <span className="bg-white/10 px-3 py-1 rounded-full">{result.weton1.label} <span className="text-amber-400 text-sm">({result.weton1.neptu})</span></span>
                <span className="text-2xl">❤️</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">{result.weton2.label} <span className="text-amber-400 text-sm">({result.weton2.neptu})</span></span>
              </div>
              <div className="mt-4 text-5xl font-black text-amber-400">{result.totalNeptu}</div>
              <p className="text-slate-400 text-sm mt-1">{dict.labels.totalNeptu} ({dict.labels.remainder} <strong className="text-amber-300">{result.sisa}</strong>)</p>
            </div>

            {/* Hasil Makna */}
            <div className={`mt-6 p-5 rounded-xl text-center border-2 ${result.sisa === 4 ? 'border-red-500/50 bg-red-950/30' : 'border-amber-500/30 bg-amber-950/20'}`}>
              <div className={`text-5xl mb-2 ${result.sisa === 4 ? 'animate-pulse' : ''}`}>{result.match.title}</div>
              <h3 className="text-2xl font-bold text-amber-300">{result.match.title}</h3>
              <p className="text-slate-200 text-sm mt-2">{result.match.shortDesc}</p>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">{result.match.desc}</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                <span className="bg-white/10 px-3 py-1 rounded-full">🎨 {dict.labels.color}: {result.match.color}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">🌿 {dict.labels.element}: {result.match.element}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">🎭 {dict.labels.vibe}: {result.match.vibe}</span>
              </div>
              <div className="mt-4 p-3 bg-amber-500/10 rounded-lg italic text-amber-200 text-sm">
                “{result.match.quote}”
              </div>
            </div>

            {/* Ritual & Solusi */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">📿 {dict.labels.ritual}</h4>
              <p className="text-slate-200 text-xs mt-2 leading-relaxed">
                <strong>{dict.labels.ritualLabel}:</strong> {result.match.ritual}<br/>
                <strong>{dict.labels.solutionLabel}:</strong> {result.match.solution}
              </p>
            </div>

            {/* Khusus untuk Pati (sisa 4) */}
            {result.sisa === 4 && result.patiAdvice && (
              <div className="mt-5 p-5 bg-red-950/40 border border-red-500/30 rounded-xl">
                <h4 className="text-red-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2">⚠️ {dict.labels.specialRitual} ⚠️</h4>
                <div className="text-slate-200 text-xs whitespace-pre-line mt-2">{result.patiAdvice}</div>
                <p className="text-red-200 text-xs mt-3 font-semibold">{dict.labels.important}: Setelah ruwatan, perbanyak doa dan sedekah. Jangan pernah menyimpan rasa curiga atau dendam. Kepasrahan kepada Tuhan adalah kunci.</p>
              </div>
            )}

            {/* Quote & Disclaimer */}
            <div className="mt-5 p-3 bg-amber-500/5 rounded-lg text-center">
              <p className="text-amber-200 text-xs italic">✨ “{dict.quote}”</p>
            </div>
            <div className="text-center text-[10px] text-slate-500 pt-3 mt-4 opacity-70 border-t border-slate-800">
              {dict.labels.disclaimer}
            </div>

            {/* INJEKSI PAYWALL MULAI DARI SINI */}
            <PremiumPaywall 
              toolName={dict.title} 
              resultId={`${result.weton1.neptu}-${result.weton2.neptu}`} 
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
        select option {
          background-color: #0f172a;
          color: white;
        }
      `}</style>
    </div>
  );
}