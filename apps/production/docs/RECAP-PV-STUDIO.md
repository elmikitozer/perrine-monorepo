# PV Studio (site de Perrine) — Récapitulatif avant call

> État au 8 septembre 2026. Branche `direction-artistique`, app `apps/production`.

---

## 1. Ce qui est en ligne

Portfolio de direction artistique / coordination de défilés, sombre... non — fond clair `#fdf8f9`, typo Muller Next.

- 58 projets dans Sanity, tous visibles, tous avec image de couverture
- Accueil : grille de cartes projet, hover avec voile + titre/client/année
- Fiche projet : galerie plein écran
- Page à propos : bio, email, Instagram, LinkedIn — **tous déjà remplis dans Sanity**, ce n'est pas du placeholder
- Pied de page : monogramme, Instagram, LinkedIn, copyright

**Contenu réel confirmé en base** (interrogé directement sur le dataset public) :
- Bio : *« Behind the Runway — Collection & backstage coordination · Line up · Stylist · Shootings — Based in Paris »*
- Email : `contact@perrinevaelroquerestudio.com`
- Instagram : `instagram.com/perrinevaelroquerestudio`
- LinkedIn : `linkedin.com/company/perrinevaelroquerestudio`
- Projets : DIOR, BALENCIAGA, BURBERRY, GUCCI, LOUIS VUITTON, MCQUEEN, MESSIKA, COPERNI… (58 au total, aucun doublon d'ordre)

---

## 2. Bugs trouvés et corrigés aujourd'hui

### a. Site cassé en production — images et carte de partage absentes
Le `.vercelignore` à la racine du monorepo excluait `apps/production/public` et `apps/production/brand-assets` (règle écrite pour alléger le build de `da-agency`, mais ce fichier est partagé par tous les projets Vercel du repo qui n'ont pas leur propre `.vercelignore` scopé). Conséquence réelle en prod : **le dossier `public/` entier n'était pas déployé** — logo, monogramme, et la génération de la carte de partage (`opengraph-image.tsx`) plantaient au build faute de trouver leurs images.

**Corrigé** : le fichier racine ne touche plus à `apps/production`. J'ai ajouté un `.vercelignore` propre à `apps/production` (comme `da-agency` en a déjà un) qui exclut seulement `brand-assets/` et `scripts/` — des dossiers de travail, jamais utilisés à l'exécution.

→ Il faudra redéployer une fois ce commit poussé pour que le site en ligne retrouve ses images.

### b. Lien LinkedIn du pied de page faux
Le footer pointait vers `https://linkedin.com` (générique) au lieu du vrai profil. Corrigé pour pointer vers `linkedin.com/company/perrinevaelroquerestudio`, comme le lien Instagram juste à côté.

---

## 3. Autre chose trouvée, pas un bug mais à trancher avec elle

**Police Muller — fichiers « Trial »** : `src/app/fonts/` contient `MullerNextTrial-*.woff2` (Thin, Regular, ExtraBold). Ce sont des fichiers d'essai, pas la licence complète. À vérifier avant livraison : a-t-elle acheté la licence Muller Next ? Une police d'essai sur un site commercial en ligne est un risque à couper avant la mise en prod définitive. Le README documente encore l'ancienne police (Cormorant Garamond) comme si Muller n'était pas intégrée — il est simplement désynchronisé, le code est à jour.

**Réordonnancement par glisser-déposer — ajouté.** Comme pour LD Productions, l'ordre des projets est maintenant un rang (`orderRank`, `@sanity/orderable-document-list`) plutôt qu'un champ numérique manuel. Le studio affiche une liste « Projets » réordonnable par glisser-déposer ; le champ `order` a été migré et retiré des 58 projets existants (script `scripts/migrate-order-to-rank.mjs`, ordre initial préservé). L'accueil trie désormais sur `orderRank`.

**SEO — traité.** Ajouté :
- `sitemap.xml` dynamique (accueil, à propos, les 58 fiches projet, `lastmod` sur la date de modif Sanity)
- `robots.txt` (tout autorisé, `/studio` exclu, pointe vers le sitemap)
- Title template (`%s — PV Studio`) + meta description réelle sur toutes les pages (l'accueil et les fiches projet renvoyaient un texte quasi vide ou générique avant)
- URLs canoniques sur toutes les pages
- Données structurées JSON-LD (`Person`) avec le vrai email et les vrais réseaux sociaux, pour les résultats enrichis Google
- Open Graph / Twitter Card complets (déjà bons sur les fiches projet, ajoutés sur accueil et à propos)

**Studio : la navbar/pied de page du site s'affichaient au-dessus de l'éditeur Sanity — corrigé.** Le studio est maintenant en plein écran, sans le chrome du site public. (Je ferai pareil systématiquement sur les autres apps du monorepo — LD Productions a le même souci, pas encore traité, à faire si tu veux.)

---

## 4. Accès Sanity — réponse à ta question

**Non, Perrine n'a pas encore de compte.** J'ai vérifié directement les membres du projet Sanity `93a10qqu` (« PV Studio ») :

| Membre | Type | Rôle |
|---|---|---|
| Toi | humain, administrateur | Administrator |
| — | robot (jeton API) | Editor |
| — | robot (jeton API) | Editor |

Un seul humain sur le projet : toi. Aucun compte n'a été créé ou invité pour elle — il faudra le faire depuis `sanity.io/manage` → PV Studio → Members, comme pour Yanis côté LD Productions.

---

## 5. À préparer / trancher pendant le call

- [ ] **Inviter Perrine dans Sanity Studio** (rôle Editor recommandé — elle pourra éditer projets et à propos, pas casser la structure)
- [ ] **Licence Muller Next** : a-t-elle acheté les fichiers définitifs, ou reste-t-on sur la version Trial pour l'instant ?
- [ ] **Redéployer** après ce fix pour vérifier que les images reviennent en prod (le bug du `.vercelignore` était live)
- [ ] Vérifier qui doit avoir la main sur l'ajout de nouveaux projets : elle seule dans Sanity, ou toujours besoin de toi pour la mise en page ?
- [ ] Domaine final et statut du déploiement (Branch Tracking Vercel sur la bonne branche) — important pour le SEO aussi : le sitemap et les URLs canoniques utilisent l'URL de prod Vercel tant qu'aucun domaine ni `NEXT_PUBLIC_SITE_URL` n'est fixé
- [ ] Même correctif « pas de chrome du site dans le studio » à faire sur LD Productions si tu veux (pas encore fait, même problème identifié)
