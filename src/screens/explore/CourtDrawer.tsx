import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { HourBars } from '@/components/court/HourBars';
import { BookmarkButton, Button } from '@/components/ui/controls';
import { Glow } from '@/components/ui/Glow';
import { useOverlay } from '@/components/ui/Overlay';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { courts, HOURS, NOW_HOUR, type CourtId } from '@/mock/data';
import { courtDistance, courtPlace } from '@/mock/model';
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
    <View style={{ gap: space.x5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.l }}>
        <View style={{ flex: 1, minWidth: 0, gap: space.xs }}>
          <Text t="caption2" tint={sport[ct.sport].ink}>
            {sport[ct.sport].label}
          </Text>
          <Text t="title1" numberOfLines={2}>
            {ct.name}
          </Text>
          <Text t="footnote" tint={color.muted}>
            {courtPlace(cid) + ' · ' + courtDistance(cid) + ' · ' + ct.locals + ' locals'}
          </Text>
        </View>
        <BookmarkButton saved={mine.includes(cid)} onPress={() => toggleSaved(cid)} />
      </View>
      <View style={{ gap: space.m }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text t="headline">Today</Text>
          <Text t="footnote" tint={n ? color.orangeInk : color.muted}>
            {n + ' on court now'}
          </Text>
        </View>
        <HourBars
          counts={d.todayCounts(cid)}
          height={size.barChartSm}
          labels={Array.from({ length: HOURS }, (_, i) => (i === NOW_HOUR ? 'Now' : i === 0 ? '7A' : i === 16 ? '11P' : ''))}
          future={color.futureBarDrawer}
        />
      </View>
      <Text t="subhead" tint={people.length ? color.inkSub : color.muted} numberOfLines={2}>
        {people.length ? names.join(', ') : 'Nobody on court yet'}
      </Text>
      <View style={{ gap: space.m }}>
        <Button
          label={here ? 'Check out' : 'Check in'}
          kind={here ? 'outline' : 'orange'}
          size="large"
          feedback="commit"
          onPress={() => (here ? checkOut() : checkIn(cid))}
        />
        <Button
          label="Court page"
          kind="ghost"
          size="large"
          onPress={() => {
            onClose();
            router.push({ pathname: '/court/[id]', params: { id: cid } });
          }}
        />
      </View>
    </View>
  );
}
