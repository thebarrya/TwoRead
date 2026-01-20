#!/bin/bash
# Script pour configurer les secrets EAS (à exécuter après eas login)

set -e

echo "🔐 Configuration des secrets EAS pour TwoRead"
echo ""

# Vérifier la connexion
if ! eas whoami &> /dev/null; then
    echo "❌ Vous n'êtes pas connecté à Expo."
    echo "   Veuillez d'abord exécuter: eas login"
    exit 1
fi

echo "✅ Connecté à Expo"
eas whoami
echo ""

# Initialiser EAS si nécessaire
if [ ! -f "eas.json" ]; then
    echo "📦 Initialisation d'EAS..."
    eas init --non-interactive || eas init
    echo ""
fi

# Variables Supabase
SUPABASE_URL="https://cuzxuckeixsvommxfodz.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0"

# Configurer les secrets
echo "🔐 Configuration des secrets Supabase..."
echo ""

echo "   → EXPO_PUBLIC_SUPABASE_URL..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "$SUPABASE_URL" --force 2>/dev/null || \
  (echo "      (déjà configuré ou erreur)" && true)

echo "   → EXPO_PUBLIC_SUPABASE_ANON_KEY..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "$SUPABASE_ANON_KEY" --force 2>/dev/null || \
  (echo "      (déjà configuré ou erreur)" && true)

echo ""
echo "✅ Secrets configurés !"
echo ""
echo "📋 Liste des secrets EAS :"
eas secret:list

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📝 Prochaines étapes :"
echo "   - Tester un build: eas build --platform android --profile preview"
echo ""
