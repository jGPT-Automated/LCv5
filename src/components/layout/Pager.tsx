import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';

import { Tap } from '@/components/ui/controls';
import { color, radius, space } from '@/theme';

/**
 * Horizontal pages you swipe between, with dots. Used for switching saved
 * courts on Home. `index` is controlled so a menu can jump pages too.
 */
export function Pager({ count, index, onIndex, render }: { count: number; index: number; onIndex: (i: number) => void; render: (i: number) => ReactNode }) {
  const ref = useRef<ScrollViewInstance>(null);
  const [w, setW] = useState(0);
  // Index the user last swiped to. A different `index` means a jump from elsewhere.
  const swiped = useRef(index);
  const target = useRef<number | null>(null);

  useEffect(() => {
    if (!w || swiped.current === index) return;
    target.current = index;
    ref.current?.scrollTo({ x: index * w, animated: true });
  }, [index, w]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!w) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / w);
    if (target.current !== null) {
      // Ignore in-between positions while a jump animates.
      if (i === target.current) {
        swiped.current = i;
        target.current = null;
      }
      return;
    }
    swiped.current = i;
    if (i !== index && i >= 0 && i < count) onIndex(i);
  };

  return (
    <View>
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        onScroll={onScroll}
        scrollEventThrottle={16}
        scrollEnabled={count > 1}
        style={{ flexGrow: 0 }}>
        {Array.from({ length: count }, (_, i) => (
          <View key={i} style={{ width: w || undefined }}>
            {render(i)}
          </View>
        ))}
      </ScrollView>
      {count > 1 ? (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: space.xsm, marginTop: space.l }}>
          {Array.from({ length: count }, (_, k) => (
            <Tap
              key={k}
              hitSlop={8}
              label={'Court ' + (k + 1) + ' of ' + count}
              onPress={() => onIndex(k)}
              style={{ width: k === index ? 18 : 5, height: 5, borderRadius: radius.pill, backgroundColor: k === index ? color.ink : color.grabber }}>
              <View />
            </Tap>
          ))}
        </View>
      ) : null}
    </View>
  );
}
