import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';

export default function MemoryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const haptics = useHaptics();

  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const toggle = (key: keyof typeof settings) => () => {
    haptics.selection();
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Memory</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.section, { color: colors.textDim }]}>MEMORY OPTIONS</Text>

        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <Feather name="hard-drive" size={16} color={colors.primary} />
            <View>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Persistent Memory</Text>
              <Text style={[styles.rowSub, { color: colors.textDim }]}>
                Save conversations across app restarts
              </Text>
            </View>
          </View>
          <Switch
            value={settings.persistentMemory}
            onValueChange={toggle('persistentMemory')}
            trackColor={{ false: colors.chip, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <Feather name="message-circle" size={16} color={colors.primary} />
            <View>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Session Memory</Text>
              <Text style={[styles.rowSub, { color: colors.textDim }]}>
                Remember context within a conversation
              </Text>
            </View>
          </View>
          <Switch
            value={settings.sessionMemory}
            onValueChange={toggle('sessionMemory')}
            trackColor={{ false: colors.chip, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <Feather name="file-text" size={16} color={colors.primary} />
            <View>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Auto Summarize</Text>
              <Text style={[styles.rowSub, { color: colors.textDim }]}>
                Automatically summarize long conversations
              </Text>
            </View>
          </View>
          <Switch
            value={settings.autoSummarize}
            onValueChange={toggle('autoSummarize')}
            trackColor={{ false: colors.chip, true: colors.primary }}
            thumbColor="#fff"
          />
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
  content: { padding: 16, gap: 10 },
  section: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  rowTitle: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  rowSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
