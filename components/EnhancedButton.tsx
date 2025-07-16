import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  gradient = false,
}) => {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme as keyof typeof colors];

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 12,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: themeColors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    };

    const sizeStyles = {
      small: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      medium: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 },
      large: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 52 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: themeColors.primary,
      },
      secondary: {
        backgroundColor: themeColors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: themeColors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
      ...style,
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    };

    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantTextStyles = {
      primary: { color: themeColors.background },
      secondary: { color: themeColors.background },
      outline: { color: themeColors.primary },
      ghost: { color: themeColors.primary },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  const buttonStyle = getButtonStyle();
  const buttonTextStyle = getTextStyle();

  if (gradient && (variant === 'primary' || variant === 'secondary')) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[themeColors.primary, themeColors.secondary]}
          style={buttonStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={buttonTextStyle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});