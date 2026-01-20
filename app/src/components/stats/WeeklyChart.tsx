import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';

interface WeeklyChartProps {
  data: Array<{ day: string; minutes: number; pages: number }>;
  metric: 'minutes' | 'pages';
}

const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const screenWidth = Dimensions.get('window').width;

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, metric }) => {
  // Prepare chart data
  const chartData = {
    labels: DAYS_SHORT,
    datasets: [
      {
        data: DAYS_SHORT.map((day, index) => {
          const dayData = data[index] || { minutes: 0, pages: 0 };
          return metric === 'minutes' ? dayData.minutes : dayData.pages;
        }),
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
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        width={screenWidth - spacing.lg * 2}
        height={250}
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars={false}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
        withInnerLines={true}
      />
      <Text style={styles.label}>
        {metric === 'minutes' ? 'Minutes de lecture' : 'Pages lues'} cette semaine
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
