import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OnboardingContainer } from '../../src/components/OnboardingContainer';
import { SelectableCard } from '../../src/components/SelectableCard';
import { colors, spacing, typography } from '../../src/theme/colors';

const goals = [
  { id: 5, title: '5 minutes', subtitle: 'Parfait pour debuter', emoji: '🌱' },
  { id: 10, title: '10 minutes', subtitle: 'Un bon equilibre', emoji: '📖' },
  { id: 15, title: '15 minutes', subtitle: 'Pour les motives', emoji: '🔥' },
  { id: 30, title: '30 minutes', subtitle: 'Mode expert', emoji: '🏆' },
];

export default function GoalScreen() {
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState(10);

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/obstacles',
      params: { ...params, daily_goal_minutes: selected.toString() },
    });
  };

  return (
    <OnboardingContainer
      step={3}
      totalSteps={5}
      title="Votre objectif quotidien?"
      subtitle="Combien de temps voulez-vous lire chaque jour?"
      onNext={handleNext}
      canGoNext={!!selected}
    >
      <View style={styles.container}>
        {goals.map((item) => (
          <SelectableCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            emoji={item.emoji}
            selected={selected === item.id}
            onPress={() => setSelected(item.id)}
          />
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Vous pourrez modifier cet objectif plus tard dans les parametres
          </Text>
        </View>
      </View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primary.light + '30',
    borderRadius: 12,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.primary.dark,
    textAlign: 'center',
  },
});
