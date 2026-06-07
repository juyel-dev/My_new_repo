import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useCallback } from 'react';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export function useHaptics() {
  const impact = useCallback((style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    if (!isNative) return;
    Haptics.impactAsync(style).catch(() => {});
  }, []);

  const notification = useCallback((type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
    if (!isNative) return;
    Haptics.notificationAsync(type).catch(() => {});
  }, []);

  const light = useCallback(() => impact(Haptics.ImpactFeedbackStyle.Light), [impact]);
  const medium = useCallback(() => impact(Haptics.ImpactFeedbackStyle.Medium), [impact]);
  const heavy = useCallback(() => impact(Haptics.ImpactFeedbackStyle.Heavy), [impact]);
  const success = useCallback(() => notification(Haptics.NotificationFeedbackType.Success), [notification]);
  const warning = useCallback(() => notification(Haptics.NotificationFeedbackType.Warning), [notification]);
  const error = useCallback(() => notification(Haptics.NotificationFeedbackType.Error), [notification]);
  const selection = useCallback(() => {
    if (!isNative) return;
    Haptics.selectionAsync().catch(() => {});
  }, []);

  return {
    impact,
    notification,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
  };
}
