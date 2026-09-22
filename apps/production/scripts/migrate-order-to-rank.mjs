/**
 * Migration ponctuelle : remplace le champ numérique `order` par `orderRank`,
 * le rang LexoRank géré par @sanity/orderable-document-list désormais utilisé
 * par le schéma project et le studio (glisser-déposer).
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-order-to-rank.mjs            passage à blanc
 *   node --env-file=.env.local scripts/migrate-order-to-rank.mjs --apply    écrit dans le dataset
 *
 * Idempotent : un document qui a déjà un orderRank est sauté.
 */

import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

const APPLY = process.argv.includes('--apply');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID manquant.');
  process.exit(1);
}
if (APPLY && !token) {
  console.error('SANITY_API_TOKEN manquant : requis pour --apply.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-21',
  token,
  useCdn: false,
});

async function main() {
  const projects = await client.fetch(
    `*[_type == "project"]{_id, title, order, orderRank} | order(order asc)`,
  );

  const todo = projects.filter((p) => !p.orderRank);
  const alreadyDone = projects.length - todo.length;

  console.log(`${projects.length} projet(s) au total, ${alreadyDone} déjà migré(s), ${todo.length} à faire.`);

  if (todo.length === 0) {
    console.log('Rien à faire.');
    return;
  }

  let rank = LexoRank.middle();
  const patches = todo.map((project) => {
    const orderRank = rank.toString();
    rank = rank.genNext();
    return { project, orderRank };
  });

  for (const { project, orderRank } of patches) {
    console.log(`order ${String(project.order).padStart(2)}  ${project._id}  → orderRank ${orderRank}  (${project.title})`);
  }

  if (!APPLY) {
    console.log('\nPassage à blanc — relancer avec --apply pour écrire.');
    return;
  }

  const tx = client.transaction();
  for (const { project, orderRank } of patches) {
    tx.patch(project._id, (p) => p.set({ orderRank }).unset(['order']));
  }
  await tx.commit();

  console.log(`\n${patches.length} document(s) patché(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
