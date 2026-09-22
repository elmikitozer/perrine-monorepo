// Sur Vercel, VERCEL_PROJECT_PRODUCTION_URL est fourni automatiquement : les URLs
// canoniques et les images de partage restent justes même sans variable manuelle.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3002');

export const siteName = 'PV Studio';
export const personName = 'Perrine Vaël-Roquère';
export const siteDescription =
  'Perrine Vaël-Roquère — coordination de défilés et direction artistique pour la mode : collections, backstage, line-up, stylisme et shootings. Basée à Paris.';
