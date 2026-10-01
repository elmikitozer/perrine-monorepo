/**
 * Nom, adresse publique du site et règle d'indexation. Un seul endroit : le
 * layout, les fiches projet, robots.txt et le sitemap lisent d'ici.
 */

/** Nom affiché par les aperçus de lien (og:site_name) et le titre par défaut. */
export const SITE_NAME = 'LD Productions';

/** Domaine de production, sans barre finale. */
export const SITE_URL = 'https://www.ld.productions';

/**
 * Seule la production est indexable. Les previews Vercel ont une URL publique
 * mais ne doivent pas se retrouver dans un moteur de recherche à côté du vrai
 * site ; un build local non plus. Vercel fournit VERCEL_ENV au build.
 */
export const INDEXABLE = process.env.VERCEL_ENV === 'production';

/**
 * Champs Open Graph communs à toutes les pages. Next ne fusionne pas
 * `openGraph` entre layout et page : une page qui définit le sien (les fiches
 * projet, pour leur visuel) doit repartir de cette base, sinon elle perd le
 * nom du site dans l'aperçu.
 *
 * Pas de `title` ni d'`url` : sans eux, chaque page garde son propre <title>
 * et son adresse dans l'aperçu, au lieu de ceux de l'accueil.
 */
export const OPEN_GRAPH_BASE = {
  type: 'website',
  siteName: SITE_NAME,
  locale: 'en_US',
} as const;
