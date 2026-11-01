import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Tap } from '@/components/ui/controls';
import { StatusCard } from '@/components/ui/StatusCard';
import { Text } from '@/components/ui/Text';
import type { PlayerView } from '@/mock/model';
import { color, radius, size, space } from '@/theme';

import { openPlayer } from './PlayerRow';

/**
 * An open run, on the same two-sided layout as a game card.
 * - `list` (basketball): spots fill in join order down both columns; when
 *   the run is full the columns become the two balanced teams.
 * - `pairs` (pickleball): the pair holding the court against the pair on
 *   now, then the line of pairs waiting.
 */
export function RunCard({
  title,
  status,
  note,
  live,
  sides,
  vs,
  line,
}: {
  title: string;
  status: string;
  note?: string;
  /** Orange band: you're in it, or it's happening now. */
  live?: boolean;
  /** Two columns of spots; `null` is an open spot. */
  sides: [(PlayerView | null)[], (PlayerView | null)[]];
  /** Label between the columns: "vs" once teams are set. */
  vs?: string;
  /** Pickleball: pairs waiting, in order. */
  line?: PlayerView[][];
}) {
  return (
    <StatusCard status={status} note={note} tone={live ? 'orange' : 'quiet'}>
      <Text t="title3" align="center">
        {title}
      </Text>
      <View style={{ flexDirection: 'row', marginTop: space.xl }}>
        <Column people={sides[0]} />
        <View style={{ width: size.button, alignItems: 'center', justifyContent: 'center' }}>
          {vs ? (
            <Text t="footnote" tint={color.faint}>
              {vs}
            </Text>
          ) : (
            <View style={{ flex: 1, width: 1, backgroundColor: color.divider }} />
          )}
        </View>
        <Column people={sides[1]} />
      </View>
      {line && line.length ? (
        <View style={{ marginTop: space.xl, paddingTop: space.l, borderTopWidth: 1, borderTopColor: color.divider, gap: space.m }}>
          <Text t="caption2" tint={color.muted}>
            Up next
          </Text>
          {line.map((pair, k) => (
            <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
              <Text t="headline" tint={color.faint} style={{ width: size.rankLabel }}>
                {String(k + 1)}
              </Text>
              {pair.map((p) => (
                <Spot key={p.i} p={p} />
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </StatusCard>
  );
}

function Column({ people }: { people: (PlayerView | null)[] }) {
  return (
    <View style={{ flex: 1, gap: space.m }}>
      {people.map((p, k) => (
        <Spot key={k} p={p} />
      ))}
    </View>
  );
}

/** One spot: a player (tap for their profile) or an open place. */
function Spot({ p }: { p: PlayerView | null }) {
  if (!p)
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: size.compact }}>
        <View style={{ width: size.compact - space.s * 2, height: size.compact - space.s * 2, borderRadius: radius.seg, borderWidth: 1, borderStyle: 'dashed', borderColor: color.dashed }} />
        <Text t="subhead" tint={color.faint}>
          Open
        </Text>
      </View>
    );
  return (
    <Tap onPress={() => openPlayer(p.i, !!p.me)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: size.compact }}>
      <Avatar p={p} size="s" />
      <Text t="subhead" tint={p.me ? color.orangeInk : color.ink} numberOfLines={1} style={{ flexShrink: 1 }}>
        {p.me ? 'You' : p.n}
      </Text>
    </Tap>
  );
}
