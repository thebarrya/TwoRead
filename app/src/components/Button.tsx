import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = true,
  leftIcon,
  rightIcon,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const iconColor = variant === 'primary'
    ? colors.neutral.white
    : colors.primary.main;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.neutral.white : colors.primary.main}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={20}
              color={iconColor}
              style={styles.leftIcon}
            />
          )}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && (
            <Ionicons
              name={rightIcon}
              size={20}
              color={iconColor}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary.main,
    borderWidth: 3,
    borderBottomWidth: 5,
    borderColor: colors.primary.dark,
  },
  secondary: {
    backgroundColor: colors.neutral.white,
    borderWidth: 3,
    borderBottomWidth: 5,
    borderColor: colors.primary.main,
  },
  tertiary: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: colors.neutral.lightGrey,
    borderColor: colors.neutral.lightGrey,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  text: {
    ...typography.button,
  },
  primaryText: {
    color: colors.neutral.white,
  },
  secondaryText: {
    color: colors.primary.main,
  },
  tertiaryText: {
    color: colors.primary.main,
  },
  disabledText: {
    color: colors.neutral.grey,
  },
});
