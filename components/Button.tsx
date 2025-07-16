import { TouchableOpacity, StyleSheet, ActivityIndicator, View, ViewStyle } from 'react-native';
import { StyledText } from './StyledText';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useColorScheme } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { settings } = useSettingsStore();
  const colorScheme = useColorScheme();
  
  // Use current theme directly
  const themeColors = colors[settings.theme];
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: settings.accentColor || themeColors.primary,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: themeColors.secondary,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: settings.accentColor || themeColors.primary,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return settings.accentColor || themeColors.primary;
    }
  };
  
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
        };
      case 'medium':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
        };
      case 'large':
        return {
          paddingVertical: 14,
          paddingHorizontal: 20,
        };
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <StyledText
              variant="button"
              color={getTextColor()}
              style={disabled && styles.disabledText}
            >
              {title}
            </StyledText>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});