import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';

export default function MCPDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const haptics = useHaptics();

  const mcpServer = useAppStore((s) => s.mcpServers.find((s) => s.id === id));
  const updateMCPServer = useAppStore((s) => s.updateMCPServer);
  const deleteMCPServer = useAppStore((s) => s.deleteMCPServer);

  if (!mcpServer) {
    router.back();
    return null;
  }

  const statusColor = mcpServer.status === 'connected'
    ? colors.success
    : mcpServer.status === 'error'
      ? colors.destructive
      : colors.textDim;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{mcpServer.name}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderColor: colors.primaryBorder }]}>
            <Feather name="server" size={20} color={colors.primary} />
          </View>
          <View style={styles.meta}>
            <Text style={[styles.name, { color: colors.text }]}>{mcpServer.name}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.dot, { backgroundColor: statusColor }]} />
              <Text style={[styles.status, { color: statusColor }]}>{mcpServer.status}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Transport</Text>
          <Text style={[styles.value, { color: colors.textMuted }]}>{mcpServer.transport}</Text>
        </View>

        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>URL</Text>
          <Text style={[styles.value, { color: colors.textMuted }]} numberOfLines={1}>{mcpServer.url}</Text>
        </View>

        <View style={[styles.statusRow2, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statusLabel, { color: colors.text }]}>Enabled</Text>
          <Switch
            value={mcpServer.enabled}
            onValueChange={(val) => { haptics.selection(); updateMCPServer(id, { enabled: val }); }}
            trackColor={{ false: colors.chip, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <Pressable
          onPress={async () => {
            haptics.warning();
            await deleteMCPServer(id);
            router.back();
          }}
          style={styles.deleteBtn}
        >
          <Feather name="trash-2" size={16} color={colors.destructive} />
          <Text style={[styles.deleteText, { color: colors.destructive }]}>Delete Server</Text>
        </Pressable>
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
  content: { padding: 16, gap: 10 },
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  status: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  label: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  value: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  statusRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    marginTop: 4,
  },
  deleteText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});
