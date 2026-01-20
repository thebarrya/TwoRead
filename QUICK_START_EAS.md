# 🚀 Démarrage Rapide - Configuration EAS

## Configuration Automatique en 2 Étapes

### Option 1 : Script Automatique (Recommandé)

```bash
cd app
./setup-eas-auto.sh
```

Ce script va :
1. Installer EAS CLI si nécessaire
2. Vous connecter à Expo (ouvrira votre navigateur)
3. Initialiser EAS dans le projet
4. Configurer automatiquement les secrets Supabase

### Option 2 : Script Node.js (Après connexion)

Si vous êtes déjà connecté à Expo :

```bash
cd app
npm run setup-eas
```

Ou :

```bash
cd app
node setup-eas.js
```

### Option 3 : Configuration Manuelle

Si vous préférez configurer manuellement :

```bash
# 1. Se connecter
cd app
eas login

# 2. Initialiser
eas init

# 3. Configurer les secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://cuzxuckeixsvommxfodz.supabase.co" --force
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0" --force

# 4. Vérifier
eas secret:list
```

## ✅ Vérification

Après la configuration, vérifiez que tout fonctionne :

```bash
# Voir les secrets configurés
eas secret:list

# Voir les infos du projet
eas project:info

# Tester un build (optionnel)
eas build --platform android --profile preview
```

## 📝 Notes Importantes

- **Première connexion** : `eas login` ouvrira votre navigateur pour l'authentification
- **Secrets** : Les secrets sont stockés de manière sécurisée dans EAS
- **Profils** : Les secrets sont disponibles pour tous les profils (development, preview, production)

## 🔗 Ressources

- [Documentation EAS](https://docs.expo.dev/build/introduction/)
- [Guide de déploiement complet](./DEPLOYMENT.md)
- [Configuration EAS détaillée](./app/EAS_SETUP.md)
