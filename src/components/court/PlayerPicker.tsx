import { useState } from 'react';
import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { SearchField } from '@/components/ui/SearchField';
import { Row } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import type { PlayerView } from '@/mock/model';
import { tierOf } from '@/mock/model';
import { color, radius, space, tier } from '@/theme';

/** The open list under a player slot: search, then friends, then everyone else at the court. */
export function PlayerPicker({ people, onPick }: { people: PlayerView[]; onPick: (i: string) => void }) {
  const [q, setQ] = useState('');
  const match = people.filter((p) => !q || p.n.toLowerCase().includes(q.trim().toLowerCase()));
  const friends = match.filter((p) => p.friend);
  const others = match.filter((p) => !p.friend);
  const row = (p: PlayerView, k: number, list: PlayerView[]) => {
    const t = tierOf(p.elo);
    return (
      <Row
        key={p.i}
        divider={k < list.length - 1}
        onPress={() => onPick(p.i)}
        leading={<Avatar p={p} size="m" />}
        title={p.n}
        subtitle={(t ? tier[t].name : 'Unranked') + (p.elo ? ' · ' + p.elo + ' ELO' : '')}
        trailing={p.friend ? <Pill label="Friend" /> : p.live ? <Pill label="On court" tone="orange" /> : null}
      />
    );
  };
  return (
    <View style={{ borderRadius: radius.card, borderWidth: 1, borderColor: color.borderStrong, backgroundColor: color.surface, padding: space.l, gap: space.m }}>
      <SearchField value={q} onChange={setQ} placeholder="Search players" />
      {friends.length ? (
        <View>
          <Text t="eyebrow" tint={color.muted} style={{ marginTop: space.s }}>
            Your friends
          </Text>
          {friends.map((p, k) => row(p, k, friends))}
        </View>
      ) : null}
      {others.length ? (
        <View>
          <Text t="eyebrow" tint={color.muted} style={{ marginTop: space.s }}>
            Players here
          </Text>
          {others.map((p, k) => row(p, k, others))}
        </View>
      ) : null}
      {!match.length ? (
        <Text t="meta" tint={color.muted}>
          No players match
        </Text>
      ) : null}
    </View>
  );
}
