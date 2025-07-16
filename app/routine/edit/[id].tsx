import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { Button } from '@/components/Button';
import { useRoutineStore } from '@/store/routineStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';

const ICONS = ['📚', '🏃', '💧', '🧘', '📝', '💪', '🍎', '😴', '🙏', '🧠'];
const COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
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

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { settings } = useSettingsStore();
  const { routines, updateRoutine } = useRoutineStore();
  
  const themeColors = colors[settings.theme];
  
  const routine = routines.find(r => r.id === id);
  
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [frequencyType, setFrequencyType] = useState<'daily' | 'specific-days'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [goalType, setGoalType] = useState<'completion' | 'counter' | 'duration'>('completion');
  const [goalValue, setGoalValue] = useState('');
  const [goalUnit, setGoalUnit] = useState('');
  
  useEffect(() => {
    if (routine) {
      setName(routine.name);
      setSelectedIcon(routine.icon);
      setSelectedColor(routine.color);
      
      // Handle frequency type migration - convert old 'weekly' type to 'daily'
      const routineFrequencyType = routine.frequency.type as string;
      if (routineFrequencyType === 'weekly') {
        setFrequencyType('daily');
      } else if (routineFrequencyType === 'daily' || routineFrequencyType === 'specific-days') {
        setFrequencyType(routineFrequencyType);
      } else {
        // Default fallback
        setFrequencyType('daily');
      }
      
      setSelectedDays(routine.frequency.days || []);
      setGoalType(routine.goalType);
      setGoalValue(routine.goalValue?.toString() || '');
      setGoalUnit(routine.goalUnit || '');
    }
  }, [routine]);
  
  if (!routine) {
    return null;
  }
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الروتين');
      return;
    }
    
    if (frequencyType === 'specific-days' && selectedDays.length === 0) {
      Alert.alert('خطأ', 'يرجى اختيار يوم واحد على الأقل');
      return;
    }
    
    updateRoutine(id, {
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
    });
    
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
            title="حفظ التغييرات"
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
    marginTop: 12,
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
    gap: 8,
  },
  goalValueInput: {
    flex: 1,
  },
  goalUnitInput: {
    flex: 2,
  },
  buttonContainer: {
    marginTop: 16,
  },
});