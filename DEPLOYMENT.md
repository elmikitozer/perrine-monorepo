# Guide de Déploiement

Ce guide explique comment déployer les 3 sites sur Vercel.

## Prérequis

- Compte Vercel ([vercel.com](https://vercel.com))
- Projets Sanity configurés et IDs disponibles
- Code poussé sur un repository Git (GitHub, GitLab, Bitbucket)

## Option 1 : Déploiement via l'interface Vercel (Recommandé)

### 1. Créer 3 projets Vercel

Pour chaque site, créez un projet séparé sur Vercel :

#### DA Agency

1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Importez votre repository
3. **Configurez le projet :**
   - **Project Name** : `perrine-da-agency`
   - **Framework Preset** : Next.js
   - **Root Directory** : `apps/da-agency`
   - **Build Command** : `cd ../.. && pnpm build --filter=da-agency`
   - **Install Command** : `cd ../.. && pnpm install`
   - **Output Directory** : `.next` (par défaut)

4. **Variables d'environnement :**
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=votre-project-id-da
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-10-21
   ```

5. Cliquez sur **Deploy**

#### Cocktails

Répétez les étapes ci-dessus avec :
- **Project Name** : `perrine-cocktails`
- **Root Directory** : `apps/cocktails`
- **Build Command** : `cd ../.. && pnpm build --filter=cocktails`
- **Variables d'environnement** avec le Project ID Cocktails

#### Production

Répétez les étapes avec :
- **Project Name** : `perrine-production`
- **Root Directory** : `apps/production`
- **Build Command** : `cd ../.. && pnpm build --filter=production`
- **Variables d'environnement** avec le Project ID Production

### 2. Configurer les domaines (Optionnel)

Pour chaque projet Vercel :

1. Allez dans **Settings** > **Domains**
2. Ajoutez votre domaine personnalisé :
   - DA Agency : `perrine-da.com`
   - Cocktails : `cocktails-recettes.com`
   - Production : `production-studio.com`

### 3. Configurer CORS dans Sanity

Pour chaque projet Sanity :

1. Allez sur [sanity.io/manage](https://www.sanity.io/manage)
2. Sélectionnez le projet
3. **API** > **CORS Origins**
4. Ajoutez les URLs de production :
   - `https://votre-site.vercel.app`
   - `https://votre-domaine-personnalise.com`
   - Cochez **Allow credentials**

## Option 2 : Déploiement via CLI

### 1. Installer Vercel CLI

```bash
npm i -g vercel
```

### 2. Se connecter

```bash
vercel login
```

### 3. Déployer chaque application

#### DA Agency

```bash
cd apps/da-agency
vercel

# Suivez les prompts :
# - Link to existing project? No
# - Project name? perrine-da-agency
# - Root directory? apps/da-agency
```

Ajoutez les variables d'environnement :
```bash
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID
# Entrez la valeur pour Production
# Répétez pour Development et Preview

vercel env add NEXT_PUBLIC_SANITY_DATASET
# Entrez "production" pour tous les environnements

vercel env add NEXT_PUBLIC_SANITY_API_VERSION
# Entrez "2024-10-21" pour tous les environnements
```

Redéployez avec les variables :
```bash
vercel --prod
```

#### Cocktails et Production

Répétez les étapes pour chaque application.

## Configuration Monorepo sur Vercel

### vercel.json (à la racine)

Ce fichier n'est pas strictement nécessaire avec la configuration ci-dessus, mais vous pouvez l'ajouter pour plus de contrôle :

```json
{
  "version": 2,
  "buildCommand": "pnpm build --filter=${VERCEL_GIT_COMMIT_REF}",
  "installCommand": "pnpm install"
}
```

### Optimisations

#### 1. Ignorer les builds inutiles

Créez `vercel.json` dans chaque app pour n'ignorer les builds que si les fichiers de cette app n'ont pas changé :

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "ignoreCommand": "bash -c 'if [ \"$VERCEL_ENV\" == \"production\" ] && git diff HEAD^ HEAD --quiet -- ../../apps/da-agency; then exit 1; else exit 0; fi'"
}
```

#### 2. Caching

Vercel met automatiquement en cache :
- Les `node_modules`
- Le cache Next.js
- Les builds Turbo

## Variables d'environnement

### Variables requises pour chaque projet

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=votre-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-21
```

### Variables optionnelles

```env
# Analytics (exemple)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Tokens Sanity (si nécessaire)
SANITY_API_READ_TOKEN=votre-token

# Email (si vous ajoutez un formulaire de contact)
SENDGRID_API_KEY=votre-api-key
CONTACT_EMAIL=contact@votre-domaine.com
```

## Webhooks Sanity → Vercel

Pour revalider automatiquement quand le contenu change dans Sanity :

### 1. Créer une API Route de revalidation

```typescript
// apps/da-agency/src/app/api/revalidate/route.ts

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Vérifier le secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // Revalider toutes les pages
    revalidatePath('/', 'layout');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
```

### 2. Ajouter le secret dans Vercel

```bash
vercel env add REVALIDATION_SECRET
# Entrez un secret fort (ex: generé avec openssl rand -base64 32)
```

### 3. Configurer le Webhook dans Sanity

1. Allez sur [sanity.io/manage](https://www.sanity.io/manage)
2. Sélectionnez votre projet
3. **API** > **Webhooks**
4. Créez un nouveau webhook :
   - **Name** : Vercel Revalidation
   - **URL** : `https://votre-site.vercel.app/api/revalidate?secret=votre-secret`
   - **Dataset** : production
   - **Trigger on** : Create, Update, Delete
   - **Filter** : (laisser vide pour tout revalider)

5. Testez le webhook

## Monitoring et Analytics

### 1. Vercel Analytics

Activez Analytics dans chaque projet Vercel :

1. Allez dans **Analytics** sur le dashboard Vercel
2. Activez **Web Analytics**

Ajoutez dans votre layout :
```typescript
// apps/da-agency/src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Speed Insights

Pour les Core Web Vitals :

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## Domaines personnalisés

### Configuration DNS

Pour chaque domaine :

1. **Vercel** :
   - Allez dans **Settings** > **Domains**
   - Ajoutez votre domaine
   - Vercel vous donnera les enregistrements DNS à ajouter

2. **Chez votre registrar** (ex: OVH, Gandi, etc.) :
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. Attendez la propagation DNS (peut prendre jusqu'à 24h)

### Certificats SSL

Vercel génère automatiquement des certificats SSL avec Let's Encrypt.

## CI/CD

### Déploiement automatique

Par défaut, Vercel déploie automatiquement :
- **Production** : Quand vous poussez sur la branche `main`
- **Preview** : Pour chaque Pull Request

### Protéger les branches

Dans GitHub :
1. **Settings** > **Branches** > **Branch protection rules**
2. Protégez la branche `main` :
   - Require status checks (Vercel)
   - Require review before merging

## Rollback

Si un déploiement pose problème :

1. Allez sur le dashboard Vercel
2. **Deployments**
3. Trouvez le dernier déploiement fonctionnel
4. Cliquez sur les 3 points > **Promote to Production**

## Commandes utiles

```bash
# Déployer en preview
vercel

# Déployer en production
vercel --prod

# Lister les déploiements
vercel ls

# Voir les logs
vercel logs [deployment-url]

# Supprimer un déploiement
vercel remove [deployment-name]
```

## Checklist de déploiement

Avant de déployer en production :

- [ ] Tous les tests passent localement
- [ ] Variables d'environnement configurées
- [ ] CORS Sanity configuré avec les URLs de production
- [ ] Domaines personnalisés configurés (si applicable)
- [ ] Analytics activés
- [ ] Webhooks Sanity configurés
- [ ] Metadata SEO vérifiés
- [ ] Images optimisées
- [ ] Favicon et assets mis à jour

## Coûts

### Vercel

- **Hobby (Gratuit)** :
  - 100 GB de bande passante
  - Domaines illimités
  - Parfait pour commencer

- **Pro ($20/mois)** :
  - 1 TB de bande passante
  - Analytics avancés
  - Protection par mot de passe

### Sanity

- **Free** :
  - 3 utilisateurs
  - 10k documents
  - 5 GB assets
  - Parfait pour des sites vitrines

- **Growth ($99/mois)** :
  - 15 utilisateurs
  - 500k documents
  - 100 GB assets

## Support

En cas de problème :

- [Documentation Vercel](https://vercel.com/docs)
- [Support Vercel](https://vercel.com/support)
- [Communauté Vercel](https://github.com/vercel/vercel/discussions)
- [Documentation Sanity](https://www.sanity.io/docs)

