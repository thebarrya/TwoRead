import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { NatureBackground } from '../../src/components/NatureBackground';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'tworead://reset-password',
      });

      if (error) throw error;

      setEmailSent(true);
    } catch (error: any) {
      console.error('Reset password error:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible d\'envoyer l\'email de réinitialisation'
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <NatureBackground>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.content}>
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color={colors.neutral.black} />
              </TouchableOpacity>

              {/* Success Icon */}
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={64} color={colors.primary.main} />
              </View>

              {/* Success Message */}
              <Text style={styles.title}>Email envoyé !</Text>
              <Text style={styles.description}>
                Nous avons envoyé un lien de réinitialisation à :
              </Text>
              <Text style={styles.email}>{email}</Text>
              <Text style={styles.description}>
                Veuillez vérifier votre boîte de réception et cliquer sur le lien pour
                réinitialiser votre mot de passe.
              </Text>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color={colors.primary.main} />
                <Text style={styles.infoText}>
                  Si vous ne voyez pas l'email, vérifiez vos spams ou réessayez dans quelques minutes.
                </Text>
              </View>

              {/* Actions */}
              <Button
                title="Renvoyer l'email"
                onPress={handleResetPassword}
                loading={loading}
                variant="secondary"
                style={styles.resendButton}
              />

              <Button
                title="Retour à la connexion"
                onPress={() => router.replace('/(auth)/signin')}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </NatureBackground>
    );
  }

  return (
    <NatureBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.neutral.black} />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <Text style={styles.title}>Mot de passe oublié ?</Text>
            <Text style={styles.description}>
              Entrez votre adresse email et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.neutral.grey} />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor={colors.neutral.grey}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Submit Button */}
            <Button
              title="Envoyer le lien"
              onPress={handleResetPassword}
              loading={loading}
              rightIcon="send"
            />

            {/* Back to Sign In */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.back()}
            >
              <Text style={styles.linkText}>
                Vous vous souvenez de votre mot de passe ?{' '}
                <Text style={styles.linkTextBold}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.neutral.black,
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  email: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary.main,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral.lightGrey,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...typography.body,
    color: colors.neutral.black,
  },
  linkButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    ...typography.body,
    color: colors.neutral.darkGrey,
  },
  linkTextBold: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary.light + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoText: {
    ...typography.caption,
    color: colors.neutral.darkGrey,
    flex: 1,
    lineHeight: 20,
  },
  resendButton: {
    marginBottom: spacing.md,
  },
});
