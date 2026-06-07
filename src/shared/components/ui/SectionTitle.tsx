import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/src/shared/hooks/useColors';

interface Props {
  title: string;
  children: React.ReactNode;
  gap?: number;
}

export function SectionTitle({ title, children, gap = 2 }: Props) {
  const colors = useColors();
  return (
    <View style={[styles.section, { gap: 6 }]}>
      <Text style={[styles.title, { color: colors.textDim }]}>{title}</Text>
      <View style={{ gap }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    marginBottom: 2,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});
