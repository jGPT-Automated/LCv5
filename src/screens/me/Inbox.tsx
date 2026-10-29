import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { openPlayer } from '@/components/court/PlayerRow';
import { Avatar } from '@/components/ui/Avatar';
import { ChoiceList } from '@/components/ui/ChoiceList';
import { Button, EmptyRow, Tap } from '@/components/ui/controls';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { SearchField } from '@/components/ui/SearchField';
import { StatusCard } from '@/components/ui/StatusCard';
import { Glyph, Row, Section } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts } from '@/mock/data';
import { timeLeft } from '@/mock/games';
import { ago, dayName, hourLabel } from '@/mock/model';
import { dayLabel, ME, profileInfo, type Match, type Note } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { usePeople } from '@/state/usePeople';
import { color, space } from '@/theme';

type Filter = 'pending' | 'all';

/**
 * Inbox, laid out as in the current app: a Pending / All filter and search,
 * then games waiting on review as status cards, friend requests and invites.
 * All adds what already happened.
 */
export function Inbox() {
  const app = useApp();
  const { get, name } = usePeople();
  const [filter, setFilter] = useState<Filter>('pending');
  const [picking, setPicking] = useState(false);
  const [q, setQ] = useState('');
  const hit = (s: string) => !q || s.toLowerCase().includes(q.trim().toLowerCase());

  const games = app.matches.filter((m) => (m.a.includes(ME) || m.b.includes(ME)) && m.status !== 'final').filter((m) => hit([...m.a, ...m.b].map(name).join(' ') + ' ' + courts[m.court].name));
  const requests = app.notes.filter((n): n is Extract<Note, { kind: 'friend' }> => n.kind === 'friend' && hit(name(n.who)));
  const invites = app.notes.filter((n): n is Extract<Note, { kind: 'invite' }> => n.kind === 'invite' && hit(name(n.who) + ' ' + courts[n.court].name));
  const earlier = app.notes.filter((n) => n.kind === 'checkin' || n.kind === 'approved' || n.kind === 'auto');

  return (
    <View style={{ marginTop: space.l }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
        <Tap onPress={() => setPicking(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: space.s }}>
          <Text t="section">{filter === 'pending' ? 'Pending' : 'All'}</Text>
          <Icon name="chevronDown" size={10} tint={color.muted} />
        </Tap>
        <View style={{ flex: 1 }}>
          <SearchField value={q} onChange={setQ} placeholder="Search inbox" />
        </View>
      </View>

      <Section title="Games">
        {games.length ? (
          <View style={{ gap: space.m }}>
            {games.map((m) => (
              <GameCard key={m.id} m={m} name={name} />
            ))}
          </View>
        ) : (
          <EmptyRow>0 games waiting</EmptyRow>
        )}
      </Section>

      {requests.length ? (
        <Section title={'Friend requests · ' + requests.length}>
          {requests.map((n, k) => (
            <Row
              key={n.id}
              divider={k < requests.length - 1}
              onPress={() => openPlayer(n.who)}
              leading={<Avatar p={get(n.who)} size="m" />}
              title={name(n.who)}
              subtitle={courts[profileInfo[n.who]?.home ?? 'rc'].name + ' · ' + ago(n.ago)}
              trailing={
                <View style={{ flexDirection: 'row', gap: space.s }}>
                  <Button label="Decline" kind="ghost" size="compact" onPress={() => app.setFriendship(n.who, 'none')} />
                  <Button label="Accept" kind="light" size="compact" feedback="success" onPress={() => app.setFriendship(n.who, 'friend')} />
                </View>
              }
            />
          ))}
        </Section>
      ) : null}

      {invites.length ? (
        <Section title={'Invites · ' + invites.length}>
          {invites.map((n, k) => {
            const g = app.games[n.court].find((x) => x.d === n.d && x.h === n.h);
            const lb = hourLabel(7 + n.h);
            return (
              <Row
                key={n.id}
                divider={k < invites.length - 1}
                leading={<Avatar p={get(n.who)} size="m" />}
                title={g?.title ?? 'Pickup game'}
                subtitle={name(n.who) + ' · ' + dayName(n.d) + ' ' + lb.t + ' ' + lb.ap + ' · ' + courts[n.court].name}
                trailing={
                  <View style={{ flexDirection: 'row', gap: space.s }}>
                    <Button label="Skip" kind="ghost" size="compact" onPress={() => app.dismissNote(n.id)} />
                    <Button
                      label="Join"
                      kind="light"
                      size="compact"
                      onPress={() => {
                        if (!app.going[n.court + ':' + n.d + ':' + n.h]) app.toggleGoing(n.court, n.d, n.h);
                        app.dismissNote(n.id);
                      }}
                    />
                  </View>
                }
              />
            );
          })}
        </Section>
      ) : null}

      {filter === 'all' && earlier.length ? (
        <Section title="Earlier">
          {earlier.map((n, k) => {
            const last = k === earlier.length - 1;
            const when = (
              <Text t="rowSub" tint={color.dim}>
                {ago(n.ago)}
              </Text>
            );
            if (n.kind === 'checkin')
              return (
                <Row key={n.id} divider={!last} onPress={() => openPlayer(n.who)} leading={<Avatar p={get(n.who)} size="m" />} title={name(n.who) + ' checked in'} subtitle={courts[n.court].name} trailing={when} />
              );
            if (n.kind === 'approved')
              return (
                <Row
                  key={n.id}
                  divider={!last}
                  onPress={() => router.push({ pathname: '/game/[id]', params: { id: n.match } })}
                  leading={<Avatar p={get(n.who)} size="m" />}
                  title={name(n.who) + ' approved your score'}
                  trailing={when}
                />
              );
            if (n.kind === 'auto')
              return <Row key={n.id} divider={!last} leading={<Glyph tint={color.orangeInk}>✓</Glyph>} title="Auto check-in" subtitle={courts[n.court].name} trailing={when} />;
            return null;
          })}
        </Section>
      ) : null}

      <Dialog open={picking} onClose={() => setPicking(false)} title="Show" actions={[{ label: 'Done', kind: 'light', onPress: () => setPicking(false) }]}>
        <ChoiceList<Filter>
          value={filter}
          onChange={setFilter}
          choices={[
            { key: 'pending', title: 'Pending', detail: 'Waiting on you or someone else' },
            { key: 'all', title: 'All', detail: 'Pending, then what already happened' },
          ]}
        />
      </Dialog>
    </View>
  );
}

/** A game waiting on review: status band, matchup, scores, time left. Opens the game. */
function GameCard({ m, name }: { m: Match; name: (i: string) => string }) {
  const needsYou = m.waitingOn.includes(ME);
  const status = m.status === 'disputed' ? 'Disputed' : needsYou ? 'Needs your review' : 'Waiting on ' + name(m.waitingOn[0] ?? '');
  const sides = [
    { ids: m.a, s: m.score[0], won: m.score[0] > m.score[1] },
    { ids: m.b, s: m.score[1], won: m.score[1] > m.score[0] },
  ];
  return (
    <StatusCard status={status} tone={needsYou || m.status === 'disputed' ? 'orange' : 'quiet'} onPress={() => router.push({ pathname: '/game/[id]', params: { id: m.id } })}>
      <Text t="section" tint={color.muted}>
        {m.fmt + ' at ' + courts[m.court].name + ' · ' + dayLabel(m.ago)}
      </Text>
      {sides.map((x, k) => (
        <View key={k} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.l }}>
          <Text t="rowTitle" tint={x.won ? color.ink : color.muted}>
            {x.ids.map(name).join(' + ')}
          </Text>
          <Text t="statL" upper={false} tint={x.won ? color.ink : color.muted}>
            {String(x.s)}
          </Text>
        </View>
      ))}
      <Text t="caption" weight="medium" tint={color.muted} align="center" style={{ marginTop: space.l }}>
        {(m.status === 'disputed' ? 'Voids in ' : 'Auto-approves in ') + timeLeft(m.hoursLeft ?? 0)}
      </Text>
    </StatusCard>
  );
}
