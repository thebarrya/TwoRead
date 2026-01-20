import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';

interface MonthlyChartProps {
  data: Array<{ week: number; minutes: number; pages: number }>;
  metric: 'minutes' | 'pages';
}

const screenWidth = Dimensions.get('window').width;

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ data, metric }) => {
  // Ensure we have data for all 4-5 weeks
  const weeks = [1, 2, 3, 4, 5];
  const chartValues = weeks.map((week) => {
    const weekData = data.find((d) => d.week === week);
    if (!weekData) return 0;
    return metric === 'minutes' ? weekData.minutes : weekData.pages;
  });

  const chartData = {
    labels: ['S1', 'S2', 'S3', 'S4', 'S5'],
    datasets: [
      {
        data: chartValues,
        color: (opacity = 1) => `rgba(102, 187, 106, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.neutral.white,
    backgroundGradientFrom: colors.neutral.white,
    backgroundGradientTo: colors.neutral.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(102, 187, 106, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(97, 97, 97, ${opacity})`,
    style: {
      borderRadius: borderRadius.lg,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.neutral.lightGrey,
      strokeWidth: 0.5,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary.main,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - spacing.lg * 2}
        height={250}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        fromZero
        yAxisSuffix=""
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
      />
      <Text style={styles.label}>
        {metric === 'minutes' ? 'Minutes de lecture' : 'Pages lues'} ce mois-ci
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    borderRadius: borderRadius.lg,
  },
  label: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
