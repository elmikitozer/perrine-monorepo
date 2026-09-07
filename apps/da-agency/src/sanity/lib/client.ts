/**
 * Client Sanity du site, en lecture seule.
 *
 * Le site est statique : chaque requête part au build, jamais à la visite.
 * Deux requêtes par build, donc PAS de CDN : le CDN Sanity sert une copie qui
 * peut avoir plusieurs minutes de retard, et un déploiement déclenché par une
 * publication (étape 5) construirait le contenu d'avant la publication.
 * Constaté le 07/09 : les rangs venaient d'être écrits, l'API les voyait, le
 * CDN non, et l'accueil est sorti dans l'ordre alphabétique.
 *
 * Le jeton d'écriture n'a rien à faire ici — il ne sert qu'aux scripts, qui
 * le lisent dans .env.local.
 *
 * L'identifiant de projet est exigé : sans lui, next-sanity interrogerait un
 * projet vide et le site se construirait sans un seul projet, sans erreur.
 * Mieux vaut l'échec au build.
 */

import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_PROJECT_ID manquant. En local : .env.local ; sur Vercel : variables du projet.'
  );
}

export const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-21',
  useCdn: false,
});
