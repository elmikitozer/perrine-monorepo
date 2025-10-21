# Versions & Compatibilité

Ce document liste toutes les versions des packages utilisés dans le monorepo.
Ces versions ont été testées ensemble et sont **100% compatibles**.

## Stack Principale

| Package | Version | Notes |
|---------|---------|-------|
| Node.js | >= 18.0.0 | Requis |
| pnpm | >= 8.0.0 | Recommandé |
| Next.js | 14.2.5 | App Router |
| React | 18.3.1 | |
| React DOM | 18.3.1 | |
| TypeScript | 5.5.4 | |

## CMS & Content

| Package | Version | Notes |
|---------|---------|-------|
| Sanity | 3.58.0 | CMS headless |
| @sanity/vision | 3.58.0 | Vision tool pour le studio |
| @sanity/image-url | 1.0.2 | Helper pour images Sanity |
| next-sanity | 9.5.0 | Intégration Next.js |

## Styling

| Package | Version | Notes |
|---------|---------|-------|
| Tailwind CSS | 3.4.1 | Framework CSS |
| PostCSS | 8.4.39 | Processeur CSS |
| Autoprefixer | 10.4.19 | Préfixes automatiques |

## Development Tools

| Package | Version | Notes |
|---------|---------|-------|
| Turbo | 2.0.12 | Build system monorepo |
| ESLint | 8.57.0 | Linter |
| Prettier | 3.2.5 | Formatter |
| eslint-config-next | 14.2.5 | Config ESLint pour Next.js |

## Types TypeScript

| Package | Version | Notes |
|---------|---------|-------|
| @types/node | 20.14.11 | Types Node.js |
| @types/react | 18.3.3 | Types React |
| @types/react-dom | 18.3.0 | Types React DOM |

## Pourquoi ces versions ?

### Next.js 14.2.5
- ✅ App Router stable
- ✅ Server Components par défaut
- ✅ Excellentes performances
- ✅ Compatible avec Sanity 3.x

### React 18.3.1
- ✅ Dernière version stable
- ✅ Support des Server Components
- ✅ Concurrent features

### Sanity 3.58.0
- ✅ Version V3 stable
- ✅ Meilleure DX (Developer Experience)
- ✅ Studio intégré dans Next.js
- ✅ Compatible avec next-sanity 9.x

### TypeScript 5.5.4
- ✅ Dernière version stable
- ✅ Meilleur support des Server Components
- ✅ Performance améliorée

### Tailwind CSS 3.4.1
- ✅ Version stable
- ✅ Support des couleurs modernes
- ✅ Excellente intégration Next.js

## Compatibilité entre packages clés

### Next.js ↔ Sanity
```json
{
  "next": "14.2.5",
  "sanity": "3.58.0",
  "next-sanity": "9.5.0"  // ← Compatible avec les deux
}
```

### React ↔ Next.js
```json
{
  "next": "14.2.5",       // Requiert React 18.x
  "react": "18.3.1",
  "react-dom": "18.3.1"
}
```

### TypeScript ↔ Next.js
```json
{
  "next": "14.2.5",       // Compatible avec TS 5.x
  "typescript": "5.5.4"
}
```

### Tailwind ↔ Next.js
```json
{
  "next": "14.2.5",
  "tailwindcss": "3.4.1",
  "postcss": "8.4.39",
  "autoprefixer": "10.4.19"
}
```

## Package.json complet (apps)

Voici le `package.json` type pour chaque application :

```json
{
  "name": "app-name",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@perrine/ui": "workspace:*",
    "@sanity/image-url": "^1.0.2",
    "@sanity/vision": "^3.58.0",
    "next": "14.2.5",
    "next-sanity": "^9.5.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "sanity": "^3.58.0"
  },
  "devDependencies": {
    "@perrine/tsconfig": "workspace:*",
    "@types/node": "^20.14.11",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.4"
  }
}
```

## Mise à jour des packages

### Vérifier les mises à jour

```bash
# À la racine
pnpm outdated

# Pour une app spécifique
cd apps/da-agency
pnpm outdated
```

### Mettre à jour prudemment

⚠️ **Important** : Ne mettez pas à jour tous les packages d'un coup !

#### Ordre de mise à jour recommandé :

1. **Minor updates** (ex: 3.58.0 → 3.59.0)
   ```bash
   pnpm update --latest --filter=da-agency
   ```

2. **Testez** après chaque mise à jour
   ```bash
   pnpm build
   pnpm dev
   ```

3. **Major updates** (ex: 3.x → 4.x)
   - Lisez TOUJOURS les CHANGELOG
   - Testez dans une branche séparée
   - Vérifiez les breaking changes

### Packages à surveiller

| Package | Fréquence update | Risque |
|---------|------------------|--------|
| Next.js | Mensuel | Moyen (lire changelog) |
| React | Rare | Faible (stable) |
| Sanity | Mensuel | Faible (bons migrations) |
| TypeScript | Trimestriel | Faible |
| Tailwind | Rare | Faible |

## Breaking Changes à surveiller

### Next.js 14 → 15
- App Router changes possibles
- Nouvelles API de cache
- Vérifier la compatibilité Sanity

### React 18 → 19 (futur)
- Nouvelles API Suspense
- Changes dans les Server Components

### Sanity 3 → 4 (futur)
- Suivre les guides de migration officiels
- Tester le studio en local d'abord

## Vérifier la compatibilité d'un package

Avant d'ajouter un nouveau package :

1. **Vérifier la compatibilité avec React 18** :
   ```bash
   npm info package-name peerDependencies
   ```

2. **Vérifier la compatibilité avec Next.js 14** :
   - Consulter la doc du package
   - Chercher "Next.js 14" dans les issues GitHub

3. **Tester en local** avant de déployer

## Ressources

- [Next.js Releases](https://github.com/vercel/next.js/releases)
- [Sanity Releases](https://github.com/sanity-io/sanity/releases)
- [React Releases](https://github.com/facebook/react/releases)
- [Tailwind Releases](https://github.com/tailwindlabs/tailwindcss/releases)

## Dernière vérification

Date : **21 Octobre 2024**
Status : ✅ **Toutes les versions sont compatibles et testées**

---

**Note** : Ce fichier est mis à jour à chaque changement de version majeure.

