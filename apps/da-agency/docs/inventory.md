# Inventaire des assets — Site Laetitia (ex ld.productions)

> Phase 0 du `BRIEF-LAETITIA.md`. Aucun code produit.
> Source analysée : `raw/` → lien symbolique vers `~/Downloads/PHOTOS SITE INTERNET`
> Relevé du 18 août 2026 · outils : `sips` (images), `ffprobe` (vidéos), `md5` (doublons)

---

## Vue d'ensemble

| | |
| --- | --- |
| Dossiers projet | 6 |
| Images | 21 (dont **4 inutilisables**, voir Alertes) |
| Vidéos | 3 masters `.mov` |
| Poids images | 66,4 Mo |
| Poids vidéos | **1,38 Go** |
| Poids total | 1,45 Go |
| Espaces colorimétriques | sRGB partout — **aucune conversion CMJN / Adobe RGB nécessaire** |
| Formats | JPEG uniquement (aucun PNG, HEIC ni TIFF) |

**Le fait structurant de cet inventaire : 2 projets sur 6 n'ont aucune photo, seulement un film.
Un troisième est un film accompagné de photos. La vidéo n'est pas un complément du corpus,
elle en est plus de 95 % du poids et la moitié des projets.** Voir « Recommandation de layout ».

---

## Par projet

### 1. ANTAZERO x KRIS VAN ASSCHE

| Champ | Valeur |
| --- | --- |
| Slug candidat | `antazero-x-kris-van-assche` |
| Photos | 7 |
| Vidéo | — |
| Orientation | 7 paysage · 0 portrait · 0 carré |
| Largeur min / max | 6488 px / 7008 px |
| Ratios | 3:2 sur les 7 fichiers |
| Poids | 30,5 Mo |
| Formats | JPEG |
| Espace colorimétrique | sRGB IEC61966-2.1 |
| Nommage | `DSC03608.jpg` … — noms d'appareil bruts, non descriptifs |

Le corpus le plus riche et le plus homogène. Pleine résolution boîtier (~30 Mpx),
aucune image faible. Supporte du plein écran sans réserve.

### 2. BOSIDENG

| Champ | Valeur |
| --- | --- |
| Slug candidat | `bosideng` |
| Photos | 5 |
| Vidéo | 1 — `LD-Bosideng film RENAUD DROVIN.mov` |
| Orientation | 4 paysage · 1 portrait · 0 carré |
| Largeur min / max | 2000 px / 3000 px |
| Ratios | 3:2 sur les 5 fichiers |
| Poids | 15,4 Mo (photos) + 390,8 Mo (film) = 406,2 Mo |
| Formats | JPEG · QuickTime/HEVC |
| Espace colorimétrique | sRGB IEC61966-2.1 |
| Film | HEVC 10 bits 4:2:2, **2276 × 1080**, 25 i/s, 40,2 s, audio PCM 24 bits, ~78 Mb/s |
| Nommage | `26-01-16_Empty Shot LD Productions-_A743747.jpg` — espaces, tiret orphelin |

Seul projet à exercer **le gabarit complet** (film + galerie). Date lisible dans le nom :
16 janvier 2026. La mention « Empty Shot » suggère des photos de décor sans mannequin —
à confirmer avant d'en faire des visuels de couverture.

### 3. DIOR TRUNK SHOW

| Champ | Valeur |
| --- | --- |
| Slug candidat | `dior-trunk-show` |
| Photos | **0** |
| Vidéo | 1 — `Dior Trunk Show film HQ.mov` |
| Orientation | s.o. |
| Largeur min / max | s.o. |
| Poids | 226,2 Mo |
| Formats | QuickTime/HEVC |
| Film | HEVC 10 bits 4:2:2, **3840 × 2160** (16:9), 25 i/s, 72,9 s, audio PCM 24 bits, ~25 Mb/s |

Aucune image de couverture disponible. Le seul film en 4K natif et en 16:9 propre.

### 4. ERL 06 26

| Champ | Valeur |
| --- | --- |
| Slug candidat | `erl` (le `06 26` du dossier est une date, pas un nom de projet) |
| Photos | 5 |
| Vidéo | — |
| Orientation | 4 paysage · 1 portrait · 0 carré |
| Largeur min / max | 2000 px / 3000 px |
| Ratios | 3:2 sur les 5 fichiers |
| Poids | 19,9 Mo |
| Formats | JPEG |
| Espace colorimétrique | sRGB IEC61966-2.1 |
| Nommage | `26-06-27_ERL-1.jpg` … — propre, numérotation non contiguë (1, 15, 23, 38, 67) |

Date lisible : 27 juin 2026. La numérotation trouée indique une **sélection extraite d'un
reportage plus large** — il existe très probablement d'autres images côté client.

### 5. KRIS VAN ASSCHE NECTAR VESSELS

| Champ | Valeur |
| --- | --- |
| Slug candidat | `kris-van-assche-nectar-vessels` |
| Photos | 4 — **toutes inutilisables en l'état** |
| Vidéo | — |
| Orientation | 2 paysage · 2 portrait · 0 carré |
| Largeur min / max | **533 px / 800 px** |
| Ratios | 3:2 sur les 4 fichiers |
| Poids | 0,6 Mo |
| Formats | JPEG |
| Espace colorimétrique | sRGB (profil générique, 300 dpi) |
| Nommage | `IMG_1114.JPG` … — extension en majuscules |

Profil générique + 300 dpi + poids de 100 à 200 Ko : ces fichiers ne sortent pas d'un boîtier,
ce sont des **exports basse définition** (PDF, lookbook ou page web). Inexploitables même en
vignette de grille sur écran Retina. Les originaux sont à redemander.

### 6. VILLA DIOR

| Champ | Valeur |
| --- | --- |
| Slug candidat | `villa-dior` |
| Photos | **0** |
| Vidéo | 1 — `Villa Dior film.mov` |
| Orientation | s.o. |
| Largeur min / max | s.o. |
| Poids | **767,8 Mo** — à lui seul, plus de la moitié du dossier |
| Formats | QuickTime/HEVC |
| Film | HEVC 10 bits 4:2:2, **2276 × 1080**, 25 i/s, 76,0 s, audio PCM 24 bits, ~81 Mb/s |

Aucune image de couverture disponible.

---

## Alertes

### Bloquant — les vidéos ne peuvent pas être hébergées avec le site

1,38 Go de masters HEVC 10 bits 4:2:2 avec **audio PCM non compressé**, à 25 à 81 Mb/s.
Ce sont des fichiers de post-production, pas des fichiers de diffusion : aucun navigateur ne
lit ce profil de façon fiable (HEVC 4:2:2 10 bits n'est décodé matériellement que sur une
partie des machines Apple récentes, et pas du tout sur Chrome/Windows en pratique), et le
poids interdit l'hébergement statique. Il faut trancher entre un hébergeur vidéo
(Vimeo / YouTube) et un service de streaming (Mux, Cloudflare Stream, Vercel Blob + HLS)
**avant** de dessiner les pages projet. Voir `questions-client.md`.

### Bloquant — 2 projets sur 6 n'ont aucune image

`DIOR TRUNK SHOW` et `VILLA DIOR` n'ont ni photo de couverture ni galerie. Sans décision
client, ils ne peuvent pas apparaître dans une grille d'index. Deux issues : Laetitia fournit
des photos, ou on extrait une image fixe du film (faisable proprement côté pipeline, mais
c'est un choix éditorial qui lui appartient).

### Images sous 1600 px — 4 fichiers, 1 projet entier

| Fichier | Dimensions |
| --- | --- |
| `KRIS VAN ASSCHE NECTAR VESSELS/IMG_1114.JPG` | 800 × 533 |
| `KRIS VAN ASSCHE NECTAR VESSELS/IMG_1115.JPG` | 533 × 800 |
| `KRIS VAN ASSCHE NECTAR VESSELS/IMG_1116.JPG` | 800 × 533 |
| `KRIS VAN ASSCHE NECTAR VESSELS/IMG_1117.JPG` | 533 × 800 |

C'est la totalité du projet. Il ne peut donc pas être publié tel quel, même en format « fiche ».
Aucune autre image du corpus ne descend sous 2000 px.

### Projets à moins de 3 photos → layout « fiche », pas « galerie »

- `DIOR TRUNK SHOW` — 0 photo
- `VILLA DIOR` — 0 photo
- `KRIS VAN ASSCHE NECTAR VESSELS` — 4 photos, mais 0 exploitable

Soit **3 projets sur 6** qui ne peuvent pas recevoir une galerie. Le gabarit de page projet
doit donc traiter le cas « pas d'images du tout » comme un cas normal, pas comme une exception.

### Doublons

**Aucun.** Les 24 fichiers ont des empreintes MD5 distinctes et aucune paire ne partage
dimensions et poids proches. `DSC03633.jpg` et `DSC03739.jpg` partagent bien 7008 × 4672,
mais 5,1 Mo contre 3,6 Mo : ce sont deux prises différentes.

### Nommage à normaliser

Tout est à reprendre en kebab-case au moment du pipeline. Aucun accent, mais :

- **Les 6 dossiers** sont en majuscules et contiennent des espaces.
- `ERL 06 26` mélange nom de projet et date dans le même dossier.
- `26-01-16_Empty Shot LD Productions-_A743747.jpg` — espaces, underscore, tiret orphelin
  avant l'underscore.
- `LD-Bosideng film RENAUD DROVIN.mov`, `Dior Trunk Show film HQ.mov`, `Villa Dior film.mov`
  — espaces.
- `IMG_1114.JPG` … — extension en majuscules, à uniformiser en `.jpg` (casse variable =
  liens cassés sur un système de fichiers sensible à la casse, ce qui est le cas en production).
- Les noms de fichiers ANTAZERO (`DSC0…`) ne portent aucune information : le slug de sortie
  devra être généré à partir du projet + index, pas du nom source.

### Ratios exotiques

Côté images, **aucun** : les 21 fichiers sont en 3:2 strict (paysage ou portrait). C'est
inhabituellement homogène et cela simplifie beaucoup la grille.

Côté vidéo en revanche, deux des trois films sont en **2276 × 1080, soit 2,107:1** — un ratio
non standard, ni 16:9 ni 2,39:1 cinéma. Le troisième est en 16:9 propre. Un lecteur à ratio
fixe produira donc des bandes noires sur deux projets sur trois : le conteneur vidéo devra
lire son ratio depuis les données du projet plutôt que l'imposer.

---

## Recommandation de layout

### Grille régulière stricte, pas de masonry

Le masonry ne se justifie que face à des hauteurs hétérogènes. Ici **100 % des images sont en
3:2**, avec seulement 2 portraits sur 17 images exploitables. Un masonry sur ce corpus
produirait une grille régulière avec du désordre en prime : tout le coût, aucun bénéfice.

Grille recommandée : cellules 3:2, 2 colonnes en desktop, 1 en mobile. Les 2 images portrait
(`BOSIDENG/…_A743747`, `ERL/…-67`) occupent une cellule sur deux rangs plutôt qu'un recadrage
qui perdrait le sujet.

### Le plein écran séquentiel ne tient que sur un projet

`ANTAZERO x KRIS VAN ASSCHE` est le seul corpus qui le supporte : 7 images, ~6800 px de large,
toutes en paysage, aucun trou. Partout ailleurs il y a soit trop peu d'images (0 à 5), soit une
définition insuffisante. C'est donc un traitement à réserver à un projet, pas un principe de site.

### L'architecture est vidéo d'abord

Le soupçon posé en Phase 1 du brief est confirmé par les chiffres : 3 films pour 6 projets,
95 % du poids, et 2 projets qui n'existent **que** par leur film. Un portfolio construit autour
de la grille photo relèguerait au second plan la moitié du catalogue. La page projet doit poser
le film en tête et la galerie en dessous, et non l'inverse.

Conséquence sur le modèle de contenu : `videoUrl` n'est pas un champ optionnel de confort,
c'est l'axe principal. Et `cover` doit accepter une image extraite du film, sans quoi 2 projets
sur 6 sont invisibles à l'index.

### Projet à développer en premier (Phase 4)

Le brief propose « celle avec le corpus photo le plus riche », ce qui désignerait
`ANTAZERO x KRIS VAN ASSCHE`. **Je recommande plutôt `BOSIDENG`** : c'est le seul projet qui
possède à la fois un film et une galerie, donc le seul qui exerce le gabarit en entier. Valider
le modèle sur ANTAZERO laisserait toute la partie vidéo — la plus risquée et la plus structurante —
non testée jusqu'à la deuxième itération.

`ANTAZERO` reste le bon second cas : il valide la variante « projet sans film », qui concerne
les 2 autres projets photo.

### Budget d'optimisation

17 images exploitables × 3 largeurs (640 / 1280 / 2048) × 2 formats (AVIF + WebP) = 102 dérivés,
pour une sortie estimée entre 8 et 15 Mo dans `public/`. Négligeable : le pipeline images n'est
pas le sujet de performance de ce site, la vidéo l'est.

Note : les 4 largeurs sources dépassant 6000 px (projet ANTAZERO) autorisent un palier 2048
sans interpolation ; les projets à 3000 px aussi. Les 4 fichiers KVA sont exclus du pipeline
tant que les originaux ne sont pas fournis.

---

## Point de contrôle sur l'ancien site

`web.archive.org` ne contient **qu'une seule capture** de `ld.productions`
(18 mars 2025), et cette capture est la page par défaut d'un serveur vide :
« Website under construction — It works! This is the server's temporary default web page. »

Il n'y a donc **aucun contenu antérieur à récupérer** : ni arborescence, ni textes de
présentation, ni nomenclature de projets. La Phase 3 du brief ne pourra pas s'appuyer sur
l'archive. Tout le rédactionnel devra venir de Laetitia — d'où le nombre de questions dans
`questions-client.md`.

---

## Ce que l'inventaire ne permet pas de trancher

Ces points sont des décisions client, pas des déductions techniques. Ils sont repris
en questions dans `questions-client.md` :

- **Les catégories.** Le brief demande de les figer après inventaire. Le corpus laisse
  entrevoir plusieurs axes possibles (film / photo, maison cliente, type d'événement), mais
  6 projets ne suffisent pas à trancher sans savoir ce que Laetitia veut mettre en avant.
  Aucune catégorie n'est donc proposée ici.
- **Les millésimes.** Seuls `BOSIDENG` (janvier 2026) et `ERL` (juin 2026) sont datables,
  et uniquement par lecture des noms de fichiers. Les 4 autres n'ont aucune date exploitable :
  les JPEG ont été livrés **sans EXIF** (aucun `DateTimeOriginal`, aucun boîtier).
- **Le périmètre.** 6 projets est un catalogue mince pour un portfolio, et la numérotation
  trouée d'`ERL` montre qu'il s'agit de sélections. Rien ne dit si ce dossier est le catalogue
  complet ou un premier envoi.
