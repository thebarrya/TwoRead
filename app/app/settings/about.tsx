import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '1';

export default function AboutScreen() {
  const handleOpenWebsite = () => {
    Linking.openURL('https://tworead.app');
  };

  const handleOpenGithub = () => {
    Linking.openURL('https://github.com/tworead');
  };

  const handleSendEmail = () => {
    Linking.openURL('mailto:contact@tworead.app');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo and Info */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>TwoRead</Text>
          <Text style={styles.tagline}>Lisez ensemble, progressez ensemble</Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version {APP_VERSION}</Text>
            <Text style={styles.buildText}>Build {BUILD_NUMBER}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>
            TwoRead est une application de lecture sociale qui vous permet de découvrir,
            lire et partager vos livres préférés avec vos amis. Créez des duos de lecture,
            suivez vos progrès et participez à des défis communautaires.
          </Text>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liens</Text>

          <TouchableOpacity style={styles.linkItem} onPress={handleOpenWebsite}>
            <View style={styles.linkIcon}>
              <Ionicons name="globe-outline" size={24} color={colors.primary.main} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Site web</Text>
              <Text style={styles.linkSubtitle}>tworead.app</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={handleOpenGithub}>
            <View style={styles.linkIcon}>
              <Ionicons name="logo-github" size={24} color={colors.primary.main} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>GitHub</Text>
              <Text style={styles.linkSubtitle}>Contribuer au projet</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={handleSendEmail}>
            <View style={styles.linkIcon}>
              <Ionicons name="mail-outline" size={24} color={colors.primary.main} />
            </View>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Contact</Text>
              <Text style={styles.linkSubtitle}>contact@tworead.app</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.grey} />
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crédits</Text>
          <View style={styles.creditsBox}>
            <Text style={styles.creditsText}>
              Développé avec ❤️ par l'équipe TwoRead
            </Text>
            <Text style={styles.creditsText}>
              {'\n'}Merci à tous nos contributeurs et utilisateurs !
            </Text>
          </View>
        </View>

        {/* Open Source Licenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Licences open source</Text>
          <View style={styles.licensesBox}>
            <Text style={styles.licenseItem}>• React Native</Text>
            <Text style={styles.licenseItem}>• Expo</Text>
            <Text style={styles.licenseItem}>• Supabase</Text>
            <Text style={styles.licenseItem}>• Zustand</Text>
            <Text style={styles.licenseItem}>• React Navigation</Text>
            <Text style={styles.licenseItem}>• Expo Vector Icons</Text>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.legalText}>
            © 2024 TwoRead. Tous droits réservés.
          </Text>
          <Text style={styles.legalText}>
            Fait avec passion pour les amoureux de la lecture.
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
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    ...typography.h1,
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  versionText: {
    ...typography.bodySmall,
    color: colors.primary.main,
    fontWeight: '600',
  },
  buildText: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.neutral.black,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.neutral.black,
    marginBottom: 2,
  },
  linkSubtitle: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
  creditsBox: {
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  creditsText: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
    lineHeight: 24,
  },
  licensesBox: {
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  licenseItem: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    marginBottom: spacing.xs,
  },
  legalText: {
    ...typography.caption,
    color: colors.neutral.grey,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
