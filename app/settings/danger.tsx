import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { useErrorHandler } from '@/src/shared/hooks/useErrorHandler';

interface DangerAction {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  desc: string;
  confirmTitle: string;
  confirmMessage: string;
  action: () => Promise<void>;
}

export default function DangerZoneScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const haptics = useHaptics();
  const { handleError } = useErrorHandler();

  const conversations = useAppStore((s) => s.conversations);
  const providers = useAppStore((s) => s.providers);
  const models = useAppStore((s) => s.models);
  const agents = useAppStore((s) => s.agents);
  const deleteAllConversations = useAppStore((s) => s.deleteAllConversations);
  const clearAllModels = useAppStore((s) => s.clearAllModels);
  const clearCustomAgents = useAppStore((s) => s.clearCustomAgents);
  const resetAllSettings = useSettingsStore((s) => s.resetSettings);
  const clearAllData = useAppStore((s) => s.clearAllData);

  const [loading, setLoading] = useState<string | null>(null);

  const actions: DangerAction[] = [
    {
      id: 'clear_conversations',
      icon: 'message-circle',
      title: 'Clear All Conversations',
      desc: `Delete all ${conversations.length} conversation${conversations.length !== 1 ? 's' : ''} and their message history permanently.`,
      confirmTitle: 'Clear All Conversations',
      confirmMessage: `This will permanently delete all ${conversations.length} conversations. This cannot be undone.`,
      action: async () => { await deleteAllConversations(); },
    },
    {
      id: 'clear_models',
      icon: 'cpu',
      title: 'Clear All Providers & Models',
      desc: `Remove all ${providers.length} provider${providers.length !== 1 ? 's' : ''} and ${models.length} model configuration${models.length !== 1 ? 's' : ''}.`,
      confirmTitle: 'Clear Providers & Models',
      confirmMessage: 'This will remove all providers and models. You will need to add them again.',
      action: async () => { await clearAllModels(); },
    },
    {
      id: 'clear_agents',
      icon: 'user',
      title: 'Reset Custom Agents',
      desc: `Delete all custom agents, keeping only the default Assistant.`,
      confirmTitle: 'Reset Custom Agents',
      confirmMessage: 'This will delete all custom agents. The default Assistant will be kept.',
      action: async () => { await clearCustomAgents(); },
    },
    {
      id: 'reset_settings',
      icon: 'sliders',
      title: 'Reset Settings',
      desc: 'Restore all settings to their default values.',
      confirmTitle: 'Reset All Settings',
      confirmMessage: 'This will reset all preferences to defaults. Your data will not be affected.',
      action: async () => { await resetAllSettings(); },
    },
    {
      id: 'clear_all',
      icon: 'alert-octagon',
      title: 'Factory Reset',
      desc: 'Delete everything: all conversations, providers, models, agents, and settings.',
      confirmTitle: '⚠️ Factory Reset',
      confirmMessage: 'This will permanently delete ALL data. This CANNOT be undone.',
      action: async () => {
        await clearAllData();
        router.replace('/');
      },
    },
  ];

  const handleAction = (action: DangerAction) => {
    haptics.warning();
    Alert.alert(action.confirmTitle, action.confirmMessage, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: action.id === 'clear_all' ? 'Reset Everything' : 'Confirm',
        style: 'destructive',
        onPress: async () => {
          setLoading(action.id);
          try {
            await action.action();
            haptics.success();
          } catch (err) {
            handleError(err);
          } finally {
            setLoading(null);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Danger Zone</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.warning, { backgroundColor: colors.destructiveMuted, borderColor: colors.destructiveBorder }]}>
          <Feather name="alert-triangle" size={18} color={colors.destructive} />
          <Text style={[styles.warningText, { color: colors.destructive }]}>
            All actions below are irreversible. Proceed with caution.
          </Text>
        </View>

        {actions.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => handleAction(action)}
            disabled={!!loading}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: action.id === 'clear_all' ? colors.destructiveBorder : colors.border,
                opacity: pressed || !!loading ? 0.75 : 1,
              },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: colors.destructiveMuted, borderColor: colors.destructiveBorder }]}>
              {loading === action.id ? (
                <ActivityIndicator size="small" color={colors.destructive} />
              ) : (
                <Feather name={action.icon} size={16} color={colors.destructive} />
              )}
            </View>
            <View style={styles.text}>
              <Text style={[styles.cardTitle, { color: colors.destructive }]}>{action.title}</Text>
              <Text style={[styles.cardDesc, { color: colors.textDim }]}>{action.desc}</Text>
            </View>
            <Feather name="chevron-right" size={15} color={colors.destructive} style={{ opacity: 0.5 }} />
          </Pressable>
        ))}
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
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontFamily: 'Inter_600SemiBold', flex: 1, textAlign: 'center' },
  content: { padding: 16, gap: 10 },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
  },
  warningText: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 19 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: { flex: 1 },
  cardTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  cardDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 3, lineHeight: 17 },
});
