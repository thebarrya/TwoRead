# Fix: Erreur "aggregate function calls cannot be nested"

## 🐛 Problème
L'erreur PostgreSQL `42803` apparaît lors de l'appel à `get_monthly_stats()`:
```
aggregate function calls cannot be nested
```

## ✅ Solution
La fonction `get_monthly_stats` imbriquait `json_agg` avec `SUM`, ce qui n'est pas autorisé en PostgreSQL.

## 🚀 Appliquer le Correctif

### Option 1: Via Dashboard Supabase (Recommandé)

1. Aller sur https://supabase.com/dashboard
2. Projet: **TwoRead** (`cuzxuckeixsvommxfodz`)
3. Menu gauche → **SQL Editor**
4. Cliquer **New Query**
5. Copier-coller le contenu de: `supabase/migrations/006_fix_monthly_stats.sql`
6. Cliquer **Run** (ou Cmd+Enter)

### Option 2: Via CLI Supabase

```bash
cd /Users/thebarrya/Documents/ProjectMCP/TwoRead
supabase db push
```

## 📝 Ce qui a été corrigé

### Avant (Incorrect)
```sql
SELECT json_agg(
  json_build_object(
    'week', EXTRACT(WEEK FROM date)::INTEGER,
    'minutes', SUM(minutes_read)::INTEGER,  -- ❌ SUM dans json_agg
    'pages', SUM(pages_read)::INTEGER
  )
)
FROM reading_sessions
GROUP BY EXTRACT(WEEK FROM date)
```

### Après (Correct)
```sql
SELECT json_agg(week_data)
FROM (
  SELECT json_build_object(
    'week', EXTRACT(WEEK FROM date)::INTEGER,
    'minutes', SUM(minutes_read)::INTEGER,  -- ✅ SUM dans sous-requête
    'pages', SUM(pages_read)::INTEGER
  ) as week_data
  FROM reading_sessions
  GROUP BY EXTRACT(WEEK FROM date)
) weeks
```

## ✅ Vérification

Après avoir exécuté le SQL, testez dans l'app:
1. Ouvrir le tab **Statistiques**
2. Cliquer sur l'onglet **Mois**
3. Le graphique mensuel devrait s'afficher sans erreur

## 📁 Fichiers Modifiés

- ✅ `supabase/migrations/004_statistics_functions.sql` (mis à jour)
- ✅ `supabase/migrations/006_fix_monthly_stats.sql` (nouveau correctif)

## 🔄 Ordre d'Exécution des Migrations

Si vous partez de zéro sur Supabase:
1. Exécuter `004_statistics_functions.sql` (version corrigée)
2. Exécuter `005_update_weekly_stats.sql`
3. ~~`006_fix_monthly_stats.sql`~~ (pas nécessaire si 004 est déjà corrigé)

Si vous avez déjà exécuté la version buggée de 004:
1. Exécuter `006_fix_monthly_stats.sql` (remplace la fonction)
2. Puis `005_update_weekly_stats.sql` si pas déjà fait

## 🎯 Résultat Attendu

Une fois corrigé, l'onglet **Mois** dans les Statistiques affichera:
- ✅ Courbe lissée avec 5 points (semaines du mois)
- ✅ Données correctes de minutes/pages
- ✅ Aucune erreur console

---

**Date de Correction**: 20 Janvier 2026
**Version**: 1.1
