import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingContainer } from '../../src/components/OnboardingContainer';
import { SelectableCard } from '../../src/components/SelectableCard';

const languages = [
  { id: 'fr', title: 'Francais', emoji: '🇫🇷' },
  { id: 'en', title: 'English', emoji: '🇬🇧' },
  { id: 'es', title: 'Espanol', emoji: '🇪🇸' },
  { id: 'de', title: 'Deutsch', emoji: '🇩🇪' },
];

export default function LanguageScreen() {
  const [selected, setSelected] = useState('fr');

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/motivation',
      params: { language: selected },
    });
  };

  return (
    <OnboardingContainer
      step={1}
      totalSteps={5}
      title="Quelle est votre langue?"
      subtitle="Choisissez la langue de l'application"
      onNext={handleNext}
      canGoNext={!!selected}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {languages.map((lang) => (
          <SelectableCard
            key={lang.id}
            title={lang.title}
            emoji={lang.emoji}
            selected={selected === lang.id}
            onPress={() => setSelected(lang.id)}
          />
        ))}
      </ScrollView>
    </OnboardingContainer>
  );
}
