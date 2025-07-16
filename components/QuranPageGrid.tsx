import { View, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { StyledText } from './StyledText';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { QuranPage } from '@/types';
import { ChevronDown, ChevronUp, X } from 'lucide-react-native';
import { useState } from 'react';

interface QuranPageGridProps {
  pages: QuranPage[];
  onPagePress: (page: QuranPage) => void;
  activeTab: 'read' | 'memorized' | 'revised';
}

interface JuzSection {
  id: number;
  name: string;
  startPage: number;
  endPage: number;
  pages: QuranPage[];
}

export function QuranPageGrid({ pages, onPagePress, activeTab }: QuranPageGridProps) {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  const [expandedJuz, setExpandedJuz] = useState<Set<number>>(new Set([1])); // الجزء الأول مفتوح افتراضياً
  const [selectedJuz, setSelectedJuz] = useState<JuzSection | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // تجميع الصفحات في أجزاء
  const createJuzSections = (): JuzSection[] => {
    const sections: JuzSection[] = [];
    
    for (let juzNumber = 1; juzNumber <= 30; juzNumber++) {
      let startPage: number;
      let endPage: number;
      
      if (juzNumber === 1) {
        // الجزء الأول: 22 صفحة (1-22)
        startPage = 1;
        endPage = 22;
      } else if (juzNumber === 30) {
        // الجزء الثلاثون: 22 صفحة (583-604)
        startPage = 583;
        endPage = 604;
      } else {
        // الأجزاء 2-29: كل جزء 20 صفحة
        startPage = 22 + (juzNumber - 2) * 20 + 1;
        endPage = startPage + 19;
      }
      
      const juzPages = pages.filter(page => page.id >= startPage && page.id <= endPage);
      
      sections.push({
        id: juzNumber,
        name: `الجزء ${juzNumber}`,
        startPage,
        endPage,
        pages: juzPages,
      });
    }
    
    return sections;
  };
  
  const juzSections = createJuzSections();
  
  const toggleJuz = (juzId: number) => {
    const newExpanded = new Set(expandedJuz);
    if (newExpanded.has(juzId)) {
      newExpanded.delete(juzId);
    } else {
      newExpanded.add(juzId);
    }
    setExpandedJuz(newExpanded);
  };
  
  const getPageColor = (page: QuranPage) => {
    // Show different colors based on active tab and page status
    switch (activeTab) {
      case 'read':
        if (page.isRead) return themeColors.quranRead;
        break;
      case 'memorized':
        if (page.isMemorized) return themeColors.quranMemorized;
        break;
      case 'revised':
        if (page.isRevised) return themeColors.quranRevised;
        break;
    }
    
    // Default color for unset pages
    return themeColors.card;
  };
  
  const getTextColor = (page: QuranPage) => {
    // Show white text on colored backgrounds
    switch (activeTab) {
      case 'read':
        if (page.isRead) return '#FFFFFF';
        break;
      case 'memorized':
        if (page.isMemorized) return '#FFFFFF';
        break;
      case 'revised':
        if (page.isRevised) return '#FFFFFF';
        break;
    }
    
    return themeColors.text;
  };
  
  const getJuzStats = (juz: JuzSection) => {
    let count = 0;
    juz.pages.forEach(page => {
      switch (activeTab) {
        case 'read':
          if (page.isRead) count++;
          break;
        case 'memorized':
          if (page.isMemorized) count++;
          break;
        case 'revised':
          if (page.isRevised) count++;
          break;
      }
    });
    return count;
  };
  
  const renderPage = (page: QuranPage) => (
    <TouchableOpacity
      key={page.id}
      style={[
        styles.pageItem,
        {
          backgroundColor: getPageColor(page),
          borderColor: themeColors.border,
        },
      ]}
      onPress={() => onPagePress(page)}
      activeOpacity={0.7}
    >
      <StyledText
        variant="caption"
        color={getTextColor(page)}
        centered
        style={styles.pageText}
      >
        {page.id}
      </StyledText>
    </TouchableOpacity>
  );
  
  const renderJuzSection = (juz: JuzSection) => {
    const isExpanded = expandedJuz.has(juz.id);
    const stats = getJuzStats(juz);
    const totalPages = juz.pages.length;
    
    return (
      <View key={juz.id} style={[styles.juzContainer, { borderColor: themeColors.border }]}>
        <TouchableOpacity
          style={[styles.juzHeader, { backgroundColor: themeColors.card }]}
          onPress={() => {
            setSelectedJuz(juz);
            setModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.juzHeaderContent}>
            <View style={styles.juzTitleContainer}>
              <StyledText style={styles.juzTitle}>
                {juz.id}
              </StyledText>
            </View>
            
            <View style={styles.juzStatsContainer}>
              <View style={[styles.statsChip, { backgroundColor: getStatsChipColor() }]}>
                <StyledText style={{ fontSize: 8, color: '#FFFFFF', fontWeight: '600' }}>
                  {stats}
                </StyledText>
              </View>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    );
  };
  
  const getStatsChipColor = () => {
    switch (activeTab) {
      case 'read':
        return themeColors.quranRead;
      case 'memorized':
        return themeColors.quranMemorized;
      case 'revised':
        return themeColors.quranRevised;
      default:
        return themeColors.primary;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.juzGrid}>
        {juzSections.map(renderJuzSection)}
      </View>
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
            {selectedJuz && (
              <>
                <View style={styles.modalHeader}>
                  <StyledText variant="h2" style={styles.modalTitle}>
                    {selectedJuz.name}
                  </StyledText>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <X size={24} color={themeColors.text} />
                  </TouchableOpacity>
                </View>
                
                <StyledText variant="body" color={themeColors.subtext} style={styles.modalSubtitle}>
                  الصفحات {selectedJuz.startPage} - {selectedJuz.endPage}
                </StyledText>
                
                <View style={styles.modalPagesGrid}>
                  {selectedJuz.pages.map(renderPage)}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  juzGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
  },
  juzContainer: {
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    width: 70,
    height: 60,
    marginHorizontal: 2,
  },
  juzHeader: {
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  juzHeaderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  juzTitleContainer: {
    alignItems: 'center',
  },
  juzTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  juzStatsContainer: {
    marginTop: 2,
    alignItems: 'center',
  },
  statsChip: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 24,
    alignItems: 'center',
  },
  pagesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  pagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
  },
  pageItem: {
    width: 35,
    height: 35,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    margin: 1,
  },
  pageText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '95%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  modalSubtitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalPagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 2,
    maxHeight: 400,
  },
});