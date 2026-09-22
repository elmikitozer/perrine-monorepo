import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { defineConfig } from 'sanity';
import { structureTool, type StructureResolver } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

/**
 * Les projets s'affichent dans une liste réordonnable par glisser-déposer
 * (@sanity/orderable-document-list) : l'ordre de la liste EST l'ordre de
 * l'accueil, la requête du site trie sur le même champ orderRank.
 */
const structure: StructureResolver = (S, context) =>
  S.list()
    .title('PV Studio')
    .items([
      orderableDocumentListDeskItem({ type: 'project', title: 'Projets', S, context }),
      S.divider(),
      S.documentTypeListItem('aboutPage').title('Page À propos'),
    ]);

export default defineConfig({
  name: 'pv-studio',
  title: 'PV Studio',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
