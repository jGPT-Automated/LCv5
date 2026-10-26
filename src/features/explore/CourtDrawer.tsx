import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { HourBars } from '@/components/court/HourBars';
import { AvatarStack } from '@/components/ui/Avatar';
import { BookmarkButton, Button, SportTag } from '@/components/ui/controls';
import { Glow } from '@/components/ui/Glow';
import { useOverlay } from '@/components/ui/Overlay';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { courts, HOURS, NOW_HOUR, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, radius, space, sport } from '@/theme';

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
  const metrics: [string, number, string][] = [
    ['Live now', n, n ? color.orangeInk : color.ink],
    ['Locals', ct.locals, color.ink],
    ['Games this week', d.gamesThisWeek(cid), color.ink],
  ];
  const labels = Array.from({ length: HOURS }, (_, i) => (i === NOW_HOUR ? 'NOW' : i === 0 ? '7A' : i === 16 ? '11P' : ''));
  return (
    <View style={{ gap: space.xxl }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.l }}>
        <View style={{ flex: 1, minWidth: 0, gap: space.m }}>
          <SportTag sport={ct.sport} />
          <Text variant="display" size={30} track="tight" lineHeight={0.95}>
            {ct.name}
            <Text variant="display" size={30} tint={color.orange}>
              .
            </Text>
          </Text>
          <Text size={11.5} weight="medium" tint={color.muted}>
            {ct.area}
          </Text>
        </View>
        <BookmarkButton saved={mine.includes(cid)} onPress={() => toggleSaved(cid)} size={40} iconSize={16} r={radius.tile} />
      </View>

      <View style={{ flexDirection: 'row', borderRadius: radius.panel, borderWidth: 1, borderColor: color.border, backgroundColor: color.inset }}>
        {metrics.map(([k, v, ink], j) => (
          <View key={k} style={{ flex: 1, padding: space.l, gap: space.xs, borderLeftWidth: j ? 1 : 0, borderLeftColor: color.divider }}>
            <Text variant="display" size={26} track="tight" tint={ink}>
              {String(v)}
            </Text>
            <Text variant="label" size={7.5} tint={color.muted}>
              {k}
            </Text>
          </View>
        ))}
      </View>

      <HourBars counts={d.todayCounts(cid)} height={34} labels={labels} future={color.futureBarDrawer} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l, minHeight: 30 }}>
        {people.length ? <AvatarStack people={people} outline={color.sheet} max={4} /> : null}
        <Text size={12} tint={color.inkSub} numberOfLines={1} style={{ flex: 1 }}>
          {people.length ? names.slice(0, 3).join(', ') + (names.length > 3 ? ' +' + (names.length - 3) : '') + ' on court' : 'Nobody on court yet'}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: space.m }}>
        <Button
          label={here ? '✓ Checked in' : 'Check in'}
          kind={here ? 'here' : 'orange'}
          height={50}
          size={11}
          grow
          onPress={() => (here ? checkOut() : checkIn(cid))}
        />
        <Button
          label="Court page ›"
          kind="ghost"
          height={50}
          size={11}
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
