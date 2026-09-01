/**
 * §3.3 étapes 3 et 4 — fiche projet, les trois états du catalogue.
 *
 *   film + galerie   AREAL KIM JONES
 *   film seul        DIOR TRUNK SHOW, VILLA DIOR    -> aucune section galerie
 *   galerie seule    ANTAZERO, ERL SEASON 14        -> aucun lecteur
 *
 * Deux traitements de galerie coexistent, déclarés dans le contenu :
 * `grid` (cellules 3:2) et `sequential` (plein cadre, réservé à Antazero).
 *
 * Le quatrième état du brief, « aucun asset exploitable », n'a plus de sujet :
 * Kris Van Assche a été retiré du catalogue le 19/08.
 *
 * Aucune de ces trois formes n'est un cas particulier dans le rendu. Une
 * section absente n'est pas une section vide : elle n'est pas rendue.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProject, projects, type Image, type ImageFormat, type Project } from '@content/projects';
import { ProjectVideo } from '@/components/ProjectVideo';

// Les 5 projets du catalogue sont générés. Un slug inconnu renvoie 404 plutôt
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
/** La galerie séquentielle sort du conteneur : chaque image occupe la fenêtre. */
const SEQUENTIAL_SIZES = '100vw';

function ProjectImage({
  image,
  sizes,
  priority = false,
  className = 'h-full w-full object-cover',
}: {
  image: Image;
  sizes: string;
  /** Vrai pour la seule image visible au chargement : elle ne doit pas être différée. */
  priority?: boolean;
  className?: string;
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
        className={className}
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
          // Le corpus est en 3:2 strict. Un portrait dans une cellule paysage
          // perdrait son sujet : il occupe deux rangs, ce qui ne lui coûte
          // qu'un recadrage marginal en haut et en bas.
          className={
            image.orientation === 'portrait'
              ? 'relative aspect-[2/3] overflow-hidden bg-neutral-100 md:row-span-2 md:aspect-auto md:h-full'
              : 'relative aspect-[3/2] overflow-hidden bg-neutral-100'
          }
        >
          <ProjectImage image={image} sizes={GALLERY_SIZES} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Plein cadre séquentiel, réservé à Antazero.
 *
 * Les images gardent leur ratio 3:2 natif sur toute la largeur de la fenêtre :
 * à 6800 px de source, elles supportent l'agrandissement, et ne pas recadrer
 * est justement ce qui motive ce traitement plutôt que la grille.
 *
 * Le palier maximal du pipeline est 2048 px : au-delà d'une fenêtre de 2048 px
 * le navigateur étire la plus grande variante. C'est le compromis de poids
 * arrêté en Phase 2, pas un oubli.
 */
function SequentialGallery({ gallery }: { gallery: Image[] }) {
  if (gallery.length === 0) return null;

  return (
    <div className="space-y-2 md:space-y-4">
      {gallery.map((image, index) => (
        <figure key={image.src} className="relative w-full bg-neutral-100">
          <ProjectImage
            image={image}
            sizes={SEQUENTIAL_SIZES}
            priority={index === 0}
            className="h-auto w-full"
          />
        </figure>
      ))}
    </div>
  );
}

function ProjectHeader({ project }: { project: Project }) {
  // client, année et type sont fournis ; lieu et description ne le sont pas et
  // ne sont donc pas rendus — pas de ligne vide, pas de placeholder.
  const meta = [project.client, String(project.year), project.eventType];

  return (
    <header className="mb-8 md:mb-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{project.title}</h1>
      <p className="mt-3 text-sm uppercase tracking-widest text-neutral-500">
        {meta.join(' · ')}
      </p>
      {project.location && <p className="mt-2 text-neutral-600">{project.location}</p>}
      {project.description && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-700">
          {project.description}
        </p>
      )}
    </header>
  );
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const sequential = project.galleryLayout === 'sequential';

  return (
    <article className="pb-12 md:pb-20">
      {/*
        L'espacement vit sur le conteneur : un projet en film seul ne doit pas
        traîner la marge basse du lecteur, ni un projet en galerie seule celle
        d'une section absente.
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

        {!sequential && <ProjectGallery gallery={project.gallery} />}
      </div>

      {/* Hors conteneur : le plein cadre occupe toute la largeur de la fenêtre. */}
      {sequential && (
        <div className="mt-10 md:mt-16">
          <SequentialGallery gallery={project.gallery} />
        </div>
      )}
    </article>
  );
}
