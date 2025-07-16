import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StyledText } from './StyledText';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { Check } from 'lucide-react-native';
import { Task, Routine } from '@/types';
import { useColorScheme } from 'react-native';

interface TaskCardProps {
  task: Task;
  routine: Routine;
  onPress: () => void;
  onComplete: () => void;
}

export function TaskCard({ task, routine, onPress, onComplete }: TaskCardProps) {
  const { settings } = useSettingsStore();
  const colorScheme = useColorScheme();
  
  // Use current theme directly
  const themeColors = colors[settings.theme];
  
  const getProgressText = () => {
    if (routine.goalType === 'completion') {
      return null;
    }
    
    if (routine.goalType === 'counter') {
      return `${task.progress || 0}/${routine.goalValue} ${routine.goalUnit || ''}`;
    }
    
    if (routine.goalType === 'duration') {
      return `${task.progress || 0}/${routine.goalValue} ${routine.goalUnit || 'min'}`;
    }
  };
  
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
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: routine.color || themeColors.primary },
            ]}
          >
            <StyledText color="#FFFFFF">{routine.icon}</StyledText>
          </View>
          <View style={styles.titleContainer}>
            <StyledText
              variant="h3"
              style={[task.completed && styles.completedText]}
            >
              {routine.name}
            </StyledText>
            {getProgressText() && (
              <StyledText
                variant="caption"
                color={themeColors.subtext}
                style={[task.completed && styles.completedText]}
              >
                {getProgressText()}
              </StyledText>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.checkButton,
            task.completed
              ? { backgroundColor: themeColors.success }
              : { borderColor: themeColors.border },
          ]}
          onPress={onComplete}
        >
          {task.completed && <Check size={16} color="#FFFFFF" />}
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});