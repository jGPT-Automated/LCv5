import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, layout, space } from '@/theme';

/**
 * Page frame: dark background, top inset for the status bar, bottom inset so
 * content clears the tab bar. `scroll` makes the whole page scroll.
 */
export function Screen({ children, scroll, header, topColor = color.bg }: { children: ReactNode; scroll?: boolean; header?: ReactNode; topColor?: string }) {
  const insets = useSafeAreaInsets();
  const top = Math.max(insets.top, layout.statusBar);
  if (scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: top, paddingBottom: layout.tabBarHeight + space.gutter }}>
          {header}
          {children}
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: color.bg, paddingBottom: layout.tabBarHeight }}>
      <View style={{ paddingTop: top, backgroundColor: topColor }}>{header}</View>
      {children}
    </View>
  );
}
