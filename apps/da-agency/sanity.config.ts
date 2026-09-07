/**
 * Studio Sanity de LD Productions, servi sous /studio par Next.
 *
 * Deux entrées dans la colonne de gauche : les projets, triés dans l'ordre
 * d'affichage du site, et les réglages du site, document unique ouvert
 * directement. Pas d'outil Vision : la cliente n'a pas à voir un éditeur de
 * requêtes GROQ.
 *
 * Le singleton est tenu par trois verrous : la structure l'ouvre à un
 * identifiant fixe, il est retiré du menu « nouveau document », et les
 * actions de suppression, duplication et dépublication lui sont refusées.
 */

import { defineConfig } from 'sanity';
import { structureTool, type StructureResolver } from 'sanity/structure';

import { SINGLETON_TYPES, schemaTypes } from './src/sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

/** Identifiant fixe du document de réglages. Le script de migration écrit au même. */
export const SITE_SETTINGS_ID = 'siteSettings';

const structure: StructureResolver = (S) =>
  S.list()
    .title('LD Productions')
    .items([
      S.listItem()
        .title('Projets')
        .schemaType('project')
        .child(
          S.documentTypeList('project')
            .title('Projets')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Réglages du site')
        .id(SITE_SETTINGS_ID)
        .child(
          S.document().schemaType('siteSettings').documentId(SITE_SETTINGS_ID).title('Réglages du site')
        ),
    ]);

/** Actions refusées sur un singleton : il ne se supprime ni ne se duplique. */
const SINGLETON_FORBIDDEN_ACTIONS = new Set(['delete', 'duplicate', 'unpublish']);

export default defineConfig({
  name: 'ld-productions',
  title: 'LD Productions',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Pas de « nouveau document » pour un singleton.
    templates: (templates) => templates.filter((template) => !SINGLETON_TYPES.has(template.schemaType)),
  },
  document: {
    actions: (actions, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? actions.filter((action) => !action.action || !SINGLETON_FORBIDDEN_ACTIONS.has(action.action))
        : actions,
  },
});
