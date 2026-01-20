#!/bin/bash
# Script de configuration automatique EAS avec connexion interactive

echo "🚀 Configuration automatique d'EAS pour TwoRead"
echo ""

# Vérifier EAS CLI
if ! command -v eas &> /dev/null; then
    echo "📦 Installation d'EAS CLI..."
    npm install -g eas-cli
fi

# Se connecter (nécessite interaction)
echo "🔐 Connexion à Expo..."
eas login

# Vérifier la connexion
if eas whoami &> /dev/null; then
    echo "✅ Connecté !"
    eas whoami
    echo ""
    
    # Initialiser EAS
    echo "📦 Initialisation d'EAS..."
    eas init --non-interactive 2>/dev/null || eas init
    
    # Configurer les secrets
    echo ""
    echo "🔐 Configuration des secrets..."
    
    SUPABASE_URL="https://cuzxuckeixsvommxfodz.supabase.co"
    SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0"
    
    eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "$SUPABASE_URL" --force 2>/dev/null || true
    eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "$SUPABASE_ANON_KEY" --force 2>/dev/null || true
    
    echo ""
    echo "✅ Secrets configurés !"
    echo ""
    echo "📋 Liste des secrets :"
    eas secret:list
    
    echo ""
    echo "🎉 Configuration terminée !"
else
    echo "❌ Échec de la connexion"
    exit 1
fi
