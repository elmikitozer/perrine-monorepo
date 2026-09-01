/**
 * §3.3 étape 6 — page à propos.
 *
 * Tout le texte vient de content/about.ts, verbatim. Aucune chaîne éditoriale
 * n'est écrite ici.
 *
 * Structure de titres : le premier intertitre du client EST le titre de la
 * page (h1), les deux suivants sont des h2. Aucun « About » générique n'est
 * ajouté au-dessus — il ferait doublon avec un titre que le client a déjà écrit.
 *
 * Aucune image dans cette itération. La mise en page tient à la typographie :
 * colonne de texte à ~65 caractères, contraste net entre intertitre et corps,
 * et beaucoup d'air entre les trois sections. Le conteneur reste celui des
 * fiches projet pour que la page appartienne au même gabarit.
 */

import type { Metadata } from 'next';

import { about, aboutDescription } from '@content/about';
import type { Image, ImageFormat } from '@content/projects';
import { ui } from '@content/ui';
import { PlaceholderFrame } from '@/components/PlaceholderFrame';

/** Largeur réelle de la colonne de texte, que le portrait ne dépasse pas. */
const PORTRAIT_SIZES = '(min-width: 768px) 600px, 100vw';

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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
      <article className="max-w-[65ch]">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{lead.heading}</h1>
          <div className="mt-6 space-y-4 md:mt-8">
            {lead.body.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-neutral-700">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {rest.map((section) => (
          <section key={section.heading} className="mt-16 md:mt-24">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{section.heading}</h2>
            <div className="mt-4 space-y-4 md:mt-6">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-relaxed text-neutral-700">
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
        clientes et ne représentent pas l'agence.
      */}
      <div className="mt-16 max-w-[65ch] md:mt-24">
        {about.portrait ? (
          <AgencyPortrait image={about.portrait} />
        ) : (
          <PlaceholderFrame label={ui.about.portraitPlaceholder} aspectRatio="3 / 2" />
        )}
      </div>
    </div>
  );
}
