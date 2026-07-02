import { MetadataRoute } from 'next';

const DOMAIN = "https://aksaradiri.my.id"; // GANTI DENGAN DOMAIN ASLI ANDA NANTI
const LANGUAGES = ['id', 'en', 'es'];

// Daftar rute statis utama
const STATIC_ROUTES = [
  '',
  '/contact',
  '/legal/privacy',
  '/legal/terms',
  '/category/personality',
  '/category/astrology',
  '/category/local',
  '/category/viral'
];

// Daftar rute tools (ambil beberapa yang paling prioritas/populer)
const TOOLS_ROUTES = [
  '/test/mbti',
  '/tools/weton',
  '/tools/destiny-card',
  '/tools/which-country',
  '/tools/zodiac',
  '/tools/soulmate-initials'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Looping semua bahasa dan semua rute
  LANGUAGES.forEach((lang) => {
    // 1. Masukkan rute statis
    STATIC_ROUTES.forEach((route) => {
      sitemapEntries.push({
        url: `${DOMAIN}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });

    // 2. Masukkan rute tools
    TOOLS_ROUTES.forEach((route) => {
      sitemapEntries.push({
        url: `${DOMAIN}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    });
  });

  return sitemapEntries;
}