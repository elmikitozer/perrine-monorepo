# Inventaire du corpus v2 — Site LD Productions

> Phase 0 refaite sur la deuxième livraison. **Aucun code produit, aucun pipeline lancé.**
> Source analysée : `raw-v2/` · l'ancienne livraison reste dans `raw/` pour comparaison.
> Relevé du 4 septembre 2026 · outils : `sips` (images), `ffprobe` (vidéos), `md5` + aHash (comparaison)
>
> La comparaison ligne à ligne avec `raw/` est dans **`docs/reconciliation-v2.md`**.

---

## Vue d'ensemble

| | v1 (`raw/`) | v2 (`raw-v2/`) |
| --- | --- | --- |
| Dossiers projet | 6 | **11** |
| Images | 21 | **49** |
| Vidéos | 3 | **4** |
| Poids images | 66,4 Mo | **322,2 Mo** |
| Poids vidéos | 1,38 Go | **1,76 Go** |
| Poids total | 1,45 Go | **2,09 Go** |
| Espaces colorimétriques | sRGB partout | **sRGB × 40 · Adobe RGB (1998) × 9** |
| Ratios | 3:2 strict sur 21/21 | **3:2 sur 43/49** |
| Formats | JPEG · QuickTime/HEVC | JPEG · QuickTime/HEVC (inchangé) |
| Images sous 1600 px | 4 (un projet entier) | **2** |

**Les deux faits structurants de cette livraison :**

1. **L'homogénéité du corpus v1 a disparu.** Le premier inventaire tenait sur « 100 % des images
   en 3:2, sRGB partout », et toute la grille a été dessinée là-dessus. La v2 apporte 9 fichiers
   en Adobe RGB et 6 fichiers hors 3:2, dont deux en 4:5 à 1440 px de large.
2. **Le nommage est enfin systématique** (`SITE_<projet>.<index>.jpg`), ce qui règle le problème
   de nommage relevé en v1 — mais **renomme 100 % des sources**, y compris les photos conservées
   à l'octet près. Conséquence directe sur les dérivés déjà produits : voir `reconciliation-v2.md`
   et la section `--prune`.

---

## Ordre d'affichage

Le document Word titre sa première colonne « NUMERO DE PUBLICATION (de la plus ancienne a la plus
récente) ». Le numéro de dossier est donc un **rang de publication croissant**, et l'accueil doit
le présenter **à l'envers** : 11 en premier, 1 en dernier.

Ce rang ne doit pas être déduit du nom de dossier au moment du rendu : le préfixe numérique est un
détail de la livraison cliente, pas une donnée de contenu. Il lui faut un champ dédié dans le
catalogue (`publicationNumber`, entier 1 à 11), et le tri se fait dessus en décroissant. L'ordre
alphabétique des dossiers est de toute façon faux : il donne `1, 10, 11, 2, 3…`.

---

## Par projet

Les titres ci-dessous sont ceux du **document Word**, repris verbatim. Les noms de dossier en
diffèrent souvent ; les écarts sont listés dans `reconciliation-v2.md`.

### 11 — ERL SEASON 14

| Champ | Valeur |
| --- | --- |
| Dossier | `11-ERL SEASON 14/A METTRE SUR SITE` |
| Sous-titre (doc) | `Showoom and cocktail party` — coquille pour « Showroom », voir réconciliation |
| Année (doc) | 2026 |
| Photos | 6 |
| Vidéo | — |
| Orientation | 5 paysage · 1 portrait |
| Largeurs | 2000 – 3000 px |
| Ratios | 3:2 sur 6/6 |
| Poids | 22,9 Mo |
| Espace colorimétrique | sRGB IEC61966-2.1 |
| Résolution nominale | 240 dpi |

### 10 — DIOR HAUTE JOAILLERIE - DIORISSIMA

| Champ | Valeur |
| --- | --- |
| Dossier | `10-DIORVHHJ26/A METTRE SUR SITE` |
| Sous-titre (doc) | `Gala dinner and show production` |
| Année (doc) | 2026 · Crédits : Pierre MOUTON and Adrien DIRAND |
| Photos | 4 |
| Vidéo | — |
| Orientation | 3 paysage · 1 portrait |
| Largeurs | 5476 – 5901 px |
| Ratios | 3:2 sur 3/4 — `SITE_10.2.jpg` en **4:5** (5803 × 7253) |
| Poids | 17,8 Mo |
| Espace colorimétrique | sRGB IEC61966-2.1 |
| Anomalie de nommage | `SITE_10.1jpg.jpg` — extension doublée, point manquant |

### 9 — VENETHIAN HERITAGE

| Champ | Valeur |
| --- | --- |
| Dossier | `9-VENETHIAN HERITAGE/A METTRE SUR SITE` |
| Sous-titre (doc) | `Cocktail, gala dinner and after party` |
| Année (doc) | 2026 · Crédits : Pierre MOUTON and Adrien DIRAND |
| Photos | 5 |
| Vidéo | — |
| Orientation | 4 paysage · 1 portrait |
| Largeurs | 3905 – 6000 px |
| Ratios | 3:2 sur 5/5 |
| Poids | 28,5 Mo |
| Espace colorimétrique | sRGB IEC61966-2.1 |

### 8 — DIOR TRUNK SHOW

| Champ | Valeur |
| --- | --- |
| Dossier | `8-DIOR-TRUNK0226/A METTRE SUR SITE` |
| Sous-titre (doc) | `Show production` (le catalogue actuel dit `Show`) |
| Année (doc) | 2026 · **TIME VIDEO : 10:00** |
| Photos | **0** |
| Vidéo | 1 — `SITE_8.1.mov` |
| Film | HEVC 10 bits 4:2:2, **1920 × 1080** (16:9), 25 i/s, 72,88 s, 83,9 Mo |

**Le master a été remplacé par une version de définition inférieure** : la v1 livrait ce même film
en 3840 × 2160 pour 226,2 Mo. Durée identique à la trame près, donc même montage, ré-encodé en
1080p. Voir `reconciliation-v2.md`.

### 7 — ERL SEASON 13

| Champ | Valeur |
| --- | --- |
| Dossier | `7-ERL SEASON 13/A METTRE SUR SITE` |
| Sous-titre (doc) | `Showroom` |
| Année (doc) | 2026 · **TIME VIDEO: 6:00** |
| Photos | **0** |
| Vidéo | 1 — `SITE_7.1.mov` |
| Film | HEVC 10 bits 4:2:2, **3840 × 2160** (16:9), 25 i/s, 51,96 s, 521,7 Mo |

Projet entièrement nouveau, et **quatrième film du catalogue** — la v1 n'en comptait que trois.
Le seul 4K natif de la livraison.

### 6 — BOSIDENG - AREAL KIM JONES

| Champ | Valeur |
| --- | --- |
| Dossier | `6-BOSIDENG AREAL X KIM JONES/A METTRE SUR SITE` |
| Sous-titre (doc) | `Window display and pop-up` |
| Année (doc) | 2026 · **TIME VIDEO: 00:00** |
| Photos | 5 |
| Vidéo | 1 — `SITE_6.1.mov` |
| Orientation | 4 paysage · 1 portrait |
| Largeurs | 2000 – 3000 px |
| Ratios | 3:2 sur 5/5 |
| Poids | 16,9 Mo (photos) + 390,8 Mo (film) |
| Film | HEVC 10 bits 4:2:2, **2276 × 1080** (2,107:1), 25 i/s, 40,16 s — **identique à la v1** |
| Espace colorimétrique | sRGB IEC61966-2.1 |

Toujours le seul projet à exercer le gabarit complet film + galerie… avec ERL SEASON 13 qui, lui,
n'a que le film.

### 5 — VILLA DIOR

| Champ | Valeur |
| --- | --- |
| Dossier | `5-VILLA DIOR/A METTRE SUR SITE` |
| Sous-titre (doc) | `Cocktail and logistic coordination` |
| Année (doc) | 2026 · **TIME VIDEO: 4:00** |
| Photos | **0** |
| Vidéo | 1 — `SITE_5.1.mov` |
| Film | HEVC 10 bits 4:2:2, **2276 × 1080** (2,107:1), 25 i/s, 75,96 s, 767,8 Mo — **identique à la v1** |

Toujours aucune photo. Le fichier le plus lourd du corpus, à lui seul 37 % du poids total.

### 4 — ANTAZERO x KRIS VAN ASSCHE

| Champ | Valeur |
| --- | --- |
| Dossier | `4-ANTA ZERO X KRIS VAN ASSCHE/A METTRE SUR SITE` |
| Sous-titre (doc) | `Pop-up` — **le catalogue actuel dit `Showroom`**, voir réconciliation |
| Année (doc) | 2025 |
| Photos | 7 |
| Vidéo | — |
| Orientation | 7 paysage |
| Largeurs | 6095 – 7008 px |
| Ratios | 3:2 sur 7/7 |
| Poids | 31,0 Mo |
| Espace colorimétrique | sRGB IEC61966-2.1 |

Toujours le corpus le plus défini. 5 des 7 photos sont nouvelles (voir réconciliation).

### 3 — NECTAR VESSELS BRONZES BY KRIS VAN ASSCHE

| Champ | Valeur |
| --- | --- |
| Dossier | `3-NECTAR VESSELS BY KRIS VAN ASSCHE/A METTRE SUR SITE` — le doc ajoute « BRONZES » |
| Sous-titre (doc) | `Exhibition` |
| Année (doc) | 2025 |
| Photos | 6 |
| Vidéo | — |
| Orientation | 4 paysage · 2 portrait |
| Largeurs | 1707 – 2560 px |
| Ratios | 3:2 sur 6/6 |
| Poids | 4,8 Mo |
| Espace colorimétrique | sRGB × 5 · **Adobe RGB (1998) × 1** (`SITE_3.6.jpg`) |

**Le projet retiré du catalogue le 19/08 revient, et le blocage est levé.** La v1 le livrait à
533–800 px, ce qui l'avait fait sortir. La v2 est à 1707–2560 px : au-dessus du seuil de 1600 px,
exploitable en grille sans réserve. Ce sont des photos entièrement différentes, aucune n'est un
réexport des anciennes.

### 2 — DIOR HAUTE JOAILLERIE – DIOREXQUIS

| Champ | Valeur |
| --- | --- |
| Dossier | `2-DIORHJ25/A METTRE SUR SITE` |
| Sous-titre (doc) | `Gala dinner and show production` |
| Année (doc) | 2025 · Crédits : Pierre MOUTON and Adrien DIRAND |
| Photos | 8 |
| Vidéo | — |
| Orientation | 6 paysage · 2 portrait |
| Largeurs | **1440 – 9520 px** — l'amplitude la plus forte du corpus |
| Ratios | 3:2 sur 5/8 — `SITE_2.1` en 5:4, `SITE_2.4` et `SITE_2.5` en 4:5 |
| Poids | 62,0 Mo |
| Espace colorimétrique | sRGB IEC61966-2.1 |
| Résolution nominale | **mélangée : 72 dpi × 5, 300 dpi × 3** |
| Anomalies | `SITE_2.6jpg.jpg` (extension doublée) · `SITE_2.4/2.5` sous le seuil |

Le projet le plus hétérogène de la livraison : trois ratios, deux résolutions nominales, un rapport
de 1 à 44 sur le poids des fichiers (0,3 Mo à 16,3 Mo). Il mélange visiblement deux sources.

### 1 — DIOR HAUTE JOAILLERIE - DIORAMA

| Champ | Valeur |
| --- | --- |
| Dossier | `1-DIOR Haute Joaillerie 24/A METTRE SUR SITE` — le doc ajoute « DIORAMA » |
| Sous-titre (doc) | `Gala dinner and show production` |
| Année (doc) | **2024** — le plus ancien du catalogue · Crédits : Pierre MOUTON and Adrien DIRAND |
| Photos | 8 |
| Vidéo | — |
| Orientation | 6 portrait · 2 paysage — **le seul projet à dominante portrait** |
| Largeurs | 3433 – 6218 px |
| Ratios | 3:2 sur 6/8 — `SITE_1.2` et `SITE_1.3` en **4:5** |
| Poids | **138,2 Mo** — 43 % du poids photo de la livraison |
| Espace colorimétrique | **Adobe RGB (1998) sur les 8 fichiers** |

Le projet le plus lourd et le seul intégralement en Adobe RGB. Voir Alertes.

---

## Alertes

### Nouveau — 9 fichiers en Adobe RGB (1998)

| Projet | Fichiers |
| --- | --- |
| 1 — DIOR HAUTE JOAILLERIE - DIORAMA | les 8 |
| 3 — NECTAR VESSELS | `SITE_3.6.jpg` |

Le premier inventaire concluait « sRGB partout — aucune conversion nécessaire ». **Ce n'est plus
vrai.** Un JPEG Adobe RGB affiché sans gestion de couleur sort visiblement désaturé, surtout dans
les rouges et les verts — exactement ce qui compte sur des photos de joaillerie et de gala.

Le pipeline images doit donc convertir en sRGB à l'encodage, pas seulement redimensionner. Sharp
sait le faire (`.toColorspace('srgb')` avec le profil d'entrée), mais **ce n'est pas ce qu'il fait
aujourd'hui** : la chaîne actuelle a été écrite pour un corpus 100 % sRGB et ne touche pas au
profil. À traiter en Phase 1 avant tout encodage, sinon 9 images partent en production fausses.

> **Erratum (Phase 1, 04/09).** Le paragraphe ci-dessus est faux sur un point : la chaîne
> actuelle convertit déjà. Sharp 0.35.3 applique le profil ICC embarqué de la source dès que la
> sortie est sRGB, ce que `.toColorspace('srgb')` demande. Vérifié sur `SITE_3.6.jpg` : le rendu
> de la chaîne est identique à un `.withIccProfile('srgb')` explicite, et diffère d'un
> `ignoreIcc: true`. Rien à convertir en plus ; la Phase 1 documente la garantie dans
> `scripts/lib/images.mjs` et affiche le profil source en console pour les fichiers hors sRGB.

### Nouveau — 6 fichiers hors 3:2

| Fichier | Dimensions | Ratio |
| --- | --- | --- |
| `1/SITE_1.2.jpg` | 5338 × 6673 | 4:5 |
| `1/SITE_1.3.jpg` | 6218 × 7773 | 4:5 |
| `2/SITE_2.1.jpg` | 4413 × 3534 | 5:4 |
| `2/SITE_2.4.jpg` | 1440 × 1800 | 4:5 |
| `2/SITE_2.5.jpg` | 1440 × 1800 | 4:5 |
| `10/SITE_10.2.jpg` | 5803 × 7253 | 4:5 |

La grille actuelle repose sur deux cas seulement — cellule 3:2 paysage, et portrait 2:3 sur deux
rangs. Un 4:5 recadré en 2:3 perd 25 % de sa hauteur, un 5:4 recadré en 3:2 perd de la largeur au
milieu du sujet. Il faut soit une troisième règle de cellule, soit accepter le recadrage et le
décider explicitement. C'est un choix de direction artistique, pas une déduction technique.

### Images sous 1600 px — 2 fichiers

| Fichier | Dimensions |
| --- | --- |
| `2-DIORHJ25/SITE_2.4.jpg` | 1440 × 1800 |
| `2-DIORHJ25/SITE_2.5.jpg` | 1440 × 1800 |

Nette amélioration sur la v1, où c'était un projet entier. Ces deux-là sont à 1440 px de large pour
0,3 Mo et 72 dpi : ce sont des exports web, pas des fichiers boîtier. Le pipeline les marquera
`belowMinWidth` (le seuil porte sur la largeur), elles ne doivent pas servir en pleine largeur.
Nuance à garder en tête : en portrait, c'est la largeur qui limite, donc le test actuel est le bon
ici — mais 1800 px de haut restent utilisables en cellule de grille.

### Nommage — 2 fichiers malformés

- `2-DIORHJ25/SITE_2.6jpg.jpg`
- `10-DIORVHHJ26/SITE_10.1jpg.jpg`

Extension doublée, point manquant avant la première. Sans intervention, `imageId()` produirait les
identifiants `site-2-6jpg` et `site-10-1jpg`, qui partiraient tels quels dans les URL publiques.
À corriger au niveau de la génération d'identifiant, pas en renommant les sources — `raw-v2/` est
en lecture seule.

### Bloquant — les vidéos restent inexploitables telles quelles

Les 4 films sont en HEVC 10 bits 4:2:2 (`yuv422p10le`), profil qu'aucun navigateur ne décode de
façon fiable, pour 1,76 Go. Le diagnostic de la v1 est inchangé, et le volume a augmenté de 27 %.
La chaîne de proxys reste indispensable.

Un point a empiré : **DIOR TRUNK SHOW est passé de 3840 × 2160 à 1920 × 1080**. Le proxy sortant du
pipeline est de toute façon en 1080p, donc l'impact visible est nul aujourd'hui — mais le master
haute définition n'est plus dans la livraison, et il faudra le redemander si un usage plus large se
présente.

### Ratios vidéo — inchangé, toujours deux familles

| Film | Dimensions | Ratio |
| --- | --- | --- |
| 5 — VILLA DIOR | 2276 × 1080 | 2,107:1 |
| 6 — BOSIDENG | 2276 × 1080 | 2,107:1 |
| 7 — ERL SEASON 13 | 3840 × 2160 | 16:9 |
| 8 — DIOR TRUNK SHOW | 1920 × 1080 | 16:9 |

Le lecteur lit déjà son ratio depuis le manifeste, rien à changer.

### Doublons

**Aucun à l'intérieur de `raw-v2/`** : les 49 images ont des empreintes MD5 distinctes. Les doublons
entre v1 et v2 sont le sujet de `reconciliation-v2.md`.

### Textes de présentation — toujours absents

Le document Word prévoit une colonne « Texte de présentation ». **Elle est vide pour les 11
projets.** Le corpus rédactionnel se limite donc, par projet, au titre, au sous-titre, à l'année
et — pour 4 projets — aux crédits photo. Ni lieu, ni description. `reportMissingContent()` continuera
de les signaler.

Nouveauté en revanche : **les crédits photographes** apparaissent pour la première fois (projets 1,
2, 9, 10 — Pierre MOUTON and Adrien DIRAND). Le modèle de contenu n'a pas de champ pour les porter.

---

## Ce que l'inventaire ne permet pas de trancher

- **Le client de chaque projet.** Le document Word ne porte pas de colonne « client ». Les 5 projets
  existants ont un `client` renseigné dans le catalogue ; pour les 6 nouveaux, il faudrait le
  déduire du titre, ce qui est une supposition (« VENETHIAN HERITAGE » est-il le client ou
  l'événement ?). À demander.
- **La lecture des timecodes.** Voir `reconciliation-v2.md` : l'écriture `4:00` / `6:00` / `10:00`
  est arithmétiquement impossible en minutes:secondes sur 3 films sur 4.
- **Le sort du corpus v1.** 15 photos de la v1 n'existent plus en v2. Rien ne dit si elles sont
  retirées volontairement ou simplement absentes de ce nouvel envoi.
