import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { EmptyState } from '@/src/shared/components/ui/EmptyState';
import { AGENT_ICONS } from '@/src/shared/lib/constants';
import type { Agent } from '@/src/shared/types';

function AgentRow({ item, index }: { item: Agent; index: number }) {
  const colors = useColors();
  const haptics = useHaptics();
  const icon = AGENT_ICONS[item.icon] ?? 'cpu';

  return (
    <Animated.View entering={Platform.OS !== 'web' ? FadeInDown.delay(index * 50).duration(300) : undefined}>
      <Pressable
        onPress={() => { haptics.light(); router.push(`/settings/agents/${item.id}`); }}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderColor: colors.primaryBorder }]}>
          <Feather name={icon} size={16} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.desc, { color: colors.textDim }]} numberOfLines={1}>{item.description}</Text>
        </View>
        <Feather name="chevron-right" size={15} color={colors.textFaint} />
      </Pressable>
    </Animated.View>
  );
}

export default function AgentsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const agents = useAppStore((s) => s.agents);

  const top = Platform.OS === 'web' ? 67 : insets.top;
  const bottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Agents</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={agents}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <AgentRow item={item} index={index} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottom + 20 },
          agents.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={<EmptyState icon="user" title="No agents" subtitle="Agents will appear here" />}
        showsVerticalScrollIndicator={false}
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
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  desc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
