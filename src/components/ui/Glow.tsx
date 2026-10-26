import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * Soft color wash in a card corner, standing in for the design's CSS
 * `radial-gradient(… at 100% 0%, color, transparent 60%)`. Drawn with SVG so it
 * renders the same on iOS, Android and web.
 */
export function Glow({ rgb, alpha, rx = '120%', ry = '140%', stop = 0.6 }: { rgb: string; alpha: number; rx?: string; ry?: string; stop?: number }) {
  const id = 'g' + useId().replace(/:/g, '');
  const tint = `rgb(${rgb})`; // tokens-ok: rgb comes from a token's glowRGB
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx="100%" cy="0%" rx={rx} ry={ry} fx="100%" fy="0%" gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={tint} stopOpacity={alpha} />
          <Stop offset={stop} stopColor={tint} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
