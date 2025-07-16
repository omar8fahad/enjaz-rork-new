import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';

interface EnhancedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  elevation?: number;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  children, 
  style, 
  gradient = false, 
  elevation = 2 
}) => {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme as keyof typeof colors];

  const cardStyle = {
    backgroundColor: themeColors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: themeColors.text,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 2,
    elevation: elevation,
    borderWidth: 1,
    borderColor: themeColors.border + '20',
    ...style,
  };

  if (gradient) {
    return (
      <LinearGradient
        colors={[themeColors.card, themeColors.background]}
        style={cardStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});