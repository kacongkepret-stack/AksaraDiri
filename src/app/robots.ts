import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://aksaradiri.my.id/sitemap.xml',
    host: 'https://aksaradiri.my.id',
  }
}
