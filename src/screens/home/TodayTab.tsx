import { useEffect, useRef, useState } from 'react';
import { View, type GestureResponderEvent, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';

import { HourBars } from '@/components/court/HourBars';
import { PlayerRow } from '@/components/court/PlayerRow';
import { PageScroll } from '@/components/layout/PageScroll';
import { AvatarStack } from '@/components/ui/Avatar';
import { Button, EmptyRow, IconButton, IconSwap, Tap } from '@/components/ui/controls';
import { LiveDot } from '@/components/ui/LiveDot';
import { Row, Rule } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { HOURS, NOW_HOUR, sessionLengths, TODAY, type CourtId } from '@/mock/data';
import { friendNames, goingKey, hourLabel, tierOf, type PlayerView } from '@/mock/model';
import { useApp } from '@/state/AppState';
import { color, layout, size, space, tier } from '@/theme';

/** How far below the top of the timeline the focused row sits. */
const FOCUS = 110;

/**
 * Today at a court. Bars on top; below, a timeline with later hours at the
 * top, earlier at the bottom and a NOW row between. Scrolling the timeline
 * moves the highlight on the bars; dragging across the bars scrolls the timeline.
 */
export function TodayTab({ court, onSeePlayers }: { court: CourtId; onSeePlayers: () => void }) {
  const { d, going, toggleGoing } = useApp();
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
      me: !past && !now && !!going[k],
      people: (now ? d.livePeople(court) : d.crowd(court, TODAY, i)).map(view),
      game: !past && !now ? d.gameAt(court, TODAY, i) : undefined,
    };
  });

  const scrollToRow = (i: number) => {
    const y = rowY.current[i];
    if (y == null) return;
    scroller.current?.scrollTo({ y: y >= FOCUS * 2 ? y - FOCUS : y / 2, animated: false });
  };

  // Open on NOW whenever the court changes.
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
    scrollToRow(Math.max(0, Math.min(HOURS - 1, Math.floor((e.nativeEvent.locationX / barsW.current) * HOURS))));
  };

  const h = hours[hi] ?? hours[NOW_HOUR];
  const n = h.people.length;
  const hl = hourLabel(7 + h.i);
  const caption = h.now
    ? 'Now · ' + (n ? n + ' on court' : 'Nobody on court')
    : hl.t + ' ' + hl.ap + ' · ' + (h.past ? (n ? n + ' checked in' : 'Quiet') : (n ? n + ' going' : 'Nobody yet') + (h.game ? ' · ' + h.game.title : ''));

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: space.xl, paddingHorizontal: space.gutter }}>
        <View
          onLayout={(e) => (barsW.current = e.nativeEvent.layout.width)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
          onResponderGrant={scrubAt}
          onResponderMove={scrubAt}
          accessibilityLabel="Hours today. Drag to scrub the timeline.">
          <View pointerEvents="none">
            <HourBars
              counts={hours.map((x) => x.people.length)}
              height={size.barChart}
              labels={hours.map((x) => (x.now ? 'Now' : [0, 4, 8, 13, 16].includes(x.i) ? hourLabel(7 + x.i).short : ''))}
              highlight={hi}
              outlineFuture
            />
          </View>
        </View>
        <Text t="meta" tint={color.inkMid} numberOfLines={1} style={{ marginTop: space.m }}>
          {caption}
        </Text>
      </View>
      <View style={{ flex: 1, marginTop: space.ml }}>
        <Rule />
        <PageScroll scrollRef={scroller} onScroll={onScroll} top={0} bottom={layout.timelineTail}>
          {[...hours].reverse().map((x) => (
            <View key={x.i} onLayout={(e) => (rowY.current[x.i] = e.nativeEvent.layout.y)}>
              {x.now ? (
                <NowBlock people={x.people} onMore={onSeePlayers} />
              ) : (
                <HourRow x={x} highlighted={x.i === hi} onToggle={() => toggleGoing(court, TODAY, x.i)} />
              )}
            </View>
          ))}
        </PageScroll>
      </View>
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
  let title: string;
  let sub = fn;
  if (x.game) {
    title = x.game.title;
    sub = x.game.fmt + ' · ' + n + ' of ' + x.game.cap + (fn ? ' · ' + fn : '');
  } else if (x.past) title = n ? n + ' checked in' : 'Quiet';
  else title = n ? n + ' going' : 'Nobody yet';
  return (
    <Row
      tone={highlighted ? 'highlight' : undefined}
      dim={x.past}
      leading={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
          <View style={{ width: size.timeLabel, flexDirection: 'row', alignItems: 'baseline', gap: space.xxxs }}>
            <Text t="statS" tint={highlighted ? color.ink : x.past ? color.faint : color.inkMid}>
              {lb.t}
            </Text>
            <Text t="micro" tint={color.faint}>
              {lb.ap}
            </Text>
          </View>
          {n > 0 ? <AvatarStack people={x.people} outline={color.bg} /> : null}
        </View>
      }
      title={
        x.game ? (
          <Text t="itemTitle" numberOfLines={1}>
            {title}
          </Text>
        ) : (
          title
        )
      }
      subtitle={sub || undefined}
      trailing={
        x.game ? (
          <Button label={x.me ? 'Joined' : 'Join'} kind={x.me ? 'light' : 'outline'} size="compact" onPress={onToggle} />
        ) : !x.past ? (
          <IconButton onPress={onToggle} label={x.me ? "You're going. Remove." : "I'm going"}>
            <IconSwap on={x.me} onIcon={<Text t="rowTitle">✓</Text>} offIcon={<Text t="rowTitle">+</Text>} />
          </IconButton>
        ) : null
      }
    />
  );
}

function NowBlock({ people, onMore }: { people: PlayerView[]; onMore: () => void }) {
  const n = people.length;
  const off = people[0]?.me ? 1 : 0;
  return (
    <View style={{ paddingTop: space.xl, paddingBottom: space.l }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: size.compact }}>
        <LiveDot halo />
        <Text t="eyebrow" tint={color.orangeInk}>
          Now
        </Text>
        {n ? (
          <Text t="rowSub" tint={color.orangeInk}>
            {n + ' on court'}
          </Text>
        ) : null}
        <Rule tint={color.orangeLine} flex />
      </View>
      {n ? (
        <View style={{ marginTop: space.s }}>
          {people.slice(0, 5).map((p, k) => {
            const t = tierOf(p.elo);
            return (
              <PlayerRow
                key={p.i}
                p={p}
                subtitle={t ? tier[t].name + ' · ' + p.elo : 'Unranked'}
                subtitleTint={t ? tier[t].ink : color.dim}
                trailing={
                  <Text t="rowSub" tint={color.muted}>
                    {p.me ? 'Now' : (sessionLengths[k - off] ?? '1m')}
                  </Text>
                }
              />
            );
          })}
          {n > 5 ? (
            <Tap onPress={onMore} style={{ height: size.compact, justifyContent: 'center' }}>
              <Text t="section" tint={color.muted}>
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
