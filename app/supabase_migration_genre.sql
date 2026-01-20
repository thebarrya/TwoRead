-- Migration pour ajouter les préférences de genre littéraire
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes pour les préférences de lecture
ALTER TABLE users
ADD COLUMN IF NOT EXISTS preferred_genre TEXT,
ADD COLUMN IF NOT EXISTS custom_preference TEXT;

-- Ajouter un commentaire pour documenter les colonnes
COMMENT ON COLUMN users.preferred_genre IS 'Genre littéraire préféré : litterature, policier, romance, autre';
COMMENT ON COLUMN users.custom_preference IS 'Préférences personnalisées de l''utilisateur (texte libre)';

-- Créer un index pour améliorer les performances des requêtes sur le genre
CREATE INDEX IF NOT EXISTS idx_users_preferred_genre ON users(preferred_genre);
