/**
 * Favicon, icône d'écran d'accueil et carte de partage, depuis le logo.
 *
 * Usage:
 *   node scripts/build-icons.mjs
 *
 * Entrées (produites par scripts/build-logo.mjs, versionnées) :
 *   public/brand/ld-productions-monogram.webp   monogramme seul
 *   public/brand/ld-productions-on-dark.webp    verrouillage complet, mot clair
 *
 * Sorties (conventions de fichiers de Next, servies et déclarées sans code) :
 *   src/app/icon.png                          favicon, monogramme seul
 *   src/app/apple-icon.png                    icône d'écran d'accueil iOS
 *   src/app/(site)/opengraph-image.png        aperçu WhatsApp, iMessage, Facebook, LinkedIn…
 *
 * Toutes sur fond neutral-900, celui de l'en-tête et du pied de page : le
 * monogramme #C0D3BF n'est jamais recoloré (voir build-logo.mjs) et ne se lit
 * que sur sombre — 1,58:1 sur blanc, soit un onglet clair où il disparaît.
 *
 * Le favicon est le monogramme seul : à 16 ou 32 px, le mot « Productions »
 * serait une ligne grise. La carte de partage, affichée en grand, porte le
 * verrouillage complet. Pas d'accroche : aucun texte n'est écrit ici qui ne
 * vienne pas de la cliente.
 *
 * La carte vaut pour toutes les pages sauf les fiches projet, qui prennent
 * leur visuel (src/app/(site)/projects/[slug]/page.tsx).
 */

import { join, resolve } from 'node:path';

import sharp from 'sharp';

import { APP_ROOT, formatBytes } from './lib/corpus.mjs';

/** neutral-900 de Tailwind. */
const BACKGROUND = '#171717';

const BRAND_DIR = resolve(APP_ROOT, 'public', 'brand');
const APP_DIR = resolve(APP_ROOT, 'src', 'app');

const MONOGRAM = join(BRAND_DIR, 'ld-productions-monogram.webp');
const LOCKUP = join(BRAND_DIR, 'ld-productions-on-dark.webp');

/**
 * Un carré de fond avec le logo centré, contenu dans `inner` px.
 * `radius` arrondit les coins (transparents au-delà) ; 0 = carré plein.
 */
async function compose({ source, width, height, inner, radius = 0 }) {
  const logo = await sharp(source)
    .resize({ width: inner.width, height: inner.height, fit: 'inside', kernel: 'lanczos3' })
    .toBuffer();

  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${BACKGROUND}"/></svg>`
  );

  return sharp(background).composite([{ input: logo, gravity: 'center' }]).png({ compressionLevel: 9 });
}

const OUTPUTS = [
  {
    // Coins arrondis : dans un onglet sombre, un carré plein se confond avec la barre.
    path: join(APP_DIR, 'icon.png'),
    width: 256,
    height: 256,
    inner: { width: 192, height: 192 },
    radius: 48,
    source: MONOGRAM,
  },
  {
    // Carré plein : iOS arrondit lui-même et refuse la transparence (fond noir).
    path: join(APP_DIR, 'apple-icon.png'),
    width: 180,
    height: 180,
    inner: { width: 120, height: 120 },
    source: MONOGRAM,
  },
  {
    // 1200 x 630, le format attendu par WhatsApp, Facebook et LinkedIn. Le
    // verrouillage tient dans le carré central : les messageries qui recadrent
    // l'aperçu en carré ne le coupent pas.
    path: join(APP_DIR, '(site)', 'opengraph-image.png'),
    width: 1200,
    height: 630,
    inner: { width: 420, height: 420 },
    source: LOCKUP,
  },
];

async function main() {
  for (const { path, source, ...options } of OUTPUTS) {
    const info = await (await compose({ source, ...options })).toFile(path);
    console.log(`${path.slice(APP_ROOT.length + 1)} · ${info.width}x${info.height} · ${formatBytes(info.size)}`);
  }
}

main().catch((error) => {
  console.error(`\nEchec : ${error.message}\n`);
  process.exit(1);
});
