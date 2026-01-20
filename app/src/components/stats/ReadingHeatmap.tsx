import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';

interface ReadingHeatmapProps {
  sessions: Array<{ date: string; minutes: number; pages: number }>;
  year: number;
}

export const ReadingHeatmap: React.FC<ReadingHeatmapProps> = ({
  sessions,
  year,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Helper to get intensity color based on minutes
  const getIntensityColor = (minutes: number) => {
    if (minutes === 0) return colors.neutral.lightGrey;
    if (minutes < 10) return colors.primary.light + '60';
    if (minutes < 30) return colors.primary.light;
    if (minutes < 60) return colors.primary.main;
    return colors.primary.dark;
  };

  // Generate grid data for the year
  const generateYearGrid = () => {
    const grid: Array<Array<{ date: string; minutes: number }>> = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Find the first Monday of the year (or before)
    const firstDay = new Date(startDate);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 1);

    let currentWeek: Array<{ date: string; minutes: number }> = [];
    let currentDate = new Date(firstDay);

    while (currentDate <= endDate || currentWeek.length > 0) {
      const dateString = currentDate.toISOString().split('T')[0];
      const session = sessions.find((s) => s.date === dateString);
      const minutes = session?.minutes || 0;

      currentWeek.push({
        date: dateString,
        minutes: minutes,
      });

      // Complete week reached
      if (currentWeek.length === 7) {
        grid.push([...currentWeek]);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);

      // Stop after end of year
      if (currentDate > endDate && currentWeek.length === 0) break;
    }

    // Fill last incomplete week if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', minutes: 0 });
      }
      grid.push(currentWeek);
    }

    return grid;
  };

  const yearGrid = generateYearGrid();
  const totalDays = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const avgMinutes = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0;

  const selectedSession = selectedDate
    ? sessions.find((s) => s.date === selectedDate)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activité de lecture {year}</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {totalDays} jours • {Math.round(totalMinutes / 60)}h total
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Moins</Text>
        <View style={styles.legendColors}>
          <View
            style={[styles.legendBox, { backgroundColor: colors.neutral.lightGrey }]}
          />
          <View
            style={[
              styles.legendBox,
              { backgroundColor: colors.primary.light + '60' },
            ]}
          />
          <View
            style={[styles.legendBox, { backgroundColor: colors.primary.light }]}
          />
          <View
            style={[styles.legendBox, { backgroundColor: colors.primary.main }]}
          />
          <View
            style={[styles.legendBox, { backgroundColor: colors.primary.dark }]}
          />
        </View>
        <Text style={styles.legendText}>Plus</Text>
      </View>

      {/* Heatmap Grid - Limited to show only 12 weeks */}
      <View style={styles.gridContainer}>
        {yearGrid.slice(0, 12).map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekColumn}>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={`${weekIndex}-${dayIndex}`}
                style={[
                  styles.dayBox,
                  {
                    backgroundColor: day.date
                      ? getIntensityColor(day.minutes)
                      : 'transparent',
                  },
                  selectedDate === day.date && styles.dayBoxSelected,
                ]}
                onPress={() => day.date && setSelectedDate(day.date)}
                disabled={!day.date}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Selected Date Info */}
      {selectedSession && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipDate}>{selectedSession.date}</Text>
          <Text style={styles.tooltipText}>
            {selectedSession.minutes} min • {selectedSession.pages} pages
          </Text>
        </View>
      )}

      <Text style={styles.note}>
        Affichage limité aux 12 dernières semaines
      </Text>
    </View>
  );
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
  header: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  legendText: {
    ...typography.caption,
    color: colors.neutral.grey,
    marginHorizontal: spacing.sm,
  },
  legendColors: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: spacing.md,
  },
  weekColumn: {
    gap: 2,
  },
  dayBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  dayBoxSelected: {
    borderWidth: 2,
    borderColor: colors.neutral.black,
  },
  tooltip: {
    backgroundColor: colors.neutral.cream,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  tooltipDate: {
    ...typography.body,
    color: colors.neutral.black,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  tooltipText: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
  },
  note: {
    ...typography.caption,
    color: colors.neutral.grey,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
