import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { NatureBackground } from '../../src/components/NatureBackground';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  points: number;
  rank: number;
}

export default function CommunityScreen() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('v_leaderboard')
      .select('*')
      .eq('division', user?.division || 'bronze')
      .order('points', { ascending: false })
      .limit(10);

    if (data) {
      setLeaderboard(data as any);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  const getDivisionInfo = (division: string) => {
    const divisions = {
      bronze: { label: 'Bronze', color: colors.divisions.bronze, icon: 'trophy' },
      argent: { label: 'Argent', color: colors.divisions.silver, icon: 'trophy' },
      or: { label: 'Or', color: colors.divisions.gold, icon: 'trophy' },
    };
    return divisions[division as keyof typeof divisions] || divisions.bronze;
  };

  const divisionInfo = getDivisionInfo(user?.division || 'bronze');

  return (
    <NatureBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        {/* Header */}
        <Text style={styles.title}>Communaute</Text>

        {/* Division Card */}
        <View style={[styles.divisionCard, { borderColor: divisionInfo.color }]}>
          <View style={[styles.divisionBadge, { backgroundColor: divisionInfo.color }]}>
            <Ionicons name="trophy" size={24} color={colors.neutral.white} />
          </View>
          <View style={styles.divisionInfo}>
            <Text style={styles.divisionLabel}>Votre division</Text>
            <Text style={[styles.divisionName, { color: divisionInfo.color }]}>
              Division {divisionInfo.label}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.neutral.grey} />
        </View>

        {/* Weekly Stars */}
        <View style={styles.starsCard}>
          <Text style={styles.starsLabel}>Cette semaine</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= 3 ? 'star' : 'star-outline'}
                size={32}
                color={colors.secondary.yellow}
              />
            ))}
          </View>
          <Text style={styles.starsSubtext}>3 jours de lecture completes</Text>
        </View>

        {/* Leaderboard */}
        <View style={styles.leaderboardCard}>
          <Text style={styles.leaderboardTitle}>Classement de la semaine</Text>

          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <View
                key={entry.user_id}
                style={[
                  styles.leaderboardEntry,
                  entry.user_id === user?.id && styles.leaderboardEntryHighlight,
                ]}
              >
                <View style={styles.leaderboardRank}>
                  {index < 3 ? (
                    <Ionicons
                      name="medal"
                      size={24}
                      color={
                        index === 0
                          ? colors.divisions.gold
                          : index === 1
                          ? colors.divisions.silver
                          : colors.divisions.bronze
                      }
                    />
                  ) : (
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.leaderboardAvatar}>
                  <Image
                    source={require('../../assets/images/icon.png')}
                    style={styles.avatarImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.leaderboardInfo}>
                  <Text style={styles.leaderboardName}>
                    {entry.username || 'Lecteur'}
                    {entry.user_id === user?.id && ' (Vous)'}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min((entry.points / 500) * 100, 100)}%` },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.leaderboardPoints}>{entry.points} pts</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyLeaderboard}>
              <Ionicons name="people-outline" size={48} color={colors.neutral.grey} />
              <Text style={styles.emptyText}>
                Lisez pour apparaitre dans le classement!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.neutral.black,
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  divisionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  divisionBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divisionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  divisionLabel: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
  divisionName: {
    ...typography.h3,
    fontWeight: '700',
  },
  starsCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  starsLabel: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
    marginBottom: spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  starsSubtext: {
    ...typography.caption,
    color: colors.neutral.grey,
    marginTop: spacing.sm,
  },
  leaderboardCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  leaderboardTitle: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.md,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGrey,
  },
  leaderboardEntryHighlight: {
    backgroundColor: colors.primary.light + '30',
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  leaderboardRank: {
    width: 32,
    alignItems: 'center',
  },
  rankNumber: {
    ...typography.body,
    fontWeight: '700',
    color: colors.neutral.darkGrey,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  avatarImage: {
    width: 32,
    height: 32,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.black,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.neutral.lightGrey,
    borderRadius: 3,
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 3,
  },
  leaderboardPoints: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primary.main,
  },
  emptyLeaderboard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.neutral.grey,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
