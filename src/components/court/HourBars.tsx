import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { HOURS, NOW_HOUR } from '@/mock/data';
import { color, radius, space } from '@/theme';

/**
 * Today's activity, one bar per hour from 7 AM to 11 PM.
 * Past hours are grey, now is orange, later hours are outlined.
 */
export function HourBars({
  counts,
  height,
  labels,
  highlight,
  future = color.futureBar,
  outlineFuture,
}: {
  counts: number[];
  height: number;
  /** Label under each bar, '' for none. */
  labels: string[];
  highlight?: number;
  future?: string;
  outlineFuture?: boolean;
}) {
  const max = Math.max(...counts, 1);
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space.xxs, height }}>
        {counts.map((v, i) => {
          const now = i === NOW_HOUR;
          const past = i < NOW_HOUR;
          const rings: string[] = [];
          if (i === highlight) rings.push(`0 0 0 1.5px ${color.bg}`, `0 0 0 3px ${color.ink}`);
          if (outlineFuture && !past && !now) rings.push(`inset 0 0 0 1px ${color.controlStrong}`);
          return (
            <View
              key={i}
              style={{
                flex: 1,
                height: Math.max(height === 40 ? 4 : 3, Math.round((v / max) * (height - 2))),
                borderRadius: radius.bar,
                backgroundColor: now ? color.orange : past ? color.barPast : future,
                boxShadow: rings.length ? rings.join(', ') : undefined,
              }}
            />
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: space.xxs, marginTop: space.s }}>
        {labels.map((l, i) => (
          // Labels may be wider than their bar, so they overflow the cell centered.
          <View key={i} style={{ flex: 1, alignItems: 'center', overflow: 'visible' }}>
            <View style={{ width: 40, alignItems: 'center' }}>
              <Text variant="label" size={7.5} track="wide" align="center" tint={i === NOW_HOUR ? color.orangeInk : i === highlight ? color.ink : color.faint}>
                {l}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export { HOURS };
