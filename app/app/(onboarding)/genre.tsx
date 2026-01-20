import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OnboardingContainer } from '../../src/components/OnboardingContainer';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { Ionicons } from '@expo/vector-icons';

type GenreOption = 'litterature' | 'policier' | 'romance' | 'autre';

const GENRE_OPTIONS = [
  { id: 'litterature' as GenreOption, label: 'Littérature', icon: 'book' as const },
  { id: 'policier' as GenreOption, label: 'Roman policier', icon: 'search' as const },
  { id: 'romance' as GenreOption, label: 'Romance', icon: 'heart' as const },
  { id: 'autre' as GenreOption, label: 'Je ne sais pas', icon: 'help-circle' as const },
];

export default function GenreScreen() {
  const params = useLocalSearchParams();
  const [selectedGenre, setSelectedGenre] = useState<GenreOption | null>(null);
  const [customInput, setCustomInput] = useState('');

  const handleNext = () => {
    if (!selectedGenre) return;

    router.push({
      pathname: '/(onboarding)/suggestions',
      params: {
        ...params,
        preferred_genre: selectedGenre,
        custom_preference: customInput,
      },
    });
  };

  return (
    <OnboardingContainer
      step={5}
      totalSteps={6}
      title="Que voulez-vous lire ?"
      subtitle="Aidez-nous à personnaliser votre expérience de lecture"
      onNext={handleNext}
      nextLabel="Voir les suggestions"
      nextDisabled={!selectedGenre}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {GENRE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.genreOption,
                selectedGenre === option.id && styles.genreOptionSelected,
              ]}
              onPress={() => setSelectedGenre(option.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  selectedGenre === option.id && styles.iconContainerSelected,
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={28}
                  color={
                    selectedGenre === option.id
                      ? colors.neutral.white
                      : colors.primary.main
                  }
                />
              </View>
              <Text
                style={[
                  styles.genreLabel,
                  selectedGenre === option.id && styles.genreLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              {selectedGenre === option.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary.main}
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}

          {selectedGenre === 'autre' && (
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>
                Quel est votre dernier livre lu ou aimé ?
              </Text>
              <TextInput
                style={styles.customInput}
                placeholder="Ex: Harry Potter, Le Petit Prince, 1984..."
                placeholderTextColor={colors.neutral.grey}
                value={customInput}
                onChangeText={setCustomInput}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={styles.customInputHint}>
                💡 Nous vous suggérerons des livres similaires
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  genreOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
  },
  genreOptionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '20',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary.main,
  },
  genreLabel: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    flex: 1,
    fontWeight: '500',
  },
  genreLabelSelected: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  customInputContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.neutral.cream,
    borderRadius: borderRadius.md,
  },
  customInputLabel: {
    ...typography.bodySmall,
    color: colors.neutral.black,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  customInput: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    ...typography.body,
    color: colors.neutral.black,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.neutral.lightGrey,
  },
  customInputHint: {
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
