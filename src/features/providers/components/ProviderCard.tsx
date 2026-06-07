import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { PROVIDER_ICONS } from '@/src/shared/lib/constants';
import type { Provider } from '@/src/shared/types';

interface Props {
  provider: Provider;
  index: number;
  onPress: () => void;
  onToggle: () => void;
}

export function ProviderCard({ provider, index, onPress, onToggle }: Props) {
  const colors = useColors();
  const haptics = useHaptics();
  const icon = PROVIDER_ICONS[provider.type] ?? 'key';

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderColor: colors.primaryBorder }]}>
          <Feather name={icon} size={16} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{provider.name}</Text>
          <Text style={[styles.type, { color: colors.textDim }]}>
            {provider.type} · {provider.apiKey.slice(0, 6)}•••
          </Text>
        </View>
        <Switch
          value={provider.enabled}
          onValueChange={() => { haptics.selection(); onToggle(); }}
          trackColor={{ false: colors.chip, true: colors.primary }}
          thumbColor="#fff"
        />
        <Feather name="chevron-right" size={15} color={colors.textFaint} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  type: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
