import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';

interface EnhancedTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  weight?: 'regular' | 'bold';
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
  arabic?: boolean;
}

export const EnhancedText: React.FC<EnhancedTextProps> = ({
  children,
  variant = 'body',
  weight = 'regular',
  color,
  style,
  numberOfLines,
  arabic = false,
}) => {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme as keyof typeof colors];

  const getFontFamily = () => {
    // Use system fonts for now to avoid loading issues
    if (arabic) {
      return weight === 'bold' ? 'System' : 'System';
    } else {
      return weight === 'bold' ? 'System' : 'System';
    }
  };

  const getVariantStyle = (): TextStyle => {
    const baseSize = settings.fontSize || 16;
    
    switch (variant) {
      case 'h1':
        return {
          fontSize: baseSize + 12,
          lineHeight: (baseSize + 12) * 1.3,
          fontWeight: '700',
          letterSpacing: arabic ? 0 : -0.5,
        };
      case 'h2':
        return {
          fontSize: baseSize + 8,
          lineHeight: (baseSize + 8) * 1.3,
          fontWeight: '600',
          letterSpacing: arabic ? 0 : -0.3,
        };
      case 'h3':
        return {
          fontSize: baseSize + 4,
          lineHeight: (baseSize + 4) * 1.3,
          fontWeight: '600',
          letterSpacing: arabic ? 0 : -0.2,
        };
      case 'body':
        return {
          fontSize: baseSize,
          lineHeight: baseSize * 1.5,
          fontWeight: '400',
          letterSpacing: arabic ? 0 : 0.1,
        };
      case 'caption':
        return {
          fontSize: baseSize - 2,
          lineHeight: (baseSize - 2) * 1.4,
          fontWeight: '400',
          letterSpacing: arabic ? 0 : 0.2,
        };
      case 'button':
        return {
          fontSize: baseSize,
          lineHeight: baseSize * 1.2,
          fontWeight: '600',
          letterSpacing: arabic ? 0 : 0.5,
        };
      default:
        return {};
    }
  };

  const textStyle: TextStyle = {
    fontFamily: getFontFamily(),
    color: color || themeColors.text,
    textAlign: arabic ? 'right' : 'left',
    writingDirection: arabic ? 'rtl' : 'ltr',
    ...getVariantStyle(),
    ...style,
  };

  return (
    <Text 
      style={textStyle} 
      numberOfLines={numberOfLines}
      allowFontScaling={true}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});