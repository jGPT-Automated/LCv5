import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, EmptyRow, Tap } from '@/components/ui/controls';
import { Text } from '@/components/ui/Text';
import { days, dayNums, NOW_HOUR, TODAY, type CourtId } from '@/mock/data';
import { dayName, goingKey, heatLevel, hourLabel } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, heat, radius, space } from '@/theme';

/** Three-hour blocks shown in the week grid. */
const BLOCKS: [number, number, string][] = [
  [0, 3, '7A'],
  [3, 6, '10A'],
  [6, 9, '1P'],
  [9, 12, '4P'],
  [12, 15, '7P'],
  [15, 17, '10P'],
];
const CELL = 34;
const GAP = space.xs;

/** The week at a court: planned visits by block, then upcoming games. */
export function WeekTab({ court }: { court: CourtId }) {
  const { d, going, games, toggleGoing } = useApp();
  const upcoming = games[court]
    .filter((g) => g.d > TODAY || (g.d === TODAY && g.h >= NOW_HOUR))
    .sort((a, b) => a.d - b.d || a.h - b.h)
    .slice(0, 3);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: space.xxl, paddingHorizontal: space.gutter, paddingBottom: space.x5 }}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: GAP }}>
        <View style={{ width: 28 }} />
        {days.map((l, i) => {
          const today = i === TODAY;
          return (
            <View
              key={l}
              style={{
                flex: 1,
                height: CELL,
                borderRadius: radius.control,
                backgroundColor: today ? color.ink : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                gap: space.xxxs,
              }}>
              <Text variant="label" size={7.5} track="wider" tint={today ? color.onBright : color.dim}>
                {l.charAt(0)}
              </Text>
              <Text variant="display" size={13} tint={today ? color.onBright : i < TODAY ? color.ghost : color.ink}>
                {String(dayNums[i])}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={{ marginTop: GAP, gap: GAP }}>
        {BLOCKS.map(([a, b, label]) => (
          <View key={label} style={{ flexDirection: 'row', gap: GAP, height: CELL }}>
            <View style={{ width: 28, justifyContent: 'center' }}>
              <Text size={8.5} weight="bold" tint={color.dim}>
                {label}
              </Text>
            </View>
            {days.map((_, day) => {
              let n = 0;
              let hasGame = false;
              let mine = false;
              for (let h = a; h < b; h++) {
                n = Math.max(n, d.plannedCount(court, day, h));
                if (d.gameAt(court, day, h)) hasGame = true;
                if (going[goingKey(court, day, h)]) mine = true;
              }
              const lv = heatLevel(n);
              const past = day < TODAY || (day === TODAY && b <= NOW_HOUR);
              const today = day === TODAY;
              return (
                <Tap
                  key={day}
                  disabled={past}
                  onPress={() => router.push('/schedule')}
                  style={{
                    flex: 1,
                    borderRadius: radius.seg,
                    backgroundColor: heat[lv],
                    opacity: past ? 0.3 : 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    // Today's column gets a dashed outline.
                    borderWidth: today ? 1 : 0,
                    borderStyle: 'dashed',
                    borderColor: color.dashedToday,
                  }}>
                  <Text variant="display" size={10} weight="medium" tint={lv >= 3 ? color.darkFaintText : color.inkFaintText}>
                    {n ? String(n) : ''}
                  </Text>
                  {hasGame ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: space.xs,
                        right: space.xs,
                        width: 5,
                        height: 5,
                        borderRadius: radius.pill,
                        backgroundColor: color.ink,
                      }}
                    />
                  ) : null}
                  {mine ? <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: color.orange }} /> : null}
                </Tap>
              );
            })}
          </View>
        ))}
      </View>

      <View style={{ marginTop: space.xl }}>
        <Button label="Plan in Schedule ›" kind="ghost" size={10} onPress={() => router.push('/schedule')} />
      </View>

      <Text variant="label" size={10} style={{ marginTop: space.x5, marginBottom: space.xs }}>
        Upcoming games
      </Text>
      {upcoming.map((g) => {
        const k = goingKey(court, g.d, g.h);
        const me = !!going[k];
        const lb = hourLabel(7 + g.h);
        return (
          <View
            key={k}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space.l, minHeight: 62, borderBottomWidth: 1, borderBottomColor: color.line }}>
            <View style={{ width: 58, borderRightWidth: 1, borderRightColor: color.divider }}>
              <Text variant="label" size={8} tint={color.muted}>
                {dayName(g.d)}
              </Text>
              <Text variant="display" size={17}>
                {lb.t + ' ' + lb.ap}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="display" size={15} numberOfLines={1}>
                {g.title}
              </Text>
              <Text size={10.5} weight="medium" tint={color.muted} style={{ marginTop: space.xxs }}>
                {g.fmt + ' · ' + d.plannedCount(court, g.d, g.h) + ' of ' + g.cap}
              </Text>
            </View>
            <Button label={me ? 'Joined' : 'Join'} kind={me ? 'light' : 'outline'} height={34} size={9} onPress={() => toggleGoing(court, g.d, g.h)} />
          </View>
        );
      })}
      {!upcoming.length ? (
        <View style={{ marginTop: space.m }}>
          <EmptyRow>No games posted this week</EmptyRow>
        </View>
      ) : null}
    </ScrollView>
  );
}
