/**
 * Texte de présentation de l'agence — §3.3 étape 6, lu dans Sanity depuis
 * l'étape 3.
 *
 * SAISI PAR LA CLIENTE DANS LE STUDIO, RENDU VERBATIM. Rien n'est réécrit,
 * reformulé ni corrigé ici : ni la ponctuation, ni les apostrophes
 * typographiques, ni les tirets cadratins. Le composant ne contient aucune
 * chaîne en dur.
 *
 * Le premier intertitre sert de titre de page (h1), les suivants sont des h2 :
 * la structure de titres suit le texte client, on ne lui superpose pas un
 * « About » générique.
 */

import { cache } from 'react';

import { getSiteSettings, sanityImageToImage, type Image } from './projects';

export type AboutSection = {
  heading: string;
  /** Un élément par paragraphe, découpé tel que la cliente l'a saisi. */
  body: string[];
};

export type About = {
  sections: AboutSection[];
  /**
   * Portrait de l'agence. Tant qu'il manque, la page réserve son emplacement
   * plutôt que d'emprunter une image de projet. Signalé par reportMissingContent().
   */
  portrait?: Image;
};

export const getAbout = cache(async (): Promise<About> => {
  const settings = await getSiteSettings();
  const sections = (settings?.about ?? [])
    .filter((section) => section.heading)
    .map((section) => ({
      heading: section.heading as string,
      body: (section.body ?? []).filter((paragraph) => paragraph.trim() !== ''),
    }));
  const portrait = sanityImageToImage(settings?.portrait);
  return { sections, ...(portrait ? { portrait } : {}) };
});

/**
 * Première phrase du texte client, reprise telle quelle pour la meta
 * description. Rien n'est rédigé ni résumé ici. undefined tant que le texte
 * n'est pas saisi : pas de meta plutôt qu'une meta vide.
 */
export async function getAboutDescription(): Promise<string | undefined> {
  const about = await getAbout();
  return about.sections[0]?.body[0];
}
