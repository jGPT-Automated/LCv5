import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Text } from '@/components/ui/Text';
import type { PlayerView } from '@/mock/model';
import { color, radius, size, space } from '@/theme';

/**
 * Your record against one player, as in the current app: both names with
 * ELO, the wins each side, who's up, a bar, then net ELO and last played.
 */
export function H2HCard({ you, them, w, l, net, last }: { you: PlayerView; them: PlayerView; w: number; l: number; net: number; last: string }) {
  const status = w + l === 0 ? 'First game' : w === l ? 'Tied' : w > l ? "You're up" : "You're down";
  const share = w + l ? w / (w + l) : 0.5;
  return (
    <View style={{ borderRadius: radius.hero, borderWidth: 1, borderColor: color.borderStrong, backgroundColor: color.surface, overflow: 'hidden' }}>
      <View style={{ padding: space.x3, gap: space.l }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text t="eyebrow" tint={color.muted}>
            {'You · ' + (you.elo ?? '–')}
          </Text>
          <Text t="eyebrow" tint={color.muted}>
            {them.n + ' · ' + (them.elo ?? '–')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.l }}>
          <Avatar p={you} size="l" />
          <Text t="statXL" upper={false} tint={w > l ? color.orange : color.faint}>
            {String(w)}
          </Text>
          <Text t="itemTitle" align="center" style={{ flex: 1 }}>
            {status}
          </Text>
          <Text t="statXL" upper={false} tint={l > w ? color.orange : color.faint}>
            {String(l)}
          </Text>
          <Avatar p={them} size="l" />
        </View>
        <View style={{ flexDirection: 'row', height: size.progress, gap: space.s }}>
          <View style={{ flex: share, borderRadius: radius.pill, backgroundColor: w >= l && w ? color.orange : color.track }} />
          <View style={{ flex: 1 - share, borderRadius: radius.pill, backgroundColor: l > w ? color.orange : color.track }} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: space.x3, paddingVertical: space.xl, borderTopWidth: 1, borderTopColor: color.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: space.s }}>
          <Text t="eyebrow" tint={color.muted}>
            Net ELO
          </Text>
          <Text t="statS" tint={net > 0 ? color.orangeInk : color.ink}>
            {(net > 0 ? '+' : net < 0 ? '−' : '') + Math.abs(net)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: space.s }}>
          <Text t="eyebrow" tint={color.muted}>
            Last played
          </Text>
          <Text t="statS">{last}</Text>
        </View>
      </View>
    </View>
  );
}
