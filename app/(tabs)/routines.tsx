import { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { Button } from '@/components/Button';
import { useRoutineStore } from '@/store/routineStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { Routine } from '@/types';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';

export default function RoutinesScreen() {
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { routines } = useRoutineStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleRoutinePress = (routineId: string) => {
    router.push(`/routine/${routineId}`);
  };
  
  const handleCreateRoutine = () => {
    router.push('/routine/create');
  };
  
  const getFrequencyText = (routine: Routine) => {
    if (routine.frequency.type === 'daily') {
      return 'يومياً';
    }
    
    // Weekly frequency is not supported in current type definition
    
    if (routine.frequency.type === 'specific-days' && routine.frequency.days) {
      const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      return routine.frequency.days.map(day => dayNames[day]).join('، ');
    }
    
    return '';
  };
  
  const renderItem = ({ item }: { item: Routine }) => (
    <TouchableOpacity
      style={[
        styles.routineItem,
        { backgroundColor: themeColors.card, borderColor: themeColors.border },
      ]}
      onPress={() => handleRoutinePress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.routineHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.color || themeColors.primary },
          ]}
        >
          <StyledText color="#FFFFFF">{item.icon}</StyledText>
        </View>
        <View style={styles.routineInfo}>
          <StyledText variant="h3">{item.name}</StyledText>
          <StyledText variant="caption" color={themeColors.subtext}>
            {getFrequencyText(item)}
          </StyledText>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={routines}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={[styles.headerTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
              <StyledText variant="h1">روتيناتي</StyledText>
            </View>
            <StyledText variant="body" color={themeColors.subtext} style={styles.subtitle}>
              إدارة روتيناتك اليومية والأسبوعية والمخصصة
            </StyledText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <StyledText variant="body" color={themeColors.subtext} centered>
              لم تقم بإنشاء أي روتينات بعد.
            </StyledText>
            <Button
              title="إنشاء روتينك الأول"
              onPress={handleCreateRoutine}
              variant="primary"
            />
          </View>
        }
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: themeColors.primary }]}
        onPress={handleCreateRoutine}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  routineItem: {
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
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routineInfo: {
    flex: 1,
  },
  emptyState: {
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
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
});