import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string | number;
  label: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = React.memo(({
  icon,
  iconColor,
  value,
  label,
  subtitle,
}) => {
  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityLabel={`${label}: ${value}${subtitle ? ', ' + subtitle : ''}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={28} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  value: {
    ...typography.h1,
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.neutral.darkGrey,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
