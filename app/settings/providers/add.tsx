import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import type { ProviderType } from '@/src/shared/types';

const PROVIDERS = [
  { type: 'openai' as ProviderType, name: 'OpenAI', placeholder: 'sk-...' },
  { type: 'anthropic' as ProviderType, name: 'Anthropic', placeholder: 'sk-ant-...' },
  { type: 'gemini' as ProviderType, name: 'Google Gemini', placeholder: 'AIza...' },
  { type: 'custom' as ProviderType, name: 'Custom', placeholder: 'sk-...' },
];

export default function AddProviderScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const haptics = useHaptics();
  const addProvider = useAppStore((s) => s.addProvider);

  const [selectedType, setSelectedType] = useState<ProviderType>('openai');
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const bottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('API Key Required', 'Please enter your API key.');
      return;
    }
    if (selectedType === 'custom' && !name.trim()) {
      Alert.alert('Name Required', 'Please enter a name for this provider.');
      return;
    }
    setLoading(true);
    haptics.medium();
    try {
      const providerName = selectedType === 'custom' ? name.trim() : PROVIDERS.find(p => p.type === selectedType)?.name ?? 'Custom';
      await addProvider({
        name: providerName,
        type: selectedType,
        apiKey: apiKey.trim(),
        baseUrl: selectedType === 'custom' ? baseUrl.trim() || undefined : undefined,
        enabled: true,
      });
      haptics.success();
      router.back();
    } catch {
      haptics.error();
      Alert.alert('Error', 'Failed to save provider.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color={colors.textMuted} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Add Provider</Text>
          <View style={{ width: 34 }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {PROVIDERS.map((p) => (
              <Pressable
                key={p.type}
                onPress={() => setSelectedType(p.type)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selectedType === p.type ? colors.primaryMuted : colors.card,
                    borderColor: selectedType === p.type ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: selectedType === p.type ? colors.primary : colors.textMuted, fontFamily: 'Inter_500Medium' }}>
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedType === 'custom' && (
            <>
              <Text style={[styles.label, { color: colors.textDim }]}>NAME</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                placeholder="Provider name"
                placeholderTextColor={colors.textFaint}
                value={name}
                onChangeText={setName}
              />
            </>
          )}

          <Text style={[styles.label, { color: colors.textDim }]}>API KEY</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
            placeholder={PROVIDERS.find(p => p.type === selectedType)?.placeholder ?? 'sk-...'}
            placeholderTextColor={colors.textFaint}
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {selectedType === 'custom' && (
            <>
              <Text style={[styles.label, { color: colors.textDim }]}>BASE URL (optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                placeholder="https://api.example.com/v1"
                placeholderTextColor={colors.textFaint}
                value={baseUrl}
                onChangeText={setBaseUrl}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </>
          )}

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
              <Text style={styles.saveText}>Save Provider</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  content: { padding: 20, gap: 10 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    marginTop: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  saveBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
