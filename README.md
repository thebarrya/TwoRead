# TwoRead 📚

Application de lecture moderne construite avec Expo/React Native et Supabase.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- npm ou yarn
- Expo CLI
- Compte Supabase

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/thebarrya/TwoRead.git
cd TwoRead

# Installer les dépendances
cd app
npm install

# Configurer les variables d'environnement
cp env.example .env
# Éditer .env avec vos valeurs Supabase
```

### Développement

```bash
cd app
npm start
```

## 🔐 Configuration des Secrets

**IMPORTANT** : Avant de déployer, configurez les secrets Supabase. Voir [SETUP_SECRETS.md](./SETUP_SECRETS.md) pour les instructions détaillées.

### Configuration rapide

1. **GitHub Secrets** (pour CI/CD) : https://github.com/thebarrya/TwoRead/settings/secrets/actions
2. **EAS Secrets** (pour les builds) : Voir [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Local** : Créer `app/.env` depuis `app/env.example`

## 📱 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet de déploiement.

### Déploiement rapide avec EAS

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Initialiser
cd app
eas init

# Configurer les secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "votre-url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "votre-clé"

# Builder
eas build --platform android --profile production
```

## 🛠️ Technologies

- **Expo** ~52.0.0
- **React Native** 0.76.5
- **Supabase** - Backend as a Service
- **TypeScript** - Typage statique
- **Expo Router** - Navigation basée sur les fichiers
- **Zustand** - Gestion d'état

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement complet
- [SECURITY.md](./SECURITY.md) - Guide de sécurité
- [SETUP_SECRETS.md](./SETUP_SECRETS.md) - Configuration rapide des secrets

## 🔒 Sécurité

Les secrets Supabase sont gérés via des variables d'environnement. Voir [SECURITY.md](./SECURITY.md) pour les bonnes pratiques.

## 📄 Licence

Private - Tous droits réservés
