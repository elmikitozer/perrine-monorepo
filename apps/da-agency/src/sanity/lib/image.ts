/**
 * URL d'images Sanity.
 *
 * Les largeurs sont celles que le pipeline images produisait (640, 1280,
 * 2048) : les attributs `sizes` des composants ont été réglés dessus et n'ont
 * pas à bouger. `auto=format` laisse Sanity choisir AVIF ou WebP selon le
 * navigateur ; `fit=max` ne fait jamais grandir une source plus petite.
 */

import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { client } from './client';

export const IMAGE_WIDTHS = [640, 1280, 2048] as const;

const builder = imageUrlBuilder(client);

export function imageUrl(source: SanityImageSource, width: number): string {
  return builder.image(source).width(width).fit('max').auto('format').url();
}

/** Dimensions de l'aperçu de lien attendues par WhatsApp, Facebook et LinkedIn. */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Visuel d'aperçu de lien, recadré au centre en 1200 x 630. En JPEG et non en
 * `auto=format` : certaines messageries ignorent le WebP, et l'aperçu est mis
 * en cache par chacune au premier partage.
 */
export function shareImageUrl(source: SanityImageSource): string {
  return builder
    .image(source)
    .width(SHARE_IMAGE_SIZE.width)
    .height(SHARE_IMAGE_SIZE.height)
    .fit('crop')
    .format('jpg')
    .quality(80)
    .url();
}
