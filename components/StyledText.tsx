import { Text, TextProps, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

interface StyledTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  color?: string;
  centered?: boolean;
}

export function StyledText({
  variant = 'body',
  color,
  centered,
  style,
  ...props
}: StyledTextProps) {
  const { settings } = useSettingsStore();
  const colorScheme = useColorScheme();
  
  // Use the selected theme directly (no system theme anymore)
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  const textStyle = useMemo(() => {
    const baseSize = settings.fontSize;
    
    const variantStyles = {
      h1: { fontSize: baseSize * 1.75, fontWeight: '700' },
      h2: { fontSize: baseSize * 1.5, fontWeight: '600' },
      h3: { fontSize: baseSize * 1.25, fontWeight: '600' },
      body: { fontSize: baseSize, fontWeight: '400' },
      caption: { fontSize: baseSize * 0.875, fontWeight: '400' },
      button: { fontSize: baseSize, fontWeight: '600' },
    };
    
    // Use primary color for headings if no color is specified
    const defaultColor = color || (
      (variant === 'h1' || variant === 'h2' || variant === 'h3') 
        ? themeColors.primary 
        : themeColors.text
    );
    
    return [
      styles.text,
      variantStyles[variant],
      { color: defaultColor },
      centered && styles.centered,
      style,
    ];
  }, [variant, color, centered, style, settings.fontSize, themeColors]);

  return <Text style={textStyle} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
  },
  centered: {
    textAlign: 'center',
  },
});