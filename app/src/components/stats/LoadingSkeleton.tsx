import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/colors';

export const StatCardSkeleton: React.FC = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.iconSkeleton, { opacity }]} />
      <Animated.View style={[styles.valueSkeleton, { opacity }]} />
      <Animated.View style={[styles.labelSkeleton, { opacity }]} />
    </View>
  );
};

export const ChartSkeleton: React.FC = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.chartCard}>
      <Animated.View style={[styles.chartSkeleton, { opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  iconSkeleton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.neutral.lightGrey,
    marginBottom: spacing.md,
  },
  valueSkeleton: {
    width: 60,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.lightGrey,
    marginBottom: spacing.xs,
  },
  labelSkeleton: {
    width: 80,
    height: 16,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.lightGrey,
  },
  chartCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  chartSkeleton: {
    width: '100%',
    height: 250,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.lightGrey,
  },
});
