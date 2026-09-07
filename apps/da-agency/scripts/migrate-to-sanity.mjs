/**
 * Migration du contenu vers Sanity — etape 2.
 *
 * Usage:
 *   node scripts/migrate-to-sanity.mjs            passage a blanc : liste ce qui serait cree
 *   node scripts/migrate-to-sanity.mjs --apply    ecrit dans le dataset
 *
 * Sources :
 *   content/projects.ts, content/about.ts, content/site.ts   le contenu, charge tel quel
 *   public/images/manifest.json                              chemin source de chaque image
 *   public/videos/manifest.json, public/videos/loops.json     master de chaque film, point de depart cliente
 *   raw-v2/                                                   les fichiers eux-memes, en lecture seule
 *
 * Ce sont les SOURCES qui partent chez Sanity, pas les derives de public/ :
 * Sanity fait sa propre optimisation. Le master video part lui aussi, dans le
 * champ videoMaster, dont l'etape 4 tirera boucle, poster et proxy.
 *
 * Ordre : le document cliente numerote « de la plus ancienne a la plus
 * recente », 1 a 11, et l'accueil affiche 11 en premier. Sanity trie en
 * croissant, plus petit = premier : le nº 11 devient order 1, le nº 1 order 11.
 *
 * Idempotence :
 *   - identifiants deterministes (`project-<assetKey>`, `siteSettings`) ;
 *   - les assets sont retrouves par leur empreinte SHA-1 avant tout upload,
 *     un fichier deja envoye n'est pas renvoye ;
 *   - les documents sont crees s'ils manquent puis PATCHES sur leurs champs
 *     de contenu, jamais remplaces : les champs techniques remplis par
 *     l'etape 4 (videoLoop, videoPoster, videoProxy) survivent a un relancement.
 *
 * Le jeton d'ecriture vient de SANITY_API_WRITE_TOKEN dans .env.local, qui est
 * ignore par git. Il n'est lu qu'avec --apply : le passage a blanc n'en a pas
 * besoin et ne touche pas au reseau.
 */

import { createHash } from 'node:crypto';
import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { build } from 'esbuild';

import { APP_ROOT, ensureDir, formatBytes, hasFlag } from './lib/corpus.mjs';

const APPLY = hasFlag('apply');

const IMAGE_MANIFEST = join(APP_ROOT, 'public', 'images', 'manifest.json');
const VIDEO_MANIFEST = join(APP_ROOT, 'public', 'videos', 'manifest.json');
const LOOP_MANIFEST = join(APP_ROOT, 'public', 'videos', 'loops.json');

/** Identifiant fixe du singleton, le meme que dans sanity.config.ts. */
const SITE_SETTINGS_ID = 'siteSettings';

/** Nombre de projets : sert a inverser le rang de publication. */
function orderFor(publicationNumber, total) {
  return total + 1 - publicationNumber;
}

// ---------------------------------------------------------------------------
// Chargement du contenu TypeScript
// ---------------------------------------------------------------------------

/**
 * content/*.ts s'importe sans extension et charge des JSON par import par
 * defaut : Node ne sait pas l'executer tel quel. esbuild le regroupe en un
 * module ESM dans .cache/, qu'on importe ensuite. Le contenu n'est ainsi
 * jamais recopie ici : ce que le site affiche est ce qui migre.
 */
async function loadContent() {
  const cacheDir = ensureDir(resolve(APP_ROOT, '.cache'));
  const entry = join(cacheDir, 'migrate-entry.ts');
  const bundle = join(cacheDir, 'migrate-content.mjs');
  writeFileSync(
    entry,
    [
      `export { projects } from ${JSON.stringify(resolve(APP_ROOT, 'content', 'projects.ts'))};`,
      `export { about } from ${JSON.stringify(resolve(APP_ROOT, 'content', 'about.ts'))};`,
      `export { site } from ${JSON.stringify(resolve(APP_ROOT, 'content', 'site.ts'))};`,
      '',
    ].join('\n')
  );
  await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: bundle,
    logLevel: 'silent',
  });

  // projects.ts emet son rapport de contenu manquant a l'import : utile au
  // build, bruit ici.
  const warn = console.warn;
  console.warn = () => {};
  try {
    return await import(pathToFileURL(bundle).href);
  } finally {
    console.warn = warn;
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

// ---------------------------------------------------------------------------
// Plan de migration
// ---------------------------------------------------------------------------

function fileEntry(relativeSource) {
  const path = resolve(APP_ROOT, relativeSource);
  if (!existsSync(path)) throw new Error(`Source introuvable : ${relativeSource}`);
  return { path, name: basename(path), bytes: statSync(path).size };
}

function buildPlan({ projects, about, site }) {
  const images = readJson(IMAGE_MANIFEST).projects;
  const videos = readJson(VIDEO_MANIFEST).projects;
  const loops = readJson(LOOP_MANIFEST).projects;
  const total = projects.length;

  const plan = projects.map((project) => {
    const gallery = (images[project.assetKey]?.images ?? []).map((image) => ({
      id: image.id,
      orientation: image.orientation,
      ...fileEntry(image.source),
      alt: project.gallery.find((entry) => entry.id === image.id)?.alt ?? '',
    }));
    // La couverture du site est parfois un poster de boucle (AREAL KIM JONES,
    // les trois projets en film seul) : un derive produit par script, pas une
    // source cliente, qui n'a rien a faire ici. Decision du 07/09 : un projet
    // qui a une galerie prend en couverture sa premiere image PAYSAGE — les
    // tuiles d'accueil sont en 3:2, un portrait y perdrait la moitie de sa
    // hauteur —, a defaut sa premiere image ; un projet en film seul reste sans
    // couverture jusqu'a l'etape 4. Une couverture choisie a la main dans le
    // catalogue (coverImageId) garde la priorite.
    const coverId = project.cover?.id;
    const cover =
      gallery.find((image) => image.id === coverId) ??
      gallery.find((image) => image.orientation === 'landscape') ??
      gallery[0];

    const video = videos[project.assetKey];
    const master = video ? fileEntry(video.source) : undefined;
    const loop = loops[project.assetKey];
    // Un depart provisoire est un defaut technique, pas une donnee cliente :
    // il ne migre pas, le champ reste vide dans le studio.
    const loopStart = loop && !loop.posterIsProvisional ? loop.startSeconds : undefined;

    return {
      _id: `project-${project.assetKey}`,
      assetKey: project.assetKey,
      order: orderFor(project.publicationNumber, total),
      publicationNumber: project.publicationNumber,
      title: project.title,
      slug: project.slug,
      subtitle: project.eventType,
      client: project.client,
      year: project.year,
      location: project.location,
      description: project.description,
      // Un seul credit, chaine intacte : couper « Pierre MOUTON and Adrien
      // DIRAND » en deux serait une interpretation (decision du 07/09).
      credits: project.credits ? [{ role: 'Photography', name: project.credits }] : [],
      gallery,
      cover,
      master,
      loopStart,
    };
  });

  const settings = {
    _id: SITE_SETTINGS_ID,
    about: about.sections.map((section) => ({ heading: section.heading, body: section.body })),
    portrait: about.portrait ? fileEntry(about.portrait.src) : undefined,
    linkedin: site.social.find((account) => account.label === 'LinkedIn')?.href,
    instagram: site.social.find((account) => account.label === 'Instagram')?.href,
    legalNotice: site.legalNotice.length > 0 ? site.legalNotice.join('\n\n') : undefined,
  };

  return { plan, settings };
}

function printPlan({ plan, settings }) {
  let imageCount = 0;
  let imageBytes = 0;
  let videoBytes = 0;

  console.log(`\nPassage a blanc — ${plan.length} document(s) project + 1 siteSettings\n`);
  for (const item of plan) {
    const images = item.gallery.reduce((sum, image) => sum + image.bytes, 0);
    imageCount += item.gallery.length;
    imageBytes += images;
    if (item.master) videoBytes += item.master.bytes;

    console.log(`order ${String(item.order).padStart(2)}  ${item._id}`);
    console.log(`          titre      ${item.title}`);
    console.log(`          slug       ${item.slug} · ${item.year} · ${item.subtitle}${item.client ? ` · client ${item.client}` : ''}`);
    if (item.credits.length > 0) console.log(`          credits    ${item.credits.map((c) => `${c.role} — ${c.name}`).join(' ; ')}`);
    if (item.gallery.length > 0) {
      console.log(`          galerie    ${item.gallery.length} image(s) · ${formatBytes(images)}`);
      for (const image of item.gallery) {
        console.log(`                     ${image.name.padEnd(22)} ${formatBytes(image.bytes).padStart(8)}${item.cover?.id === image.id ? '   <- couverture' : ''}`);
      }
    }
    if (item.master) {
      console.log(`          master     ${item.master.name} · ${formatBytes(item.master.bytes)}${item.loopStart !== undefined ? ` · boucle a ${item.loopStart} s` : ' · pas de timecode cliente'}`);
    }
    console.log('');
  }

  console.log(`siteSettings`);
  console.log(`          a propos   ${settings.about.length} section(s) : ${settings.about.map((s) => `« ${s.heading} »`).join(', ')}`);
  console.log(`          portrait   ${settings.portrait ? settings.portrait.name : 'absent'}`);
  console.log(`          linkedin   ${settings.linkedin ?? 'absent'}`);
  console.log(`          instagram  ${settings.instagram ?? 'absent'}`);
  console.log(`          legal      ${settings.legalNotice ? `${settings.legalNotice.length} caracteres` : 'absent'}`);

  console.log(`\nTotal a uploader : ${imageCount} images (${formatBytes(imageBytes)}) + ${plan.filter((p) => p.master).length} masters video (${formatBytes(videoBytes)}) = ${formatBytes(imageBytes + videoBytes)}`);
  console.log(`Relancer avec --apply pour ecrire dans le dataset.\n`);
}

// ---------------------------------------------------------------------------
// Ecriture
// ---------------------------------------------------------------------------

/** Lit .env.local sans dependance : KEY=valeur, guillemets optionnels. */
function loadEnvLocal() {
  const path = resolve(APP_ROOT, '.env.local');
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return env;
}

async function createWriteClient() {
  const env = { ...loadEnvLocal(), ...process.env };
  const token = env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error('SANITY_API_WRITE_TOKEN manquant : a mettre dans .env.local (ignore par git), jamais dans le depot.');
  }
  const { createClient } = await import('next-sanity');
  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-21',
    token,
    useCdn: false,
  });
}

function sha1(path) {
  return createHash('sha1').update(readFileSync(path)).digest('hex');
}

/**
 * Retrouve un asset par empreinte, sinon l'uploade. Sanity indexe ses assets
 * par sha1hash : c'est ce qui rend le script relancable sans doublon ni
 * re-upload de 768 Mo.
 */
async function ensureAsset(client, kind, file, log) {
  const hash = sha1(file.path);
  const type = kind === 'image' ? 'sanity.imageAsset' : 'sanity.fileAsset';
  const existing = await client.fetch(`*[_type == $type && sha1hash == $hash][0]._id`, { type, hash });
  if (existing) {
    log(`  deja present  ${file.name}`);
    return existing;
  }
  log(`  upload        ${file.name} · ${formatBytes(file.bytes)}...`);
  const started = Date.now();
  const asset = await client.assets.upload(kind, createReadStream(file.path), {
    filename: file.name,
    contentType: kind === 'file' ? 'video/quicktime' : undefined,
  });
  log(`                ${asset._id} · ${Math.round((Date.now() - started) / 1000)} s`);
  return asset._id;
}

function imageRef(assetId, key, alt) {
  return {
    _type: 'image',
    _key: key,
    asset: { _type: 'reference', _ref: assetId },
    ...(alt ? { alt } : {}),
  };
}

async function apply({ plan, settings }) {
  const client = await createWriteClient();
  const log = (line) => console.log(line);

  for (const item of plan) {
    console.log(`\n${item._id}  (order ${item.order})`);

    const galleryRefs = [];
    for (const image of item.gallery) {
      const assetId = await ensureAsset(client, 'image', image, log);
      galleryRefs.push({ id: image.id, ref: imageRef(assetId, image.id, image.alt) });
    }
    const coverRef = item.cover ? galleryRefs.find((entry) => entry.id === item.cover.id)?.ref : undefined;
    const masterAssetId = item.master ? await ensureAsset(client, 'file', item.master, log) : undefined;

    const fields = {
      title: item.title,
      slug: { _type: 'slug', current: item.slug },
      subtitle: item.subtitle,
      order: item.order,
      year: item.year,
      isVisible: true,
      gallery: galleryRefs.map((entry) => entry.ref),
      credits: item.credits.map((credit, index) => ({ _type: 'credit', _key: `credit-${index + 1}`, ...credit })),
      ...(item.client ? { client: item.client } : {}),
      ...(item.location ? { location: item.location } : {}),
      ...(item.description ? { description: item.description } : {}),
      ...(coverRef ? { cover: { ...coverRef, _key: undefined } } : {}),
      ...(masterAssetId
        ? { videoMaster: { _type: 'file', asset: { _type: 'reference', _ref: masterAssetId } } }
        : {}),
      ...(item.loopStart !== undefined ? { loopStart: item.loopStart } : {}),
    };
    if (fields.cover) delete fields.cover._key;

    await client.createIfNotExists({ _id: item._id, _type: 'project' });
    await client.patch(item._id).set(fields).commit();
    log(`  document      ${item._id} ecrit`);
  }

  console.log(`\n${SITE_SETTINGS_ID}`);
  const portraitAssetId = settings.portrait ? await ensureAsset(client, 'image', settings.portrait, log) : undefined;
  const settingsFields = {
    about: settings.about.map((section, index) => ({
      _type: 'aboutSection',
      _key: `section-${index + 1}`,
      heading: section.heading,
      body: section.body,
    })),
    ...(settings.linkedin ? { linkedin: settings.linkedin } : {}),
    ...(settings.instagram ? { instagram: settings.instagram } : {}),
    ...(settings.legalNotice ? { legalNotice: settings.legalNotice } : {}),
    ...(portraitAssetId ? { portrait: imageRef(portraitAssetId, 'portrait') } : {}),
  };
  if (settingsFields.portrait) delete settingsFields.portrait._key;
  await client.createIfNotExists({ _id: SITE_SETTINGS_ID, _type: 'siteSettings' });
  await client.patch(SITE_SETTINGS_ID).set(settingsFields).commit();
  log(`  document      ${SITE_SETTINGS_ID} ecrit`);

  const count = await client.fetch(`count(*[_type == "project"])`);
  console.log(`\nDataset : ${count} document(s) project. Termine.\n`);
}

async function main() {
  const content = await loadContent();
  const migration = buildPlan(content);
  printPlan(migration);
  if (APPLY) await apply(migration);
}

main().catch((error) => {
  console.error(`\nEchec : ${error.message}\n`);
  process.exit(1);
});
