import { useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OnboardingContainer } from '../../src/components/OnboardingContainer';
import { SelectableCard } from '../../src/components/SelectableCard';

const obstacles = [
  { id: 'time', title: 'Manque de temps', icon: 'time-outline' as const },
  { id: 'focus', title: 'Difficulte a me concentrer', icon: 'eye-outline' as const },
  { id: 'motivation', title: 'Manque de motivation', icon: 'battery-dead-outline' as const },
  { id: 'choice', title: 'Ne sais pas quoi lire', icon: 'help-circle-outline' as const },
  { id: 'habit', title: 'Pas l\'habitude', icon: 'repeat-outline' as const },
  { id: 'tired', title: 'Trop fatigue(e)', icon: 'moon-outline' as const },
];

export default function ObstaclesScreen() {
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleObstacle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/genre',
      params: { ...params, reading_obstacles: selected.join(',') },
    });
  };

  return (
    <OnboardingContainer
      step={4}
      totalSteps={6}
      title="Qu'est-ce qui vous empeche de lire?"
      subtitle="Selectionnez tous les obstacles qui s'appliquent"
      onNext={handleNext}
      canGoNext={selected.length > 0}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {obstacles.map((item) => (
          <SelectableCard
            key={item.id}
            title={item.title}
            icon={item.icon}
            selected={selected.includes(item.id)}
            onPress={() => toggleObstacle(item.id)}
            multiSelect
          />
        ))}
      </ScrollView>
    </OnboardingContainer>
  );
}
