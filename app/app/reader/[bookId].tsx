import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
  Animated,
  PanResponder,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/services/authStore';
import { supabase } from '../../src/services/supabase';
import { colors, spacing, typography, borderRadius } from '../../src/theme/colors';
import { Book, BookChapter } from '../../src/types/database';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const THEMES = {
  light: { background: '#FFFFFF', text: '#333333', name: 'Clair' },
  sepia: { background: '#F5E6D3', text: '#5C4033', name: 'Sepia' },
  dark: { background: '#1A1A1A', text: '#E0E0E0', name: 'Sombre' },
};

const FONT_SIZES = {
  small: 14,
  medium: 18,
  large: 22,
  xlarge: 26,
};

export default function ReaderScreen() {
  const { bookId } = useLocalSearchParams();
  const { user } = useAuthStore();
  const scrollRef = useRef<ScrollView>(null);

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [theme, setTheme] = useState<keyof typeof THEMES>('light');
  const [fontSize, setFontSize] = useState<keyof typeof FONT_SIZES>('medium');
  const [loading, setLoading] = useState(true);
  const [readingStartTime, setReadingStartTime] = useState<Date | null>(null);
  const [showChapterToast, setShowChapterToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only activate for horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        // Swipe left (next chapter)
        if (gestureState.dx < -50 && gestureState.velocityX < -0.5) {
          if (currentChapter < (book?.total_chapters || 1)) {
            goToChapter(currentChapter + 1);
          }
        }
        // Swipe right (previous chapter)
        else if (gestureState.dx > 50 && gestureState.velocityX > 0.5) {
          if (currentChapter > 1) {
            goToChapter(currentChapter - 1);
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    fetchBookData();
    setReadingStartTime(new Date());

    return () => {
      // Log reading session when leaving
      logReadingSession();
    };
  }, [bookId]);

  const fetchBookData = async () => {
    // Fetch book
    const { data: bookData } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookData) {
      setBook(bookData);
    }

    // Fetch chapters
    const { data: chaptersData } = await supabase
      .from('book_chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('chapter_number');

    if (chaptersData) {
      setChapters(chaptersData);
    }

    // Get user's current position
    if (user) {
      const { data: userBook } = await supabase
        .from('user_books')
        .select('current_chapter')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .single();

      if (userBook) {
        setCurrentChapter(userBook.current_chapter);
      }
    }

    setLoading(false);
  };

  const logReadingSession = async () => {
    if (!user || !readingStartTime) return;

    const minutesRead = Math.round(
      (new Date().getTime() - readingStartTime.getTime()) / 60000
    );

    if (minutesRead > 0) {
      await supabase.rpc('log_reading_session', {
        p_user_id: user.id,
        p_book_id: bookId as string,
        p_minutes: minutesRead,
        p_pages: 1,
      });
    }
  };

  const saveProgress = async (chapter: number) => {
    if (!user || !book) return;

    const progress = (chapter / book.total_chapters) * 100;

    await supabase
      .from('user_books')
      .update({
        current_chapter: chapter,
        progress_percent: progress,
        last_read_at: new Date().toISOString(),
        status: chapter >= book.total_chapters ? 'completed' : 'in_progress',
      })
      .eq('user_id', user.id)
      .eq('book_id', book.id);
  };

  const showToast = () => {
    setShowChapterToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowChapterToast(false));
  };

  const goToChapter = (chapter: number) => {
    if (chapter >= 1 && chapter <= (book?.total_chapters || 1)) {
      setCurrentChapter(chapter);
      saveProgress(chapter);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      showToast();
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    if (showSettings) setShowSettings(false);
  };

  const currentChapterData = chapters.find((c) => c.chapter_number === currentChapter);
  const currentTheme = THEMES[theme];
  const currentFontSize = FONT_SIZES[fontSize];

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <Text style={{ color: currentTheme.text }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Top Bar */}
      {showControls && (
        <View style={[styles.topBar, { backgroundColor: currentTheme.background }]}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              logReadingSession();
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.titleContainer}
            onPress={() => setShowChapterList(true)}
          >
            <Text style={[styles.bookTitle, { color: currentTheme.text }]} numberOfLines={1}>
              {book?.title}
            </Text>
            <View style={styles.chapterTitleRow}>
              <Text style={[styles.chapterTitle, { color: currentTheme.text + '80' }]}>
                Chapitre {currentChapter}
              </Text>
              <Ionicons name="chevron-down" size={16} color={currentTheme.text + '80'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Ionicons name="settings-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View style={styles.contentArea} {...panResponder.panHandlers}>
        <TouchableOpacity activeOpacity={1} onPress={toggleControls} style={{ flex: 1 }}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
          {currentChapterData?.title && (
            <Text
              style={[
                styles.chapterHeading,
                { color: currentTheme.text, fontSize: currentFontSize + 4 },
              ]}
            >
              {currentChapterData.title}
            </Text>
          )}
          <Text
            style={[
              styles.contentText,
              { color: currentTheme.text, fontSize: currentFontSize, lineHeight: currentFontSize * 1.8 },
            ]}
          >
            {currentChapterData?.content || 'Contenu non disponible pour ce chapitre.'}
          </Text>
        </ScrollView>
        </TouchableOpacity>
      </View>

      {/* Bottom Bar */}
      {showControls && (
        <View style={[styles.bottomBar, { backgroundColor: currentTheme.background }]}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => goToChapter(currentChapter - 1)}
            disabled={currentChapter <= 1}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentChapter <= 1 ? currentTheme.text + '40' : currentTheme.text}
            />
          </TouchableOpacity>

          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: currentTheme.text }]}>
              {currentChapter} / {book?.total_chapters}
            </Text>
            <View style={styles.progressBarSmall}>
              <View
                style={[
                  styles.progressFillSmall,
                  { width: `${(currentChapter / (book?.total_chapters || 1)) * 100}%` },
                ]}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => goToChapter(currentChapter + 1)}
            disabled={currentChapter >= (book?.total_chapters || 1)}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                currentChapter >= (book?.total_chapters || 1)
                  ? currentTheme.text + '40'
                  : currentTheme.text
              }
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <View style={[styles.settingsPanel, { backgroundColor: currentTheme.background }]}>
          {/* Theme Selection */}
          <Text style={[styles.settingsLabel, { color: currentTheme.text }]}>Theme</Text>
          <View style={styles.themeOptions}>
            {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeOption,
                  { backgroundColor: THEMES[key].background, borderColor: THEMES[key].text },
                  theme === key && styles.themeOptionActive,
                ]}
                onPress={() => setTheme(key)}
              >
                <Text style={{ color: THEMES[key].text }}>{THEMES[key].name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Font Size */}
          <Text style={[styles.settingsLabel, { color: currentTheme.text }]}>Taille du texte</Text>
          <View style={styles.fontSizeOptions}>
            {(Object.keys(FONT_SIZES) as Array<keyof typeof FONT_SIZES>).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.fontSizeOption,
                  fontSize === key && styles.fontSizeOptionActive,
                ]}
                onPress={() => setFontSize(key)}
              >
                <Text
                  style={[
                    styles.fontSizeText,
                    { fontSize: FONT_SIZES[key] - 4 },
                    fontSize === key && styles.fontSizeTextActive,
                  ]}
                >
                  A
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Chapter List Modal */}
      <Modal
        visible={showChapterList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChapterList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.chapterListModal, { backgroundColor: currentTheme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: currentTheme.text + '20' }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                Chapitres ({book?.total_chapters})
              </Text>
              <TouchableOpacity onPress={() => setShowChapterList(false)}>
                <Ionicons name="close" size={28} color={currentTheme.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={chapters}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.chapterListItem,
                    item.chapter_number === currentChapter && styles.chapterListItemActive,
                    { borderBottomColor: currentTheme.text + '10' },
                  ]}
                  onPress={() => {
                    goToChapter(item.chapter_number);
                    setShowChapterList(false);
                  }}
                >
                  <View style={styles.chapterListItemLeft}>
                    <View
                      style={[
                        styles.chapterNumberBadge,
                        item.chapter_number === currentChapter && styles.chapterNumberBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chapterNumberText,
                          { color: item.chapter_number === currentChapter ? colors.neutral.white : currentTheme.text },
                        ]}
                      >
                        {item.chapter_number}
                      </Text>
                    </View>
                    <View style={styles.chapterListItemInfo}>
                      <Text
                        style={[
                          styles.chapterListItemTitle,
                          { color: currentTheme.text },
                          item.chapter_number === currentChapter && styles.chapterListItemTitleActive,
                        ]}
                        numberOfLines={2}
                      >
                        {item.title || `Chapitre ${item.chapter_number}`}
                      </Text>
                      {item.chapter_number <= currentChapter && (
                        <View style={styles.readBadge}>
                          <Ionicons name="checkmark-circle" size={16} color={colors.success.main} />
                          <Text style={styles.readBadgeText}>Lu</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {item.chapter_number === currentChapter && (
                    <Ionicons name="book" size={20} color={colors.primary.main} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Chapter Change Toast */}
      {showChapterToast && (
        <Animated.View
          style={[
            styles.chapterToast,
            { backgroundColor: currentTheme.background, opacity: toastOpacity },
          ]}
        >
          <Ionicons name="book-outline" size={20} color={currentTheme.text} />
          <Text style={[styles.chapterToastText, { color: currentTheme.text }]}>
            Chapitre {currentChapter}
          </Text>
          {currentChapterData?.title && (
            <Text style={[styles.chapterToastSubtext, { color: currentTheme.text + '80' }]} numberOfLines={1}>
              {currentChapterData.title}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 50,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGrey + '40',
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bookTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  chapterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chapterTitle: {
    ...typography.caption,
  },
  contentArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  chapterHeading: {
    fontWeight: '700',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  contentText: {
    textAlign: 'justify',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lightGrey + '40',
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  progressBarSmall: {
    width: 150,
    height: 4,
    backgroundColor: colors.neutral.lightGrey,
    borderRadius: 2,
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  settingsPanel: {
    position: 'absolute',
    top: 100,
    right: spacing.md,
    width: 250,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  settingsLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  themeOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
  },
  themeOptionActive: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  fontSizeOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fontSizeOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    backgroundColor: colors.neutral.lightGrey + '40',
  },
  fontSizeOptionActive: {
    backgroundColor: colors.primary.main,
  },
  fontSizeText: {
    color: colors.neutral.darkGrey,
    fontWeight: '600',
  },
  fontSizeTextActive: {
    color: colors.neutral.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chapterListModal: {
    height: SCREEN_HEIGHT * 0.75,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...typography.h3,
    fontWeight: '700',
  },
  chapterListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  chapterListItemActive: {
    backgroundColor: colors.primary.light + '20',
  },
  chapterListItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  chapterNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumberBadgeActive: {
    backgroundColor: colors.primary.main,
  },
  chapterNumberText: {
    ...typography.body,
    fontWeight: '700',
  },
  chapterListItemInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  chapterListItemTitle: {
    ...typography.body,
  },
  chapterListItemTitleActive: {
    fontWeight: '600',
    color: colors.primary.main,
  },
  readBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readBadgeText: {
    ...typography.caption,
    color: colors.success.main,
  },
  chapterToast: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  chapterToastText: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  chapterToastSubtext: {
    ...typography.caption,
    maxWidth: 150,
  },
});
