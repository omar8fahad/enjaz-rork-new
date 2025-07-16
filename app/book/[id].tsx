import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { DateDisplay } from '@/components/DateDisplay';
import { useBookStore } from '@/store/bookStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2, Edit } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { formatDateByCalendar } from '@/utils/hijriUtils';
import { getImageSource } from '@/utils/imageStorage';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { books, updateBook, deleteBook, updateReadingProgress } = useBookStore();
  const colorScheme = useColorScheme();
  
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  const book = books.find((b) => b.id === id);
  const [currentPage, setCurrentPage] = useState(book?.currentPage.toString() || '0');
  
  if (!book) {
    return null;
  }
  
  const progress = (book.currentPage / book.totalPages) * 100;
  const imageSource = getImageSource(book);
  
  const handleDeleteBook = () => {
    Alert.alert(
      'حذف الكتاب',
      'هل أنت متأكد من أنك تريد حذف هذا الكتاب؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            deleteBook(id);
            router.back();
          },
        },
      ]
    );
  };
  
  const handleEditBook = () => {
    router.push(`/book/edit/${id}`);
  };
  
  const handleUpdateProgress = () => {
    const newPage = parseInt(currentPage, 10);
    
    if (isNaN(newPage) || newPage < 0 || newPage > book.totalPages) {
      Alert.alert('رقم صفحة غير صحيح', 'يرجى إدخال رقم صفحة صحيح.');
      return;
    }
    
    updateReadingProgress(id, newPage);
    Alert.alert('تم التحديث', 'تم تحديث تقدم القراءة بنجاح.');
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          {imageSource ? (
            <Image source={{ uri: imageSource }} style={styles.cover} />
          ) : (
            <View
              style={[styles.coverPlaceholder, { backgroundColor: themeColors.secondary }]}
            >
              <StyledText variant="h1" color="#FFFFFF">
                {book.title.charAt(0)}
              </StyledText>
            </View>
          )}
          
          <View style={styles.bookInfo}>
            <StyledText variant="h2" style={styles.bookTitle}>
              {book.title}
            </StyledText>
            <StyledText variant="body" color={themeColors.subtext}>
              بقلم {book.author}
            </StyledText>
            
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress} />
              <StyledText variant="caption" color={themeColors.subtext} style={styles.progressText}>
                {book.currentPage} / {book.totalPages} صفحة ({progress.toFixed(0)}%)
              </StyledText>
            </View>
            
            {book.completedDate && (
              <View style={[styles.completedBadge, { backgroundColor: themeColors.success }]}>
                <StyledText variant="caption" color="#FFFFFF">
                  مكتمل
                </StyledText>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: themeColors.border }]}
            onPress={handleEditBook}
          >
            <Edit size={20} color={themeColors.text} />
            <StyledText variant="button" style={styles.actionButtonText}>
              تعديل
            </StyledText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: '#EF4444' }]}
            onPress={handleDeleteBook}
          >
            <Trash2 size={20} color="#EF4444" />
            <StyledText variant="button" color="#EF4444" style={styles.actionButtonText}>
              حذف
            </StyledText>
          </TouchableOpacity>
        </View>
        
        {!book.completedDate && (
          <View style={styles.updateSection}>
            <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
              <StyledText variant="h3" style={styles.sectionTitle}>
                تحديث التقدم
              </StyledText>
            </View>
            
            <View style={styles.updateProgressContainer}>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: themeColors.text }]}
                  placeholder="الصفحة الحالية"
                  placeholderTextColor={themeColors.subtext}
                  value={currentPage}
                  onChangeText={setCurrentPage}
                  keyboardType="numeric"
                />
              </View>
              
              <Button
                title="تحديث"
                onPress={handleUpdateProgress}
                variant="primary"
                size="medium"
              />
            </View>
          </View>
        )}
        
        <View style={styles.historySection}>
          <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
            <StyledText variant="h3" style={styles.sectionTitle}>
              تاريخ القراءة
            </StyledText>
          </View>
          
          {book.readingSessions.length > 0 ? (
            <View style={[styles.historyCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              {book.readingSessions
                .slice()
                .reverse()
                .slice(0, 10) // Show only last 10 sessions
                .map((session, index) => (
                  <View key={index}>
                    <View style={styles.historyItem}>
                      <View style={styles.historyItemContent}>
                        <StyledText variant="body">
                          قرأت {session.pagesRead} صفحة
                        </StyledText>
                        <View style={styles.dateContainer}>
                          <DateDisplay 
                            date={new Date(session.date)} 
                            showIcon={false}
                          />
                        </View>
                      </View>
                    </View>
                    {index < Math.min(book.readingSessions.length - 1, 9) && (
                      <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
                    )}
                  </View>
                ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <StyledText variant="body" color={themeColors.subtext} centered>
                لا توجد جلسات قراءة بعد.
              </StyledText>
              <StyledText variant="caption" color={themeColors.subtext} centered style={styles.emptyStateSubtext}>
                حدث تقدمك لتتبع قراءتك.
              </StyledText>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  coverPlaceholder: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    marginBottom: 4,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressText: {
    marginTop: 4,
    textAlign: 'right',
  },
  completedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 8,
  },
  actionButtonText: {
    marginLeft: 8,
  },
  updateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  updateProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    height: '100%',
  },
  historySection: {
    marginBottom: 16,
  },
  historyCard: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  historyItem: {
    padding: 16,
  },
  historyItemContent: {
    flexDirection: 'column',
    gap: 4,
  },
  dateContainer: {
    gap: 2,
  },
  sectionTitleBackground: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateSubtext: {
    marginTop: 8,
  },
});