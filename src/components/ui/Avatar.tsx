import { View } from 'react-native';

import { tierOf, type PlayerView } from '@/mock/model';
import { color, space, tier } from '@/theme';

import { Text } from './Text';

/**
 * Player square. Initials only, no photos (privacy).
 * - Tier ring: ranked players only, colored by tier.
 * - Top 5: tier-tinted fill.
 * - Friend: white bar along the top edge.
 * - On court now: orange bar along the bottom edge.
 */
export type AvatarSize = 's' | 'm' | 'l' | 'xl';

const SIZES = {
  s: { w: 24, r: 7, fs: 8.5, bar: 2, ring: 1.5 },
  m: { w: 34, r: 9, fs: 11.5, bar: 3, ring: 2 },
  l: { w: 46, r: 12, fs: 15, bar: 3, ring: 2 },
  xl: { w: 76, r: 20, fs: 26, bar: 3, ring: 3 },
} as const;

type Props = {
  p: Partial<PlayerView> & { i: string };
  size: AvatarSize;
  /** Separation ring when avatars overlap in a stack. */
  outline?: string;
};

export function Avatar({ p, size, outline }: Props) {
  const z = SIZES[size];
  const t = tierOf(p.elo);
  const top = !!t && !!p.rank && p.rank <= 5;
  const square = (
    <View
      style={{
        width: z.w,
        height: z.w,
        borderRadius: z.r,
        borderWidth: t ? z.ring : 1,
        borderColor: t ? tier[t].ring : color.control,
        backgroundColor: top ? tier[t].top : color.chip,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {p.friend ? <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: z.bar, backgroundColor: color.ink }} /> : null}
      {p.live ? <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: z.bar, backgroundColor: color.orange }} /> : null}
      <Text variant="display" size={z.fs} track="slight">
        {p.i}
      </Text>
    </View>
  );
  if (!outline) return square;
  return <View style={{ padding: space.xxxs, margin: -space.xxxs, borderRadius: z.r + space.xxxs, backgroundColor: outline }}>{square}</View>;
}

/** Overlapping stack of small avatars, e.g. who's going at a time. */
export function AvatarStack({ people, outline, max = 3 }: { people: PlayerView[]; outline: string; max?: number }) {
  return (
    <View style={{ flexDirection: 'row', paddingLeft: space.xxxs }}>
      {people.slice(0, max).map((p, k) => (
        <View key={p.i + k} style={{ marginLeft: k ? -space.sm : 0, zIndex: max - k }}>
          <Avatar p={p} size="s" outline={outline} />
        </View>
      ))}
    </View>
  );
}
