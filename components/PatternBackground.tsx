import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Path } from 'react-native-svg';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface PatternBackgroundProps {
  children: React.ReactNode;
  patternType?: 'geometric' | 'organic' | 'islamic' | 'minimal';
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({ 
  children, 
  patternType = 'minimal' 
}) => {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme as keyof typeof colors];

  const renderPattern = () => {
    const patternColor = themeColors.border + '10'; // Very subtle opacity

    switch (patternType) {
      case 'geometric':
        return (
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
            <Defs>
              <Pattern
                id="geometricPattern"
                patternUnits="userSpaceOnUse"
                width="40"
                height="40"
              >
                <Rect width="40" height="40" fill="transparent" />
                <Circle cx="20" cy="20" r="2" fill={patternColor} />
                <Path
                  d="M0,20 L40,20 M20,0 L20,40"
                  stroke={patternColor}
                  strokeWidth="0.5"
                />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#geometricPattern)" />
          </Svg>
        );
      
      case 'islamic':
        return (
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
            <Defs>
              <Pattern
                id="islamicPattern"
                patternUnits="userSpaceOnUse"
                width="60"
                height="60"
              >
                <Rect width="60" height="60" fill="transparent" />
                <Path
                  d="M30,10 L40,20 L30,30 L20,20 Z"
                  fill={patternColor}
                />
                <Circle cx="30" cy="30" r="3" fill={patternColor} />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#islamicPattern)" />
          </Svg>
        );
      
      case 'organic':
        return (
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
            <Defs>
              <Pattern
                id="organicPattern"
                patternUnits="userSpaceOnUse"
                width="80"
                height="80"
              >
                <Rect width="80" height="80" fill="transparent" />
                <Path
                  d="M20,40 Q40,20 60,40 Q40,60 20,40"
                  fill={patternColor}
                />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#organicPattern)" />
          </Svg>
        );
      
      default: // minimal
        return (
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
            <Defs>
              <Pattern
                id="minimalPattern"
                patternUnits="userSpaceOnUse"
                width="100"
                height="100"
              >
                <Rect width="100" height="100" fill="transparent" />
                <Circle cx="50" cy="50" r="1" fill={patternColor} />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#minimalPattern)" />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderPattern()}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});