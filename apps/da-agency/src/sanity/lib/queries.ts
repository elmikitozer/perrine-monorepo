/**
 * Requêtes GROQ du site — étape 3 de la mise en place de Sanity.
 *
 * Deux lectures, toutes deux au build : les projets visibles dans l'ordre du
 * studio, et le document unique de réglages. Les projections sont explicites,
 * champ par champ : ce que le site consomme est ce qui est demandé, rien de
 * plus, et un champ ajouté au schéma n'atteint pas le rendu par accident.
 *
 * Les types ci-dessous décrivent la FORME DES RÉSULTATS de ces requêtes, pas
 * les documents Sanity. C'est content/projects.ts qui les convertit vers le
 * modèle du site (Project, Image), inchangé par la migration.
 */

import { groq } from 'next-sanity';

/** Une image avec son asset résolu : dimensions et LQIP viennent des métadonnées Sanity. */
const IMAGE_PROJECTION = groq`{
  alt,
  hotspot,
  crop,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions { width, height } }
  }
}`;

const FILE_PROJECTION = groq`{ asset->{ _id, url, size } }`;

export const PROJECTS_QUERY = groq`
  *[_type == "project" && isVisible == true] | order(orderRank asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    client,
    year,
    location,
    description,
    credits[] { role, name },
    cover ${IMAGE_PROJECTION},
    gallery[] ${IMAGE_PROJECTION},
    loopStart,
    videoProxy ${FILE_PROJECTION},
    videoLoop ${FILE_PROJECTION},
    videoPoster ${IMAGE_PROJECTION},
    videoProxyMeta { width, height, durationSeconds },
    videoLoopMeta { width, height, durationSeconds, startSeconds }
  }
`;

export const SITE_SETTINGS_QUERY = groq`
  *[_id == "siteSettings"][0] {
    about[] { heading, body },
    portrait ${IMAGE_PROJECTION},
    linkedin,
    instagram,
    legalNotice
  }
`;

export type SanityImage = {
  alt?: string;
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  asset?: {
    _id: string;
    url: string;
    metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
  };
};

export type SanityFile = {
  asset?: { _id: string; url: string; size?: number };
};

export type SanityProject = {
  _id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  client?: string;
  year?: number;
  location?: string;
  description?: string;
  credits?: { role?: string; name?: string }[];
  cover?: SanityImage;
  gallery?: SanityImage[];
  loopStart?: number;
  videoProxy?: SanityFile;
  videoLoop?: SanityFile;
  videoPoster?: SanityImage;
  videoProxyMeta?: { width?: number; height?: number; durationSeconds?: number };
  videoLoopMeta?: { width?: number; height?: number; durationSeconds?: number; startSeconds?: number };
};

export type SanitySiteSettings = {
  about?: { heading?: string; body?: string[] }[];
  portrait?: SanityImage;
  linkedin?: string;
  instagram?: string;
  legalNotice?: string;
} | null;
