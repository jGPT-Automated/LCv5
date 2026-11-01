import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Page } from '@/components/layout/Page';
import { Pager } from '@/components/layout/Pager';
import { BookmarkButton, Button, Tabs } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { LiveDot } from '@/components/ui/LiveDot';
import { Menu } from '@/components/ui/Menu';
import { Dot } from '@/components/ui/surfaces';
import { courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, space, sport } from '@/theme';

import { ActivityTab } from './ActivityTab';
import { CourtHero } from './CourtHero';
import { PlayersTab, type PlayerSort } from './PlayersTab';
import { TodayTab } from './TodayTab';
import { WeekTab } from './WeekTab';

type Tab = 'now' | 'week' | 'players' | 'activity';

/**
 * Home: your saved courts. Swipe the top, tap the dots, or tap the name to
 * switch court. With `courtId`, the same layout shows one court (the court
 * page opened from Explore).
 */
export function HomeScreen({ courtId }: { courtId?: CourtId }) {
  const app = useApp();
  const { mine, homeIndex, setHomeIndex, checkedAt, d } = app;
  const courtView = !!courtId;
  const list: CourtId[] = courtView ? [courtId] : mine;
  const idx = courtView ? 0 : Math.min(homeIndex, mine.length - 1);
  const cur = list[idx];
  const here = checkedAt === cur;

  const [tab, setTab] = useState<Tab>('now');
  const [sort, setSort] = useState<PlayerSort>('ranked');
  const [menu, setMenu] = useState(false);

  const action = courtView ? (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.m }}>
      <BookmarkButton saved={mine.includes(cur)} onPress={() => app.toggleSaved(cur)} />
      <Button
        label={here ? 'Checked in' : 'Check in'}
        kind={here ? 'here' : 'orange'}
        size="compact"
        icon={here ? <LiveDot /> : undefined}
        feedback="commit"
        onPress={() => (here ? app.checkOut() : app.checkIn(cur))}
      />
    </View>
  ) : (
    <Button
      label="Check in"
      kind="orange"
      size="compact"
      feedback="commit"
      icon={<Icon name="check" size={12} tint={color.onBright} />}
      onPress={() => app.checkIn(cur)}
    />
  );

  return (
    <Page title={courtView ? 'Court' : 'Home'} back={courtView ? { label: 'Explore', fallback: '/explore' } : undefined} action={action}>
      <Pager
        count={list.length}
        index={idx}
        onIndex={setHomeIndex}
        render={(i) => <CourtHero id={list[i]} onMenu={courtView ? undefined : () => setMenu(true)} />}
      />
      <View style={{ marginTop: space.m }}>
        <Tabs<Tab>
          options={[
            ['now', 'Today'],
            ['week', 'Week'],
            ['players', 'Players'],
            ['activity', 'Activity'],
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>
      {tab === 'now' ? (
        <TodayTab
          court={cur}
          onSeePlayers={() => {
            setSort('recent');
            setTab('players');
          }}
        />
      ) : null}
      {tab === 'week' ? <WeekTab court={cur} /> : null}
      {tab === 'players' ? <PlayersTab court={cur} sort={sort} onSort={setSort} /> : null}
      {tab === 'activity' ? <ActivityTab court={cur} /> : null}
      <Menu
        open={menu}
        onClose={() => setMenu(false)}
        title="Saved courts"
        top={space.x5 * 2 + space.l}
        items={mine.map((c, k) => {
          const n = d.liveCount(c);
          return {
            key: c,
            label: courts[c].name,
            leading: <Dot tint={sport[courts[c].sport].dot} />,
            trailing: n ? n + ' live' : undefined,
            selected: k === idx,
            onPress: () => {
              setHomeIndex(k);
              setMenu(false);
            },
          };
        })}
        footer={{
          label: '+ Add a court',
          onPress: () => {
            setMenu(false);
            router.push('/explore');
          },
        }}
      />
    </Page>
  );
}
