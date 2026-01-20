import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { NatureBackground } from '../../src/components/NatureBackground';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Deconnexion',
      'Etes-vous sur de vouloir vous deconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Deconnecter',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
          },
        },
      ]
    );
  };

  const getReaderLevelInfo = (level: string) => {
    const levels = {
      debutant: { label: 'Debutant', color: colors.neutral.grey, icon: 'star-outline' },
      regulier: { label: 'Regulier', color: colors.primary.main, icon: 'star-half' },
      expert: { label: 'Expert', color: colors.secondary.yellow, icon: 'star' },
    };
    return levels[level as keyof typeof levels] || levels.debutant;
  };

  const levelInfo = getReaderLevelInfo(user?.reader_level || 'debutant');

  return (
    <NatureBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.neutral.darkGrey} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.username}>{user?.username || 'Lecteur'}</Text>
          <View style={[styles.levelBadge, { backgroundColor: levelInfo.color + '20' }]}>
            <Ionicons name={levelInfo.icon as any} size={16} color={levelInfo.color} />
            <Text style={[styles.levelText, { color: levelInfo.color }]}>
              Lecteur {levelInfo.label}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color={colors.primary.main} />
            <Text style={styles.statValue}>{user?.streak_count || 0}</Text>
            <Text style={styles.statLabel}>Jours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="book" size={24} color={colors.primary.main} />
            <Text style={styles.statValue}>{user?.total_books_read || 0}</Text>
            <Text style={styles.statLabel}>Livres</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="document-text" size={24} color={colors.primary.main} />
            <Text style={styles.statValue}>{user?.total_pages_read || 0}</Text>
            <Text style={styles.statLabel}>Pages</Text>
          </View>
        </View>

        {/* Subscription Card */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionInfo}>
            <Text style={styles.subscriptionTitle}>Abonnement</Text>
            <Text style={styles.subscriptionType}>
              {user?.subscription_type === 'free' ? 'Gratuit' : 'Premium'}
            </Text>
          </View>
          {user?.subscription_type === 'free' && (
            <Button
              title="Passer a Premium"
              onPress={() => router.push('/paywall')}
              fullWidth={false}
              style={styles.upgradeButton}
            />
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          <MenuItem
            icon="person-outline"
            label="Modifier le profil"
            onPress={() => router.push('/settings/edit-profile')}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => router.push('/settings/notifications')}
          />
          <MenuItem
            icon="moon-outline"
            label="Preferences de lecture"
            onPress={() => router.push('/settings/reading-preferences')}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Aide et support"
            onPress={() => router.push('/settings/help')}
          />
          <MenuItem
            icon="information-circle-outline"
            label="A propos"
            onPress={() => router.push('/settings/about')}
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={colors.semantic.error} />
          <Text style={styles.signOutText}>Se deconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </NatureBackground>
  );
}

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={colors.neutral.darkGrey} />
    <Text style={styles.menuItemLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color={colors.neutral.grey} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.neutral.black,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarImage: {
    width: 70,
    height: 70,
  },
  username: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.sm,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    gap: spacing.xs,
  },
  levelText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.neutral.black,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.neutral.lightGrey,
  },
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
  subscriptionType: {
    ...typography.h3,
    color: colors.neutral.black,
  },
  upgradeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGrey,
  },
  menuItemLabel: {
    flex: 1,
    ...typography.body,
    color: colors.neutral.black,
    marginLeft: spacing.md,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  signOutText: {
    ...typography.body,
    color: colors.semantic.error,
    fontWeight: '600',
  },
});
