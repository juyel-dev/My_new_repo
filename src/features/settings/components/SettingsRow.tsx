import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/src/shared/hooks/useColors';

interface Props {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  rightEl?: React.ReactNode;
  danger?: boolean;
}

export function SettingsRow({ icon, label, value, onPress, rightEl, danger }: Props) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !rightEl}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View style={[
        styles.icon,
        {
          backgroundColor: danger ? colors.destructiveMuted : colors.primaryMuted,
          borderColor: danger ? colors.destructiveBorder : colors.primaryBorder,
        },
      ]}>
        <Feather name={icon} size={15} color={danger ? colors.destructive : colors.primary} />
      </View>
      <Text style={[styles.label, { color: danger ? colors.destructive : colors.text }]}>{label}</Text>
      {rightEl ?? (
        <View style={styles.right}>
          {value ? <Text style={[styles.value, { color: colors.textDim }]}>{value}</Text> : null}
          {onPress ? <Feather name="chevron-right" size={15} color={colors.textFaint} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  value: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
