import { Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Oswald_500Medium, Oswald_600SemiBold, Oswald_700Bold } from '@expo-google-fonts/oswald';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { OverlayHost } from '@/components/ui/Overlay';
import { AppStateProvider } from '@/state/AppState';
import { color, layout } from '@/theme';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: color.bg, card: color.bg, text: color.ink, border: color.border, primary: color.orange },
};

export default function RootLayout() {
  const [loaded] = useFonts({ Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Oswald_500Medium, Oswald_600SemiBold, Oswald_700Bold });
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);
  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.bg }}>
      <ThemeProvider value={theme}>
        <AppStateProvider>
          <StatusBar style="light" />
          {/* On web, show the app in a phone-width column so the preview reads like the phone. */}
          <View style={{ flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? layout.maxWebWidth : undefined, alignSelf: 'center', overflow: 'hidden' }}>
            <OverlayHost>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="court/[id]" />
              </Stack>
            </OverlayHost>
          </View>
        </AppStateProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
