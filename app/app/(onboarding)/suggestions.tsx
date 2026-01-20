import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { NatureBackground } from '../../src/components/NatureBackground';

interface BookSuggestion {
  id: string;
  title: string;
  author: string;
  description: string;
  total_chapters: number;
  cover_url: string | null;
  difficulty: string;
  genre: string;
}

export default function SuggestionsScreen() {
  const params = useLocalSearchParams();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [finishing, setFinishing] = useState(false);

  const preferredGenre = params.preferred_genre as string;

  useEffect(() => {
    // Vérifier la session au chargement
    checkSession();
    fetchSuggestions();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn('Aucune session détectée sur l\'écran de suggestions');
      Alert.alert(
        'Session expirée',
        'Veuillez vous reconnecter pour continuer.',
        [{
          text: 'OK',
          onPress: () => router.replace('/(auth)/signin')
        }]
      );
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);

    // Requête pour obtenir des livres suggérés
    // Note: En production, vous devriez filtrer par genre dans la base de données
    // const genreTags = GENRE_MAPPING[preferredGenre] || GENRE_MAPPING.autre;
    const { data } = await supabase
      .from('books')
      .select('*')
      .eq('is_featured', true)
      .limit(6);

    if (data) {
      setSuggestions(data as BookSuggestion[]);
    }

    setLoading(false);
  };

  const toggleBookSelection = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleFinish = async () => {
    setFinishing(true);

    try {
      // Vérifier que la session est bien établie
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (!currentSession) {
        console.error('Aucune session trouvée');
        Alert.alert(
          'Erreur de connexion',
          'Votre session a expiré. Veuillez vous reconnecter.',
          [{
            text: 'OK',
            onPress: () => router.replace('/(auth)/signin')
          }]
        );
        setFinishing(false);
        return;
      }

      const obstaclesString = params.reading_obstacles as string;
      const obstacles = obstaclesString ? obstaclesString.split(',') : [];

      const { error } = await completeOnboarding({
        language: (params.language as string) || 'fr',
        motivation: (params.motivation as string) || 'culture',
        daily_goal_minutes: parseInt(params.daily_goal_minutes as string) || 10,
        reading_obstacles: obstacles,
        reading_reason: 'personal',
        notifications_enabled: true,
        preferred_genre: preferredGenre,
        custom_preference: params.custom_preference as string,
      });

      if (error) {
        console.error('Erreur lors de la complétion de l\'onboarding:', error);
        Alert.alert(
          'Erreur',
          `Une erreur est survenue: ${error.message}`,
          [{ text: 'OK' }]
        );
        setFinishing(false);
        return;
      }

      // Sauvegarder les livres sélectionnés comme favoris
      if (selectedBooks.length > 0 && currentSession?.user?.id) {
        const userBooksToInsert = selectedBooks.map(bookId => ({
          user_id: currentSession.user.id,
          book_id: bookId,
          status: 'not_started' as const,
          is_favorite: true, // Marquer comme favoris depuis suggestions
        }));

        const { error: userBooksError } = await supabase
          .from('user_books')
          .insert(userBooksToInsert);

        if (userBooksError) {
          console.error('Erreur lors de l\'ajout des livres favoris:', userBooksError);
          // Ne pas bloquer l'onboarding si l'ajout échoue, juste logger l'erreur
        }
      }

      // Petit délai pour s'assurer que le store est mis à jour
      setTimeout(() => {
        setFinishing(false);
        router.replace('/(tabs)/home');
      }, 500);
    } catch (err) {
      console.error('Erreur inattendue:', err);
      setFinishing(false);
      Alert.alert(
        'Erreur',
        'Une erreur inattendue est survenue. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  const getGenreTitle = () => {
    const titles: Record<string, string> = {
      litterature: 'Littérature classique',
      policier: 'Romans policiers',
      romance: 'Romans d\'amour',
      autre: 'Basé sur vos goûts',
    };
    return titles[preferredGenre] || 'Nos suggestions';
  };

  const getGenreSubtitle = () => {
    const customPref = params.custom_preference as string;
    if (preferredGenre === 'autre' && customPref && customPref.trim()) {
      return `Inspiré de : ${customPref}`;
    }
    return null;
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return styles.difficulty_easy;
      case 'medium':
        return styles.difficulty_medium;
      case 'hard':
        return styles.difficulty_hard;
      default:
        return styles.difficulty_easy;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>
            Recherche des meilleurs livres pour vous...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NatureBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color={colors.neutral.black} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Livres recommandés pour vous</Text>
            <Text style={styles.subtitle}>{getGenreTitle()}</Text>
            {getGenreSubtitle() && (
              <Text style={styles.customPreference}>{getGenreSubtitle()}</Text>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.instruction}>
            📚 Sélectionnez les livres qui vous intéressent (optionnel)
          </Text>

          <View style={styles.booksGrid}>
            {suggestions.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={[
                  styles.bookCard,
                  selectedBooks.includes(book.id) && styles.bookCardSelected,
                ]}
                onPress={() => toggleBookSelection(book.id)}
              >
                <View style={styles.bookCover}>
                  {book.cover_url ? (
                    <Image
                      source={{ uri: book.cover_url }}
                      style={styles.coverImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderCover}>
                      <Ionicons name="book" size={32} color={colors.primary.main} />
                    </View>
                  )}
                  {selectedBooks.includes(book.id) && (
                    <View style={styles.selectedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={28}
                        color={colors.primary.main}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <Text style={styles.bookAuthor} numberOfLines={1}>
                    {book.author}
                  </Text>
                  <View style={styles.bookMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="document-text-outline"
                        size={14}
                        color={colors.neutral.darkGrey}
                      />
                      <Text style={styles.metaText}>{book.total_chapters} ch.</Text>
                    </View>
                    <View style={[styles.difficultyBadge, getDifficultyStyle(book.difficulty)]}>
                      <Text style={styles.difficultyText}>
                        {book.difficulty === 'easy' ? 'Facile' : book.difficulty === 'medium' ? 'Moyen' : 'Avancé'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {suggestions.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={64} color={colors.neutral.grey} />
              <Text style={styles.emptyText}>
                Aucun livre disponible pour le moment
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {selectedBooks.length > 0
              ? `${selectedBooks.length} livre${selectedBooks.length > 1 ? 's' : ''} sélectionné${selectedBooks.length > 1 ? 's' : ''}`
              : 'Vous pourrez découvrir plus de livres plus tard'}
          </Text>
          <Button
            title="Commencer à lire"
            onPress={handleFinish}
            loading={finishing}
            rightIcon="arrow-forward"
          />
        </View>
      </SafeAreaView>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  header: {
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGrey,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: colors.neutral.cream,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    marginBottom: spacing.md,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    ...typography.h2,
    color: colors.neutral.black,
    textAlign: 'center',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.primary.main,
    textAlign: 'center',
    fontWeight: '600',
  },
  customPreference: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  instruction: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  bookCard: {
    width: '48%',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
  },
  bookCardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '10',
  },
  bookCover: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.neutral.white,
    borderRadius: 14,
  },
  bookInfo: {
    padding: spacing.sm,
  },
  bookTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  bookAuthor: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
    marginBottom: spacing.sm,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.neutral.darkGrey,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  difficulty_easy: {
    backgroundColor: colors.success.light,
  },
  difficulty_medium: {
    backgroundColor: colors.secondary.yellow + '40',
  },
  difficulty_hard: {
    backgroundColor: colors.error.light,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.neutral.black,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.neutral.grey,
    marginTop: spacing.md,
  },
  footer: {
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGrey,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
