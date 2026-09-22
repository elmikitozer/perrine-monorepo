import { createClient } from 'next-sanity';

// useCdn: false — les pages qui lisent ce client sont en rendu dynamique
// (export const dynamic = 'force-dynamic'), donc chaque visite refait la
// requête. Le CDN Sanity peut mettre jusqu'à une minute à refléter un
// Publish : on lit l'API live pour que les changements soient immédiats.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-21',
  useCdn: false,
});

