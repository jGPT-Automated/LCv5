import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { timing, type TextStyleName } from '@/theme';

import { Text } from './Text';

/**
 * A number whose digits roll to a new value, e.g. a live count changing when
 * someone checks in. Each digit is a 0–9 column that slides inside a window
 * one glyph tall. Technique from beUI Native's number-ticker (MIT,
 * github.com/starc007/beui-native, src/components/number/number-ticker.tsx),
 * rebuilt on our Text so it follows the type scale.
 */
const DIGITS = Array.from({ length: 10 }, (_, d) => d);
/** Full line box for rolling digits, so a neighbor never shows inside the window. */
const LINE = 1.15;

type Cell = { w: number; h: number };

function Column({ digit, cell, t, tint }: { digit: number; cell: Cell; t: TextStyleName; tint?: string }) {
  const y = useSharedValue(-digit * cell.h);
  useEffect(() => {
    y.value = withTiming(-digit * cell.h, timing.digit);
  }, [digit, cell.h, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <View style={{ width: cell.w, height: cell.h, overflow: 'hidden' }}>
      <Animated.View style={style}>
        {DIGITS.map((n) => (
          <Text key={n} t={t} tint={tint} lineHeight={LINE} style={{ height: cell.h, fontVariant: ['tabular-nums'] }}>
            {String(n)}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

export function NumberTicker({ value, t, tint }: { value: number; t: TextStyleName; tint?: string }) {
  const [cell, setCell] = useState<Cell | null>(null);
  const text = String(Math.max(0, Math.round(value)));
  // Key by place value from the right, so a changing digit keeps its column and rolls.
  const glyphs = Array.from(text, (ch, i) => ({ ch, id: 'p' + (text.length - 1 - i) }));
  return (
    <View accessible accessibilityRole="text" accessibilityLabel={text} style={{ flexDirection: 'row' }}>
      {/* Measure one tabular "0" in this style to size every digit window. */}
      <View style={{ position: 'absolute', opacity: 0 }} pointerEvents="none">
        <Text
          t={t}
          lineHeight={LINE}
          style={{ fontVariant: ['tabular-nums'] }}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCell((c) => (c && c.w === width && c.h === height ? c : { w: width, h: height }));
          }}>
          0
        </Text>
      </View>
      {cell ? (
        glyphs.map(({ ch, id }) => <Column key={id} digit={Number(ch)} cell={cell} t={t} tint={tint} />)
      ) : (
        <Text t={t} tint={tint} style={{ opacity: 0 }}>
          {text}
        </Text>
      )}
    </View>
  );
}
