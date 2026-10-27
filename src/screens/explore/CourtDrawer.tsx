import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { HourBars } from '@/components/court/HourBars';
import { AvatarStack } from '@/components/ui/Avatar';
import { BookmarkButton, Button, SportTag } from '@/components/ui/controls';
import { Glow } from '@/components/ui/Glow';
import { useOverlay } from '@/components/ui/Overlay';
import { Sheet } from '@/components/ui/Sheet';
import { StatStrip } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, HOURS, NOW_HOUR, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, size, space, sport } from '@/theme';

/** Peek drawer for a court: counts, today's bars, who's on court, check in. */
export function CourtDrawer({ id, onClose }: { id: CourtId | null; onClose: () => void }) {
  // Keep showing the last court while the drawer animates closed.
  const [last, setLast] = useState<CourtId | null>(id);
  if (id && id !== last) setLast(id);
  const c = last ? courts[last] : null;
  useOverlay(
    <Sheet open={!!id} onClose={onClose} background={c ? <Glow rgb={sport[c.sport].glowRGB} alpha={sport[c.sport].glowAlpha} rx="90%" ry="50%" /> : null}>
      {c ? <Body cid={c.id} onClose={onClose} /> : null}
    </Sheet>,
  );
  return null;
}

function Body({ cid, onClose }: { cid: CourtId; onClose: () => void }) {
  const { d, mine, checkedAt, toggleSaved, checkIn, checkOut } = useApp();
  const ct = courts[cid];
  const n = d.liveCount(cid);
  const here = checkedAt === cid;
  const people = d.livePeople(cid).map(d.view(cid));
  const names = people.map((p) => (p.me ? 'You' : p.n));
  return (
    <View style={{ gap: space.xxl }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.l }}>
        <View style={{ flex: 1, minWidth: 0, gap: space.m }}>
          <SportTag sport={ct.sport} />
          <Text t="sheetTitle">
            {ct.name}
            <Text t="sheetTitle" tint={color.orange}>
              .
            </Text>
          </Text>
          <Text t="meta" tint={color.muted}>
            {ct.area}
          </Text>
        </View>
        <BookmarkButton saved={mine.includes(cid)} onPress={() => toggleSaved(cid)} />
      </View>
      <StatStrip
        framed
        align="start"
        items={[
          { value: n, label: 'Live now', tint: n ? color.orangeInk : color.ink },
          { value: ct.locals, label: 'Locals' },
          { value: d.gamesThisWeek(cid), label: 'Games this week' },
        ]}
      />
      <HourBars
        counts={d.todayCounts(cid)}
        height={size.barChartSm}
        labels={Array.from({ length: HOURS }, (_, i) => (i === NOW_HOUR ? 'NOW' : i === 0 ? '7A' : i === 16 ? '11P' : ''))}
        future={color.futureBarDrawer}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l, minHeight: size.compact }}>
        {people.length ? <AvatarStack people={people} outline={color.sheet} max={4} /> : null}
        <Text t="caption" tint={color.inkSub} numberOfLines={1} style={{ flex: 1 }}>
          {people.length ? names.slice(0, 3).join(', ') + (names.length > 3 ? ' +' + (names.length - 3) : '') + ' on court' : 'Nobody on court yet'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: space.m }}>
        <Button
          label={here ? '✓ Checked in' : 'Check in'}
          kind={here ? 'here' : 'orange'}
          size="large"
          grow
          feedback="commit"
          onPress={() => (here ? checkOut() : checkIn(cid))}
        />
        <Button
          label="Court page ›"
          kind="ghost"
          size="large"
          grow
          onPress={() => {
            onClose();
            router.push({ pathname: '/court/[id]', params: { id: cid } });
          }}
        />
      </View>
    </View>
  );
}
