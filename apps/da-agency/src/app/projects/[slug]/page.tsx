/**
 * §3.3 étapes 3 et 4 — fiche projet, les trois états du catalogue.
 *
 *   film + galerie   AREAL KIM JONES
 *   film seul        DIOR TRUNK SHOW, VILLA DIOR, ERL SEASON 13  -> aucune section galerie
 *   galerie seule    les 7 autres                                -> aucun lecteur
 *
 * La galerie a un seul traitement, la grille de cellules. Antazero a eu un
 * temps un plein cadre séquentiel ; il a été retiré à la demande de la cliente,
 * qui veut le même rendu qu'ERL sur tout le catalogue.
 *
 * Le quatrième état du brief, « aucun asset exploitable », n'a plus de sujet :
 * Nectar Vessels, retiré le 19/08 pour ses sources à 533 px, est revenu avec
 * la v2 à 2560 px.
 *
 * Aucune de ces trois formes n'est un cas particulier dans le rendu. Une
 * section absente n'est pas une section vide : elle n'est pas rendue.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';

import { getProject, projects, type Image, type ImageFormat, type Project } from '@content/projects';
import { ui } from '@content/ui';
import { ProjectVideo } from '@/components/ProjectVideo';

// Les 11 projets du catalogue sont générés. Un slug inconnu renvoie 404 plutôt
// que d'être rendu à la demande.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};

  // Le nom du site est ajouté par le template défini dans layout.tsx.
  // Pas de description : le client ne l'a pas fournie et une meta inventée se
  // retrouverait dans les résultats de recherche.
  return { title: project.title };
}

/**
 * Largeurs réelles occupées par les visuels, pour que le navigateur choisisse
 * la bonne variante. Le conteneur plafonne à 1152 px (max-w-6xl), la grille est
 * à deux colonnes au-delà de 768 px.
 */
const VIDEO_SIZES = '(min-width: 1200px) 1152px, 100vw';
const GALLERY_SIZES = '(min-width: 1200px) 576px, (min-width: 768px) 50vw, 100vw';

function ProjectImage({
  image,
  sizes,
  priority = false,
}: {
  image: Image;
  sizes: string;
  /** Vrai pour la seule image visible au chargement : elle ne doit pas être différée. */
  priority?: boolean;
}) {
  const srcSet = (format: ImageFormat) =>
    image.sources
      .filter((source) => source.format === format)
      .map((source) => `${source.src} ${source.width}w`)
      .join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        // Différer l'image d'en-tête retarderait le plus grand élément de la
        // page ; différer les suivantes évite de télécharger 7 images d'un coup.
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        className="h-full w-full object-cover"
        style={{ backgroundImage: `url(${image.lqip})`, backgroundSize: 'cover' }}
      />
    </picture>
  );
}

function ProjectGallery({ gallery }: { gallery: Image[] }) {
  // [] est un état nominal ailleurs dans le catalogue : on ne rend pas une
  // section vide, on ne rend rien.
  if (gallery.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
      {gallery.map((image, index) => (
        <li
          key={image.src}
          // Le corpus n'est plus en 3:2 strict : la v2 apporte cinq 4:5 et un
          // 5:4 (docs/inventory-v2.md). Deux régimes, décidés en direction
          // artistique le 04/09 :
          //   - colonne unique mobile : le ratio natif de l'image. Rien n'a à
          //     s'aligner horizontalement, et un 4:5 forcé en 2:3 perdrait 17 %
          //     de sa largeur ;
          //   - grille à partir de md : cellule 3:2 pour les paysages, deux rangs
          //     (soit 3:4) pour les portraits. Un 4:5 n'y perd que 6 %, un 2:3
          //     en perd 11 % — le sujet reste entier. Le seul 5:4 (SITE_2.1) perd
          //     17 % de hauteur en cellule 3:2 ; accepté en galerie, refusé en
          //     couverture d'accueil, où une autre photo est choisie.
          style={{ '--native-ratio': `${image.width} / ${image.height}` } as CSSProperties}
          className={
            image.orientation === 'portrait'
              ? 'relative aspect-[var(--native-ratio)] overflow-hidden bg-neutral-100 dark:bg-neutral-800 md:row-span-2 md:aspect-auto md:h-full'
              : 'relative aspect-[var(--native-ratio)] overflow-hidden bg-neutral-100 dark:bg-neutral-800 md:aspect-[3/2]'
          }
        >
          <ProjectImage image={image} sizes={GALLERY_SIZES} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Hiérarchie validée par la cliente (07/09), dans cet ordre :
 *   1. titre — grand, capitales, gras ;
 *   2. sous-titre — petit, capitales, gris : client, année, type ;
 *   3. texte de présentation ;
 *   4. crédits photographes.
 * Les capitales du titre sont imposées par la classe et non laissées au
 * contenu : le catalogue est en capitales aujourd'hui, un titre saisi en
 * minuscules demain doit s'afficher pareil.
 */
function ProjectHeader({ project }: { project: Project }) {
  // Année et type sont toujours fournis ; le client manque sur six projets de
  // la v2, lieu et description partout. Un champ absent n'est pas rendu — pas
  // de ligne vide, pas de séparateur orphelin, pas de placeholder.
  const meta = [project.client, String(project.year), project.eventType].filter(
    (value): value is string => Boolean(value)
  );

  return (
    <header className="mb-8 md:mb-12">
      <h1 className="text-3xl font-bold uppercase tracking-tight md:text-5xl">{project.title}</h1>
      <p className="mt-3 text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        {meta.join(' · ')}
      </p>
      {project.location && (
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">{project.location}</p>
      )}
      {project.description && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          {project.description}
        </p>
      )}
      {/* Crédits photographes en dernier, en ligne discrète : un cran plus
          petit et plus clair que le sous-titre, pour ne pas le concurrencer. */}
      {project.credits && (
        <p className="mt-4 text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {ui.project.photoCredits} · {project.credits}
        </p>
      )}
    </header>
  );
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <article className="pb-12 pt-8 md:pb-20 md:pt-12">
      {/*
        L'espacement vit sur le conteneur : un projet en film seul ne doit pas
        traîner la marge basse du lecteur, ni un projet en galerie seule celle
        d'une section absente. La marge haute tient le titre à distance de la
        bande sombre de l'en-tête (retour cliente, 07/09).
      */}
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 md:space-y-16 md:px-6">
        <ProjectHeader project={project} />

        {project.video && (
          <ProjectVideo
            id={project.video.id}
            aspectRatio={project.video.aspectRatio}
            poster={project.video.poster}
            title={project.title}
            sizes={VIDEO_SIZES}
          />
        )}

        <ProjectGallery gallery={project.gallery} />
      </div>
    </article>
  );
}
