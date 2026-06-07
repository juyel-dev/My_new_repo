import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { EmptyState } from '@/src/shared/components/ui/EmptyState';
import { PROVIDER_ICONS } from '@/src/shared/lib/constants';
import type { Model } from '@/src/shared/types';

function ModelRow({ item, index }: { item: Model; index: number }) {
  const colors = useColors();
  const haptics = useHaptics();
  const toggleModel = useAppStore((s) => s.toggleModel);
  const providers = useAppStore((s) => s.providers);

  const provider = providers.find((p) => p.id === item.providerId);
  const icon = provider ? PROVIDER_ICONS[provider.type] ?? 'cpu' : 'cpu';

  return (
    <Animated.View entering={Platform.OS !== 'web' ? FadeInDown.delay(index * 40).duration(300) : undefined}>
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderColor: colors.primaryBorder }]}>
          <Feather name={icon} size={14} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.sub, { color: colors.textDim }]}>
            {provider?.name ?? 'Unknown'} · {item.contextLength.toLocaleString()} tokens
          </Text>
        </View>
        <Switch
          value={item.enabled}
          onValueChange={() => { haptics.selection(); toggleModel(item.id); }}
          trackColor={{ false: colors.chip, true: colors.primary }}
          thumbColor="#fff"
        />
      </View>
    </Animated.View>
  );
}

export default function ModelsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const models = useAppStore((s) => s.models);

  const top = Platform.OS === 'web' ? 67 : insets.top;
  const bottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Models</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={models}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ModelRow item={item} index={index} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottom + 20 },
          models.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={
          <EmptyState icon="cpu" title="No models" subtitle="Add a provider to see available models" />
        }
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!models.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontFamily: 'Inter_600SemiBold', flex: 1, textAlign: 'center' },
  list: { padding: 12, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  sub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
