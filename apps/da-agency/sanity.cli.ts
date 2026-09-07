/**
 * Configuration de la CLI Sanity (`pnpm exec sanity …`) : validation du
 * schéma, gestion des webhooks. Le studio lui-même est configuré dans
 * sanity.config.ts et servi par Next sous /studio.
 */

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kytkrshh',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
});
