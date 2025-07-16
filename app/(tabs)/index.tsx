import { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { Button } from '@/components/Button';
import { TaskCard } from '@/components/TaskCard';
import { BookCard } from '@/components/BookCard';
import { EnhancedCard } from '@/components/EnhancedCard';
import { EnhancedText } from '@/components/EnhancedText';
import { EnhancedButton } from '@/components/EnhancedButton';
import { PatternBackground } from '@/components/PatternBackground';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useRoutineStore } from '@/store/routineStore';
import { useBookStore } from '@/store/bookStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { Task, Routine, Book } from '@/types';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { BookOpen, Plus, Calendar, Star, TrendingUp } from 'lucide-react-native';
import { formatDateByCalendar } from '@/utils/hijriUtils';
import { useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { routines, tasks, updateTask } = useRoutineStore();
  const { getActiveBooks } = useBookStore();
  const [refreshing, setRefreshing] = useState(false);
  const [today] = useState(format(new Date(), 'yyyy-MM-dd'));
  const colorScheme = useColorScheme();
  
  // Get theme colors directly from settings.theme
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  // Get today's tasks and their associated routines
  const todaysTasks = useMemo(() => {
    return tasks
      .filter(task => task.date === today)
      .map(task => {
        const routine = routines.find(r => r.id === task.routineId);
        return { task, routine };
      })
      .filter(({ routine }) => routine !== undefined) as { task: Task; routine: Routine }[];
  }, [tasks, routines, today]);
  
  // Get active books
  const activeBooks = useMemo(() => {
    return getActiveBooks().slice(0, 3); // Show only first 3 books
  }, [getActiveBooks]);
  
  // Split tasks into pending and completed
  const pendingTasks = useMemo(() => {
    return todaysTasks.filter(({ task }) => !task.completed);
  }, [todaysTasks]);
  
  const completedTasks = useMemo(() => {
    return todaysTasks.filter(({ task }) => task.completed);
  }, [todaysTasks]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleTaskPress = (taskId: string, routineId: string) => {
    router.push(`/routine/${routineId}?taskId=${taskId}`);
  };
  
  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : undefined,
      });
    }
  };
  
  const handleBookPress = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };
  
  const renderTaskItem = ({ item }: { item: { task: Task; routine: Routine } }) => (
    <TaskCard
      task={item.task}
      routine={item.routine}
      onPress={() => handleTaskPress(item.task.id, item.routine.id)}
      onComplete={() => handleTaskComplete(item.task.id)}
    />
  );
  
  const renderBookItem = ({ item }: { item: Book }) => (
    <BookCard book={item} onPress={() => handleBookPress(item.id)} horizontal />
  );
  
  // Date will be formatted by DateDisplay component to show both Hijri and Gregorian
  
  return (
    <PatternBackground patternType="minimal">
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[themeColors.primary]}
              tintColor={themeColors.primary}
            />
          }
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={[themeColors.primary + '15', themeColors.background]}
            style={styles.headerGradient}
          >
            <AnimatedTransition type="slide" duration={600}>
              <EnhancedCard gradient elevation={3} style={styles.headerCard}>
                <View style={styles.headerContent}>
                  <EnhancedText variant="h1" arabic weight="bold">
                    مهام اليوم
                  </EnhancedText>
                  
                  <View style={styles.dateContainer}>
                    <Calendar size={18} color={themeColors.primary} />
                    <View style={styles.dateTextContainer}>
                      <EnhancedText 
                        variant="body" 
                        color={themeColors.text} 
                        style={styles.hijriDate}
                        arabic
                        weight="bold"
                      >
                        {formatDateByCalendar(new Date(), 'hijri')}
                      </EnhancedText>
                      <EnhancedText 
                        variant="caption" 
                        color={themeColors.subtext} 
                        style={styles.gregorianDate}
                        arabic
                      >
                        {formatDateByCalendar(new Date(), 'gregorian')}
                      </EnhancedText>
                    </View>
                  </View>
                  
                  {/* Progress Summary */}
                  <View style={styles.progressSummary}>
                    <View style={styles.progressItem}>
                      <TrendingUp size={16} color={themeColors.success} />
                      <EnhancedText variant="caption" color={themeColors.success}>
                        {completedTasks.length} مكتملة
                      </EnhancedText>
                    </View>
                    <View style={styles.progressItem}>
                      <Star size={16} color={themeColors.warning} />
                      <EnhancedText variant="caption" color={themeColors.warning}>
                        {pendingTasks.length} معلقة
                      </EnhancedText>
                    </View>
                  </View>
                </View>
              </EnhancedCard>
            </AnimatedTransition>
          </LinearGradient>
            
          {/* Active Books Section */}
          {activeBooks.length > 0 && (
            <AnimatedTransition type="fade" duration={800} delay={200}>
              <EnhancedCard style={styles.booksSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <BookOpen size={20} color={themeColors.primary} />
                    <EnhancedText variant="h3" style={styles.sectionTitleText} arabic weight="bold">
                      كتبي الحالية
                    </EnhancedText>
                  </View>
                  <TouchableOpacity
                    style={styles.seeAllButton}
                    onPress={() => router.push('/(tabs)/books')}
                  >
                    <EnhancedText variant="caption" color={themeColors.primary}>
                      عرض الكل
                    </EnhancedText>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={activeBooks}
                  renderItem={renderBookItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.booksListContent}
                />
              </EnhancedCard>
            </AnimatedTransition>
          )}
            
          {/* Tasks Section */}
          {pendingTasks.length === 0 && completedTasks.length === 0 ? (
            <AnimatedTransition type="bounce" duration={1000} delay={400}>
              <EnhancedCard style={styles.emptyState}>
                <EnhancedText variant="body" color={themeColors.subtext} style={styles.emptyText} arabic>
                  ليس لديك أي مهام لهذا اليوم.
                </EnhancedText>
                <EnhancedButton
                  title="إنشاء روتين"
                  onPress={() => router.push('/routine/create')}
                  variant="primary"
                  gradient
                  size="large"
                />
              </EnhancedCard>
            </AnimatedTransition>
          ) : (
            <>
              {pendingTasks.length > 0 && (
                <AnimatedTransition type="slide" duration={600} delay={300}>
                  <View style={styles.section}>
                    <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
                      <EnhancedText variant="h3" style={styles.sectionTitle} arabic weight="bold">
                        معلقة ({pendingTasks.length})
                      </EnhancedText>
                    </View>
                    {pendingTasks.map(({ task, routine }, index) => (
                      <AnimatedTransition key={task.id} type="fade" duration={400} delay={100 * index}>
                        <TaskCard
                          task={task}
                          routine={routine}
                          onPress={() => handleTaskPress(task.id, routine.id)}
                          onComplete={() => handleTaskComplete(task.id)}
                        />
                      </AnimatedTransition>
                    ))}
                  </View>
                </AnimatedTransition>
              )}
              
              {completedTasks.length > 0 && (
                <AnimatedTransition type="slide" duration={600} delay={500}>
                  <View style={styles.section}>
                    <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
                      <EnhancedText variant="h3" style={styles.sectionTitle} arabic weight="bold">
                        مكتملة ({completedTasks.length})
                      </EnhancedText>
                    </View>
                    {completedTasks.map(({ task, routine }, index) => (
                      <AnimatedTransition key={task.id} type="fade" duration={400} delay={100 * index}>
                        <TaskCard
                          task={task}
                          routine={routine}
                          onPress={() => handleTaskPress(task.id, routine.id)}
                          onComplete={() => handleTaskComplete(task.id)}
                        />
                      </AnimatedTransition>
                    ))}
                  </View>
                </AnimatedTransition>
              )}
            </>
          )}
          
          {/* Add some bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerCard: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
  },
  dateTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  hijriDate: {
    marginBottom: 2,
  },
  gregorianDate: {
    fontSize: 12,
    opacity: 0.8,
  },
  progressSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  booksSection: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleText: {
    marginLeft: 8,
  },
  seeAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  booksListContent: {
    paddingRight: 16,
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    textAlign: 'right',
  },
  emptyState: {
    marginHorizontal: 20,
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  sectionTitleBackground: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
});