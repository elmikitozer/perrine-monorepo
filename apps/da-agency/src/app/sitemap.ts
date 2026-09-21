import type { MetadataRoute } from 'next';

import { getProjects } from '@content/projects';
import { SITE_URL } from '@/config/site';

// Statique malgré la lecture Sanity en `no-store` : voir content/projects.ts.
export const dynamic = 'force-static';

/**
 * Accueil, à propos, mentions légales et une entrée par fiche projet, dans
 * l'ordre du studio. Régénéré à chaque build, donc à chaque publication.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/legal` },
    ...projects.map((project) => ({ url: `${SITE_URL}/projects/${project.slug}` })),
  ];
}
