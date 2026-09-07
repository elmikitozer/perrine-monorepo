/**
 * §3.3 étape 6 — page à propos.
 *
 * Tout le texte vient de content/about.ts, verbatim. Aucune chaîne éditoriale
 * n'est écrite ici, et la mise en page n'en découpe ni n'en réordonne aucune :
 * elle prend les sections telles que la cliente les a écrites.
 *
 * Structure de titres : le premier intertitre du client EST le titre de la
 * page (h1), les deux suivants sont des h2. Aucun « About » générique n'est
 * ajouté au-dessus — il ferait doublon avec un titre que le client a déjà écrit.
 *
 * Mise en page reprise après retour client : une colonne de 65 caractères au
 * milieu d'un écran de 1400 px laissait les deux tiers de la page vides. Le
 * texte occupe maintenant une grille de 12 colonnes, sur deux principes
 * éditoriaux plutôt qu'un étirement de la colonne — un texte long en pleine
 * largeur d'écran serait illisible :
 *
 *   - l'ouverture est traitée en chapô : la première phrase en gros corps à
 *     gauche, la suite en corps courant à droite. Deux colonnes, deux niveaux
 *     de lecture, toute la largeur occupée ;
 *   - les sections suivantes portent leur intertitre en marge, collant au haut
 *     de leur paragraphe pendant qu'on le lit. C'est ce que la cliente a
 *     demandé, et c'est ce qui donne au reste de la page son axe vertical.
 *
 * Sous lg, tout retombe en une seule colonne : la grille ne sert qu'à remplir
 * un écran large, elle n'a rien à imposer à un téléphone.
 */

import type { Metadata } from 'next';

import { about, aboutDescription } from '@content/about';
import type { Image, ImageFormat } from '@content/projects';
import { ui } from '@content/ui';
import { PlaceholderFrame } from '@/components/PlaceholderFrame';

/** Le portrait occupe la colonne de texte : 8 colonnes sur 12, plafonnées. */
const PORTRAIT_SIZES = '(min-width: 1200px) 736px, (min-width: 768px) 66vw, 100vw';

function AgencyPortrait({ image }: { image: Image }) {
  const srcSet = (format: ImageFormat) =>
    image.sources
      .filter((source) => source.format === format)
      .map((source) => `${source.src} ${source.width}w`)
      .join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={PORTRAIT_SIZES} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={PORTRAIT_SIZES} />
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className="h-auto w-full"
        style={{ backgroundImage: `url(${image.lqip})`, backgroundSize: 'cover' }}
      />
    </picture>
  );
}

export const metadata: Metadata = {
  title: about.sections[0].heading,
  // Première phrase du texte client, reprise telle quelle.
  description: aboutDescription,
};

export default function AboutPage() {
  const [lead, ...rest] = about.sections;
  // Le chapô est le premier paragraphe du client, pas une phrase extraite : le
  // découpage en paragraphes est le sien. `support` peut être vide, et le jour
  // où l'ouverture ne fera qu'un paragraphe la colonne de droite ne sera pas
  // rendue plutôt que d'être rendue vide.
  const [standfirst, ...support] = lead.body;

  return (
    // Marge haute alignée sur les fiches projet : même distance entre la bande
    // sombre de l'en-tête et le titre, sur toutes les pages (retour cliente, 07/09).
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pb-24 md:pt-12">
      <article>
        <section>
          <h1 className="max-w-[16ch] text-4xl font-medium leading-[1.06] tracking-tight md:text-6xl lg:text-7xl">
            {lead.heading}
          </h1>

          <div className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800 md:mt-14 md:pt-10 lg:grid lg:grid-cols-12 lg:gap-x-12">
            <p className="text-xl leading-relaxed text-neutral-900 dark:text-neutral-100 md:text-2xl md:leading-relaxed lg:col-span-5">
              {standfirst}
            </p>
            {support.length > 0 && (
              <div className="mt-6 space-y-4 lg:col-span-6 lg:col-start-7 lg:mt-0">
                {support.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>

        {rest.map((section) => (
          <section
            key={section.heading}
            className="mt-14 border-t border-neutral-200 pt-8 dark:border-neutral-800 md:mt-20 md:pt-10 lg:grid lg:grid-cols-12 lg:gap-x-12"
          >
            {/*
              Intertitre en marge. `self-start` est ce qui rend le `sticky`
              possible : sans lui l'élément de grille s'étire sur toute la
              hauteur de la rangée et n'a plus de course pour se décoller.
            */}
            <h2 className="text-xl font-medium leading-snug tracking-tight lg:sticky lg:top-8 lg:col-span-3 lg:self-start lg:text-2xl">
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 lg:col-span-8 lg:col-start-5 lg:mt-0">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/*
        Portrait d'agence non fourni. On réserve la place plutôt que d'emprunter
        une image de projet : ces photos appartiennent à des productions
        clientes et ne représentent pas l'agence. Aligné sur la colonne de
        texte, pour que son arrivée ne déplace pas l'axe de la page.
      */}
      <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-8 lg:col-start-5">
          {about.portrait ? (
            <AgencyPortrait image={about.portrait} />
          ) : (
            <PlaceholderFrame label={ui.about.portraitPlaceholder} aspectRatio="3 / 2" />
          )}
        </div>
      </div>
    </div>
  );
}
