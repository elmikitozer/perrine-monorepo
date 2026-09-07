/**
 * Acces Sanity pour les scripts — etape 4.
 *
 * Le jeton d'ecriture vient de .env.local (SANITY_API_WRITE_TOKEN), ignore
 * par git. Les scripts de la chaine video lisent les documents project,
 * telechargent le master et ecrivent leurs derives dans les champs techniques
 * du schema, en lecture seule dans le studio mais ouverts a l'API.
 */

import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { APP_ROOT, ensureDir, formatBytes } from './corpus.mjs';

/** Masters telecharges, nommes par leur empreinte : un master ne se telecharge qu'une fois. */
export const MASTERS_DIR = resolve(APP_ROOT, '.cache', 'masters');

/** Lit .env.local sans dependance : KEY=valeur, guillemets optionnels. */
export function loadEnvLocal() {
  const path = resolve(APP_ROOT, '.env.local');
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return env;
}

export async function createWriteClient() {
  const env = { ...loadEnvLocal(), ...process.env };
  if (!env.SANITY_API_WRITE_TOKEN) {
    throw new Error('SANITY_API_WRITE_TOKEN manquant : a mettre dans .env.local (ignore par git).');
  }
  if (!env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID manquant dans .env.local.');
  }
  const { createClient } = await import('next-sanity');
  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-21',
    token: env.SANITY_API_WRITE_TOKEN,
    // Jamais le CDN pour un script qui ecrit puis relit : il verrait l'etat d'avant.
    useCdn: false,
  });
}

/**
 * Les projets qui ont un master, avec ce que la chaine video doit savoir :
 * l'asset du master (empreinte, URL, taille), le timecode cliente, et l'etat
 * des derives deja produits pour decider s'il y a quelque chose a refaire.
 */
export async function fetchFilmProjects(client, only) {
  const docs = await client.fetch(
    `*[_type == "project" && defined(videoMaster.asset)] | order(orderRank asc) {
      _id,
      title,
      loopStart,
      "master": videoMaster.asset->{ _id, url, sha1hash, size, extension, originalFilename },
      "proxyAssetId": videoProxy.asset._ref,
      "loopAssetId": videoLoop.asset._ref,
      "posterAssetId": videoPoster.asset._ref,
      videoProxyMeta,
      videoLoopMeta
    }`
  );
  const projects = docs.map((doc) => ({ ...doc, key: doc._id.replace(/^project-/, '') }));
  const selected = only ? projects.filter((project) => project.key === only) : projects;
  if (only && selected.length === 0) {
    throw new Error(`Aucun projet avec film pour --only=${only}. Disponibles : ${projects.map((p) => p.key).join(', ')}`);
  }
  return selected;
}

function sha1Of(path) {
  return createHash('sha1').update(readFileSync(path)).digest('hex');
}

/**
 * Chemin local du master, telecharge si besoin.
 *
 * Le fichier est nomme par l'empreinte SHA-1 que Sanity calcule a l'upload :
 * un master deja present n'est pas retelecharge, et un master remplace dans
 * le studio change d'empreinte donc de fichier. Un fichier present mais de
 * la mauvaise taille est un telechargement interrompu : il est refait.
 */
export async function ensureMaster(master, log = console.log) {
  ensureDir(MASTERS_DIR);
  const target = join(MASTERS_DIR, `${master.sha1hash}.${master.extension}`);
  if (existsSync(target) && statSync(target).size === master.size) return target;

  log(`  master   telechargement de ${master.originalFilename ?? master._id} · ${formatBytes(master.size)}...`);
  const response = await fetch(master.url);
  if (!response.ok || !response.body) {
    throw new Error(`Telechargement refuse (${response.status}) : ${master.url}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(target));
  const size = statSync(target).size;
  if (size !== master.size) {
    throw new Error(`Master incomplet : ${formatBytes(size)} recus pour ${formatBytes(master.size)} attendus.`);
  }
  return target;
}

/**
 * Raccourci d'operateur : un master deja sur le disque (livraison cliente)
 * est reconnu par son empreinte et lie dans le cache au lieu d'etre
 * retelecharge. Les 1,6 Go de la v2 sont dans raw-v2/, autant s'en servir.
 */
export async function seedMastersFrom(directory, masters, log = console.log) {
  ensureDir(MASTERS_DIR);
  const wanted = new Map(masters.map((master) => [master.sha1hash, master]));
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
    );
  for (const file of walk(directory)) {
    if (!/\.(mov|mp4|m4v|mxf)$/i.test(file)) continue;
    const size = statSync(file).size;
    // La taille filtre avant l'empreinte : hacher 1,6 Go pour rien serait long.
    const candidate = [...wanted.values()].find((master) => master.size === size);
    if (!candidate) continue;
    const target = join(MASTERS_DIR, `${candidate.sha1hash}.${candidate.extension}`);
    if (existsSync(target) && statSync(target).size === size) continue;
    if (sha1Of(file) !== candidate.sha1hash) continue;
    // Copie plutot que lien : le cache ne doit pas pointer dans les sources.
    await pipeline(createReadStream(file), createWriteStream(target));
    log(`  master   ${candidate.originalFilename ?? candidate._id} retrouve dans ${directory}, copie en cache`);
  }
}

/** Uploade un fichier local comme asset Sanity et renvoie son identifiant. */
export async function uploadAsset(client, kind, path, filename, contentType, log = console.log) {
  const size = statSync(path).size;
  log(`  upload   ${filename} · ${formatBytes(size)}...`);
  const started = Date.now();
  const asset = await client.assets.upload(kind, createReadStream(path), { filename, contentType });
  log(`           ${asset._id} · ${Math.round((Date.now() - started) / 1000)} s`);
  return asset._id;
}

export function fileRef(assetId) {
  return { _type: 'file', asset: { _type: 'reference', _ref: assetId } };
}

export function imageRef(assetId) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
}
