import type { MetadataRoute } from 'next';

/**
 * Le site n'est pas lancé : il ne doit pas être indexé.
 *
 * L'URL de preview est publique mais non devinable — c'est le choix retenu pour
 * l'envoi client. Le noindex évite qu'elle se retrouve dans un moteur de
 * recherche avant que Laetitia ait validé quoi que ce soit, y compris le fait
 * que les films soient publiables (question 16, toujours sans réponse).
 *
 * A RETIRER AU LANCEMENT, en même temps que `robots` dans layout.tsx.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  };
}
