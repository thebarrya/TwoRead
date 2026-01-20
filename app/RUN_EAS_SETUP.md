# 🚀 Exécution de la Configuration EAS

## Étapes à suivre

### Étape 1 : Se connecter à Expo (Nécessaire une seule fois)

Ouvrez un terminal et exécutez :

```bash
cd app
eas login
```

Cela va :
- Ouvrir votre navigateur
- Vous demander de vous connecter à votre compte Expo
- Autoriser EAS CLI à accéder à votre compte

### Étape 2 : Configurer les secrets automatiquement

Une fois connecté, exécutez :

```bash
./configure-eas-secrets.sh
```

Ce script va :
- ✅ Vérifier votre connexion
- ✅ Initialiser EAS dans le projet (si nécessaire)
- ✅ Configurer automatiquement les secrets Supabase
- ✅ Afficher la liste des secrets configurés

## Alternative : Configuration manuelle

Si vous préférez configurer manuellement :

```bash
# 1. Initialiser EAS
eas init

# 2. Configurer les secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://cuzxuckeixsvommxfodz.supabase.co" --force
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkzNjEsImV4cCI6MjA4NDIxNTM2MX0.PrWu4aoS9zlRONfK2mLXarr2eqUbQWA-8wu66pTEYJ0" --force

# 3. Vérifier
eas secret:list
```

## Vérification

Après la configuration, vérifiez que tout fonctionne :

```bash
# Voir les secrets
eas secret:list

# Voir les infos du projet
eas project:info
```

## Problèmes courants

### "Not logged in"
→ Exécutez `eas login` d'abord

### "EAS CLI not found"
→ Installez avec `npm install -g eas-cli`

### Erreur lors de la création de secret
→ Le secret existe peut-être déjà. Utilisez `--force` pour le mettre à jour
