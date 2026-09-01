'use client';

/**
 * Tuile de l'accueil : un visuel fixe, et pour les projets qui ont un film,
 * une boucle muette qui démarre au survol.
 *
 * Mécanique reprise du site Gil Anselmi (son identité visuelle, elle, n'est pas
 * reprise) :
 *   - <video muted loop playsInline preload="none"> : rien n'est téléchargé
 *     tant que la lecture n'est pas demandée ;
 *   - load() si readyState vaut 0, sinon play() n'a rien à lire ;
 *   - play() renvoie une promesse que le navigateur peut rejeter (politique
 *     d'autoplay, onglet en arrière-plan) : elle est absorbée, un refus de
 *     lecture ne doit pas remonter en erreur ;
 *   - garde prefers-reduced-motion avant toute lecture.
 *
 * Deux écarts par rapport à Anselmi, demandés ici :
 *   - le déclencheur est le survol, pas l'IntersectionObserver ;
 *   - sur un appareil sans survol, rien ne démarre. `(hover: hover)` distingue
 *     un vrai pointeur d'un écran tactile, où un survol simulé au premier
 *     toucher lancerait une vidéo que personne n'a demandée.
 */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Image, ImageFormat, Project } from '@content/projects';
import { ui } from '@content/ui';
import { PlaceholderFrame } from './PlaceholderFrame';

/** Une tuile occupe une colonne : un tiers de la fenêtre sur desktop. */
const TILE_SIZES = '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw';

function TileImage({ image, priority }: { image: Image; priority: boolean }) {
  const srcSet = (format: ImageFormat) =>
    image.sources
      .filter((source) => source.format === format)
      .map((source) => `${source.src} ${source.width}w`)
      .join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={TILE_SIZES} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={TILE_SIZES} />
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        className="h-full w-full object-cover"
        style={{ backgroundImage: `url(${image.lqip})`, backgroundSize: 'cover' }}
      />
    </picture>
  );
}

export function ProjectTile({ project, priority = false }: { project: Project; priority?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [playing, setPlaying] = useState(false);

  const loop = project.video?.loop ?? null;

  // Les deux requêtes média sont évaluées côté client uniquement : le rendu
  // serveur ne sait pas sur quel appareil il atterrira.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const hover = window.matchMedia('(hover: hover)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => setCanHover(hover.matches && !motion.matches);
    sync();

    hover.addEventListener('change', sync);
    motion.addEventListener('change', sync);
    return () => {
      hover.removeEventListener('change', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  const start = useCallback(() => {
    if (!canHover || !loop) return;
    const video = videoRef.current;
    if (!video) return;

    // preload="none" : la source n'est pas encore chargée au premier survol.
    if (video.readyState === 0) video.load();
    setPlaying(true);
    void video.play().catch(() => setPlaying(false));
  }, [canHover, loop]);

  const stop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    // Rembobiner : au survol suivant la boucle repart de son début plutôt que
    // de reprendre au milieu d'un plan.
    video.currentTime = 0;
    setPlaying(false);
  }, []);

  const still = project.cover;

  return (
    <li className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
      <Link
        href={`/projects/${project.slug}`}
        className="group block h-full w-full"
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
      >
        {/* Premier rendu : le visuel fixe, ou l'espace réservé s'il n'y en a pas. */}
        {still ? (
          <TileImage image={still} priority={priority} />
        ) : (
          <PlaceholderFrame
            label={project.video ? ui.index.filmOnly : ui.index.noVisual}
            aspectRatio="3 / 2"
            className="h-full"
          />
        )}

        {loop && (
          <video
            ref={videoRef}
            src={loop.src}
            width={loop.width}
            height={loop.height}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              playing ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Titre en surimpression, au survol seulement. Aucune légende permanente. */}
        <div className="hover-veil">
          <div className="hover-veil__scrim" />
          <span className="hover-veil__text font-display text-[13px] uppercase tracking-[0.22em] text-white md:text-sm">
            {project.title}
          </span>
        </div>
      </Link>
    </li>
  );
}

export default ProjectTile;
