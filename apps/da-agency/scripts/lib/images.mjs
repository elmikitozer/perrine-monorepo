/**
 * Traitement d'image partage.
 *
 * Extrait de optimize-images.mjs pour que extract-loops.mjs produise ses
 * posters exactement de la meme facon : memes largeurs, memes formats, meme
 * LQIP, meme suppression d'EXIF. Deux implementations auraient derive.
 */

import { join } from 'node:path';

import sharp from 'sharp';

/** Au-dela de 2048 c'est du poids pour rien (brief, Phase 2). */
export const WIDTHS = [640, 1280, 2048];

export const FORMATS = [
  { extension: 'avif', apply: (pipeline) => pipeline.avif({ quality: 55, effort: 6 }) },
  { extension: 'webp', apply: (pipeline) => pipeline.webp({ quality: 80, effort: 5 }) },
];

/** Placeholder flou encode en base64, volontairement minuscule. */
const LQIP_WIDTH = 20;

export function orientationOf(width, height) {
  if (width === height) return 'square';
  return width > height ? 'landscape' : 'portrait';
}

export function aspectRatio(width, height) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export async function buildLqip(file) {
  const buffer = await sharp(file)
    .resize({ width: LQIP_WIDTH })
    .blur(1.2)
    .jpeg({ quality: 40 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

/**
 * Dimensions apres rotation EXIF. Les orientations 5 a 8 echangent largeur et
 * hauteur : sans ca le manifeste annonce un ratio faux.
 */
export async function readDimensions(file) {
  const metadata = await sharp(file).metadata();
  const rotated = metadata.orientation >= 5;
  return {
    width: rotated ? metadata.height : metadata.width,
    height: rotated ? metadata.width : metadata.height,
  };
}

/**
 * Produit les variantes AVIF + WebP.
 *
 * `publicDir` est le chemin URL du dossier de sortie (ex. `/images/bosideng`) :
 * il ne se deduit pas du dossier disque, les posters ne vivant pas au meme
 * endroit que les galeries.
 */
export async function renderVariants({ file, targetDir, publicDir, id, sourceWidth }) {
  const variants = { avif: [], webp: [] };

  // Jamais d'agrandissement : une source de 800 px ne produit pas de 2048.
  // Si elle est plus etroite que le plus petit palier, on sort quand meme une
  // variante a sa largeur native — sinon l'image n'aurait aucun derive et
  // disparaitrait silencieusement du site.
  const targetWidths = WIDTHS.filter((width) => width <= sourceWidth);
  if (targetWidths.length === 0) targetWidths.push(sourceWidth);

  for (const width of targetWidths) {
    for (const format of FORMATS) {
      const filename = `${id}-${width}.${format.extension}`;

      // `sharp` ne recopie pas les metadonnees par defaut : les EXIF, dont les
      // donnees GPS et materiel, disparaissent sans traitement supplementaire.
      const pipeline = sharp(file)
        .rotate() // applique l'orientation EXIF avant de la perdre
        .resize({ width, withoutEnlargement: true })
        .toColorspace('srgb');

      const info = await format.apply(pipeline).toFile(join(targetDir, filename));

      variants[format.extension].push({
        width: info.width,
        height: info.height,
        bytes: info.size,
        src: `${publicDir}/${filename}`,
      });
    }
  }

  return variants;
}

/** Noms de fichiers attendus pour une entree, pour detecter les orphelins. */
export function expectedFilenames(entry) {
  const names = [];
  for (const format of Object.keys(entry.variants)) {
    for (const variant of entry.variants[format]) names.push(variant.src.split('/').pop());
  }
  return names;
}
