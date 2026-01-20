# PRD - Two Read

## Product Requirements Document

**Version:** 1.0
**Date:** Janvier 2026
**Entreprise:** DMS Business
**Chef de projet:** Ibrahim DIALLO
**Confidentialité:** Haute
**Date de lancement prévue:** 27 Février 2026

---

## 1. Vue d'ensemble du produit

### 1.1 Description
Two Read est une application mobile de lecture en ligne disponible sur iOS et Android. Elle vise à transformer la lecture en une habitude quotidienne grâce à une approche ludique, sociale et motivante, inspirée du modèle Duolingo.

### 1.2 Vision
- Transformer la lecture en habitude quotidienne
- Supprimer la pression scolaire ou intellectuelle
- Créer une expérience sociale et motivante
- Favoriser la motivation mutuelle entre lecteurs

### 1.3 Objectif principal
Développer une application d'ici 2027 qui exploite la présence quotidienne des utilisateurs sur leur téléphone pour les amener à lire, apprendre et se cultiver, sans pression, à leur rythme, de manière ludique et motivante.

---

## 2. Public cible

### 2.1 Utilisateurs visés
- Lecteurs débutants
- Lecteurs occasionnels
- Lecteurs réguliers
- Tout public

### 2.2 Moments d'utilisation
- Utilisation quotidienne
- Pics d'utilisation : matin, midi et soir

---

## 3. Proposition de valeur unique

### 3.1 Différenciation clé
| Fonctionnalité | Description |
|----------------|-------------|
| **Lecture partagée** | Deux personnes avancent ensemble dans la lecture |
| **Progression synchronisée** | Impossible de passer au chapitre suivant si le partenaire n'a pas terminé |
| **Motivation collective** | Défis, séries (streaks), rappels |
| **IA intégrée** | Suggestions de livres tendances et résumés automatiques |

---

## 4. Fonctionnalités

### 4.1 Espace utilisateur
- [ ] Compte personnel pour chaque utilisateur
- [ ] Bibliothèque personnelle
- [ ] Historique de lecture

### 4.2 Lecture et progression
- [ ] Découpage hebdomadaire basé sur le nombre de pages lues
- [ ] Défis intégrés :
  - Questions
  - Quiz
  - Exercices d'écriture
- [ ] Indicateur d'émotion à la fin de chaque lecture
- [ ] Signet / marque-page

### 4.3 Social et motivation
- [ ] Lecture partagée obligatoire (progression synchronisée)
- [ ] Partage de notes entre lecteurs
- [ ] Séries (streaks) style Duolingo
- [ ] Widget de rappel
- [ ] Motivation mutuelle entre utilisateurs

### 4.4 IA intégrée
- [ ] Suggestion de livres tendances
- [ ] Résumé automatique des textes lus
- [ ] Suivi du nombre de pages lues

### 4.5 Concentration
- [ ] Fonctionnalité de blocage d'applications pour limiter les distractions

---

## 5. Architecture technique

### 5.1 Stack technologique
| Composant | Technologie |
|-----------|-------------|
| Frontend | React Native |
| Backend | Supabase |
| Low-code | FlutterFlow / Lovable |
| IDE IA | Cursor |

### 5.2 Backend et données (Supabase)
- Comptes utilisateurs
- Données de lecture
- Progression
- Notes partagées
- Analyse comportementale (KPI)

### 5.3 Tests et déploiement
- **Tests iOS:** TestFlight (AwayFinder mentionné)
- **Publication:** Apple App Store + Google Play Store
- **Prérequis:** Lancement sans bugs critiques

---

## 6. Design System et UX

### 6.1 Mascotte & Logo

**Mascotte "Two Read":**
- Pieuvre verte kawaii/cartoon style
- Tient un livre ouvert entre ses tentacules
- Expression amicale et engageante
- Accompagnée d'une petite étoile orange (compagnon)
- Utilisée comme logo principal ET avatar par défaut des utilisateurs

**Logo typographique:**
- "Two Read" en typographie arrondie et ludique
- Couleur verte principale
- Style friendly et accessible

### 6.2 Palette de couleurs

| Nom | Hex (approx.) | Usage |
|-----|---------------|-------|
| **Vert Principal** | `#4CAF50` | Logo, boutons CTA, accents, badges positifs |
| **Vert Foncé** | `#2E7D32` | Texte sur boutons, headers |
| **Vert Clair** | `#81C784` | Backgrounds secondaires, hover states |
| **Orange/Jaune** | `#FF9800` | Streaks (flamme), badges EN COURS, motivation |
| **Jaune Doré** | `#FFC107` | Étoiles, trophées, récompenses |
| **Bleu Ciel** | `#87CEEB` | Dégradé de fond (ciel) |
| **Blanc** | `#FFFFFF` | Fonds de cartes, texte sur boutons verts |
| **Blanc Crème** | `#FAFAFA` | Background général des écrans |
| **Gris Clair** | `#E0E0E0` | Bordures, séparateurs, texte secondaire |
| **Gris Foncé** | `#616161` | Texte body, labels |

### 6.3 Typographie

| Élément | Style | Taille (approx.) |
|---------|-------|------------------|
| **Logo** | Rounded sans-serif, Bold | 32px |
| **Titre écran** | Sans-serif, Bold | 24px |
| **Sous-titres** | Sans-serif, Semi-bold | 18px |
| **Body text** | Sans-serif, Regular | 14-16px |
| **Labels/Captions** | Sans-serif, Medium | 12px |
| **Boutons** | Sans-serif, Bold | 16px |

**Police recommandée:** Nunito, Poppins, ou Quicksand (arrondies et friendly)

### 6.4 Composants UI

#### Boutons

| Type | Style |
|------|-------|
| **Primaire** | Fond vert `#4CAF50`, texte blanc, border-radius 25px, padding 16px 32px |
| **Secondaire** | Fond blanc, bordure verte, texte vert, border-radius 25px |
| **Tertiaire** | Fond transparent, texte vert, underline on hover |

#### Cartes

- Border-radius: 16px
- Box-shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Padding: 16px
- Background: blanc `#FFFFFF`

#### Badges

| Badge | Couleur fond | Couleur texte |
|-------|--------------|---------------|
| **EN COURS** | Orange `#FF9800` | Blanc |
| **TERMINÉ** | Vert `#4CAF50` | Blanc |
| **Lecteur débutant** | Gris clair | Gris foncé |
| **Lecteur régulier** | Vert clair | Vert foncé |
| **Lecteur expert** | Or `#FFC107` | Blanc |

#### Cercle de progression

- Cercle extérieur: stroke vert avec progression animée
- Intérieur: couverture du livre
- Taille: ~150px diamètre sur écran Home

#### Chips de filtres

- Border-radius: 20px
- Padding: 8px 16px
- État actif: fond vert, texte blanc
- État inactif: fond blanc, bordure grise, texte gris

### 6.5 Iconographie

**Style:** Icônes arrondies, filled (pleines), cohérentes

| Icône | Usage |
|-------|-------|
| Flamme | Streaks, séries de jours |
| Trophée | Divisions, classements, récompenses |
| Livre | Lecture, bibliothèque |
| Personnes | Communauté, duo |
| Engrenage | Paramètres |
| Calendrier | Planning, historique |
| Étoile | Notation, niveau |
| Lune/Soleil | Défi du jour |

### 6.6 Backgrounds

**Écran principal:**
- Dégradé vertical: bleu ciel clair → blanc
- Nuages stylisés en arrière-plan (optionnel)
- Collines/herbe verte en bas (page d'accueil)

**Écrans intérieurs:**
- Fond blanc crème uniforme
- Header avec dégradé vert clair (optionnel)

### 6.7 Navigation basse (Tab Bar)

**Structure:** 4 onglets

| Position | Label | Icône |
|----------|-------|-------|
| 1 | Accueil | Maison |
| 2 | Objectifs | Cible/Flamme |
| 3 | Communauté | Personnes |
| 4 | Profil | Avatar/Personne |

**États:**
- Actif: icône + texte en vert, indicateur point
- Inactif: icône + texte en gris

### 6.8 Animations & Micro-interactions

- Mascotte: clignement des yeux, tourne une page (page d'accueil)
- Cercle de progression: animation de remplissage
- Streaks: animation flamme au survol/tap
- Boutons: légère élévation au tap
- Transitions: slide horizontal entre écrans
- Badges: légère bounce animation à l'obtention

### 6.9 Gamification visuelle

| Élément | Représentation |
|---------|----------------|
| **Streaks** | Flamme orange + compteur "Série de X jours" |
| **Divisions** | Bronze/Argent/Or avec trophées colorés |
| **Niveau lecteur** | Badge avec étoile + label |
| **Progression livre** | Cercle avec pourcentage |
| **Classement** | Liste avec barres de progression horizontales |
| **Étoiles** | 5 étoiles dorées pour notation |

### 6.10 Objectifs UX

- Réduire le stress et l'intimidation
- Faciliter l'intégration utilisateur (onboarding fluide)
- Éviter l'ennui (gamification, visuels attractifs)
- Favoriser l'engagement quotidien (streaks visibles)
- Créer un sentiment de communauté (classements, duos)

### 6.11 Outils design

- **Figma:** Maquettes et prototypes
- **Framer IA:** Templates et inspirations
- **Lottie:** Animations (mascotte, micro-interactions)

---

## 7. Écrans de l'application

### 7.1 Onboarding (7 écrans)
1. **Choix de la langue** - FR/EN/ES/DE
2. **Motivation principale** - Pourquoi lire ?
3. **Objectif de lecture** - 5/10/15 min par jour
4. **Freins à la lecture** - Identifier les obstacles
5. **Gestion des notifications** - Blocage pendant lecture
6. **Raison de l'objectif** - Personnalisation
7. **Confirmation finale** - Démarrage

### 7.2 Écrans principaux

#### Écran 1 - Page d'accueil / Welcome (Lancement)

**Header:**
- Logo Two Read (mascotte pieuvre + typographie)

**Zone centrale:**
- Illustration pleine largeur avec mascotte
- Fond dégradé bleu ciel → blanc avec collines vertes
- Nuages décoratifs

**Slogan:**
> "Lisez ensemble, Progressez ensemble."

**Actions:**
- Bouton primaire vert: "Commencer lecture"
- Bouton secondaire blanc: "J'ai déjà un compte"

**Navigation basse:** Accueil | Objectifs | Communauté | Profil

---

#### Écran 2 - Home / Objectifs (Salut Alex!)

**Header:**
- Message personnalisé: "Salut [Prénom]!"
- Indicateur de semaine: "Semaine 3"

**Calendrier hebdomadaire:**
- Jours: L M M J S S D
- États: complété (vert avec check), actuel (cercle lumineux), à venir (gris)

**Livre en cours (élément central):**
- Cercle de progression avec couverture du livre au centre
- Titre du livre: ex. "Voyage Galactique"
- Info progression: "Chapitre 3 - 12 pages restantes"

**CTA principal:**
- Bouton vert: "Continuer la lecture"

**Indicateur streak:**
- Flamme orange + "Série de 8 jours"

**Navigation basse:** Accueil (actif) | Objectifs | Communauté | Profil

---

#### Écran 3 - Ma Bibliothèque

**Header:**
- Titre: "Ma Bibliothèque"
- Icône paramètres (engrenage)

**Recherche:**
- Barre de recherche avec icône loupe

**Filtres (chips horizontaux):**
- Date (actif par défaut)
- Alphabétique
- Genre

**Section "Défi du jour":**
- Icône flamme + carte défi
- Icône lune (défi nocturne)

**Grille de livres:**
- Cartes avec couverture
- Badge statut:
  - "EN COURS" (orange)
  - "TERMINÉ" (vert)
- Titres: ex. "Mystère à Paris", "Voyage Galactique"

**Section "Défis en Duo":**
- Liste d'utilisateurs avec:
  - Avatar
  - Nom (ex. Emma, Louis)
  - Stats: "22 jours", "632 pages"
  - Bouton "Follow" (vert)

**Navigation basse:** Accueil | Objectifs (actif) | Communauté | Profil

---

#### Écran 4 - Progression / Communauté

**Header:**
- Titre: "Progression"

**Carte Division:**
- Badge: "Division Argent" avec trophée
- Flèche pour voir détails

**Notation étoiles:**
- 4-5 étoiles dorées
- Compteur: "3+"

**Classement (Leaderboard):**
- Liste verticale des membres:
  - Avatar (pieuvre ou photo)
  - Nom (Sophie, Alex, Louis, Marie)
  - Barre de progression horizontale
  - Position dans le classement

**Carte utilisateur en vedette:**
- Avatar + Nom
- Badge: "Lecteur expert"
- Citation/commentaire d'encouragement

**Autres membres:**
- Liste avec niveau (ex. "Lecteur débutant")

**Navigation basse:** Accueil | Objectifs | Communauté (actif) | Profil

---

#### Écran 5 - Mon Profil

**Header:**
- Titre: "Mon Profil"
- Icône paramètres (engrenage)

**Section profil:**
- Avatar (mascotte pieuvre personnalisée)
- Nom: "Alex"
- Badge niveau: "Lecteur régulier" (vert avec étoile)

**Section abonnement:**
- "Passeduanel" (abonnement annuel): 69,99 €
- Bouton "Acheter"
- Indicateur de progression: "1,23%"

**Section Commentaires:**
- Titre: "Commentaires"
- Grille horizontale des livres commentés:
  - Couvertures miniatures
  - Titres: "L'Art de Rester", "Histoires Fantomes", "Rome Antique"

**Statistiques:**
- Icône calendrier + nombre (ex. 6)
- Icônes émotions/réactions
- Icône personnes + nombre (ex. 8)

**Section Résumé IA:**
- Titre: "Résumé IA"
- Icône IA/robot
- Texte de résumé généré par l'IA

**Navigation basse:** Accueil | Objectifs | Communauté | Profil (actif)

---

#### Écran 6 - Lecture du livre (Reader)

**Mode plein écran** - Navigation basse masquée pendant la lecture

**Header (barre supérieure):**
- Bouton retour (flèche ←)
- Titre du livre + chapitre en cours
- Menu options (3 points ou engrenage)

**Zone de lecture (contenu principal):**
- Texte du livre avec pagination
- Numéro de page actuel / total (ex. "42 / 156")
- Zone tactile gauche/droite pour navigation entre pages

**Barre de progression:**
- Indicateur horizontal de progression dans le chapitre
- Pourcentage de lecture

**Signet / Marque-page:**
- Icône signet (ruban) en haut à droite de la page
- Tap pour ajouter/retirer un signet
- Accès rapide aux pages marquées depuis le menu
- Sauvegarde automatique de la dernière page lue

**Personnalisation de l'affichage:**

| Option | Choix disponibles |
|--------|-------------------|
| **Thème couleur** | Clair (blanc), Sépia (beige), Sombre (noir) |
| **Taille police** | Petit, Moyen, Grand, Très grand |
| **Police** | Serif, Sans-serif, Dyslexie-friendly |
| **Interligne** | Serré, Normal, Espacé |
| **Marges** | Étroites, Normales, Larges |

**Modes d'affichage par orientation:**

| Mode | Portrait | Paysage |
|------|----------|---------|
| **Smartphone** | 1 page | 1 page (optionnel 2 pages) |
| **Tablette** | 1 ou 2 pages | 2 pages côte à côte |

**Gestes tactiles:**
- Swipe gauche/droite: page suivante/précédente
- Tap centre: afficher/masquer les contrôles
- Pinch: zoom texte
- Long press: sélection de texte (surligner, noter)

**Fonctionnalités de lecture:**
- Surlignage de passages (plusieurs couleurs)
- Ajout de notes personnelles sur un passage
- Recherche dans le livre
- Table des matières accessible
- Mode nuit automatique (selon l'heure)

**Menu options (accessible via icône):**
- Paramètres d'affichage
- Table des matières
- Signets sauvegardés
- Notes et surlignages
- Partager un extrait
- Informations du livre

**États visuels des thèmes:**

```
┌─────────────────────────────────────┐
│  CLAIR (Blanc)                      │
│  Background: #FFFFFF                │
│  Texte: #333333                     │
│  Usage: Lecture de jour             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  SÉPIA (Beige)                      │
│  Background: #F5E6D3                │
│  Texte: #5C4033                     │
│  Usage: Lecture prolongée, confort  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  SOMBRE (Noir)                      │
│  Background: #1A1A1A                │
│  Texte: #E0E0E0                     │
│  Usage: Lecture de nuit             │
└─────────────────────────────────────┘
```

---

### 7.3 Navigation basse (Tab Bar)

**4 onglets fixes:**

| Onglet | Label | Icône | Couleur active |
|--------|-------|-------|----------------|
| 1 | Accueil | Maison | Vert |
| 2 | Objectifs | Flamme/Cible | Orange |
| 3 | Communauté | Personnes | Bleu |
| 4 | Profil | Avatar/Engrenage | Vert |

**Comportement:**
- Icône + label toujours visibles
- État actif: couleur vive + indicateur
- État inactif: gris
- Transition fluide entre onglets

---

## 8. Modèle économique

### 8.1 Monétisation
| Type | Description |
|------|-------------|
| **Mur de paiement** | Fixe avec essai gratuit |
| **Version Pro** | Sans publicité |
| **Version Standard** | Avec publicité |

### 8.2 Grille tarifaire
| Formule | Prix | Cible |
|---------|------|-------|
| Enfant | 5€/mois | Jusqu'à 13 ans |
| Adulte | 11€/mois | 14 ans et + |
| Famille | 20€/mois | Variable selon nombre d'enfants |

### 8.3 Optimisation
- Superwall pour tester les prix dynamiquement

### 8.4 Sources de revenus additionnelles
- Espaces publicitaires (promotion de livres)
- Connexion à librairies en ligne / Amazon
- Possibilité d'importer son livre (V2)

---

## 9. Stratégie marketing

### 9.1 Principe clé
> Le marketing représente 95% du succès de l'application

### 9.2 Canaux marketing
- Référencement naturel Google (SEO)
- TikTok organique
- Facebook Ads
- TikTok Ads
- Influenceurs (option surveillée - coût élevé)

### 9.3 Positionnement
Ne pas cibler uniquement les amateurs de livres. Positionner l'application comme :
- Apprentissage
- Culture
- Développement personnel

### 9.4 Analytics
- Attribution publicitaire (source des utilisateurs)
- Optimisation des KPI
- Analyse comportementale
- Ajustement des murs payants selon les données

---

## 10. Sécurité

### 10.1 Mesures de sécurité
- Supabase pour gestion sécurisée des comptes
- Contrôle des accès utilisateurs
- Séparation des espaces personnels
- Sécurité des données de lecture et notes partagées
- Publication sur stores officiels uniquement
- Limitation des outils payants inutiles

---

## 11. Approche de développement

### 11.1 Principes
- Procéder par itérations
- Accepter que la V1 ne soit pas parfaite
- Observer le comportement réel des utilisateurs avant d'optimiser

### 11.2 Options de développement
| Option | Budget | Notes |
|--------|--------|-------|
| Développeur freelance (Upwork) | 500€ | Paiement à la progression |
| IA / Low-code | Variable | Cursor, FlutterFlow, Lovable |

### 11.3 Critères de sélection freelance
- Appel préalable pour comprendre la personnalité
- Paiement à la progression, pas à l'heure

---

## 12. Roadmap

### Phase 1 - MVP (Février 2026)
- [ ] Onboarding complet
- [ ] Création de compte / Authentification
- [ ] Bibliothèque personnelle
- [ ] Lecture avec progression
- [ ] Système de streaks
- [ ] Mur de paiement

### Phase 2 - V1 Post-lancement
- [ ] Lecture partagée (duo)
- [ ] Système de défis et quiz
- [ ] IA - Suggestions de livres
- [ ] IA - Résumés automatiques
- [ ] Classements et divisions

### Phase 3 - V2
- [ ] Import de livres personnels
- [ ] Partage à la communauté
- [ ] Abonnement aux autres membres
- [ ] Mode focus (blocage apps)
- [ ] Widget de rappel

---

## 13. Métriques de succès (KPI)

### 13.1 Engagement
- DAU / MAU (utilisateurs actifs)
- Temps de lecture moyen
- Taux de complétion de livres
- Longueur des streaks

### 13.2 Rétention
- Rétention J1, J7, J30
- Taux de churn

### 13.3 Monétisation
- Taux de conversion (gratuit → payant)
- ARPU (revenu moyen par utilisateur)
- LTV (valeur vie client)

### 13.4 Social
- Nombre de duos actifs
- Notes partagées
- Interactions communautaires

---

## 14. Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Retard de développement | Élevé | Prioriser le MVP, itérer |
| Faible adoption | Élevé | Stratégie marketing forte (95% du succès) |
| Problèmes techniques | Moyen | Tests avant lancement, TestFlight |
| Concurrence | Moyen | Différenciation par la lecture partagée |
| Coûts d'acquisition | Moyen | Optimisation des canaux, attribution |

---

## 15. Annexes

### 15.1 Outils à maîtriser
- Lovable
- Cursor
- React Native
- Supabase

### 15.2 Ressources design
- Figma
- Framer IA

### 15.3 Références d'inspiration
- Duolingo (gamification, streaks)
- Applications de lecture existantes

---

**Document confidentiel - DMS Business - Janvier 2026**
