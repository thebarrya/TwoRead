import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';

interface NotificationSettings {
  daily_reminders: boolean;
  duo_notifications: boolean;
  new_books: boolean;
  achievements: boolean;
  weekly_leaderboard: boolean;
}

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<NotificationSettings>({
    daily_reminders: true,
    duo_notifications: true,
    new_books: true,
    achievements: true,
    weekly_leaderboard: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('notifications_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // For now, use the global notifications_enabled flag
      // In the future, you could add more granular settings to the database
      const enabled = data?.notifications_enabled ?? true;
      setSettings({
        daily_reminders: enabled,
        duo_notifications: enabled,
        new_books: enabled,
        achievements: enabled,
        weekly_leaderboard: enabled,
      });
    } catch (error: any) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    if (!user?.id) return;

    try {
      // Update the global notifications_enabled flag based on any setting being enabled
      const anyEnabled = key === 'daily_reminders' ? value : settings.daily_reminders ||
                         key === 'duo_notifications' ? value : settings.duo_notifications ||
                         key === 'new_books' ? value : settings.new_books ||
                         key === 'achievements' ? value : settings.achievements ||
                         key === 'weekly_leaderboard' ? value : settings.weekly_leaderboard;

      const { error } = await supabase
        .from('users')
        .update({ notifications_enabled: anyEnabled })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour les paramètres');
      // Revert the change
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="notifications" size={48} color={colors.primary.main} />
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            Choisissez les notifications que vous souhaitez recevoir
          </Text>
        </View>

        <View style={styles.settingsContainer}>
          {/* Daily Reminders */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={24} color={colors.primary.main} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Rappels quotidiens</Text>
                <Text style={styles.settingDescription}>
                  Recevoir un rappel pour lire chaque jour
                </Text>
              </View>
            </View>
            <Switch
              value={settings.daily_reminders}
              onValueChange={(value) => handleToggle('daily_reminders', value)}
              trackColor={{ false: colors.neutral.lightGrey, true: colors.primary.light }}
              thumbColor={settings.daily_reminders ? colors.primary.main : colors.neutral.white}
            />
          </View>

          {/* Duo Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Ionicons name="people-outline" size={24} color={colors.primary.main} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications duo</Text>
                <Text style={styles.settingDescription}>
                  Être notifié quand votre partenaire de lecture progresse
                </Text>
              </View>
            </View>
            <Switch
              value={settings.duo_notifications}
              onValueChange={(value) => handleToggle('duo_notifications', value)}
              trackColor={{ false: colors.neutral.lightGrey, true: colors.primary.light }}
              thumbColor={settings.duo_notifications ? colors.primary.main : colors.neutral.white}
            />
          </View>

          {/* New Books */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Ionicons name="book-outline" size={24} color={colors.primary.main} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Nouveaux livres</Text>
                <Text style={styles.settingDescription}>
                  Découvrir les nouveaux livres disponibles
                </Text>
              </View>
            </View>
            <Switch
              value={settings.new_books}
              onValueChange={(value) => handleToggle('new_books', value)}
              trackColor={{ false: colors.neutral.lightGrey, true: colors.primary.light }}
              thumbColor={settings.new_books ? colors.primary.main : colors.neutral.white}
            />
          </View>

          {/* Achievements */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Ionicons name="trophy-outline" size={24} color={colors.primary.main} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Achievements</Text>
                <Text style={styles.settingDescription}>
                  Être notifié des badges déverrouillés
                </Text>
              </View>
            </View>
            <Switch
              value={settings.achievements}
              onValueChange={(value) => handleToggle('achievements', value)}
              trackColor={{ false: colors.neutral.lightGrey, true: colors.primary.light }}
              thumbColor={settings.achievements ? colors.primary.main : colors.neutral.white}
            />
          </View>

          {/* Weekly Leaderboard */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Ionicons name="bar-chart-outline" size={24} color={colors.primary.main} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Classement hebdomadaire</Text>
                <Text style={styles.settingDescription}>
                  Recevoir le nouveau classement chaque semaine
                </Text>
              </View>
            </View>
            <Switch
              value={settings.weekly_leaderboard}
              onValueChange={(value) => handleToggle('weekly_leaderboard', value)}
              trackColor={{ false: colors.neutral.lightGrey, true: colors.primary.light }}
              thumbColor={settings.weekly_leaderboard ? colors.primary.main : colors.neutral.white}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary.main} />
          <Text style={styles.infoText}>
            Les notifications push nécessitent l'autorisation de votre appareil.
            Vous pouvez modifier ces autorisations dans les paramètres de votre appareil.
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
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.neutral.black,
    marginTop: spacing.md,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  settingsContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGrey,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  settingDescription: {
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
