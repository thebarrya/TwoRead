-- ============================================
-- TWO READ - Sample Books Seed Data
-- Version: 1.0
-- Date: January 2026
-- Public Domain French Literature
-- ============================================

-- Book 1: Le Petit Prince
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000001',
  'Le Petit Prince',
  'Antoine de Saint-Exupery',
  'https://covers.openlibrary.org/b/id/8739161-L.jpg',
  96,
  27,
  'conte',
  'fr',
  'Un aviateur tombe en panne dans le desert et rencontre un petit garcon venu d une autre planete.',
  'gutenberg',
  'easy',
  true
);

-- Book 2: Les Miserables (Tome 1)
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000002',
  'Les Miserables - Fantine',
  'Victor Hugo',
  'https://covers.openlibrary.org/b/id/8231994-L.jpg',
  320,
  24,
  'roman',
  'fr',
  'Premier tome de la celebre fresque sociale de Victor Hugo suivant le destin de Jean Valjean.',
  'gutenberg',
  'hard',
  true
);

-- Book 3: Le Comte de Monte-Cristo (Tome 1)
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000003',
  'Le Comte de Monte-Cristo',
  'Alexandre Dumas',
  'https://covers.openlibrary.org/b/id/8091016-L.jpg',
  450,
  30,
  'aventure',
  'fr',
  'L histoire d Edmond Dantes, marin injustement emprisonne qui s evade et cherche vengeance.',
  'gutenberg',
  'medium',
  true
);

-- Book 4: Candide
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000004',
  'Candide',
  'Voltaire',
  'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  120,
  30,
  'conte_philosophique',
  'fr',
  'Les aventures du jeune Candide qui decouvre que le monde n est pas aussi parfait qu on le lui a enseigne.',
  'gutenberg',
  'medium',
  false
);

-- Book 5: Les Fables
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000005',
  'Les Fables',
  'Jean de La Fontaine',
  'https://covers.openlibrary.org/b/id/8599091-L.jpg',
  200,
  50,
  'fables',
  'fr',
  'Recueil de fables mettant en scene des animaux pour illustrer des lecons de morale.',
  'wikisource',
  'easy',
  true
);

-- Book 6: Germinal
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000006',
  'Germinal',
  'Emile Zola',
  'https://covers.openlibrary.org/b/id/8231943-L.jpg',
  500,
  40,
  'roman',
  'fr',
  'L histoire d une greve de mineurs dans le nord de la France au XIXe siecle.',
  'gutenberg',
  'hard',
  false
);

-- Book 7: Madame Bovary
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000007',
  'Madame Bovary',
  'Gustave Flaubert',
  'https://covers.openlibrary.org/b/id/8091563-L.jpg',
  350,
  35,
  'roman',
  'fr',
  'Le destin tragique d Emma Bovary, femme de medecin de province revant d une vie romanesque.',
  'gutenberg',
  'medium',
  false
);

-- Book 8: Les Trois Mousquetaires
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000008',
  'Les Trois Mousquetaires',
  'Alexandre Dumas',
  'https://covers.openlibrary.org/b/id/8231847-L.jpg',
  600,
  67,
  'aventure',
  'fr',
  'Les aventures de d Artagnan et ses amis Athos, Porthos et Aramis au service du roi Louis XIII.',
  'gutenberg',
  'medium',
  true
);

-- Book 9: Notre-Dame de Paris
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000009',
  'Notre-Dame de Paris',
  'Victor Hugo',
  'https://covers.openlibrary.org/b/id/8599248-L.jpg',
  480,
  59,
  'roman',
  'fr',
  'L histoire de Quasimodo, le sonneur de cloches de Notre-Dame, et de la belle Esmeralda.',
  'gutenberg',
  'hard',
  false
);

-- Book 10: Vingt Mille Lieues sous les mers
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000010',
  'Vingt Mille Lieues sous les mers',
  'Jules Verne',
  'https://covers.openlibrary.org/b/id/8231867-L.jpg',
  400,
  47,
  'aventure',
  'fr',
  'Le professeur Aronnax explore les fonds marins a bord du Nautilus avec le mysterieux capitaine Nemo.',
  'gutenberg',
  'medium',
  true
);

-- Book 11: Le Tour du monde en 80 jours
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000011',
  'Le Tour du monde en 80 jours',
  'Jules Verne',
  'https://covers.openlibrary.org/b/id/8091234-L.jpg',
  280,
  37,
  'aventure',
  'fr',
  'Phileas Fogg parie qu il peut faire le tour du monde en seulement quatre-vingts jours.',
  'gutenberg',
  'easy',
  false
);

-- Book 12: Carmen
INSERT INTO books (id, title, author, cover_url, total_pages, total_chapters, genre, language, description, source, difficulty, is_featured)
VALUES (
  'b0000001-0000-0000-0000-000000000012',
  'Carmen',
  'Prosper Merimee',
  'https://covers.openlibrary.org/b/id/8599156-L.jpg',
  80,
  4,
  'nouvelle',
  'fr',
  'L histoire passionnee et tragique entre Don Jose et la gitane Carmen en Espagne.',
  'gutenberg',
  'easy',
  false
);
