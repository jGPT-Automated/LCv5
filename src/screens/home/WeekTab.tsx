import { router } from 'expo-router';
import { View } from 'react-native';

import { GameRow } from '@/components/court/GameRow';
import { HeatGrid, type HeatCell } from '@/components/court/HeatGrid';
import { PageScroll } from '@/components/layout/PageScroll';
import { Button, EmptyRow } from '@/components/ui/controls';
import { Section } from '@/components/ui/surfaces';
import { days, dayNums, NOW_HOUR, TODAY, type CourtId } from '@/mock/data';
import { dayName, goingKey, heatLevel, hourLabel } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { space } from '@/theme';

/** Three-hour blocks shown in the week grid. */
const BLOCKS: [number, number, string][] = [
  [0, 3, '7A'],
  [3, 6, '10A'],
  [6, 9, '1P'],
  [9, 12, '4P'],
  [12, 15, '7P'],
  [15, 17, '10P'],
];

/** The week at a court: planned visits by block, then upcoming games. */
export function WeekTab({ court }: { court: CourtId }) {
  const { d, going, games, toggleGoing } = useApp();

  const cells: HeatCell[][] = BLOCKS.map(([a, b]) =>
    days.map((_, day) => {
      let n = 0;
      let game = false;
      let mine = false;
      for (let h = a; h < b; h++) {
        n = Math.max(n, d.plannedCount(court, day, h));
        if (d.gameAt(court, day, h)) game = true;
        if (going[goingKey(court, day, h)]) mine = true;
      }
      return { n, level: heatLevel(n), game, mine, past: day < TODAY || (day === TODAY && b <= NOW_HOUR) };
    }),
  );

  const upcoming = games[court]
    .filter((g) => g.d > TODAY || (g.d === TODAY && g.h >= NOW_HOUR))
    .sort((a, b) => a.d - b.d || a.h - b.h)
    .slice(0, 3);

  return (
    <PageScroll top={space.xxl}>
      <HeatGrid days={days} dayNums={dayNums} today={TODAY} rowLabels={BLOCKS.map((b) => b[2])} cells={cells} onPick={() => router.push('/schedule')} />
      <View style={{ marginTop: space.xl }}>
        <Button label="Plan in Schedule ›" kind="ghost" onPress={() => router.push('/schedule')} />
      </View>
      <Section title="Upcoming games">
        {upcoming.length ? (
          upcoming.map((g) => {
            const lb = hourLabel(7 + g.h);
            return (
              <GameRow
                key={g.d + ':' + g.h}
                day={dayName(g.d)}
                time={lb.t + ' ' + lb.ap}
                title={g.title}
                detail={g.fmt + ' · ' + d.plannedCount(court, g.d, g.h) + ' of ' + g.cap}
                joined={!!going[goingKey(court, g.d, g.h)]}
                onToggle={() => toggleGoing(court, g.d, g.h)}
              />
            );
          })
        ) : (
          <EmptyRow>No games posted this week</EmptyRow>
        )}
      </Section>
    </PageScroll>
  );
}
