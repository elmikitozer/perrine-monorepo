# 🚀 Quick Start Guide

Guide rapide pour démarrer avec les 3 sites en 5 minutes !

## En bref

Ce monorepo contient **3 sites Next.js indépendants** avec **Sanity CMS** :

1. **DA Agency** (Port 3000) - Site de Direction Artistique
2. **Cocktails** (Port 3001) - Site de recettes de cocktails
3. **Production** (Port 3002) - Site de production audiovisuelle

## Installation rapide (5 étapes)

### 1️⃣ Installer pnpm

```bash
npm install -g pnpm
```

### 2️⃣ Installer les dépendances

```bash
cd /Users/mikayay/Documents/Pro/perrine
pnpm install
```

### 3️⃣ Créer les projets Sanity

Allez sur [sanity.io/manage](https://www.sanity.io/manage) et créez **3 projets** :
- `Perrine DA Agency`
- `Perrine Cocktails`
- `Perrine Production`

Notez les **Project IDs** de chacun.

### 4️⃣ Configurer les variables d'environnement

Pour chaque app, créez un fichier `.env.local` :

```bash
# DA Agency
cat > apps/da-agency/.env.local << EOF
NEXT_PUBLIC_SANITY_PROJECT_ID="votre-project-id-da"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
EOF

# Cocktails
cat > apps/cocktails/.env.local << EOF
NEXT_PUBLIC_SANITY_PROJECT_ID="votre-project-id-cocktails"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
EOF

# Production
cat > apps/production/.env.local << EOF
NEXT_PUBLIC_SANITY_PROJECT_ID="votre-project-id-production"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
EOF
```

**⚠️ Remplacez `votre-project-id-xxx` par vos vrais Project IDs !**

### 5️⃣ Lancer les sites

```bash
pnpm dev
```

**C'est tout ! 🎉**

Les sites sont maintenant accessibles :
- **DA Agency** : http://localhost:3000
- **Cocktails** : http://localhost:3001
- **Production** : http://localhost:3002

## Accéder au Sanity Studio

Pour gérer le contenu de chaque site :

- **DA Agency Studio** : http://localhost:3000/studio
- **Cocktails Studio** : http://localhost:3001/studio
- **Production Studio** : http://localhost:3002/studio

À la première visite, vous serez redirigé vers Sanity pour vous authentifier.

## Ajouter du contenu de test

### DA Agency

1. Allez sur http://localhost:3000/studio
2. Créez un **Service** :
   - Titre : "Branding"
   - Description : "Création d'identité visuelle"
   - Icône : "🎨"
3. Créez un **Projet** :
   - Titre : "Mon premier projet"
   - Client : "Client Test"
   - Catégorie : "Branding"
   - ✅ Cochez "Projet mis en avant"
4. Créez une **Page** avec slug "home" :
   - Titre : "Accueil"
   - Hero > Titre principal : "Direction Artistique & Design"
   - Hero > Sous-titre : "Création d'identités visuelles uniques"

### Cocktails

1. Allez sur http://localhost:3001/studio
2. Créez une **Catégorie** :
   - Nom : "Classiques"
3. Créez une **Recette** :
   - Nom : "Mojito"
   - Description : "Cocktail cubain rafraîchissant"
   - Difficulté : "Facile"
   - Temps : 5 minutes
   - Portions : 1
   - Ingrédients :
     * Rhum blanc - 6 cl
     * Citron vert - 1 pièce
     * Menthe - 10 feuilles
   - ✅ Cochez "Recette mise en avant"

### Production

1. Allez sur http://localhost:3002/studio
2. Créez un **Service** :
   - Titre : "Production Vidéo"
   - Description : "Création de contenus vidéo professionnels"
   - Icône : "🎥"
3. Créez un **Projet** :
   - Titre : "Vidéo Corporate"
   - Client : "Entreprise XYZ"
   - Catégorie : "Vidéo"
   - ✅ Cochez "Projet mis en avant"

## Commandes utiles

```bash
# Lancer tous les sites
pnpm dev

# Lancer un seul site
pnpm dev --filter=da-agency
pnpm dev --filter=cocktails
pnpm dev --filter=production

# Build pour production
pnpm build

# Linter
pnpm lint

# Nettoyer
pnpm clean
```

## Structure du projet

```
perrine/
├── apps/
│   ├── da-agency/      # 🎨 Site DA (port 3000)
│   ├── cocktails/      # 🍸 Site Cocktails (port 3001)
│   └── production/     # 🎬 Site Production (port 3002)
│
├── packages/
│   ├── ui/            # Composants partagés
│   └── tsconfig/      # Configs TypeScript
│
└── [fichiers config]
```

## Prochaines étapes

✅ **Installation complète** → Voir [INSTALLATION.md](./INSTALLATION.md)
✅ **Configuration Sanity** → Voir [SANITY_SETUP.md](./SANITY_SETUP.md)
✅ **Personnalisation** → Voir [CUSTOMIZATION.md](./CUSTOMIZATION.md)
✅ **Déploiement** → Voir [DEPLOYMENT.md](./DEPLOYMENT.md)

## Problèmes courants

### "Invalid project ID"
➡️ Vérifiez que vous avez bien remplacé les Project IDs dans les `.env.local`

### "Port already in use"
➡️ Un autre processus utilise le port. Changez le port :
```bash
cd apps/da-agency
pnpm dev -- -p 3010
```

### "Module not found: @perrine/ui"
➡️ Réinstallez les dépendances :
```bash
pnpm install
```

### Le studio ne charge pas
➡️ Vérifiez que :
1. Le fichier `.env.local` existe
2. Le Project ID est correct
3. Vous avez redémarré le serveur après avoir créé `.env.local`

## Support

📚 [Documentation complète](./README.md)
🐛 [Résolution de problèmes](./INSTALLATION.md#résolution-de-problèmes)
💬 [Issues GitHub](https://github.com/votre-repo/issues)

---

**Bon développement ! 🚀**

