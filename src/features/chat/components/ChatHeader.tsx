import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/src/shared/hooks/useColors';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import type { Agent, Model } from '@/src/shared/types';

interface Props {
  title: string;
  agent: Agent | null;
  model: Model | null;
}

export function ChatHeader({ title, agent, model }: Props) {
  const colors = useColors();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.backgroundElevated,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
        <Feather name="arrow-left" size={22} color={colors.textMuted} />
      </Pressable>

      <View style={styles.center}>
        <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderColor: colors.primaryBorder }]}>
          <Feather name="cpu" size={13} color={colors.primary} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          {agent && (
            <Text style={[styles.subtitle, { color: colors.textDim }]}>
              {agent.name}
              {model ? ` · ${model.name}` : ''}
            </Text>
          )}
        </View>
      </View>

      <Pressable
        onPress={() => haptics.warning()}
        hitSlop={12}
        style={styles.moreBtn}
      >
        <Feather name="more-vertical" size={20} color={colors.textFaint} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: {
    flexShrink: 0,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
  moreBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
