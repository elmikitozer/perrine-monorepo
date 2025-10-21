# Configuration Sanity - Guide Détaillé

Ce guide vous explique comment configurer Sanity pour les 3 sites.

## Vue d'ensemble

Chaque site a son propre projet Sanity avec des schémas personnalisés :

- **DA Agency** : Projets, Services, Pages
- **Cocktails** : Recettes, Catégories, Pages
- **Production** : Projets, Services, Témoignages, Pages

## Étape 1 : Créer les projets Sanity

### Option 1 : Via l'interface web (Recommandé)

1. Allez sur [sanity.io/manage](https://www.sanity.io/manage)
2. Cliquez sur "Create project"
3. Créez 3 projets :
   - `Perrine DA Agency`
   - `Perrine Cocktails`
   - `Perrine Production`
4. Notez le **Project ID** de chaque projet

### Option 2 : Via la CLI

```bash
# Installer Sanity CLI
npm install -g @sanity/cli

# Se connecter
sanity login

# Créer les projets
sanity init --project da-agency --dataset production
sanity init --project cocktails --dataset production
sanity init --project production --dataset production
```

## Étape 2 : Configuration des fichiers .env.local

Pour chaque application, créez un fichier `.env.local` :

### DA Agency (.env.local)

```bash
cd apps/da-agency
cp .env.local.example .env.local
```

Éditez `apps/da-agency/.env.local` :
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="votre-project-id-da"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
```

### Cocktails (.env.local)

```bash
cd apps/cocktails
cp .env.local.example .env.local
```

Éditez `apps/cocktails/.env.local` :
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="votre-project-id-cocktails"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
```

### Production (.env.local)

```bash
cd apps/production
cp .env.local.example .env.local
```

Éditez `apps/production/.env.local` :
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="votre-project-id-production"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
```

## Étape 3 : Déployer les schémas Sanity

Pour chaque application, déployez les schémas :

```bash
# DA Agency
cd apps/da-agency
npx sanity deploy

# Cocktails
cd apps/cocktails
npx sanity deploy

# Production
cd apps/production
npx sanity deploy
```

## Étape 4 : Configurer CORS

Pour que Next.js puisse communiquer avec Sanity :

1. Allez sur [sanity.io/manage](https://www.sanity.io/manage)
2. Sélectionnez votre projet
3. Allez dans **API** > **CORS Origins**
4. Ajoutez vos origines :
   - `http://localhost:3000` (DA Agency)
   - `http://localhost:3001` (Cocktails)
   - `http://localhost:3002` (Production)
   - Vos domaines de production (ex: `https://perrine-da.vercel.app`)

Cochez **Allow credentials**

## Étape 5 : Premier accès au Studio

1. Démarrez l'application :
```bash
cd apps/da-agency
pnpm dev
```

2. Visitez http://localhost:3000/studio

3. Vous serez redirigé vers Sanity pour vous authentifier

4. Une fois connecté, vous verrez l'interface Sanity Studio

## Schémas disponibles par application

### DA Agency

#### Project (Projet)
- Titre, slug, description
- Image principale + galerie
- Client, année, catégorie
- Option "mis en avant"

#### Service
- Titre, description
- Icône (emoji)
- Ordre d'affichage

#### Page
- Titre, slug
- Section hero (titre + sous-titre)
- Contenu riche
- SEO (meta title, description)

### Cocktails

#### Recipe (Recette)
- Nom, slug, description
- Histoire/origine
- Photo
- Catégorie, difficulté
- Temps de préparation, portions
- **Ingrédients** (tableau avec quantité + unité)
- **Instructions** (contenu riche)
- Conseils, type de verre, décoration
- Option "mis en avant"

#### Category (Catégorie)
- Nom, slug, description

#### Page
- Titre, slug
- Section hero
- Contenu riche

### Production

#### ProjectProduction (Projet)
- Titre, slug, description
- Image principale + galerie
- URL vidéo
- Client, année, catégorie
- Tags
- Option "mis en avant"

#### Service
- Titre, description courte et détaillée
- Icône
- Caractéristiques (liste)
- Ordre d'affichage

#### Testimonial (Témoignage)
- Auteur, fonction/entreprise
- Contenu
- Photo
- Note (sur 5)

#### Page
- Titre, slug
- Section hero
- Contenu riche

## Ajouter du contenu de test

### DA Agency - Exemple de projet

```json
{
  "title": "Rebranding Café Moderne",
  "client": "Café Moderne",
  "description": "Refonte complète de l'identité visuelle",
  "category": "branding",
  "year": 2024,
  "featured": true
}
```

### Cocktails - Exemple de recette

```json
{
  "name": "Mojito Classique",
  "description": "Le cocktail cubain rafraîchissant par excellence",
  "difficulty": "easy",
  "prepTime": 5,
  "servings": 1,
  "ingredients": [
    { "ingredient": "Rhum blanc", "quantity": "6", "unit": "cl" },
    { "ingredient": "Citron vert", "quantity": "1", "unit": "pièce" },
    { "ingredient": "Menthe fraîche", "quantity": "10", "unit": "feuilles" },
    { "ingredient": "Sucre", "quantity": "2", "unit": "cuillère" },
    { "ingredient": "Eau gazeuse", "quantity": "au goût", "unit": "ml" }
  ],
  "glass": "Verre highball",
  "garnish": "Menthe fraîche et citron vert",
  "featured": true
}
```

### Production - Exemple de service

```json
{
  "title": "Production Vidéo",
  "description": "Création de contenus vidéo professionnels",
  "icon": "🎥",
  "features": [
    "Tournage en 4K",
    "Équipe complète",
    "Post-production incluse",
    "Livraison rapide"
  ],
  "order": 1
}
```

## Déployer le Studio en production

Pour déployer le Sanity Studio séparément (optionnel) :

```bash
cd apps/da-agency
npx sanity deploy
```

Cela créera un studio accessible à : `https://votre-projet.sanity.studio`

**Note** : Avec Next.js, le studio est déjà accessible via `/studio` sur chaque site, donc cette étape n'est pas nécessaire.

## Tokens d'API (Optionnel)

Si vous avez besoin de tokens pour des opérations spéciales :

1. Allez sur [sanity.io/manage](https://www.sanity.io/manage)
2. Sélectionnez votre projet
3. **API** > **Tokens**
4. Créez un token avec les permissions nécessaires
5. Ajoutez-le à `.env.local` :
   ```env
   SANITY_API_READ_TOKEN="votre-token"
   ```

## Webhooks (Optionnel)

Pour revalider Next.js quand le contenu change :

1. Dans Sanity : **API** > **Webhooks**
2. Créez un webhook pointant vers :
   ```
   https://votre-site.com/api/revalidate
   ```
3. Sélectionnez les événements (create, update, delete)

## Résolution de problèmes

### "Invalid project ID"
- Vérifiez que le Project ID est correct dans `.env.local`
- Vérifiez qu'il n'y a pas d'espaces ou de guillemets supplémentaires

### "CORS error"
- Ajoutez votre origine dans la configuration CORS de Sanity
- N'oubliez pas de cocher "Allow credentials"

### "Schema not found"
- Assurez-vous d'avoir déployé les schémas : `npx sanity deploy`
- Redémarrez le serveur de développement

### Le studio ne charge pas
- Vérifiez que toutes les dépendances sont installées : `pnpm install`
- Vérifiez que le fichier `.env.local` existe et est correctement configuré

## Ressources

- [Documentation Sanity](https://www.sanity.io/docs)
- [Sanity + Next.js Guide](https://www.sanity.io/docs/nextjs)
- [Dashboard Sanity](https://www.sanity.io/manage)

