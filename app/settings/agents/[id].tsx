import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { CapabilityChip } from '@/src/shared/components/ui/CapabilityChip';
import { AGENT_ICONS } from '@/src/shared/lib/constants';

export default function AgentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const haptics = useHaptics();

  const agent = useAppStore((s) => s.agents.find((a) => a.id === id));
  const updateAgent = useAppStore((s) => s.updateAgent);

  if (!agent) {
    router.back();
    return null;
  }

  const icon = AGENT_ICONS[agent.icon] ?? 'cpu';

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{agent.name}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderColor: colors.primaryBorder }]}>
            <Feather name={icon} size={20} color={colors.primary} />
          </View>
          <View style={styles.meta}>
            <Text style={[styles.name, { color: colors.text }]}>{agent.name}</Text>
            <Text style={[styles.desc, { color: colors.textDim }]}>{agent.description}</Text>
          </View>
        </View>

        <View style={[styles.statusRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statusLabel, { color: colors.text }]}>Enabled</Text>
          <Switch
            value={agent.enabled}
            onValueChange={(val) => { haptics.selection(); updateAgent(id, { enabled: val }); }}
            trackColor={{ false: colors.chip, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textDim }]}>CAPABILITIES</Text>
        <View style={styles.chipsRow}>
          {agent.capabilities.map((cap) => (
            <CapabilityChip key={cap} capability={cap} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textDim }]}>SYSTEM PROMPT</Text>
        <View style={[styles.promptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.promptText, { color: colors.textMuted }]}>{agent.systemPrompt}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{agent.temperature}</Text>
            <Text style={[styles.statLabel, { color: colors.textDim }]}>Temperature</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{agent.maxTokens.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.textDim }]}>Max Tokens</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontFamily: 'Inter_600SemiBold', flex: 1, textAlign: 'center' },
  content: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1 },
  name: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  desc: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2, lineHeight: 18 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    marginTop: 4,
    marginLeft: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
  },
  promptCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  promptText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
