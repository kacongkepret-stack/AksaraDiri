// src/lib/reportEngine.ts

const rawKeys = process.env.GROQ_API_KEY || "";
const API_KEYS = rawKeys.split(",").map(key => key.trim()).filter(Boolean);

// ---------- STATIC FALLBACK (dengan placeholder {userName} dan {resultId}) ----------
const staticChapters = {
  en: [
    {
      title: "Chapter 1: Authentic Character Blueprint",
      content: `<p>{userName}, based on your name vibration and test result <strong>{resultId}</strong>, your dominant archetype is the <strong>Visionary Strategist</strong>—a rare type found in only 2.3% of the population. You naturally detect hidden patterns and are driven by a hunger for meaning. Your fatal flaw: over-idealism, which often leads to disappointment when others don't match your integrity. Empowering colors: Deep Navy (focus) & Gold (authority). Personal power number: 7—use it for important dates.</p>`
    },
    {
      title: "Chapter 2: 5-Year Financial Map",
      content: `<p>Your wealth window, {userName}, opens wide in years 2–3, peaking at age 31–33. Your name energy aligns with <strong>ethical technology</strong>, <strong>digital education</strong>, and <strong>sustainable energy</strong>. Avoid leveraged speculation; your true asset is your ability to connect abstract ideas to human needs. Emergency fund: save 30% of windfalls. Lucky transaction numbers: 4, 11, 22.</p>`
    },
    {
      title: "Chapter 3: Soulmate & Relationship Secrets",
      content: `<p>Highest compatibility: life paths 7, 9, or 11—they calm your restless mind. Danger zone: partners who dismiss your need for solitude. Thursday evenings are your strongest bonding window. Colors to wear on dates: soft grey & teal.</p>`
    },
    {
      title: "Chapter 4: Life Danger Warnings",
      content: `<p>Your biggest trap, {userName}, is trusting charisma over evidence. Never rely on verbal agreements; document everything. Risky months: March & October. Physical warning sign: sharp headaches before major betrayals. Avoid any investment promising "quick, guaranteed returns"—they are your kryptonite.</p>`
    },
    {
      title: "Chapter 5: Success Execution Strategy",
      content: `<p>For the next 30 days: (1) Wake 40 min earlier and write one page of raw thought—this unblocks your subconscious genius. (2) Cut one toxic relationship, even if it's just emotional distance. (3) Learn one monetizable skill through deep practice (4 hours/week). Your mantra: "Depth over distraction."</p>`
    }
  ],
  es: [
    {
      title: "Capítulo 1: Plano del Carácter Auténtico",
      content: `<p>{userName}, según la vibración de tu nombre y el resultado <strong>{resultId}</strong>, tu arquetipo dominante es el <strong>Estratega Visionario</strong>, un tipo raro (2.3% de la población). Detectas patrones ocultos y te mueve la necesidad de significado. Tu punto débil: idealismo excesivo. Colores de poder: Azul Marino (enfoque) y Dorado (autoridad). Número personal de poder: 7.</p>`
    },
    {
      title: "Capítulo 2: Mapa Financiero a 5 Años",
      content: `<p>Tu ventana de riqueza se abre en los años 2–3, con pico a los 31–33 años. Tu energía se alinea con <strong>tecnología ética</strong>, <strong>educación digital</strong> y <strong>energía sostenible</strong>. Evita la especulación; tu mayor activo es conectar ideas abstractas con necesidades humanas. Fondo de emergencia: 30% de ingresos inesperados. Números de suerte: 4, 11, 22.</p>`
    },
    {
      title: "Capítulo 3: Secretos de Pareja",
      content: `<p>Compatibilidad máxima: caminos de vida 7, 9 o 11—calman tu mente inquieta. Riesgo: parejas que no respetan tu necesidad de soledad. Ventana de conexión: jueves al atardecer. Colores para citas: gris suave y verde azulado.</p>`
    },
    {
      title: "Capítulo 4: Advertencias de Peligro",
      content: `<p>Tu mayor trampa, {userName}, es confiar en el carisma sin evidencia. Nunca hagas acuerdos verbales; documenta todo. Meses de riesgo: marzo y octubre. Señal física: dolores de cabeza agudos antes de traiciones. Evita inversiones que prometan "ganancias rápidas y seguras".</p>`
    },
    {
      title: "Capítulo 5: Estrategia de Éxito",
      content: `<p>Próximos 30 días: (1) Levántate 40 min antes y escribe una página de pensamiento en bruto. (2) Corta una relación tóxica. (3) Aprende una habilidad monetizable con práctica profunda. Mantra: "Profundidad sobre distracción".</p>`
    }
  ],
  id: [
    {
      title: "Bab 1: Blueprint Karakter Asli",
      content: `<p>{userName}, berdasarkan vibrasi nama dan hasil tes <strong>{resultId}</strong>, arketipe dominan Anda adalah <strong>Sang Visioner Strategis</strong>—tipe langka yang hanya dimiliki 2.3% populasi. Anda secara alami melihat pola tersembunyi dan digerakkan oleh dahaga makna. Kelemahan fatal: terlalu idealis dan sering kecewa saat orang lain tidak sejalan dengan integritas Anda. Warna penguat: Biru Dongker (fokus) & Emas (otoritas). Angka kekuatan pribadi: 7—gunakan untuk menentukan tanggal penting.</p>`
    },
    {
      title: "Bab 2: Peta Keuangan 5 Tahun",
      content: `<p>Jendela rezeki Anda, {userName}, terbuka lebar di tahun ke-2 hingga ke-3, dengan puncak finansial di usia 31–33. Energi nama Anda selaras dengan sektor <strong>teknologi etis</strong>, <strong>pendidikan digital</strong>, dan <strong>energi berkelanjutan</strong>. Hindari spekulasi; justru kemampuan Anda menghubungkan ide abstrak dengan kebutuhan manusia adalah aset utama. Dana darurat: simpan 30% dari setiap pemasukan tak terduga. Angka hoki transaksi: 4, 11, 22.</p>`
    },
    {
      title: "Bab 3: Rahasia Jodoh & Hubungan",
      content: `<p>Kecocokan tertinggi: mereka dengan angka kehidupan 7, 9, atau 11—merekalah yang mampu menenangkan pikiran Anda yang tak pernah berhenti. Zona bahaya: pasangan yang meremehkan kebutuhan Anda akan kesendirian. Momen bonding terkuat: Kamis petang. Warna saat kencan: abu-abu lembut & teal.</p>`
    },
    {
      title: "Bab 4: Peringatan Bahaya Hidup",
      content: `<p>Jebakan terbesar Anda, {userName}, adalah memercayai karisma tanpa bukti. Jangan pernah buat perjanjian lisan; catat semuanya. Bulan rawan: Maret & Oktober. Tanda fisik: sakit kepala tajam sebelum pengkhianatan besar. Hindari investasi berjanji "cepat dan pasti untung"—itu racun Anda.</p>`
    },
    {
      title: "Bab 5: Strategi Sukses Eksekusi",
      content: `<p>Selama 30 hari ke depan: (1) Bangun 40 menit lebih awal dan tulis satu halaman pikiran mentah—ini membuka genius bawah sadar. (2) Putuskan satu hubungan beracun, walau hanya jarak emosional. (3) Pelajari satu skill menghasilkan melalui latihan mendalam (4 jam/minggu). Mantra: "Kedalaman di atas gangguan."</p>`
    }
  ]
};

function getStaticChapters(lang: string, userName: string, resultId: string): { title: string; content: string }[] {
  const source = staticChapters[lang as keyof typeof staticChapters] || staticChapters.id;
  return source.map(ch => ({
    ...ch,
    content: ch.content
      .replace(/\{userName\}/g, userName)
      .replace(/\{resultId\}/g, resultId)
  }));
}

// ---------- PROMPT AI PREMIUM (DISEMPURNAKAN) ----------
function buildPrompt(
  chapterTitle: string,
  chapterDesc: string,
  lang: string,
  userName: string,
  toolName: string,
  resultId: string
): string {
  const resultContext = resultId !== "Unknown"
    ? (lang === "en"
        ? `The user's specific test result is: ${resultId}. Ignore all generic interpretations—dive directly into a hidden psychological conflict or an unrecognized talent that arises from this result.`
        : lang === "es"
        ? `El resultado de la prueba es: ${resultId}. Ignora todas las interpretaciones genéricas—ve directo al conflicto psicológico oculto o talento no reconocido que surge de este resultado.`
        : `Hasil tes spesifik: ${resultId}. Abaikan SEMUA interpretasi generik—langsung tuju konflik psikologis tersembunyi atau bakat yang tidak disadari yang muncul dari hasil ini.`)
    : "";

  const toneInstruction = lang === "en"
    ? `You are an elite metaphysical psychologist known for SHOCKINGLY ACCURATE and ETHICAL analysis. 
MANDATORY RULES:
1. Every sentence must be a psychological diagnosis or a specific prediction (age, month, number, or concrete event).
2. FORBIDDEN: motivational quotes, generic financial advice, personal development clichés.
3. Avoid moral accusations (e.g., "you are a liar"). Instead, reframe as a psychological defense mechanism, e.g., "You have a pattern of avoiding conflict by concealing facts, rooted in a childhood fear of rejection."
4. Include at least ONE surprising, counter‑intuitive statement that feels uniquely personal.
5. Use <strong> for ALL key diagnostic terms (weton names, ages, months, psychological terms).
6. Output ONLY pure HTML: <h3> for chapter titles, <p> for paragraphs, <ul> and <li> for lists. No markdown.
7. Strictly 400-600 words. Break the text into neat, readable paragraphs and use bullet points (<ul><li>) for steps, dates, or warnings.`
    : lang === "es"
    ? `Eres un psicólogo metafísico de élite conocido por análisis SORPRENDENTEMENTE PRECISOS y ÉTICOS.
REGLAS OBLIGATORIAS:
1. Cada oración debe ser un diagnóstico psicológico o una predicción específica (edad, mes, número, evento concreto).
2. PROHIBIDO: frases motivacionales, consejos financieros genéricos, clichés de desarrollo personal.
3. Evita acusaciones morales (ej: "eres un mentiroso"). En lugar de eso, refrasea como un mecanismo de defensa psicológico, ej: "Tienes un patrón de evitar conflictos ocultando hechos, arraigado en un miedo infantil al rechazo."
4. Incluye al menos UNA declaración sorprendente y contraintuitiva que se sienta exclusivamente personal.
5. Usa <strong> para TODOS los términos clave de diagnóstico (nombres de weton, edades, meses, términos psicológicos).
6. Salida SOLO HTML puro: <h3> para títulos de capítulo, <p> para párrafos, <ul> y <li> para listas. Sin markdown.
7. Estrictamente 400-600 palabras. Divide el texto en párrafos ordenados y usa viñetas (<ul><li>) para pasos, fechas o advertencias.`
    : `Anda adalah psikolog metafisika elit yang dikenal dengan analisis yang SANGAT AKURAT, TAJAM, dan ETIS.
ATURAN WAJIB:
1. Setiap kalimat HARUS berupa diagnosis psikologis atau ramalan spesifik (usia, bulan, angka, arah, atau peristiwa konkret).
2. DILARANG KERAS memberi nasihat keuangan generik, kata motivasi, atau klise pengembangan diri.
3. Hindari tuduhan moral (misal: “Anda pembohong”). Sebagai gantinya, ungkapkan sebagai mekanisme pertahanan psikologis, contoh: “Anda memiliki mekanisme menghindari konflik dengan menutupi fakta, yang berakar dari rasa takut ditolak sejak kecil.”
4. Sertakan minimal SATU pernyataan mengejutkan yang terasa sangat pribadi dan kontra-intuitif (misal: “Keberuntungan Anda justru muncul saat Anda berhenti mencari validasi dari pasangan.”)
5. Gunakan <strong> pada SEMUA istilah kunci diagnosis (nama weton, angka, usia, bulan, istilah psikologis).
6. Output HANYA HTML murni: <h3> untuk judul bab, <p> untuk paragraf, <ul> dan <li> untuk daftar. Tidak boleh ada markdown.
7. Ketat 400-600 kata. Pecah teks menjadi paragraf-paragraf pendek yang rapi, dan gunakan bullet points (<ul><li>) untuk rincian langkah, tanggal, atau peringatan.`;

  if (lang === "en") {
    return `You are an elite metaphysical psychologist writing for a premium paid report. User: ${userName}, Tool: ${toolName}. ${resultContext}
Focus chapter: "${chapterTitle}". ${toneInstruction}
Start directly with <h3>${chapterTitle}</h3> followed by your razor-sharp analysis.`;
  } else if (lang === "es") {
    return `Eres un psicólogo metafísico de élite redactando un informe premium pagado. Usuario: ${userName}, Herramienta: ${toolName}. ${resultContext}
Enfoque: "${chapterTitle}". ${toneInstruction}
Comienza directamente con <h3>${chapterTitle}</h3> seguido de tu análisis filoso.`;
  } else {
    return `Anda adalah psikolog metafisika elit yang menulis laporan premium berbayar. Pengguna: ${userName}, Alat: ${toolName}. ${resultContext}
Fokus bab: "${chapterTitle}". ${toneInstruction}
Mulai langsung dengan <h3>${chapterTitle}</h3> diikuti analisis tajam Anda.`;
  }
}

// ---------- FETCH DENGAN RETRY & ROTASI KUNCI (GROQ) ----------
async function fetchChapterWithRetry(
  chapterIndex: number,
  totalChapters: number,
  chapterTitle: string,
  chapterDesc: string,
  lang: string,
  userName: string,
  toolName: string,
  resultId: string
): Promise<string | null> {
  if (API_KEYS.length === 0) return null;

  let attempt = 0;
  const maxRetries = 5;
  while (attempt < maxRetries) {
    const keyIndex = (chapterIndex + attempt) % API_KEYS.length;
    const apiKey = API_KEYS[keyIndex];
    const prompt = buildPrompt(chapterTitle, chapterDesc, lang, userName, toolName, resultId);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { 
              role: "system", 
              content: "Anda adalah psikolog metafisika tajam, etis, dan tidak pernah menghakimi. Setiap respons adalah diagnosis mendalam yang membuka mata klien tanpa menyakiti." 
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.9,
          max_tokens: 2000
        })
      });
      const data = await response.json();

      if (data.error) {
        const msg = data.error.message || "";
        if (msg.includes("rate_limit") || msg.includes("quota")) {
          attempt++;
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        return null;
      }

      let rawText = data.choices?.[0]?.message?.content;
      if (rawText) {
        rawText = rawText.replace(/```html/gi, "").replace(/```/gi, "").replace(/style="[^"]*"/gi, "").trim();
        if (!rawText.includes("<p>") && !rawText.includes("<br")) {
          rawText = rawText.split(/\n\s*\n/).map((paragraph: string) => `<p class="mb-3">${paragraph.replace(/\n/g, "<br/>")}</p>`).join("");
        }
        return rawText;
      }
      return null;
    } catch (e) {
      attempt++;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

// ---------- FUNGSI UTAMA (PARALEL, TIERING, FALLBACK PERSONAL) ----------
export async function generatePremiumReport(
  userName: string,
  toolName: string,
  lang: string = "id",
  resultId: string = "Unknown",
  tier: string = "premium"
): Promise<string> {
  const allChapters = [
    { 
      title: lang === "en" ? "Chapter 1: Authentic Character Blueprint" : lang === "es" ? "Capítulo 1: Plano del Carácter Auténtico" : "Bab 1: Blueprint Karakter Asli",
      desc: lang === "en" ? "Deep personality architecture and hidden strengths/weaknesses." : lang === "es" ? "Arquitectura profunda de personalidad y fortalezas/debilidades ocultas." : "Arsitektur kepribadian mendalam serta kekuatan/kelemahan tersembunyi."
    },
    { 
      title: lang === "en" ? "Chapter 2: 5-Year Financial Map" : lang === "es" ? "Capítulo 2: Mapa Financiero a 5 Años" : "Bab 2: Peta Keuangan 5 Tahun",
      desc: lang === "en" ? "Wealth trajectory, best sectors, and timing." : lang === "es" ? "Trayectoria de riqueza, mejores sectores y sincronización." : "Lintasan rezeki, sektor terbaik, dan momentum."
    },
    { 
      title: lang === "en" ? "Chapter 3: Soulmate & Relationship Secrets" : lang === "es" ? "Capítulo 3: Secretos de Pareja y Relaciones" : "Bab 3: Rahasia Jodoh & Hubungan",
      desc: lang === "en" ? "Compatibility signatures and relational traps." : lang === "es" ? "Firmas de compatibilidad y trampas relacionales." : "Pola kecocokan dan jebakan hubungan."
    },
    { 
      title: lang === "en" ? "Chapter 4: Life Danger Warnings" : lang === "es" ? "Capítulo 4: Advertencias de Peligro Vital" : "Bab 4: Peringatan Bahaya Hidup",
      desc: lang === "en" ? "Fatal mistakes, taboos, and danger months." : lang === "es" ? "Errores fatales, tabúes y meses de peligro." : "Kesalahan fatal, pantangan, dan bulan rawan."
    },
    { 
      title: lang === "en" ? "Chapter 5: Success Execution Strategy" : lang === "es" ? "Capítulo 5: Estrategia de Éxito" : "Bab 5: Strategi Sukses Eksekusi",
      desc: lang === "en" ? "Concrete morning routine and 30-day transformation." : lang === "es" ? "Rutina matutina concreta y transformación en 30 días." : "Rutin pagi konkret dan transformasi 30 hari."
    }
  ];

  const targetChapters = tier === "basic" ? allChapters.slice(0, 2) : allChapters;

  const aiResults = await Promise.all(
    targetChapters.map((ch, i) =>
      fetchChapterWithRetry(i, targetChapters.length, ch.title, ch.desc, lang, userName, toolName, resultId)
    )
  );

  const staticChaptersList = getStaticChapters(lang, userName, resultId);
  const targetStatic = tier === "basic" ? staticChaptersList.slice(0, 2) : staticChaptersList;

  const finalChapters = targetChapters.map((ch, i) => {
    if (aiResults[i]) return aiResults[i];
    const fallback = targetStatic[i];
    if (fallback) {
      return `<h3>${fallback.title}</h3>${fallback.content}`;
    }
    return `<h3>${ch.title}</h3><p>${lang === "en" ? "Insight temporarily unavailable." : lang === "es" ? "Información no disponible temporalmente." : "Wawasan sementara tidak tersedia."}</p>`;
  });

  return finalChapters.join("");
}