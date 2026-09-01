/**
 * §3.1 de l'addendum — transcodage des masters + planches de candidats poster.
 *
 * Usage:
 *   node scripts/transcode-video.mjs
 *   node scripts/transcode-video.mjs --only=bosideng
 *   node scripts/transcode-video.mjs --force
 *   node scripts/transcode-video.mjs --posters-only
 *
 * Sorties:
 *   public/videos/<slug>.mp4                  proxy H.264 servi par Next (mp4 gitignores)
 *   media/poster-candidates/<slug>/%03d.jpg   planche de frames, 1 toutes les 5 s (gitignore)
 *   public/videos/manifest.json               metadonnees versionnees (duree, ratio reel)
 *
 * Les proxys vivent sous public/ parce que Next ne sert que ce qui s'y trouve :
 * un fichier dans media/ n'aurait pas d'URL. Seul le manifeste est versionne,
 * les .mp4 sont gitignores et regenerables depuis raw/.
 *
 * raw/ est traite en LECTURE SEULE. C'est un lien symbolique vers le dossier
 * de sources du client : une ecriture involontaire irait polluer ses fichiers
 * originaux. Toutes les sorties passent par ensureDir(), qui refuse tout
 * chemin retombant dans raw/.
 *
 * Ce script NE CHOISIT PAS la frame de poster (addendum §4). Il produit la
 * planche, le client tranche.
 */

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

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

const PROXY_DIR = resolve(APP_ROOT, 'public', 'videos');
const POSTER_DIR = resolve(APP_ROOT, 'media', 'poster-candidates');
const MANIFEST_PATH = resolve(APP_ROOT, 'public', 'videos', 'manifest.json');
const CACHE_PATH = resolve(APP_ROOT, '.cache', 'transcode-video.json');

/** Une frame toutes les 5 s, redimensionnee a 2048 px de large. */
const POSTER_INTERVAL_SECONDS = 5;
const POSTER_WIDTH = 2048;

/** Plafond de hauteur du proxy. Voir encodeArgs(). */
const MAX_PROXY_HEIGHT = 1080;

const FORCE = hasFlag('force');
const POSTERS_ONLY = hasFlag('posters-only');
const PROXY_ONLY = hasFlag('proxy-only');
const ONLY = getFlagValue('only');

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

    child.on('close', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${command} a echoue (code ${code})\n${stderr.trim()}`));
    });
  });
}

function ffprobe(file) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,codec_name,pix_fmt,r_frame_rate',
      '-show_entries', 'format=duration',
      '-of', 'json',
      file,
    ]);

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.stderr.on('data', (chunk) => (stderr += chunk));
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code !== 0) return rejectPromise(new Error(`ffprobe a echoue : ${stderr.trim()}`));

      const parsed = JSON.parse(stdout);
      const stream = parsed.streams?.[0];
      if (!stream) return rejectPromise(new Error(`Aucune piste video dans ${basename(file)}`));

      resolvePromise({
        width: stream.width,
        height: stream.height,
        codec: stream.codec_name,
        pixelFormat: stream.pix_fmt,
        frameRate: stream.r_frame_rate,
        durationSeconds: Number(parsed.format?.duration ?? 0),
      });
    });
  });
}

/**
 * Idempotence.
 *
 * Les images sont mises en cache par hash (cf. optimize-images.mjs), mais ces
 * masters pesent jusqu'a 768 Mo : les rehacher a chaque lancement couterait
 * plus longtemps que le transcodage qu'on cherche a eviter. On se base donc
 * sur taille + date de modification de la source, ce qui suffit pour un
 * dossier de livraison client. `--force` retranscode inconditionnellement.
 */
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

/** Reduit le ratio a sa forme la plus simple, pour le CSS `aspect-ratio`. */
function aspectRatio(width, height) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Reglages d'encodage du proxy, hors chemins d'entree/sortie.
 *
 * Le proxy est plafonne a 1080p de hauteur. Au-dela, le poids explose sans
 * benefice : le master 4K de Dior Trunk Show produisait 169 Mo, pour un lecteur
 * qui ne depassera jamais la largeur d'une page. Les sources deja en 1080 ne
 * recoivent aucun filtre, ce qui evite de les reencoder pour rien.
 */
function encodeArgs(probe) {
  const scale = probe.height > MAX_PROXY_HEIGHT ? ['-vf', `scale=-2:${MAX_PROXY_HEIGHT}`] : [];

  return [
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    // CRF 23 et non 18 : a 1080p la difference visuelle est negligeable, mais
    // 18 produisait des fichiers de 30 a 92 Mo — des mezzanines, pas des
    // fichiers de diffusion. Un lien client doit se charger, pas se telecharger.
    '-crf', '23',
    '-preset', 'slow',
    ...scale,
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
  ];
}

/**
 * Empreinte des reglages. Stockee a cote de celle de la source : changer un
 * parametre d'encodage invalide le cache, sinon une modification des reglages
 * laisserait en place des proxys produits avec les anciens.
 */
function profileFingerprint(probe) {
  return createHash('sha1').update(encodeArgs(probe).join(' ')).digest('hex').slice(0, 12);
}

async function transcode(source, target, probe) {
  ensureDir(PROXY_DIR);
  await run('ffmpeg', [
    '-y',
    '-loglevel', 'error',
    '-i', source,
    ...encodeArgs(probe),
    target,
  ]);
}

async function extractPosterCandidates(source, slug) {
  const target = ensureDir(join(POSTER_DIR, slug));
  await run('ffmpeg', [
    '-y',
    '-loglevel', 'error',
    '-i', source,
    '-vf', `fps=1/${POSTER_INTERVAL_SECONDS},scale=${POSTER_WIDTH}:-2`,
    '-q:v', '2',
    join(target, '%03d.jpg'),
  ]);

  return readdirSync(target)
    .filter((name) => name.endsWith('.jpg'))
    .sort();
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

  console.log(`\n${selected.length} projet(s) avec film\n`);

  const manifest = { generatedAt: new Date().toISOString(), projects: {} };

  for (const project of selected) {
    console.log(`${project.folder}  ->  ${project.slug}`);

    if (project.videos.length > 1) {
      console.log(
        `  ${project.videos.length} fichiers video : seul le premier devient le proxy, ` +
          `les autres sont ignores. A trancher si ce n'est pas voulu.`
      );
    }

    const source = project.videos[0];
    const probe = await ffprobe(source);
    const fingerprint = sourceFingerprint(source);
    const proxyPath = join(PROXY_DIR, `${project.slug}.mp4`);
    const posterPath = join(POSTER_DIR, project.slug);

    console.log(
      `  source  ${basename(source)}` +
        `\n          ${probe.width}x${probe.height} · ${probe.codec} ${probe.pixelFormat}` +
        ` · ${formatDuration(probe.durationSeconds)} · ${formatBytes(statSync(source).size)}`
    );

    const cached = cache[project.slug];
    const profile = profileFingerprint(probe);
    // Les posters sont extraits de la source, pas du proxy : ils ne dependent
    // pas du profil d'encodage et n'ont pas a etre refaits quand il change.
    const proxyIsFresh =
      !FORCE &&
      cached?.fingerprint === fingerprint &&
      cached?.profile === profile &&
      existsSync(proxyPath);
    const postersAreFresh =
      !FORCE &&
      cached?.fingerprint === fingerprint &&
      existsSync(posterPath) &&
      readdirSync(posterPath).some((name) => name.endsWith('.jpg'));

    if (!POSTERS_ONLY) {
      if (proxyIsFresh) {
        console.log(`  proxy   inchange, on saute (${formatBytes(statSync(proxyPath).size)})`);
      } else {
        const startedAt = Date.now();
        process.stdout.write('  proxy   transcodage en cours...');
        await transcode(source, proxyPath, probe);
        console.log(
          `\r  proxy   ${basename(proxyPath)} · ${formatBytes(statSync(proxyPath).size)}` +
            ` · ${formatDuration((Date.now() - startedAt) / 1000)}   `
        );
      }
    }

    let posterFiles = [];
    if (!PROXY_ONLY) {
      if (postersAreFresh) {
        posterFiles = readdirSync(posterPath).filter((name) => name.endsWith('.jpg')).sort();
        console.log(`  posters inchanges, on saute (${posterFiles.length} candidats)`);
      } else {
        posterFiles = await extractPosterCandidates(source, project.slug);
        console.log(
          `  posters ${posterFiles.length} candidats, 1 toutes les ${POSTER_INTERVAL_SECONDS} s`
        );
      }
    } else if (existsSync(posterPath)) {
      posterFiles = readdirSync(posterPath).filter((name) => name.endsWith('.jpg')).sort();
    }

    cache[project.slug] = { fingerprint, profile, source: relativeToRaw(source) };

    // Le proxy peut avoir ete reduit : on annonce ses dimensions reelles, pas
    // celles du master, sinon le manifeste decrit un fichier qui n'existe pas.
    const proxyProbe = await ffprobe(proxyPath);

    manifest.projects[project.slug] = {
      folder: project.folder,
      source: relativeToRaw(source),
      // URL publique, pas un chemin disque : c'est ce que consomme le lecteur.
      proxy: `/videos/${project.slug}.mp4`,
      width: proxyProbe.width,
      height: proxyProbe.height,
      sourceWidth: probe.width,
      sourceHeight: probe.height,
      aspectRatio: aspectRatio(proxyProbe.width, proxyProbe.height),
      durationSeconds: Number(probe.durationSeconds.toFixed(2)),
      posterCandidates: posterFiles.length,
      posterCandidatesDir: `media/poster-candidates/${project.slug}`,
      // Reste null tant que le client n'a pas choisi sa frame (addendum §4).
      poster: null,
    };

    console.log('');
  }

  saveCache(cache);

  // Le manifeste ne decrit que les projets traites : en mode --only, on fusionne
  // avec l'existant pour ne pas perdre les autres.
  let merged = manifest;
  if (ONLY && existsSync(MANIFEST_PATH)) {
    const previous = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
    merged = {
      generatedAt: manifest.generatedAt,
      projects: { ...previous.projects, ...manifest.projects },
    };
  }

  ensureDir(resolve(APP_ROOT, 'public', 'videos'));
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(merged, null, 2)}\n`);

  const ratios = new Set(Object.values(merged.projects).map((entry) => entry.aspectRatio));
  console.log(`Manifeste  public/videos/manifest.json`);
  console.log(`Ratios presents : ${[...ratios].join(', ')}`);
  if (ratios.size > 1) {
    console.log(
      `  Les films n'ont pas tous le meme ratio : le conteneur video devra lire\n` +
        `  aspectRatio depuis ce manifeste, pas le coder en dur.`
    );
  }
  console.log(`\nTermine en ${formatDuration((Date.now() - started) / 1000)}.\n`);
}

main().catch((error) => {
  console.error(`\nEchec : ${error.message}\n`);
  process.exit(1);
});
