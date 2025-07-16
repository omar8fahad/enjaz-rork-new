import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { Button } from '@/components/Button';
import { TaskCard } from '@/components/TaskCard';
import { DateDisplay } from '@/components/DateDisplay';
import { useRoutineStore } from '@/store/routineStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { Task } from '@/types';
import { Trash2, Edit, Plus } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { formatDateByCalendar } from '@/utils/hijriUtils';

export default function RoutineDetailScreen() {
  const { id, taskId } = useLocalSearchParams<{ id: string; taskId?: string }>();
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { routines, tasks, updateRoutine, deleteRoutine, addTask, updateTask, getTasksForRoutine } = useRoutineStore();
  const colorScheme = useColorScheme();
  
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  const routine = routines.find((r) => r.id === id);
  const routineTasks = getTasksForRoutine(id);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<Date[]>([]);
  
  useEffect(() => {
    if (!routine) {
      router.back();
      return;
    }
    
    // Generate a range of dates for the date picker
    const today = startOfDay(new Date());
    const range = Array.from({ length: 14 }, (_, i) => addDays(today, i - 7));
    setDateRange(range);
    
    // If a specific task is provided, find its date
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setSelectedDate(new Date(task.date));
      }
    }
  }, [routine, taskId, tasks]);
  
  if (!routine) {
    return null;
  }
  
  const handleDeleteRoutine = () => {
    Alert.alert(
      'حذف الروتين',
      'هل أنت متأكد من أنك تريد حذف هذا الروتين؟ سيتم حذف جميع المهام المرتبطة به أيضاً. لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            deleteRoutine(id);
            router.back();
          },
        },
      ]
    );
  };
  
  const handleEditRoutine = () => {
    router.push(`/routine/edit/${id}`);
  };
  
  const handleAddTask = () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    // Check if a task already exists for this date
    const existingTask = routineTasks.find((task) => task.date === dateString);
    
    if (existingTask) {
      Alert.alert(
        'المهمة موجودة',
        'مهمة لهذا الروتين موجودة بالفعل في التاريخ المحدد.',
        [{ text: 'موافق' }]
      );
      return;
    }
    
    addTask({
      routineId: id,
      date: dateString,
      completed: false,
      ...(routine.goalType !== 'completion' && { progress: 0 }),
    });
    
    Alert.alert('تمت الإضافة', 'تم إضافة المهمة بنجاح.');
  };
  
  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : undefined,
      });
    }
  };
  
  const handleUpdateProgress = (task: Task) => {
    if (routine.goalType === 'completion') {
      return;
    }
    
    // In a real app, this would open a modal to update progress
    Alert.alert(
      'تحديث التقدم',
      'هذا سيفتح نافذة لتحديث التقدم في التطبيق الحقيقي.',
      [{ text: 'موافق' }]
    );
  };
  
  const getFrequencyText = () => {
    if (routine.frequency.type === 'daily') {
      return 'يومياً';
    }
    
    if (routine.frequency.type === 'specific-days' && routine.frequency.days) {
      const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      return routine.frequency.days.map((day) => dayNames[day]).join('، ');
    }
    
    return '';
  };
  
  const getGoalText = () => {
    if (routine.goalType === 'completion') {
      return 'إنجاز بسيط';
    }
    
    if (routine.goalType === 'counter' && routine.goalValue) {
      return `${routine.goalValue} ${routine.goalUnit || 'عنصر'}`;
    }
    
    if (routine.goalType === 'duration' && routine.goalValue) {
      return `${routine.goalValue} ${routine.goalUnit || 'دقيقة'}`;
    }
    
    return '';
  };
  
  // Filter tasks for the selected date
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const tasksForSelectedDate = routineTasks.filter((task) => task.date === selectedDateString);
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: routine.color || themeColors.primary },
            ]}
          >
            <StyledText variant="h1" color="#FFFFFF">
              {routine.icon}
            </StyledText>
          </View>
          
          <StyledText variant="h1" style={styles.routineName}>
            {routine.name}
          </StyledText>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <StyledText variant="caption" color={themeColors.subtext}>
                التكرار
              </StyledText>
              <StyledText variant="body">{getFrequencyText()}</StyledText>
            </View>
            
            <View style={styles.detailItem}>
              <StyledText variant="caption" color={themeColors.subtext}>
                الهدف
              </StyledText>
              <StyledText variant="body">{getGoalText()}</StyledText>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: themeColors.border }]}
              onPress={handleEditRoutine}
            >
              <Edit size={20} color={themeColors.text} />
              <StyledText variant="button" style={styles.actionButtonText}>
                تعديل
              </StyledText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: '#EF4444' }]}
              onPress={handleDeleteRoutine}
            >
              <Trash2 size={20} color="#EF4444" />
              <StyledText variant="button" color="#EF4444" style={styles.actionButtonText}>
                حذف
              </StyledText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.datePickerSection}>
          <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
            <StyledText variant="h3" style={styles.sectionTitle}>
              اختر التاريخ
            </StyledText>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datePickerContainer}
          >
            {dateRange.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              
              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.dateItem,
                    isSelected && [styles.selectedDateItem, { backgroundColor: themeColors.primary }],
                    { borderColor: themeColors.border },
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <StyledText
                    variant="caption"
                    color={isSelected ? '#FFFFFF' : themeColors.subtext}
                  >
                    {format(date, 'EEE')}
                  </StyledText>
                  <StyledText
                    variant="h3"
                    color={isSelected ? '#FFFFFF' : themeColors.text}
                  >
                    {format(date, 'd')}
                  </StyledText>
                  
                  {/* التاريخ الهجري فوق والميلادي تحت */}
                  <StyledText
                    variant="caption"
                    color={isSelected ? '#FFFFFF' : themeColors.subtext}
                    style={styles.hijriDate}
                  >
                    {formatDateByCalendar(date, 'hijri').split('، ')[1]?.split(' ')[0] || ''}
                  </StyledText>
                  <StyledText
                    variant="caption"
                    color={isSelected ? '#FFFFFF' : themeColors.subtext}
                    style={styles.gregorianDate}
                  >
                    {format(date, 'MMM')}
                  </StyledText>
                  
                  {isToday && (
                    <View
                      style={[
                        styles.todayIndicator,
                        { backgroundColor: isSelected ? '#FFFFFF' : themeColors.primary },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        <View style={styles.tasksSection}>
          <View style={styles.tasksSectionHeader}>
            <View style={styles.tasksSectionTitleContainer}>
              <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
                <StyledText variant="h3">المهام</StyledText>
              </View>
              <View style={styles.dateDisplayContainer}>
                <DateDisplay 
                  date={selectedDate} 
                  showIcon={false}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: themeColors.primary }]}
              onPress={handleAddTask}
            >
              <Plus size={16} color="#FFFFFF" />
              <StyledText variant="button" color="#FFFFFF" style={styles.addButtonText}>
                إضافة مهمة
              </StyledText>
            </TouchableOpacity>
          </View>
          
          {tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                routine={routine}
                onPress={() => handleUpdateProgress(task)}
                onComplete={() => handleTaskComplete(task.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <StyledText variant="body" color={themeColors.subtext} centered>
                لا توجد مهام لهذا التاريخ.
              </StyledText>
              <StyledText variant="caption" color={themeColors.subtext} centered style={styles.emptyStateSubtext}>
                أضف مهمة لتتبع تقدمك.
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
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  routineName: {
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  detailItem: {
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
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
  datePickerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    textAlign: 'right',
  },
  datePickerContainer: {
    paddingVertical: 8,
  },
  dateItem: {
    width: 60,
    height: 100,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    paddingVertical: 4,
  },
  selectedDateItem: {
    borderWidth: 0,
  },
  hijriDate: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  gregorianDate: {
    fontSize: 10,
    marginTop: 1,
    opacity: 0.8,
  },
  sectionTitleBackground: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  tasksSection: {
    marginBottom: 16,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tasksSectionTitleContainer: {
    flex: 1,
    gap: 4,
  },
  dateDisplayContainer: {
    gap: 2,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateSubtext: {
    marginTop: 8,
  },
});