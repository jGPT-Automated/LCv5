import { useRef, useState } from 'react';
import { View, type GestureResponderEvent } from 'react-native';

import { Text } from '@/components/ui/Text';
import { color, heat, radius, size, space } from '@/theme';

export type GridCell = { n: number; level: number; game: boolean; mine: boolean; past: boolean; selected: boolean; dim: boolean };

const GAP = space.xxs;

/**
 * The week at one court, from the V5 design: seven days across, the hours
 * 7 AM–11 PM down, each square shaded by how many are going. A dot marks a
 * game, an orange underline your times, a white ring the selection. Today's
 * column is outlined dashed, now is a dashed orange line.
 *
 * Tap a square to pick it. In select mode, tap or drag across squares; the
 * drag adds or removes depending on the first square touched.
 */
export function ScheduleGrid({
  days,
  dayNums,
  today,
  nowRow,
  timeLabels,
  cells,
  onTap,
  onPaint,
  painting,
}: {
  days: readonly string[];
  dayNums: readonly number[];
  today: number;
  nowRow: number;
  timeLabels: string[];
  /** cells[row][day] */
  cells: GridCell[][];
  onTap: (day: number, row: number) => void;
  /** Select mode: paint a cell on (`true`) or off. */
  onPaint: (day: number, row: number, on: boolean) => void;
  painting: boolean;
}) {
  const rows = timeLabels.length;
  const [box, setBox] = useState({ w: 1, h: 1 });
  const mode = useRef<boolean | null>(null);
  const last = useRef('');

  const at = (e: GestureResponderEvent) => {
    const { locationX: x, locationY: y } = e.nativeEvent;
    const d = Math.floor((x / box.w) * 7);
    const r = Math.floor((y / box.h) * rows);
    if (d < 0 || d > 6 || r < 0 || r >= rows || cells[r][d].past) return null;
    return { d, r };
  };
  const grant = (e: GestureResponderEvent) => {
    const c = at(e);
    if (!c) return;
    if (!painting) return onTap(c.d, c.r);
    mode.current = !cells[c.r][c.d].selected;
    last.current = c.d + ':' + c.r;
    onPaint(c.d, c.r, mode.current);
  };
  const move = (e: GestureResponderEvent) => {
    if (!painting || mode.current == null) return;
    const c = at(e);
    if (!c || last.current === c.d + ':' + c.r) return;
    last.current = c.d + ':' + c.r;
    onPaint(c.d, c.r, mode.current);
  };

  const rowH = (box.h - GAP * (rows - 1)) / rows;
  const colW = (box.w - GAP * 6) / 7;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', gap: GAP }}>
        <View style={{ width: size.gridLabel }} />
        {days.map((l, d) => (
          <View
            key={l}
            style={{
              flex: 1,
              height: size.dayHead,
              borderRadius: radius.control,
              backgroundColor: d === today ? color.ink : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space.xxs,
            }}>
            <Text t="micro" tint={d === today ? color.onBright : color.dim}>
              {l}
            </Text>
            <Text t="statS" lineHeight={1} tint={d === today ? color.onBright : d < today ? color.ghost : color.ink}>
              {String(dayNums[d])}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ flex: 1, flexDirection: 'row', gap: GAP, marginTop: space.xsm }}>
        <View style={{ width: size.gridLabel, gap: GAP }}>
          {timeLabels.map((t, r) => (
            <View key={r} style={{ flex: 1, justifyContent: 'center' }}>
              <Text t="micro" tint={r === nowRow ? color.orangeInk : color.faint}>
                {t}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <View
            onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => painting}
            onResponderTerminationRequest={() => !painting}
            onResponderGrant={grant}
            onResponderMove={move}
            onResponderRelease={() => (mode.current = null)}
            accessibilityLabel="Week grid. Tap a time to see who's going."
            style={{ flex: 1, gap: GAP }}>
            {cells.map((row, r) => (
              <View key={r} pointerEvents="none" style={{ flex: 1, flexDirection: 'row', gap: GAP }}>
                {row.map((c, d) => (
                  <View
                    key={d}
                    style={{
                      flex: 1,
                      borderRadius: radius.heat,
                      backgroundColor: c.dim ? color.quiet : heat[c.level],
                      opacity: c.past ? 0.28 : 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      boxShadow: c.selected ? `inset 0 0 0 2px ${color.ink}` : undefined,
                    }}>
                    <Text t="micro" upper={false} tint={c.level >= 3 ? color.darkFaintText : color.inkFaintText}>
                      {!c.dim && c.n ? String(c.n) : ''}
                    </Text>
                    {c.game && !c.dim ? (
                      <View
                        style={{
                          position: 'absolute',
                          top: GAP,
                          right: GAP,
                          width: size.dotSm,
                          height: size.dotSm,
                          borderRadius: radius.pill,
                          backgroundColor: color.ink,
                        }}
                      />
                    ) : null}
                    {c.mine ? (
                      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: size.underline, backgroundColor: color.orange }} />
                    ) : null}
                  </View>
                ))}
              </View>
            ))}
          </View>
          {/* Today's column, dashed. */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: -GAP,
              bottom: -GAP,
              left: today * (colW + GAP) - GAP,
              width: colW + GAP * 2,
              borderRadius: radius.control,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: color.dashedToday,
            }}
          />
          {/* Now, a dashed orange line at the top of the current hour. */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: -space.xs,
              right: -space.xs,
              top: nowRow * (rowH + GAP) - GAP / 2,
              borderTopWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: color.orange,
            }}
          />
        </View>
      </View>
    </View>
  );
}
