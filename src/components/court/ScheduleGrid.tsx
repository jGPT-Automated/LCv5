import { useEffect, useRef, useState } from 'react';
import { View, type GestureResponderEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Text } from '@/components/ui/Text';
import { color, heat, radius, size, space } from '@/theme';

export type GridCell = { n: number; level: number; game: boolean; mine: boolean; past: boolean; selected: boolean; dim: boolean };

const GAP = space.xxs;
/** Rows in view at once. The day has 17, so it snaps between two overlapping halves. */
const WINDOW = 10;
const SNAP = { stiffness: 320, damping: 34, mass: 0.8, reduceMotion: ReduceMotion.System } as const;

/**
 * The week at one court, from the V5 design: seven days across, the hours
 * 7 AM–11 PM down, each square shaded by how many are going. A dot marks a
 * game, an orange underline your times, a white ring the selection. Today's
 * column is outlined dashed, now is a dashed orange line.
 *
 * It never scrolls freely: flick up or down and it snaps between the morning
 * (7 AM–4 PM) and the afternoon and night (2 PM–11 PM), which overlap on purpose.
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
  const [view, setView] = useState(1);
  const [page, setPage] = useState(nowRow >= WINDOW ? 1 : 0);
  const y = useSharedValue(0);
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

  // Row height comes from the room in view, so ten rows always fill it.
  const rowH = (view - GAP * (WINDOW - 1)) / WINDOW;
  const full = rows * rowH + GAP * (rows - 1);
  const shift = (rows - WINDOW) * (rowH + GAP);
  useEffect(() => {
    y.value = withSpring(-page * shift, SNAP);
  }, [page, shift, y]);
  const slide = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const flick = Gesture.Pan()
    .enabled(!painting)
    .activeOffsetY([-14, 14])
    .failOffsetX([-24, 24])
    .onEnd((e) => {
      if (e.translationY < -40 || e.velocityY < -600) scheduleOnRN(setPage, 1);
      else if (e.translationY > 40 || e.velocityY > 600) scheduleOnRN(setPage, 0);
    });
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
            <Text t="caption2" tint={d === today ? color.onBright : color.dim}>
              {l}
            </Text>
            <Text t="subhead" lineHeight={1} tint={d === today ? color.onBright : d < today ? color.ghost : color.ink}>
              {String(dayNums[d])}
            </Text>
          </View>
        ))}
      </View>
      <View onLayout={(e) => setView(e.nativeEvent.layout.height)} style={{ flex: 1, marginTop: space.xsm, overflow: 'hidden' }}>
        <GestureDetector gesture={flick}>
          <Animated.View style={[{ height: full, flexDirection: 'row', gap: GAP }, slide]}>
            <View style={{ width: size.gridLabel, gap: GAP }}>
              {timeLabels.map((t, r) => (
                <View key={r} style={{ flex: 1, justifyContent: 'center' }}>
                  <Text t="caption1" tint={r === nowRow ? color.orangeInk : color.muted}>
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
                        <Text t="caption2" upper={false} tint={c.level >= 3 ? color.darkFaintText : color.inkFaintText}>
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
              {/* Now: a dashed orange line across today's square for this hour only. */}
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: today * (colW + GAP),
                  width: colW,
                  top: nowRow * (rowH + GAP) - GAP / 2,
                  borderTopWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: color.orange,
                }}
              />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}
