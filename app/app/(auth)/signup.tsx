import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { NatureBackground } from '../../src/components/NatureBackground';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const signUp = useAuthStore((state) => state.signUp);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Mot de passe requis';
    } else if (password.length < 8) {
      newErrors.password = 'Minimum 8 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    const { error } = await signUp(email, password, username);

    if (error) {
      setLoading(false);
      Alert.alert('Erreur', error.message);
      return;
    }

    // Attendre un peu que la session soit bien établie
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Vérifier que la session est bien créée
    const { data: { session } } = await supabase.auth.getSession();
    setLoading(false);

    if (!session) {
      Alert.alert(
        'Confirmation requise',
        'Veuillez vérifier votre email pour confirmer votre compte, puis vous connecter.',
        [{
          text: 'OK',
          onPress: () => router.replace('/(auth)/signin')
        }]
      );
    } else {
      router.replace('/(onboarding)/language');
    }
  };

  return (
    <NatureBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.neutral.black} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Creer un compte</Text>
            <Text style={styles.subtitle}>
              Rejoignez Two Read et commencez votre aventure de lecture
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Pseudo (optionnel)"
              placeholder="Votre pseudo"
              value={username}
              onChangeText={setUsername}
              leftIcon="person-outline"
              autoCapitalize="none"
            />

            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Mot de passe"
              placeholder="Minimum 8 caracteres"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon="lock-closed-outline"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Creer mon compte"
              onPress={handleSignUp}
              loading={loading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Deja un compte?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
                <Text style={styles.footerLink}> Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  backButton: {
    marginTop: 40,
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.neutral.black,
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.neutral.darkGrey,
  },
  form: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.neutral.darkGrey,
  },
  footerLink: {
    ...typography.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
});
