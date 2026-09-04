/**
 * Socle commun aux scripts de media (transcode-video, optimize-images,
 * extract-loops).
 *
 * Regle non negociable : les racines de sources (`raw/`, lien symbolique vers
 * le dossier Telechargements, et `raw-v2/`, vrai dossier de 2 Go) appartiennent
 * a la cliente. Aucune ecriture ne doit y atterrir, quelle que soit la racine
 * visee par le run. `assertNotInRaw()` est appele avant chaque creation de
 * dossier de sortie et protege TOUTES les racines connues, pas seulement celle
 * du run en cours.
 */

import { createHash } from 'node:crypto';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readSync,
  realpathSync,
  statSync,
} from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const APP_ROOT = resolve(__dirname, '..', '..');

/**
 * Racines de sources connues, dans l'ordre des livraisons. Toutes sont en
 * lecture seule, meme celles qui ne sont pas visees par le run.
 */
export const SOURCE_ROOTS = ['raw', 'raw-v2'];

/**
 * Livraison courante. La v2 du 04/09 remplace la v1 du 18/08 : elle renomme
 * 100 % des fichiers et ajoute 6 projets, le catalogue est construit dessus.
 * La v1 reste accessible par `--raw=raw`, pour comparaison uniquement.
 */
const DEFAULT_RAW = 'raw-v2';

export const RAW_NAME = getFlagValue('raw') ?? DEFAULT_RAW;
export const RAW_DIR = resolve(APP_ROOT, RAW_NAME);

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.heic', '.webp'];
export const VIDEO_EXTENSIONS = ['.mov', '.mp4', '.m4v', '.mxf', '.avi'];

/** En dessous, l'image est inexploitable en pleine largeur (cf. docs/inventory.md). */
export const MIN_USABLE_WIDTH = 1600;

/**
 * Cle de stockage (assetKey) de chaque dossier livre.
 *
 * Les dossiers de la v2 portent un rang de publication en prefixe
 * (`4-ANTA ZERO X ...`). Ce prefixe est un detail de la livraison, pas une
 * donnee : il ne doit JAMAIS atteindre la cle, sinon `--prune` verrait des
 * dossiers inconnus dans public/images/ et effacerait les derives existants.
 *
 * Les 5 premieres cles sont figees depuis la v1 : elles nomment des dossiers de
 * derives, des proxys et des boucles deja produits. Les 6 autres sont derivees
 * du nom de dossier sans prefixe, sauf `venetian-heritage` : le dossier ecrit
 * `VENETHIAN`, graphie douteuse pour une fondation reelle, et une cle de
 * stockage ne se corrige plus une fois les derives produits.
 *
 * Tout dossier absent de cette table est refuse par listProjects() : une cle
 * calculee a la volee depuis un nouveau dossier serait une cle non relue.
 */
export const SLUG_OVERRIDES = {
  '1-DIOR Haute Joaillerie 24': 'dior-haute-joaillerie-24',
  '2-DIORHJ25': 'diorhj25',
  '3-NECTAR VESSELS BY KRIS VAN ASSCHE': 'nectar-vessels-by-kris-van-assche',
  '4-ANTA ZERO X KRIS VAN ASSCHE': 'antazero-x-kris-van-assche',
  '5-VILLA DIOR': 'villa-dior',
  '6-BOSIDENG AREAL X KIM JONES': 'bosideng',
  '7-ERL SEASON 13': 'erl-season-13',
  '8-DIOR-TRUNK0226': 'dior-trunk-show',
  '9-VENETHIAN HERITAGE': 'venetian-heritage',
  '10-DIORVHHJ26': 'diorvhhj26',
  '11-ERL SEASON 14': 'erl',
  // Dossiers de la v1 (`--raw=raw`), conserves pour que la comparaison entre
  // livraisons retombe sur les memes cles.
  'ANTAZERO x KRIS VAN ASSCHE': 'antazero-x-kris-van-assche',
  BOSIDENG: 'bosideng',
  'DIOR TRUNK SHOW': 'dior-trunk-show',
  'ERL 06 26': 'erl',
  'VILLA DIOR': 'villa-dior',
  'KRIS VAN ASSCHE NECTAR VESSELS': 'nectar-vessels-by-kris-van-assche',
};

/**
 * Dossiers presents dans une racine de sources mais hors catalogue.
 *
 * Vide depuis la v2. `KRIS VAN ASSCHE NECTAR VESSELS` y figurait : retire par la
 * cliente le 19/08 pour des sources a 533 px, il revient au nº 3 de la v2 avec
 * les memes prises de vue relivrees a 2560 px. Le mecanisme reste : c'est ici
 * qu'on ignore un dossier, jamais en supprimant ses fichiers.
 */
export const EXCLUDED_FOLDERS = [];

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugForFolder(folderName) {
  const slug = SLUG_OVERRIDES[folderName];
  if (!slug) {
    throw new Error(
      `Dossier sans cle de stockage : ${folderName}\n` +
        `  Ajouter une entree dans SLUG_OVERRIDES (scripts/lib/corpus.mjs).\n` +
        `  Une cle calculee a la volee (${slugify(folderName)}) figerait un prefixe de ` +
        `livraison ou une coquille dans les URL des derives.`
    );
  }
  return slug;
}

/** Realpath de chaque racine de sources existante. */
function sourceRealPaths() {
  const roots = new Set([...SOURCE_ROOTS.map((name) => resolve(APP_ROOT, name)), RAW_DIR]);
  return [...roots].filter((dir) => existsSync(dir)).map((dir) => realpathSync(dir));
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
 * Lance une erreur si `target` tombe dans une racine de sources, en direct ou
 * via un lien. On compare sur le realpath : sans ca, un chemin passant par le
 * lien `raw` ressemblerait a `apps/da-agency/raw/...` et passerait un test
 * naif. A appeler avant toute ecriture, pas seulement au demarrage.
 */
export function assertNotInRaw(target) {
  const resolved = resolveThroughSymlinks(target);
  for (const raw of sourceRealPaths()) {
    if (resolved === raw || resolved.startsWith(raw + sep)) {
      throw new Error(
        `Ecriture refusee dans les sources : ${target}\n` +
          `  ${raw} appartient a la cliente et doit rester en lecture seule.`
      );
    }
  }
}

export function ensureDir(target) {
  assertNotInRaw(target);
  mkdirSync(target, { recursive: true });
  return target;
}

/** Tri naturel : `SITE_2.10` apres `SITE_2.9`, pas apres `SITE_2.1`. */
function naturalCompare(a, b) {
  return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
}

/**
 * Fichiers d'un dossier projet, sous-dossiers compris, tries par chemin.
 *
 * La v1 livrait les fichiers a plat ; la v2 les met tous dans un sous-dossier
 * `A METTRE SUR SITE/`. Ce nom ressemble a une consigne de selection : si un
 * jour un dossier projet en contient un second, il y a de fortes chances que
 * l'un des deux ne soit PAS a mettre sur le site. On l'accepte, mais on le dit.
 */
function listFilesRecursively(dir, folderLabel) {
  const entries = readdirSync(dir, { withFileTypes: true }).filter(
    (entry) => !entry.name.startsWith('.')
  );
  const subdirs = entries.filter((entry) => entry.isDirectory());
  if (subdirs.length > 1) {
    console.warn(
      `  ${folderLabel} : ${subdirs.length} sous-dossiers (${subdirs
        .map((entry) => entry.name)
        .join(', ')}). Tous sont lus — verifier que c'est voulu.`
    );
  }

  const files = entries.filter((entry) => entry.isFile()).map((entry) => join(dir, entry.name));
  for (const subdir of subdirs) {
    files.push(...listFilesRecursively(join(dir, subdir.name), `${folderLabel}/${subdir.name}`));
  }
  return files.sort(naturalCompare);
}

/** Les dossiers projet de la racine de sources, tries, avec leur cle et leurs fichiers. */
export function listProjects() {
  if (!existsSync(RAW_DIR)) {
    throw new Error(
      `${RAW_NAME}/ est introuvable.\n` +
        `  Attendu : le dossier de sources de la cliente, ou un lien symbolique vers lui.\n` +
        `  Racines connues : ${SOURCE_ROOTS.join(', ')} · choisir avec --raw=<dossier>`
    );
  }

  return readdirSync(RAW_DIR)
    .filter((name) => !name.startsWith('.'))
    .filter((name) => !EXCLUDED_FOLDERS.includes(name))
    .filter((name) => statSync(join(RAW_DIR, name)).isDirectory())
    .sort(naturalCompare)
    .map((folder) => {
      const folderPath = join(RAW_DIR, folder);
      const files = listFilesRecursively(folderPath, folder);

      const byExtension = (extensions) =>
        files.filter((file) => extensions.includes(extname(file).toLowerCase()));

      return {
        folder,
        slug: slugForFolder(folder),
        path: folderPath,
        images: byExtension(IMAGE_EXTENSIONS),
        videos: byExtension(VIDEO_EXTENSIONS),
      };
    });
}

/**
 * Chemin d'un fichier source relatif a l'app, racine comprise
 * (`raw-v2/4-.../SITE_4.4.jpg`). Il sert de cle de cache et de champ `source`
 * des manifestes : inclure la racine evite qu'une entree de la v1 soit prise
 * pour une entree de la v2 portant le meme chemin relatif.
 */
export function relativeToRaw(filePath) {
  return join(RAW_NAME, relative(realpathSync(RAW_DIR), realpathSync(filePath)));
}

/** Octets lus a chaque extremite pour l'empreinte des masters video. */
const FINGERPRINT_SAMPLE_BYTES = 1024 * 1024;

/**
 * Empreinte d'un fichier lourd : taille + hash du premier et du dernier Mo.
 *
 * Les masters pesent jusqu'a 768 Mo : les hacher en entier a chaque lancement
 * couterait plus que le transcodage qu'on cherche a eviter. L'ancienne
 * empreinte taille + mtime avait un defaut : une simple copie du dossier de
 * livraison change les mtime, et la v2 aurait fait retranscoder 1,1 Go de
 * masters identiques a l'octet pres. Deux extremites suffisent a distinguer
 * deux exports d'un meme montage, dont les en-tetes et les index different.
 */
export function sourceFingerprint(file) {
  const { size } = statSync(file);
  const hash = createHash('sha1');
  const fd = openSync(file, 'r');
  try {
    const head = Buffer.alloc(Math.min(FINGERPRINT_SAMPLE_BYTES, size));
    readSync(fd, head, 0, head.length, 0);
    hash.update(head);
    if (size > FINGERPRINT_SAMPLE_BYTES) {
      const tail = Buffer.alloc(Math.min(FINGERPRINT_SAMPLE_BYTES, size - FINGERPRINT_SAMPLE_BYTES));
      readSync(fd, tail, 0, tail.length, size - tail.length);
      hash.update(tail);
    }
  } finally {
    closeSync(fd);
  }
  return `${size}:${hash.digest('hex').slice(0, 16)}`;
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
