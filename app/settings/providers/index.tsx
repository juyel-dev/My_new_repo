import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/stores/useAppStore';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { EmptyState } from '@/src/shared/components/ui/EmptyState';
import { ProviderCard } from '@/src/features/providers/components/ProviderCard';

export default function ProvidersScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const haptics = useHaptics();

  const providers = useAppStore((s) => s.providers);
  const toggleProvider = useAppStore((s) => s.toggleProvider);

  const top = Platform.OS === 'web' ? 67 : insets.top;
  const bottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Providers</Text>
        <Pressable
          onPress={() => { haptics.medium(); router.push('/settings/providers/add'); }}
          style={({ pressed }) => [
            styles.addBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ProviderCard
            provider={item}
            index={index}
            onPress={() => { haptics.light(); router.push(`/settings/providers/${item.id}`); }}
            onToggle={() => toggleProvider(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottom + 20 },
          providers.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="key"
            title="No providers yet"
            subtitle="Add an OpenAI, Anthropic, or Gemini API key to get started"
          />
        }
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!providers.length}
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
  addBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 12, gap: 8 },
});
