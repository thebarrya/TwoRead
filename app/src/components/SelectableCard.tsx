import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../theme/colors';

interface SelectableCardProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  subtitle,
  emoji,
  icon,
  selected,
  onPress,
  multiSelect = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        {icon && (
          <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
            <Ionicons
              name={icon}
              size={24}
              color={selected ? colors.primary.main : colors.neutral.darkGrey}
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && (
          <Ionicons
            name={multiSelect ? 'checkmark' : 'checkmark'}
            size={16}
            color={colors.neutral.white}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
    marginBottom: spacing.sm,
  },
  containerSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '20',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary.light + '40',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.neutral.black,
  },
  titleSelected: {
    color: colors.primary.dark,
  },
  subtitle: {
    ...typography.caption,
    color: colors.neutral.grey,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
});
