import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/src/shared/hooks/useColors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const colors = useColors();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.card,
        },
        style,
      ]}
    />
  );
}

export function SkeletonList({ count = 3, itemHeight = 60, gap = 8 }: { count?: number; itemHeight?: number; gap?: number }) {
  return (
    <View style={[styles.list, { gap }]}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} height={itemHeight} borderRadius={14} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  list: {
    width: '100%',
    padding: 12,
  },
});
