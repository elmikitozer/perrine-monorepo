'use client';

/**
 * Tuile de l'accueil : un visuel fixe, et pour les projets qui ont un film,
 * une boucle muette qui démarre quand la tuile entre dans le viewport.
 *
 * Le déclencheur était le survol ; il est passé à l'IntersectionObserver à la
 * demande de la cliente. Ce n'est pas qu'un changement d'écouteur : le survol
 * n'existe pas sur un écran tactile, ce que gardait `(hover: hover)`. La
 * visibilité, elle, est vraie partout — le garde est donc tombé avec lui, et le
 * mobile lit maintenant les mêmes boucles que le desktop.
 *
 * Ce qui n'a pas bougé, et qui compte :
 *   - <video muted loop playsInline preload="none"> : rien n'est téléchargé
 *     tant que la lecture n'est pas demandée. C'est la raison pour laquelle une
 *     boucle par tuile ne coûte rien au chargement de la page, alors que cinq
 *     tuiles sont rendues d'un coup ;
 *   - load() si readyState vaut 0, sinon play() n'a rien à lire ;
 *   - play() renvoie une promesse que le navigateur peut rejeter (politique
 *     d'autoplay, économie d'énergie iOS, onglet en arrière-plan) : elle est
 *     absorbée, et la tuile reste sur son visuel fixe. Un refus de lecture ne
 *     casse rien et ne remonte pas en erreur ;
 *   - garde prefers-reduced-motion : sous cette préférence aucun observateur
 *     n'est même posé, donc aucune boucle ne démarre.
 *
 * En sortie de viewport la boucle est mise en pause et rembobinée : au passage
 * suivant elle repart de son début plutôt que du milieu d'un plan.
 */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { Image, ImageFormat, Project } from '@content/projects';
import { ui } from '@content/ui';
import { PlaceholderFrame } from './PlaceholderFrame';

/** Une tuile occupe une colonne : un tiers de la fenêtre sur desktop. */
const TILE_SIZES = '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw';

/**
 * Part de la tuile qui doit être visible pour que la boucle parte. Un tiers :
 * assez pour que la tuile soit franchement à l'écran, assez peu pour que le
 * film ait démarré quand le regard l'atteint. À 0, une tuile effleurée en bas
 * de fenêtre déclencherait un téléchargement pour rien.
 */
const PLAY_THRESHOLD = 0.34;

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
  const tileRef = useRef<HTMLLIElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const loop = project.video?.loop ?? null;

  useEffect(() => {
    const tile = tileRef.current;
    // Pas de boucle sur ce projet, ou navigateur sans IntersectionObserver : la
    // tuile reste sur son visuel fixe, ce qui est un état nominal du catalogue.
    if (!loop || !tile || typeof IntersectionObserver === 'undefined') return;

    const play = () => {
      const video = videoRef.current;
      if (!video) return;
      // preload="none" : la source n'est pas encore chargée à la première
      // entrée dans le viewport.
      if (video.readyState === 0) video.load();
      setPlaying(true);
      // Refus du navigateur (mobile en économie d'énergie, onglet masqué) :
      // on repasse sur le visuel fixe sans faire de bruit.
      void video.play().catch(() => setPlaying(false));
    };

    const rewind = () => {
      const video = videoRef.current;
      if (!video) return;
      video.pause();
      if (video.readyState > 0) video.currentTime = 0;
      setPlaying(false);
    };

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | null = null;

    // Relancé si la préférence change en cours de session : l'observateur est
    // posé ou retiré, il n'est jamais seulement ignoré.
    const sync = () => {
      observer?.disconnect();
      observer = null;
      rewind();
      if (motion.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) play();
            else rewind();
          }
        },
        { threshold: PLAY_THRESHOLD }
      );
      observer.observe(tile);
    };

    sync();
    motion.addEventListener('change', sync);
    return () => {
      motion.removeEventListener('change', sync);
      observer?.disconnect();
    };
  }, [loop]);

  const still = project.cover;

  return (
    <li ref={tileRef} className="relative aspect-[3/2] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      <Link href={`/projects/${project.slug}`} className="group block h-full w-full">
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
