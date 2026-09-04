/**
 * Libellés d'interface.
 *
 * Séparés du JSX parce que le site part en anglais et qu'une version française
 * n'est pas exclue (§3). Tant que la question n'est pas tranchée, ajouter une
 * seconde langue doit rester une copie de ce fichier, pas une chasse aux
 * chaînes dans les composants.
 *
 * Ne contient que du texte d'interface. Aucun texte client n'est écrit ici :
 * il vient du client, verbatim, ou il n'est pas rendu.
 */

export const ui = {
  video: {
    /** Libellé accessible du bouton de lecture. */
    playLabel: (title: string) => `Play the film — ${title}`,
  },
  index: {
    /** Cellule sans couverture : dit ce que contient le projet, sans image. */
    filmOnly: 'Film',
    noVisual: 'No visual',
  },
  project: {
    /**
     * Précède les crédits photographes de la fiche. Le nom des photographes
     * est un texte client (content/projects.ts) ; seul ce libellé est à nous.
     */
    photoCredits: 'Photography',
  },
  about: {
    /** Emplacement réservé au portrait d'agence, non fourni à ce jour. */
    portraitPlaceholder: 'Agency portrait',
  },
  footer: {
    /** Emplacement réservé au logo, non fourni à ce jour. */
    logoPlaceholder: 'Logo',
    /** Intitulé de la page de mentions légales, et son lien au pied de page. */
    legal: 'Legal notice',
  },
  legal: {
    /**
     * Ce que dit la page tant qu'elle n'a pas de texte. Ce n'est pas une
     * mention légale de remplacement : c'est l'aveu qu'il n'y en a pas encore.
     */
    pending: 'This page will carry the legal information of the company once published.',
  },
} as const;
