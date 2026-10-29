import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { CourtMap } from '@/components/court/CourtMap';
import { Page } from '@/components/layout/Page';
import { PageScroll } from '@/components/layout/PageScroll';
import { Button, EmptyRow, Segmented } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { SearchField } from '@/components/ui/SearchField';
import { Section } from '@/components/ui/surfaces';
import { courtIds, courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { space } from '@/theme';

import { CourtCard } from './CourtCard';
import { CourtDrawer } from './CourtDrawer';

type Mode = 'list' | 'map';

export function ExploreScreen() {
  const { mine } = useApp();
  const [mode, setMode] = useState<Mode>('list');
  const [open, setOpen] = useState<CourtId | null>(null);
  const [q, setQ] = useState('');
  const match = (c: CourtId) => !q || (courts[c].name + ' ' + courts[c].area).toLowerCase().includes(q.trim().toLowerCase());
  const saved = mine.filter(match);
  const near = courtIds.filter((c) => !mine.includes(c)).filter(match);

  return (
    <Page
      title="Explore"
      action={
        <Segmented<Mode>
          compact
          options={[
            ['list', 'List'],
            ['map', 'Map'],
          ]}
          value={mode}
          onChange={setMode}
        />
      }>
      <View style={{ paddingHorizontal: space.gutter, paddingTop: space.s, paddingBottom: space.l }}>
        <SearchField value={q} onChange={setQ} placeholder="Search courts" />
      </View>
      {mode === 'list' ? (
        <PageScroll top={space.s}>
          {saved.length ? (
            <Section title={'Saved · ' + saved.length} first>
              <View style={{ gap: space.m }}>
                {saved.map((c) => (
                  <CourtCard key={c} id={c} onOpen={() => setOpen(c)} />
                ))}
              </View>
            </Section>
          ) : null}
          {near.length ? (
            <Section title="Near you" first={!saved.length}>
              <View style={{ gap: space.m }}>
                {near.map((c) => (
                  <CourtCard key={c} id={c} onOpen={() => setOpen(c)} />
                ))}
              </View>
            </Section>
          ) : null}
          {!saved.length && !near.length ? <EmptyRow>No courts match that search</EmptyRow> : null}
          <View style={{ marginTop: space.x5 }}>
            <Button label="Add a court" kind="ghost" icon={<Icon name="plus" size={12} />} onPress={() => router.push('/add-court')} />
          </View>
        </PageScroll>
      ) : (
        <CourtMap onPick={setOpen} />
      )}
      <CourtDrawer id={open} onClose={() => setOpen(null)} />
    </Page>
  );
}
