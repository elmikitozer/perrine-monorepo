/**
 * Boucles de survol — extraits courts et legers, pour les tuiles de l'accueil.
 *
 * Usage:
 *   node scripts/extract-loops.mjs
 *   node scripts/extract-loops.mjs --only=bosideng
 *   node scripts/extract-loops.mjs --force
 *   node scripts/extract-loops.mjs --start=12        (secondes, tous les films)
 *
 * Sorties:
 *   public/videos/loops/<slug>.mp4        extrait muet de 8 s (gitignore)
 *   public/videos/loops/<slug>.jpg        premiere frame de la boucle (gitignore)
 *   public/images/posters/<slug>/*.avif   derives du poster (versionnes)
 *   public/videos/loops.json              manifeste versionne
 *
 * Le poster est un DEPANNAGE TECHNIQUE, pas un choix editorial : il vient du
 * timecode de depart arbitraire de l'extrait. Le contenu le marque
 * `posterIsProvisional` et reportMissingContent() le signale, jusqu'a ce que la
 * cliente donne son timecode.
 *
 * Pourquoi un manifeste separe de public/videos/manifest.json : deux scripts
 * qui ecrivent le meme fichier finissent par s'ecraser l'un l'autre. Chacun
 * possede le sien, content/projects.ts fusionne a la lecture.
 *
 * raw/ est traite en LECTURE SEULE.
 */

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

import { buildLqip, readDimensions, renderVariants } from './lib/images.mjs';
import {
  APP_ROOT,
  ensureDir,
  formatBytes,
  formatDuration,
  getFlagValue,
  hasFlag,
  listProjects,
  relativeToRaw,
} from './lib/corpus.mjs';

const LOOP_DIR = resolve(APP_ROOT, 'public', 'videos', 'loops');
const MANIFEST_PATH = resolve(APP_ROOT, 'public', 'videos', 'loops.json');
const CACHE_PATH = resolve(APP_ROOT, '.cache', 'extract-loops.json');
const POSTER_OUTPUT_ROOT = resolve(APP_ROOT, 'public', 'images', 'posters');

const LOOP_SECONDS = 8;
const LOOP_WIDTH = 1280;
const LOOP_CRF = 26;

/**
 * Ou commencer l'extrait, en fraction de la duree du film.
 *
 * Demarrer a zero attrape souvent un fondu au noir ou un carton de titre. 15 %
 * tombe apres l'ouverture sur les trois films livres, mais reste un choix
 * TECHNIQUE par defaut, pas un choix editorial : c'est au client de valider
 * l'extrait, comme il doit valider la frame de poster. `--start` force une
 * valeur en secondes.
 */
const DEFAULT_START_FRACTION = 0.15;

/** ~2 Mo vise par extrait ; au-dela on previent plutot que d'echouer. */
const SIZE_BUDGET_BYTES = 2.5 * 1024 * 1024;

const FORCE = hasFlag('force');
const ONLY = getFlagValue('only');
const START_OVERRIDE = getFlagValue('start');

function run(command, args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stdout.on('data', () => {});
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
      if (stderr.length > 40_000) stderr = stderr.slice(-40_000);
    });
    child.on('error', (error) =>
      rejectPromise(
        error.code === 'ENOENT'
          ? new Error(`${command} est introuvable. Sur macOS : brew install ${command}`)
          : error
      )
    );
    child.on('close', (code) =>
      code === 0
        ? resolvePromise()
        : rejectPromise(new Error(`${command} a echoue (code ${code})\n${stderr.trim()}`))
    );
  });
}

function ffprobe(file) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height',
      '-show_entries', 'format=duration',
      '-of', 'json',
      file,
    ]);
    let stdout = '';
    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code !== 0) return rejectPromise(new Error(`ffprobe a echoue sur ${basename(file)}`));
      const parsed = JSON.parse(stdout);
      const stream = parsed.streams?.[0];
      resolvePromise({
        width: stream?.width,
        height: stream?.height,
        durationSeconds: Number(parsed.format?.duration ?? 0),
      });
    });
  });
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

function sourceFingerprint(file) {
  const stats = statSync(file);
  return `${stats.size}:${Math.round(stats.mtimeMs)}`;
}

/**
 * Reglages d'encodage, hors chemins. Sans audio : la boucle est muette par
 * conception, et la piste PCM du master pese plus lourd que l'image extraite.
 */
function encodeArgs() {
  return [
    '-t', String(LOOP_SECONDS),
    '-an',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    '-crf', String(LOOP_CRF),
    '-preset', 'slow',
    // `setpts=PTS-STARTPTS` remet la premiere image a t=0.
    //
    // Sans lui, `-ss` peut tomber entre deux images cles et produire un flux qui
    // demarre a 0.04 s — c'est ce qui arrivait au master 4K de Dior Trunk Show,
    // seul des trois. Consequences : `currentTime = 0` visait une position
    // AVANT la premiere image, le rembobinage et le rebouclage atterrissaient
    // dans le vide, et la lecture ne partait donc pas sur l'image de couverture.
    '-vf', `scale=${LOOP_WIDTH}:-2,setpts=PTS-STARTPTS`,
    '-movflags', '+faststart',
  ];
}

function profileFingerprint(startSeconds) {
  // Le point de depart fait partie du profil : le changer doit reextraire.
  return createHash('sha1')
    .update([`ss=${startSeconds.toFixed(2)}`, ...encodeArgs()].join(' '))
    .digest('hex')
    .slice(0, 12);
}

function startFor(probe) {
  if (START_OVERRIDE !== undefined) return Math.max(0, Number(START_OVERRIDE));
  // On garde la fin de l'extrait dans le film, sinon ffmpeg sort plus court.
  const latest = Math.max(0, probe.durationSeconds - LOOP_SECONDS);
  return Math.min(probe.durationSeconds * DEFAULT_START_FRACTION, latest);
}

async function extract(source, target, startSeconds) {
  ensureDir(LOOP_DIR);
  await run('ffmpeg', [
    '-y',
    '-loglevel', 'error',
    // -ss avant -i : ffmpeg se positionne par recherche au lieu de decoder
    // tout le film depuis le debut. Sur un master de 700 Mo, la difference
    // se compte en minutes.
    '-ss', String(startSeconds),
    '-i', source,
    ...encodeArgs(),
    target,
  ]);
}

/**
 * Premiere frame de la boucle, prise SUR LA BOUCLE et non sur le master.
 *
 * Le master donnerait une image plus definie (jusqu'a 3840 px), mais `-ss` se
 * cale sur une image cle : le poster risquerait d'etre decale d'une ou deux
 * frames et la tuile sauterait visiblement au demarrage. Extraire de la boucle
 * garantit que le poster EST son image de depart, donc une transition invisible.
 * 1280 px suffisent : la tuile fait ~480 px, le lecteur de la fiche ~1152 px.
 */
async function extractPosterFrame(loopFile, target) {
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', loopFile, '-frames:v', '1', '-q:v', '2', target]);
}

/** Passe la frame par le pipeline d'images commun : memes variantes, meme LQIP. */
async function buildPoster(frameFile, slug) {
  const targetDir = ensureDir(join(POSTER_OUTPUT_ROOT, slug));
  const { width, height } = await readDimensions(frameFile);

  const variants = await renderVariants({
    file: frameFile,
    targetDir,
    publicDir: `/images/posters/${slug}`,
    id: slug,
    sourceWidth: width,
  });

  return {
    id: slug,
    width,
    height,
    lqip: await buildLqip(frameFile),
    variants,
    // Aucun alt : ce n'est pas au script d'ecrire un texte alternatif.
    alt: '',
  };
}

async function main() {
  const started = Date.now();
  const cache = loadCache();

  const projects = listProjects().filter((project) => project.videos.length > 0);
  const selected = ONLY ? projects.filter((project) => project.slug === ONLY) : projects;

  if (ONLY && selected.length === 0) {
    throw new Error(
      `Aucun projet video pour --only=${ONLY}. Disponibles : ${projects
        .map((project) => project.slug)
        .join(', ')}`
    );
  }

  console.log(`\n${selected.length} film(s) a extraire\n`);

  const manifest = { generatedAt: new Date().toISOString(), seconds: LOOP_SECONDS, projects: {} };

  for (const project of selected) {
    const source = project.videos[0];
    const probe = await ffprobe(source);
    const startSeconds = startFor(probe);
    const fingerprint = sourceFingerprint(source);
    const profile = profileFingerprint(startSeconds);
    const target = join(LOOP_DIR, `${project.slug}.mp4`);

    console.log(`${project.folder}  ->  ${project.slug}`);

    const frameTarget = join(LOOP_DIR, `${project.slug}.jpg`);
    const cached = cache[project.slug];
    const fresh =
      !FORCE &&
      cached?.fingerprint === fingerprint &&
      cached?.profile === profile &&
      existsSync(target) &&
      existsSync(frameTarget) &&
      cached?.poster;

    let poster;
    if (fresh) {
      poster = cached.poster;
      console.log(`  inchange, on saute (${formatBytes(statSync(target).size)})`);
    } else {
      const startedAt = Date.now();
      process.stdout.write(`  extraction a ${startSeconds.toFixed(1)} s...`);
      await extract(source, target, startSeconds);
      const size = statSync(target).size;
      console.log(
        `\r  ${LOOP_SECONDS} s a partir de ${startSeconds.toFixed(1)} s · ${LOOP_WIDTH} px · ` +
          `${formatBytes(size)} · ${formatDuration((Date.now() - startedAt) / 1000)}   `
      );
      if (size > SIZE_BUDGET_BYTES) {
        console.log(
          `  Au-dessus du budget de ${formatBytes(SIZE_BUDGET_BYTES)} : ` +
            `monter le CRF au-dela de ${LOOP_CRF} si c'est genant.`
        );
      }

      await extractPosterFrame(target, frameTarget);
      poster = await buildPoster(frameTarget, project.slug);
      const posterBytes = Object.values(poster.variants)
        .flat()
        .reduce((sum, variant) => sum + variant.bytes, 0);
      console.log(
        `  poster ${poster.width}x${poster.height} · ` +
          `${Object.values(poster.variants).flat().length} derives · ${formatBytes(posterBytes)}`
      );
    }

    cache[project.slug] = { fingerprint, profile, poster, source: relativeToRaw(source) };

    const loopProbe = await ffprobe(target);
    manifest.projects[project.slug] = {
      src: `/videos/loops/${project.slug}.mp4`,
      width: loopProbe.width,
      height: loopProbe.height,
      durationSeconds: Number(loopProbe.durationSeconds.toFixed(2)),
      startSeconds: Number(startSeconds.toFixed(2)),
      bytes: statSync(target).size,
      // Provisoire par construction : issu du timecode de depart par defaut.
      poster,
      posterIsProvisional: true,
    };

    console.log('');
  }

  saveCache(cache);

  let merged = manifest;
  if (ONLY && existsSync(MANIFEST_PATH)) {
    const previous = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
    merged = {
      generatedAt: manifest.generatedAt,
      seconds: LOOP_SECONDS,
      projects: { ...previous.projects, ...manifest.projects },
    };
  }

  ensureDir(resolve(APP_ROOT, 'public', 'videos'));
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);

  const total = Object.values(merged.projects).reduce((sum, entry) => sum + entry.bytes, 0);
  console.log(`Manifeste  public/videos/loops.json`);
  console.log(`Total      ${formatBytes(total)} pour ${Object.keys(merged.projects).length} boucle(s)`);
  console.log(`\nTermine en ${formatDuration((Date.now() - started) / 1000)}.\n`);
}

main().catch((error) => {
  console.error(`\nEchec : ${error.message}\n`);
  process.exit(1);
});
