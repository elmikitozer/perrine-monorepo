/**
 * Logo — extraction de l'export Canva et declinaison par fond.
 *
 * Usage:
 *   node scripts/build-logo.mjs
 *   node scripts/build-logo.mjs --raw=raw-v2     (defaut)
 *
 * Sorties:
 *   public/brand/ld-productions-on-light.webp   mot « Productions » noir, rendu du fichier cliente
 *   public/brand/ld-productions-on-dark.webp    mot « Productions » clair
 *   public/brand/ld-productions-monogram.webp   monogramme seul, recadre sur son contenu
 *
 * Le monogramme seul existe parce que le mot ne se lit pas en petit : il fait
 * 42 lignes sur 533, soit 3,7 px de haut dans un emplacement de 48 px. Sous
 * 120 px environ, c'est le monogramme qu'on affiche ; le verrouillage complet
 * reste disponible au-dela. Le recadrage sur le contenu fait que 48 px
 * d'emplacement donnent 48 px de monogramme, pas 26.
 *
 * Ce que contient le fichier cliente (`Design sans titre.svg`, 48 Ko) : pas un
 * dessin vectoriel, mais deux PNG de 534 x 533 encapsules en base64. Le premier,
 * en niveaux de gris, sert de masque de luminance (filtre feColorMatrix du SVG).
 * Le second porte les couleurs : monogramme LD en #C0D3BF et mot « Productions »
 * noir, tous deux sur fond noir. Sans le masque, le mot est invisible ; avec,
 * le fond disparait. Le rendu attendu est donc : monogramme #C0D3BF + mot noir,
 * sur transparent.
 *
 * Ce rendu n'est lisible sur aucun fond. Sur blanc, le monogramme fait 1,58:1 ;
 * sur sombre, le mot noir disparait. D'ou deux declinaisons, et une regle : le
 * MONOGRAMME N'EST JAMAIS RECOLORE. C'est l'identite de la cliente, et sans
 * vectoriel toute retouche serait definitive. Seul le mot change de couleur
 * selon le fond. Le masque le permet : il donne la forme du mot independamment
 * de sa couleur, la ou l'image seule ne distingue pas le mot noir du fond noir.
 *
 * Le SVG n'est pas servi : 48 Ko pour un contenu matriciel, la ou un WebP sans
 * perte de la meme image pese quelques Ko. Lossless, pour que le #C0D3BF sorte
 * exact et non approche par un encodeur avec perte.
 */

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import sharp from 'sharp';

import { APP_ROOT, RAW_DIR, RAW_NAME, ensureDir, formatBytes } from './lib/corpus.mjs';

/** Nom donne par l'export Canva, tel que livre dans la racine de sources. */
const LOGO_SOURCE = 'Design sans titre.svg';

const OUTPUT_DIR = resolve(APP_ROOT, 'public', 'brand');
const OUTPUTS = {
  onLight: 'ld-productions-on-light.webp',
  onDark: 'ld-productions-on-dark.webp',
  monogram: 'ld-productions-monogram.webp',
};

/** Couleur du mot sur fond sombre : neutral-100 de Tailwind, le texte clair du site. */
const WORD_ON_DARK = [245, 245, 245];

/** En dessous, un pixel du masque est tenu pour transparent. */
const ALPHA_FLOOR = 8;

/**
 * Nombre minimal de lignes vides entre le monogramme et le mot.
 *
 * Le mot n'est pas separe du monogramme par sa couleur mais par sa position :
 * le noir de l'export n'est pas pur (des gris a (15, 17, 15) traversent les
 * lettres a pleine opacite) et tout seuil de couleur laissait des trous dans
 * « Productions » sur fond sombre. La mise en page, elle, est nette : 40 lignes
 * vides entre le bas du LD et le haut du mot. Tout ce qui est au-dessus de
 * cette bande est monogramme et n'est pas touche ; tout ce qui est en dessous
 * est mot et change de couleur. Le script refuse de tourner s'il ne trouve pas
 * la bande : c'est que le fichier a change de composition.
 */
const MIN_GAP_ROWS = 8;

/**
 * Diagnostic seulement : un pixel franchement vert sous la bande signalerait
 * que la bande trouvee n'est pas la bonne. Le rapport vert / max(rouge, bleu)
 * d'un melange de #C0D3BF et de noir reste 1,099 quelle que soit sa densite.
 */
function looksGreen(r, g, b) {
  const base = Math.max(r, b);
  return g >= 64 && base > 0 && g / base > 1.05;
}

/** Les deux PNG dans l'ordre du fichier : le masque (dans <mask>), puis l'image. */
function extractEmbeddedPngs(svg) {
  const matches = [...svg.matchAll(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g)];
  if (matches.length !== 2) {
    throw new Error(
      `${LOGO_SOURCE} : ${matches.length} PNG encapsule(s), 2 attendus (masque puis image). ` +
        `Le fichier a change de structure, relire ce script avant de continuer.`
    );
  }
  const maskFirst = svg.indexOf('<mask') < svg.indexOf(matches[0][0]);
  if (!maskFirst) {
    throw new Error(`${LOGO_SOURCE} : le premier PNG n'est pas dans <mask>, l'ordre a change.`);
  }
  return matches.map((match) => Buffer.from(match[1], 'base64'));
}

/**
 * Premiere ligne du mot : la ligne qui suit la premiere bande d'au moins
 * MIN_GAP_ROWS lignes vides situee APRES du contenu. Les lignes vides du haut
 * de l'image ne comptent pas.
 */
function findWordTop(mask, width, height) {
  const rowHasContent = [];
  for (let y = 0; y < height; y += 1) {
    let has = false;
    for (let x = 0; x < width && !has; x += 1) has = mask[y * width + x] >= ALPHA_FLOOR;
    rowHasContent.push(has);
  }

  let seenContent = false;
  let emptyRun = 0;
  for (let y = 0; y < height; y += 1) {
    if (rowHasContent[y]) {
      if (seenContent && emptyRun >= MIN_GAP_ROWS) return { wordTop: y, gapRows: emptyRun };
      seenContent = true;
      emptyRun = 0;
    } else if (seenContent) {
      emptyRun += 1;
    }
  }
  throw new Error(
    `${LOGO_SOURCE} : aucune bande d'au moins ${MIN_GAP_ROWS} lignes vides entre deux zones de ` +
      `contenu. La composition a change, la separation monogramme / mot n'est plus geometrique.`
  );
}

async function main() {
  const sourcePath = join(RAW_DIR, LOGO_SOURCE);
  const svg = readFileSync(sourcePath, 'utf8');
  const [maskPng, imagePng] = extractEmbeddedPngs(svg);

  // Le masque en un canal (luminance), l'image en trois : les deux sont forces
  // explicitement, sharp choisissant sinon le nombre de canaux du PNG source.
  const mask = await sharp(maskPng).toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
  const image = await sharp(imagePng).removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });

  const { width, height } = image.info;
  if (mask.info.width !== width || mask.info.height !== height) {
    throw new Error(`Masque ${mask.info.width}x${mask.info.height} et image ${width}x${height} de tailles differentes.`);
  }
  if (mask.info.channels !== 1 || image.info.channels !== 3) {
    throw new Error(`Canaux inattendus : masque ${mask.info.channels}, image ${image.info.channels}.`);
  }

  const { wordTop, gapRows } = findWordTop(mask.data, width, height);

  const pixels = width * height;
  const onLight = Buffer.alloc(pixels * 4);
  const onDark = Buffer.alloc(pixels * 4);
  let monogram = 0;
  let word = 0;
  let greenBelowGap = 0;
  const box = { top: height, bottom: 0, left: width, right: 0 };
  // Boite du monogramme seul, pour le recadrage de la troisieme sortie.
  const monogramBox = { top: height, bottom: 0, left: width, right: 0 };

  for (let index = 0; index < pixels; index += 1) {
    const alpha = mask.data[index];
    const r = image.data[index * 3];
    const g = image.data[index * 3 + 1];
    const b = image.data[index * 3 + 2];
    const y = Math.floor(index / width);
    const inWord = y >= wordTop;

    // Declinaison claire : le fichier cliente tel quel, alpha du masque.
    onLight.set([r, g, b, alpha], index * 4);
    // Declinaison sombre : monogramme intact, mot passe en clair.
    onDark.set(inWord ? [...WORD_ON_DARK, alpha] : [r, g, b, alpha], index * 4);

    if (alpha >= ALPHA_FLOOR) {
      if (inWord) {
        word += 1;
        if (alpha > 64 && looksGreen(r, g, b)) greenBelowGap += 1;
      } else {
        monogram += 1;
        const x = index % width;
        monogramBox.top = Math.min(monogramBox.top, y);
        monogramBox.bottom = Math.max(monogramBox.bottom, y);
        monogramBox.left = Math.min(monogramBox.left, x);
        monogramBox.right = Math.max(monogramBox.right, x);
      }
      const x = index % width;
      box.top = Math.min(box.top, y);
      box.bottom = Math.max(box.bottom, y);
      box.left = Math.min(box.left, x);
      box.right = Math.max(box.right, x);
    }
  }

  if (greenBelowGap > 0) {
    throw new Error(
      `${greenBelowGap} pixel(s) de la couleur du monogramme sous la bande vide (ligne ${wordTop}). ` +
        `La bande trouvee ne separe pas le monogramme du mot : verifier le fichier.`
    );
  }

  ensureDir(OUTPUT_DIR);
  const results = {};
  for (const [key, buffer] of [
    ['onLight', onLight],
    ['onDark', onDark],
  ]) {
    const target = join(OUTPUT_DIR, OUTPUTS[key]);
    const info = await sharp(buffer, { raw: { width, height, channels: 4 } })
      .webp({ lossless: true })
      .toFile(target);
    results[key] = info.size;
  }

  // Monogramme seul : les memes pixels que les deux declinaisons (identiques
  // au-dessus de la bande), recadres sur leur boite. Pas de marge : c'est
  // l'emplacement qui donne l'air autour.
  const monogramSize = {
    width: monogramBox.right - monogramBox.left + 1,
    height: monogramBox.bottom - monogramBox.top + 1,
  };
  const monogramInfo = await sharp(onLight, { raw: { width, height, channels: 4 } })
    .extract({ left: monogramBox.left, top: monogramBox.top, ...monogramSize })
    .webp({ lossless: true })
    .toFile(join(OUTPUT_DIR, OUTPUTS.monogram));

  console.log(`Source   ${RAW_NAME}/${LOGO_SOURCE} · ${formatBytes(svg.length)} · ${width}x${height}`);
  console.log(
    `Zones    monogramme au-dessus de la ligne ${wordTop - gapRows}, mot a partir de la ligne ${wordTop}` +
      ` (${gapRows} lignes vides entre les deux) · ${monogram} px de monogramme, ${word} px de mot`
  );
  console.log(`Contenu  de (${box.left},${box.top}) a (${box.right},${box.bottom})`);
  console.log(`Sorties  public/brand/${OUTPUTS.onLight} · ${formatBytes(results.onLight)}`);
  console.log(`         public/brand/${OUTPUTS.onDark} · ${formatBytes(results.onDark)}`);
  console.log(
    `         public/brand/${OUTPUTS.monogram} · ${formatBytes(monogramInfo.size)} · ${monogramSize.width}x${monogramSize.height}`
  );
  console.log(
    `\nDimensions a reporter dans content/site.ts : verrouillage ${width} x ${height}, ` +
      `monogramme ${monogramSize.width} x ${monogramSize.height}.\n`
  );
}

main().catch((error) => {
  console.error(`\nEchec : ${error.message}\n`);
  process.exit(1);
});
