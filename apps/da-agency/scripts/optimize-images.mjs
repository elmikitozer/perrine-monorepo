/**
 * §3.2 de l'addendum / Phase 2 du brief — pipeline images.
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs --only=bosideng
 *   node scripts/optimize-images.mjs --force
 *   node scripts/optimize-images.mjs --prune     supprime les dérivés orphelins
 *
 * Sorties:
 *   public/images/<slug>/<image>-<largeur>.avif|webp
 *   public/images/manifest.json   dimensions réelles + LQIP, alimente projects.ts
 *
 * raw/ est traité en LECTURE SEULE (lien symbolique vers les sources client).
 *
 * Idempotence : cache par hash SHA-1 du fichier source dans
 * .cache/optimize-images.json. Une image inchangée n'est pas retraitée, sinon
 * chaque livraison de photos coûterait plusieurs minutes.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

import {
  WIDTHS,
  aspectRatio,
  buildLqip,
  expectedFilenames,
  orientationOf,
  readDimensions,
  renderVariants,
} from './lib/images.mjs';
import {
  APP_ROOT,
  MIN_USABLE_WIDTH,
  ensureDir,
  formatBytes,
  formatDuration,
  getFlagValue,
  hasFlag,
  listProjects,
  relativeToRaw,
  slugify,
} from './lib/corpus.mjs';

const OUTPUT_ROOT = resolve(APP_ROOT, 'public', 'images');
const MANIFEST_PATH = join(OUTPUT_ROOT, 'manifest.json');
const CACHE_PATH = resolve(APP_ROOT, '.cache', 'optimize-images.json');

/** Sous-dossier de public/images/ possede par extract-loops.mjs. */
const RESERVED_DIR_POSTERS = 'posters';

const FORCE = hasFlag('force');
const PRUNE = hasFlag('prune');
const ONLY = getFlagValue('only');

function hashFile(file) {
  return createHash('sha1').update(readFileSync(file)).digest('hex');
}

function loadCache() {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    console.warn('  Cache illisible, il sera reconstruit.');
    return {};
  }
}

function saveCache(cache) {
  ensureDir(resolve(APP_ROOT, '.cache'));
  writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
}

/**
 * Identifiant de sortie dérivé du nom de fichier source, pas d'un index.
 * L'inventaire suggérait `projet + index`, mais un index se décale dès qu'une
 * photo est insérée dans l'ordre alphabétique lors d'une nouvelle livraison :
 * toutes les URL suivantes changeraient. Le nom source reste stable et garde
 * la traçabilité vers le fichier d'origine.
 */
function imageId(file, taken) {
  const base = slugify(basename(file, extname(file))) || 'image';
  if (!taken.has(base)) {
    taken.add(base);
    return base;
  }
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  taken.add(`${base}-${suffix}`);
  return `${base}-${suffix}`;
}






async function main() {
  const started = Date.now();
  const cache = loadCache();

  const projects = listProjects();
  const selected = ONLY ? projects.filter((project) => project.slug === ONLY) : projects;

  if (ONLY && selected.length === 0) {
    throw new Error(
      `Aucun projet pour --only=${ONLY}. Disponibles : ${projects
        .map((project) => project.slug)
        .join(', ')}`
    );
  }

  const manifest = { generatedAt: new Date().toISOString(), widths: WIDTHS, projects: {} };
  let processed = 0;
  let skipped = 0;
  let outputBytes = 0;
  const unusable = [];

  for (const project of selected) {
    console.log(`${project.folder}  ->  ${project.slug}`);

    if (project.images.length === 0) {
      // Cas nominal : 2 projets sur 6 n'ont qu'un film (addendum §1).
      console.log(`  aucune image — projet vidéo seule, rien à faire\n`);
      manifest.projects[project.slug] = { folder: project.folder, images: [] };
      continue;
    }

    const targetDir = ensureDir(join(OUTPUT_ROOT, project.slug));
    const taken = new Set();
    const entries = [];

    for (const file of project.images) {
      const id = imageId(file, taken);
      const relative = relativeToRaw(file);
      const hash = hashFile(file);
      const { width, height } = await readDimensions(file);

      const belowMinWidth = width < MIN_USABLE_WIDTH;
      if (belowMinWidth) unusable.push({ project: project.slug, file: basename(file), width });

      const cached = cache[relative];
      const outputsExist =
        cached?.entry && expectedFilenames(cached.entry).every((name) => existsSync(join(targetDir, name)));

      if (!FORCE && cached?.hash === hash && outputsExist) {
        entries.push(cached.entry);
        skipped += 1;
        continue;
      }

      const variants = await renderVariants({
        file,
        targetDir,
        publicDir: `/images/${project.slug}`,
        id,
        sourceWidth: width,
      });
      const lqip = await buildLqip(file);

      const entry = {
        id,
        source: relative,
        width,
        height,
        orientation: orientationOf(width, height),
        aspectRatio: aspectRatio(width, height),
        // Sous 1600 px l'image n'est pas exploitable en pleine largeur.
        // On la traite quand même : c'est projects.ts qui décide de l'exclure.
        belowMinWidth,
        lqip,
        variants,
        // Jamais généré automatiquement : un alt inventé est pire que pas d'alt.
        alt: '',
      };

      entries.push(entry);
      cache[relative] = { hash, entry };
      processed += 1;
    }

    for (const entry of entries) {
      for (const format of Object.keys(entry.variants)) {
        for (const variant of entry.variants[format]) outputBytes += variant.bytes;
      }
    }

    manifest.projects[project.slug] = { folder: project.folder, images: entries };

    const orientations = entries.reduce((accumulator, entry) => {
      accumulator[entry.orientation] = (accumulator[entry.orientation] ?? 0) + 1;
      return accumulator;
    }, {});

    console.log(
      `  ${entries.length} image(s) · ` +
        Object.entries(orientations)
          .map(([key, value]) => `${value} ${key}`)
          .join(', ')
    );

    if (PRUNE) {
      const expected = new Set(entries.flatMap((entry) => expectedFilenames(entry)));
      const orphans = readdirSync(targetDir).filter((name) => !expected.has(name));
      for (const orphan of orphans) rmSync(join(targetDir, orphan), { force: true });
      if (orphans.length > 0) console.log(`  ${orphans.length} dérivé(s) orphelin(s) supprimé(s)`);
    }

    console.log('');
  }

  // Un projet retire du catalogue laisse un dossier entier de derives derriere
  // lui. public/images/ etant versionne, ces fichiers seraient committes alors
  // que le projet n'existe plus. Seul un run complet peut en juger : en --only
  // on ne voit qu'un projet.
  if (PRUNE && !ONLY && existsSync(OUTPUT_ROOT)) {
    // `posters` appartient a extract-loops.mjs, pas a ce pipeline : sans cette
    // exception, un --prune effacerait des derives qu'il ne sait pas regenerer.
    const known = new Set([...selected.map((project) => project.slug), RESERVED_DIR_POSTERS]);
    const staleDirs = readdirSync(OUTPUT_ROOT, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !known.has(entry.name))
      .map((entry) => entry.name);

    for (const dir of staleDirs) {
      rmSync(join(OUTPUT_ROOT, dir), { recursive: true, force: true });
      console.log(`Dossier hors catalogue supprime : public/images/${dir}/`);
    }
    if (staleDirs.length > 0) console.log('');
  }

  saveCache(cache);

  let merged = manifest;
  if (ONLY && existsSync(MANIFEST_PATH)) {
    const previous = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
    merged = {
      generatedAt: manifest.generatedAt,
      widths: WIDTHS,
      projects: { ...previous.projects, ...manifest.projects },
    };
  }

  ensureDir(OUTPUT_ROOT);
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);

  console.log(`${processed} image(s) traitée(s), ${skipped} inchangée(s).`);
  console.log(`Dérivés : ${formatBytes(outputBytes)} dans public/images/`);
  console.log(`Manifeste : public/images/manifest.json`);

  if (unusable.length > 0) {
    console.log(`\n${unusable.length} image(s) sous ${MIN_USABLE_WIDTH} px, marquées belowMinWidth :`);
    for (const item of unusable) {
      console.log(`  ${item.project}/${item.file} — ${item.width} px`);
    }
    console.log(`  Elles ne sont pas supprimées, mais ne doivent pas servir en pleine largeur.`);
  }

  if (!PRUNE) {
    const orphanCount = selected.reduce((total, project) => {
      const targetDir = join(OUTPUT_ROOT, project.slug);
      if (!existsSync(targetDir)) return total;
      const expected = new Set(
        (merged.projects[project.slug]?.images ?? []).flatMap((entry) => expectedFilenames(entry))
      );
      return total + readdirSync(targetDir).filter((name) => !expected.has(name)).length;
    }, 0);
    if (orphanCount > 0) {
      console.log(`\n${orphanCount} dérivé(s) orphelin(s). Relancer avec --prune pour les supprimer.`);
    }
  }

  console.log(`\nTerminé en ${formatDuration((Date.now() - started) / 1000)}.\n`);
}

main().catch((error) => {
  console.error(`\nÉchec : ${error.message}\n`);
  process.exit(1);
});
