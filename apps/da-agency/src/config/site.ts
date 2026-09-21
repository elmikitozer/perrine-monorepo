/**
 * Adresse publique du site et règle d'indexation. Un seul endroit : le layout,
 * robots.txt et le sitemap lisent tous les trois d'ici.
 */

/** Domaine de production, sans barre finale. */
export const SITE_URL = 'https://www.ld.productions';

/**
 * Seule la production est indexable. Les previews Vercel ont une URL publique
 * mais ne doivent pas se retrouver dans un moteur de recherche à côté du vrai
 * site ; un build local non plus. Vercel fournit VERCEL_ENV au build.
 */
export const INDEXABLE = process.env.VERCEL_ENV === 'production';
