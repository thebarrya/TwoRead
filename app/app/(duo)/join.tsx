import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';

export default function JoinDuoScreen() {
  const { user } = useAuthStore();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinDuo = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un code d\'invitation');
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('join_reading_duo', {
        p_user_id: user.id,
        p_invite_code: inviteCode.trim().toUpperCase(),
      });

      if (error) throw error;

      Alert.alert(
        'Succès !',
        'Vous avez rejoint le duo de lecture. Bonne lecture !',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.message || 'Code d\'invitation invalide ou expiré'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.neutral.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Rejoindre un Duo</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={48} color={colors.primary.main} />
            </View>
          </View>

          {/* Info */}
          <Text style={styles.subtitle}>
            Entrez le code d'invitation que votre partenaire vous a partagé
          </Text>

          {/* Input */}
          <View style={styles.inputContainer}>
            <Input
              label="Code d'invitation"
              placeholder="Exemple: ABC123"
              value={inviteCode}
              onChangeText={(text) => setInviteCode(text.toUpperCase())}
              leftIcon="key-outline"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={10}
            />
          </View>

          {/* How it works */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Comment ça marche ?</Text>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Votre partenaire crée un duo depuis un livre
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Il vous partage le code d'invitation
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Entrez le code ici pour rejoindre le duo
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>
                Lisez ensemble ! Vous devez attendre que votre partenaire finisse chaque chapitre avant d'avancer
              </Text>
            </View>
          </View>

          {/* Button */}
          <Button
            title="Rejoindre le duo"
            onPress={handleJoinDuo}
            loading={loading}
            disabled={!inviteCode.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.cream,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.light + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    ...typography.h3,
    color: colors.neutral.black,
    marginBottom: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  stepNumberText: {
    ...typography.caption,
    color: colors.neutral.white,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.neutral.darkGrey,
    lineHeight: 20,
  },
});
