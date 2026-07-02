import React from "react";
import LoveCalculator from "../../../../components/tools/LoveCalculator";
import WetonCalculator from "../../../../components/tools/WetonCalculator";
import ZodiacProfile from "../../../../components/tools/ZodiacProfile";
import ZodiacMatch from "../../../../components/tools/ZodiacMatch";
import ChineseZodiac from "../../../../components/tools/ChineseZodiac";
import Numerology from "../../../../components/tools/Numerology";
import LuckyNumber from "../../../../components/tools/LuckyNumber";
import LuckyColor from "../../../../components/tools/LuckyColor";
import Horoscop from "../../../../components/tools/Horoscop";
import Neptu from "../../../../components/tools/Neptu";
import KalenderJawa from "../../../../components/tools/KalenderJawa";
import KalenderBali from "../../../../components/tools/KalenderBali";
import HariPasaran from "../../../../components/tools/HariPasaran";
import NamaBayiJawa from "../../../../components/tools/NamaBayiJawa";
import ArahRezeki from "../../../../components/tools/ArahRezeki";
import WatakKelahiran from "../../../../components/tools/WatakKelahiran";
import ArtiMimpi from "../../../../components/tools/ArtiMimpi";
import HariBaikNikah from "../../../../components/tools/HariBaikNikah";
import PrimbonJodoh from "../../../../components/tools/PrimbonJodoh";
import NameMeaning from "../../../../components/tools/NameMeaning";
import LifePath from "../../../../components/tools/LifePath";
import SpiritAnimal from "../../../../components/tools/SpiritAnimal";
import AuraColor from "../../../../components/tools/AuraColor";
import DestinyCard from "../../../../components/tools/DestinyCard";
import FortuneWheel from "../../../../components/tools/FortuneWheel";
import PastLife from "../../../../components/tools/PastLife";
import WhichCountry from "../../../../components/tools/WhichCountry";
import HiddenTalent from "../../../../components/tools/HiddenTalent";
import SoulMateInitial from "../../../../components/tools/SoulMateInitial";
import ShipNameGenerator from "../../../../components/tools/ShipNameGenerator";
import BirthMeaning from "../../../../components/tools/BirthMeaning";
import ComingSoon from "../../../../components/ComingSoon";

const activeTools: Record<string, React.ComponentType<any>> = {
  "love-calculator": LoveCalculator,
  "weton": WetonCalculator,
  "neptu": Neptu,
  "destiny-card": DestinyCard,
  "fortune-wheel": FortuneWheel,
  "past-life": PastLife,
  "which-country": WhichCountry,
  "hidden-talent": HiddenTalent,
  "spirit-animal": SpiritAnimal,
  "aura-color": AuraColor,
  "soulmate-initials": SoulMateInitial,
  "ship-name-generator": ShipNameGenerator,
  "kalender-jawa": KalenderJawa,
  "kalender-bali": KalenderBali,
  "hari-pasaran": HariPasaran,
  "nama-bayi-jawa": NamaBayiJawa,
  "arah-rezeki": ArahRezeki,
  "watak-kelahiran": WatakKelahiran,
  "arti-mimpi": ArtiMimpi,
  "hari-baik-nikah": HariBaikNikah,
  "primbon-jodoh": PrimbonJodoh,
  "birth-meaning": BirthMeaning,
  "name-meaning": NameMeaning,
  "horoscope": Horoscop,
  "life-path": LifePath,
  "zodiac": ZodiacProfile,
  "zodiac-match": ZodiacMatch,
  "shio": ChineseZodiac,
  "numerology": Numerology,
  "lucky-number": LuckyNumber,
  "lucky-color": LuckyColor,
};

export default function ToolPage({ params }: { params: { lang: string; toolSlug: string } }) {
  const Component = activeTools[params.toolSlug];

  if (Component) {
    return (
      <main key={params.toolSlug} className="flex-1 w-full block py-10 px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* PERUBAHAN KRUSIAL ADA DI BARIS BAWAH INI 👇 */}
          <Component lang={params.lang} />
        </div>
      </main>
    );
  }

  return <ComingSoon key={`fallback-${params.toolSlug}`} slug={params.toolSlug} />;
}