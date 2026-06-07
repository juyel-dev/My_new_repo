import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { AppProviders } from '@/src/providers/AppProviders';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0a0a0a' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="chat/[id]"
        options={{ animation: 'slide_from_bottom', gestureEnabled: true }}
      />
      <Stack.Screen name="settings/providers/index" />
      <Stack.Screen name="settings/providers/add" />
      <Stack.Screen name="settings/providers/[id]" />
      <Stack.Screen name="settings/models" />
      <Stack.Screen name="settings/agents/index" />
      <Stack.Screen name="settings/agents/[id]" />
      <Stack.Screen name="settings/mcp/index" />
      <Stack.Screen name="settings/mcp/[id]" />
      <Stack.Screen name="settings/memory" />
      <Stack.Screen name="settings/danger" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
