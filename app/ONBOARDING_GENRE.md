# 🎯 Nouveaux écrans d'onboarding - Préférences de genre

## 📋 Résumé

Deux nouveaux écrans ont été ajoutés au processus d'onboarding pour personnaliser l'expérience de lecture :

1. **Écran de sélection du genre** - L'utilisateur choisit son genre préféré
2. **Écran de suggestions de livres** - Suggestions personnalisées basées sur les préférences

---

## 🆕 Nouveaux écrans créés

### 1. Écran "Genre" (`app/(onboarding)/genre.tsx`)

**Position dans le flow** : Étape 5/6 (après "Obstacles")

**Question** : "Que voulez-vous lire ?"

**Options** :
- A) **Littérature** (icône : book)
- B) **Roman policier** (icône : search)
- C) **Romance** (icône : heart)
- D) **Je ne sais pas** (icône : help-circle)

**Fonctionnalités** :
- Sélection unique parmi les 4 options
- Si "Je ne sais pas" est sélectionné → affiche un champ texte multi-lignes
- Le champ texte permet à l'utilisateur de noter :
  - Le dernier livre qu'il a lu
  - Ses envies de lecture
  - Ses auteurs préférés
  - Toute autre information pertinente

**Navigation** : Redirige vers l'écran "Suggestions"

---

### 2. Écran "Suggestions" (`app/(onboarding)/suggestions.tsx`)

**Position dans le flow** : Étape 6/6 (dernière étape avant home)

**Fonctionnalités** :
- Affiche le logo Two Read en haut
- Titre personnalisé selon le genre sélectionné :
  - "Littérature classique"
  - "Romans policiers"
  - "Romans d'amour"
  - "Sélection variée"
- Grille de 6 livres suggérés (2 colonnes)
- Sélection multiple des livres (optionnelle)
- Badge de sélection avec icône checkmark
- Informations sur chaque livre :
  - Couverture (ou icône placeholder)
  - Titre
  - Auteur
  - Nombre de chapitres
  - Niveau de difficulté (Facile/Moyen/Avancé)
- Compteur de livres sélectionnés dans le footer
- Bouton "Commencer à lire" avec icône flèche

**Algorithme de suggestions** :
- Utilise `GENRE_MAPPING` pour mapper les genres aux tags de livres
- Récupère les livres "featured" de la base de données
- À améliorer : filtrer par genre dans la requête Supabase

**Navigation** : Termine l'onboarding et redirige vers `/(tabs)/home`

---

## 📊 Nouveau flow d'onboarding

**Avant** (5 étapes) :
1. Language → 2. Level → 3. Motivation → 4. Goal → 5. Obstacles → ✅ Confirm → Home

**Après** (6 étapes) :
1. Language → 2. Level → 3. Motivation → 4. Goal → 5. Obstacles → **6. Genre** → **Suggestions** → Home

---

## 🗄️ Modifications de la base de données

### Nouvelles colonnes dans la table `users` :

```sql
preferred_genre TEXT         -- Genre préféré : litterature, policier, romance, autre
custom_preference TEXT       -- Préférences personnalisées (texte libre)
```

### Migration SQL à exécuter :

Le fichier `supabase_migration_genre.sql` a été créé. Pour l'appliquer :

1. Ouvrir Supabase Dashboard
2. Aller dans SQL Editor
3. Copier-coller le contenu du fichier
4. Exécuter la migration

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS preferred_genre TEXT,
ADD COLUMN IF NOT EXISTS custom_preference TEXT;

CREATE INDEX IF NOT EXISTS idx_users_preferred_genre ON users(preferred_genre);
```

---

## 💾 Modifications du code

### 1. Types (`src/types/database.ts`)

Ajout dans `users.Row`, `users.Insert`, et `users.Update` :
```typescript
preferred_genre: string | null;
custom_preference: string | null;
```

### 2. Auth Store (`src/services/authStore.ts`)

Mise à jour de l'interface `completeOnboarding` :
```typescript
completeOnboarding: (data: {
  // ... champs existants
  preferred_genre?: string;
  custom_preference?: string;
}) => Promise<{ error: Error | null }>;
```

### 3. Layout (`app/(onboarding)/_layout.tsx`)

Ajout des routes :
```typescript
<Stack.Screen name="genre" />
<Stack.Screen name="suggestions" />
```

### 4. Navigation (`app/(onboarding)/obstacles.tsx`)

Modification de la redirection :
- Avant : `/(onboarding)/confirm`
- Après : `/(onboarding)/genre`

---

## 🎨 Design et UX

### Écran Genre

**Couleurs** :
- Option non sélectionnée : fond blanc, bordure grise
- Option sélectionnée : fond vert clair, bordure verte, icône checkmark verte
- Icône non sélectionnée : fond vert clair, icône verte
- Icône sélectionnée : fond vert, icône blanche

**Zone de texte personnalisé** :
- Fond crème pour la section
- Input blanc avec bordure grise
- Placeholder explicatif
- Hint avec emoji 💡

### Écran Suggestions

**Couleurs** :
- Carte non sélectionnée : fond blanc, bordure grise
- Carte sélectionnée : fond vert très clair, bordure verte
- Badge de sélection : icône checkmark verte sur fond blanc

**Cards de livres** :
- Couverture 160px de hauteur
- Padding interne 8px
- Border radius medium
- Grille responsive (2 colonnes sur mobile)

**Badges de difficulté** :
- Facile : fond vert clair
- Moyen : fond jaune clair
- Avancé : fond rouge clair

---

## 🔄 Flux de données

1. **Genre screen** :
   ```
   User selects genre →
   Optional: fills custom input →
   Params sent to suggestions:
   {
     ...previous_params,
     preferred_genre: 'litterature|policier|romance|autre',
     custom_preference: 'user input text'
   }
   ```

2. **Suggestions screen** :
   ```
   Fetch books from Supabase →
   Display based on genre mapping →
   User selects books (optional) →
   Complete onboarding with all data →
   Redirect to home
   ```

---

## 🚀 Pour tester

1. **Exécuter la migration SQL** dans Supabase
2. **Relancer l'application** :
   ```bash
   cd /Users/thebarrya/Documents/ProjectMCP/TwoRead/app
   npx expo start
   ```
3. **Créer un nouveau compte** ou réinitialiser l'onboarding
4. **Suivre le flow** jusqu'aux nouveaux écrans
5. **Tester les 4 options** de genre
6. **Vérifier les suggestions** affichées

---

## 📝 TODO - Améliorations futures

### Base de données
- [ ] Ajouter une colonne `genre` ou `tags` dans la table `books`
- [ ] Créer une table `book_genres` pour gérer plusieurs genres par livre
- [ ] Filtrer les suggestions par genre dans la requête SQL

### Algorithme de suggestions
- [ ] Implémenter un vrai algorithme de recommandation
- [ ] Utiliser `custom_preference` pour analyser les préférences (NLP basique)
- [ ] Prendre en compte le niveau de lecture de l'utilisateur
- [ ] Ajouter un système de scoring pour les livres

### UX
- [ ] Ajouter une animation de chargement personnalisée
- [ ] Implémenter le swipe pour découvrir plus de livres
- [ ] Ajouter un bouton "Voir plus de suggestions"
- [ ] Sauvegarder les livres sélectionnés dans une liste de lecture

### Fonctionnalités
- [ ] Permettre de modifier les préférences depuis le profil
- [ ] Envoyer une notification avec les suggestions une fois par semaine
- [ ] Créer une section "Recommandé pour vous" dans la bibliothèque

---

## 🎉 Résumé des fichiers créés/modifiés

**Nouveaux fichiers** :
- ✅ `app/(onboarding)/genre.tsx` - Écran de sélection du genre
- ✅ `app/(onboarding)/suggestions.tsx` - Écran de suggestions
- ✅ `supabase_migration_genre.sql` - Migration SQL
- ✅ `ONBOARDING_GENRE.md` - Ce fichier de documentation

**Fichiers modifiés** :
- ✅ `app/(onboarding)/obstacles.tsx` - Redirection vers genre
- ✅ `app/(onboarding)/_layout.tsx` - Ajout des routes
- ✅ `src/services/authStore.ts` - Nouveaux champs onboarding
- ✅ `src/types/database.ts` - Types mis à jour

**Total** : 2 nouveaux écrans, 6 fichiers modifiés, 2 nouvelles colonnes DB

---

**L'onboarding est maintenant personnalisé avec les préférences de lecture ! 📚✨**
