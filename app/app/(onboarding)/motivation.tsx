import { useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OnboardingContainer } from '../../src/components/OnboardingContainer';
import { SelectableCard } from '../../src/components/SelectableCard';

const motivations = [
  { id: 'culture', title: 'Me cultiver', subtitle: 'Apprendre de nouvelles choses', icon: 'book-outline' as const },
  { id: 'relax', title: 'Me detendre', subtitle: 'Echapper au quotidien', icon: 'leaf-outline' as const },
  { id: 'habit', title: 'Creer une habitude', subtitle: 'Lire tous les jours', icon: 'calendar-outline' as const },
  { id: 'social', title: 'Partager', subtitle: 'Lire avec mes proches', icon: 'people-outline' as const },
  { id: 'improve', title: 'M\'ameliorer', subtitle: 'Developper mes competences', icon: 'trending-up-outline' as const },
];

export default function MotivationScreen() {
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/goal',
      params: { ...params, motivation: selected },
    });
  };

  return (
    <OnboardingContainer
      step={2}
      totalSteps={5}
      title="Pourquoi voulez-vous lire?"
      subtitle="Cela nous aide a personnaliser votre experience"
      onNext={handleNext}
      canGoNext={!!selected}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {motivations.map((item) => (
          <SelectableCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            selected={selected === item.id}
            onPress={() => setSelected(item.id)}
          />
        ))}
      </ScrollView>
    </OnboardingContainer>
  );
}
