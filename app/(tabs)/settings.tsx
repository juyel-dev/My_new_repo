import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { SettingsRow } from '@/src/features/settings/components/SettingsRow';
import { SectionTitle } from '@/src/shared/components/ui/SectionTitle';
import { ENV } from '@/src/shared/config/env';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const haptics = useHaptics();

  const providers = useAppStore((s) => s.providers);
  const models = useAppStore((s) => s.models);
  const agents = useAppStore((s) => s.agents);
  const mcpServers = useAppStore((s) => s.mcpServers);
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const top = Platform.OS === 'web' ? 67 : insets.top;
  const bottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const providersCount = providers.filter((p) => p.enabled).length;
  const modelsCount = models.filter((m) => m.enabled).length;
  const agentsCount = agents.filter((a) => a.enabled).length;
  const mcpCount = mcpServers.filter((s) => s.enabled).length;

  const toggle = (key: keyof typeof settings) => () => {
    haptics.selection();
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: top }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title="AI Providers">
          <SettingsRow
            icon="key"
            label="Providers"
            value={`${providersCount} active`}
            onPress={() => { haptics.light(); router.push('/settings/providers/index'); }}
          />
          <SettingsRow
            icon="cpu"
            label="Models"
            value={`${modelsCount} enabled`}
            onPress={() => { haptics.light(); router.push('/settings/models'); }}
          />
        </SectionTitle>

        <SectionTitle title="Agents & Tools">
          <SettingsRow
            icon="user"
            label="Agents"
            value={`${agentsCount} active`}
            onPress={() => { haptics.light(); router.push('/settings/agents/index'); }}
          />
          <SettingsRow
            icon="server"
            label="MCP Servers"
            value={`${mcpCount} connected`}
            onPress={() => { haptics.light(); router.push('/settings/mcp/index'); }}
          />
        </SectionTitle>

        <SectionTitle title="Preferences">
          <SettingsRow
            icon="zap"
            label="Streaming Responses"
            rightEl={
              <Switch
                value={settings.streamingEnabled}
                onValueChange={toggle('streamingEnabled')}
                trackColor={{ false: colors.chip, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <SettingsRow
            icon="database"
            label="Persistent Memory"
            onPress={() => { haptics.light(); router.push('/settings/memory'); }}
            rightEl={
              <View style={styles.rowRight}>
                <Text style={[styles.rowValue, { color: settings.persistentMemory ? colors.primary : colors.textDim }]}>
                  {settings.persistentMemory ? 'On' : 'Off'}
                </Text>
                <Feather name="chevron-right" size={15} color={colors.textFaint} />
              </View>
            }
          />
          <SettingsRow
            icon="smartphone"
            label="Haptic Feedback"
            rightEl={
              <Switch
                value={settings.hapticFeedback}
                onValueChange={toggle('hapticFeedback')}
                trackColor={{ false: colors.chip, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </SectionTitle>

        <SectionTitle title="Data">
          <SettingsRow
            icon="alert-triangle"
            label="Danger Zone"
            onPress={() => { haptics.warning(); router.push('/settings/danger'); }}
            danger
          />
        </SectionTitle>

        <Text style={[styles.version, { color: colors.textFaint }]}>
          {ENV.APP_NAME} v{ENV.APP_VERSION} · Built with Expo
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
  content: { padding: 16, gap: 8 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  version: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 16 },
});
