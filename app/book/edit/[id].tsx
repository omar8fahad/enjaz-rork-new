import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { Button } from '@/components/Button';
import { useBookStore } from '@/store/bookStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ImageIcon } from 'lucide-react-native';

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { books, updateBook } = useBookStore();
  
  const themeColors = colors[settings.theme];
  
  const book = books.find(b => b.id === id);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setTotalPages(book.totalPages.toString());
      setCoverUrl(book.coverUrl || '');
    }
  }, [book]);
  
  if (!book) {
    return null;
  }
  
  const handleSave = () => {
    if (!title.trim() || !author.trim() || !totalPages.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    const newTotalPages = parseInt(totalPages, 10);
    if (isNaN(newTotalPages) || newTotalPages <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال عدد صفحات صحيح');
      return;
    }
    
    // If total pages changed and current page is greater than new total, adjust it
    const adjustedCurrentPage = book.currentPage > newTotalPages ? newTotalPages : book.currentPage;
    
    updateBook(id, {
      title: title.trim(),
      author: author.trim(),
      totalPages: newTotalPages,
      currentPage: adjustedCurrentPage,
      coverUrl: coverUrl.trim() || undefined,
    });
    
    Alert.alert('تم الحفظ', 'تم تحديث معلومات الكتاب بنجاح', [
      { text: 'موافق', onPress: () => router.back() }
    ]);
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <View style={styles.coverSection}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.coverPreview} />
          ) : (
            <View
              style={[styles.coverPlaceholder, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            >
              <ImageIcon size={48} color={themeColors.subtext} />
              <StyledText variant="caption" color={themeColors.subtext} style={styles.coverPlaceholderText}>
                صورة الغلاف
              </StyledText>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <StyledText variant="h3" style={styles.sectionTitle}>
            معلومات الكتاب
          </StyledText>
          
          <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="عنوان الكتاب"
              placeholderTextColor={themeColors.subtext}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="المؤلف"
              placeholderTextColor={themeColors.subtext}
              value={author}
              onChangeText={setAuthor}
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="إجمالي الصفحات"
              placeholderTextColor={themeColors.subtext}
              value={totalPages}
              onChangeText={setTotalPages}
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="رابط صورة الغلاف (اختياري)"
              placeholderTextColor={themeColors.subtext}
              value={coverUrl}
              onChangeText={setCoverUrl}
            />
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <StyledText variant="caption" color={themeColors.subtext}>
              التقدم الحالي: {book.currentPage} من {book.totalPages} صفحة
            </StyledText>
            {parseInt(totalPages, 10) < book.currentPage && (
              <StyledText variant="caption" color={themeColors.warning} style={styles.warningText}>
                تنبيه: عدد الصفحات الجديد أقل من التقدم الحالي. سيتم تعديل التقدم تلقائياً.
              </StyledText>
            )}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="حفظ التغييرات"
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
            disabled={!title.trim() || !author.trim() || !totalPages.trim()}
          />
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
  coverSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  coverPreview: {
    width: 150,
    height: 225,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 150,
    height: 225,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    height: '100%',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  warningText: {
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
});