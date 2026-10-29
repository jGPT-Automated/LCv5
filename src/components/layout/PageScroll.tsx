import type { ReactNode, Ref } from 'react';
import { ScrollView, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';

import { space } from '@/theme';

/**
 * The scrolling body of a page, with the standard insets: 20pt gutter on both
 * sides, 12pt above the first section, 24pt below the last.
 */
export function PageScroll({
  children,
  scrollRef,
  onScroll,
  bottom = space.x5,
  top = space.l,
}: {
  children: ReactNode;
  scrollRef?: Ref<ScrollViewInstance>;
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Extra room at the end, e.g. so the timeline's earliest rows can reach the focus line. */
  bottom?: number;
  top?: number;
}) {
  return (
    <ScrollView
      ref={scrollRef}
      onScroll={onScroll}
      scrollEventThrottle={onScroll ? 16 : undefined}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: space.gutter, paddingTop: top, paddingBottom: bottom }}>
      {children}
    </ScrollView>
  );
}
