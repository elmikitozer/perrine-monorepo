# Guide d'Installation

## Prérequis

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommandé) ou npm/yarn

## Installation

### 1. Installer pnpm (si pas déjà installé)

```bash
npm install -g pnpm
```

### 2. Installer les dépendances

À la racine du projet :

```bash
pnpm install
```

Cela installera toutes les dépendances pour :
- Les 3 applications (da-agency, cocktails, production)
- Les packages partagés (ui, tsconfig)

### 3. Configuration Sanity

Vous devez créer 3 projets Sanity séparés (un par application).

#### Pour chaque application :

1. **Créer un projet Sanity** sur [sanity.io](https://www.sanity.io/)

2. **Copier `.env.local.example` vers `.env.local`** dans chaque app :

```bash
# DA Agency
cp apps/da-agency/.env.local.example apps/da-agency/.env.local

# Cocktails
cp apps/cocktails/.env.local.example apps/cocktails/.env.local

# Production
cp apps/production/.env.local.example apps/production/.env.local
```

3. **Configurer les variables d'environnement** :

Éditez chaque fichier `.env.local` avec vos identifiants Sanity :

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="votre-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
```

#### Obtenir votre Project ID :

1. Allez sur [sanity.io/manage](https://www.sanity.io/manage)
2. Créez un nouveau projet (ou utilisez un existant)
3. Le Project ID est visible sur le dashboard

#### Créer le dataset :

```bash
# DA Agency
cd apps/da-agency
npx sanity dataset create production

# Cocktails
cd ../cocktails
npx sanity dataset create production

# Production
cd ../production
npx sanity dataset create production
```

## Démarrage

### Lancer tous les sites en même temps

```bash
pnpm dev
```

Cela démarre :
- **DA Agency** : http://localhost:3000
- **Cocktails** : http://localhost:3001
- **Production** : http://localhost:3002

### Lancer un site spécifique

```bash
# DA Agency uniquement
pnpm dev --filter=da-agency

# Cocktails uniquement
pnpm dev --filter=cocktails

# Production uniquement
pnpm dev --filter=production
```

## Accéder au Sanity Studio

Chaque application a son propre studio Sanity :

- **DA Agency** : http://localhost:3000/studio
- **Cocktails** : http://localhost:3001/studio
- **Production** : http://localhost:3002/studio

### Première connexion au Studio

1. Visitez l'URL du studio (ex: http://localhost:3000/studio)
2. Vous serez redirigé vers Sanity pour vous authentifier
3. Une fois authentifié, vous pourrez gérer le contenu

## Build pour production

```bash
# Build tous les sites
pnpm build

# Build un site spécifique
pnpm build --filter=da-agency
```

## Déploiement

### Vercel (recommandé)

Chaque application peut être déployée séparément sur Vercel :

1. **Installer Vercel CLI** :
```bash
npm i -g vercel
```

2. **Déployer une app** :
```bash
cd apps/da-agency
vercel
```

3. **Configurer les variables d'environnement** dans Vercel :
   - Allez sur votre projet Vercel
   - Settings > Environment Variables
   - Ajoutez vos variables Sanity

### Variables d'environnement pour Vercel

Pour chaque projet, ajoutez :
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

## Structure du projet

```
perrine/
├── apps/
│   ├── da-agency/          # Site Direction Artistique
│   │   ├── src/
│   │   │   ├── app/        # Pages Next.js
│   │   │   └── sanity/     # Schémas Sanity
│   │   └── package.json
│   │
│   ├── cocktails/          # Site Recettes
│   │   ├── src/
│   │   │   ├── app/
│   │   │   └── sanity/
│   │   └── package.json
│   │
│   └── production/         # Site Production
│       ├── src/
│       │   ├── app/
│       │   └── sanity/
│       └── package.json
│
├── packages/
│   ├── ui/                 # Composants partagés
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── ContactForm.tsx
│   │
│   └── tsconfig/           # Configs TypeScript
│
├── package.json
└── turbo.json
```

## Commandes utiles

```bash
# Installer les dépendances
pnpm install

# Développement
pnpm dev

# Build
pnpm build

# Linter
pnpm lint

# Nettoyer
pnpm clean

# Formatter le code
pnpm format
```

## Résolution de problèmes

### Les composants @perrine/ui ne fonctionnent pas

Assurez-vous d'avoir installé toutes les dépendances :
```bash
pnpm install
```

### Erreur de connexion Sanity

1. Vérifiez que vos variables d'environnement sont correctes
2. Vérifiez que le dataset existe
3. Vérifiez que vous êtes authentifié : visitez le /studio

### Port déjà utilisé

Si un port est déjà utilisé, vous pouvez changer le port :
```bash
cd apps/da-agency
pnpm dev -- -p 3010
```

## Support

Pour toute question, consultez :
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Sanity](https://www.sanity.io/docs)
- [Documentation Turbo](https://turbo.build/repo/docs)

