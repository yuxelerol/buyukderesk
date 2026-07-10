import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const host = headersList?.get?.('x-forwarded-host') ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const siteUrl = host?.startsWith?.('http') ? host : `https://${host}`;

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/hakkimizda`, lastModified: new Date() },
    { url: `${siteUrl}/haberler`, lastModified: new Date() },
    { url: `${siteUrl}/faaliyetler`, lastModified: new Date() },
    { url: `${siteUrl}/yonetim`, lastModified: new Date() },
    { url: `${siteUrl}/galeri`, lastModified: new Date() },
    { url: `${siteUrl}/videolar`, lastModified: new Date() },
    { url: `${siteUrl}/iletisim`, lastModified: new Date() },
  ];
}
