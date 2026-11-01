import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptics with one vocabulary across the app. Used sparingly: for commits
 * (check in, post, confirm) and selection changes, never on plain scrolling.
 */
const on = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptic = {
  /** Picking an option: segment, day cell, radio. */
  select: () => on && Haptics.selectionAsync().catch(() => {}),
  /** A light tap for presses that change state (save, join). */
  tap: () => on && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  /** A firmer thud for big commits (check in, post game). */
  commit: () => on && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}),
  success: () => on && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  warning: () => on && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}),
};
