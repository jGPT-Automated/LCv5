import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { color, radius } from '@/theme';

/** Pulsing orange dot. `halo` adds the soft ring used on headline counts. */
export function LiveDot({ size = 6, halo = false }: { size?: number; halo?: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [t]);
  const anim = useAnimatedStyle(() => ({ opacity: 0.75 + 0.25 * t.value, transform: [{ scale: 0.88 + 0.2 * t.value }] }));
  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: color.orange,
          boxShadow: halo ? `0 0 0 4px ${color.orangeHalo}, 0 0 12px ${color.orangeGlow}` : undefined,
        },
        anim,
      ]}
    />
  );
}
