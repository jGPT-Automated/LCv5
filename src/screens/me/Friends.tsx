import { View } from 'react-native';

import { PlayerRow } from '@/components/court/PlayerRow';
import { EmptyRow } from '@/components/ui/controls';
import { courts, players } from '@/mock/data';
import { ago, tierOf } from '@/mock/model';
import { profileInfo } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { usePeople } from '@/state/usePeople';
import { tier } from '@/theme';

/** Friends: who's on court now first, then by last seen. Requests sent show at the end. */
export function Friends() {
  const { friendships } = useApp();
  const { get } = usePeople();
  const list = players
    .filter((p) => friendships[p.i] === 'friend')
    .map((p) => get(p.i))
    .sort((a, b) => (a.live ? 0 : a.seen) - (b.live ? 0 : b.seen));
  const sent = players.filter((p) => friendships[p.i] === 'sent').map((p) => get(p.i));
  if (!list.length && !sent.length) return <EmptyRow>0 friends. Add players from their profile.</EmptyRow>;
  return (
    <View>
      {list.map((p) => {
        const t = tierOf(p.elo);
        return (
          <PlayerRow
            key={p.i}
            p={p}
            subtitle={p.live ? 'On court now · ' + courts[profileInfo[p.i]?.home ?? 'rc'].name : 'Seen ' + ago(p.seen)}
            value={p.elo ?? '–'}
            valueLabel={t ? tier[t].name : 'Unranked'}
          />
        );
      })}
      {sent.map((p) => (
        <PlayerRow key={p.i} p={p} subtitle="Request sent" />
      ))}
    </View>
  );
}
