import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { Book, UserBook } from '../../src/types/database';
import { NatureBackground } from '../../src/components/NatureBackground';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [currentBook, setCurrentBook] = useState<(UserBook & { books: Book }) | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<boolean[]>([false, false, false, false, false, false, false]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch current book
    const { data: bookData } = await supabase
      .from('user_books')
      .select('*, books(*)')
      .eq('user_id', user.id)
      .eq('status', 'in_progress')
      .order('last_read_at', { ascending: false })
      .limit(1)
      .single();

    if (bookData) {
      setCurrentBook(bookData as any);
    }

    // Fetch weekly progress
    const { data: sessions } = await supabase
      .from('reading_sessions')
      .select('date')
      .eq('user_id', user.id)
      .gte('date', getWeekStart())
      .order('date');

    if (sessions) {
      const progress = DAYS.map((_, index) => {
        const date = getDateForDayIndex(index);
        return sessions.some((s) => s.date === date);
      });
      setWeeklyProgress(progress);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleContinueReading = () => {
    if (currentBook) {
      router.push(`/reader/${currentBook.book_id}`);
    } else {
      router.push('/(tabs)/library');
    }
  };

  return (
    <NatureBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Salut {user?.username || 'Lecteur'}!</Text>
            <Text style={styles.weekLabel}>Semaine {getCurrentWeekNumber()}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.neutral.darkGrey} />
          </TouchableOpacity>
        </View>

        {/* Week Calendar */}
        <View style={styles.weekCalendar}>
          {DAYS.map((day, index) => {
            const isToday = index === getTodayIndex();
            const isCompleted = weeklyProgress[index];
            return (
              <View
                key={index}
                style={[
                  styles.dayCircle,
                  isToday && styles.dayCircleToday,
                  isCompleted && styles.dayCircleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color={colors.neutral.white} />
                ) : (
                  <Text
                    style={[
                      styles.dayText,
                      isToday && styles.dayTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Current Book */}
        <View style={styles.currentBookCard}>
          {currentBook ? (
            <>
              <View style={styles.progressCircle}>
                <View style={styles.progressCircleInner}>
                  <Text style={styles.progressPercent}>
                    {Math.round(currentBook.progress_percent)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.bookTitle}>{(currentBook as any).books?.title}</Text>
              <Text style={styles.bookInfo}>
                Chapitre {currentBook.current_chapter} • {(currentBook as any).books?.total_chapters - currentBook.current_chapter} chapitres restants
              </Text>
            </>
          ) : (
            <>
              <View style={styles.emptyBookIcon}>
                <Ionicons name="book-outline" size={48} color={colors.neutral.grey} />
              </View>
              <Text style={styles.emptyBookText}>Aucun livre en cours</Text>
              <Text style={styles.emptyBookSubtext}>Choisissez un livre pour commencer</Text>
            </>
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentBook ? 'Continuer la lecture' : 'Choisir un livre'}
            onPress={handleContinueReading}
          />
        </View>

        {/* Streak Badge */}
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={24} color={colors.secondary.orange} />
          <Text style={styles.streakText}>
            Serie de {user?.streak_count || 0} jours
          </Text>
        </View>

        {/* Duo Card */}
        <TouchableOpacity
          style={styles.duoCard}
          onPress={() => router.push('/(duo)')}
        >
          <View style={styles.duoIcon}>
            <Ionicons name="people" size={32} color={colors.primary.main} />
          </View>
          <View style={styles.duoContent}>
            <Text style={styles.duoTitle}>Lecture en Duo</Text>
            <Text style={styles.duoSubtitle}>
              Lisez avec vos proches et progressez ensemble
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.neutral.grey} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </NatureBackground>
  );
}

// Helper functions
const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
};

const getDateForDayIndex = (index: number) => {
  const monday = new Date(getWeekStart());
  monday.setDate(monday.getDate() + index);
  return monday.toISOString().split('T')[0];
};

const getTodayIndex = () => {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
};

const getCurrentWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.neutral.black,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  weekLabel: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
  },
  dayCircleToday: {
    borderColor: colors.primary.main,
    borderWidth: 3,
  },
  dayCircleCompleted: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  dayText: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
    fontWeight: '600',
  },
  dayTextToday: {
    color: colors.primary.main,
  },
  currentBookCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressCircleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary.light + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    ...typography.h1,
    color: colors.primary.dark,
  },
  bookTitle: {
    ...typography.h3,
    color: colors.neutral.black,
    textAlign: 'center',
  },
  bookInfo: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
    marginTop: spacing.xs,
  },
  emptyBookIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.neutral.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyBookText: {
    ...typography.h3,
    color: colors.neutral.darkGrey,
  },
  emptyBookSubtext: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
    marginTop: spacing.xs,
  },
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary.orange + '20',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.pill,
  },
  streakText: {
    ...typography.body,
    color: colors.secondary.orange,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  duoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  duoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.light + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  duoContent: {
    flex: 1,
  },
  duoTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  duoSubtitle: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
});
