/**
 * Identité du site hors projets : pied de page, comptes sociaux, mentions
 * légales.
 *
 * Deux origines. Le logo et le nom légal vivent ici, dans le dépôt : le logo
 * est un fichier produit par scripts/build-logo.mjs, pas un contenu que la
 * cliente édite. Les comptes sociaux, le contact et les mentions légales viennent du
 * document `siteSettings` de Sanity, saisis dans le studio.
 *
 * Même règle qu'ailleurs — un champ que la cliente n'a pas fourni reste
 * `undefined` et n'est pas rendu. Aucune URL n'est devinée : un lien social qui
 * pointe sur le mauvais compte est pire que pas de lien, et une mention légale
 * inventée engage la structure. reportMissingContent() les signale au build.
 */

import { cache } from 'react';

import { getSiteSettings } from './projects';

/**
 * Logo fourni par la cliente, servi depuis public/brand/ par
 * scripts/build-logo.mjs. Deux déclinaisons du verrouillage complet parce que
 * le fichier reçu n'est lisible sur aucun fond, et le monogramme seul, le seul
 * lisible en petit.
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
  /** Porté par le pied de page, aux côtés de l'année. */
  legalName: string;
};

/** Ce qui ne vient pas du studio. */
export const site: Site = {
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
  legalName: 'LD Productions',
};

export type Contact = {
  /** Adresse mail de l'agence. undefined = lien non rendu. */
  email?: string;
  /** Téléphone tel que la cliente l'a saisi, espaces compris : c'est la forme affichée. */
  phone?: string;
};

export type SiteContent = {
  /** L'ordre du tableau est l'ordre d'affichage. */
  social: SocialAccount[];
  contact: Contact;
  /** Corps des mentions légales, un élément par paragraphe. Vide tant que la cliente n'a rien saisi. */
  legalNotice: string[];
};

/** Ce qui vient du studio. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const settings = await getSiteSettings();
  return {
    social: [
      { label: 'LinkedIn', ...(settings?.linkedin ? { href: settings.linkedin } : {}) },
      { label: 'Instagram', ...(settings?.instagram ? { href: settings.instagram } : {}) },
    ],
    contact: {
      ...(settings?.email?.trim() ? { email: settings.email.trim() } : {}),
      ...(settings?.phone?.trim() ? { phone: settings.phone.trim() } : {}),
    },
    // Un paragraphe par ligne vide, comme le demande le champ du studio.
    legalNotice: (settings?.legalNotice ?? '')
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph !== ''),
  };
});

/**
 * Année du copyright.
 *
 * Le site est entièrement statique : cette valeur est figée au build, pas à la
 * visite. Un site redéployé au moins une fois l'an reste juste ; sinon c'est le
 * déploiement qui a vieilli, pas le code.
 */
export const copyrightYear: number = new Date().getFullYear();
