# Réconciliation v1 → v2 — Site LD Productions

> Comparaison de `raw/` (livraison du 18/08) et `raw-v2/` (livraison du 04/09).
> **Aucun code produit, aucun pipeline lancé, aucun fichier de contenu modifié.**
> Méthode : empreinte MD5 pour l'identité à l'octet près, puis aHash 64 bits pour distinguer
> un ré-export d'une photo réellement différente. Les films sont comparés par MD5 et par `ffprobe`.

---

## 1. Table de publication issue du document Word

Noms repris **verbatim** du fichier `raw-v2/SITE INTERNET PHOTOS .docx`, casse, accents et
ponctuation compris. Rien n'est normalisé ni corrigé ici.

| Nº | Titre (verbatim) | Sous-titre (verbatim) | Année | Crédits | Timecode |
| --- | --- | --- | --- | --- | --- |
| 1 | `DIOR HAUTE JOAILLERIE - DIORAMA` | `Gala dinner and show production` | 2024 | Pierre MOUTON and Adrien DIRAND | — |
| 2 | `DIOR HAUTE JOAILLERIE – DIOREXQUIS` | `Gala dinner and show production` | 2025 | Pierre MOUTON and Adrien DIRAND | — |
| 3 | `NECTAR VESSELS BRONZES BY KRIS VAN ASSCHE` | `Exhibition` | 2025 | — | — |
| 4 | `ANTAZERO x KRIS VAN ASSCHE` | `Pop-up` | 2025 | — | — |
| 5 | `VILLA DIOR` | `Cocktail and logistic coordination` | 2026 | — | `4:00` |
| 6 | `BOSIDENG - AREAL KIM JONES` | `Window display and pop-up` | 2026 | — | `00:00` |
| 7 | `ERL SEASON 13` | `Showroom` | 2026 | — | `6:00` |
| 8 | `DIOR TRUNK SHOW` | `Show production` | 2026 | — | `10:00` |
| 9 | `VENETHIAN HERITAGE` | `Cocktail, gala dinner and after party` | 2026 | Pierre MOUTON and Adrien DIRAND | — |
| 10 | `DIOR HAUTE JOAILLERIE - DIORISSIMA` | `Gala dinner and show production` | 2026 | Pierre MOUTON and Adrien DIRAND | — |
| 11 | `ERL SEASON 14` | `Showoom and cocktail party` | 2026 | — | — |

**Détails verbatim à ne pas perdre en route :**

- Le nº 1 et le nº 10 utilisent un **trait d'union** (`-`, U+002D), le nº 2 un **tiret demi-cadratin**
  (`–`, U+2013). Ce n'est pas une coquille de transcription, les trois graphies sont distinctes dans
  le fichier source.
- Nº 4 : `x` **minuscule** entre ANTAZERO et KRIS VAN ASSCHE.
- Nº 9 et nº 10 portent un **espace final** dans le document. À supprimer au moment de la saisie —
  c'est un artefact de frappe, pas un choix typographique.
- Nº 11 : le sous-titre est `Showoom`, sans le « r ». Voir Incohérences.
- Nº 9 : `VENETHIAN`, avec un « h ». Voir Incohérences.

L'en-tête de colonne dit « NUMERO DE PUBLICATION (de la plus ancienne a la plus récente) », ce que
les années confirment (1 → 2024, 11 → 2026). **L'accueil doit donc trier par ce numéro en
décroissant : 11 en premier, 1 en dernier.**

---

## 2. Timecodes vidéo — contradiction arithmétique

Quatre timecodes sont donnés, pour les quatre projets qui ont un film. Confrontés à la durée réelle
mesurée par `ffprobe` :

| Nº | Projet | Timecode | Lu en `mm:ss` | Durée du film | Verdict |
| --- | --- | --- | --- | --- | --- |
| 5 | VILLA DIOR | `4:00` | 240 s | 75,96 s | **impossible** |
| 6 | BOSIDENG - AREAL KIM JONES | `00:00` | 0 s | 40,16 s | possible |
| 7 | ERL SEASON 13 | `6:00` | 360 s | 51,96 s | **impossible** |
| 8 | DIOR TRUNK SHOW | `10:00` | 600 s | 72,88 s | **impossible** |

Trois timecodes sur quatre tombent **au-delà de la fin du film** s'ils sont lus en minutes:secondes.

Lus en **secondes:images** — soit 4 s, 0 s, 6 s et 10 s — les quatre tombent dans le film, et
laissent chacun la place d'une boucle de 8 s sans atteindre la fin. C'est la seule lecture qui rende
les quatre valeurs cohérentes.

**Je ne tranche pas.** La lecture « secondes » est la seule qui fonctionne, mais elle repose sur une
convention que la cliente n'a pas explicitée, et se tromper de 4 minutes sur une boucle d'accueil se
voit tout de suite. À confirmer avant de lancer `extract-loops.mjs --start=N`.

---

## 3. Correspondance des dossiers

Appariement établi par empreinte MD5 des images, et par empreinte + durée pour les projets sans
photo. Les 6 dossiers restants n'ont aucune correspondance : ce sont les nouveaux projets.

| Dossier v1 | Dossier v2 | `assetKey` figé | Preuve de l'appariement |
| --- | --- | --- | --- |
| `ANTAZERO x KRIS VAN ASSCHE` | `4-ANTA ZERO X KRIS VAN ASSCHE` | `antazero-x-kris-van-assche` | 2 images identiques (MD5) |
| `BOSIDENG` | `6-BOSIDENG AREAL X KIM JONES` | `bosideng` | 3 images identiques + film identique |
| `ERL 06 26` | `11-ERL SEASON 14` | `erl` | 1 image identique |
| `DIOR TRUNK SHOW` | `8-DIOR-TRUNK0226` | `dior-trunk-show` | **film différent** — voir ci-dessous |
| `VILLA DIOR` | `5-VILLA DIOR` | `villa-dior` | film identique (MD5) |
| `KRIS VAN ASSCHE NECTAR VESSELS` | `3-NECTAR VESSELS BY KRIS VAN ASSCHE` | *(hors catalogue)* | **aucune preuve** — voir ci-dessous |

### DIOR TRUNK SHOW — apparié sans preuve d'octet

Le film v2 n'a pas la même empreinte que le v1. Ce qui rapproche les deux :

| | v1 | v2 |
| --- | --- | --- |
| Fichier | `Dior Trunk Show film HQ.mov` | `SITE_8.1.mov` |
| Dimensions | 3840 × 2160 | **1920 × 1080** |
| Durée | 72,88 s | 72,88 s |
| Poids | 226,2 Mo | 83,9 Mo |
| Codec | HEVC 10 bits 4:2:2 | HEVC 10 bits 4:2:2 |

Durée identique à la trame près : même montage, ré-encodé en définition inférieure. L'appariement
tient sur la durée et le nom du dossier, pas sur le contenu. **Conséquence pratique : le proxy
existant a été fabriqué depuis le master 4K, il devra être régénéré depuis un master deux fois moins
défini.** La sortie reste du 1080p, donc la perte visible est faible, mais elle est réelle.

### NECTAR VESSELS — même projet, corpus entièrement remplacé

Aucune des 4 images v1 n'a de correspondance en v2, ni par MD5 ni visuellement. Le rapprochement
repose uniquement sur le nom. C'est cohérent avec l'historique : les fichiers v1 étaient des exports
à 533–800 px, le projet avait été retiré du catalogue le 19/08 pour cette raison, et la v2 livre
6 photos neuves à 1707–2560 px. **Le motif du retrait est levé** — le projet peut revenir, et le
document Word le confirme en le plaçant au nº 3.

> **Erratum (Phase 1, 04/09).** « Ni visuellement » est faux. Recomparaison par aHash 64 bits,
> distance de Hamming : `IMG_1116` ↔ `SITE_3.1` = 5, `IMG_1114` ↔ `SITE_3.2` = 1, `IMG_1117` ↔
> `SITE_3.5` = 2. **Trois des quatre photos v1 sont les mêmes prises de vue, relivrées à 2560 px**
> (contre 800), et confirmées à l'œil sur la première paire ; `IMG_1115` n'a pas d'équivalent, et
> `SITE_3.3`, `3.4`, `3.6` sont inédites. Aucun fichier n'est identique à l'octet près. La
> conclusion tient : ce sont les fichiers d'origine demandés à la question 4, le retrait n'a plus
> de motif.

Il faudra lui retirer son entrée dans `EXCLUDED_FOLDERS` (`scripts/lib/corpus.mjs`).

---

## 4. Photos ajoutées, remplacées, supprimées

Chaque photo « disparue » a été comparée visuellement à toutes les photos v2 du même projet
(aHash 64 bits). Aucune n'est un ré-export : **les remplacements sont de vraies substitutions de
prises de vue**, pas des ré-encodages. Distance de Hamming 0 = même image ; ≥ 13 sur toutes les
disparues.

### 4 — ANTAZERO x KRIS VAN ASSCHE · 7 → 7 photos

| État | Fichier v1 | Fichier v2 | Détail |
| --- | --- | --- | --- |
| Conservée | `DSC03633.jpg` | `SITE_4.4.jpg` | MD5 identique |
| Conservée | `DSC03774.jpg` | `SITE_4.7.jpg` | MD5 identique |
| Supprimée | `DSC03608.jpg` | — | 6569 × 4379 |
| Supprimée | `DSC03613.jpg` | — | 6726 × 4484 |
| Supprimée | `DSC03624.jpg` | — | 6666 × 4444 |
| Supprimée | `DSC03739.jpg` | — | 7008 × 4672 |
| Supprimée | `DSC03755.jpg` | — | 6488 × 4325 |
| Ajoutée | — | `SITE_4.1.jpg` | 7008 × 4672 |
| Ajoutée | — | `SITE_4.2.jpg` | 6095 × 4063 |
| Ajoutée | — | `SITE_4.3.jpg` | 7008 × 4672 |
| Ajoutée | — | `SITE_4.5.jpg` | 7008 × 4672 |
| Ajoutée | — | `SITE_4.6.jpg` | 7008 × 4672 |

Effectif inchangé, mais **5 photos sur 7 sont neuves**. La sélection a été refaite.

### 6 — BOSIDENG - AREAL KIM JONES · 5 → 5 photos

| État | Fichier v1 | Fichier v2 |
| --- | --- | --- |
| Conservée | `26-01-16_…_A743747.jpg` (portrait) | `SITE_6.2.jpg` |
| Conservée | `26-01-16_…_A743845.jpg` | `SITE_6.4.jpg` |
| Conservée | `26-01-16_…_A743847.jpg` | `SITE_6.5.jpg` |
| Supprimée | `26-01-16_…_A743793.jpg` | — |
| Supprimée | `26-01-16_…_A743842.jpg` | — |
| Ajoutée | — | `SITE_6.3.jpg` |
| Ajoutée | — | `SITE_6.6.jpg` |

Le projet le plus stable : 3 photos sur 5 conservées à l'octet près, et le film inchangé.

### 11 — ERL SEASON 14 · 5 → 6 photos

| État | Fichier v1 | Fichier v2 |
| --- | --- | --- |
| Conservée | `26-06-27_ERL-1.jpg` | `SITE_11.1.jpg` |
| Supprimée | `26-06-27_ERL-15.jpg` | — |
| Supprimée | `26-06-27_ERL-23.jpg` | — |
| Supprimée | `26-06-27_ERL-38.jpg` | — |
| Supprimée | `26-06-27_ERL-67.jpg` (portrait) | — |
| Ajoutée | — | `SITE_11.2.jpg` (portrait) |
| Ajoutée | — | `SITE_11.3.jpg` |
| Ajoutée | — | `SITE_11.4.jpg` |
| Ajoutée | — | `SITE_11.5.jpg` |
| Ajoutée | — | `SITE_11.6.jpg` |

**Une seule photo sur 5 survit.** Le projet est à considérer comme neuf côté visuels. Le portrait
change aussi : `ERL-67` sort, `SITE_11.2` entre.

### 5 — VILLA DIOR et 8 — DIOR TRUNK SHOW

Toujours 0 photo. Inchangé.

### Récapitulatif

| | Nombre |
| --- | --- |
| Images identiques v1 ↔ v2 (MD5) | **6** |
| Images v1 disparues | **15** |
| Images v2 nouvelles | **43** |
| Films identiques | 2 (BOSIDENG, VILLA DIOR) |
| Films remplacés | 1 (DIOR TRUNK SHOW, 4K → 1080p) |
| Films nouveaux | 1 (ERL SEASON 13) |

---

## 5. Les 6 nouveaux projets

| Nº | Titre (doc) | Dossier | Photos | Film |
| --- | --- | --- | --- | --- |
| 1 | `DIOR HAUTE JOAILLERIE - DIORAMA` | `1-DIOR Haute Joaillerie 24` | 8 | — |
| 2 | `DIOR HAUTE JOAILLERIE – DIOREXQUIS` | `2-DIORHJ25` | 8 | — |
| 3 | `NECTAR VESSELS BRONZES BY KRIS VAN ASSCHE` | `3-NECTAR VESSELS BY KRIS VAN ASSCHE` | 6 | — |
| 7 | `ERL SEASON 13` | `7-ERL SEASON 13` | 0 | 1 |
| 9 | `VENETHIAN HERITAGE` | `9-VENETHIAN HERITAGE` | 5 | — |
| 10 | `DIOR HAUTE JOAILLERIE - DIORISSIMA` | `10-DIORVHHJ26` | 4 | — |

Le nº 3 est un retour au catalogue plutôt qu'une nouveauté stricte, mais son corpus est
intégralement neuf.

**Aucun dossier n'est non apparié dans l'autre sens** : les 6 dossiers v1 sont tous retrouvés en v2,
et les 11 dossiers v2 sont tous soit appariés, soit identifiés comme nouveaux. Il n'y a pas
d'orphelin.

---

## 6. Le document Word face au catalogue actuel

### AREAL KIM JONES — orthographe confirmée

Le catalogue porte depuis le début la mention *« ÉCART 1 : orthographe d'« AREAL » non confirmée.
Ce slug ne doit pas être publié ni indexé avant validation client. »*

**Le document Word écrit `BOSIDENG - AREAL KIM JONES`. L'orthographe AREAL est donc confirmée par
la cliente**, et la réserve peut être levée.

Deux nuances qui n'étaient pas dans la question :

- Le titre complet du document **préfixe le nom du client** : `BOSIDENG - AREAL KIM JONES`, alors
  que le catalogue affiche `AREAL KIM JONES` et porte `Bosideng` dans un champ `client` séparé.
  Reprendre le titre verbatim ferait apparaître le client deux fois à l'écran.
- Le dossier, lui, écrit `6-BOSIDENG AREAL X KIM JONES`, avec un `X` que le document n'a pas.

### Titres — confrontation ligne à ligne

| Nº | Document Word | Catalogue actuel | Verdict |
| --- | --- | --- | --- |
| 4 | `ANTAZERO x KRIS VAN ASSCHE` | `ANTAZERO x KRIS VAN ASSCHE` | identique |
| 5 | `VILLA DIOR` | `VILLA DIOR` | identique |
| 6 | `BOSIDENG - AREAL KIM JONES` | `AREAL KIM JONES` | **préfixe client ajouté** |
| 8 | `DIOR TRUNK SHOW` | `DIOR TRUNK SHOW` | identique |
| 11 | `ERL SEASON 14` | `ERL SEASON 14` | identique |

### Sous-titres — deux écarts réels

| Nº | Document Word | Catalogue (`eventType`) | Verdict |
| --- | --- | --- | --- |
| 4 | `Pop-up` | `Showroom` | **contradiction franche** |
| 5 | `Cocktail and logistic coordination` | `Cocktail and logistic coordination` | identique |
| 6 | `Window display and pop-up` | `Window display and pop-up` | identique |
| 8 | `Show production` | `Show` | reformulé |
| 11 | `Showoom and cocktail party` | `Showroom and cocktail party` | **le document a une coquille** |

Le nº 4 est le seul vrai conflit : le catalogue dit *Showroom*, le document dit *Pop-up*. Ce ne sont
pas deux formulations du même fait. Le document Word étant la source la plus récente et la seule
signée par la cliente, il l'emporte a priori — mais l'écart mérite d'être confirmé plutôt que
d'être appliqué en silence.

Le nº 11 est l'inverse : le catalogue est correct, le document a perdu un « r ». La consigne est de
reprendre le document verbatim ; publier `Showoom` sur le site serait une faute visible. **À faire
corriger côté cliente plutôt qu'à trancher ici.**

### Années — aucun écart

Les 5 projets existants ont dans le document la même année que dans le catalogue (4 → 2025, les
autres → 2026).

---

## 7. Incohérences à signaler à la cliente

| # | Constat | Ce qui est en jeu |
| --- | --- | --- |
| 1 | Timecodes `4:00` / `6:00` / `10:00` impossibles en `mm:ss` sur 3 films | Point de départ des boucles d'accueil |
| 2 | `VENETHIAN HERITAGE` — graphie inhabituelle pour « Venetian » | Titre affiché et slug public |
| 3 | `Showoom and cocktail party` (nº 11) — « r » manquant | Sous-titre affiché |
| 4 | Nº 4 : `Pop-up` (document) contre `Showroom` (catalogue) | Sous-titre affiché |
| 5 | Nº 6 : `BOSIDENG - AREAL KIM JONES` répète le client déjà porté par un champ dédié | Titre affiché |
| 6 | Dossier `10-DIORVHHJ26` pour un projet titré `DIOR HAUTE JOAILLERIE - DIORISSIMA`, quand le nº 9 est `VENETHIAN HERITAGE` — le « VH » du nom de dossier appartient au vocabulaire du nº 9 | Risque d'inversion des dossiers 9 et 10 |
| 7 | Nº 1 et nº 3 : le document ajoute `DIORAMA` et `BRONZES`, absents des noms de dossier | Titre affiché |
| 8 | Nº 9 et nº 10 : espace final dans le document | Titre affiché |
| 9 | Fichiers `SITE_2.6jpg.jpg` et `SITE_10.1jpg.jpg` | Identifiants et URL publiques |
| 10 | 15 photos de la v1 absentes de la v2 | Retrait volontaire ou oubli d'envoi ? |
| 11 | Master DIOR TRUNK SHOW passé de 4K à 1080p | Perte de définition source |
| 12 | Aucun texte de présentation, colonne prévue mais vide | Contenu des fiches projet |
| 13 | Crédits photographes fournis pour 4 projets, aucun champ pour les porter | Mentions obligatoires ? |
| 14 | Aucune colonne « client » dans le document | Champ `client` des 6 nouveaux projets |

Le point 6 est le seul qui puisse produire une **erreur silencieuse** : si les dossiers 9 et 10 sont
inversés, les photos partent sur le mauvais projet et rien dans le pipeline ne le détectera. À faire
confirmer visuellement par la cliente avant tout encodage.

---

## 8. Vérification de `--prune`

**Non lancé, conformément à la consigne.** Ce qui suit est une lecture du code de
`scripts/optimize-images.mjs` et de `scripts/lib/corpus.mjs`, confrontée à l'état réel de
`public/`.

### Ce que `--prune` fait, exactement

Deux niveaux, dans `optimize-images.mjs` :

1. **Par projet** (dans la boucle, l. 203–209). `expected` est reconstruit à partir des entrées
   produites au run — y compris celles servies par le cache. Tout fichier de
   `public/images/<slug>/` qui n'y figure pas est supprimé.
2. **À la racine** (l. 219–232, uniquement **sans** `--only`). Tout répertoire de `public/images/`
   dont le nom n'est pas un slug du catalogue courant est supprimé, **sauf `posters/`**, qui
   appartient à `extract-loops.mjs`.

### Réponse à la question posée

**Oui, `--prune` efface bien les dérivés orphelins après un remplacement, et il ne touche à rien
d'autre dans `public/images/`.** Le mécanisme est correct : une photo remplacée porte un nouveau nom
de source, donc un nouvel `imageId()`, donc de nouveaux noms de dérivés ; les anciens ne sont plus
dans `expected` et tombent. Une photo inchangée garde son identifiant et ses fichiers, y compris
quand elle vient du cache.

`raw/` et `raw-v2/` ne peuvent pas être touchés : le prune n'opère que sous `OUTPUT_ROOT`
(`public/images/`), et `assertNotInRaw()` garde toute création de dossier.

### Mais sur cette livraison, il fera beaucoup plus que ça

Trois effets à connaître avant de lancer quoi que ce soit :

1. **Les 98 dérivés existants seront tous supprimés puis régénérés.** La v2 renomme 100 % des
   sources (`DSC03633.jpg` → `SITE_4.4.jpg`), y compris les 6 photos identiques à l'octet près.
   Nouveau nom de source = nouvel identifiant = nouveaux noms de dérivés. Ce n'est pas une perte,
   mais toutes les URL d'images changent.
2. **Le cache ne servira à rien.** Il est indexé par chemin source relatif à `raw/`
   (`cache[relative]`). Tous les chemins changent, donc 49 images à ré-encoder intégralement.
3. **Si les slugs sont recalculés naïvement depuis les dossiers numérotés**, `slugify()` produit
   `4-anta-zero-x-kris-van-assche`, `6-bosideng-areal-x-kim-jones`, `11-erl-season-14`… Les
   répertoires `antazero-x-kris-van-assche/`, `bosideng/` et `erl/` ne seraient plus des slugs
   connus, et le prune de racine les effacerait entièrement. **C'est le scénario à éviter** : il
   casse les `assetKey` figés en même temps que les URL.

Le préfixe numérique ne doit jamais atteindre le slug. Il faut étendre `SLUG_OVERRIDES` aux 11
dossiers, en conservant les 5 clés existantes :

| Dossier v2 | `assetKey` à conserver |
| --- | --- |
| `4-ANTA ZERO X KRIS VAN ASSCHE` | `antazero-x-kris-van-assche` |
| `6-BOSIDENG AREAL X KIM JONES` | `bosideng` |
| `8-DIOR-TRUNK0226` | `dior-trunk-show` |
| `11-ERL SEASON 14` | `erl` |
| `5-VILLA DIOR` | `villa-dior` |

### Ce que `--prune` ne nettoiera pas — le vrai trou

`--prune` n'existe **que** dans `optimize-images.mjs`. Ni `transcode-video.mjs` ni
`extract-loops.mjs` ne contiennent le moindre `rmSync` : **rien ne nettoie jamais**
`public/videos/`, `public/videos/loops/` ni `public/images/posters/`.

Contenu actuel, tout indexé par clé de projet :

```
public/videos/          bosideng.mp4  dior-trunk-show.mp4  villa-dior.mp4
public/videos/loops/    bosideng.{mp4,jpg}  dior-trunk-show.{mp4,jpg}  villa-dior.{mp4,jpg}
public/images/posters/  bosideng/  dior-trunk-show/  villa-dior/
```

Tant que les clés ne bougent pas, ces fichiers sont écrasés en place et il n'y a pas d'orphelin.
Si une clé change, ils deviennent des orphelins **définitifs**, committés dans le dépôt, qu'aucun
script ne sait retirer. Et `posters/` est explicitement exclu du prune de racine, donc doublement
protégé de tout nettoyage.

Deux conséquences concrètes pour la suite :

- Le proxy et la boucle de `dior-trunk-show` doivent être régénérés (nouveau master 1080p), ce qui
  se fera par écrasement : pas d'orphelin, mais `--force` sera nécessaire côté vidéo si un cache de
  hash existe.
- ERL SEASON 13 apporte un 4ᵉ film : `public/videos/` passera de 3 à 4 proxys, et
  `public/images/posters/` de 3 à 4 dossiers.

### Deux fragilités latentes

- `rmSync(join(targetDir, orphan), { force: true })` (l. 207) n'a pas `recursive: true`. Un
  sous-dossier apparaissant un jour dans `public/images/<slug>/` ferait lever `ERR_FS_EISDIR`.
  Aucun sous-dossier n'existe aujourd'hui, le risque est théorique.
- Avec `--only`, le prune de racine est sauté mais le prune par projet s'exécute quand même. C'est
  documenté dans le code et cohérent, mais cela veut dire qu'un `--prune --only=x` laisse les
  dossiers hors catalogue en place.

---

## 9. Ce qui bloque avant tout lancement de pipeline

Deux obstacles rendent un run impossible en l'état, indépendamment de `--prune` :

1. **Le pipeline ne regarde que `raw/`.** `RAW_DIR` est figé sur `resolve(APP_ROOT, 'raw')` dans
   `scripts/lib/corpus.mjs`. Aucun drapeau ne permet de viser `raw-v2/`.
2. **Les images sont un niveau trop bas.** `listProjects()` ne retient que les entrées `isFile()`
   directement dans le dossier projet. Or chaque dossier de `raw-v2/` ne contient qu'un
   sous-dossier `A METTRE SUR SITE/`. Vérifié : les 11 dossiers ont **0 fichier à plat**. Un run
   aujourd'hui verrait donc 11 projets à 0 image et 0 vidéo, produirait un manifeste vide — et,
   avec `--prune`, effacerait tous les dérivés existants avant de ne rien régénérer.

**C'est le scénario dangereux à éviter : `--prune` combiné à une découverte de sources vide.**
Les deux points sont à traiter en Phase 1, avant le premier encodage.
