# Guide de Contribution

Merci de votre intérêt pour contribuer à ce projet !

## Workflow Git

### Branches

- `main` : Production, toujours stable
- `develop` : Développement, intégration des features
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `docs/*` : Documentation

### Créer une nouvelle feature

```bash
# Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/nom-de-la-feature

# Faire vos modifications
git add .
git commit -m "feat: description de la feature"

# Pousser
git push origin feature/nom-de-la-feature

# Créer une Pull Request sur GitHub
```

## Conventions de Code

### Commits

Suivre les [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
feat: ajout d'une nouvelle fonctionnalité
fix: correction d'un bug
docs: mise à jour de la documentation
style: formatage du code (sans changement de logique)
refactor: refactoring du code
test: ajout ou modification de tests
chore: tâches de maintenance
```

**Exemples** :
```bash
git commit -m "feat(da-agency): ajouter page à propos"
git commit -m "fix(cocktails): corriger affichage des ingrédients"
git commit -m "docs: mettre à jour INSTALLATION.md"
```

### Code Style

#### TypeScript/JavaScript

```typescript
// ✅ Bon
interface ProjectProps {
  title: string;
  description?: string;
}

export const Project: React.FC<ProjectProps> = ({ title, description }) => {
  return (
    <div className="project">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};

// ❌ Mauvais
export const Project = (props: any) => {
  return <div className="project"><h2>{props.title}</h2></div>
}
```

#### Naming

- **Components** : PascalCase (`Button`, `ContactForm`)
- **Functions** : camelCase (`getData`, `handleSubmit`)
- **Files** : PascalCase pour composants (`Button.tsx`), camelCase pour utilitaires (`utils.ts`)
- **CSS Classes** : kebab-case via Tailwind

### Structure des fichiers

```typescript
// 1. Imports externes
import React from 'react';
import { useState } from 'react';
import Link from 'next/link';

// 2. Imports internes
import { Button } from '@perrine/ui';
import { client } from '@/sanity/lib/client';

// 3. Types
interface ComponentProps {
  // ...
}

// 4. Composant
export default function Component({ }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();

  // Functions
  const handleClick = () => {};

  // Render
  return <div>...</div>;
}
```

## Ajouter une Fonctionnalité

### 1. Nouveau composant partagé

```bash
# Créer le composant
touch packages/ui/src/MonComposant.tsx

# Ajouter l'export
# Dans packages/ui/src/index.tsx
export { MonComposant } from './MonComposant';
```

### 2. Nouveau schéma Sanity

```bash
# Créer le schéma
touch apps/da-agency/src/sanity/schemas/monSchema.ts

# Ajouter à l'index
# Dans apps/da-agency/src/sanity/schemas/index.ts
import { monSchema } from './monSchema';
export const schemaTypes = [..., monSchema];
```

### 3. Nouvelle page

```bash
# Créer la page
mkdir -p apps/da-agency/src/app/ma-page
touch apps/da-agency/src/app/ma-page/page.tsx
```

## Tests

### Avant de committer

```bash
# Vérifier le build
pnpm build

# Vérifier le linter
pnpm lint

# Formater le code
pnpm format
```

### Tester localement

```bash
# Lancer les sites
pnpm dev

# Tester chaque site
# - DA Agency: http://localhost:3000
# - Cocktails: http://localhost:3001
# - Production: http://localhost:3002
```

## Pull Requests

### Checklist avant PR

- [ ] Le code compile sans erreurs (`pnpm build`)
- [ ] Le linter passe (`pnpm lint`)
- [ ] Le code est formaté (`pnpm format`)
- [ ] Les 3 sites fonctionnent en local
- [ ] La documentation est à jour si nécessaire
- [ ] Les commits suivent les conventions

### Template de PR

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change
- [ ] Documentation

## Changements
- Liste des changements principaux
- ...

## Tests
Comment tester les changements

## Screenshots (si applicable)
```

## Structure du Projet

### Apps

```
apps/
├── da-agency/      # Ne touche que DA Agency
├── cocktails/      # Ne touche que Cocktails
└── production/     # Ne touche que Production
```

**Règle** : Les changements dans une app ne doivent pas affecter les autres.

### Packages

```
packages/
├── ui/            # Composants partagés
└── tsconfig/      # Configs TypeScript
```

**Règle** : Les changements dans `packages/ui` affectent toutes les apps. Tester les 3 apps après modification.

## Dépendances

### Ajouter une dépendance

```bash
# Pour une app spécifique
pnpm add --filter=da-agency package-name

# Pour toutes les apps
pnpm add -w package-name

# Pour le package UI
pnpm add --filter=@perrine/ui package-name
```

### Mettre à jour les dépendances

```bash
# Vérifier les mises à jour
pnpm outdated

# Mettre à jour (prudence !)
pnpm update

# Tester après mise à jour
pnpm build
```

## Résolution de Problèmes

### Cache Turbo

Si les builds sont étranges :

```bash
pnpm clean
rm -rf .turbo
pnpm install
pnpm build
```

### node_modules

Si les dépendances sont corrompues :

```bash
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### Next.js cache

```bash
rm -rf apps/*/.next
pnpm dev
```

## Documentation

### Mettre à jour la doc

Quand vous ajoutez une feature, mettez à jour :
- `README.md` si c'est une feature majeure
- `CUSTOMIZATION.md` si c'est personnalisable
- `INSTALLATION.md` si ça change l'installation
- `PROJECT_SUMMARY.md` si ça change l'architecture

### Documenter le code

```typescript
/**
 * Récupère les projets depuis Sanity
 * @param limit - Nombre max de projets
 * @returns Liste des projets
 */
async function getProjects(limit: number = 10) {
  // ...
}
```

## Sanity

### Modifier un schéma

1. Modifier le fichier schema
2. Redémarrer le serveur (`pnpm dev`)
3. Le studio se met à jour automatiquement
4. Tester dans le studio

### Déployer les schémas (optionnel)

```bash
cd apps/da-agency
npx sanity deploy
```

## Performance

### Optimisations à respecter

- ✅ Utiliser `Image` de Next.js pour les images
- ✅ Lazy load les composants lourds
- ✅ Utiliser les Server Components quand possible
- ✅ Minimiser le JavaScript côté client
- ✅ Optimiser les requêtes Sanity (pas de over-fetching)

### Vérifier la performance

```bash
# Build de production
pnpm build

# Analyser le bundle (ajouter dans package.json si besoin)
ANALYZE=true pnpm build
```

## Questions

Pour toute question :
1. Consulter la documentation
2. Vérifier les issues GitHub
3. Créer une nouvelle issue si nécessaire

## Code de Conduite

- Soyez respectueux
- Aidez les autres contributeurs
- Acceptez les critiques constructives
- Focalisez sur ce qui est meilleur pour le projet

---

Merci de contribuer ! 🙏

