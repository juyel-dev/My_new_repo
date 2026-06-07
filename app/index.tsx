import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { useAppStore } from '@/src/stores/useAppStore';

export default function IndexGate() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const onboardingComplete = useSettingsStore((s) => s.settings.onboardingComplete);

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#0a0a0a' }} />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}
