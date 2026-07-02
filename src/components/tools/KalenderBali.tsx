"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // <-- Tambahan untuk deteksi bahasa

// ========== DATA DASAR KALENDER BALI (TIDAK DITERJEMAHKAN) ==========
const WUKU_LIST = [
  "Sinta", "Landep", "Ukir", "Kurantir", "Tolu", "Gumbreg", "Wariga", "Warigadean", 
  "Julungwangi", "Sungsang", "Dungulan", "Kuningan", "Langkir", "Medangsia", "Pujut", 
  "Pahang", "Krulut", "Merakih", "Tambir", "Medangkungan", "Matal", "Uye", "Menail", 
  "Prangbakat", "Bala", "Ugu", "Wayang", "Kelawu", "Dukut", "Watugunung"
];

const SAPTA_WARA = ["Redite", "Soma", "Anggara", "Buda", "Wraspati", "Sukra", "Saniscara"];
const SAPTA_URIP = [5, 4, 3, 7, 8, 6, 9]; 

const PANCA_WARA = ["Umanis", "Paing", "Pon", "Wage", "Kliwon"];
const PANCA_URIP = [5, 9, 7, 4, 8]; 

const TRI_WARA = ["Pasah", "Beteng", "Kajeng"];

const ANCHOR_DATE_UTC = Date.UTC(2023, 11, 17);

// ========== KAMUS UI 3 BAHASA ==========
const DICTIONARY: Record<string, any> = {
  id: {
    title: "Kalender Bali Pawukon",
    subtitle: "Perhitungan matematis presisi siklus Pawukon (210 Hari), Rerainan Suci, dan Tenung Urip.",
    todayBtn: "Hari Ini", searchBtn: "Cari",
    legendLibur: "Libur / Redite (Minggu)", legendToday: "Hari Ini", legendRerainan: "Rerainan Suci (Hari Raya)",
    shareBtn: "BAGIKAN TANGGAL INI",
    alertYear: "Pencarian terbatas pada tahun 1900 hingga 2100.",
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    watakTitle: "Tenung Urip (Karakteristik)", totalUrip: "Total Urip", holiday: "HARI LIBUR NASIONAL"
  },
  en: {
    title: "Balinese Pawukon Calendar",
    subtitle: "Precise mathematical calculation of the Pawukon cycle (210 Days), Holy Days, and Tenung Urip.",
    todayBtn: "Today", searchBtn: "Search",
    legendLibur: "Holiday / Redite (Sunday)", legendToday: "Today", legendRerainan: "Holy Day (Rerainan)",
    shareBtn: "SHARE THIS DATE",
    alertYear: "Search is limited to years between 1900 and 2100.",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    watakTitle: "Tenung Urip (Characteristics)", totalUrip: "Total Urip", holiday: "NATIONAL HOLIDAY"
  },
  es: {
    title: "Calendario Balinés Pawukon",
    subtitle: "Cálculo matemático preciso del ciclo Pawukon (210 días), Días Santos y Tenung Urip.",
    todayBtn: "Hoy", searchBtn: "Buscar",
    legendLibur: "Festivo / Redite (Domingo)", legendToday: "Hoy", legendRerainan: "Día Santo (Rerainan)",
    shareBtn: "COMPARTIR ESTA FECHA",
    alertYear: "La búsqueda se limita a los años entre 1900 y 2100.",
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    watakTitle: "Tenung Urip (Características)", totalUrip: "Urip Total", holiday: "FIESTA NACIONAL"
  }
};

interface PawukonData {
  wukuIdx: number; saptaIdx: number; pancaIdx: number; triIdx: number;
  wuku: string; saptaWara: string; pancaWara: string; triWara: string;
  totalUrip: number; rerainan: string[];
}

function getPawukonData(date: Date): PawukonData {
  const targetUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((targetUTC - ANCHOR_DATE_UTC) / 86400000);
  const pawukonIndex = ((diffDays % 210) + 210) % 210;

  const wukuIdx = Math.floor(pawukonIndex / 7);
  const saptaIdx = pawukonIndex % 7;
  const pancaIdx = (pawukonIndex + 1) % 5; 
  const triIdx = pawukonIndex % 3; 

  const totalUrip = SAPTA_URIP[saptaIdx] + PANCA_URIP[pancaIdx];
  const rerainan = calculateRerainan(wukuIdx, saptaIdx, pancaIdx, triIdx);

  return {
    wukuIdx, saptaIdx, pancaIdx, triIdx,
    wuku: WUKU_LIST[wukuIdx], saptaWara: SAPTA_WARA[saptaIdx],
    pancaWara: PANCA_WARA[pancaIdx], triWara: TRI_WARA[triIdx],
    totalUrip, rerainan
  };
}

function calculateRerainan(wukuIdx: number, saptaIdx: number, pancaIdx: number, triIdx: number): string[] {
  const events: string[] = [];
  if (triIdx === 2 && pancaIdx === 4) events.push("Kajeng Kliwon");
  if (saptaIdx === 3 && pancaIdx === 3) events.push("Buda Wage (Buda Cemeng)");
  if (saptaIdx === 2 && pancaIdx === 4) events.push("Anggara Kasih");
  
  if (saptaIdx === 6 && pancaIdx === 4 && ![1, 6, 11, 16, 21, 26].includes(wukuIdx)) events.push("Tumpek"); 

  if (wukuIdx === 0) { 
    if (saptaIdx === 0) events.push("Banyu Pinaruh");
    if (saptaIdx === 1) events.push("Soma Ribek");
    if (saptaIdx === 2) events.push("Sabuh Mas");
    if (saptaIdx === 3) events.push("Pagerwesi");
  } else if (wukuIdx === 1 && saptaIdx === 6) events.push("Tumpek Landep");
  else if (wukuIdx === 6 && saptaIdx === 6) events.push("Tumpek Wariga (Pengatag)");
  else if (wukuIdx === 9) { 
    if (saptaIdx === 4) events.push("Sugihan Jawa");
    if (saptaIdx === 5) events.push("Sugihan Bali");
  } else if (wukuIdx === 10) { 
    if (saptaIdx === 2) events.push("Penampahan Galungan");
    if (saptaIdx === 3) events.push("Hari Raya Galungan");
    if (saptaIdx === 4) events.push("Umanis Galungan");
    if (saptaIdx === 6) events.push("Pemaridan Guru");
  } else if (wukuIdx === 11) { 
    if (saptaIdx === 0) events.push("Ulihan");
    if (saptaIdx === 1) events.push("Pemacekan Agung");
    if (saptaIdx === 5) events.push("Penampahan Kuningan");
    if (saptaIdx === 6) events.push("Hari Raya Kuningan");
  } else if (wukuIdx === 16 && saptaIdx === 6) events.push("Tumpek Krulut");
  else if (wukuIdx === 21 && saptaIdx === 6) events.push("Tumpek Uye");
  else if (wukuIdx === 26 && saptaIdx === 6) events.push("Tumpek Wayang");
  else if (wukuIdx === 29 && saptaIdx === 6) events.push("Hari Raya Saraswati");

  return events;
}

function isLiburNasional(date: Date): boolean {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  if (day === 1 && month === 1) return true;
  if (day === 1 && month === 5) return true;
  if (day === 1 && month === 6) return true;
  if (day === 17 && month === 8) return true;
  if (day === 25 && month === 12) return true;
  return false;
}

// <-- FUNGSI WATAK DIBUAT DINAMIS BERDASARKAN BAHASA
function getWatakBali(urip: number, lang: string): string {
  if (lang === "en") {
    if (urip <= 8) return "Wicaksana (Wisdom) - Sharp intuition, calm in storms, but often suppresses emotions.";
    if (urip <= 11) return "Dharma (Harmony) - Flexible, good mediator, upholds the value of brotherhood.";
    if (urip <= 14) return "Kawi (Creativity) - High artistic soul and innovation, a visionary thinker willing to take big risks.";
    return "Manggala (Leadership) - Strong leadership aura, unyielding hard worker, firm but sometimes stubborn.";
  }
  if (lang === "es") {
    if (urip <= 8) return "Wicaksana (Sabiduría) - Intuición aguda, tranquilo ante las tormentas, pero a menudo reprime emociones.";
    if (urip <= 11) return "Dharma (Armonía) - Flexible, buen mediador, defiende el valor de la hermandad.";
    if (urip <= 14) return "Kawi (Creatividad) - Gran alma artística, pensador visionario dispuesto a asumir grandes riesgos.";
    return "Manggala (Liderazgo) - Fuerte aura de liderazgo, trabajador inquebrantable, firme pero a veces terco.";
  }
  // Default ID
  if (urip <= 8) return "Wicaksana (Kebijaksanaan) - Memiliki ketajaman intuisi, tenang menghadapi badai, namun sering memendam emosi.";
  if (urip <= 11) return "Dharma (Harmoni) - Pribadi yang luwes, penengah konflik yang baik, menjunjung tinggi nilai persaudaraan (Menyama Braya).";
  if (urip <= 14) return "Kawi (Kreativitas) - Jiwa seni dan inovasi yang tinggi, pemikir visioner yang berani mengambil risiko besar.";
  return "Manggala (Kepemimpinan) - Aura kepemimpinan yang kuat (Taksu), pekerja keras yang pantang menyerah, tegas namun kadang keras kepala.";
}

interface CalendarDayBali {
  date: Date;
  pawukon: PawukonData;
  isLibur: boolean;
}

// ========== KOMPONEN UTAMA ==========
export default function KalenderBali({ lang = "id" }: { lang?: string }) {
  const params = useParams();
  const activeLang = lang || (params?.lang as string) || "id";
  const dict = DICTIONARY[activeLang] || DICTIONARY["id"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<CalendarDayBali[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDayBali | null>(null);
  const [searchDateStr, setSearchDateStr] = useState("");

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays: CalendarDayBali[] = [];
    
    const prevMonthDate = new Date(year, month, 0);
    const prevMonthDaysCount = prevMonthDate.getDate();
    for (let i = prevMonthDaysCount - startDayOfWeek + 1; i <= prevMonthDaysCount; i++) {
      const d = new Date(year, month - 1, i);
      calendarDays.push({ date: d, pawukon: getPawukonData(d), isLibur: isLiburNasional(d) });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      calendarDays.push({ date: d, pawukon: getPawukonData(d), isLibur: isLiburNasional(d) });
    }
    
    const remaining = 42 - calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      calendarDays.push({ date: d, pawukon: getPawukonData(d), isLibur: isLiburNasional(d) });
    }
    setDays(calendarDays);
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToday = () => {
    setCurrentDate(new Date());
    setSearchDateStr(""); 
  };

  const handleDayClick = (day: CalendarDayBali) => setSelectedDay(day);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDateStr) {
      const [year, month, day] = searchDateStr.split("-").map(Number);
      if (year < 1900 || year > 2100) {
        alert(dict.alertYear);
        return;
      }
      const searchDate = new Date(year, month - 1, day);
      setCurrentDate(searchDate); 
      setSelectedDay({ date: searchDate, pawukon: getPawukonData(searchDate), isLibur: isLiburNasional(searchDate) });
    }
  };

  const closeModal = () => setSelectedDay(null);

  return (
    <div className="max-w-5xl mx-auto text-white font-sans px-4 py-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🌺🏯</div>
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-400 via-red-500 to-orange-500 bg-clip-text text-transparent pb-1">
          {dict.title}
        </h2>
        <p className="text-slate-300 text-sm mt-1">{dict.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/60 border border-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex gap-2 w-full md:w-auto justify-center">
          <button onClick={prevMonth} className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 border border-rose-500/20 transition text-rose-300">◀</button>
          <button onClick={goToday} className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 transition text-sm font-bold text-rose-100">{dict.todayBtn}</button>
          <button onClick={nextMonth} className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 border border-rose-500/20 transition text-rose-300">▶</button>
        </div>
        
        <div className="text-center">
          <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-orange-400">
            {dict.months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto justify-center">
          <input 
            type="date" 
            value={searchDateStr}
            onChange={(e) => setSearchDateStr(e.target.value)}
            className="w-full md:w-40 bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 color-scheme-dark"
            required
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 transition font-bold text-sm text-rose-100 flex items-center gap-2">
            🔍 {dict.searchBtn}
          </button>
        </form>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-7 gap-2 mb-3 text-center">
          {SAPTA_WARA.map((h, i) => (
            <div key={h} className={`text-[10px] md:text-xs font-black uppercase tracking-wider py-2 rounded-lg ${i === 0 ? 'text-red-400 bg-red-500/10' : 'text-orange-400 bg-orange-500/10'}`}>
              <span className="hidden md:inline">{h}</span>
              <span className="inline md:hidden">{h.substring(0,3)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const isCurrentMonth = day.date.getMonth() === currentDate.getMonth();
            const isToday = day.date.toDateString() === new Date().toDateString();
            const isSunday = day.date.getDay() === 0;
            const isRedDay = isSunday || day.isLibur;
            const hasRerainan = day.pawukon.rerainan.length > 0;
            
            let dayBg = "bg-white/5 border-white/5";
            let dayText = "text-white";
            
            if (!isCurrentMonth) {
              dayBg = "opacity-30 bg-black/20 border-transparent";
            } else if (isToday) {
              dayBg = "bg-rose-500/20 border-rose-500/50 ring-1 ring-rose-400";
              dayText = "text-rose-300 font-black";
            } else if (isRedDay) {
              dayBg = "bg-red-500/10 border-red-500/20";
              dayText = "text-red-400 font-bold";
            }

            return (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`relative p-2 min-h-[85px] md:min-h-[110px] border rounded-xl transition-all hover:scale-[1.05] hover:z-10 focus:outline-none flex flex-col justify-between ${dayBg}`}
              >
                <div className="w-full flex justify-between items-start">
                  <div className="flex gap-1">
                    {day.isLibur && isCurrentMonth && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>}
                    {hasRerainan && isCurrentMonth && <span className="w-2 h-2 rounded-full bg-orange-400"></span>}
                  </div>
                  <span className={`text-base md:text-xl ${dayText}`}>
                    {day.date.getDate()}
                  </span>
                </div>
                
                <div className="w-full text-center mt-auto pb-1">
                  <div className={`text-[9px] md:text-xs font-bold leading-tight ${isCurrentMonth ? 'text-orange-300' : 'text-slate-500'}`}>
                    {day.pawukon.pancaWara}
                  </div>
                  <div className="text-[8px] md:text-[9px] text-slate-400 mt-0.5 truncate">
                    Wuku {day.pawukon.wuku}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-[10px] sm:text-xs text-slate-400">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div> {dict.legendLibur}</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50 ring-1 ring-rose-400"></div> {dict.legendToday}</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400"></div> {dict.legendRerainan}</div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl max-w-sm md:max-w-md w-full p-6 border border-rose-500/30 shadow-2xl relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">&times;</button>
            
            <div className="text-center mb-6 pt-2">
              <p className="text-xs font-bold text-orange-400 tracking-widest uppercase mb-1">
                {selectedDay.date.toLocaleDateString(activeLang === "en" ? "en-US" : activeLang === "es" ? "es-ES" : "id-ID", { weekday: 'long' })}
              </p>
              <h3 className="text-3xl font-black text-slate-100">
                {selectedDay.date.getDate()} {dict.months[selectedDay.date.getMonth()]} {selectedDay.date.getFullYear()}
              </h3>
              
              {selectedDay.isLibur && (
                <div className="mt-3 inline-block px-4 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full text-xs font-bold text-red-400 tracking-widest animate-pulse">
                  {dict.holiday}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">Wuku</p>
                    <p className="text-lg font-bold text-slate-200">{selectedDay.pawukon.wuku}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">Tri Wara</p>
                    <p className="text-lg font-bold text-slate-200">{selectedDay.pawukon.triWara}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">Sapta Wara</p>
                    <p className="text-lg font-bold text-slate-200">{selectedDay.pawukon.saptaWara}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">Panca Wara</p>
                    <p className="text-lg font-bold text-slate-200">{selectedDay.pawukon.pancaWara}</p>
                  </div>
                </div>
              </div>

              {selectedDay.pawukon.rerainan.length > 0 && (
                <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                  <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span>🌺</span> {dict.legendRerainan}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDay.pawukon.rerainan.map((r, i) => (
                      <span key={i} className="bg-rose-500/20 text-rose-200 text-xs px-3 py-1.5 rounded-md border border-rose-500/30 font-semibold shadow-sm">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                <div className="flex justify-between items-center mb-2 border-b border-yellow-500/20 pb-2">
                  <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><span>✨</span> {dict.watakTitle}</p>
                  <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded">{dict.totalUrip}: {selectedDay.pawukon.totalUrip}</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mt-2">{getWatakBali(selectedDay.pawukon.totalUrip, activeLang)}</p>
              </div>
            </div>

            <button
              onClick={() => {
                const rerainanNote = selectedDay.pawukon.rerainan.length > 0 ? `\nRerainan: ${selectedDay.pawukon.rerainan.join(", ")}` : "";
                const shareText = `🌺 ${dict.title} - ${selectedDay.date.toLocaleDateString("id-ID")}\n${selectedDay.pawukon.saptaWara} ${selectedDay.pawukon.pancaWara}, Wuku ${selectedDay.pawukon.wuku}\nTri Wara: ${selectedDay.pawukon.triWara}\n${dict.totalUrip}: ${selectedDay.pawukon.totalUrip}${rerainanNote}\n\nAksaraDiri!`;
                if (navigator.share) navigator.share({ title: dict.title, text: shareText }).catch(()=>{});
                else alert(dict.alertShare);
              }}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 shadow-[0_0_15px_rgba(244,63,94,0.2)] font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 tracking-wide uppercase"
            >
              📤 {dict.shareBtn}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .color-scheme-dark {
          color-scheme: dark;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.8;
          transition: 0.2s;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}