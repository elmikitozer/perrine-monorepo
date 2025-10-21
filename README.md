# Perrine - Monorepo

Monorepo contenant 3 sites vitrines pour Perrine :
- 🎨 **DA Agency** - Site de l'agence de Direction Artistique
- 🍸 **Cocktails** - Site de recettes de cocktails familiaux
- 🎬 **Production** - Site de la collaboratrice en production

## Stack Technique

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript
- **CMS:** Sanity.io
- **Styling:** Tailwind CSS
- **Monorepo:** Turbo
- **Package Manager:** pnpm

## Structure

```
perrine/
├── apps/
│   ├── da-agency/      # Site DA
│   ├── cocktails/      # Site recettes
│   └── production/     # Site production
├── packages/
│   ├── ui/            # Composants réutilisables
│   └── tsconfig/      # Configs TypeScript partagées
```

## Installation

```bash
pnpm install
```

## Développement

```bash
# Lancer tous les sites
pnpm dev

# Lancer un site spécifique
pnpm dev --filter=da-agency
pnpm dev --filter=cocktails
pnpm dev --filter=production
```

## Build

```bash
# Build tous les sites
pnpm build

# Build un site spécifique
pnpm build --filter=da-agency
```

## Sanity Studio

Chaque application a son propre projet Sanity. Pour accéder au studio :
- DA Agency: http://localhost:3000/studio
- Cocktails: http://localhost:3001/studio
- Production: http://localhost:3002/studio

## Déploiement

Chaque site peut être déployé indépendamment sur Vercel.

