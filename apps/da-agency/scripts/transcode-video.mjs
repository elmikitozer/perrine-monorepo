/**
 * Version de lecture des films — etape 4, la chaine video lit Sanity.
 *
 * Usage:
 *   node scripts/transcode-video.mjs
 *   node scripts/transcode-video.mjs --only=bosideng
 *   node scripts/transcode-video.mjs --force
 *   node scripts/transcode-video.mjs --seed-from=raw-v2   masters deja sur le disque
 *
 * Pour chaque document project qui porte un master (videoMaster) :
 *   1. telecharge le master dans .cache/masters/, nomme par son empreinte ;
 *   2. le transcode en H.264 1080p dans .cache/proxies/ ;
 *   3. uploade le proxy comme asset et ecrit videoProxy + videoProxyMeta
 *      (dimensions, duree, empreinte du master) dans le document.
 *
 * Idempotent sur l'empreinte du master : si videoProxyMeta.sourceHash est
 * celle du master courant et que l'asset du proxy existe, rien n'est refait.
 * Remplacer le master dans le studio change l'empreinte et relance tout.
 * `--force` retranscode inconditionnellement.
 *
 * Le master n'est JAMAIS servi : HEVC 10 bits 4:2:2, illisible en navigateur.
 * Les planches de candidats poster de l'ancienne chaine ont disparu : le
 * choix de la frame passe par loopStart, saisi dans le studio.
 */

import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { APP_ROOT, ensureDir, formatBytes, formatDuration, getFlagValue, hasFlag } from './lib/corpus.mjs';
import {
  createWriteClient,
  ensureMaster,
  fetchFilmProjects,
  fileRef,
  seedMastersFrom,
  uploadAsset,
} from './lib/sanity.mjs';
import { ffprobe, run } from './lib/video.mjs';

const PROXY_DIR = resolve(APP_ROOT, '.cache', 'proxies');

/** Plafond de hauteur du proxy. Voir encodeArgs(). */
const MAX_PROXY_HEIGHT = 1080;

const FORCE = hasFlag('force');
const ONLY = getFlagValue('only');
const SEED_FROM = getFlagValue('seed-from');

/**
 * Reglages d'encodage du proxy, hors chemins d'entree/sortie.
 *
 * Plafonne a 1080p : au-dela, le poids explose sans benefice pour un lecteur
 * qui ne depassera jamais la largeur d'une page. CRF 23 et non 18 : a 1080p
 * la difference visuelle est negligeable, mais 18 produisait des fichiers de
 * 30 a 92 Mo. Un lien client doit se charger, pas se telecharger.
 */
function encodeArgs(probe) {
  const scale = probe.height > MAX_PROXY_HEIGHT ? ['-vf', `scale=-2:${MAX_PROXY_HEIGHT}`] : [];
  return [
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    '-crf', '23',
    '-preset', 'slow',
    ...scale,
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
  ];
}

async function main() {
  const started = Date.now();
  const client = await createWriteClient();
  const projects = await fetchFilmProjects(client, ONLY);
  console.log(`\n${projects.length} projet(s) avec master\n`);

  if (SEED_FROM) await seedMastersFrom(resolve(APP_ROOT, SEED_FROM), projects.map((p) => p.master));
  ensureDir(PROXY_DIR);

  for (const project of projects) {
    console.log(`${project.title}  ->  ${project.key}`);
    const { master } = project;

    const fresh =
      !FORCE && project.proxyAssetId && project.videoProxyMeta?.sourceHash === master.sha1hash;
    if (fresh) {
      console.log(`  proxy    a jour (empreinte ${master.sha1hash.slice(0, 12)}), on saute\n`);
      continue;
    }

    const source = await ensureMaster(master);
    const probe = await ffprobe(source);
    console.log(
      `  source   ${probe.width}x${probe.height} · ${probe.codec} ${probe.pixelFormat}` +
        ` · ${formatDuration(probe.durationSeconds)} · ${formatBytes(master.size)}`
    );

    const proxyPath = join(PROXY_DIR, `${project.key}-${master.sha1hash.slice(0, 12)}.mp4`);
    if (!existsSync(proxyPath) || FORCE) {
      const startedAt = Date.now();
      process.stdout.write('  proxy    transcodage en cours...');
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', source, ...encodeArgs(probe), proxyPath]);
      console.log(
        `\r  proxy    ${formatBytes(statSync(proxyPath).size)} · ${formatDuration((Date.now() - startedAt) / 1000)}   `
      );
    } else {
      console.log(`  proxy    deja transcode localement (${formatBytes(statSync(proxyPath).size)})`);
    }

    const proxyProbe = await ffprobe(proxyPath);
    const assetId = await uploadAsset(client, 'file', proxyPath, `${project.key}-proxy.mp4`, 'video/mp4');
    await client
      .patch(project._id)
      .set({
        videoProxy: fileRef(assetId),
        videoProxyMeta: {
          width: proxyProbe.width,
          height: proxyProbe.height,
          durationSeconds: Number(proxyProbe.durationSeconds.toFixed(2)),
          sourceHash: master.sha1hash,
        },
      })
      .commit();
    console.log(`  document ${project._id} · videoProxy ${proxyProbe.width}x${proxyProbe.height}\n`);
  }

  console.log(`Termine en ${formatDuration((Date.now() - started) / 1000)}.\n`);
}

main().catch((error) => {
  console.error(`\nEchec : ${error.message}\n`);
  process.exit(1);
});
