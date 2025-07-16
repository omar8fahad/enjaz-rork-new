import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StyledText } from './StyledText';
import { ProgressBar } from './ProgressBar';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { Book } from '@/types';
import { getImageSource } from '@/utils/imageStorage';
import { useColorScheme } from 'react-native';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  horizontal?: boolean;
}

export function BookCard({ book, onPress, horizontal = false }: BookCardProps) {
  const { settings } = useSettingsStore();
  const colorScheme = useColorScheme();
  
  // Use the selected theme directly (no system theme anymore)
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  const progress = (book.currentPage / book.totalPages) * 100;
  const imageSource = getImageSource(book);
  
  if (horizontal) {
    return (
      <TouchableOpacity
        style={[
          styles.horizontalContainer,
          { backgroundColor: themeColors.card, borderColor: themeColors.border },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {imageSource ? (
          <Image source={{ uri: imageSource }} style={styles.horizontalCover} />
        ) : (
          <View
            style={[styles.horizontalCoverPlaceholder, { backgroundColor: themeColors.secondary }]}
          >
            <StyledText variant="h3" color="#FFFFFF">
              {book.title.charAt(0)}
            </StyledText>
          </View>
        )}
        
        <View style={styles.horizontalDetails}>
          <StyledText variant="body" numberOfLines={2} style={styles.horizontalTitle}>
            {book.title}
          </StyledText>
          <StyledText variant="caption" color={themeColors.subtext} numberOfLines={1}>
            {book.author}
          </StyledText>
          
          <View style={styles.horizontalProgressContainer}>
            <ProgressBar progress={progress} height={4} />
            <StyledText variant="caption" color={themeColors.subtext} style={styles.horizontalProgressText}>
              {progress.toFixed(0)}%
            </StyledText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: themeColors.card, borderColor: themeColors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {imageSource ? (
          <Image source={{ uri: imageSource }} style={styles.cover} />
        ) : (
          <View
            style={[styles.coverPlaceholder, { backgroundColor: themeColors.secondary }]}
          >
            <StyledText variant="h2" color="#FFFFFF">
              {book.title.charAt(0)}
            </StyledText>
          </View>
        )}
        
        <View style={styles.details}>
          <StyledText variant="h3" numberOfLines={1}>
            {book.title}
          </StyledText>
          <StyledText variant="caption" color={themeColors.subtext} numberOfLines={1}>
            {book.author}
          </StyledText>
          
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} />
            <StyledText variant="caption" color={themeColors.subtext} style={styles.progressText}>
              {book.currentPage} / {book.totalPages} صفحة
            </StyledText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  coverPlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    marginTop: 4,
    textAlign: 'right',
  },
  // Horizontal styles
  horizontalContainer: {
    width: 160,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalCover: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  horizontalCoverPlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalDetails: {
    flex: 1,
  },
  horizontalTitle: {
    marginBottom: 4,
  },
  horizontalProgressContainer: {
    marginTop: 8,
  },
  horizontalProgressText: {
    marginTop: 4,
    textAlign: 'center',
  },
});