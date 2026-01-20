import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { Book } from '../../src/types/database';
import { NatureBackground } from '../../src/components/NatureBackground';

export default function BookDetailScreen() {
  const { bookId } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [book, setBook] = useState<Book | null>(null);
  const [userBook, setUserBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    // Fetch book
    const { data: bookData } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookData) {
      setBook(bookData);
    }

    // Fetch user's relationship with book
    if (user) {
      const { data: userBookData } = await supabase
        .from('user_books')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .single();

      if (userBookData) {
        setUserBook(userBookData);
      }
    }

    setLoading(false);
  };

  const handleStartReading = async () => {
    if (!user || !book) return;

    setAdding(true);

    // Add to library if not already there
    if (!userBook) {
      const { error } = await supabase.from('user_books').insert({
        user_id: user.id,
        book_id: book.id,
        status: 'in_progress',
        started_at: new Date().toISOString(),
      });

      if (error) {
        Alert.alert('Erreur', 'Impossible d\'ajouter le livre');
        setAdding(false);
        return;
      }
    } else {
      // Update status to in_progress
      await supabase
        .from('user_books')
        .update({ status: 'in_progress' })
        .eq('id', userBook.id);
    }

    setAdding(false);
    router.push(`/reader/${book.id}`);
  };

  const handleStartDuo = async () => {
    if (!user || !book) return;

    const { data, error } = await supabase.rpc('create_reading_duo', {
      p_creator_id: user.id,
      p_book_id: book.id,
    });

    if (error) {
      Alert.alert('Erreur', error.message);
      return;
    }

    Alert.alert(
      'Duo cree!',
      `Partagez ce code avec votre partenaire:\n\n${data.invite_code}`,
      [{ text: 'OK' }]
    );
  };

  if (loading || !book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NatureBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.neutral.black} />
          </TouchableOpacity>
        </View>

        {/* Book Cover */}
        <View style={styles.coverContainer}>
          {book.cover_url ? (
            <Image source={{ uri: book.cover_url }} style={styles.cover} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="book" size={64} color={colors.neutral.grey} />
            </View>
          )}
        </View>

        {/* Book Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="document-text-outline" size={18} color={colors.primary.main} />
              <Text style={styles.statText}>{book.total_chapters} chapitres</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={18} color={colors.primary.main} />
              <Text style={styles.statText}>{book.total_pages} pages</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name={
                  book.difficulty === 'easy'
                    ? 'leaf-outline'
                    : book.difficulty === 'medium'
                    ? 'book-outline'
                    : 'flame-outline'
                }
                size={18}
                color={colors.primary.main}
              />
              <Text style={styles.statText}>
                {book.difficulty === 'easy'
                  ? 'Facile'
                  : book.difficulty === 'medium'
                  ? 'Moyen'
                  : 'Difficile'}
              </Text>
            </View>
          </View>

          {/* Progress if exists */}
          {userBook && userBook.status === 'in_progress' && (
            <View style={styles.progressCard}>
              <Text style={styles.progressLabel}>Votre progression</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${userBook.progress_percent}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                Chapitre {userBook.current_chapter} sur {book.total_chapters}
              </Text>
            </View>
          )}

          {/* Description */}
          {book.description && (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{book.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          title={
            userBook?.status === 'in_progress'
              ? 'Continuer la lecture'
              : 'Commencer a lire'
          }
          onPress={handleStartReading}
          loading={adding}
        />
        <TouchableOpacity style={styles.duoButton} onPress={handleStartDuo}>
          <Ionicons name="people" size={20} color={colors.primary.main} />
          <Text style={styles.duoButtonText}>Lire en duo</Text>
        </TouchableOpacity>
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
  },
  scrollContent: {
    paddingBottom: 150,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cover: {
    width: 180,
    height: 270,
    borderRadius: borderRadius.lg,
  },
  coverPlaceholder: {
    width: 180,
    height: 270,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.neutral.black,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  author: {
    ...typography.body,
    color: colors.neutral.grey,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
  },
  progressCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  progressLabel: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.neutral.lightGrey,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 4,
  },
  progressText: {
    ...typography.caption,
    color: colors.primary.main,
  },
  descriptionCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  descriptionTitle: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    lineHeight: 24,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGrey,
  },
  duoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  duoButtonText: {
    ...typography.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
});
