import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';

import { Screen } from '@/components/nav/Screen';
import { BookmarkButton, Button, Tap } from '@/components/ui/controls';
import { Icon, LogoMark } from '@/components/ui/Icon';
import { LiveDot } from '@/components/ui/LiveDot';
import { Text } from '@/components/ui/Text';
import { courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, layout, radius, space, sport } from '@/theme';

import { PlayersTab, type PlayerSort } from './PlayersTab';
import { TodayTab } from './TodayTab';
import { WeekTab } from './WeekTab';

type Tab = 'now' | 'week' | 'players';

/**
 * Home: your saved courts. Swipe the top card, tap the dots, or tap the name
 * to switch court. With `courtId`, the same layout shows one court (the court
 * page opened from Explore).
 */
export function HomeScreen({ courtId }: { courtId?: CourtId }) {
  const app = useApp();
  const { mine, homeIndex, setHomeIndex, checkedAt, d } = app;
  const courtView = !!courtId;
  const list: CourtId[] = courtView ? [courtId] : mine;
  const idx = courtView ? 0 : Math.min(homeIndex, mine.length - 1);
  const cur = list[idx];

  const [tab, setTab] = useState<Tab>('now');
  const [sort, setSort] = useState<PlayerSort>('ranked');
  const [menu, setMenu] = useState(false);
  const carousel = useRef<ScrollViewInstance>(null);
  const [slideW, setSlideW] = useState(0);

  // Index the user last swiped to. When the menu or dots change the court,
  // idx differs from it and we scroll the carousel there.
  const swiped = useRef(idx);
  const target = useRef<number | null>(null);
  useEffect(() => {
    if (!slideW || swiped.current === idx) return;
    target.current = idx;
    carousel.current?.scrollTo({ x: idx * slideW, animated: true });
  }, [idx, slideW]);

  const onCarousel = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!slideW) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / slideW);
    // While a menu/dot jump animates, ignore the in-between positions.
    if (target.current !== null) {
      if (i === target.current) {
        swiped.current = i;
        target.current = null;
      }
      return;
    }
    swiped.current = i;
    if (i !== homeIndex && i >= 0 && i < list.length) setHomeIndex(i);
  };

  const checkedHere = checkedAt === cur;
  const on = !courtView && !!checkedAt;

  const header = courtView ? (
    <View style={styles.headerRow}>
      <Tap
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/explore'))}
        style={{
          height: 36,
          paddingLeft: space.m,
          paddingRight: space.xl,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: color.borderStrong,
          backgroundColor: color.pillBg,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.xs,
        }}>
        <Icon name="chevronLeft" size={14} />
        <Text variant="label" size={9.5}>
          Explore
        </Text>
      </Tap>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.m }}>
        <BookmarkButton saved={mine.includes(cur)} onPress={() => app.toggleSaved(cur)} size={36} iconSize={15} />
        <Button
          label={checkedHere ? 'Checked in' : 'Check in'}
          kind={checkedHere ? 'here' : 'orange'}
          height={36}
          size={10}
          icon={checkedHere ? <LiveDot /> : undefined}
          onPress={() => (checkedHere ? app.checkOut() : app.checkIn(cur))}
        />
      </View>
    </View>
  ) : on ? (
    <View style={styles.headerRow}>
      <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: space.ml }}>
        <LogoMark frame={color.onBright} check={color.ink} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="display" size={21} track="slight" tint={color.onBright} lineHeight={1}>
            Checked in
          </Text>
          <Text size={10.5} tint={color.darkSubText} numberOfLines={1} style={{ marginTop: space.xxs }}>
            {courts[checkedAt].name + ' · since 4:48 PM'}
          </Text>
        </View>
      </View>
      <Button label="Check out" kind="dark" height={36} size={10} onPress={app.checkOut} />
    </View>
  ) : (
    <View style={styles.headerRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.ml }}>
        <LogoMark />
        <Text variant="display" size={24} track="title">
          Home
        </Text>
      </View>
      <Button
        label="Check in"
        kind="orange"
        height={36}
        size={10.5}
        icon={<Icon name="check" size={12} tint={color.onBright} />}
        onPress={() => app.checkIn(cur)}
      />
    </View>
  );

  return (
    <Screen header={header} topColor={on ? color.orange : color.bg}>
      {/* Court carousel */}
      <ScrollView
        ref={carousel}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={(e) => setSlideW(e.nativeEvent.layout.width)}
        onScroll={onCarousel}
        scrollEventThrottle={16}
        scrollEnabled={list.length > 1}
        style={{ flexGrow: 0 }}>
        {list.map((c) => {
          const ct = courts[c];
          const n = d.liveCount(c);
          const sp = sport[ct.sport];
          return (
            <View
              key={c}
              style={{
                width: slideW || undefined,
                paddingTop: space.ml,
                paddingHorizontal: space.gutter,
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: space.l,
              }}>
              <View style={{ flex: 1, minWidth: 0, gap: space.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                  <View style={{ width: 6, height: 6, borderRadius: radius.pill, backgroundColor: sp.dot }} />
                  <Text variant="label" size={9.5} track="widest" tint={sp.ink}>
                    {sp.label}
                  </Text>
                </View>
                <Tap
                  onPress={courtView ? undefined : () => setMenu(true)}
                  disabled={courtView}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: space.m }}>
                  <Text variant="display" size={27} track="tighter" lineHeight={0.95} style={{ flexShrink: 1 }}>
                    {ct.name}
                    <Text variant="display" size={27} tint={color.orange}>
                      .
                    </Text>
                  </Text>
                  {!courtView ? <Icon name="chevronDown" size={12} tint={color.muted} /> : null}
                </Tap>
                <Text size={11.5} weight="medium" tint={color.muted} numberOfLines={1}>
                  {ct.area + ' · ' + ct.locals + ' locals'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: space.xs }}>
                <Text variant="display" size={46} track="tightest" lineHeight={0.85}>
                  {String(n)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s }}>
                  {n ? <LiveDot halo /> : null}
                  <Text variant="label" size={8.5} tint={n ? color.orangeInk : color.dim}>
                    {n ? 'Live now' : 'On court'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: space.xsm, height: 5, marginTop: space.l }}>
        {!courtView && list.length > 1
          ? list.map((c, k) => (
              <Pressable
                key={c}
                hitSlop={8}
                onPress={() => setHomeIndex(k)}
                style={{ width: k === idx ? 18 : 5, height: 5, borderRadius: radius.pill, backgroundColor: k === idx ? color.ink : color.grabber }}
              />
            ))
          : null}
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', marginTop: space.m, borderBottomWidth: 1, borderBottomColor: color.divider }}>
        {(
          [
            ['now', 'Today'],
            ['week', 'Week'],
            ['players', 'Players'],
          ] as [Tab, string][]
        ).map(([k, l]) => (
          <Tap key={k} onPress={() => setTab(k)} style={{ flex: 1, height: 42, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="label" size={10} tint={tab === k ? color.ink : color.faint}>
              {l}
            </Text>
            {tab === k ? <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, backgroundColor: color.ink }} /> : null}
          </Tap>
        ))}
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

      {menu ? (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenu(false)} />
          <View style={styles.menu}>
            <Text variant="label" size={8} tint={color.dim} style={{ paddingHorizontal: space.xl, paddingTop: space.ml, paddingBottom: space.s }}>
              Saved courts
            </Text>
            {mine.map((c, k) => {
              const n = d.liveCount(c);
              return (
                <Tap
                  key={c}
                  onPress={() => {
                    setHomeIndex(k);
                    setMenu(false);
                  }}
                  style={styles.menuRow}>
                  <View style={{ width: 6, height: 6, borderRadius: radius.pill, backgroundColor: sport[courts[c].sport].dot }} />
                  <Text size={13} style={{ flex: 1 }}>
                    {courts[c].name}
                  </Text>
                  {n ? (
                    <Text size={10} tint={color.orangeInk}>
                      {n + ' live'}
                    </Text>
                  ) : null}
                  {k === idx ? <Icon name="check" size={12} /> : null}
                </Tap>
              );
            })}
            <Tap
              onPress={() => {
                setMenu(false);
                router.push('/explore');
              }}
              style={styles.menuRow}>
              <Text variant="label" size={10} track="label" tint={color.inkSub}>
                + Add a court
              </Text>
            </Tap>
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: layout.headerHeight,
    paddingLeft: space.gutter,
    paddingRight: space.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.l,
  },
  menu: {
    position: 'absolute',
    left: space.gutter,
    top: 170,
    width: 236,
    borderRadius: radius.panel,
    backgroundColor: color.menu,
    borderWidth: 1,
    borderColor: color.borderStrong,
    boxShadow: `0 14px 36px ${color.shadow}`,
    overflow: 'hidden',
  },
  menuRow: {
    height: 46,
    paddingHorizontal: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.ml,
    borderTopWidth: 1,
    borderTopColor: color.line,
  },
});
