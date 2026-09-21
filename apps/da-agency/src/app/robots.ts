import type { MetadataRoute } from 'next';

import { INDEXABLE, SITE_URL } from '@/config/site';

/**
 * Le site est lancé : la production est ouverte aux moteurs et annonce son
 * sitemap. Les previews restent fermées, voir src/config/site.ts.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
