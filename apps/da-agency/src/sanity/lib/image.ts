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
