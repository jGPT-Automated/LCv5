import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Device permission prompts. These are on-device only (no backend). Each one
 * is asked at the moment its feature needs it, after a screen explaining why
 * (Apple HIG, Privacy: "wait to request permission until people actually use
 * an app feature that requires access").
 *
 * Background location needs a development build; Expo Go can't grant it
 * (docs.expo.dev/versions/latest/sdk/location). There, the request resolves
 * to `false` and the app keeps working with While Using access.
 */

/** One-time "While Using" location, for check-in and nearby courts. */
export async function askLocation(): Promise<boolean> {
  try {
    const r = await Location.requestForegroundPermissionsAsync();
    return r.granted;
  } catch {
    return false;
  }
}

/** "Always" location, for auto check-in. Only after While Using is granted. */
export async function askBackgroundLocation(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const fg = await Location.requestForegroundPermissionsAsync();
    if (!fg.granted) return false;
    const r = await Location.requestBackgroundPermissionsAsync();
    return r.granted;
  } catch {
    return false;
  }
}

export async function askNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const r = await Notifications.requestPermissionsAsync();
    return r.granted;
  } catch {
    return false;
  }
}
