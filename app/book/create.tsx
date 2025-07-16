import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { Button } from '@/components/Button';
import { useBookStore } from '@/store/bookStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Image as ImageIcon } from 'lucide-react-native';

export default function CreateBookScreen() {
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { addBook } = useBookStore();
  
  const themeColors = colors[settings.theme];
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  
  const handleSave = () => {
    if (!title.trim() || !author.trim() || !totalPages.trim()) {
      // Show error
      return;
    }
    
    addBook({
      title: title.trim(),
      author: author.trim(),
      totalPages: parseInt(totalPages, 10),
      currentPage: 0,
      coverUrl: coverUrl.trim() || undefined,
    });
    
    router.back();
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
        
        <View style={styles.buttonContainer}>
          <Button
            title="إضافة الكتاب"
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
  buttonContainer: {
    marginTop: 16,
  },
});