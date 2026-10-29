import { useState } from 'react';
import { View } from 'react-native';

import { MatchRow } from '@/components/court/MatchRow';
import { openPlayer } from '@/components/court/PlayerRow';
import { PageScroll } from '@/components/layout/PageScroll';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyRow, Segmented } from '@/components/ui/controls';
import { Row } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { players, sessionLengths, type CourtId } from '@/mock/data';
import { ago } from '@/mock/model';
import { profileInfo } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { usePeople } from '@/state/usePeople';
import { color, space } from '@/theme';

type Filter = 'all' | 'games' | 'checkins';

/** What happened at a court: games and check-ins, newest first. */
export function ActivityTab({ court }: { court: CourtId }) {
  const { matches, d } = useApp();
  const { get, name } = usePeople();
  const [filter, setFilter] = useState<Filter>('all');

  const live = new Set(d.livePeople(court).map((p) => p.i));
  const checkins = players
    .filter((p) => live.has(p.i) || (profileInfo[p.i]?.home === court && p.seen < 3 * 1440))
    .map((p, k) => ({ i: p.i, ago: live.has(p.i) ? 0 : p.seen, length: sessionLengths[k] ?? '1h' }));
  const items = [
    ...(filter !== 'checkins' ? matches.filter((m) => m.court === court).map((m) => ({ ago: m.ago, key: m.id, el: <MatchRow m={m} name={name} /> })) : []),
    ...(filter !== 'games'
      ? checkins.map((c) => ({
          ago: c.ago,
          key: 'c' + c.i,
          el: (
            <Row
              onPress={() => openPlayer(c.i)}
              leading={<Avatar p={get(c.i)} size="m" />}
              title={c.ago ? name(c.i) + ' checked in' : name(c.i)}
              subtitle={c.ago ? 'Played ' + c.length : 'On court now'}
              subtitleTint={c.ago ? color.dim : color.orangeInk}
              trailing={
                c.ago ? (
                  <Text t="rowSub" tint={color.dim}>
                    {ago(c.ago)}
                  </Text>
                ) : null
              }
            />
          ),
        }))
      : []),
  ].sort((a, b) => a.ago - b.ago);

  return (
    <PageScroll top={space.xl}>
      <Segmented<Filter>
        options={[
          ['all', 'All'],
          ['games', 'Games'],
          ['checkins', 'Check-ins'],
        ]}
        value={filter}
        onChange={setFilter}
      />
      <View style={{ marginTop: space.s }}>{items.length ? items.map((x) => <View key={x.key}>{x.el}</View>) : <EmptyRow>No activity yet</EmptyRow>}</View>
    </PageScroll>
  );
}
