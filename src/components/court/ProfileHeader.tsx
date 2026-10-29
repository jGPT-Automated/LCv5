import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { StatStrip } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import type { PlayerView } from '@/mock/model';
import { color, space } from '@/theme';

/**
 * The top of a profile, as in the current app: avatar, name and where they
 * play on the left, ELO on the right, three numbers underneath.
 */
export function ProfileHeader({ p, name, meta, metaTint, stats }: { p: PlayerView; name: string; meta: string; metaTint?: string; stats: { value: string | number; label: string }[] }) {
  return (
    <View style={{ gap: space.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xl }}>
        <Avatar p={p} size="xl" />
        <View style={{ flex: 1, minWidth: 0, gap: space.xs }}>
          <Text t="hero" numberOfLines={1}>
            {name}
          </Text>
          <Text t="caption" weight="medium" tint={metaTint ?? color.muted} numberOfLines={1}>
            {meta}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text t="statL">{p.elo ? String(p.elo) : '–'}</Text>
          <Text t="micro" tint={color.muted} style={{ marginTop: space.xs }}>
            ELO
          </Text>
        </View>
      </View>
      <StatStrip framed items={stats} />
    </View>
  );
}
