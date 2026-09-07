# LD Productions — Récapitulatif

> État au 8 septembre 2026. Branche `direction-artistique`, app `apps/da-agency`.

---

## 1. Ce qui est en ligne

**https://ld-productions.vercel.app** — site entièrement sombre, validé par le client.

- 11 projets, 49 images, 4 films, ordre du plus récent au plus ancien
- Accueil : mosaïque pleine largeur, 3 colonnes, une tuile par projet, boucles vidéo de 8 s lancées au défilement
- Fiches projet : film en tête quand il existe, galerie 3:2, titre / sous-titre / description / crédits
- Page à propos : texte client verbatim, emplacement réservé pour un portrait d'agence
- Pied de page : monogramme, LinkedIn, Instagram, mentions légales (page vide)
- Logo en en-tête : monogramme + « PRODUCTIONS » composé en Archivo
- Typographie : Bodoni Moda en titrage, Archivo en labeur
- En-tête collant, contenu qui défile dessous

**Publication** : Yanis modifie dans le studio Sanity, clique Publish, le site est à jour en ~75 s.

---

## 2. Comment ça fonctionne

### Contenu
Tout vit dans **Sanity**, projet `kytkrshh` (nommé « LD Productions »), dataset `production`.

- `project` : titre, slug, sous-titre, client, année, lieu, description, crédits, couverture, galerie, visibilité, master vidéo + `loopStart`, et un onglet Technique (dérivés vidéo, lecture seule)
- `siteSettings` : à propos en 3 sections, portrait, réseaux, mentions légales — singleton verrouillé
- Ordre des projets : glisser-déposer dans le studio (`@sanity/orderable-document-list`, champ `orderRank`)

### Images
Sanity les optimise et les sert : `auto=format`, largeurs 640 / 1280 / 2048, LQIP depuis les métadonnées. **Il n'y a plus de pipeline d'images local.**

### Vidéo
Sanity stocke mais ne transcode pas. Deux scripts lisent les documents, téléchargent le master, produisent les dérivés et les remontent dans l'onglet Technique :

- `transcode-video.mjs` → proxy H.264 1080p (lecteur des fiches)
- `extract-loops.mjs` → boucle 8 s + poster, au timecode `loopStart`

Idempotents sur l'empreinte du master. Un master remplacé ou un `loopStart` modifié relance le projet concerné, les autres sont sautés en 0 s.

### Déploiement
Vercel relié à `elmikitozer/perrine-monorepo`, racine `apps/da-agency`. Webhook Sanity → deploy hook Vercel à chaque publication.

---

## 3. À faire avant de donner la main à Yanis

- [ ] **Branch Tracking** : Vercel → Settings → Environments → Production → `direction-artistique`. Sans ça, les publications alimentent des prévisualisations, pas le site.
- [ ] **Build cassé de Perrine** : `perrine-monorepo-production` échoue sur `og-logotype.png` absent. Commiter le fichier ou retirer la référence dans `apps/production/src/app/opengraph-image.tsx`.
- [ ] **Inviter Yanis** : sanity.io/manage → LD Productions → Members → rôle Editor.
- [ ] Vérifier qu'un seul `/studio` est déployé.
- [ ] Envoyer le message d'accueil (§7).

## 4. À faire à la livraison

- [ ] `pnpm -r --filter './apps/*' build` depuis la racine — les trois apps doivent passer
- [ ] Fusionner `direction-artistique` dans `main`
- [ ] Recréer le deploy hook Vercel sur `main`, mettre à jour l'URL dans le webhook Sanity
- [ ] Remettre Branch Tracking sur `main`
- [ ] Pointer leur domaine sur le projet Vercel
- [ ] Retirer `noindex`
- [ ] Transférer le projet Vercel et le projet Sanity à leur nom, rester collaborateur

---

## 5. Répartition des rôles

### Yanis fait seul
Réordonner les projets, corriger un titre ou un sous-titre, ajouter lieu et description, remplir les crédits, uploader une photo, changer une couverture, remplir les mentions légales, uploader le portrait d'agence, ajouter un projet photo complet.

### A besoin de Mike
- **Un nouveau film** : Yanis uploade le master et saisit `loopStart` dans le studio, Mike lance les deux scripts. Deux commandes, quelques minutes.
- **Le logo vectoriel** : remplacer les WebP de `public/brand/` quand le fichier arrive.
- Tout changement de mise en page, de typographie, de structure.

---

## 6. Questions encore ouvertes avec le client

| Sujet | État | À trancher |
|---|---|---|
| Film intégral ou aperçu | Le proxy est servi depuis Sanity, sans débit adaptatif (34 Mo pour Villa Dior) | Si l'aperçu suffit : rien. Sinon : Mux ou Vimeo, et qui paye |
| Hébergement | Domaine chez eux, Vercel et Sanity chez Mike | Transfert à leur nom à la livraison |
| Logo vectoriel | Demandé, pas reçu | Relancer si besoin |
| Lieux et descriptions | Yanis les écrit | Il peut désormais les saisir lui-même |
| Portrait d'agence | « Pas sûr de le garder » | Laisser l'emplacement, il décidera |
| Mentions légales | Absentes | Nom de structure, numéro d'entreprise, adresse — à saisir dans le studio |
| Images lourdes | DIORAMA : 132 Mo pour 8 photos | Dire à Elena que 3000 px suffisent |

---

## 7. Messages à envoyer

### À Yanis, accès au studio

> Ton accès au studio est ouvert : [URL du studio]. Tu y retrouves les onze projets. Tu peux les glisser pour changer l'ordre, modifier les titres, ajouter le lieu et la description de chacun, et remplir les mentions légales dans « Réglages ». Quand tu cliques « Publish », le site se met à jour en une minute et demie environ.
>
> Pour les films, c'est un peu différent : tu uploades le master et tu indiques la seconde de départ, puis tu me préviens — la conversion vidéo passe par moi, ça prend quelques minutes.

### À Elena, pour les prochaines livraisons

> Pour les photos, 3000 px de large suffisent largement pour le site — les fichiers de 15 à 28 Mo sont inutilement lourds et ralentissent le traitement. Pour les vidéos, le format actuel convient.

---

## 8. Commandes utiles

```bash
cd ~/Documents/Pro/perrine/apps/da-agency

# Chaîne vidéo après un nouveau master ou un loopStart modifié
node --env-file=.env.local scripts/transcode-video.mjs
node --env-file=.env.local scripts/extract-loops.mjs

# Migration complète (relançable, idempotente) — normalement plus nécessaire
node --env-file=.env.local scripts/migrate-to-sanity.mjs --apply

# Build local
pnpm build

# Déploiement manuel — plus nécessaire, Git suffit
vercel --prod
```

---

## 9. Pièges connus

**Trois caches qui servent l'ancien contenu.** Le fetch-cache de Next, le cache de Turbo, et le CDN Sanity. Tous trois sont désactivés ou contournés pour ce site : lectures Sanity en `no-store`, `turbo.json` d'app sans cache, client Sanity hors CDN. Ne pas les réactiver — le symptôme serait un webhook qui « ne marche pas ».

**`.env.local` contient un secret d'écriture.** Le jeton `SANITY_API_WRITE_TOKEN` permet d'écrire dans le dataset. Le fichier est ignoré par git ; ne jamais le commiter, et l'exclure du `.vercelignore` si la CLI est encore utilisée.

**`raw/`, `raw-v2/` et `raw-brand/` sont des liens symboliques** vers le dossier Téléchargements. Les scripts refusent d'y écrire (`assertNotInRaw`). Ils ne sont plus la source de vérité — Sanity l'est — mais ils restent utiles comme cache local des masters.

**Le projet Vercel utilise npm, pas pnpm.** L'app a été rendue autonome (plus de dépendance `workspace:*`) pour cette raison. Ne pas réintroduire de dépendance vers `packages/`.

**Les masters ne sont jamais servis.** Le champ `videoMaster` est un dépôt, pas une source de lecture. Si une fiche affiche un master brut, quelque chose lit le mauvais champ.

**Guillemets dans les variables d'environnement.** `.env.local` les interprète, l'interface Vercel non. Les valeurs y sont saisies nues.

---

## 10. Historique des décisions, pour mémoire

- Architecture vidéo-first parce que 2 projets sur 5 (puis 3 sur 11) n'existent que par leur film
- Grille stricte 3:2 parce que 100 % du corpus initial était en 3:2
- Pas de crédits détaillés, lieu + phrases, à la demande du client
- Boucles au défilement plutôt qu'au survol, demande du client, IntersectionObserver
- Site sombre parce que le logo est conçu pour ça (contraste 1,58:1 sur blanc, 11,4:1 sur noir) et que le client trouvait la version claire « froide »
- Sanity pour l'ordre et les textes, scripts locaux pour la vidéo, parce que Sanity ne transcode pas
- App autonome sans dépendance workspace parce que Vercel build en npm
- « VENETIAN HERITAGE » corrigé depuis « VENETHIAN » : fondation réelle, partenaire de Dior
