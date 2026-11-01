import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { CourtMenu, CourtSwitchButton } from '@/components/court/CourtSwitch';
import { PeopleStrip } from '@/components/court/PeopleStrip';
import { GameRow } from '@/components/court/GameRow';
import { ScheduleGrid, type GridCell } from '@/components/court/ScheduleGrid';
import { Page } from '@/components/layout/Page';
import { PageFixed } from '@/components/layout/PageScroll';
import { Button } from '@/components/ui/controls';
import { Section } from '@/components/ui/surfaces';
import { courts, days, dayNums, HOURS, NOW_HOUR, TODAY } from '@/mock/data';
import { dayName, goingKey, heatLevel, hourLabel } from '@/mock/model';
import { canSchedule } from '@/mock/runs';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme';

import { NewGameSheet, type NewGameAt } from './NewGameSheet';

const at = (d: number, h: number) => {
  const lb = hourLabel(7 + h);
  return dayName(d) + ' \u00b7 ' + lb.t + ' ' + lb.ap;
};

/**
 * Schedule, from the V5 design, as one fixed screen: the week at your court
 * as a heat grid that snaps between morning and night, then who's going at
 * the time you picked, then the games at this court. Nothing scrolls the page.
 */
export function ScheduleScreen() {
  const app = useApp();
  const { d, mine, going, homeIndex } = app;
  const court = mine[Math.min(homeIndex, mine.length - 1)];
  const params = useLocalSearchParams<{ d?: string; h?: string }>();

  const [sel, setSel] = useState({ d: TODAY, h: Math.min(NOW_HOUR + 2, HOURS - 1) });
  const [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState<NewGameAt | null>(null);

  // Opened from a court's Week grid: focus that day and time.
  useEffect(() => {
    if (params.d != null && params.h != null) setSel({ d: Number(params.d), h: Number(params.h) });
  }, [params.d, params.h]);

  const cells: GridCell[][] = Array.from({ length: HOURS }, (_, h) =>
    days.map((_, day) => {
      const n = d.plannedCount(court, day, h);
      return {
        n,
        level: heatLevel(n),
        game: !!d.gameAt(court, day, h),
        mine: !!going[goingKey(court, day, h)],
        past: day < TODAY || (day === TODAY && h < NOW_HOUR),
        selected: day === sel.d && h === sel.h,
        dim: false,
      };
    }),
  );

  // Who's going at the picked time.
  const key = goingKey(court, sel.d, sel.h);
  const me = !!going[key];
  const crowd = d.crowd(court, sel.d, sel.h).map(d.view(court));
  const past = sel.d < TODAY || (sel.d === TODAY && sel.h < NOW_HOUR);
  const openRun = !d.gameAt(court, sel.d, sel.h) && !canSchedule(sel.d, sel.h);

  // Games at this court from now on, the picked time first.
  const games = days
    .flatMap((_, day) => Array.from({ length: HOURS }, (_, h) => ({ day, h, g: d.gameAt(court, day, h) })))
    .filter((x) => x.g && (x.day > TODAY || (x.day === TODAY && x.h >= NOW_HOUR)))
    .sort((a, b) => Number(b.day === sel.d && b.h === sel.h) - Number(a.day === sel.d && a.h === sel.h));

  const next = games.slice(0, 1);
  const newGameOk = canSchedule(sel.d, sel.h) && !d.gameAt(court, sel.d, sel.h);

  return (
    <Page title="Schedule" action={<CourtSwitchButton court={court} onPress={() => setMenu(true)} />}>
      <PageFixed grow top={space.xs}>
        <ScheduleGrid
          days={days}
          dayNums={dayNums}
          today={TODAY}
          nowRow={NOW_HOUR}
          timeLabels={Array.from({ length: HOURS }, (_, h) => hourLabel(7 + h).short)}
          cells={cells}
          painting={false}
          onTap={(dd, hh) => setSel({ d: dd, h: hh })}
          onPaint={() => {}}
        />
      </PageFixed>

      <PageFixed bottom={space.l}>
        <Section
          first
          title={at(sel.d, sel.h) + (openRun ? ' · open run' : ' · ' + crowd.length + ' going')}
          action={
            past || openRun ? undefined : (
              <Button
                label={me ? 'Going' : "I'm going"}
                kind={me ? 'outline' : 'light'}
                size="compact"
                feedback="commit"
                onPress={() => app.toggleGoing(court, sel.d, sel.h)}
              />
            )
          }>
          <PeopleStrip people={crowd} avatar="m" />
        </Section>
        <Section
          title="Games"
          action={newGameOk ? <Button label="New game" kind="ghost" size="compact" onPress={() => setSheet({ court, d: sel.d, h: sel.h })} /> : undefined}>
          {next.map(({ day, h, g }) => (
            <GameRow
              key={day + ':' + h}
              day={dayName(day)}
              time={hourLabel(7 + h).t + ' ' + hourLabel(7 + h).ap}
              title={g!.title}
              detail={
                (g!.fmt.startsWith(g!.title) ? g!.fmt.slice(g!.title.length).replace(/^ · /, '') || g!.fmt : g!.fmt) +
                ' · ' +
                d.crowd(court, day, h).length +
                ' of ' +
                g!.cap
              }
              joined={!!going[goingKey(court, day, h)]}
              onToggle={() => app.toggleGoing(court, day, h)}
            />
          ))}
        </Section>
      </PageFixed>

      <CourtMenu open={menu} onClose={() => setMenu(false)} />
      <NewGameSheet at={sheet} onClose={() => setSheet(null)} />
    </Page>
  );
}
