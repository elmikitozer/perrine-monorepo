/**
 * Boucles d'accueil et posters — etape 4, la chaine video lit Sanity.
 *
 * Usage:
 *   node scripts/extract-loops.mjs
 *   node scripts/extract-loops.mjs --only=bosideng
 *   node scripts/extract-loops.mjs --force
 *   node scripts/extract-loops.mjs --seed-from=raw-v2   masters deja sur le disque
 *
 * Pour chaque document project qui porte un master :
 *   1. telecharge le master dans .cache/masters/ (partage avec le transcodage) ;
 *   2. extrait 8 s muettes a 1280 px a partir de loopStart, le timecode
 *      saisi par la cliente ; sans timecode, part d'un defaut technique
 *      (15 % du film) que le site marque provisoire ;
 *   3. prend la premiere image de la boucle comme poster ;
 *   4. uploade boucle et poster, ecrit videoLoop, videoPoster et
 *      videoLoopMeta (dimensions, duree, depart, empreinte du master).
 *
 * Idempotent sur l'empreinte du master ET le timecode : si les deux sont
 * ceux de videoLoopMeta et que les assets existent, rien n'est refait.
 * Changer loopStart dans le studio relance l'extraction de ce projet.
 */

import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { APP_ROOT, ensureDir, formatBytes, formatDuration, getFlagValue, hasFlag } from './lib/corpus.mjs';
import {
  createWriteClient,
  ensureMaster,
  fetchFilmProjects,
  fileRef,
  imageRef,
  seedMastersFrom,
  uploadAsset,
} from './lib/sanity.mjs';
import { ffprobe, run } from './lib/video.mjs';

const LOOP_DIR = resolve(APP_ROOT, '.cache', 'loops');

const LOOP_SECONDS = 8;
const LOOP_WIDTH = 1280;
const LOOP_CRF = 26;

/**
 * Ou commencer sans timecode cliente, en fraction de la duree du film.
 * Demarrer a zero attrape souvent un fondu au noir ; 15 % tombe apres
 * l'ouverture. Choix TECHNIQUE par defaut : le site le marque provisoire.
 */
const DEFAULT_START_FRACTION = 0.15;

/** ~2 Mo vise par extrait ; au-dela on previent plutot que d'echouer. */
const SIZE_BUDGET_BYTES = 2.5 * 1024 * 1024;

const FORCE = hasFlag('force');
const ONLY = getFlagValue('only');
const SEED_FROM = getFlagValue('seed-from');

/**
 * Sans audio : la boucle est muette par conception. `setpts=PTS-STARTPTS`
 * remet la premiere image a t=0 : sans lui, `-ss` peut tomber entre deux
 * images cles et produire un flux qui demarre a 0.04 s, et le rembobinage de
 * la tuile atterrit dans le vide.
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
    '-vf', `scale=${LOOP_WIDTH}:-2,setpts=PTS-STARTPTS`,
    '-movflags', '+faststart',
  ];
}

function startFor(project, probe) {
  // On garde la fin de l'extrait dans le film, sinon ffmpeg sort plus court.
  const latest = Math.max(0, probe.durationSeconds - LOOP_SECONDS);
  const wanted = project.loopStart;
  if (wanted !== undefined && wanted !== null) {
    if (wanted > latest) {
      throw new Error(
        `${project.key} : loopStart ${wanted} s trop tard pour ${LOOP_SECONDS} s d'extrait sur ${probe.durationSeconds.toFixed(1)} s de film.`
      );
    }
    return { startSeconds: wanted, fromClient: true };
  }
  return { startSeconds: Math.min(probe.durationSeconds * DEFAULT_START_FRACTION, latest), fromClient: false };
}

async function main() {
  const started = Date.now();
  const client = await createWriteClient();
  const projects = await fetchFilmProjects(client, ONLY);
  console.log(`\n${projects.length} film(s)\n`);

  if (SEED_FROM) await seedMastersFrom(resolve(APP_ROOT, SEED_FROM), projects.map((p) => p.master));
  ensureDir(LOOP_DIR);

  for (const project of projects) {
    console.log(`${project.title}  ->  ${project.key}`);
    const { master } = project;
    const source = await ensureMaster(master);
    const probe = await ffprobe(source);
    const { startSeconds, fromClient } = startFor(project, probe);

    const meta = project.videoLoopMeta;
    const fresh =
      !FORCE &&
      project.loopAssetId &&
      project.posterAssetId &&
      meta?.sourceHash === master.sha1hash &&
      Number(meta?.startSeconds) === Number(startSeconds.toFixed(2));
    if (fresh) {
      console.log(`  boucle   a jour (depart ${startSeconds} s, empreinte ${master.sha1hash.slice(0, 12)}), on saute\n`);
      continue;
    }

    const stem = `${project.key}-${master.sha1hash.slice(0, 12)}-${startSeconds.toFixed(2)}`;
    const loopPath = join(LOOP_DIR, `${stem}.mp4`);
    const posterPath = join(LOOP_DIR, `${stem}.jpg`);

    if (!existsSync(loopPath) || FORCE) {
      const startedAt = Date.now();
      process.stdout.write(`  boucle   extraction a ${startSeconds.toFixed(1)} s...`);
      // -ss avant -i : positionnement par recherche, pas de decodage integral.
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(startSeconds), '-i', source, ...encodeArgs(), loopPath]);
      const size = statSync(loopPath).size;
      console.log(
        `\r  boucle   ${LOOP_SECONDS} s a partir de ${startSeconds.toFixed(1)} s` +
          ` (${fromClient ? 'timecode cliente' : 'defaut technique, provisoire'})` +
          ` · ${formatBytes(size)} · ${formatDuration((Date.now() - startedAt) / 1000)}   `
      );
      if (size > SIZE_BUDGET_BYTES) {
        console.log(`  Au-dessus du budget de ${formatBytes(SIZE_BUDGET_BYTES)} : monter le CRF au-dela de ${LOOP_CRF} si c'est genant.`);
      }
      // Poster pris SUR LA BOUCLE : il est son image de depart, la transition
      // vers la lecture est invisible. Sanity calcule dimensions et LQIP.
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', loopPath, '-frames:v', '1', '-q:v', '2', posterPath]);
    } else {
      console.log(`  boucle   deja extraite localement (${formatBytes(statSync(loopPath).size)})`);
    }

    const loopProbe = await ffprobe(loopPath);
    const loopAssetId = await uploadAsset(client, 'file', loopPath, `${project.key}-loop.mp4`, 'video/mp4');
    const posterAssetId = await uploadAsset(client, 'image', posterPath, `${project.key}-poster.jpg`, 'image/jpeg');
    await client
      .patch(project._id)
      .set({
        videoLoop: fileRef(loopAssetId),
        videoPoster: imageRef(posterAssetId),
        videoLoopMeta: {
          width: loopProbe.width,
          height: loopProbe.height,
          durationSeconds: Number(loopProbe.durationSeconds.toFixed(2)),
          startSeconds: Number(startSeconds.toFixed(2)),
          sourceHash: master.sha1hash,
        },
      })
      .commit();
    console.log(`  document ${project._id} · videoLoop ${loopProbe.width}x${loopProbe.height} · videoPoster\n`);
  }

  console.log(`Termine en ${formatDuration((Date.now() - started) / 1000)}.\n`);
}

main().catch((error) => {
  console.error(`\nEchec : ${error.message}\n`);
  process.exit(1);
});
