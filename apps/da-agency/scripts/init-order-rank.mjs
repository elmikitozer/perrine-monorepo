/**
 * Initialise `orderRank` sur les documents project a partir de leur `order`.
 *
 * Usage:
 *   node scripts/init-order-rank.mjs            passage a blanc
 *   node scripts/init-order-rank.mjs --apply    ecrit les rangs
 *
 * Pourquoi : la premiere migration a ecrit un entier `order` (1 = premier).
 * Le studio est passe a @sanity/orderable-document-list, qui trie sur un rang
 * LexoRank `orderRank` et que la cliente reordonne par glisser-deposer. Sans
 * ce script, les 11 projets n'ont pas de rang et la requete du site les rend
 * dans un ordre arbitraire. On conserve l'ordre present : les documents sont
 * tries par `order` croissant et recoivent des rangs en chaine, comme le
 * plugin le fait pour une liste neuve.
 *
 * Idempotent : un document qui a deja un rang n'est pas touche, sauf --force.
 * `order` est conserve, il ne gene pas et garde la trace de la migration.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { LexoRank } from 'lexorank';

import { APP_ROOT, hasFlag } from './lib/corpus.mjs';

const APPLY = hasFlag('apply');
const FORCE = hasFlag('force');

function loadEnvLocal() {
  const path = resolve(APP_ROOT, '.env.local');
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return env;
}

async function main() {
  const env = { ...loadEnvLocal(), ...process.env };
  const { createClient } = await import('next-sanity');
  const client = createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-21',
    token: APPLY ? env.SANITY_API_WRITE_TOKEN : undefined,
    useCdn: false,
  });
  if (APPLY && !env.SANITY_API_WRITE_TOKEN) {
    throw new Error('SANITY_API_WRITE_TOKEN manquant dans .env.local.');
  }

  const docs = await client.fetch(
    `*[_type == "project"] | order(order asc, _id asc) { _id, title, order, orderRank }`
  );
  if (docs.length === 0) throw new Error('Aucun document project dans le dataset.');

  const missingOrder = docs.filter((doc) => doc.order === undefined || doc.order === null);
  if (missingOrder.length > 0 && !FORCE) {
    throw new Error(
      `${missingOrder.length} document(s) sans \`order\` : ${missingOrder.map((d) => d._id).join(', ')}. ` +
        `L'ordre a conserver est inconnu ; --force les range en fin de liste.`
    );
  }

  let rank = LexoRank.middle();
  const plan = docs.map((doc) => {
    const current = rank.toString();
    rank = rank.genNext();
    const keep = doc.orderRank && !FORCE;
    return { ...doc, next: keep ? doc.orderRank : current, changed: !keep };
  });

  console.log(`\n${APPLY ? 'Ecriture' : 'Passage a blanc'} — ${docs.length} document(s)\n`);
  for (const item of plan) {
    console.log(
      `order ${String(item.order ?? '-').padStart(2)}  ${item._id.padEnd(42)} ${item.next}${item.changed ? '' : '  (deja en place)'}`
    );
  }

  if (!APPLY) {
    console.log(`\nRelancer avec --apply pour ecrire.\n`);
    return;
  }

  const changed = plan.filter((item) => item.changed);
  if (changed.length === 0) {
    console.log('\nRien a ecrire.\n');
    return;
  }
  const transaction = changed.reduce(
    (tx, item) => tx.patch(item._id, (patch) => patch.set({ orderRank: item.next })),
    client.transaction()
  );
  await transaction.commit();
  console.log(`\n${changed.length} rang(s) ecrit(s).\n`);
}

main().catch((error) => {
  console.error(`\nEchec : ${error.message}\n`);
  process.exit(1);
});
