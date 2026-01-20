-- ============================================
-- TWO READ - Achievements Seed Data
-- Version: 1.0
-- Date: January 2026
-- ============================================

-- ============================================
-- STREAK ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (code, name_fr, name_en, description_fr, description_en, category, requirement_value, points) VALUES
('streak_3', 'Premier Pas', 'First Steps', 'Lire 3 jours de suite', 'Read for 3 consecutive days', 'streak', 3, 10),
('streak_7', 'Semaine de Feu', 'Week on Fire', 'Lire 7 jours de suite', 'Read for 7 consecutive days', 'streak', 7, 25),
('streak_14', 'Lecteur Assidu', 'Dedicated Reader', 'Lire 14 jours de suite', 'Read for 14 consecutive days', 'streak', 14, 50),
('streak_30', 'Mois Parfait', 'Perfect Month', 'Lire 30 jours de suite', 'Read for 30 consecutive days', 'streak', 30, 100),
('streak_60', 'Marathonien', 'Marathoner', 'Lire 60 jours de suite', 'Read for 60 consecutive days', 'streak', 60, 200),
('streak_100', 'Centurion', 'Centurion', 'Lire 100 jours de suite', 'Read for 100 consecutive days', 'streak', 100, 500),
('streak_365', 'Annee Legendaire', 'Legendary Year', 'Lire 365 jours de suite', 'Read for 365 consecutive days', 'streak', 365, 1000);

-- ============================================
-- READING ACHIEVEMENTS (Books completed)
-- ============================================
INSERT INTO achievements (code, name_fr, name_en, description_fr, description_en, category, requirement_value, points) VALUES
('books_1', 'Premiere Page Tournee', 'First Page Turned', 'Terminer votre premier livre', 'Complete your first book', 'reading', 1, 25),
('books_5', 'Explorateur', 'Explorer', 'Terminer 5 livres', 'Complete 5 books', 'reading', 5, 50),
('books_10', 'Bibliothecaire', 'Librarian', 'Terminer 10 livres', 'Complete 10 books', 'reading', 10, 100),
('books_25', 'Rat de Bibliotheque', 'Bookworm', 'Terminer 25 livres', 'Complete 25 books', 'reading', 25, 200),
('books_50', 'Maitre Lecteur', 'Reading Master', 'Terminer 50 livres', 'Complete 50 books', 'reading', 50, 500),
('books_100', 'Sage', 'Sage', 'Terminer 100 livres', 'Complete 100 books', 'reading', 100, 1000);

-- ============================================
-- SOCIAL ACHIEVEMENTS (Duos)
-- ============================================
INSERT INTO achievements (code, name_fr, name_en, description_fr, description_en, category, requirement_value, points) VALUES
('duo_first', 'Premiere Rencontre', 'First Encounter', 'Commencer votre premier duo', 'Start your first duo', 'social', 1, 25),
('duo_complete_1', 'Partenaires', 'Partners', 'Terminer un livre en duo', 'Complete a book in duo', 'social', 1, 50),
('duo_complete_5', 'Duo Dynamique', 'Dynamic Duo', 'Terminer 5 livres en duo', 'Complete 5 books in duo', 'social', 5, 150),
('duo_complete_10', 'Equipe de Choc', 'Dream Team', 'Terminer 10 livres en duo', 'Complete 10 books in duo', 'social', 10, 300);

-- ============================================
-- SPECIAL ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (code, name_fr, name_en, description_fr, description_en, category, requirement_value, points) VALUES
('early_bird', 'Leve-Tot', 'Early Bird', 'Lire avant 7h du matin', 'Read before 7 AM', 'special', 1, 15),
('night_owl', 'Hibou Nocturne', 'Night Owl', 'Lire apres 23h', 'Read after 11 PM', 'special', 1, 15),
('weekend_warrior', 'Guerrier du Weekend', 'Weekend Warrior', 'Lire samedi ET dimanche', 'Read on both Saturday AND Sunday', 'special', 1, 20),
('speed_reader', 'Lecteur Express', 'Speed Reader', 'Lire 50 pages en une journee', 'Read 50 pages in one day', 'special', 50, 30),
('division_silver', 'Division Argent', 'Silver Division', 'Atteindre la division Argent', 'Reach Silver division', 'special', 1, 50),
('division_gold', 'Division Or', 'Gold Division', 'Atteindre la division Or', 'Reach Gold division', 'special', 1, 100);
