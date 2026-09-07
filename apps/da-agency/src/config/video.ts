/**
 * Le point de bascule d'hébergeur vidéo. Un seul.
 *
 * Le choix entre Vimeo, Cloudflare Stream et l'auto-hébergement est la seule
 * décision client encore bloquante. Elle ne doit bloquer que cette ligne.
 *
 * En `local`, <ProjectVideo> lit le proxy H.264 que scripts/transcode-video.mjs
 * a déposé dans Sanity (videoProxy), servi par le CDN Sanity. Passer à un
 * hébergeur vidéo = changer cette constante et remplir l'identifiant côté
 * contenu ; aucun composant ne bouge.
 */

export type VideoProvider = 'local' | 'vimeo' | 'cloudflare';

export const VIDEO_PROVIDER: VideoProvider = 'local';
