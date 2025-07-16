import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  type?: 'default' | 'read' | 'memorized' | 'revised';
}

export function ProgressBar({
  progress,
  height = 8,
  color,
  type = 'default',
}: ProgressBarProps) {
  const { settings } = useSettingsStore();
  const colorScheme = useColorScheme();
  
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  // Get gradient colors based on type and theme
  const getGradientColors = () => {
    if (color) {
      return [color, color]; // Single color if specified
    }
    
    switch (type) {
      case 'read':
        return [themeColors.quranRead, themeColors.secondary];
      case 'memorized':
        return [themeColors.quranMemorized, themeColors.primary];
      case 'revised':
        return [themeColors.quranRevised, themeColors.warning];
      default:
        return [themeColors.primary, themeColors.secondary];
    }
  };
  
  const gradientColors = getGradientColors();
  const progressWidth = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={[styles.container, { height, backgroundColor: themeColors.border }]}>
      {progressWidth > 0 && (
        <LinearGradient
          colors={gradientColors.length >= 2 ? gradientColors as [string, string, ...string[]] : [gradientColors[0] || themeColors.primary, gradientColors[0] || themeColors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progress,
            {
              width: `${progressWidth}%`,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 6,
  },
});