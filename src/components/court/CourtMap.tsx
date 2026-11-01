import { View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { Tap } from '@/components/ui/controls';
import { Glow } from '@/components/ui/Glow';
import { Text } from '@/components/ui/Text';
import { courtIds, courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, radius, space, sport } from '@/theme';

/**
 * Map of courts with pins sized by who's on court. Placeholder street
 * texture for now; the real map comes in its own chunk.
 */
export function CourtMap({ onPick }: { onPick: (c: CourtId) => void }) {
  const { d } = useApp();
  return (
    <View style={{ flex: 1, borderTopWidth: 1, borderTopColor: color.divider, backgroundColor: color.quiet, overflow: 'hidden' }}>
      <Glow rgb={sport.bb.glowRGB} alpha={0.12} rx="60%" ry="50%" stop={0.7} />
      <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} width="100%" height="100%" pointerEvents="none">
        <Defs>
          <Pattern id="streetsA" width={41} height={41} patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
            <Line x1={40} y1={0} x2={40} y2={41} stroke={color.ink} strokeOpacity={0.04} strokeWidth={1} />
          </Pattern>
          <Pattern id="streetsB" width={53} height={53} patternUnits="userSpaceOnUse" patternTransform="rotate(147)">
            <Line x1={52} y1={0} x2={52} y2={53} stroke={color.ink} strokeOpacity={0.035} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#streetsA)" />
        <Rect width="100%" height="100%" fill="url(#streetsB)" />
      </Svg>
      {courtIds.map((id) => {
        const c = courts[id];
        const n = d.liveCount(id);
        const pin = n ? 28 : 16;
        return (
          <Tap
            key={id}
            onPress={() => onPick(id)}
            label={c.name + ', ' + n + ' on court'}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
              alignItems: 'center',
              gap: space.s,
            }}>
            <View
              style={{
                minWidth: pin,
                height: pin,
                paddingHorizontal: space.s,
                borderRadius: radius.pill,
                backgroundColor: n ? color.orange : sport[c.sport].dot,
                borderWidth: 2,
                borderColor: color.bg,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: n ? `0 0 0 7px ${color.orangeRing}, 0 10px 35px ${color.shadow}` : `0 6px 18px ${color.shadow}`,
              }}>
              {n ? (
                <Text variant="display" size={13} tint={color.onBright}>
                  {String(n)}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                paddingVertical: space.xxs,
                paddingHorizontal: space.sm,
                borderRadius: radius.pill,
                backgroundColor: color.pillBg,
                borderWidth: 1,
                borderColor: color.borderStrong,
              }}>
              <Text t="micro" numberOfLines={1}>
                {c.name}
              </Text>
            </View>
          </Tap>
        );
      })}
    </View>
  );
}
