import React from 'react';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/src/shared/hooks/useColors';

interface Props {
  children: React.ReactNode;
  barStyle?: 'light-content' | 'dark-content';
  backgroundColor?: string;
  topInset?: boolean;
}

export function ScreenWrapper({
  children,
  barStyle = 'light-content',
  backgroundColor,
  topInset = false,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bg = backgroundColor ?? colors.background;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={barStyle} />
      <View style={{ height: topInset ? insets.top : 0 }} />
      {children}
    </View>
  );
}
