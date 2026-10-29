import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { CourtMenu, CourtSwitchButton } from '@/components/court/CourtSwitch';
import { ScheduleGrid, type GridCell } from '@/components/court/ScheduleGrid';
import { Page } from '@/components/layout/Page';
import { AvatarStack } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/controls';
import { Card } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { days, dayNums, HOURS, NOW_HOUR, TODAY, type CourtId } from '@/mock/data';
import { dayName, friendNames, goingKey, heatLevel, hourLabel } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, size, space } from '@/theme';

import { NewGameSheet, type NewGameAt } from './NewGameSheet';

/**
 * Schedule, from the V5 design: the week at your court as a heat grid. Tap a
 * time to see who's going and say you're going or start a game. Select picks
 * several times at once; Only mine shows just yours; Clear mine resets.
 */
export function ScheduleScreen() {
  const app = useApp();
  const { d, mine, going, homeIndex } = app;
  const court = mine[Math.min(homeIndex, mine.length - 1)];
  const params = useLocalSearchParams<{ d?: string; h?: string }>();

  const [sel, setSel] = useState({ d: TODAY, h: Math.min(NOW_HOUR + 2, HOURS - 1) });
  const [multi, setMulti] = useState<Record<string, boolean> | null>(null);
  const [onlyMine, setOnlyMine] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState<NewGameAt | null>(null);

  // Opened from a court's Week grid: focus that day and time.
  useEffect(() => {
    if (params.d != null && params.h != null) {
      setSel({ d: Number(params.d), h: Number(params.h) });
      setMulti(null);
    }
  }, [params.d, params.h]);

  const myKeys = Object.keys(going).filter((k) => going[k] && k.startsWith(court + ':'));
  const cells: GridCell[][] = Array.from({ length: HOURS }, (_, h) =>
    days.map((_, day) => {
      const n = d.plannedCount(court, day, h);
      const mineHere = !!going[goingKey(court, day, h)];
      return {
        n,
        level: heatLevel(n),
        game: !!d.gameAt(court, day, h),
        mine: mineHere,
        past: day < TODAY || (day === TODAY && h < NOW_HOUR),
        selected: multi ? !!multi[day + ':' + h] : day === sel.d && h === sel.h,
        dim: onlyMine && !mineHere,
      };
    }),
  );

  const clearMine = () => myKeys.forEach((k) => {
    const [, dd, hh] = k.split(':').map(Number);
    app.toggleGoing(court, dd, hh);
  });

  return (
    <Page
      title="Schedule"
      action={
        <CourtSwitchButton court={court} onPress={() => setMenu(true)} />
      }>
      <View style={{ flex: 1, paddingHorizontal: space.gutter, paddingTop: space.xs }}>
        <ScheduleGrid
          days={days}
          dayNums={dayNums}
          today={TODAY}
          nowRow={NOW_HOUR}
          timeLabels={Array.from({ length: HOURS }, (_, h) => hourLabel(7 + h).short)}
          cells={cells}
          painting={!!multi}
          onTap={(dd, hh) => setSel({ d: dd, h: hh })}
          onPaint={(dd, hh, on) =>
            setMulti((m) => {
              const next = { ...(m ?? {}) };
              if (on) next[dd + ':' + hh] = true;
              else delete next[dd + ':' + hh];
              return next;
            })
          }
        />
        <View style={{ flexDirection: 'row', gap: space.s, marginTop: space.ml }}>
          <Chip label={multi ? 'Done' : 'Select'} on={!!multi} onPress={() => setMulti(multi ? null : {})} />
          <Chip label="Only mine" on={onlyMine} onPress={() => setOnlyMine(!onlyMine)} />
          <Chip label={myKeys.length ? 'Clear mine · ' + myKeys.length : 'Clear mine'} on={false} disabled={!myKeys.length} onPress={clearMine} />
        </View>
      </View>
      <View style={{ margin: space.gutter, marginTop: space.ml, height: size.schedPanel }}>
        {multi ? <MultiPanel court={court} picked={multi} onDone={() => setMulti(null)} /> : <SinglePanel court={court} d={sel.d} h={sel.h} onNewGame={() => setSheet({ court, d: sel.d, h: sel.h })} />}
      </View>
      <CourtMenu open={menu} onClose={() => setMenu(false)} />
      <NewGameSheet at={sheet} onClose={() => setSheet(null)} />
    </Page>
  );
}

function SinglePanel({ court, d: day, h, onNewGame }: { court: CourtId; d: number; h: number; onNewGame: () => void }) {
  const { d, going, toggleGoing } = useApp();
  const k = goingKey(court, day, h);
  const me = !!going[k];
  const g = d.gameAt(court, day, h);
  const ppl = d.crowd(court, day, h).map(d.view(court));
  const n = ppl.length;
  const fn = friendNames(ppl);
  const lb = hourLabel(7 + h);
  const title = g ? g.title : n ? n + ' going' : 'Nobody yet';
  const sub = g ? g.fmt + ' · ' + n + ' of ' + g.cap + (fn ? ' · ' + fn : '') : fn ? fn + (n > 1 ? ' and others' : '') : n ? 'No friends yet' : 'Be the first';
  return (
    <Card>
      <View style={{ height: size.schedPanel - space.xl * 2 - 2, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
          <View style={{ width: size.dateBlock, paddingRight: space.ml, borderRightWidth: 1, borderRightColor: color.divider }}>
            <Text t="micro" tint={color.muted}>
              {dayName(day)}
            </Text>
            <Text t="stat" numberOfLines={1}>
              {lb.t + ' ' + lb.ap}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text t="itemTitle" numberOfLines={1}>
              {title}
            </Text>
            <Text t="rowSub" tint={color.muted} numberOfLines={1} style={{ marginTop: space.xs }}>
              {sub}
            </Text>
          </View>
          {n ? <AvatarStack people={ppl} outline={color.surface} max={4} /> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: space.m }}>
          <Button
            label={g ? (me ? 'Joined' : 'Join game') : me ? '✓ Going' : "I'm going"}
            kind={me ? 'outline' : 'light'}
            grow
            feedback="commit"
            onPress={() => toggleGoing(court, day, h)}
          />
          {!g ? <Button label="+ New game" kind="ghost" grow onPress={onNewGame} /> : null}
        </View>
      </View>
    </Card>
  );
}

function MultiPanel({ court, picked, onDone }: { court: CourtId; picked: Record<string, boolean>; onDone: () => void }) {
  const { going, toggleGoing } = useApp();
  const keys = Object.keys(picked)
    .map((k) => k.split(':').map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const n = keys.length;
  const allOn = n > 0 && keys.every(([dd, hh]) => going[goingKey(court, dd, hh)]);
  const names = keys.map(([dd, hh]) => days[dd].charAt(0) + days[dd].slice(1).toLowerCase() + ' ' + hourLabel(7 + hh).short);
  return (
    <Card>
      <View style={{ height: size.schedPanel - space.xl * 2 - 2, justifyContent: 'space-between' }}>
        <View>
          <Text t="stat">{n ? n + (n === 1 ? ' time' : ' times') : 'Tap or drag times'}</Text>
          <Text t="rowSub" tint={color.muted} numberOfLines={1} style={{ marginTop: space.xsm }}>
            {n ? names.slice(0, 5).join(' · ') + (n > 5 ? ' · +' + (n - 5) : '') : 'Pick as many as you want'}
          </Text>
        </View>
        <Button
          label={!n ? "I'm going" : allOn ? 'Remove ' + n : "I'm going · " + n}
          kind={allOn ? 'outline' : 'light'}
          disabled={!n}
          feedback="commit"
          onPress={() => {
            keys.forEach(([dd, hh]) => {
              if (!!going[goingKey(court, dd, hh)] === allOn) toggleGoing(court, dd, hh);
            });
            onDone();
          }}
        />
      </View>
    </Card>
  );
}
