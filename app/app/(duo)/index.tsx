import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { ReadingDuo } from '../../src/types/database';

interface DuoWithBook extends ReadingDuo {
  books: {
    title: string;
    total_chapters: number;
    cover_url: string | null;
  };
  partner: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export default function DuoManagementScreen() {
  const { user } = useAuthStore();
  const [activeDuos, setActiveDuos] = useState<DuoWithBook[]>([]);
  const [pendingDuos, setPendingDuos] = useState<DuoWithBook[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDuos();
  }, [user]);

  const fetchDuos = async () => {
    if (!user) return;

    // Fetch duos where user is creator
    const { data: creatorDuos } = await supabase
      .from('reading_duos')
      .select(`
        *,
        books:book_id (title, total_chapters, cover_url),
        partner:partner_id (username, avatar_url)
      `)
      .eq('creator_id', user.id)
      .in('status', ['active', 'pending']);

    // Fetch duos where user is partner
    const { data: partnerDuos } = await supabase
      .from('reading_duos')
      .select(`
        *,
        books:book_id (title, total_chapters, cover_url),
        partner:creator_id (username, avatar_url)
      `)
      .eq('partner_id', user.id)
      .in('status', ['active', 'pending']);

    const allDuos = [...(creatorDuos || []), ...(partnerDuos || [])] as DuoWithBook[];

    setActiveDuos(allDuos.filter(duo => duo.status === 'active'));
    setPendingDuos(allDuos.filter(duo => duo.status === 'pending'));
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDuos();
    setRefreshing(false);
  };

  const handleCreateDuo = () => {
    router.push('/(tabs)/library');
  };

  const handleJoinDuo = () => {
    router.push('/(duo)/join');
  };

  const renderDuoCard = (duo: DuoWithBook) => {
    const isCreator = duo.creator_id === user?.id;
    const myChapter = isCreator ? duo.creator_chapter : duo.partner_chapter;
    const partnerChapter = isCreator ? duo.partner_chapter : duo.creator_chapter;
    const partnerName = duo.partner?.username || 'Partenaire';
    const canAdvance = myChapter >= partnerChapter;

    return (
      <TouchableOpacity
        key={duo.id}
        style={styles.duoCard}
        onPress={() => router.push(`/reader/${duo.book_id}`)}
      >
        <View style={styles.duoHeader}>
          <View style={styles.partnerInfo}>
            <View style={styles.partnerAvatar}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.partnerImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.partnerName}>Duo avec {partnerName}</Text>
              <Text style={styles.bookTitle}>{(duo as any).books?.title}</Text>
            </View>
          </View>
          <Ionicons name="people" size={24} color={colors.primary.main} />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Vous</Text>
            <View style={styles.chapterBadge}>
              <Ionicons name="book" size={16} color={colors.primary.main} />
              <Text style={styles.chapterText}>Ch. {myChapter}</Text>
            </View>
          </View>

          <View style={styles.progressDivider}>
            <Ionicons
              name={canAdvance ? "lock-open" : "lock-closed"}
              size={20}
              color={canAdvance ? colors.primary.main : colors.neutral.grey}
            />
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>{partnerName}</Text>
            <View style={styles.chapterBadge}>
              <Ionicons name="book" size={16} color={colors.secondary.orange} />
              <Text style={styles.chapterText}>Ch. {partnerChapter}</Text>
            </View>
          </View>
        </View>

        {!canAdvance && (
          <View style={styles.waitingBanner}>
            <Ionicons name="time-outline" size={16} color={colors.secondary.orange} />
            <Text style={styles.waitingText}>
              Attendez que {partnerName} termine le chapitre {partnerChapter}
            </Text>
          </View>
        )}

        <View style={styles.duoFooter}>
          <Text style={styles.progressText}>
            {Math.round((myChapter / ((duo as any).books?.total_chapters || 1)) * 100)}% complete
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.neutral.grey} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderPendingDuoCard = (duo: DuoWithBook) => {
    return (
      <View key={duo.id} style={styles.pendingCard}>
        <View style={styles.pendingHeader}>
          <Ionicons name="time" size={24} color={colors.secondary.orange} />
          <Text style={styles.pendingTitle}>Invitation en attente</Text>
        </View>
        <Text style={styles.pendingBook}>{(duo as any).books?.title}</Text>
        <Text style={styles.pendingText}>
          Partagez le code d'invitation avec votre partenaire
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.neutral.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Mes Duos de Lecture</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={colors.primary.main} />
          <Text style={styles.infoText}>
            Lisez ensemble ! Vous ne pouvez avancer que si votre partenaire a terminé le chapitre.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Créer un duo"
            onPress={handleCreateDuo}
            leftIcon="add-circle-outline"
          />
          <View style={{ height: spacing.md }} />
          <Button
            title="Rejoindre un duo"
            variant="secondary"
            onPress={handleJoinDuo}
            leftIcon="enter-outline"
          />
        </View>

        {/* Pending Duos */}
        {pendingDuos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>En attente</Text>
            {pendingDuos.map(renderPendingDuoCard)}
          </View>
        )}

        {/* Active Duos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duos actifs</Text>
          {loading ? (
            <Text style={styles.emptyText}>Chargement...</Text>
          ) : activeDuos.length > 0 ? (
            activeDuos.map(renderDuoCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color={colors.neutral.grey} />
              <Text style={styles.emptyText}>Aucun duo actif</Text>
              <Text style={styles.emptySubtext}>
                Créez un duo pour lire avec vos proches !
              </Text>
            </View>
          )}
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
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.neutral.black,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primary.light + '30',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.primary.dark,
    lineHeight: 20,
  },
  actionButtons: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.md,
  },
  duoCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  duoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  partnerImage: {
    width: 36,
    height: 36,
  },
  partnerName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.black,
  },
  bookTitle: {
    ...typography.caption,
    color: colors.neutral.grey,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral.lightGrey,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.neutral.grey,
    marginBottom: spacing.xs,
  },
  chapterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  chapterText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.black,
  },
  progressDivider: {
    paddingHorizontal: spacing.md,
  },
  waitingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary.orange + '20',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  waitingText: {
    flex: 1,
    ...typography.caption,
    color: colors.secondary.orange,
    fontWeight: '600',
  },
  duoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.primary.main,
    fontWeight: '600',
  },
  pendingCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.secondary.orange + '40',
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  pendingTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.black,
  },
  pendingBook: {
    ...typography.body,
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  pendingText: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.neutral.grey,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
