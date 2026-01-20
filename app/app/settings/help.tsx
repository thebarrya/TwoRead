import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/Button';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Comment ajouter un livre à ma bibliothèque ?',
    answer: 'Parcourez la bibliothèque, sélectionnez un livre qui vous intéresse, puis appuyez sur "Ajouter à ma bibliothèque" ou commencez directement la lecture.',
  },
  {
    question: 'Comment fonctionne le mode duo ?',
    answer: 'Le mode duo vous permet de lire un livre avec un partenaire. Vous pouvez voir sa progression et recevoir des notifications quand il avance. Parfait pour partager vos lectures !',
  },
  {
    question: 'Puis-je lire hors ligne ?',
    answer: 'Oui ! Une fois qu\'un livre est téléchargé, vous pouvez le lire même sans connexion internet. Les livres sont automatiquement mis en cache.',
  },
  {
    question: 'Comment personnaliser l\'apparence du lecteur ?',
    answer: 'Dans le lecteur, appuyez sur l\'icône des paramètres pour changer le thème (clair, sépia, sombre), la taille de police, et l\'espacement. Vos préférences sont sauvegardées.',
  },
  {
    question: 'À quoi servent les points et le classement ?',
    answer: 'Vous gagnez des points en lisant régulièrement. Le classement hebdomadaire vous compare à d\'autres lecteurs de votre niveau (division). C\'est un moyen ludique de rester motivé !',
  },
  {
    question: 'Comment débloquer des achievements ?',
    answer: 'Les achievements se débloquent automatiquement quand vous atteignez certains objectifs : terminer votre premier livre, lire plusieurs jours d\'affilée, etc.',
  },
];

export default function HelpScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sending, setSending] = useState(false);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleSendMessage = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!contactEmail.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    setSending(true);

    // Simulate sending message
    setTimeout(() => {
      setSending(false);
      Alert.alert(
        'Message envoyé',
        'Merci pour votre message ! Notre équipe vous répondra dans les plus brefs délais.',
        [
          {
            text: 'OK',
            onPress: () => {
              setContactName('');
              setContactEmail('');
              setContactMessage('');
            },
          },
        ]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle" size={28} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          </View>

          <View style={styles.faqContainer}>
            {FAQ_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faqItem}
                onPress={() => toggleFAQ(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqQuestion}>
                  <Text style={styles.faqQuestionText}>{item.question}</Text>
                  <Ionicons
                    name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.neutral.darkGrey}
                  />
                </View>
                {expandedIndex === index && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Support Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mail" size={28} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Contacter le support</Text>
          </View>

          <View style={styles.contactForm}>
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              placeholderTextColor={colors.neutral.grey}
              value={contactName}
              onChangeText={setContactName}
            />

            <TextInput
              style={styles.input}
              placeholder="Votre email"
              placeholderTextColor={colors.neutral.grey}
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Votre message"
              placeholderTextColor={colors.neutral.grey}
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Button
              title="Envoyer le message"
              onPress={handleSendMessage}
              loading={sending}
              rightIcon="send"
            />
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="link" size={28} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Liens utiles</Text>
          </View>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="book-outline" size={20} color={colors.neutral.darkGrey} />
            <Text style={styles.linkText}>Guide d'utilisation</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="document-text-outline" size={20} color={colors.neutral.darkGrey} />
            <Text style={styles.linkText}>Conditions d'utilisation</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="shield-outline" size={20} color={colors.neutral.darkGrey} />
            <Text style={styles.linkText}>Politique de confidentialité</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral.grey} />
          </TouchableOpacity>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral.black,
  },
  faqContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGrey,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  faqQuestionText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.neutral.black,
    flex: 1,
    marginRight: spacing.sm,
  },
  faqAnswer: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    padding: spacing.md,
    paddingTop: 0,
    lineHeight: 22,
  },
  contactForm: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.neutral.cream,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...typography.body,
    color: colors.neutral.black,
    borderWidth: 1,
    borderColor: colors.neutral.lightGrey,
  },
  messageInput: {
    minHeight: 120,
    marginBottom: spacing.lg,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  linkText: {
    ...typography.body,
    color: colors.neutral.darkGrey,
    flex: 1,
  },
});
