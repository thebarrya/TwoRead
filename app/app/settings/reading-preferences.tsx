import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';

type Theme = 'light' | 'sepia' | 'dark';
type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
type LineSpacing = 'compact' | 'normal' | 'relaxed';
type Margins = 'narrow' | 'normal' | 'wide';

export default function ReadingPreferencesScreen() {
  const [theme, setTheme] = useState<Theme>('sepia');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>('normal');
  const [margins, setMargins] = useState<Margins>('normal');
  const [autoNightMode, setAutoNightMode] = useState(false);

  const themes: { value: Theme; label: string; icon: string; color: string }[] = [
    { value: 'light', label: 'Clair', icon: 'sunny', color: colors.neutral.white },
    { value: 'sepia', label: 'Sépia', icon: 'book', color: '#F4ECD8' },
    { value: 'dark', label: 'Sombre', icon: 'moon', color: colors.neutral.black },
  ];

  const fontSizes: { value: FontSize; label: string; size: number }[] = [
    { value: 'small', label: 'Petit', size: 14 },
    { value: 'medium', label: 'Moyen', size: 16 },
    { value: 'large', label: 'Grand', size: 18 },
    { value: 'xlarge', label: 'Très grand', size: 20 },
  ];

  const lineSpacings: { value: LineSpacing; label: string }[] = [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Aéré' },
  ];

  const marginOptions: { value: Margins; label: string }[] = [
    { value: 'narrow', label: 'Étroites' },
    { value: 'normal', label: 'Normales' },
    { value: 'wide', label: 'Larges' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thème par défaut</Text>
          <View style={styles.themesContainer}>
            {themes.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.themeOption,
                  { backgroundColor: t.color },
                  theme === t.value && styles.themeOptionSelected,
                ]}
                onPress={() => setTheme(t.value)}
              >
                <Ionicons
                  name={t.icon as any}
                  size={24}
                  color={t.value === 'dark' ? colors.neutral.white : colors.neutral.black}
                />
                <Text
                  style={[
                    styles.themeLabel,
                    { color: t.value === 'dark' ? colors.neutral.white : colors.neutral.black },
                  ]}
                >
                  {t.label}
                </Text>
                {theme === t.value && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary.main} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taille de police</Text>
          <View style={styles.optionsContainer}>
            {fontSizes.map((fs) => (
              <TouchableOpacity
                key={fs.value}
                style={[
                  styles.option,
                  fontSize === fs.value && styles.optionSelected,
                ]}
                onPress={() => setFontSize(fs.value)}
              >
                <Text style={[styles.optionLabel, { fontSize: fs.size }]}>
                  {fs.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.preview}>
            <Text style={[styles.previewText, { fontSize: fontSizes.find(f => f.value === fontSize)?.size }]}>
              Exemple de texte avec cette taille de police. Lorem ipsum dolor sit amet.
            </Text>
          </View>
        </View>

        {/* Line Spacing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Espacement des lignes</Text>
          <View style={styles.optionsContainer}>
            {lineSpacings.map((ls) => (
              <TouchableOpacity
                key={ls.value}
                style={[
                  styles.option,
                  lineSpacing === ls.value && styles.optionSelected,
                ]}
                onPress={() => setLineSpacing(ls.value)}
              >
                <Text style={styles.optionLabel}>{ls.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Margins */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marges</Text>
          <View style={styles.optionsContainer}>
            {marginOptions.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[
                  styles.option,
                  margins === m.value && styles.optionSelected,
                ]}
                onPress={() => setMargins(m.value)}
              >
                <Text style={styles.optionLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Auto Night Mode */}
        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>Mode nuit automatique</Text>
              <Text style={styles.switchDescription}>
                Passer automatiquement au thème sombre la nuit
              </Text>
            </View>
            <Switch
              value={autoNightMode}
              onValueChange={setAutoNightMode}
              trackColor={{ false: colors.neutral.lightGrey, true: colors.primary.light }}
              thumbColor={autoNightMode ? colors.primary.main : colors.neutral.white}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary.main} />
          <Text style={styles.infoText}>
            Ces préférences s'appliqueront lors de votre prochaine session de lecture.
            Vous pourrez les modifier à tout moment depuis le lecteur.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.cream,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.neutral.black,
    marginBottom: spacing.md,
  },
  themesContainer: {
    gap: spacing.md,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
    position: 'relative',
  },
  themeOptionSelected: {
    borderColor: colors.primary.main,
  },
  themeLabel: {
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.md,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
  },
  optionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '20',
  },
  optionLabel: {
    ...typography.body,
    color: colors.neutral.black,
  },
  preview: {
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  previewText: {
    ...typography.body,
    color: colors.neutral.black,
    lineHeight: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  switchInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    ...typography.caption,
    color: colors.neutral.darkGrey,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary.light + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
    gap: spacing.sm,
  },
  infoText: {
    ...typography.caption,
    color: colors.neutral.darkGrey,
    flex: 1,
  },
});
