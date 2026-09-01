/**
 * Le point de bascule d'hébergeur vidéo. Un seul.
 *
 * Le choix entre Vimeo, Cloudflare Stream et l'auto-hébergement est la seule
 * décision client encore bloquante. Elle ne doit bloquer que cette ligne.
 *
 * En `local`, <ProjectVideo> lit les proxys H.264 de public/videos/, produits
 * par scripts/transcode-video.mjs. Passer à distance = changer cette constante
 * et remplir `videoId` côté contenu ; aucun composant ne bouge.
 */

export type VideoProvider = 'local' | 'vimeo' | 'cloudflare';

export const VIDEO_PROVIDER: VideoProvider = 'local';
