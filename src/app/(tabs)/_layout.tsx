import { Redirect } from 'expo-router';

import { AppTabs } from '@/components/layout/TabBar';
import { useApp } from '@/state/AppState';

export default function TabsLayout() {
  const { signedIn } = useApp();
  // Signed out (from Settings): back to the welcome screen.
  if (!signedIn) return <Redirect href="/welcome" />;
  return <AppTabs />;
}
