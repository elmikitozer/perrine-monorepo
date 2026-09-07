'use client';

/**
 * §3.3 étape 2 — lecteur vidéo, façade à hébergeur commutable.
 *
 * Trois exigences du brief, dans l'ordre où elles comptent :
 *
 * 1. Un seul point de bascule d'hébergeur (src/config/video.ts). Passer de
 *    local à Vimeo ou Cloudflare ne doit toucher aucun composant.
 * 2. Conteneur à ratio fixe, lu depuis les mesures que le script écrit dans
 *    Sanity (videoProxyMeta). Deux ratios coexistent (16/9 et 569/270) :
 *    aucun n'est codé en dur ici.
 * 3. Façade. Rien du lecteur n'est chargé avant le clic — un embed tiers coûte
 *    plusieurs centaines de kilo-octets de JavaScript, et le payer au
 *    chargement de la page annulerait le bénéfice du proxy local.
 */

import { useState } from 'react';

import type { Image } from '../../content/projects';
import { ui } from '../../content/ui';
import { VIDEO_PROVIDER, type VideoProvider } from '../config/video';

export type ProjectVideoProps = {
  /** Chemin local (`/videos/<clé>.mp4`) ou identifiant distant selon le provider. */
  id: string;
  /** Ratio CSS lu du manifeste, ex. `16/9` ou `569/270`. Jamais une valeur littérale. */
  aspectRatio: string;
  /** Titre du projet — sert au libellé accessible, pas à l'affichage. */
  title: string;
  /** null tant que le client n'a pas choisi sa frame. Aucune image n'est inventée. */
  poster?: Image | null;
  /**
   * Attribut `sizes` du poster. Le composant ignore la largeur qu'il occupera :
   * pleine page sur une fiche projet, cellule de grille sur l'accueil. Laisser
   * `100vw` en cellule ferait télécharger des variantes deux fois trop lourdes,
   * c'est donc à l'appelant de le déclarer.
   */
  sizes?: string;
  provider?: VideoProvider;
  className?: string;
};

function embedUrl(provider: VideoProvider, id: string): string {
  switch (provider) {
    case 'vimeo':
      return `https://player.vimeo.com/video/${encodeURIComponent(id)}?autoplay=1`;
    case 'cloudflare':
      return `https://iframe.videodelivery.net/${encodeURIComponent(id)}?autoplay=true`;
    default:
      return id;
  }
}

/**
 * Rend les variantes produites par le pipeline plutôt que de repasser par
 * next/image : les largeurs et les formats sont déjà figés au build, et les
 * dimensions viennent du manifeste, donc aucun décalage de mise en page.
 */
function PosterImage({ image, sizes }: { image: Image; sizes: string }) {
  const byFormat = (format: Image['sources'][number]['format']) =>
    image.sources
      .filter((source) => source.format === format)
      .map((source) => `${source.src} ${source.width}w`)
      .join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={byFormat('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={byFormat('webp')} sizes={sizes} />
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ backgroundImage: `url(${image.lqip})`, backgroundSize: 'cover' }}
      />
    </picture>
  );
}

export function ProjectVideo({
  id,
  aspectRatio,
  title,
  poster = null,
  sizes = '100vw',
  provider = VIDEO_PROVIDER,
  className,
}: ProjectVideoProps) {
  const [active, setActive] = useState(false);

  return (
    <div
      // Le ratio est posé avant tout chargement : la bascule local -> embed
      // distant ne peut pas provoquer de saut de mise en page.
      style={{ aspectRatio }}
      className={`relative w-full overflow-hidden bg-neutral-900 ${className ?? ''}`}
    >
      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={ui.video.playLabel(title)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* Poster non choisi : surface neutre. Ni frame arbitraire, ni message. */}
          {poster && <PosterImage image={poster} sizes={sizes} />}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 transition group-hover:border-white group-hover:bg-white/10"
          >
            <span className="ml-1 block h-0 w-0 border-y-8 border-l-[14px] border-y-transparent border-l-white" />
          </span>
        </button>
      )}

      {active &&
        (provider === 'local' ? (
          <video
            src={id}
            poster={poster?.src}
            controls
            autoPlay
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <iframe
            src={embedUrl(provider, id)}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ))}
    </div>
  );
}

export default ProjectVideo;
