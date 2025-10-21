# 📋 Résumé du Projet

## Vue d'ensemble

Monorepo contenant **3 sites web indépendants** pour Perrine, tous basés sur **Next.js 14** avec **Sanity CMS**.

## Les 3 Sites

### 🎨 DA Agency (Direction Artistique)
**Port** : 3000
**URL Studio** : http://localhost:3000/studio
**Objectif** : Site vitrine pour l'agence de direction artistique

**Fonctionnalités** :
- Portfolio de projets
- Services proposés
- Page de contact
- Gestion CMS complète

**Schémas Sanity** :
- `project` : Projets (titre, images, client, catégorie)
- `service` : Services proposés
- `page` : Pages personnalisables

### 🍸 Cocktails (Recettes Familiales)
**Port** : 3001
**URL Studio** : http://localhost:3001/studio
**Objectif** : Site de partage de recettes de cocktails traditionnels

**Fonctionnalités** :
- Catalogue de recettes
- Catégories de cocktails
- Instructions détaillées avec ingrédients
- Page de contact

**Schémas Sanity** :
- `recipe` : Recettes complètes (ingrédients, instructions, temps, difficulté)
- `category` : Catégories de cocktails
- `page` : Pages personnalisables

### 🎬 Production (Services Audiovisuels)
**Port** : 3002
**URL Studio** : http://localhost:3002/studio
**Objectif** : Site vitrine pour la collaboratrice en production

**Fonctionnalités** :
- Portfolio de projets vidéo/photo
- Services de production
- Témoignages clients
- Page de contact

**Schémas Sanity** :
- `projectProduction` : Projets (avec support vidéo)
- `service` : Services proposés
- `testimonial` : Témoignages clients
- `page` : Pages personnalisables

## Stack Technique

### Frontend
- **Framework** : Next.js 14.2.5 (App Router)
- **UI Library** : React 18.3.1
- **Language** : TypeScript 5.5.4
- **Styling** : Tailwind CSS 3.4.1
- **Fonts** : Google Fonts (Inter)

### CMS
- **Headless CMS** : Sanity 3.58.0
- **Studio** : Intégré dans chaque app via `/studio`
- **Images** : CDN Sanity avec optimisation automatique

### Monorepo
- **Build System** : Turbo 2.0.12
- **Package Manager** : pnpm 8.15.0
- **Structure** : Workspaces avec packages partagés

### Deployment
- **Platform** : Vercel (recommandé)
- **CI/CD** : Automatique via Git

## Architecture du Monorepo

```
perrine/
├── apps/                           # Applications
│   ├── da-agency/                  # Site DA (port 3000)
│   │   ├── src/
│   │   │   ├── app/               # Pages Next.js
│   │   │   │   ├── page.tsx       # Page d'accueil
│   │   │   │   ├── contact/       # Page contact
│   │   │   │   ├── studio/        # Sanity Studio
│   │   │   │   └── layout.tsx     # Layout principal
│   │   │   └── sanity/            # Configuration Sanity
│   │   │       ├── schemas/       # Schémas CMS
│   │   │       └── lib/           # Client & helpers
│   │   ├── .env.local             # Variables d'environnement
│   │   └── package.json
│   │
│   ├── cocktails/                  # Site Cocktails (port 3001)
│   │   └── [même structure]
│   │
│   └── production/                 # Site Production (port 3002)
│       └── [même structure]
│
├── packages/                       # Packages partagés
│   ├── ui/                        # Composants UI réutilisables
│   │   └── src/
│   │       ├── Button.tsx         # Bouton personnalisable
│   │       ├── Header.tsx         # Header avec navigation
│   │       ├── Footer.tsx         # Footer
│   │       ├── ContactForm.tsx    # Formulaire de contact
│   │       ├── Container.tsx      # Conteneur responsive
│   │       └── index.tsx          # Exports
│   │
│   └── tsconfig/                  # Configs TypeScript partagées
│       ├── base.json
│       ├── nextjs.json
│       └── react-library.json
│
├── package.json                    # Config workspace racine
├── turbo.json                      # Config Turbo
├── pnpm-workspace.yaml            # Config pnpm workspace
└── [documentation]
```

## Composants Partagés (@perrine/ui)

### Button
Bouton personnalisable avec 3 variantes :
- `primary` : Noir sur fond blanc
- `secondary` : Gris
- `outline` : Bordure noire

### Header
Header responsive avec :
- Logo/nom du site
- Navigation personnalisable
- Mobile-friendly

### Footer
Footer simple avec :
- Nom du site
- Copyright automatique
- Responsive

### ContactForm
Formulaire de contact avec :
- Validation
- États de chargement
- Messages de succès/erreur
- Handler personnalisable

### Container
Conteneur responsive avec :
- Marges automatiques
- Padding responsive
- Max-width 7xl (1280px)

## Commandes Principales

### Développement
```bash
# Lancer tous les sites
pnpm dev

# Lancer un site spécifique
pnpm dev --filter=da-agency
pnpm dev --filter=cocktails
pnpm dev --filter=production
```

### Build
```bash
# Build tous les sites
pnpm build

# Build un site spécifique
pnpm build --filter=da-agency
```

### Autres
```bash
pnpm lint      # Linter
pnpm clean     # Nettoyer
pnpm format    # Formatter le code
```

## Variables d'Environnement

Chaque app nécessite un fichier `.env.local` avec :

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="votre-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
```

## Workflow de Développement

### 1. Installation
```bash
pnpm install
```

### 2. Configuration Sanity
- Créer 3 projets sur sanity.io
- Copier les Project IDs dans les `.env.local`

### 3. Développement
```bash
pnpm dev
```

### 4. Ajouter du contenu
- Visiter `/studio` sur chaque site
- Créer du contenu via l'interface Sanity

### 5. Build & Test
```bash
pnpm build
```

### 6. Déploiement
- Push sur Git
- Déployer sur Vercel (3 projets séparés)

## Personnalisation

### Modifier les couleurs
Chaque app a son propre `tailwind.config.js` avec une palette personnalisée.

### Ajouter un composant
1. Créer dans `packages/ui/src/`
2. Exporter dans `packages/ui/src/index.tsx`
3. Utiliser dans n'importe quelle app avec `import { Component } from '@perrine/ui'`

### Ajouter un schéma Sanity
1. Créer dans `apps/[app]/src/sanity/schemas/`
2. Importer dans `schemas/index.ts`
3. Le studio se met à jour automatiquement

### Ajouter une page
1. Créer un dossier dans `apps/[app]/src/app/`
2. Ajouter un `page.tsx`
3. Next.js crée automatiquement la route

## Avantages de cette Architecture

### ✅ Monorepo
- **Code partagé** : Composants UI réutilisables
- **DX améliorée** : Un seul `pnpm install`
- **Maintenance facile** : Mise à jour centralisée

### ✅ 3 Projets Séparés
- **Déploiement indépendant** : Chaque site peut être déployé séparément
- **Scalabilité** : Chaque site peut évoluer indépendamment
- **Sécurité** : Isolation des données Sanity

### ✅ Sanity CMS
- **Édition facile** : Interface intuitive pour Perrine
- **Flexibilité** : Schémas personnalisés par site
- **Performance** : CDN intégré, images optimisées
- **Gratuit** : Plan free largement suffisant

### ✅ Next.js 14
- **Performance** : Server Components, optimisations automatiques
- **SEO** : SSR/SSG natif
- **DX** : App Router moderne, TypeScript
- **Déploiement** : Vercel natif

## Coûts Estimés

### Développement
- **Gratuit** : Tout est open-source

### Hébergement (par site)
- **Vercel Free** : Gratuit jusqu'à 100 GB/mois
- **Sanity Free** : Gratuit jusqu'à 3 utilisateurs

**Total pour 3 sites : 0€/mois** 🎉

### Si besoin d'upgrade
- **Vercel Pro** : $20/mois par site
- **Sanity Growth** : $99/mois par projet

## Prochaines Étapes Possibles

### Court terme
- [ ] Ajouter des images aux projets
- [ ] Personnaliser les couleurs
- [ ] Ajouter du contenu réel
- [ ] Configurer les domaines personnalisés

### Moyen terme
- [ ] Ajouter Google Analytics
- [ ] Optimiser le SEO (sitemap, robots.txt)
- [ ] Ajouter des animations
- [ ] Implémenter l'envoi d'emails pour les formulaires

### Long terme
- [ ] Internationalisation (i18n)
- [ ] Blog intégré
- [ ] Recherche avancée
- [ ] Espace membre

## Documentation

- **[README.md](./README.md)** - Vue d'ensemble
- **[QUICK_START.md](./QUICK_START.md)** - Démarrage rapide (5 min)
- **[INSTALLATION.md](./INSTALLATION.md)** - Guide d'installation complet
- **[SANITY_SETUP.md](./SANITY_SETUP.md)** - Configuration Sanity détaillée
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Guide de personnalisation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement Vercel
- **[VERSIONS.md](./VERSIONS.md)** - Versions & compatibilité

## Support

Pour toute question :
1. Consulter la documentation ci-dessus
2. Vérifier les [problèmes courants](./QUICK_START.md#problèmes-courants)
3. Consulter la doc officielle :
   - [Next.js](https://nextjs.org/docs)
   - [Sanity](https://www.sanity.io/docs)
   - [Tailwind](https://tailwindcss.com/docs)

## Licence

MIT - Libre d'utilisation et de modification

---

**Créé le** : 21 Octobre 2024
**Version** : 1.0.0
**Stack** : Next.js 14 + Sanity 3 + TypeScript + Tailwind

