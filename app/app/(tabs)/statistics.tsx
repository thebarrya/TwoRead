import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NatureBackground } from '../../src/components/NatureBackground';
import { StatCard } from '../../src/components/stats/StatCard';
import { WeeklyChart } from '../../src/components/stats/WeeklyChart';
import { MonthlyChart } from '../../src/components/stats/MonthlyChart';
import { ReadingHeatmap } from '../../src/components/stats/ReadingHeatmap';
import { BookStatsCard } from '../../src/components/stats/BookStatsCard';
import { StatCardSkeleton, ChartSkeleton } from '../../src/components/stats/LoadingSkeleton';
import { ErrorView } from '../../src/components/stats/ErrorView';
import { useStatistics } from '../../src/hooks/useStatistics';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';

type PeriodTab = 'week' | 'month' | 'all';
type MetricToggle = 'minutes' | 'pages';

const DAYS_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Helper function to prepare weekly chart data
const prepareWeeklyChartData = (weeklyData: any) => {
  const result = [];
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];

    // Find matching day data
    const dayData = weeklyData?.days?.find((d: any) => d.date === dateString);

    result.push({
      day: DAYS_LABELS[i],
      minutes: dayData?.minutes || 0,
      pages: dayData?.pages || 0,
    });
  }

  return result;
};

export default function StatisticsScreen() {
  const {
    overview,
    weeklyData,
    monthlyData,
    allTimeData,
    bookAnalytics,
    isLoading,
    error,
    refreshAll,
    loadMonthly,
    loadAllTime,
    loadBookAnalytics,
  } = useStatistics();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodTab>('week');
  const [selectedMetric, setSelectedMetric] = useState<MetricToggle>('minutes');

  // Load book analytics on mount
  useEffect(() => {
    if (!bookAnalytics) {
      loadBookAnalytics();
    }
  }, []);

  // Load data based on selected period
  useEffect(() => {
    if (selectedPeriod === 'month' && !monthlyData) {
      loadMonthly();
    } else if (selectedPeriod === 'all' && !allTimeData) {
      loadAllTime();
    }
  }, [selectedPeriod]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  };

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
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
            <Text style={styles.title}>Mes Statistiques</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color={colors.neutral.darkGrey} />
            </TouchableOpacity>
          </View>

          {/* Overview Section - 4 StatCards in Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
            {error ? (
              <ErrorView
                message="Impossible de charger les statistiques"
                onRetry={refreshAll}
              />
            ) : (
              <View style={styles.statsGrid}>
                {isLoading && !overview ? (
                  <>
                    <View style={styles.statCardWrapper}>
                      <StatCardSkeleton />
                    </View>
                    <View style={styles.statCardWrapper}>
                      <StatCardSkeleton />
                    </View>
                    <View style={styles.statCardWrapper}>
                      <StatCardSkeleton />
                    </View>
                    <View style={styles.statCardWrapper}>
                      <StatCardSkeleton />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.statCardWrapper}>
                      <StatCard
                        icon="flame"
                        iconColor={colors.secondary.orange}
                        value={overview?.streak_count || 0}
                        label="Série actuelle"
                        subtitle="jours consécutifs"
                      />
                    </View>
                    <View style={styles.statCardWrapper}>
                      <StatCard
                        icon="book"
                        iconColor={colors.primary.main}
                        value={overview?.total_books_read || 0}
                        label="Livres lus"
                        subtitle="complétés"
                      />
                    </View>
                    <View style={styles.statCardWrapper}>
                      <StatCard
                        icon="document-text"
                        iconColor={colors.semantic.info}
                        value={overview?.total_pages_read || 0}
                        label="Pages lues"
                        subtitle="au total"
                      />
                    </View>
                    <View style={styles.statCardWrapper}>
                      <StatCard
                        icon="time"
                        iconColor={colors.secondary.yellow}
                        value={formatHours(overview?.total_minutes_read || 0)}
                        label="Temps de lecture"
                        subtitle="cumulé"
                      />
                    </View>
                  </>
                )}
              </View>
            )}
          </View>

          {/* Period Tabs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tendances</Text>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedPeriod === 'week' && styles.tabActive,
                ]}
                onPress={() => setSelectedPeriod('week')}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedPeriod === 'week' && styles.tabTextActive,
                  ]}
                >
                  Semaine
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedPeriod === 'month' && styles.tabActive,
                ]}
                onPress={() => setSelectedPeriod('month')}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedPeriod === 'month' && styles.tabTextActive,
                  ]}
                >
                  Mois
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedPeriod === 'all' && styles.tabActive,
                ]}
                onPress={() => setSelectedPeriod('all')}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedPeriod === 'all' && styles.tabTextActive,
                  ]}
                >
                  Tout
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Metric Toggle */}
          <View style={styles.metricToggleContainer}>
            <TouchableOpacity
              style={[
                styles.metricButton,
                selectedMetric === 'minutes' && styles.metricButtonActive,
              ]}
              onPress={() => setSelectedMetric('minutes')}
            >
              <Text
                style={[
                  styles.metricButtonText,
                  selectedMetric === 'minutes' && styles.metricButtonTextActive,
                ]}
              >
                Minutes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.metricButton,
                selectedMetric === 'pages' && styles.metricButtonActive,
              ]}
              onPress={() => setSelectedMetric('pages')}
            >
              <Text
                style={[
                  styles.metricButtonText,
                  selectedMetric === 'pages' && styles.metricButtonTextActive,
                ]}
              >
                Pages
              </Text>
            </TouchableOpacity>
          </View>

          {/* Charts Section */}
          {isLoading && (
            selectedPeriod === 'week' && !weeklyData ||
            selectedPeriod === 'month' && !monthlyData ||
            selectedPeriod === 'all' && !allTimeData
          ) ? (
            <ChartSkeleton />
          ) : (
            <>
              {/* Weekly Chart */}
              {selectedPeriod === 'week' && weeklyData && (
                <WeeklyChart
                  data={prepareWeeklyChartData(weeklyData)}
                  metric={selectedMetric}
                />
              )}

              {/* Monthly Chart */}
              {selectedPeriod === 'month' && monthlyData && (
                <MonthlyChart
                  data={monthlyData.weeks || []}
                  metric={selectedMetric}
                />
              )}

              {/* All Time Heatmap */}
              {selectedPeriod === 'all' && allTimeData && (
                <ReadingHeatmap
                  sessions={allTimeData.sessions || []}
                  year={new Date().getFullYear()}
                />
              )}
            </>
          )}

          {/* Book Analytics Section */}
          <View style={styles.section}>
            <BookStatsCard analytics={bookAnalytics} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.neutral.black,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.md,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  statCardWrapper: {
    width: '50%',
    padding: spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.primary.main,
  },
  tabText: {
    ...typography.body,
    color: colors.neutral.grey,
  },
  tabTextActive: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
  metricToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  metricButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  metricButtonActive: {
    backgroundColor: colors.primary.light,
  },
  metricButtonText: {
    ...typography.body,
    color: colors.neutral.grey,
  },
  metricButtonTextActive: {
    color: colors.primary.dark,
    fontWeight: '600',
  },
  chartPlaceholder: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  placeholderText: {
    ...typography.body,
    color: colors.neutral.grey,
    marginTop: spacing.md,
  },
});
