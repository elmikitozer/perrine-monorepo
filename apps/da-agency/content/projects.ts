/**
 * Modèle de contenu — §3.3 étape 1.
 *
 * Source de vérité pour les 11 projets de la livraison v2 du 04/09
 * (docs/inventory-v2.md, docs/reconciliation-v2.md). Les données d'image et de
 * vidéo ne sont PAS recopiées ici : elles sont lues depuis les manifestes
 * produits par les pipelines (§3.1 et §3.2), pour que les dimensions du code
 * correspondent toujours aux fichiers réels.
 *
 *   public/images/manifest.json   <- scripts/optimize-images.mjs
 *   public/videos/manifest.json   <- scripts/transcode-video.mjs
 *   public/videos/loops.json      <- scripts/extract-loops.mjs
 *
 * Aucun texte client n'est inventé ici. Ce qui manque reste absent, et
 * reportMissingContent() le signale au build.
 */

import { about } from './about';
import { site } from './site';
import imageManifestJson from '../public/images/manifest.json';
import videoManifestJson from '../public/videos/manifest.json';
import loopManifestJson from '../public/videos/loops.json';

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
  /**
   * Identifiant du pipeline, dérivé du nom de fichier source (`site-2-2`).
   * Sert à désigner une image depuis le catalogue (couverture, alt) sans
   * dépendre de sa position dans la galerie, qui bouge à chaque livraison.
   */
  id: string;
  /** Plus grande variante WebP : repli universel derrière le <picture>. */
  src: string;
  /** Dimensions de la source après rotation EXIF, figées au build → zéro CLS. */
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
  /** Chemin local aujourd'hui, identifiant distant après bascule d'hébergeur. */
  id: string;
  /** Lu depuis le manifeste. Ne jamais coder un ratio en dur. */
  aspectRatio: string;
  /**
   * Image fixe du lecteur et de la tuile. Aujourd'hui c'est la première frame
   * de la boucle de survol, extraite au timecode de départ par défaut.
   */
  poster: Image | null;
  /**
   * true = ce poster est un dépannage technique, pas un choix de la cliente.
   * Il vient d'un timecode arbitraire et doit être remplacé dès qu'elle a
   * désigné sa frame. Signalé par reportMissingContent().
   */
  posterIsProvisional: boolean;
  /** Recadrage 3:2 pour la cellule d'accueil. null : planches pas encore produites. */
  posterGrid: Image | null;
  durationSeconds: number;
  posterCandidates: number;
  /**
   * Extrait muet de 8 s pour la boucle de survol de l'accueil.
   * null si le pipeline n'a pas encore tourné (scripts/extract-loops.mjs).
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
  /** Identité publique : URL. Dérivé du titre client. */
  slug: string;
  /**
   * Identité de stockage : clé dans les manifestes et nom des dossiers de
   * dérivés. Dérivé du dossier source, jamais du titre.
   *
   * Les deux sont volontairement séparés. Le brief prévient qu'une URL se
   * corrige mal une fois indexée : découpler permet de corriger le slug plus
   * tard sans renommer ni régénérer un seul fichier. La v2 l'a prouvé : cinq
   * dossiers ont été renommés, les cinq clés ont survécu.
   */
  assetKey: string;
  /** Dossier d'origine dans la racine de sources, pour la traçabilité de l'inventaire. */
  sourceFolder: string;
  /**
   * Rang de publication donné par le document cliente du 04/09, « de la plus
   * ancienne à la plus récente » : 1 pour le plus ancien (2024), 11 pour le
   * plus récent. L'accueil trie dessus en décroissant. C'est une donnée de
   * contenu, pas une déduction du nom de dossier ni de l'alphabet.
   */
  publicationNumber: number;
  title: string;
  /** Absent pour six projets : le document cliente n'a pas de colonne client. */
  client?: string;
  year: number;
  /**
   * Libellé descriptif libre, PAS une taxonomie.
   * 11 projets, 8 valeurs distinctes. Ne rien construire dessus : ni filtre,
   * ni page de catégorie, ni index par type.
   */
  eventType: string;
  /** Crédits photographes, verbatim du document cliente. Fournis pour 4 projets. */
  credits?: string;
  location?: string;
  description?: string;
  video?: ProjectVideo;
  /** [] est un état nominal : 3 projets sur 11 n'ont aucune photo. */
  gallery: Image[];
  /**
   * Visuel représentant le projet dans un index. Dérivé par défaut : recadrage
   * 3:2 du poster, à défaut le poster, à défaut la première image. Un
   * `coverImageId` du catalogue force une autre image quand la première se
   * recadre mal en 3:2. null quand rien n'est disponible — c'est le cas des
   * projets en film seul tant que la boucle n'a pas été extraite.
   */
  cover: Image | null;
  status: ProjectStatus;
};

// ---------------------------------------------------------------------------
// Manifestes
// ---------------------------------------------------------------------------

type ImageManifestEntry = {
  id: string;
  /** Absent sur les posters, qui ne viennent pas d'un fichier source. */
  source?: string;
  width: number;
  height: number;
  orientation?: Image['orientation'];
  aspectRatio?: string;
  belowMinWidth?: boolean;
  lqip: string;
  alt: string;
  variants: Record<string, { width: number; height: number; bytes: number; src: string }[]>;
};

type ImageManifest = {
  generatedAt: string;
  widths: number[];
  projects: Record<string, { folder: string; images: ImageManifestEntry[] }>;
};

type LoopManifest = {
  generatedAt: string;
  seconds: number;
  projects: Record<
    string,
    {
      src: string;
      width: number;
      height: number;
      durationSeconds: number;
      startSeconds: number;
      bytes: number;
      poster: ImageManifestEntry;
      posterIsProvisional: boolean;
    }
  >;
};

type VideoManifest = {
  generatedAt: string;
  projects: Record<
    string,
    {
      folder: string;
      source: string;
      proxy: string;
      /** Dimensions du proxy servi, qui peut avoir ete reduit sous le master. */
      width: number;
      height: number;
      sourceWidth: number;
      sourceHeight: number;
      aspectRatio: string;
      durationSeconds: number;
      posterCandidates: number;
      posterCandidatesDir: string;
      poster: string | null;
    }
  >;
};

// L'import JSON produit un type littéral figé sur les clés présentes au moment
// du build. On repasse par les types ci-dessus pour pouvoir indexer par assetKey.
const imageManifest = imageManifestJson as unknown as ImageManifest;
const videoManifest = videoManifestJson as unknown as VideoManifest;
const loopManifest = loopManifestJson as unknown as LoopManifest;

// ---------------------------------------------------------------------------
// Table de correspondance dossier -> assetKey -> slug -> titre
// ---------------------------------------------------------------------------

/**
 * Réconciliée avec docs/reconciliation-v2.md, §1 : titres, sous-titres
 * (eventType), années et crédits sont repris VERBATIM du document Word
 * `SITE INTERNET PHOTOS .docx`, trait d'union et tiret demi-cadratin compris.
 * Seuls les espaces finaux du document sont retirés (artefact de frappe).
 *
 * Les noms de dossier ne sont pas les titres : `6-BOSIDENG AREAL X KIM JONES`
 * porte le projet AREAL KIM JONES, Bosideng étant le client. Le nombre
 * d'images et la présence d'un film ne sont pas recopiés : ils sont lus des
 * manifestes et vérifiés par reconcileCatalogue().
 *
 * Les valeurs en attente d'une réponse cliente sont commentées sur place, avec
 * ce que dit le document et ce qui est rendu en attendant. Rien n'est tranché
 * en silence.
 */
type CatalogueEntry = {
  slug: string;
  assetKey: string;
  sourceFolder: string;
  publicationNumber: number;
  title: string;
  client?: string;
  year: number;
  eventType: string;
  credits?: string;
  /** Identifiant d'image (Image.id) à utiliser comme couverture à la place de la première. */
  coverImageId?: string;
};

const CATALOGUE: CatalogueEntry[] = [
  {
    // Le document ajoute « DIORAMA » au nom de dossier. Client non fourni.
    slug: 'dior-haute-joaillerie-diorama',
    assetKey: 'dior-haute-joaillerie-24',
    sourceFolder: '1-DIOR Haute Joaillerie 24',
    publicationNumber: 1,
    title: 'DIOR HAUTE JOAILLERIE - DIORAMA',
    year: 2024,
    eventType: 'Gala dinner and show production',
    credits: 'Pierre MOUTON and Adrien DIRAND',
  },
  {
    // Tiret demi-cadratin (U+2013) dans le document, là où les nº 1 et 10 ont
    // un trait d'union : les trois graphies sont distinctes dans la source.
    slug: 'dior-haute-joaillerie-diorexquis',
    assetKey: 'diorhj25',
    sourceFolder: '2-DIORHJ25',
    publicationNumber: 2,
    title: 'DIOR HAUTE JOAILLERIE – DIOREXQUIS',
    year: 2025,
    eventType: 'Gala dinner and show production',
    credits: 'Pierre MOUTON and Adrien DIRAND',
    // La première photo (SITE_2.1) est en 5:4 : la tuile 3:2 lui couperait 17 %
    // de hauteur. Couverture sur la suivante dans l'ordre cliente, en 3:2.
    coverImageId: 'site-2-2',
  },
  {
    // Retiré le 19/08 (sources à 533 px), de retour au nº 3 : la v2 relivre
    // les mêmes prises de vue à 2560 px. Le document ajoute « BRONZES ».
    slug: 'nectar-vessels-bronzes-by-kris-van-assche',
    assetKey: 'nectar-vessels-by-kris-van-assche',
    sourceFolder: '3-NECTAR VESSELS BY KRIS VAN ASSCHE',
    publicationNumber: 3,
    title: 'NECTAR VESSELS BRONZES BY KRIS VAN ASSCHE',
    year: 2025,
    eventType: 'Exhibition',
  },
  {
    // À CONFIRMER : le document du 04/09 dit `Pop-up`, le tableau du 19/08
    // disait `Showroom`. Ce ne sont pas deux formulations du même fait. On garde
    // la valeur déjà validée tant que la cliente n'a pas tranché.
    slug: 'antazero-x-kris-van-assche',
    assetKey: 'antazero-x-kris-van-assche',
    sourceFolder: '4-ANTA ZERO X KRIS VAN ASSCHE',
    publicationNumber: 4,
    title: 'ANTAZERO x KRIS VAN ASSCHE',
    client: 'Antazero',
    year: 2025,
    eventType: 'Showroom',
  },
  {
    slug: 'villa-dior',
    assetKey: 'villa-dior',
    sourceFolder: '5-VILLA DIOR',
    publicationNumber: 5,
    title: 'VILLA DIOR',
    client: 'Dior',
    year: 2026,
    eventType: 'Cocktail and logistic coordination',
  },
  {
    // Orthographe d'« AREAL » confirmée par le document du 04/09.
    // À CONFIRMER : le document titre `BOSIDENG - AREAL KIM JONES`, ce qui
    // répéterait le client déjà porté par le champ dédié. On garde le titre sans
    // préfixe tant que la cliente n'a pas dit ce qu'elle veut voir affiché.
    slug: 'areal-kim-jones',
    assetKey: 'bosideng',
    sourceFolder: '6-BOSIDENG AREAL X KIM JONES',
    publicationNumber: 6,
    title: 'AREAL KIM JONES',
    client: 'Bosideng',
    year: 2026,
    eventType: 'Window display and pop-up',
  },
  {
    // Film seul, quatrième film du catalogue. Client non fourni : ERL est
    // probable, mais c'est une déduction, pas une donnée.
    slug: 'erl-season-13',
    assetKey: 'erl-season-13',
    sourceFolder: '7-ERL SEASON 13',
    publicationNumber: 7,
    title: 'ERL SEASON 13',
    year: 2026,
    eventType: 'Showroom',
  },
  {
    // `Show production` dans le document du 04/09, `Show` dans le tableau du
    // 19/08 : reformulation, pas contradiction. La source la plus récente prime.
    slug: 'dior-trunk-show',
    assetKey: 'dior-trunk-show',
    sourceFolder: '8-DIOR-TRUNK0226',
    publicationNumber: 8,
    title: 'DIOR TRUNK SHOW',
    client: 'Dior',
    year: 2026,
    eventType: 'Show production',
  },
  {
    // À CONFIRMER : le document et le dossier écrivent `VENETHIAN`. Venetian
    // Heritage est une fondation réelle, partenaire de Dior ; la graphie avec
    // « h » est tenue pour une coquille et corrigée dans le titre, le slug et
    // la clé de stockage. Si la cliente maintient `VENETHIAN`, seuls le titre
    // et le slug changent, aucun fichier n'est à régénérer.
    // À CONFIRMER aussi : le dossier du nº 10 s'appelle `10-DIORVHHJ26`, et ce
    // « VH » appartient au vocabulaire de ce projet-ci. Une inversion des
    // dossiers 9 et 10 enverrait les photos sur la mauvaise fiche sans qu'aucun
    // pipeline ne le détecte. À faire vérifier visuellement par la cliente.
    slug: 'venetian-heritage',
    assetKey: 'venetian-heritage',
    sourceFolder: '9-VENETHIAN HERITAGE',
    publicationNumber: 9,
    title: 'VENETIAN HERITAGE',
    year: 2026,
    eventType: 'Cocktail, gala dinner and after party',
    credits: 'Pierre MOUTON and Adrien DIRAND',
  },
  {
    // Voir la réserve d'inversion 9/10 ci-dessus. Client non fourni.
    slug: 'dior-haute-joaillerie-diorissima',
    assetKey: 'diorvhhj26',
    sourceFolder: '10-DIORVHHJ26',
    publicationNumber: 10,
    title: 'DIOR HAUTE JOAILLERIE - DIORISSIMA',
    year: 2026,
    eventType: 'Gala dinner and show production',
    credits: 'Pierre MOUTON and Adrien DIRAND',
  },
  {
    // À CONFIRMER : le document écrit `Showoom and cocktail party`, sans « r ».
    // Le tableau du 19/08 portait la graphie correcte, également cliente : on la
    // garde plutôt que de publier une coquille, mais c'est à elle de corriger.
    // L'assetKey `erl` est figé par le pipeline images depuis le dossier v1
    // `ERL 06 26`.
    slug: 'erl-season-14',
    assetKey: 'erl',
    sourceFolder: '11-ERL SEASON 14',
    publicationNumber: 11,
    title: 'ERL SEASON 14',
    client: 'ERL',
    year: 2026,
    eventType: 'Showroom and cocktail party',
  },
];

/**
 * Clés retirées du catalogue, listées pour que la réconciliation ne les signale
 * pas comme anomalie et pour garder trace de la décision.
 *
 * Vide depuis la v2 : `kris-van-assche-nectar-vessels`, retiré le 19/08 pour
 * des sources à 533 px, revient au nº 3 sous une autre clé avec des sources à
 * 2560 px. Ses anciens dérivés ont déjà été purgés.
 */
export const REMOVED_FROM_CATALOGUE: string[] = [];

// Les numéros de publication viennent d'un document saisi à la main : un
// doublon ou un trou ferait deux projets à la même place, ou un projet
// invisible, sans qu'aucun type ne s'en aperçoive. On échoue au build.
{
  const numbers = CATALOGUE.map((entry) => entry.publicationNumber).sort((a, b) => a - b);
  numbers.forEach((number, index) => {
    if (number !== index + 1) {
      throw new Error(
        `content/projects.ts : numéros de publication attendus de 1 à ${CATALOGUE.length} sans trou ni doublon, ` +
          `reçu ${numbers.join(', ')}.`
      );
    }
  });
}

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

/**
 * Textes alternatifs fournis par le client, par `assetKey/idImage`.
 *
 * Ils vivent ici et pas dans le manifeste : optimize-images.mjs réécrit le
 * manifeste à chaque livraison de photos et remettrait `alt: ''` partout.
 */
const IMAGE_ALTS: Readonly<Record<string, string>> = {
  // 'bosideng/site-6-2': 'texte client',
};

/**
 * Images délibérément décoratives, par `assetKey/idImage`.
 *
 * Une image purement décorative doit porter `alt=""` — l'annoncer aux lecteurs
 * d'écran comme du contenu serait un bruit inutile. La déclarer ici la
 * distingue d'une image dont on attend encore le texte : sans cette liste,
 * les deux cas se ressemblent et le rapport ne sait pas les séparer.
 *
 * Vide aujourd'hui : aucune des 49 images n'a été arbitrée.
 */
const DECORATIVE_IMAGES: ReadonlySet<string> = new Set<string>([]);

function imageKey(assetKey: string, id: string): string {
  return `${assetKey}/${id}`;
}

function toImage(assetKey: string, entry: ImageManifestEntry): Image {
  const sources: ImageSource[] = (['avif', 'webp'] as ImageFormat[]).flatMap((format) =>
    (entry.variants[format] ?? []).map((variant) => ({ format, ...variant }))
  );

  const key = imageKey(assetKey, entry.id);
  const alt = IMAGE_ALTS[key] ?? entry.alt;
  const decorative = DECORATIVE_IMAGES.has(key);

  if (decorative && alt.trim() !== '') {
    throw new Error(
      `${key} est déclarée décorative mais porte un alt. Une image est l'un ou l'autre.`
    );
  }

  const webp = sources.filter((source) => source.format === 'webp');
  const largestWebp = webp.reduce<ImageSource | undefined>(
    (largest, source) => (!largest || source.width > largest.width ? source : largest),
    undefined
  );

  return {
    id: entry.id,
    src: largestWebp?.src ?? '',
    width: entry.width,
    height: entry.height,
    alt,
    decorative,
    lqip: entry.lqip,
    sources,
    orientation: entry.orientation ?? orientationOf(entry.width, entry.height),
    belowMinWidth: entry.belowMinWidth ?? false,
  };
}

function orientationOf(width: number, height: number): Image['orientation'] {
  if (width === height) return 'square';
  return width > height ? 'landscape' : 'portrait';
}

/**
 * Couverture d'index. Un `coverImageId` qui ne désigne aucune image de la
 * galerie est une faute de saisie : mieux vaut l'échec au build qu'une
 * couverture silencieusement retombée sur la première image.
 */
function coverOf(entry: CatalogueEntry, gallery: Image[], video: ProjectVideo | null): Image | null {
  if (entry.coverImageId) {
    const chosen = gallery.find((image) => image.id === entry.coverImageId);
    if (!chosen) {
      throw new Error(
        `${entry.assetKey} : coverImageId "${entry.coverImageId}" absent de la galerie ` +
          `(${gallery.map((image) => image.id).join(', ') || 'vide'}).`
      );
    }
    return chosen;
  }
  return video?.posterGrid ?? video?.poster ?? gallery[0] ?? null;
}

function buildProject(entry: CatalogueEntry): Project {
  const gallery = (imageManifest.projects[entry.assetKey]?.images ?? []).map((image) =>
    toImage(entry.assetKey, image)
  );
  const video = videoManifest.projects[entry.assetKey];

  const loop = loopManifest.projects[entry.assetKey];
  const projectVideo: ProjectVideo | null = video
    ? {
        id: video.proxy,
        aspectRatio: video.aspectRatio,
        loop: loop
          ? {
              src: loop.src,
              width: loop.width,
              height: loop.height,
              durationSeconds: loop.durationSeconds,
            }
          : null,
        // Poster provisoire : première frame de la boucle. Il donne enfin un
        // visuel aux projets en film seul, mais reste à valider.
        poster: loop ? toImage(entry.assetKey, loop.poster) : null,
        posterIsProvisional: loop?.posterIsProvisional ?? false,
        // Recadrage 3:2 dédié : toujours absent, la tuile recadre à la volée.
        posterGrid: null,
        durationSeconds: video.durationSeconds,
        posterCandidates: video.posterCandidates,
      }
    : null;

  return {
    slug: entry.slug,
    assetKey: entry.assetKey,
    sourceFolder: entry.sourceFolder,
    publicationNumber: entry.publicationNumber,
    title: entry.title,
    // client, credits, location et description restent absents tant que la
    // cliente ne les fournit pas. Ni inventés, ni remplis d'un placeholder :
    // voir reportMissingContent().
    ...(entry.client ? { client: entry.client } : {}),
    year: entry.year,
    eventType: entry.eventType,
    ...(entry.credits ? { credits: entry.credits } : {}),
    ...(projectVideo ? { video: projectVideo } : {}),
    gallery,
    cover: coverOf(entry, gallery, projectVideo),
    // Aucun projet n'a encore ni lieu ni description : tous en attente de texte.
    status: 'awaiting-copy',
  };
}

/**
 * Triés par numéro de publication décroissant : le plus récent en premier.
 * C'est l'ordre d'affichage de l'accueil, et le seul ordre du site.
 */
export const projects: Project[] = CATALOGUE.map(buildProject).sort(
  (a, b) => b.publicationNumber - a.publicationNumber
);

export const projectsBySlug: Record<string, Project> = Object.fromEntries(
  projects.map((project) => [project.slug, project])
);

export function getProject(slug: string): Project | undefined {
  return projectsBySlug[slug];
}

// ---------------------------------------------------------------------------
// Réconciliation catalogue <-> manifestes
// ---------------------------------------------------------------------------

export type ReconciliationReport = {
  /** assetKey du catalogue absent du manifeste images. */
  missingFromImageManifest: string[];
  /** Clés présentes dans les manifestes mais dans aucun projet ni dans la liste des retraits. */
  orphanManifestKeys: string[];
  /** Clés retirées du catalogue dont les dérivés traînent encore. */
  staleRemovedKeys: string[];
  /** Dossier source du catalogue qui ne correspond pas à celui du manifeste. */
  folderMismatches: { assetKey: string; expected: string; actual: string }[];
};

export function reconcileCatalogue(): ReconciliationReport {
  const catalogueKeys = new Set(CATALOGUE.map((entry) => entry.assetKey));
  const removedKeys = new Set(REMOVED_FROM_CATALOGUE);
  const manifestKeys = new Set([
    ...Object.keys(imageManifest.projects),
    ...Object.keys(videoManifest.projects),
  ]);

  const folderMismatches: ReconciliationReport['folderMismatches'] = [];
  for (const entry of CATALOGUE) {
    const actual =
      imageManifest.projects[entry.assetKey]?.folder ?? videoManifest.projects[entry.assetKey]?.folder;
    if (actual && actual !== entry.sourceFolder) {
      folderMismatches.push({ assetKey: entry.assetKey, expected: entry.sourceFolder, actual });
    }
  }

  return {
    missingFromImageManifest: CATALOGUE.filter(
      (entry) => !(entry.assetKey in imageManifest.projects)
    ).map((entry) => entry.assetKey),
    orphanManifestKeys: Array.from(manifestKeys).filter(
      (key) => !catalogueKeys.has(key) && !removedKeys.has(key)
    ),
    staleRemovedKeys: Array.from(removedKeys).filter((key) => manifestKeys.has(key)),
    folderMismatches,
  };
}

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
export function collectMissingContent(): MissingContent[] {
  return projects
    .map((project) => {
      const fields: string[] = [];
      if (!project.client) fields.push('client');
      if (!project.location) fields.push('location');
      if (!project.description) fields.push('description');
      if (project.video && !project.video.poster) fields.push('video.poster');
      if (project.video && !project.video.posterGrid) fields.push('video.posterGrid');
      // Distinct d'un champ absent : l'image existe, mais c'est nous qui
      // l'avons choisie faute de timecode. Elle doit être remplacée.
      if (project.video?.posterIsProvisional) fields.push('video.poster PROVISOIRE');

      return {
        slug: project.slug,
        title: project.title,
        fields,
        imagesWithoutAlt: project.gallery.filter(
          (image) => !image.decorative && image.alt.trim() === ''
        ).length,
        decorativeImages: project.gallery.filter((image) => image.decorative).length,
      };
    })
    .filter((entry) => entry.fields.length > 0 || entry.imagesWithoutAlt > 0);
}

/**
 * Contenu manquant hors projets : portrait d'agence, logo, comptes sociaux,
 * mentions légales. `about.ts` et `site.ts` n'importent de ce module que des
 * types, donc la relation est à sens unique et il n'y a pas de cycle à
 * l'exécution.
 */
export function collectMissingSiteContent(): string[] {
  const missing: string[] = [];
  if (!about.portrait) missing.push('about.portrait');
  if (!site.logo) missing.push('site.logo');
  // Un compte déclaré sans URL n'est pas rendu au pied de page : sans ce
  // signalement, le lien manquerait en silence.
  for (const account of site.social) {
    if (!account.href) missing.push(`site.social.${account.label.toLowerCase()}`);
  }
  if (site.legalNotice.length === 0) missing.push('site.legalNotice');
  return missing;
}

export function reportMissingContent(): void {
  const missing = collectMissingContent();
  const siteMissing = collectMissingSiteContent();
  if (missing.length === 0 && siteMissing.length === 0) return;

  const provisionalPosters = projects.filter((project) => project.video?.posterIsProvisional).length;

  const decorativeTotal = collectMissingContent().reduce(
    (total, entry) => total + entry.decorativeImages,
    0
  );

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
      '  Ces champs restent absents tant que le client n\'a pas répondu.',
      ...(provisionalPosters > 0
        ? [
            `  ${provisionalPosters} poster(s) PROVISOIRE(S) : première frame de la boucle, issue d'un`,
            "  timecode par défaut. Ce n'est pas un choix de la cliente — à remplacer",
            '  dès réception de ses timecodes (scripts/extract-loops.mjs --start=N).',
          ]
        : []),
      ...(decorativeTotal > 0
        ? [`  (${decorativeTotal} image(s) déclarée(s) décorative(s), alt vide assumé.)`]
        : []),
      '',
    ].join('\n')
  );
}

// Un dossier renommé dans les sources casserait silencieusement une galerie :
// on préfère l'échec au build. Les retraits connus ne déclenchent rien.
const report = reconcileCatalogue();
if (report.missingFromImageManifest.length > 0 || report.folderMismatches.length > 0) {
  throw new Error(
    `content/projects.ts désynchronisé des manifestes.\n` +
      `  Clés absentes du manifeste images : ${report.missingFromImageManifest.join(', ') || 'aucune'}\n` +
      `  Dossiers divergents : ${
        report.folderMismatches.map((m) => `${m.assetKey} (${m.expected} != ${m.actual})`).join(', ') ||
        'aucun'
      }\n` +
      `  Relancer les pipelines média, ou corriger CATALOGUE.`
  );
}

// Émis une fois par processus (le module est mis en cache) : au build comme au
// démarrage du serveur de dev.
reportMissingContent();
