import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, type GestureResponderEvent, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';

import { HourBars } from '@/components/court/HourBars';
import { Avatar, AvatarStack } from '@/components/ui/Avatar';
import { Button, EmptyRow, Tap } from '@/components/ui/controls';
import { LiveDot } from '@/components/ui/LiveDot';
import { Text } from '@/components/ui/Text';
import { HOURS, NOW_HOUR, sessionLengths, TODAY, type CourtId } from '@/mock/data';
import { friendNames, goingKey, hourLabel, tierOf, type PlayerView } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, layout, radius, space, tier } from '@/theme';

/** How far below the top of the timeline the focused row sits. */
const FOCUS = 110;

/**
 * Today at a court. Bars on top, timeline below with later hours at the top,
 * earlier at the bottom and a NOW row between. Scrolling the timeline moves
 * the highlight on the bars; dragging across the bars scrolls the timeline.
 */
export function TodayTab({ court, onSeePlayers }: { court: CourtId; onSeePlayers: () => void }) {
  const app = useApp();
  const { d, going } = app;
  const [hi, setHi] = useState(NOW_HOUR);
  const scroller = useRef<ScrollViewInstance>(null);
  const rowY = useRef<Record<number, number>>({});
  const barsW = useRef(1);

  const view = d.view(court);
  const hours = Array.from({ length: HOURS }, (_, i) => {
    const now = i === NOW_HOUR;
    const past = i < NOW_HOUR;
    const k = goingKey(court, TODAY, i);
    return {
      i,
      now,
      past,
      k,
      me: !past && !now && !!going[k],
      people: (now ? d.livePeople(court) : d.crowd(court, TODAY, i)).map(view),
      game: !past && !now ? d.gameAt(court, TODAY, i) : undefined,
    };
  });

  const scrollToRow = (i: number, animated = false) => {
    const y = rowY.current[i];
    if (y == null) return;
    scroller.current?.scrollTo({ y: y >= FOCUS * 2 ? y - FOCUS : y / 2, animated });
  };

  // Start on NOW whenever the court changes.
  useEffect(() => {
    const t = setTimeout(() => {
      scrollToRow(NOW_HOUR);
      setHi(NOW_HOUR);
    }, 60);
    return () => clearTimeout(t);
  }, [court]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const top = e.nativeEvent.contentOffset.y;
    const y = top + Math.min(FOCUS, top);
    let next = HOURS - 1;
    for (let i = HOURS - 1; i >= 0; i--) {
      const r = rowY.current[i];
      if (r != null && r <= y) next = i;
    }
    if (next !== hi) setHi(next);
  };

  const scrubAt = (e: GestureResponderEvent) => {
    const i = Math.max(0, Math.min(HOURS - 1, Math.floor((e.nativeEvent.locationX / barsW.current) * HOURS)));
    scrollToRow(i);
  };

  const h = hours[hi] ?? hours[NOW_HOUR];
  const n = h.people.length;
  const hl = hourLabel(7 + h.i);
  const caption = h.now
    ? 'Now · ' + (n ? n + ' on court' : 'Nobody on court')
    : hl.t + ' ' + hl.ap + ' · ' + (h.past ? (n ? n + ' checked in' : 'Quiet') : (n ? n + ' going' : 'Nobody yet') + (h.game ? ' · ' + h.game.title : ''));
  const labels = hours.map((x) => (x.now ? 'Now' : [0, 4, 8, 13, 16].includes(x.i) ? hourLabel(7 + x.i).short : ''));

  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      <View style={{ paddingTop: space.xl, paddingHorizontal: space.gutter }}>
        <View
          onLayout={(e) => (barsW.current = e.nativeEvent.layout.width)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
          onResponderGrant={scrubAt}
          onResponderMove={scrubAt}>
          <View pointerEvents="none">
            <HourBars counts={hours.map((x) => x.people.length)} height={40} labels={labels} highlight={hi} outlineFuture />
          </View>
        </View>
        <Text size={11} tint={color.inkMid} numberOfLines={1} style={{ marginTop: space.m }}>
          {caption}
        </Text>
      </View>
      <ScrollView
        ref={scroller}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: space.ml, borderTopWidth: 1, borderTopColor: color.divider }}
        contentContainerStyle={{ paddingHorizontal: space.gutter, paddingBottom: layout.timelineTail }}>
        {[...hours].reverse().map((x) => (
          <View
            key={x.i}
            onLayout={(e) => (rowY.current[x.i] = e.nativeEvent.layout.y)}
            style={{
              marginHorizontal: -space.ml,
              paddingHorizontal: space.ml,
              borderRadius: radius.row,
              backgroundColor: x.i === hi && !x.now ? color.highlight : 'transparent',
            }}>
            {x.now ? (
              <NowRow people={x.people} onMore={onSeePlayers} />
            ) : (
              <HourRow x={x} highlighted={x.i === hi} onToggle={() => app.toggleGoing(court, TODAY, x.i)} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function HourRow({
  x,
  highlighted,
  onToggle,
}: {
  x: { i: number; past: boolean; me: boolean; people: PlayerView[]; game?: { title: string; fmt: string; cap: number } };
  highlighted: boolean;
  onToggle: () => void;
}) {
  const lb = hourLabel(7 + x.i);
  const n = x.people.length;
  const fn = friendNames(x.people);
  let prim: string;
  let sub = fn;
  if (x.game) {
    prim = x.game.title;
    sub = x.game.fmt + ' · ' + n + ' of ' + x.game.cap + (fn ? ' · ' + fn : '');
  } else if (x.past) prim = n ? n + ' checked in' : 'Quiet';
  else prim = n ? n + ' going' : 'Nobody yet';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.l,
        minHeight: 56,
        borderBottomWidth: 1,
        borderBottomColor: color.line,
        opacity: x.past ? 0.55 : 1,
      }}>
      <View style={{ width: 36, flexDirection: 'row', alignItems: 'baseline', gap: space.xxxs }}>
        <Text variant="display" size={16} tint={highlighted ? color.ink : x.past ? color.faint : color.inkMid}>
          {lb.t}
        </Text>
        <Text variant="label" size={7.5} track="wide" tint={color.faint}>
          {lb.ap}
        </Text>
      </View>
      <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: space.l }}>
        {n > 0 ? <AvatarStack people={x.people} outline={color.bg} /> : null}
        <View style={{ flex: 1, minWidth: 0 }}>
          {x.game ? (
            <Text variant="display" size={15} numberOfLines={1}>
              {prim}
            </Text>
          ) : (
            <Text size={12.5} tint={color.inkSoft} numberOfLines={1}>
              {prim}
            </Text>
          )}
          {sub ? (
            <Text size={10.5} weight="medium" tint={color.muted} numberOfLines={1} style={{ marginTop: space.xxs }}>
              {sub}
            </Text>
          ) : null}
        </View>
      </View>
      {x.game ? (
        <Button label={x.me ? 'Joined' : 'Join'} kind={x.me ? 'light' : 'outline'} height={34} size={9} onPress={onToggle} />
      ) : !x.past ? (
        <Tap
          onPress={onToggle}
          hitSlop={6}
          style={{
            width: 34,
            height: 34,
            borderRadius: radius.control,
            borderWidth: 1,
            borderColor: x.me ? color.ink : color.controlStrong,
            backgroundColor: x.me ? color.ink : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text size={15} weight="bold" tint={x.me ? color.onBright : color.ink}>
            {x.me ? '✓' : '+'}
          </Text>
        </Tap>
      ) : null}
    </View>
  );
}

function NowRow({ people, onMore }: { people: PlayerView[]; onMore: () => void }) {
  const n = people.length;
  return (
    <View style={{ paddingTop: space.xl, paddingBottom: space.l }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: 28 }}>
        <LiveDot halo />
        <Text variant="label" size={9.5} tint={color.orangeInk}>
          Now
        </Text>
        {n ? (
          <Text size={10} tint={color.orangeInk}>
            {n + ' on court'}
          </Text>
        ) : null}
        <View style={{ flex: 1, height: 1, backgroundColor: color.orangeLine }} />
      </View>
      {n ? (
        <View style={{ marginTop: space.s }}>
          {people.slice(0, 5).map((p, k) => {
            const t = tierOf(p.elo);
            const off = people[0]?.me ? 1 : 0;
            return (
              <View
                key={p.i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: space.l,
                  minHeight: 50,
                  marginHorizontal: -space.ml,
                  paddingHorizontal: space.ml,
                  borderRadius: radius.tile,
                  backgroundColor: p.me ? color.orangeSoft : 'transparent',
                }}>
                <Avatar p={p} size="m" />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text size={13}>{p.me ? 'You' : p.n}</Text>
                  <Text size={10.5} tint={t ? tier[t].ink : color.dim} style={{ marginTop: space.xxxs }}>
                    {t ? tier[t].name + ' · ' + p.elo : 'Unranked'}
                  </Text>
                </View>
                <Text size={10.5} tint={color.muted}>
                  {p.me ? 'Now' : (sessionLengths[k - off] ?? '1m')}
                </Text>
              </View>
            );
          })}
          {n > 5 ? (
            <Tap onPress={onMore} style={{ height: 36, justifyContent: 'center' }}>
              <Text variant="label" size={10} weight="bold" track="wider" tint={color.muted}>
                {'+' + (n - 5) + ' more on court ›'}
              </Text>
            </Tap>
          ) : null}
        </View>
      ) : (
        <View style={{ marginTop: space.ml }}>
          <EmptyRow>Nobody on court yet</EmptyRow>
        </View>
      )}
    </View>
  );
}
