import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  delay = 0,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animatedValue, duration, delay]);

  const getAnimatedStyle = () => {
    switch (type) {
      case 'fade':
        return {
          opacity: animatedValue,
        };
      case 'slide':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      case 'scale':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
      case 'bounce':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.1, 1],
              }),
            },
          ],
        };
      default:
        return {};
    }
  };

  return (
    <Animated.View style={[getAnimatedStyle(), style]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});