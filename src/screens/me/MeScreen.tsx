import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { MatchRow } from '@/components/court/MatchRow';
import { ProfileHeader } from '@/components/court/ProfileHeader';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { IconButton, Tabs } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { Glyph, Row } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, me } from '@/mock/data';
import { actionable, dayLabel, ME, won } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { usePeople } from '@/state/usePeople';
import { color, space, sport } from '@/theme';

import { Friends } from './Friends';
import { Inbox } from './Inbox';

type MeTab = 'activity' | 'friends' | 'inbox';

/**
 * Me, laid out as in the current app: you and your ELO, wins / losses /
 * check-ins, then Activity, Friends and Inbox.
 */
export function MeScreen() {
  const { notes, matches, profile } = useApp();
  const { get } = usePeople();
  const [tab, setTab] = useState<MeTab>('activity');
  // Score reviews count once, from the games themselves.
  const todo = notes.filter((n) => actionable(n) && n.kind !== 'review').length + matches.filter((m) => m.waitingOn.includes(ME)).length;
  const mineFinal = matches.filter((m) => m.status === 'final' && (m.a.includes(ME) || m.b.includes(ME)));
  const wins = mineFinal.filter((m) => won(m, ME)).length;
  const you = get(ME);

  return (
    <Page
      title="Me"
      action={
        <IconButton label="Settings" onPress={() => router.push('/settings')}>
          <Icon name="gear" size={18} tint={color.muted} />
        </IconButton>
      }>
      <PageScroll>
        <ProfileHeader
          p={you}
          name={profile.first + ' ' + profile.last + '.'}
          meta={sport[profile.sport].label + ' · ' + courts[profile.home].name}
          stats={[
            { value: wins, label: 'Wins' },
            { value: mineFinal.length - wins, label: 'Losses' },
            { value: me.checkIns, label: 'Check-ins' },
          ]}
        />
        <View style={{ marginTop: space.x5, marginHorizontal: -space.gutter }}>
          <Tabs<MeTab>
            options={[
              ['activity', 'Activity'],
              ['friends', 'Friends'],
              ['inbox', todo ? 'Inbox · ' + todo : 'Inbox'],
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>
        <View style={{ marginTop: space.s }}>
          {tab === 'activity' ? <Activity /> : null}
          {tab === 'friends' ? <Friends /> : null}
          {tab === 'inbox' ? <Inbox /> : null}
        </View>
      </PageScroll>
    </Page>
  );
}

/** Your games and check-ins, newest first. Games open the game page. */
function Activity() {
  const { matches } = useApp();
  const { name } = usePeople();
  const checkIns = [
    { id: 'c1', court: 'Rancho Park', ago: 130, length: '1h 40m' },
    { id: 'c2', court: 'Venice Beach', ago: 4 * 1440 + 120, length: '55m' },
  ];
  const items = [
    ...matches.filter((m) => m.a.includes(ME) || m.b.includes(ME)).map((m) => ({ ago: m.ago, el: <MatchRow key={m.id} m={m} name={name} /> })),
    ...checkIns.map((c) => ({
      ago: c.ago,
      el: (
        <Row
          key={c.id}
          leading={<Glyph tint={color.muted}>✓</Glyph>}
          title="Checked in"
          subtitle={c.court + ' · ' + dayLabel(c.ago)}
          subtitleTint={color.dim}
          trailing={
            <Text t="statS" upper={false}>
              {c.length}
            </Text>
          }
        />
      ),
    })),
  ].sort((a, b) => a.ago - b.ago);
  return <View>{items.map((x) => x.el)}</View>;
}
