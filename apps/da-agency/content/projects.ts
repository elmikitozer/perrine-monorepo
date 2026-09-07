/**
 * Modèle de contenu — §3.3 étape 1, alimenté par Sanity depuis l'étape 3.
 *
 * La source de vérité est le dataset Sanity (src/sanity/lib/queries.ts). Ce
 * module en fait le modèle du site : les types Project et Image gardent
 * exactement la forme qu'ils avaient quand le catalogue était un fichier, pour
 * que ProjectTile, ProjectVideo, la galerie et les pages n'aient pas changé.
 * Seule la lecture est devenue asynchrone.
 *
 * Aucun texte client n'est inventé ici. Ce qui manque reste absent, et
 * reportMissingContent() le signale au build.
 */

import { cache } from 'react';

import { client } from '../src/sanity/lib/client';
import { IMAGE_WIDTHS, imageUrl } from '../src/sanity/lib/image';
import {
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
  type SanityImage,
  type SanityProject,
  type SanitySiteSettings,
} from '../src/sanity/lib/queries';

/**
 * Un champ que le client n'a pas fourni reste `undefined` et n'est pas rendu.
 * Pas de texte de remplacement : un placeholder finit toujours par passer en
 * production. C'est reportMissingContent(), appelé au build, qui rend le manque
 * visible — dans la console, pas sur la page.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ImageFormat = 'avif' | 'webp';

export type ImageSource = {
  format: ImageFormat;
  width: number;
  height: number;
  bytes: number;
  src: string;
};

export type Image = {
  /** Identifiant de l'asset Sanity. Sert à désigner une image sans dépendre de sa position. */
  id: string;
  /** Plus grande variante : repli universel derrière le <picture>. */
  src: string;
  /** Dimensions de la source, figées au build → zéro CLS. */
  width: number;
  height: number;
  /**
   * Texte alternatif rendu. Toujours une chaîne, '' compris : en HTML, une
   * image décorative porte `alt=""`, elle ne porte pas d'attribut absent.
   * C'est `decorative` qui dit si ce '' est un choix ou un oubli.
   */
  alt: string;
  /**
   * true = l'image ne porte aucune information, son alt vide est délibéré et
   * elle ne doit pas être signalée comme manquante. Déclaré dans
   * DECORATIVE_IMAGES, jamais déduit.
   */
  decorative: boolean;
  lqip: string;
  sources: ImageSource[];
  orientation: 'landscape' | 'portrait' | 'square';
  /** Source sous 1600 px : ne jamais utiliser en pleine largeur. */
  belowMinWidth: boolean;
};

export type ProjectVideo = {
  /** URL du proxy servi par le CDN Sanity. */
  id: string;
  /** Lu depuis les mesures écrites par le script. Ne jamais coder un ratio en dur. */
  aspectRatio: string;
  /**
   * Image fixe du lecteur et de la tuile : la première frame de la boucle,
   * extraite au timecode choisi par la cliente.
   */
  poster: Image | null;
  /**
   * true = ce poster vient d'un timecode par défaut et non d'un choix de la
   * cliente. Signalé par reportMissingContent().
   */
  posterIsProvisional: boolean;
  /** Recadrage 3:2 pour la cellule d'accueil. null : la tuile recadre à la volée. */
  posterGrid: Image | null;
  durationSeconds: number;
  posterCandidates: number;
  /**
   * Extrait muet de 8 s pour la boucle de survol de l'accueil.
   * null si le script (étape 4) n'a pas encore tourné.
   */
  loop: ProjectVideoLoop | null;
};

export type ProjectVideoLoop = {
  src: string;
  width: number;
  height: number;
  durationSeconds: number;
};

export type ProjectStatus = 'complete' | 'awaiting-copy';

export type Project = {
  /** Identité publique : URL. Saisi dans le studio, généré depuis le titre. */
  slug: string;
  /** Identité de stockage : l'identifiant du document Sanity sans son préfixe. */
  assetKey: string;
  /** Origine du document, pour la traçabilité : `sanity:<_id>`. */
  sourceFolder: string;
  /**
   * Rang de publication, 1 pour le plus ancien. Dérivé de l'ordre du studio :
   * le dernier de la liste porte 1, le premier porte le nombre de projets.
   */
  publicationNumber: number;
  title: string;
  client?: string;
  year: number;
  /**
   * Libellé descriptif libre, PAS une taxonomie. Ne rien construire dessus :
   * ni filtre, ni page de catégorie, ni index par type.
   */
  eventType: string;
  /** Crédits photographes, tels que saisis. Les autres rôles ne sont pas rendus aujourd'hui. */
  credits?: string;
  location?: string;
  description?: string;
  video?: ProjectVideo;
  /** [] est un état nominal : les projets en film seul n'ont aucune photo. */
  gallery: Image[];
  /**
   * Visuel représentant le projet dans un index : la couverture choisie dans
   * le studio, à défaut le poster du film, à défaut la première image.
   * null quand rien n'est disponible.
   */
  cover: Image | null;
  status: ProjectStatus;
};

// ---------------------------------------------------------------------------
// Conversion Sanity -> modèle du site
// ---------------------------------------------------------------------------

/**
 * Images délibérément décoratives, par identifiant d'asset.
 *
 * Une image purement décorative doit porter `alt=""` — l'annoncer aux lecteurs
 * d'écran comme du contenu serait un bruit inutile. La déclarer ici la
 * distingue d'une image dont on attend encore le texte.
 *
 * Vide aujourd'hui : aucune des 49 images n'a été arbitrée.
 */
const DECORATIVE_IMAGES: ReadonlySet<string> = new Set<string>([]);

/** En dessous, l'image est inexploitable en pleine largeur (cf. docs/inventory.md). */
const MIN_USABLE_WIDTH = 1600;

function orientationOf(width: number, height: number): Image['orientation'] {
  if (width === height) return 'square';
  return width > height ? 'landscape' : 'portrait';
}

/**
 * Une image Sanity vers le modèle du site. null si l'asset manque : un champ
 * image vide dans le studio ne doit pas produire une balise cassée.
 *
 * Les variantes sont les mêmes URL pour AVIF et WebP : avec `auto=format`,
 * c'est Sanity qui choisit le format d'après le navigateur, et le <picture>
 * des composants n'a pas à changer.
 */
function toImage(image: SanityImage | undefined | null): Image | null {
  const asset = image?.asset;
  const dimensions = asset?.metadata?.dimensions;
  if (!asset || !dimensions) return null;

  const { width, height } = dimensions;
  const alt = image.alt?.trim() ?? '';
  const decorative = DECORATIVE_IMAGES.has(asset._id);
  if (decorative && alt !== '') {
    throw new Error(`${asset._id} est déclarée décorative mais porte un alt. Une image est l'un ou l'autre.`);
  }

  // Jamais d'agrandissement : une source de 1440 px ne produit pas de 2048.
  const widths: number[] = IMAGE_WIDTHS.filter((candidate) => candidate <= width);
  if (widths.length === 0) widths.push(width);

  const variants = widths.map((variantWidth) => ({
    width: variantWidth,
    height: Math.round((variantWidth * height) / width),
    bytes: 0,
    src: imageUrl(image, variantWidth),
  }));
  const sources: ImageSource[] = (['avif', 'webp'] as ImageFormat[]).flatMap((format) =>
    variants.map((variant) => ({ format, ...variant }))
  );

  return {
    id: asset._id,
    src: variants[variants.length - 1].src,
    width,
    height,
    alt,
    decorative,
    lqip: asset.metadata?.lqip ?? '',
    sources,
    orientation: orientationOf(width, height),
    belowMinWidth: width < MIN_USABLE_WIDTH,
  };
}

function toVideo(doc: SanityProject): ProjectVideo | null {
  const proxy = doc.videoProxy?.asset;
  const meta = doc.videoProxyMeta;
  if (!proxy || !meta?.width || !meta.height) return null;

  const loopAsset = doc.videoLoop?.asset;
  const loopMeta = doc.videoLoopMeta;
  const loop: ProjectVideoLoop | null =
    loopAsset && loopMeta?.width && loopMeta.height
      ? {
          src: loopAsset.url,
          width: loopMeta.width,
          height: loopMeta.height,
          durationSeconds: loopMeta.durationSeconds ?? 0,
        }
      : null;

  return {
    id: proxy.url,
    aspectRatio: `${meta.width}/${meta.height}`,
    poster: toImage(doc.videoPoster),
    // Le poster suit le timecode de la cliente (loopStart) ; sans timecode,
    // le script est parti d'un défaut technique et le poster reste à valider.
    posterIsProvisional: doc.loopStart === undefined || doc.loopStart === null,
    posterGrid: null,
    durationSeconds: meta.durationSeconds ?? 0,
    posterCandidates: 0,
    loop,
  };
}

function toProject(doc: SanityProject, index: number, total: number): Project {
  const gallery = (doc.gallery ?? []).map(toImage).filter((image): image is Image => image !== null);
  const video = toVideo(doc);
  const cover = toImage(doc.cover) ?? video?.posterGrid ?? video?.poster ?? gallery[0] ?? null;
  const photographers = (doc.credits ?? [])
    .filter((credit) => credit.role?.toLowerCase() === 'photography' && credit.name)
    .map((credit) => credit.name as string);

  return {
    slug: doc.slug ?? doc._id,
    assetKey: doc._id.replace(/^project-/, ''),
    sourceFolder: `sanity:${doc._id}`,
    publicationNumber: total - index,
    title: doc.title,
    ...(doc.client ? { client: doc.client } : {}),
    year: doc.year ?? 0,
    eventType: doc.subtitle ?? '',
    ...(photographers.length > 0 ? { credits: photographers.join(', ') } : {}),
    ...(doc.location ? { location: doc.location } : {}),
    ...(doc.description ? { description: doc.description } : {}),
    ...(video ? { video } : {}),
    gallery,
    cover,
    status: doc.location && doc.description ? 'complete' : 'awaiting-copy',
  };
}

// ---------------------------------------------------------------------------
// Lecture
// ---------------------------------------------------------------------------

/**
 * Tous les projets visibles, dans l'ordre du studio. Une seule requête par
 * build grâce à cache() : l'accueil, les pages projet et generateStaticParams
 * partagent le résultat.
 */
export const getProjects = cache(async (): Promise<Project[]> => {
  const docs = await client.fetch<SanityProject[]>(PROJECTS_QUERY);
  const projects = docs.map((doc, index) => toProject(doc, index, docs.length));
  reportMissingContent(projects, await getSiteSettings());
  return projects;
});

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}

export const getSiteSettings = cache(async (): Promise<SanitySiteSettings> => {
  return client.fetch<SanitySiteSettings>(SITE_SETTINGS_QUERY);
});

/** Conversion d'une image Sanity vers le modèle du site, pour le portrait de la page à propos. */
export { toImage as sanityImageToImage };

// ---------------------------------------------------------------------------
// Contenu manquant
// ---------------------------------------------------------------------------

export type MissingContent = {
  slug: string;
  title: string;
  /** Champs texte attendus du client et toujours absents. */
  fields: string[];
  /** Images dont l'alt manque : ni fourni, ni déclaré décoratif. */
  imagesWithoutAlt: number;
  /** Images dont l'alt vide est un choix assumé. Signalées pour information. */
  decorativeImages: number;
};

/**
 * Ce qu'il manque pour qu'un projet passe en `complete`.
 * Les champs absents ne sont pas rendus : sans ce rapport, le manque serait
 * invisible jusqu'à ce que quelqu'un remarque une page à moitié vide.
 */
export function collectMissingContent(projects: Project[]): MissingContent[] {
  return projects
    .map((project) => {
      const fields: string[] = [];
      if (!project.client) fields.push('client');
      if (!project.location) fields.push('location');
      if (!project.description) fields.push('description');
      if (project.video && !project.video.poster) fields.push('video.poster');
      if (project.video?.posterIsProvisional) fields.push('video.poster PROVISOIRE');
      if (!project.cover) fields.push('cover');

      return {
        slug: project.slug,
        title: project.title,
        fields,
        imagesWithoutAlt: project.gallery.filter((image) => !image.decorative && image.alt === '').length,
        decorativeImages: project.gallery.filter((image) => image.decorative).length,
      };
    })
    .filter((entry) => entry.fields.length > 0 || entry.imagesWithoutAlt > 0);
}

/** Contenu manquant hors projets : portrait d'agence, comptes sociaux, mentions légales. */
export function collectMissingSiteContent(settings: SanitySiteSettings): string[] {
  const missing: string[] = [];
  if (!settings) missing.push('siteSettings (document absent)');
  if (!settings?.about?.length) missing.push('about');
  if (!settings?.portrait?.asset) missing.push('about.portrait');
  if (!settings?.linkedin) missing.push('site.social.linkedin');
  if (!settings?.instagram) missing.push('site.social.instagram');
  if (!settings?.legalNotice?.trim()) missing.push('site.legalNotice');
  return missing;
}

// Émis une fois par build : getProjects() est mis en cache.
let reported = false;

export function reportMissingContent(projects: Project[], settings: SanitySiteSettings): void {
  if (reported) return;
  reported = true;

  const missing = collectMissingContent(projects);
  const siteMissing = collectMissingSiteContent(settings);
  if (missing.length === 0 && siteMissing.length === 0) return;

  const provisionalPosters = projects.filter((project) => project.video?.posterIsProvisional).length;

  const lines = missing.map((entry) => {
    const parts = [...entry.fields];
    if (entry.imagesWithoutAlt > 0) parts.push(`${entry.imagesWithoutAlt} alt manquants`);
    return `  ${entry.title} (${entry.slug}) : ${parts.join(', ')}`;
  });

  console.warn(
    [
      '',
      `Contenu client manquant sur ${missing.length} projet(s) — champs non rendus :`,
      ...lines,
      ...(siteMissing.length > 0 ? [`  Site : ${siteMissing.join(', ')}`] : []),
      '  Ces champs restent absents tant que le client n\'a pas répondu (studio Sanity, /studio).',
      ...(provisionalPosters > 0
        ? [`  ${provisionalPosters} poster(s) PROVISOIRE(S) : aucun timecode saisi, le script est parti d'un défaut.`]
        : []),
      '',
    ].join('\n')
  );
}
