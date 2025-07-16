import { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { BookCard } from '@/components/BookCard';
import { useBookStore } from '@/store/bookStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Book } from '@/types';

export default function BooksScreen() {
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { books, getActiveBooks, getCompletedBooks } = useBookStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'reading' | 'completed'>('reading');
  
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  const activeBooks = getActiveBooks();
  const completedBooks = getCompletedBooks();
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleBookPress = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };
  
  const handleAddBook = () => {
    router.push('/book/create');
  };
  
  const renderItem = ({ item }: { item: Book }) => (
    <BookCard book={item} onPress={() => handleBookPress(item.id)} />
  );
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <View style={[styles.headerTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
          <StyledText variant="h1">كتبي</StyledText>
        </View>
        <StyledText variant="body" color={themeColors.subtext} style={styles.subtitle}>
          تتبع تقدمك في القراءة
        </StyledText>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'reading' && [styles.activeTab, { borderColor: themeColors.primary }],
            ]}
            onPress={() => setActiveTab('reading')}
          >
            <View style={activeTab === 'reading' ? [styles.tabTitleBackground, { backgroundColor: themeColors.card + '80' }] : null}>
              <StyledText
                variant="button"
                color={activeTab === 'reading' ? themeColors.primary : themeColors.subtext}
              >
                قيد القراءة ({activeBooks.length})
              </StyledText>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: themeColors.primary }],
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <View style={activeTab === 'completed' ? [styles.tabTitleBackground, { backgroundColor: themeColors.card + '80' }] : null}>
              <StyledText
                variant="button"
                color={activeTab === 'completed' ? themeColors.primary : themeColors.subtext}
              >
                مكتملة ({completedBooks.length})
              </StyledText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={activeTab === 'reading' ? activeBooks : completedBooks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <StyledText variant="body" color={themeColors.subtext} centered>
              {activeTab === 'reading'
                ? "لا تقرأ أي كتب حالياً."
                : "لم تكمل أي كتب بعد."}
            </StyledText>
            {activeTab === 'reading' && (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: themeColors.primary }]}
                onPress={handleAddBook}
              >
                <StyledText variant="button" color="#FFFFFF">
                  أضف كتابك الأول
                </StyledText>
              </TouchableOpacity>
            )}
          </View>
        }
      />
      
      {activeTab === 'reading' && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: themeColors.primary }]}
          onPress={handleAddBook}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80, // Extra padding for FAB
  },
  emptyState: {
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitleBackground: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  tabTitleBackground: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
});