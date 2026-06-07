import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useColors } from '@/src/shared/hooks/useColors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderColor?: string;
  backgroundColor?: string;
}

export function Card({
  children,
  onPress,
  padding = 'md',
  borderColor,
  backgroundColor,
}: CardProps) {
  const colors = useColors();
  const paddings = { none: 0, sm: 10, md: 14, lg: 18 };

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: backgroundColor ?? colors.card,
          borderColor: borderColor ?? colors.border,
          padding: paddings[padding],
        },
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
