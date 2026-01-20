import { useState } from 'react';
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
import { Button } from '../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../src/theme/colors';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  recommended?: boolean;
  features: PlanFeature[];
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'child',
    name: 'Enfant',
    price: '5€',
    period: 'mois',
    features: [
      { text: 'Accès illimité aux livres', included: true },
      { text: 'Lecture en duo', included: true },
      { text: 'Système de streaks', included: true },
      { text: 'Classements et badges', included: true },
      { text: 'Sans publicité', included: true },
      { text: 'Signets et notes', included: false },
      { text: 'Résumés IA', included: false },
    ],
  },
  {
    id: 'adult',
    name: 'Adulte',
    price: '11€',
    period: 'mois',
    recommended: true,
    features: [
      { text: 'Accès illimité aux livres', included: true },
      { text: 'Lecture en duo', included: true },
      { text: 'Système de streaks', included: true },
      { text: 'Classements et badges', included: true },
      { text: 'Sans publicité', included: true },
      { text: 'Signets et notes', included: true },
      { text: 'Résumés IA', included: true },
    ],
  },
  {
    id: 'family',
    name: 'Famille',
    price: '20€',
    period: 'mois',
    features: [
      { text: 'Tous les avantages Adulte', included: true },
      { text: 'Jusqu\'à 5 comptes', included: true },
      { text: 'Contrôle parental', included: true },
      { text: 'Partage de bibliothèque', included: true },
      { text: 'Statistiques familiales', included: true },
      { text: 'Support prioritaire', included: true },
    ],
  },
];

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState('adult');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (!plan) return;

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Merci !',
        `Vous avez souscrit au plan ${plan.name}. Profitez de votre lecture !`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  const handleRestore = () => {
    Alert.alert('Restauration', 'Aucun achat à restaurer');
  };

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isSelected = selectedPlan === plan.id;

    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected && styles.planCardSelected,
        ]}
        onPress={() => setSelectedPlan(plan.id)}
      >
        {plan.recommended && (
          <View style={styles.recommendedBadge}>
            <Ionicons name="star" size={12} color={colors.neutral.white} />
            <Text style={styles.recommendedText}>Recommandé</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <View>
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{plan.price}</Text>
              <Text style={styles.period}>/{plan.period}</Text>
            </View>
          </View>

          <View
            style={[
              styles.radioButton,
              isSelected && styles.radioButtonSelected,
            ]}
          >
            {isSelected && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
        </View>

        <View style={styles.features}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons
                name={feature.included ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={feature.included ? colors.primary.main : colors.neutral.lightGrey}
              />
              <Text
                style={[
                  styles.featureText,
                  !feature.included && styles.featureTextDisabled,
                ]}
              >
                {feature.text}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color={colors.neutral.black} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>
            Débloquez toutes les fonctionnalités
          </Text>
          <Text style={styles.heroSubtitle}>
            Profitez de Two Read sans limite et transformez votre lecture
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {PLANS.map(renderPlanCard)}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Pourquoi passer Premium ?</Text>

          <View style={styles.benefitItem}>
            <Ionicons name="book" size={24} color={colors.primary.main} />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Bibliothèque illimitée</Text>
              <Text style={styles.benefitSubtitle}>
                Accédez à tous nos livres classiques et nouveautés
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="people" size={24} color={colors.primary.main} />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Lecture partagée</Text>
              <Text style={styles.benefitSubtitle}>
                Progressez ensemble avec vos proches
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="star" size={24} color={colors.primary.main} />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Expérience premium</Text>
              <Text style={styles.benefitSubtitle}>
                Sans publicité, avec toutes les fonctionnalités
              </Text>
            </View>
          </View>
        </View>

        {/* Subscribe Button */}
        <View style={styles.footer}>
          <Button
            title={`S'abonner - ${PLANS.find(p => p.id === selectedPlan)?.price}/mois`}
            onPress={handleSubscribe}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
          >
            <Text style={styles.restoreText}>Restaurer mes achats</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            Renouvellement automatique. Annulez à tout moment.
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
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.light + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroImage: {
    width: 80,
    height: 80,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.neutral.black,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
  },
  plansContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  planCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
  },
  planCardSelected: {
    borderColor: colors.primary.main,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary.orange,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  recommendedText: {
    ...typography.caption,
    color: colors.neutral.white,
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  planName: {
    ...typography.h3,
    color: colors.neutral.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...typography.h2,
    color: colors.primary.main,
  },
  period: {
    ...typography.bodySmall,
    color: colors.neutral.grey,
    marginLeft: spacing.xs,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary.main,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.main,
  },
  features: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.bodySmall,
    color: colors.neutral.black,
  },
  featureTextDisabled: {
    color: colors.neutral.grey,
  },
  benefitsCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  benefitsTitle: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.black,
    marginBottom: spacing.xs,
  },
  benefitSubtitle: {
    ...typography.caption,
    color: colors.neutral.grey,
  },
  footer: {
    paddingHorizontal: spacing.lg,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  restoreText: {
    ...typography.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
  termsText: {
    ...typography.caption,
    color: colors.neutral.grey,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
