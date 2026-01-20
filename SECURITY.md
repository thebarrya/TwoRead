# Guide de Sécurité - TwoRead

Ce document explique comment les secrets Supabase sont sécurisés dans le projet.

## 🔐 Architecture de Sécurité

### Variables d'environnement

Le projet utilise un système de variables d'environnement pour gérer les secrets :

1. **Variables publiques (client-side)** :
   - `EXPO_PUBLIC_SUPABASE_URL` : URL du projet Supabase
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme (sécurisée pour le client)

2. **Variables privées (serveur uniquement)** :
   - `SUPABASE_SERVICE_ROLE_KEY` : Clé service role (uniquement pour les scripts serveur)

### Fichiers de configuration

- `app/env.example` : Template des variables d'environnement
- `app/.env` : Fichier local (non commité, dans `.gitignore`)
- `config/supabase.env` : Fichier de configuration local (non commité)

## ⚠️ Règles de Sécurité

### ✅ À FAIRE

1. **Utiliser des variables d'environnement** pour tous les secrets
2. **Vérifier que `.env` est dans `.gitignore`** avant chaque commit
3. **Utiliser uniquement la clé anonyme** dans l'application client
4. **Utiliser la service role key uniquement** dans les scripts serveur
5. **Configurer les secrets dans EAS** pour les builds de production
6. **Configurer les secrets GitHub** pour CI/CD

### ❌ À NE JAMAIS FAIRE

1. **Ne jamais commiter** des clés dans le code source
2. **Ne jamais utiliser** `SUPABASE_SERVICE_ROLE_KEY` dans l'app client
3. **Ne jamais exposer** les secrets dans les logs ou la console
4. **Ne jamais partager** les secrets par email ou chat non sécurisé
5. **Ne jamais hardcoder** les clés dans le code

## 🔍 Vérification de Sécurité

### Avant chaque commit

```bash
# Vérifier qu'aucune clé n'est hardcodée
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" app/src --exclude-dir=node_modules

# Vérifier que .env n'est pas tracké
git status | grep .env

# Vérifier le .gitignore
cat .gitignore | grep -E "\.env|supabase\.env"
```

### Checklist de sécurité

- [ ] Aucune clé hardcodée dans `app/src/`
- [ ] Le fichier `.env` n'est pas dans Git
- [ ] `config/supabase.env` n'est pas dans Git
- [ ] Les secrets EAS sont configurés
- [ ] Les secrets GitHub Actions sont configurés
- [ ] La service role key n'est utilisée que dans les scripts

## 🚨 En cas de fuite de secret

Si une clé a été accidentellement commitée :

1. **Révoquer immédiatement** la clé dans Supabase Dashboard
2. **Générer une nouvelle clé** dans Supabase
3. **Mettre à jour** tous les environnements (local, EAS, GitHub)
4. **Nettoyer l'historique Git** si nécessaire :
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch config/supabase.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

## 📚 Ressources

- [Documentation Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
