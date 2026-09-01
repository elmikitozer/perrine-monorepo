/**
 * Texte de présentation de l'agence — §3.3 étape 6.
 *
 * FOURNI PAR LE CLIENT, UTILISÉ VERBATIM. Ne rien réécrire, reformuler ni
 * corriger : ni la ponctuation, ni les apostrophes typographiques (’), ni les
 * tirets cadratins (—). Ce fichier est la seule source du texte ; le composant
 * ne contient aucune chaîne en dur.
 *
 * Le premier intertitre sert de titre de page (h1), les deux autres sont des
 * h2 : la structure de titres suit le texte client, on ne lui superpose pas un
 * « About » générique.
 */

import type { Image } from './projects';

export type AboutSection = {
  heading: string;
  /** Un élément par paragraphe, découpé tel que le client l'a envoyé. */
  body: string[];
};

export type About = {
  sections: AboutSection[];
  /**
   * Portrait de l'agence. Non fourni à ce jour : la page réserve son
   * emplacement plutôt que d'emprunter une image de projet.
   * Signalé par reportMissingContent().
   */
  portrait?: Image;
};

export const about: About = {
  sections: [
    {
      heading: 'A Global Luxury Event Agency',
      body: [
        'LD Productions is a new-generation event production agency operating worldwide, led by Laetitia Delfar and Frédéric Foret, with offices in Brussels and Paris.',
        'For more than 15 years, the agency has been designing and producing exceptional experiences for the world’s most prestigious luxury brands.',
        'Recognized by DIOR Haute Joaillerie, DIOR Men, Elie Saab, ERL, and Dom Pérignon, among other renowned luxury brands, we are committed to achieving excellence and driven by innovation and the satisfaction of our client partners.',
      ],
    },
    {
      heading: 'Agility and Expertise Without Borders',
      body: ['What sets LD Productions apart is its agility: streamlined processes, fast decision-making, and a uniquely flexible approach that allows us to deliver with efficiency and excellence. Our international network of highly skilled and passionate collaborators brings unmatched expertise to every project, ensuring flawless execution wherever the event takes place.'],
    },
    {
      heading: 'Ingenuity and Creative Excellence',
      body: ['Driven by values of transparency, trust, and excellence — always paired with creativity and a genuine sense of joy — LD Productions is recognized for the quality, artistry, and innovation of its work. With a strong advertising culture at its core, the agency pushes creative boundaries and embraces new image technologies, including cutting-edge applications of AI in audiovisual production. This commitment to innovation allows LD Productions to craft films, content, and immersive experiences of exceptional quality, creativity, and impact.'],
    },
  ],
  // Reste undefined tant que le client n'a pas fourni d'image.
  portrait: undefined,
};

/**
 * Première phrase du texte client, reprise telle quelle pour la meta
 * description. Rien n'est rédigé ni résumé ici.
 */
export const aboutDescription: string = about.sections[0].body[0];
