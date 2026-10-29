import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { H2HCard } from '@/components/court/H2HCard';
import { MatchRow } from '@/components/court/MatchRow';
import { ProfileHeader } from '@/components/court/ProfileHeader';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Button, EmptyRow, IconButton, Segmented, Tabs } from '@/components/ui/controls';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { ListRow } from '@/components/ui/ListRow';
import { Glyph, Group, Row, Section } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts } from '@/mock/data';
import { dayLabel, formats, headToHead, ME, profileInfo, scoreFor, type Format } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { usePeople } from '@/state/usePeople';

import { QuickLog } from './QuickLog';
import { color, space, sport } from '@/theme';

type Tab = 'h2h' | 'activity' | 'details';

/**
 * Another player, laid out as in the current app: who they are and their
 * ELO, three numbers, then Head to head / Activity / Details. Log game and
 * Add friend or Challenge are pinned at the bottom.
 */
export function PlayerScreen({ id }: { id: string }) {
  const app = useApp();
  const { get, name } = usePeople();
  const p = get(id);
  const you = get(ME);
  const info = profileInfo[id] ?? { home: 'rc' as const, since: '2026' };
  const rel = app.friendships[id] ?? 'none';
  const blocked = app.blocked.includes(id);
  const h2h = headToHead(app.matches, ME, id);
  const theirs = app.matches.filter((m) => (m.a.includes(id) || m.b.includes(id)) && m.status === 'final').sort((a, b) => a.ago - b.ago);
  const [tab, setTab] = useState<Tab>('h2h');
  const [open, setOpen] = useState<null | 'challenge' | 'unfriend' | 'report' | 'block'>(null);
  const [fmt, setFmt] = useState<Format>('1v1');
  const [challenged, setChallenged] = useState(false);
  const close = () => setOpen(null);

  const wins = Math.round(((p.elo ?? 1000) - 1000) / 9) + 4;
  const net = h2h.games.reduce((sum, m) => sum + (m.delta[ME] ?? 0), 0);
  const [logging, setLogging] = useState(false);
  const logWith = () => setLogging(true);

  return (
    <Page
      title="Profile"
      back={{ label: 'Back', fallback: '/' }}
      footer={
        blocked ? (
          <Button label="Unblock" kind="ghost" size="large" onPress={() => app.unblock(id)} />
        ) : (
          <View style={{ flexDirection: 'row', gap: space.m }}>
            {rel === 'friend' ? (
              <>
                <IconButton label="Remove friend" onPress={() => setOpen('unfriend')}>
                  <Icon name="userMinus" size={18} tint={color.muted} />
                </IconButton>
                <Button label="Log game" kind="ghost" size="large" grow onPress={logWith} />
                <Button label={challenged ? 'Challenge sent' : 'Challenge'} kind="light" size="large" grow disabled={challenged} onPress={() => setOpen('challenge')} />
              </>
            ) : rel === 'received' ? (
              <>
                <Button label="Decline" kind="ghost" size="large" grow onPress={() => app.setFriendship(id, 'none')} />
                <Button label="Accept request" kind="orange" size="large" grow feedback="success" onPress={() => app.setFriendship(id, 'friend')} />
              </>
            ) : (
              <>
                <Button label="Log game" kind="ghost" size="large" grow onPress={logWith} />
                {rel === 'sent' ? (
                  <Button label="Requested" kind="ghost" size="large" grow onPress={() => app.setFriendship(id, 'none')} />
                ) : (
                  <Button
                    label="Add friend"
                    kind="orange"
                    size="large"
                    grow
                    icon={<Icon name="userPlus" size={16} tint={color.onBright} />}
                    onPress={() => app.setFriendship(id, 'sent')}
                  />
                )}
              </>
            )}
          </View>
        )
      }>
      <PageScroll>
        <ProfileHeader
          p={p}
          name={p.n + ' ' + p.i.charAt(1) + '.'}
          meta={courts[info.home].name + ' · ' + sport[courts[info.home].sport].label}
          stats={[
            { value: p.elo ? wins + '–' + Math.max(3, 30 - wins) : '0–0', label: 'Record' },
            { value: p.elo ? wins + Math.max(3, 30 - wins) : 0, label: 'Games' },
            { value: p.s * 3, label: 'Check-ins' },
          ]}
        />
        <View style={{ marginTop: space.x5, marginHorizontal: -space.gutter }}>
          <Tabs<Tab>
            options={[
              ['h2h', 'Head to head'],
              ['activity', 'Activity'],
              ['details', 'Details'],
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>

        {tab === 'h2h' ? (
          <>
            <View style={{ marginTop: space.x5 }}>
              <H2HCard you={you} them={p} w={h2h.w} l={h2h.l} net={net} last={h2h.games[0] ? dayLabel(h2h.games[0].ago) : '–'} />
            </View>
            <Section title="Games together">
              {h2h.games.length ? (
                h2h.games.map((m, k) => {
                  const dlt = m.delta[ME] ?? 0;
                  const win = scoreFor(m, ME).split('–').map(Number);
                  return (
                    <Row
                      key={m.id}
                      divider={k < h2h.games.length - 1}
                      onPress={() => router.push({ pathname: '/game/[id]', params: { id: m.id } })}
                      leading={<Glyph tint={win[0] > win[1] ? color.ink : color.dim}>{win[0] > win[1] ? 'W' : 'L'}</Glyph>}
                      title={m.fmt}
                      subtitle={courts[m.court].name + ' · ' + dayLabel(m.ago)}
                      subtitleTint={color.dim}
                      trailing={
                        <View style={{ alignItems: 'flex-end', gap: space.xxs }}>
                          <Text t="statS" tint={win[0] > win[1] ? color.ink : color.muted}>
                            {scoreFor(m, ME)}
                          </Text>
                          {dlt ? (
                            <Text t="rowSub" tint={dlt > 0 ? color.orangeInk : color.muted}>
                              {(dlt > 0 ? '↑ ' : '↓ ') + Math.abs(dlt)}
                            </Text>
                          ) : null}
                        </View>
                      }
                    />
                  );
                })
              ) : (
                <EmptyRow>0 games together</EmptyRow>
              )}
            </Section>
          </>
        ) : null}

        {tab === 'activity' ? (
          <View style={{ marginTop: space.l }}>
            {theirs.length ? theirs.map((m, k) => <MatchRow key={m.id} m={m} name={name} viewer={id} divider={k < theirs.length - 1} />) : <EmptyRow>0 games</EmptyRow>}
          </View>
        ) : null}

        {tab === 'details' ? (
          <>
            <Section title="About">
              <Group>
                <ListRow title="Home court" value={courts[info.home].name} onPress={() => router.push({ pathname: '/court/[id]', params: { id: info.home } })} />
                <ListRow title="Plays" value={sport[courts[info.home].sport].label} />
                <ListRow title="Rank" value={app.d.rankOf[id] ? '#' + app.d.rankOf[id] : 'Unranked'} />
                <ListRow title="Member since" value={info.since} last />
              </Group>
            </Section>
            <Section title="Safety">
              <Group>
                <ListRow title="Report player" onPress={() => setOpen('report')} />
                <ListRow title={blocked ? 'Unblock player' : 'Block player'} danger={!blocked} onPress={() => (blocked ? app.unblock(id) : setOpen('block'))} last />
              </Group>
            </Section>
          </>
        ) : null}
      </PageScroll>

      <QuickLog opp={id} oppName={p.n} open={logging} onClose={() => setLogging(false)} />
      <Dialog
        open={open === 'challenge'}
        onClose={close}
        title={'Challenge ' + p.n}
        body={'A ranked game at ' + courts[info.home].name + '. ' + p.n + ' picks a time.'}
        actions={[
          {
            label: 'Send challenge',
            kind: 'orange',
            onPress: () => {
              setChallenged(true);
              close();
            },
          },
          { label: 'Cancel', onPress: close },
        ]}>
        <Segmented<Format> options={formats.slice(0, 3).map((f) => [f, f])} value={fmt} onChange={setFmt} />
      </Dialog>
      <Dialog
        open={open === 'unfriend'}
        onClose={close}
        title={'Remove ' + p.n + '?'}
        body="You can add each other again anytime."
        actions={[
          {
            label: 'Remove friend',
            kind: 'orange',
            onPress: () => {
              app.setFriendship(id, 'none');
              close();
            },
          },
          { label: 'Cancel', onPress: close },
        ]}
      />
      <Dialog
        open={open === 'report'}
        onClose={close}
        title={'Report ' + p.n + '?'}
        body="They won't know who reported them."
        actions={[
          { label: 'Report', kind: 'orange', onPress: close },
          { label: 'Cancel', onPress: close },
        ]}
      />
      <Dialog
        open={open === 'block'}
        onClose={close}
        title={'Block ' + p.n + '?'}
        body="They can't see you or invite you. Unblock from Settings."
        actions={[
          {
            label: 'Block',
            kind: 'orange',
            onPress: () => {
              app.block(id);
              close();
            },
          },
          { label: 'Cancel', onPress: close },
        ]}
      />
    </Page>
  );
}
