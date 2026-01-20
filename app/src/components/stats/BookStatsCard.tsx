import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';
import { BookAnalytics } from '../../types/database';

const screenWidth = Dimensions.get('window').width;

interface BookStatsCardProps {
  analytics: BookAnalytics | null;
}

export const BookStatsCard: React.FC<BookStatsCardProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={64} color={colors.neutral.grey} />
        <Text style={styles.emptyText}>
          Commencez à lire pour voir vos statistiques de livres
        </Text>
      </View>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Prepare emotions data for bar chart
  const emotionsEntries = Object.entries(analytics.books_by_emotion || {});
  const hasEmotions = emotionsEntries.length > 0;

  const emotionsChartData = hasEmotions ? {
    labels: emotionsEntries.map(([emotion]) => getEmotionEmoji(emotion)),
    datasets: [{
      data: emotionsEntries.map(([, count]) => count),
    }],
  } : null;

  const emotionsChartConfig = {
    backgroundColor: colors.neutral.white,
    backgroundGradientFrom: colors.neutral.white,
    backgroundGradientTo: colors.neutral.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(102, 187, 106, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(97, 97, 97, ${opacity})`,
    barPercentage: 0.7,
  };

  // Prepare ratings data
  const ratingsEntries = Object.entries(analytics.books_by_rating || {}).sort(
    ([a], [b]) => Number(b) - Number(a)
  );
  const hasRatings = ratingsEntries.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analyses par livre</Text>

      {/* Summary Stats */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Ionicons name="time-outline" size={24} color={colors.primary.main} />
          <Text style={styles.summaryValue}>
            {formatTime(analytics.average_time_per_book)}
          </Text>
          <Text style={styles.summaryLabel}>Temps moyen par livre</Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.success.main} />
          <Text style={styles.summaryValue}>{analytics.completion_rate}%</Text>
          <Text style={styles.summaryLabel}>Taux de complétion</Text>
        </View>
      </View>

      {/* Fastest & Slowest Books */}
      {(analytics.fastest_book || analytics.slowest_book) && (
        <View style={styles.recordsContainer}>
          {analytics.fastest_book && (
            <View style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Ionicons name="flash" size={20} color={colors.secondary.yellow} />
                <Text style={styles.recordTitle}>Plus rapide</Text>
              </View>
              <Text style={styles.recordBook} numberOfLines={2}>
                {analytics.fastest_book.title}
              </Text>
              <Text style={styles.recordTime}>
                {formatTime(analytics.fastest_book.minutes)}
              </Text>
            </View>
          )}

          {analytics.slowest_book && (
            <View style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Ionicons name="hourglass" size={20} color={colors.semantic.info} />
                <Text style={styles.recordTitle}>Plus long</Text>
              </View>
              <Text style={styles.recordBook} numberOfLines={2}>
                {analytics.slowest_book.title}
              </Text>
              <Text style={styles.recordTime}>
                {formatTime(analytics.slowest_book.minutes)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Ratings Distribution */}
      {hasRatings && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Distribution des notes</Text>
          <View style={styles.ratingsList}>
            {ratingsEntries.map(([rating, count]) => (
              <View key={rating} style={styles.ratingRow}>
                <View style={styles.ratingStars}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < Number(rating) ? 'star' : 'star-outline'}
                      size={16}
                      color={colors.secondary.yellow}
                    />
                  ))}
                </View>
                <View style={styles.ratingBar}>
                  <View
                    style={[
                      styles.ratingBarFill,
                      {
                        width: `${(count / Math.max(...ratingsEntries.map(([, c]) => c))) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.ratingCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Emotions Distribution */}
      {hasEmotions && emotionsChartData && (
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Émotions ressenties</Text>
          <BarChart
            data={emotionsChartData}
            width={screenWidth - spacing.lg * 4}
            height={200}
            chartConfig={emotionsChartConfig}
            style={styles.emotionsChart}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            showValuesOnTopOfBars={true}
            withInnerLines={false}
          />
        </View>
      )}
    </View>
  );
};

// Helper to get emoji for emotion
const getEmotionEmoji = (emotion: string): string => {
  const emojiMap: Record<string, string> = {
    love: '❤️',
    happy: '😊',
    neutral: '😐',
    confused: '😕',
    sad: '😢',
  };
  return emojiMap[emotion] || emotion;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.neutral.grey,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.neutral.cream,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h2,
    color: colors.neutral.black,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.neutral.grey,
    textAlign: 'center',
  },
  recordsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  recordCard: {
    flex: 1,
    backgroundColor: colors.neutral.cream,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recordTitle: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  recordBook: {
    ...typography.bodySmall,
    color: colors.neutral.black,
    marginBottom: spacing.xs,
    minHeight: 32,
  },
  recordTime: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
  chartSection: {
    marginTop: spacing.lg,
  },
  chartTitle: {
    ...typography.body,
    color: colors.neutral.black,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  ratingsList: {
    gap: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ratingStars: {
    flexDirection: 'row',
    width: 80,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.neutral.lightGrey,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
  },
  ratingCount: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  emotionsChart: {
    borderRadius: borderRadius.md,
    alignSelf: 'center',
  },
});
