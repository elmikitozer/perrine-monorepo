/**
 * Modèle de contenu — §3.3 étape 1.
 *
 * Source de vérité pour les 5 projets du catalogue arrêté le 19/08.
 * Les données d'image et de vidéo ne sont PAS recopiées ici : elles sont lues
 * depuis les manifestes produits par les pipelines (§3.1 et §3.2), pour que les
 * dimensions du code correspondent toujours aux fichiers réels.
 *
 *   public/images/manifest.json   <- scripts/optimize-images.mjs
 *   public/videos/manifest.json   <- scripts/transcode-video.mjs
 *
 * Aucun texte client n'est inventé ici. Ce qui manque reste absent, et
 * reportMissingContent() le signale au build.
 */

import { about } from './about';
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
   * corrige mal une fois indexée, et l'orthographe d'« AREAL » n'est pas encore
   * confirmée : découpler permet de corriger le slug plus tard sans renommer
   * ni régénérer un seul fichier.
   */
  assetKey: string;
  /** Dossier d'origine dans raw/, pour la traçabilité de l'inventaire. */
  sourceFolder: string;
  title: string;
  client: string;
  year: number;
  /**
   * Libellé descriptif libre, PAS une taxonomie.
   * 5 projets, 5 valeurs distinctes. Ne rien construire dessus : ni filtre,
   * ni page de catégorie, ni index par type.
   */
  eventType: string;
  location?: string;
  description?: string;
  video?: ProjectVideo;
  /** [] est un état nominal : 2 projets sur 5 n'ont aucune photo. */
  gallery: Image[];
  /**
   * Traitement de la galerie. Décision de direction artistique, déclarée dans
   * CATALOGUE — jamais déduite du nombre ou de la taille des images, sinon une
   * livraison de photos changerait la mise en page toute seule.
   */
  galleryLayout: GalleryLayout;
  /**
   * Visuel représentant le projet dans un index. Dérivé, jamais saisi :
   * recadrage 3:2 du poster, à défaut le poster, à défaut la première image.
   * null quand rien n'est disponible — c'est le cas des deux projets en film
   * seul tant que le client n'a pas choisi sa frame.
   */
  cover: Image | null;
  status: ProjectStatus;
};

export type GalleryLayout = 'grid' | 'sequential';

// ---------------------------------------------------------------------------
// Manifestes
// ---------------------------------------------------------------------------

type ImageManifestEntry = {
  id: string;
  /** Absent sur les posters, qui ne viennent pas d'un fichier de raw/. */
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
 * Réconciliée avec docs/inventory.md. Les noms de dossier ne sont pas les
 * titres : `BOSIDENG` porte le projet AREAL KIM JONES, Bosideng étant le client.
 *
 * Année, client et eventType viennent du tableau client du 19/08. Le nombre
 * d'images et la présence d'un film ne sont pas recopiés : ils sont lus des
 * manifestes et vérifiés par reconcileCatalogue().
 */
type CatalogueEntry = {
  slug: string;
  assetKey: string;
  sourceFolder: string;
  title: string;
  client: string;
  year: number;
  eventType: string;
  /** Défaut : 'grid'. */
  galleryLayout?: GalleryLayout;
};

const CATALOGUE: CatalogueEntry[] = [
  {
    slug: 'antazero-x-kris-van-assche',
    assetKey: 'antazero-x-kris-van-assche',
    sourceFolder: 'ANTAZERO x KRIS VAN ASSCHE',
    title: 'ANTAZERO x KRIS VAN ASSCHE',
    client: 'Antazero',
    year: 2025,
    eventType: 'Showroom',
    // 7 images, toutes en paysage, 6488 à 7008 px de large, aucun trou dans la
    // série : c'est le seul corpus du catalogue qui tienne en plein écran.
    // ERL, à 3000 px et avec un portrait dans le lot, reste en grille.
    galleryLayout: 'sequential',
  },
  {
    // ÉCART 1 : orthographe d'« AREAL » non confirmée. Ce slug ne doit pas être
    // publié ni indexé avant validation client.
    slug: 'areal-kim-jones',
    assetKey: 'bosideng',
    sourceFolder: 'BOSIDENG',
    title: 'AREAL KIM JONES',
    client: 'Bosideng',
    year: 2026,
    eventType: 'Window display and pop-up',
  },
  {
    slug: 'dior-trunk-show',
    assetKey: 'dior-trunk-show',
    sourceFolder: 'DIOR TRUNK SHOW',
    title: 'DIOR TRUNK SHOW',
    client: 'Dior',
    year: 2026,
    eventType: 'Show',
  },
  {
    // Le dossier `ERL 06 26` porte une date, pas un nom. Le titre client donne
    // le slug ; l'assetKey reste `erl`, valeur figée par le pipeline images.
    slug: 'erl-season-14',
    assetKey: 'erl',
    sourceFolder: 'ERL 06 26',
    title: 'ERL SEASON 14',
    client: 'ERL',
    year: 2026,
    eventType: 'Showroom and cocktail party',
  },
  {
    slug: 'villa-dior',
    assetKey: 'villa-dior',
    sourceFolder: 'VILLA DIOR',
    title: 'VILLA DIOR',
    client: 'Dior',
    year: 2026,
    eventType: 'Cocktail and logistic coordination',
  },
];

/**
 * Retiré du catalogue à la demande du client le 19/08 (images à 533 px).
 * Listé explicitement pour que la réconciliation ne le signale pas comme
 * anomalie, et pour garder trace de la décision.
 *
 * Ses dérivés sont toujours sur le disque : voir ÉCART 5.
 */
export const REMOVED_FROM_CATALOGUE = ['kris-van-assche-nectar-vessels'];

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
  // 'bosideng/26-01-16-empty-shot-ld-productions-a743747': 'texte client',
};

/**
 * Images délibérément décoratives, par `assetKey/idImage`.
 *
 * Une image purement décorative doit porter `alt=""` — l'annoncer aux lecteurs
 * d'écran comme du contenu serait un bruit inutile. La déclarer ici la
 * distingue d'une image dont on attend encore le texte : sans cette liste,
 * les deux cas se ressemblent et le rapport ne sait pas les séparer.
 *
 * Vide aujourd'hui : aucune des 17 images n'a été arbitrée.
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
        // visuel aux deux projets en film seul, mais reste à valider.
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
    title: entry.title,
    client: entry.client,
    year: entry.year,
    eventType: entry.eventType,
    // location et description restent absents tant que le client ne les fournit
    // pas. Ni inventés, ni remplis d'un placeholder : voir reportMissingContent().
    ...(projectVideo ? { video: projectVideo } : {}),
    gallery,
    galleryLayout: entry.galleryLayout ?? 'grid',
    cover: projectVideo?.posterGrid ?? projectVideo?.poster ?? gallery[0] ?? null,
    // Aucun projet n'a encore ni lieu ni description : tous en attente de texte.
    status: 'awaiting-copy',
  };
}

export const projects: Project[] = CATALOGUE.map(buildProject);

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
 * Contenu manquant hors projets. Aujourd'hui : le portrait d'agence de la page
 * à propos. `about.ts` n'importe de ce module que des types, donc la relation
 * est à sens unique et il n'y a pas de cycle à l'exécution.
 */
export function collectMissingSiteContent(): string[] {
  const missing: string[] = [];
  if (!about.portrait) missing.push('about.portrait');
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

// Un dossier renommé dans raw/ casserait silencieusement une galerie : on
// préfère l'échec au build. Les retraits connus ne déclenchent rien.
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
