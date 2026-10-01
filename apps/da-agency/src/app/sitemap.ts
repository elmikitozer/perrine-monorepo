import type { MetadataRoute } from 'next';

import { getProjects } from '@content/projects';
import { getSiteContent } from '@content/site';
import { SITE_URL } from '@/config/site';

// Statique malgré la lecture Sanity en `no-store` : voir content/projects.ts.
export const dynamic = 'force-static';

/**
 * Accueil, à propos, pages légales et une entrée par fiche projet, dans
 * l'ordre du studio. Régénéré à chaque build, donc à chaque publication.
 * Confidentialité et conditions d'utilisation n'y sont que si leur texte est
 * saisi : sans lui, la page est en 404.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const { privacyPolicy, termsOfUse } = await getSiteContent();
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/legal` },
    ...(privacyPolicy ? [{ url: `${SITE_URL}/privacy` }] : []),
    ...(termsOfUse ? [{ url: `${SITE_URL}/terms` }] : []),
    ...projects.map((project) => ({ url: `${SITE_URL}/projects/${project.slug}` })),
  ];
}
