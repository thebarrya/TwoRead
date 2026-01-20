import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';

const AVATAR_OPTIONS = [
  '👤', '🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🦁',
  '🐯', '🐸', '🐵', '🦉', '🦄', '🐙', '🦋', '🌸',
];

export default function EditProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_url || '👤');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      Alert.alert('Erreur', 'Le nom d\'utilisateur est requis');
      return;
    }

    setSaving(true);

    try {
      // Update user profile
      const { error: profileError } = await updateUser({
        username: username.trim(),
        avatar_url: selectedAvatar,
      });

      if (profileError) {
        throw profileError;
      }

      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs du mot de passe');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert('Succès', 'Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de changer le mot de passe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATAR_OPTIONS.map((avatar) => (
              <TouchableOpacity
                key={avatar}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar && styles.avatarOptionSelected,
                ]}
                onPress={() => setSelectedAvatar(avatar)}
              >
                <Text style={styles.avatarEmoji}>{avatar}</Text>
                {selectedAvatar === avatar && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary.main} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Username */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nom d'utilisateur</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.neutral.grey} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Nom d'utilisateur"
              placeholderTextColor={colors.neutral.grey}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Email (read-only) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email</Text>
          <View style={[styles.inputContainer, styles.inputDisabled]}>
            <Ionicons name="mail-outline" size={20} color={colors.neutral.grey} />
            <TextInput
              style={[styles.input, styles.inputDisabledText]}
              value={email}
              editable={false}
              placeholder="Email"
              placeholderTextColor={colors.neutral.grey}
            />
            <Ionicons name="lock-closed-outline" size={16} color={colors.neutral.grey} />
          </View>
          <Text style={styles.helperText}>
            L'email ne peut pas être modifié pour des raisons de sécurité
          </Text>
        </View>

        <Button
          title="Sauvegarder les modifications"
          onPress={handleSaveProfile}
          loading={saving}
          style={styles.saveButton}
        />

        {/* Password Change Section */}
        <View style={[styles.section, styles.passwordSection]}>
          <Text style={styles.sectionTitle}>Changer le mot de passe</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.neutral.grey} />
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe"
              placeholderTextColor={colors.neutral.grey}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.neutral.grey} />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={colors.neutral.grey}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <Button
            title="Changer le mot de passe"
            onPress={handleChangePassword}
            loading={saving}
            variant="secondary"
          />
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.neutral.black,
    marginBottom: spacing.md,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  avatarOption: {
    width: 56,
    height: 56,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.lightGrey,
    position: 'relative',
  },
  avatarOptionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + '20',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.neutral.white,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral.lightGrey,
  },
  inputDisabled: {
    backgroundColor: colors.neutral.lightGrey + '40',
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...typography.body,
    color: colors.neutral.black,
  },
  inputDisabledText: {
    color: colors.neutral.grey,
  },
  helperText: {
    ...typography.caption,
    color: colors.neutral.grey,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  saveButton: {
    marginBottom: spacing.xl,
  },
  passwordSection: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGrey,
    paddingTop: spacing.xl,
  },
});
