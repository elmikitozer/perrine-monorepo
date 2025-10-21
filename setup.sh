#!/bin/bash

# Script d'installation automatique pour le monorepo Perrine
# Usage: ./setup.sh

set -e

echo "🚀 Installation du monorepo Perrine"
echo "===================================="
echo ""

# Vérifier Node.js
echo "📦 Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "➡️  Installez Node.js >= 18.0.0 depuis https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version >= 18 requise (vous avez: $(node -v))"
    exit 1
fi
echo "✅ Node.js $(node -v) détecté"
echo ""

# Vérifier/Installer pnpm
echo "📦 Vérification de pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚙️  Installation de pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v) détecté"
echo ""

# Installer les dépendances
echo "📥 Installation des dépendances..."
pnpm install
echo "✅ Dépendances installées"
echo ""

# Créer les fichiers .env.local si inexistants
echo "🔧 Configuration des variables d'environnement..."

create_env_file() {
    local APP=$1
    local ENV_FILE="apps/$APP/.env.local"

    if [ ! -f "$ENV_FILE" ]; then
        echo "📝 Création de $ENV_FILE"
        cat > "$ENV_FILE" << 'EOF'
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-21"
EOF
        echo "⚠️  N'oubliez pas de modifier $ENV_FILE avec votre Project ID Sanity !"
    else
        echo "✅ $ENV_FILE existe déjà"
    fi
}

create_env_file "da-agency"
create_env_file "cocktails"
create_env_file "production"

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Installation réussie !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1. Créer 3 projets Sanity sur https://sanity.io/manage"
echo "   - Perrine DA Agency"
echo "   - Perrine Cocktails"
echo "   - Perrine Production"
echo ""
echo "2. Configurer les Project IDs dans les fichiers .env.local :"
echo "   - apps/da-agency/.env.local"
echo "   - apps/cocktails/.env.local"
echo "   - apps/production/.env.local"
echo ""
echo "3. Lancer le projet :"
echo "   pnpm dev"
echo ""
echo "4. Visiter les sites :"
echo "   - DA Agency:  http://localhost:3000"
echo "   - Cocktails:  http://localhost:3001"
echo "   - Production: http://localhost:3002"
echo ""
echo "5. Accéder aux studios Sanity :"
echo "   - DA Agency:  http://localhost:3000/studio"
echo "   - Cocktails:  http://localhost:3001/studio"
echo "   - Production: http://localhost:3002/studio"
echo ""
echo "📚 Documentation complète : README.md"
echo "⚡ Démarrage rapide : QUICK_START.md"
echo ""

