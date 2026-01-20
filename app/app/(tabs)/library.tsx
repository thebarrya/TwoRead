import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { Book, UserBook } from '../../src/types/database';
import { NatureBackground } from '../../src/components/NatureBackground';
import { useAuthStore } from '../../src/services/authStore';

const FILTERS = ['Tous', 'En cours', 'Termines', 'Favoris'];

export default function LibraryScreen() {
  const { user } = useAuthStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setError(null);
      console.log('📚 Fetching books from Supabase...');

      // Fetch books
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('language', 'fr')
        .order('is_featured', { ascending: false })
        .order('title');

      if (error) {
        console.error('❌ Error fetching books:', error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log(`✅ Fetched ${data?.length || 0} books`);

      if (data) {
        setBooks(data);
        setFilteredBooks(data);
      }

      // Fetch user_books if user is logged in
      if (user?.id) {
        const { data: userBooksData, error: userBooksError } = await supabase
          .from('user_books')
          .select('*')
          .eq('user_id', user.id);

        if (userBooksError) {
          console.error('❌ Error fetching user_books:', userBooksError);
        } else {
          console.log(`✅ Fetched ${userBooksData?.length || 0} user_books`);
          setUserBooks(userBooksData || []);
        }
      }
    } catch (err) {
      console.error('❌ Exception fetching books:', err);
      setError('Erreur de connexion à la base de données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;

    // Filter by status/favorites
    if (activeFilter === 'En cours') {
      const inProgressBookIds = userBooks
        .filter(ub => ub.status === 'in_progress')
        .map(ub => ub.book_id);
      result = result.filter(book => inProgressBookIds.includes(book.id));
    } else if (activeFilter === 'Termines') {
      const completedBookIds = userBooks
        .filter(ub => ub.status === 'completed')
        .map(ub => ub.book_id);
      result = result.filter(book => completedBookIds.includes(book.id));
    } else if (activeFilter === 'Favoris') {
      const favoriteBookIds = userBooks
        .filter(ub => ub.is_favorite === true)
        .map(ub => ub.book_id);
      result = result.filter(book => favoriteBookIds.includes(book.id));
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBooks(result);
  }, [search, books, activeFilter, userBooks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBooks();
    setRefreshing(false);
  };

  const getFilterCount = (filter: string): number => {
    if (filter === 'Tous') {
      return books.length;
    } else if (filter === 'En cours') {
      return userBooks.filter(ub => ub.status === 'in_progress').length;
    } else if (filter === 'Termines') {
      return userBooks.filter(ub => ub.status === 'completed').length;
    } else if (filter === 'Favoris') {
      return userBooks.filter(ub => ub.is_favorite === true).length;
    }
    return 0;
  };

  const renderBookCard = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      <View style={styles.bookCover}>
        {item.cover_url ? (
          <Image source={{ uri: item.cover_url }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="book" size={32} color={colors.neutral.grey} />
          </View>
        )}
        {item.is_featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color={colors.neutral.white} />
          </View>
        )}
      </View>
      <Text style={styles.bookTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>
        {item.author}
      </Text>
      <View style={styles.bookMeta}>
        <Text style={styles.bookChapters}>{item.total_chapters} chapitres</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <NatureBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bibliotheque</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.neutral.darkGrey} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.neutral.grey} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un livre..."
            placeholderTextColor={colors.neutral.grey}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.neutral.grey} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {FILTERS.map((filter) => {
            const count = getFilterCount(filter);
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  activeFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Books Grid */}
        <FlatList
          data={filteredBooks}
          renderItem={renderBookCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.booksGrid}
          columnWrapperStyle={styles.booksRow}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name={error ? "alert-circle-outline" : "book-outline"}
                size={48}
                color={error ? colors.error.main : colors.neutral.grey}
              />
              <Text style={styles.emptyText}>
                {loading ? 'Chargement...' : error || 'Aucun livre trouve'}
              </Text>
              {error && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchBooks}
                >
                  <Ionicons name="refresh" size={20} color={colors.neutral.white} />
                  <Text style={styles.retryButtonText}>Réessayer</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </SafeAreaView>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.neutral.black,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...typography.body,
    color: colors.neutral.black,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.neutral.lightGrey,
  },
  filterChipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
  },
  filterTextActive: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
  booksGrid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  booksRow: {
    justifyContent: 'space-between',
  },
  bookCard: {
    width: '48%',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  bookCover: {
    aspectRatio: 0.7,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.neutral.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.secondary.orange,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.black,
  },
  bookAuthor: {
    ...typography.caption,
    color: colors.neutral.grey,
    marginTop: 2,
  },
  bookMeta: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  bookChapters: {
    ...typography.caption,
    color: colors.primary.main,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.neutral.grey,
    marginTop: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.neutral.white,
  },
});
