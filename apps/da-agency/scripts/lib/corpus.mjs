/**
 * Socle commun aux scripts de media (transcode-video, optimize-images).
 *
 * Regle non negociable : `raw/` est un lien symbolique vers le dossier
 * Telechargements de l'utilisateur. Aucune ecriture ne doit y atterrir.
 * `assertNotInRaw()` est appele avant chaque creation de dossier de sortie.
 */

import { existsSync, mkdirSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const APP_ROOT = resolve(__dirname, '..', '..');
export const RAW_DIR = resolve(APP_ROOT, 'raw');

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.heic', '.webp'];
export const VIDEO_EXTENSIONS = ['.mov', '.mp4', '.m4v', '.mxf', '.avi'];

/** En dessous, l'image est inexploitable en pleine largeur (cf. docs/inventory.md). */
export const MIN_USABLE_WIDTH = 1600;

/**
 * Slugs figes pour les dossiers deja livres.
 * `ERL 06 26` porte une date, pas un nom : la slugification generique
 * produirait `erl-06-26`. Les autres suivent la regle generique, ils sont
 * listes ici pour que la correspondance dossier -> slug soit lisible d'un coup.
 */
export const SLUG_OVERRIDES = {
  'ERL 06 26': 'erl',
};

/**
 * Dossiers presents dans raw/ mais hors catalogue.
 * `KRIS VAN ASSCHE NECTAR VESSELS` a ete retire par le client le 19/08
 * (sources a 533 px). Le dossier reste dans raw/, qui appartient au client :
 * c'est ici qu'on l'ignore, pas en supprimant ses fichiers.
 */
export const EXCLUDED_FOLDERS = ['KRIS VAN ASSCHE NECTAR VESSELS'];

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugForFolder(folderName) {
  return SLUG_OVERRIDES[folderName] ?? slugify(folderName);
}

/**
 * Le realpath du lien symbolique `raw`, ou null s'il n'existe pas encore.
 * On compare sur le realpath : sans ca, un chemin passant par le lien
 * ressemblerait a `apps/da-agency/raw/...` et passerait un test naif.
 */
function rawRealPath() {
  if (!existsSync(RAW_DIR)) return null;
  return realpathSync(RAW_DIR);
}

/** Remonte jusqu'au premier ancetre existant pour pouvoir resoudre les liens. */
function resolveThroughSymlinks(target) {
  const absolute = resolve(target);
  let existing = absolute;
  const missing = [];

  while (!existsSync(existing)) {
    const parent = dirname(existing);
    if (parent === existing) return absolute;
    missing.unshift(existing.slice(parent.length + 1));
    existing = parent;
  }

  return join(realpathSync(existing), ...missing);
}

/**
 * Lance une erreur si `target` tombe dans `raw/`, en direct ou via le lien.
 * A appeler avant toute ecriture, pas seulement au demarrage.
 */
export function assertNotInRaw(target) {
  const raw = rawRealPath();
  if (!raw) return;

  const resolved = resolveThroughSymlinks(target);
  if (resolved === raw || resolved.startsWith(raw + sep)) {
    throw new Error(
      `Ecriture refusee dans raw/ : ${target}\n` +
        `  raw/ est un lien vers ${raw} et doit rester en lecture seule.`
    );
  }
}

export function ensureDir(target) {
  assertNotInRaw(target);
  mkdirSync(target, { recursive: true });
  return target;
}

/** Les dossiers projet de raw/, tries, avec leur slug et leurs fichiers. */
export function listProjects() {
  if (!existsSync(RAW_DIR)) {
    throw new Error(
      `raw/ est introuvable.\n` +
        `  Attendu : un lien symbolique vers le dossier de sources du client.\n` +
        `  Exemple : ln -s "/chemin/vers/PHOTOS SITE INTERNET" raw`
    );
  }

  return readdirSync(RAW_DIR)
    .filter((name) => !name.startsWith('.'))
    .filter((name) => !EXCLUDED_FOLDERS.includes(name))
    .filter((name) => statSync(join(RAW_DIR, name)).isDirectory())
    .sort()
    .map((folder) => {
      const folderPath = join(RAW_DIR, folder);
      const entries = readdirSync(folderPath)
        .filter((name) => !name.startsWith('.'))
        .filter((name) => statSync(join(folderPath, name)).isFile())
        .sort();

      const byExtension = (extensions) =>
        entries
          .filter((name) => extensions.includes(extname(name).toLowerCase()))
          .map((name) => join(folderPath, name));

      return {
        folder,
        slug: slugForFolder(folder),
        path: folderPath,
        images: byExtension(IMAGE_EXTENSIONS),
        videos: byExtension(VIDEO_EXTENSIONS),
      };
    });
}

export function relativeToRaw(filePath) {
  return relative(realpathSync(RAW_DIR), realpathSync(filePath));
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  const units = ['Ko', 'Mo', 'Go'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unit]}`;
}

export function formatDuration(seconds) {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  return minutes > 0 ? `${minutes} min ${String(total % 60).padStart(2, '0')} s` : `${total} s`;
}

export function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

export function getFlagValue(name) {
  const prefixed = `--${name}=`;
  for (let index = 0; index < process.argv.length; index += 1) {
    const arg = process.argv[index];
    if (arg.startsWith(prefixed)) return arg.slice(prefixed.length);
    if (arg === `--${name}`) return process.argv[index + 1];
  }
  return undefined;
}
