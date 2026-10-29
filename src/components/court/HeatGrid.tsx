import { View } from 'react-native';

import { Tap } from '@/components/ui/controls';
import { Text } from '@/components/ui/Text';
import { color, heat, radius, size, space } from '@/theme';

export type HeatCell = { n: number; level: number; game: boolean; mine: boolean; past: boolean };

/**
 * Planned visits by day (columns) and time block (rows). Today's column has a
 * dashed outline, your plans an orange underline, games a white dot.
 */
export function HeatGrid({
  days,
  dayNums,
  today,
  rowLabels,
  cells,
  onPick,
}: {
  days: readonly string[];
  dayNums: readonly number[];
  today: number;
  rowLabels: string[];
  /** cells[row][day] */
  cells: HeatCell[][];
  onPick: (row: number, day: number) => void;
}) {
  const gap = space.xs;
  return (
    <View>
      <View style={{ flexDirection: 'row', gap }}>
        <View style={{ width: size.gridLabel }} />
        {days.map((l, i) => {
          const isToday = i === today;
          return (
            <View
              key={l}
              style={{
                flex: 1,
                height: size.cell,
                borderRadius: radius.control,
                backgroundColor: isToday ? color.ink : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text t="micro" tint={isToday ? color.onBright : color.dim}>
                {l.charAt(0)}
              </Text>
              <Text variant="display" size={13} tint={isToday ? color.onBright : i < today ? color.ghost : color.ink}>
                {String(dayNums[i])}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={{ marginTop: gap, gap }}>
        {rowLabels.map((label, r) => (
          <View key={label} style={{ flexDirection: 'row', gap, height: size.cell }}>
            <View style={{ width: size.gridLabel, justifyContent: 'center' }}>
              <Text t="micro" tint={color.dim}>
                {label}
              </Text>
            </View>
            {cells[r].map((c, day) => (
              <Tap
                key={day}
                disabled={c.past}
                onPress={() => onPick(r, day)}
                label={days[day] + ' ' + label + ', ' + c.n + ' going'}
                style={{
                  flex: 1,
                  borderRadius: radius.seg,
                  backgroundColor: heat[c.level],
                  opacity: c.past ? 0.3 : 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderWidth: day === today ? 1 : 0,
                  borderStyle: 'dashed',
                  borderColor: color.dashedToday,
                }}>
                <Text variant="display" size={10} weight="medium" tint={c.level >= 3 ? color.darkFaintText : color.inkFaintText}>
                  {c.n ? String(c.n) : ''}
                </Text>
                {c.game ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: space.xs,
                      right: space.xs,
                      width: size.dotSm,
                      height: size.dotSm,
                      borderRadius: radius.pill,
                      backgroundColor: color.ink,
                    }}
                  />
                ) : null}
                {c.mine ? <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: color.orange }} /> : null}
              </Tap>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
