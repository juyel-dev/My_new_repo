import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { PROVIDER_ICONS } from '@/src/shared/lib/constants';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const haptics = useHaptics();

  const provider = useAppStore((s) => s.providers.find((p) => p.id === id));
  const updateProvider = useAppStore((s) => s.updateProvider);
  const deleteProvider = useAppStore((s) => s.deleteProvider);

  const [apiKey, setApiKey] = useState(provider?.apiKey ?? '');
  const [baseUrl, setBaseUrl] = useState(provider?.baseUrl ?? '');
  const [loading, setLoading] = useState(false);

  if (!provider) {
    router.back();
    return null;
  }

  const icon = PROVIDER_ICONS[provider.type] ?? 'key';

  const handleSave = async () => {
    setLoading(true);
    await updateProvider(id, { apiKey: apiKey.trim(), baseUrl: baseUrl.trim() || undefined });
    haptics.success();
    setLoading(false);
    router.back();
  };

  const handleDelete = () => {
    haptics.warning();
    Alert.alert('Delete Provider', `Remove "${provider.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteProvider(id);
          haptics.success();
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{provider.name}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderColor: colors.primaryBorder }]}>
            <Feather name={icon} size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.name, { color: colors.text }]}>{provider.name}</Text>
            <Text style={[styles.type, { color: colors.textDim }]}>{provider.type}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textDim }]}>API KEY</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {provider.type === 'custom' && (
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textDim }]}>BASE URL</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
              value={baseUrl}
              onChangeText={setBaseUrl}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="https://api.example.com/v1"
              placeholderTextColor={colors.textFaint}
            />
          </View>
        )}

        <View style={[styles.statusRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statusLabel, { color: colors.text }]}>Enabled</Text>
          <Switch
            value={provider.enabled}
            onValueChange={(val) => { haptics.selection(); updateProvider(id, { enabled: val }); }}
            trackColor={{ false: colors.chip, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: colors.primary, opacity: pressed || loading ? 0.7 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteBtn,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="trash-2" size={16} color={colors.destructive} />
          <Text style={[styles.deleteText, { color: colors.destructive }]}>Delete Provider</Text>
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
  content: { padding: 16, gap: 12 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  type: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  field: { gap: 6 },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  saveBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
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
