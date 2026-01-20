# Configuration Rapide des Secrets

## 🚀 Configuration GitHub Secrets (CI/CD)

1. **Aller sur GitHub** : https://github.com/thebarrya/TwoRead/settings/secrets/actions

2. **Cliquer sur "New repository secret"** et ajouter :

   - **Nom** : `EXPO_TOKEN`
   - **Valeur** : Token Expo (générer sur https://expo.dev/accounts/[votre-compte]/settings/access-tokens)
   
   - **Nom** : `EXPO_PUBLIC_SUPABASE_URL`
   - **Valeur** : `https://cuzxuckeixsvommxfodz.supabase.co`
   
   - **Nom** : `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - **Valeur** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0`

## 📱 Configuration EAS (Déploiement)

1. **Installer EAS CLI** :
   ```bash
   npm install -g eas-cli
   ```

2. **Se connecter** :
   ```bash
   eas login
   ```

3. **Initialiser le projet** :
   ```bash
   cd app
   eas init
   ```

4. **Configurer les secrets EAS** :
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://cuzxuckeixsvommxfodz.supabase.co"
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0"
   ```

5. **Vérifier les secrets** :
   ```bash
   eas secret:list
   ```

## 💻 Configuration Locale

1. **Créer le fichier `.env`** dans `app/` :
   ```bash
   cd app
   cp env.example .env
   ```

2. **Remplir `.env`** avec vos valeurs :
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://cuzxuckeixsvommxfodz.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYzOTM2MSwiZXhwIjoyMDg0MjE1MzYxfQ.mg5knGcG2kXeLE6gN2q_NnKkaW7iWBc-IE_81Qio_BE
   ```

## ✅ Vérification

```bash
# Vérifier que .env n'est pas tracké
git status | grep .env

# Vérifier les secrets EAS
eas secret:list

# Tester la connexion locale
cd app
npm start
```
