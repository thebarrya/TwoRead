#!/bin/bash

# Script de configuration automatique d'EAS pour TwoRead

set -e

echo "🚀 Configuration automatique d'EAS pour TwoRead"
echo ""

# Variables Supabase
SUPABASE_URL="https://cuzxuckeixsvommxfodz.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0"

# Vérifier si EAS CLI est installé
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI n'est pas installé. Installation..."
    npm install -g eas-cli
fi

echo "✅ EAS CLI installé"
echo ""

# Vérifier la connexion
echo "🔐 Vérification de la connexion Expo..."
if ! eas whoami &> /dev/null; then
    echo "⚠️  Vous n'êtes pas connecté à Expo."
    echo "   Connexion en cours..."
    eas login
else
    echo "✅ Connecté à Expo"
    eas whoami
fi

echo ""
echo "📦 Initialisation d'EAS..."
eas init --non-interactive || eas init

echo ""
echo "🔐 Configuration des secrets EAS..."

# Configurer les secrets
echo "   → Configuration de EXPO_PUBLIC_SUPABASE_URL..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "$SUPABASE_URL" --force --non-interactive 2>/dev/null || \
  eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "$SUPABASE_URL" --force

echo "   → Configuration de EXPO_PUBLIC_SUPABASE_ANON_KEY..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "$SUPABASE_ANON_KEY" --force --non-interactive 2>/dev/null || \
  eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "$SUPABASE_ANON_KEY" --force

echo ""
echo "✅ Vérification des secrets configurés..."
eas secret:list

echo ""
echo "🎉 Configuration EAS terminée !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Vérifiez les secrets avec: eas secret:list"
echo "   2. Testez un build avec: eas build --platform android --profile preview"
echo ""
