import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { Button } from '@/components/Button';
import { useRoutineStore } from '@/store/routineStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { format, addDays } from 'date-fns';

const ICONS = ['📚', '🏃', '💧', '🧘', '📝', '💪', '🍎', '😴', '🙏', '🧠'];
const COLORS = [
  '#6366F1', // Indigo
  '#34D399', // Green
  '#FBBF24', // Yellow
  '#F87171', // Red
  '#60A5FA', // Blue
  '#A78BFA', // Purple
  '#F472B6', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#6B7280', // Gray
];

const FREQUENCY_TYPES = [
  { id: 'daily', label: 'يومياً' },
  { id: 'specific-days', label: 'أيام محددة' },
];

const DAYS = [
  { id: 0, label: 'الأحد' },
  { id: 1, label: 'الاثنين' },
  { id: 2, label: 'الثلاثاء' },
  { id: 3, label: 'الأربعاء' },
  { id: 4, label: 'الخميس' },
  { id: 5, label: 'الجمعة' },
  { id: 6, label: 'السبت' },
];

const GOAL_TYPES = [
  { id: 'completion', label: 'إنجاز بسيط' },
  { id: 'counter', label: 'عداد (مثل: 5 أكواب ماء)' },
  { id: 'duration', label: 'مدة زمنية (مثل: 30 دقيقة قراءة)' },
];

export default function CreateRoutineScreen() {
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { addRoutine, addTask } = useRoutineStore();
  
  const themeColors = colors[settings.theme];
  
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [frequencyType, setFrequencyType] = useState<'daily' | 'specific-days'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [goalType, setGoalType] = useState<'completion' | 'counter' | 'duration'>('completion');
  const [goalValue, setGoalValue] = useState('');
  const [goalUnit, setGoalUnit] = useState('');
  
  const createTasksForRoutine = (routineId: string, frequency: { type: 'daily' | 'specific-days'; days?: number[] }) => {
    const today = new Date();
    
    // إنشاء مهام لمدة 30 يوم قادم
    for (let i = 0; i < 30; i++) {
      const currentDate = addDays(today, i);
      const dayOfWeek = currentDate.getDay();
      const dateString = format(currentDate, 'yyyy-MM-dd');
      
      let shouldCreateTask = false;
      
      if (frequency.type === 'daily') {
        shouldCreateTask = true;
      } else if (frequency.type === 'specific-days' && frequency.days) {
        shouldCreateTask = frequency.days.includes(dayOfWeek);
      }
      
      if (shouldCreateTask) {
        addTask({
          routineId,
          date: dateString,
          completed: false,
          ...(goalType !== 'completion' && { progress: 0 }),
        });
      }
    }
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      // Show error
      return;
    }
    
    if (frequencyType === 'specific-days' && selectedDays.length === 0) {
      // Show error - must select at least one day
      return;
    }
    
    const routineId = Date.now().toString();
    
    // إنشاء الروتين
    const routine = {
      id: routineId,
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      frequency: {
        type: frequencyType,
        ...(frequencyType === 'specific-days' && { days: selectedDays }),
      },
      goalType,
      ...(goalType !== 'completion' && {
        goalValue: parseInt(goalValue, 10),
        goalUnit: goalUnit.trim(),
      }),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // إضافة الروتين إلى المتجر
    addRoutine({
      name: routine.name,
      icon: routine.icon,
      color: routine.color,
      frequency: routine.frequency,
      goalType: routine.goalType,
      ...(routine.goalType !== 'completion' && {
        goalValue: routine.goalValue,
        goalUnit: routine.goalUnit,
      }),
    });
    
    // إنشاء المهام تلقائياً
    createTasksForRoutine(routineId, routine.frequency);
    
    router.back();
  };
  
  const toggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((id) => id !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <View style={styles.section}>
          <StyledText variant="h3" style={styles.sectionTitle}>
            المعلومات الأساسية
          </StyledText>
          
          <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="اسم الروتين"
              placeholderTextColor={themeColors.subtext}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <StyledText variant="h3" style={styles.sectionTitle}>
            اختر أيقونة
          </StyledText>
          
          <View style={styles.iconGrid}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconItem,
                  {
                    backgroundColor: selectedIcon === icon ? selectedColor : themeColors.card,
                    borderColor: themeColors.border,
                  },
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <StyledText variant="h2" color={selectedIcon === icon ? '#FFFFFF' : themeColors.text}>
                  {icon}
                </StyledText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <StyledText variant="h3" style={styles.sectionTitle}>
            اختر لوناً
          </StyledText>
          
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorItem,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorItem,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <StyledText variant="h3" style={styles.sectionTitle}>
            التكرار
          </StyledText>
          
          <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            {FREQUENCY_TYPES.map((type, index) => (
              <View key={type.id}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => setFrequencyType(type.id as any)}
                >
                  <StyledText variant="body">{type.label}</StyledText>
                  <View
                    style={[
                      styles.radioButton,
                      frequencyType === type.id && { borderColor: themeColors.primary },
                    ]}
                  >
                    {frequencyType === type.id && (
                      <View
                        style={[styles.radioButtonInner, { backgroundColor: themeColors.primary }]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {index < FREQUENCY_TYPES.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
                )}
              </View>
            ))}
          </View>
          
          {frequencyType === 'specific-days' && (
            <View style={styles.daysContainer}>
              <StyledText variant="caption" color={themeColors.subtext} style={styles.daysLabel}>
                اختر الأيام التي تريد تكرار الروتين فيها:
              </StyledText>
              <View style={styles.daysGrid}>
                {DAYS.map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.dayItem,
                      {
                        backgroundColor: selectedDays.includes(day.id)
                          ? selectedColor
                          : themeColors.card,
                        borderColor: themeColors.border,
                      },
                    ]}
                    onPress={() => toggleDay(day.id)}
                  >
                    <StyledText
                      variant="button"
                      color={selectedDays.includes(day.id) ? '#FFFFFF' : themeColors.text}
                    >
                      {day.label}
                    </StyledText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <StyledText variant="h3" style={styles.sectionTitle}>
            نوع الهدف
          </StyledText>
          
          <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            {GOAL_TYPES.map((type, index) => (
              <View key={type.id}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => setGoalType(type.id as any)}
                >
                  <StyledText variant="body">{type.label}</StyledText>
                  <View
                    style={[
                      styles.radioButton,
                      goalType === type.id && { borderColor: themeColors.primary },
                    ]}
                  >
                    {goalType === type.id && (
                      <View
                        style={[styles.radioButtonInner, { backgroundColor: themeColors.primary }]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {index < GOAL_TYPES.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
                )}
              </View>
            ))}
          </View>
          
          {(goalType === 'counter' || goalType === 'duration') && (
            <View style={styles.goalValueContainer}>
              <View
                style={[
                  styles.inputContainer,
                  styles.goalValueInput,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: themeColors.text }]}
                  placeholder="القيمة"
                  placeholderTextColor={themeColors.subtext}
                  value={goalValue}
                  onChangeText={setGoalValue}
                  keyboardType="numeric"
                />
              </View>
              
              <View
                style={[
                  styles.inputContainer,
                  styles.goalUnitInput,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: themeColors.text }]}
                  placeholder={goalType === 'counter' ? "الوحدة (مثل: صفحات)" : "الوحدة (مثل: دقائق)"}
                  placeholderTextColor={themeColors.subtext}
                  value={goalUnit}
                  onChangeText={setGoalUnit}
                />
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="إنشاء الروتين"
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
            disabled={!name.trim() || (frequencyType === 'specific-days' && selectedDays.length === 0)}
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
  },
  input: {
    fontSize: 16,
    height: '100%',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  iconItem: {
    width: 56,
    height: 56,
    borderRadius: 8,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
  },
  selectedColorItem: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  daysContainer: {
    marginTop: 12,
  },
  daysLabel: {
    marginBottom: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  dayItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
  },
  goalValueContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  goalValueInput: {
    flex: 1,
    marginRight: 8,
  },
  goalUnitInput: {
    flex: 2,
  },
  buttonContainer: {
    marginTop: 16,
  },
});