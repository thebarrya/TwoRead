import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/services/authStore';
import { Button } from '../src/components/Button';
import { NatureBackground } from '../src/components/NatureBackground';
import { colors, spacing, typography } from '../src/theme/colors';

export default function WelcomeScreen() {
  const { session, isLoading, isOnboardingComplete } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        if (isOnboardingComplete) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(onboarding)/language');
        }
      }
    }
  }, [session, isLoading, isOnboardingComplete]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.logo}>Two Read</Text>
      </View>
    );
  }

  return (
    <NatureBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Two Read</Text>
        </View>

        <View style={styles.illustration}>
          <View style={styles.mascotPlaceholder}>
            {/* Petites étoiles à l'intérieur */}
            <Text style={styles.sparkle1}>✨</Text>
            <Text style={styles.sparkle2}>✨</Text>
            <Text style={styles.sparkle3}>⭐</Text>

            <Image
              source={require('../assets/images/icon.png')}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.slogan}>
            Lisez ensemble,{'\n'}Progressez ensemble.
          </Text>

          <View style={styles.buttons}>
            <Button
              title="Commencer la lecture"
              onPress={() => router.push('/(auth)/signup')}
            />
            <View style={{ height: spacing.md }} />
            <Button
              title="J'ai deja un compte"
              variant="secondary"
              onPress={() => router.push('/(auth)/signin')}
            />
          </View>
        </View>
      </View>
    </NatureBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2E7D32',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  illustration: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mascotPlaceholder: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  mascotImage: {
    width: 220,
    height: 220,
  },
  sparkle1: {
    position: 'absolute',
    top: 25,
    right: 30,
    fontSize: 20,
  },
  sparkle2: {
    position: 'absolute',
    top: 45,
    left: 25,
    fontSize: 18,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 35,
    right: 25,
    fontSize: 20,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 50,
    backgroundColor: 'transparent',
  },
  slogan: {
    ...typography.h2,
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: spacing.xl,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttons: {
    width: '100%',
  },
});
