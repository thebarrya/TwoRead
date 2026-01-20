import { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OnboardingContainer } from '../../src/components/OnboardingContainer';
import { useAuthStore } from '../../src/services/authStore';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';

export default function ConfirmScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const handleComplete = async () => {
    setLoading(true);

    const obstaclesString = params.reading_obstacles as string;
    const obstacles = obstaclesString ? obstaclesString.split(',') : [];

    const { error } = await completeOnboarding({
      language: (params.language as string) || 'fr',
      motivation: (params.motivation as string) || 'culture',
      daily_goal_minutes: parseInt(params.daily_goal_minutes as string) || 10,
      reading_obstacles: obstacles,
      reading_reason: 'personal',
      notifications_enabled: true,
    });

    setLoading(false);

    if (!error) {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <OnboardingContainer
      step={5}
      totalSteps={5}
      title="Vous etes pret!"
      subtitle="Votre profil est configure. Commencez votre aventure de lecture!"
      onNext={handleComplete}
      nextLabel="Commencer a lire"
      loading={loading}
    >
      <View style={styles.container}>
        <View style={styles.mascot}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Votre profil</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Objectif quotidien</Text>
            <Text style={styles.summaryValue}>
              {params.daily_goal_minutes || 10} min/jour
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Motivation</Text>
            <Text style={styles.summaryValue}>
              {getMotivationLabel(params.motivation as string)}
            </Text>
          </View>
        </View>

        <View style={styles.features}>
          <FeatureItem emoji="📖" text="Acces a 12+ livres classiques" />
          <FeatureItem emoji="🔥" text="Systeme de series (streaks)" />
          <FeatureItem emoji="👥" text="Lecture en duo avec vos proches" />
          <FeatureItem emoji="🏆" text="Classements et badges" />
        </View>
      </View>
    </OnboardingContainer>
  );
}

const FeatureItem = ({ emoji, text }: { emoji: string; text: string }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const getMotivationLabel = (motivation: string) => {
  const labels: Record<string, string> = {
    culture: 'Me cultiver',
    relax: 'Me detendre',
    habit: 'Creer une habitude',
    social: 'Partager',
    improve: "M'ameliorer",
  };
  return labels[motivation] || 'Me cultiver';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  mascot: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mascotImage: {
    width: 100,
    height: 100,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGrey,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.neutral.darkGrey,
  },
  summaryValue: {
    ...typography.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
  features: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.neutral.black,
  },
});
