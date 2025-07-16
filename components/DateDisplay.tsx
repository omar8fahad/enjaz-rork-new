import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StyledText } from './StyledText';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { Calendar } from 'lucide-react-native';
import { formatDateByCalendar, gregorianToHijri, formatHijriDate } from '@/utils/hijriUtils';
import { useColorScheme } from 'react-native';

interface DateDisplayProps {
  date: Date;
  showIcon?: boolean;
  onPress?: () => void;
  variant?: 'body' | 'caption';
}

export function DateDisplay({ date, showIcon = true, onPress, variant = 'caption' }: DateDisplayProps) {
  const { settings } = useSettingsStore();
  const colorScheme = useColorScheme();
  
  // Use the selected theme directly (no system theme anymore)
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  // Always show both dates - Hijri on top, Gregorian below
  const hijriDate = gregorianToHijri(date);
  const hijriFormatted = formatHijriDate(hijriDate);
  const gregorianFormatted = formatDateByCalendar(date, 'gregorian');
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={[styles.container, onPress && styles.pressable]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {showIcon && <Calendar size={16} color={themeColors.primary} />}
      <View style={styles.dateContainer}>
        <StyledText variant={variant} color={themeColors.text} style={styles.hijriText}>
          {hijriFormatted}
        </StyledText>
        <StyledText variant="caption" color={themeColors.subtext} style={styles.gregorianText}>
          {gregorianFormatted}
        </StyledText>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pressable: {
    padding: 4,
    borderRadius: 4,
  },
  dateContainer: {
    marginLeft: 8,
    flex: 1,
  },
  hijriText: {
    marginBottom: 2,
    fontWeight: '600',
  },
  gregorianText: {
    fontSize: 12,
    opacity: 0.8,
  },
});