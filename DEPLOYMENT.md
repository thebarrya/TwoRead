# Guide de Déploiement - TwoRead

Ce guide explique comment déployer l'application TwoRead de manière sécurisée avec les secrets Supabase protégés.

## 🔐 Sécurisation des Secrets

### Variables d'environnement requises

L'application utilise les variables d'environnement suivantes :

- `EXPO_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase (sécurisée pour le client)
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role (uniquement pour les scripts serveur, **JAMAIS dans l'app**)

### Configuration locale

1. **Créer le fichier `.env` dans le dossier `app/`** :
   ```bash
   cd app
   cp env.example .env
   ```

2. **Remplir les valeurs dans `.env`** :
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
   SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
   ```

3. **Vérifier que `.env` est dans `.gitignore`** (déjà configuré)

## 🚀 Déploiement avec EAS (Expo Application Services)

### Prérequis

1. Installer EAS CLI globalement :
   ```bash
   npm install -g eas-cli
   ```

2. Se connecter à Expo :
   ```bash
   eas login
   ```

3. Lier le projet :
   ```bash
   cd app
   eas init
   ```

### Configuration des secrets EAS

Les secrets sont stockés de manière sécurisée dans EAS :

```bash
# Définir les secrets Supabase
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://votre-projet.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "votre-clé-anon"

# Vérifier les secrets
eas secret:list
```

### Builds

#### Build de développement
```bash
eas build --profile development --platform android
# ou
eas build --profile development --platform ios
```

#### Build de prévisualisation
```bash
eas build --profile preview --platform android
# ou
eas build --profile preview --platform ios
```

#### Build de production
```bash
eas build --profile production --platform android
# ou
eas build --profile production --platform ios
```

### Soumission aux stores

```bash
# Android (Google Play)
eas submit --platform android

# iOS (App Store)
eas submit --platform ios
```

## 🔄 CI/CD avec GitHub Actions

### Configuration des secrets GitHub

1. Aller sur https://github.com/thebarrya/TwoRead/settings/secrets/actions
2. Ajouter les secrets suivants :
   - `EXPO_TOKEN` : Token Expo (généré sur https://expo.dev/accounts/[votre-compte]/settings/access-tokens)
   - `EXPO_PUBLIC_SUPABASE_URL` : URL Supabase
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase

### Workflow GitHub Actions

Le workflow `.github/workflows/deploy.yml` est configuré pour :
- Builder automatiquement l'application lors des pushes sur `main`
- Utiliser les secrets GitHub pour les variables d'environnement
- Créer des builds pour Android et iOS

## 📱 Déploiement manuel

### Développement local

```bash
cd app
npm start
```

### Build local (sans EAS)

```bash
cd app
npx expo export
```

## 🔍 Vérification de la sécurité

### Checklist avant déploiement

- [ ] Aucune clé hardcodée dans le code source
- [ ] Le fichier `.env` est dans `.gitignore`
- [ ] Les secrets EAS sont configurés
- [ ] Les secrets GitHub Actions sont configurés
- [ ] Le fichier `config/supabase.env` n'est pas commité
- [ ] Les scripts utilisent uniquement `SUPABASE_SERVICE_ROLE_KEY` (jamais dans l'app)

### Vérification du code

```bash
# Chercher des clés hardcodées (à éviter)
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" app/src --exclude-dir=node_modules
```

## 📚 Ressources

- [Documentation Expo EAS](https://docs.expo.dev/build/introduction/)
- [Documentation Supabase](https://supabase.com/docs)
- [GitHub Actions pour Expo](https://github.com/expo/expo-github-action)

## ⚠️ Notes importantes

1. **La clé `SUPABASE_SERVICE_ROLE_KEY` ne doit JAMAIS être utilisée dans l'application client**
2. **Les variables `EXPO_PUBLIC_*` sont accessibles côté client** (utilisez uniquement la clé anonyme)
3. **Toujours utiliser des secrets pour les valeurs sensibles en production**
4. **Vérifier régulièrement que les secrets ne sont pas exposés dans le code**
