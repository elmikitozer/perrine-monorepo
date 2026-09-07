/**
 * Identité du site hors projets : pied de page, comptes sociaux, mentions
 * légales.
 *
 * Même règle qu'ailleurs — un champ que la cliente n'a pas fourni reste
 * `undefined` et n'est pas rendu. Aucune URL n'est devinée : un lien social qui
 * pointe sur le mauvais compte est pire que pas de lien, et une mention légale
 * inventée engage la structure. collectMissingSiteContent() les signale au
 * build ; docs/questions-client.md porte la question correspondante.
 */

/**
 * Logo fourni par la cliente. Typé à part des visuels de projet : il ne passe
 * pas par le pipeline images (celui-ci traite des photos, pas un logo à fond
 * transparent) mais par scripts/build-logo.mjs, qui le sert depuis public/brand/.
 *
 * Deux déclinaisons parce que le fichier reçu n'est lisible sur aucun fond :
 * monogramme #C0D3BF (1,58:1 sur blanc) et mot « Productions » noir. Le
 * monogramme est identique dans les deux, seul le mot change de couleur.
 *
 * Et une troisième forme, le monogramme seul : le mot fait 3,7 px de haut dans
 * un emplacement de 48 px, il ne se lit pas. Sous 120 px, c'est le monogramme
 * qu'on affiche ; le verrouillage complet est réservé aux usages plus grands.
 */
export type Logo = {
  /** Verrouillage complet, une déclinaison par fond. À réserver aux emplacements de 120 px et plus. */
  full: {
    src: { onLight: string; onDark: string };
    width: number;
    height: number;
  };
  /** Monogramme seul, recadré sur son contenu, lisible dès 48 px. Même pixels sur tout fond sombre. */
  monogram: {
    src: string;
    width: number;
    height: number;
  };
  /** Le nom de l'agence, pas le mot « logo ». */
  alt: string;
};

export type SocialAccount = {
  /** Le réseau, pas le pseudonyme. Sert de libellé affiché. */
  label: string;
  /** URL complète du compte. undefined = lien non rendu. */
  href?: string;
};

export type Site = {
  logo?: Logo;
  /** L'ordre du tableau est l'ordre d'affichage. */
  social: SocialAccount[];
  /**
   * Corps des mentions légales, un élément par paragraphe. Vide à ce jour : la
   * page existe et est liée, mais reste sans texte tant que la cliente n'a pas
   * donné le nom de la structure, son numéro d'entreprise et son adresse.
   */
  legalNotice: string[];
  /** Porté par le pied de page, aux côtés de l'année. */
  legalName: string;
};

export const site: Site = {
  // Export Canva livré le 04/09 dans la racine de sources. Dimensions du
  // fichier, imprimées par scripts/build-logo.mjs : carré à un pixel près.
  logo: {
    full: {
      src: {
        onLight: '/brand/ld-productions-on-light.webp',
        onDark: '/brand/ld-productions-on-dark.webp',
      },
      width: 534,
      height: 533,
    },
    monogram: {
      src: '/brand/ld-productions-monogram.webp',
      width: 326,
      height: 290,
    },
    alt: 'LD Productions',
  },
  social: [
    // URL transmises le 04/09, reprises telles quelles : le compte LinkedIn est
    // une page entreprise, l'Instagram porte le pseudonyme `productions.ld`.
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ld-productionssrl' },
    { label: 'Instagram', href: 'https://www.instagram.com/productions.ld/' },
  ],
  legalNotice: [],
  legalName: 'LD Productions',
};

/**
 * Année du copyright.
 *
 * Le site est entièrement statique : cette valeur est figée au build, pas à la
 * visite. Un site redéployé au moins une fois l'an reste juste ; sinon c'est le
 * déploiement qui a vieilli, pas le code.
 */
export const copyrightYear: number = new Date().getFullYear();
