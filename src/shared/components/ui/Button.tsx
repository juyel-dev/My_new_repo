import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useColors } from '@/src/shared/hooks/useColors';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const colors = useColors();
  const pressedValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressedValue.value }],
    opacity: withTiming(disabled || loading ? 0.6 : 1, { duration: 150 }),
  }));

  const handlePressIn = () => {
    pressedValue.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    pressedValue.value = withTiming(1, { duration: 150 });
  };

  const variantStyles = {
    primary: {
      background: colors.primary,
      text: '#ffffff',
    },
    secondary: {
      background: colors.card,
      text: colors.text,
    },
    ghost: {
      background: 'transparent',
      text: colors.textMuted,
    },
    danger: {
      background: colors.destructive,
      text: '#ffffff',
    },
  };

  const sizeStyles = {
    sm: { height: 36, fontSize: 13, iconSize: 14, radius: 10 },
    md: { height: 46, fontSize: 15, iconSize: 16, radius: 12 },
    lg: { height: 54, fontSize: 16, iconSize: 18, radius: 16 },
  };

  const vs = variantStyles[variant];
  const ss = sizeStyles[size];

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        styles.button,
        {
          backgroundColor: vs.background,
          borderColor: variant === 'secondary' ? colors.border : 'transparent',
          borderWidth: variant === 'secondary' ? 1 : 0,
          height: ss.height,
          borderRadius: ss.radius,
          width: fullWidth ? '100%' : undefined,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <>
          {icon && <Feather name={icon} size={ss.iconSize} color={vs.text} />}
          <Text style={[styles.text, { fontSize: ss.fontSize, color: vs.text }]}>
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
  },
});
