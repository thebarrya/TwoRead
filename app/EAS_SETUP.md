# Configuration Automatique d'EAS

Ce guide vous aide à configurer automatiquement EAS (Expo Application Services) pour TwoRead.

## 🚀 Configuration Rapide

### Étape 1 : Se connecter à Expo

```bash
cd app
eas login
```

Cela ouvrira votre navigateur pour vous authentifier. Une fois connecté, vous pouvez continuer.

### Étape 2 : Exécuter le script de configuration

```bash
npm run setup-eas
```

Ou directement :

```bash
node setup-eas.js
```

Le script va automatiquement :
- ✅ Vérifier que EAS CLI est installé
- ✅ Vérifier votre connexion
- ✅ Initialiser EAS dans le projet
- ✅ Configurer les secrets Supabase
- ✅ Afficher la liste des secrets configurés

## 🔐 Secrets Configurés

Le script configure automatiquement :

- `EXPO_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase

## ✅ Vérification

Après l'exécution, vérifiez que tout est bien configuré :

```bash
eas secret:list
```

Vous devriez voir les deux secrets listés.

## 🛠️ Commandes Utiles

```bash
# Lister les secrets
eas secret:list

# Voir les détails du projet
eas project:info

# Tester un build
eas build --platform android --profile preview

# Voir les builds
eas build:list
```

## 🔄 Si vous devez reconfigurer

Si vous devez mettre à jour les secrets :

```bash
# Mettre à jour un secret
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "nouvelle-valeur" --force

# Supprimer un secret
eas secret:delete --scope project --name EXPO_PUBLIC_SUPABASE_URL
```

## 📝 Notes

- Les secrets sont stockés de manière sécurisée dans EAS
- Ils sont automatiquement injectés lors des builds
- Vous pouvez avoir différents secrets pour différents profils (development, preview, production)
