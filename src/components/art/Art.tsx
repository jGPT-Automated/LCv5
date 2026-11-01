import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import type { SportKey } from '@/mock/data';
import { color } from '@/theme';

/**
 * Brand illustrations, drawn in SVG from tokens so they stay sharp and on
 * palette. The language comes from localchecksports.com: a dark topographic
 * map, street blocks, an orange route that converges on a court, and rings
 * pulsing out from it (the check-in radius).
 */

/** Deterministic pseudo-random numbers so art renders the same every time. */
function rng(seed: number) {
  let x = seed;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x % 10000) / 10000;
  };
}

/** Wobbly closed loops around a point, like elevation lines. */
function contours(cx: number, cy: number, count: number, step: number, seed: number) {
  const out: string[] = [];
  for (let k = 1; k <= count; k++) {
    const r = k * step;
    let d = '';
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const wob = 1 + 0.12 * Math.sin(t * 3 + seed + k * 0.6) + 0.06 * Math.sin(t * 5 - k);
      const x = cx + Math.cos(t) * r * 1.25 * wob;
      const y = cy + Math.sin(t) * r * wob;
      d += (a ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    out.push(d + 'Z');
  }
  return out;
}

/** Small rotated blocks scattered off the route, like rooftops seen from above. */
function blocks(w: number, h: number, n: number, seed: number, avoid: (x: number, y: number) => boolean) {
  const r = rng(seed);
  const out: { x: number; y: number; w: number; h: number; a: number }[] = [];
  let tries = 0;
  while (out.length < n && tries < n * 8) {
    tries++;
    const x = r() * w;
    const y = r() * h;
    if (avoid(x, y)) continue;
    out.push({ x, y, w: 7 + r() * 9, h: 6 + r() * 7, a: -28 + r() * 10 });
  }
  return out;
}

/** An orange line with a soft glow under it. */
function Glowing({ d, width = 1.6 }: { d: string; width?: number }) {
  return (
    <G>
      <Path d={d} stroke={color.orange} strokeOpacity={0.16} strokeWidth={width * 6} fill="none" strokeLinecap="round" />
      <Path d={d} stroke={color.orange} strokeOpacity={0.35} strokeWidth={width * 2.6} fill="none" strokeLinecap="round" />
      <Path d={d} stroke={color.orange} strokeWidth={width} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Basketball court outline, centered on (0,0), drawn in orange. */
function MiniCourt({ w = 56, h = 34 }: { w?: number; h?: number }) {
  return (
    <G>
      <Rect x={-w / 2 - 4} y={-h / 2 - 4} width={w + 8} height={h + 8} fill={color.orange} fillOpacity={0.12} rx={2} />
      <Rect x={-w / 2} y={-h / 2} width={w} height={h} stroke={color.orange} strokeWidth={1.4} fill={color.bg} fillOpacity={0.6} />
      <Line x1={0} y1={-h / 2} x2={0} y2={h / 2} stroke={color.orange} strokeWidth={1} />
      <Circle cx={0} cy={0} r={h / 6} stroke={color.orange} strokeWidth={1} fill="none" />
      <Rect x={-w / 2} y={-h / 6} width={w / 6} height={h / 3} stroke={color.orange} strokeWidth={1} fill="none" />
      <Rect x={w / 2 - w / 6} y={-h / 6} width={w / 6} height={h / 3} stroke={color.orange} strokeWidth={1} fill="none" />
    </G>
  );
}

const W = 390;

/**
 * The hero map: contours, rooftops, routes converging on a court with rings.
 * Fills its box; the court sits at (cx, cy) as a fraction of the box.
 */
export function MapArt({ height, focus = [0.62, 0.52], rings = 3 }: { height: number; focus?: [number, number]; rings?: number }) {
  const id = useId().replace(/:/g, '');
  const H = 340;
  const cx = W * focus[0];
  const cy = H * focus[1];
  const routes = [
    `M${cx + 70} -20 C${cx + 40} 60 ${cx - 60} 70 ${cx - 10} ${cy - 40} S${cx} ${cy - 10} ${cx} ${cy}`,
    `M${cx} ${cy} C${cx + 60} ${cy + 10} ${cx + 110} ${cy - 30} ${W + 20} ${cy + 20}`,
    `M${cx} ${cy} C${cx - 10} ${cy + 60} ${cx - 70} ${cy + 80} ${cx - 90} ${H + 20}`,
  ];
  const nearRoute = (x: number, y: number) => Math.hypot(x - cx, y - cy) < 46;
  const roofs = blocks(W, H, 70, 7, nearRoute);
  return (
    <View style={{ height, width: '100%', overflow: 'hidden' }} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id={'hot' + id} cx={cx} cy={cy} r={170} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={color.orange} stopOpacity={0.16} />
            <Stop offset="1" stopColor={color.orange} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id={'fade' + id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color.bg} stopOpacity={0} />
            <Stop offset="0.75" stopColor={color.bg} stopOpacity={0} />
            <Stop offset="1" stopColor={color.bg} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width={W} height={H} fill={color.bg} />
        {contours(cx - 40, cy + 30, 11, 22, 1).map((d, k) => (
          <Path key={'c' + k} d={d} stroke={color.ink} strokeOpacity={0.045} strokeWidth={1} fill="none" />
        ))}
        {contours(40, 40, 6, 20, 4).map((d, k) => (
          <Path key={'d' + k} d={d} stroke={color.ink} strokeOpacity={0.035} strokeWidth={1} fill="none" />
        ))}
        {roofs.map((b, k) => (
          <Rect
            key={'b' + k}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={color.surface}
            stroke={color.ink}
            strokeOpacity={0.08}
            strokeWidth={0.6}
            transform={`rotate(${b.a} ${b.x} ${b.y})`}
          />
        ))}
        <Rect width={W} height={H} fill={`url(#hot${id})`} />
        {routes.map((d, k) => (
          <Glowing key={'r' + k} d={d} width={k ? 1.2 : 1.6} />
        ))}
        {Array.from({ length: rings }, (_, k) => (
          <Circle key={'ring' + k} cx={cx} cy={cy} r={34 + k * 22} stroke={color.orange} strokeOpacity={0.4 - k * 0.11} strokeWidth={1} fill="none" />
        ))}
        <G transform={`translate(${cx} ${cy}) rotate(-24)`}>
          <MiniCourt />
        </G>
        <Circle cx={cx + 56} cy={cy + 6} r={3.5} fill={color.orange} />
        <Circle cx={cx + 56} cy={cy + 6} r={9} stroke={color.orange} strokeOpacity={0.5} fill="none" />
        <Rect width={W} height={H} fill={`url(#fade${id})`} />
      </Svg>
    </View>
  );
}

/**
 * Auto check-in: the court inside its check-in circle, you arriving along the
 * route, and a ring around you that fills over the 5-minute hold.
 */
export function RadiusArt({ height }: { height: number }) {
  const id = useId().replace(/:/g, '');
  const H = 340;
  const cx = W / 2;
  const cy = 170;
  const R = 112;
  const you = { x: cx + R * 0.5, y: cy + R * 0.52 };
  // 5-minute hold, shown about two thirds done.
  const arc = (p: number, r: number) => {
    const a = p * Math.PI * 2 - Math.PI / 2;
    return `M${you.x} ${you.y - r} A${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${you.x + Math.cos(a) * r} ${you.y + Math.sin(a) * r}`;
  };
  return (
    <View style={{ height, width: '100%', overflow: 'hidden' }} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id={'zone' + id} cx={cx} cy={cy} r={R} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={color.orange} stopOpacity={0.12} />
            <Stop offset="1" stopColor={color.orange} stopOpacity={0.03} />
          </RadialGradient>
        </Defs>
        <Rect width={W} height={H} fill={color.bg} />
        {contours(cx, cy, 9, 24, 2).map((d, k) => (
          <Path key={k} d={d} stroke={color.ink} strokeOpacity={0.04} strokeWidth={1} fill="none" />
        ))}
        <Circle cx={cx} cy={cy} r={R} fill={`url(#zone${id})`} stroke={color.orange} strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="5 6" />
        <Glowing d={`M${W + 10} ${H - 10} C${W - 60} ${H - 30} ${you.x + 60} ${you.y + 40} ${you.x} ${you.y}`} width={1.2} />
        <G transform={`translate(${cx} ${cy}) rotate(-18)`}>
          <MiniCourt w={70} h={42} />
        </G>
        <Circle cx={you.x} cy={you.y} r={17} stroke={color.ink} strokeOpacity={0.12} strokeWidth={3} fill={color.bg} />
        <Path d={arc(0.68, 17)} stroke={color.orange} strokeWidth={3} strokeLinecap="round" fill="none" />
        <Circle cx={you.x} cy={you.y} r={5} fill={color.ink} />
      </Svg>
    </View>
  );
}

/** Notifications: a short stack of alert cards over the map texture. */
export function AlertArt({ height }: { height: number }) {
  const H = 340;
  const cards = [
    { y: 92, o: 1, w: 290, dot: true },
    { y: 166, o: 0.7, w: 270, dot: false },
    { y: 232, o: 0.4, w: 250, dot: false },
  ];
  return (
    <View style={{ height, width: '100%', overflow: 'hidden' }} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <Rect width={W} height={H} fill={color.bg} />
        {contours(W / 2, H / 2, 10, 22, 3).map((d, k) => (
          <Path key={k} d={d} stroke={color.ink} strokeOpacity={0.04} strokeWidth={1} fill="none" />
        ))}
        {cards.map((c, k) => {
          const x = (W - c.w) / 2;
          return (
            <G key={k} opacity={c.o}>
              <Rect x={x} y={c.y} width={c.w} height={56} rx={14} fill={color.surface} stroke={color.ink} strokeOpacity={0.1} />
              <Rect x={x + 12} y={c.y + 12} width={32} height={32} rx={9} fill={color.chip} stroke={c.dot ? color.orange : color.ink} strokeOpacity={c.dot ? 0.8 : 0.15} />
              <Rect x={x + 56} y={c.y + 15} width={c.w * 0.42} height={8} rx={4} fill={color.ink} fillOpacity={0.55} />
              <Rect x={x + 56} y={c.y + 31} width={c.w * 0.3} height={7} rx={3.5} fill={color.ink} fillOpacity={0.2} />
              {c.dot ? <Circle cx={x + c.w - 18} cy={c.y + 28} r={4} fill={color.orange} /> : null}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

/** The splash: logo mark lit from behind, with faint rings. */
export function SplashArt({ height }: { height: number }) {
  const id = useId().replace(/:/g, '');
  const H = 340;
  const cx = W / 2;
  const cy = H / 2;
  return (
    <View style={{ height, width: '100%', overflow: 'hidden' }} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id={'lit' + id} cx={cx} cy={cy} r={150} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={color.orange} stopOpacity={0.28} />
            <Stop offset="1" stopColor={color.orange} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={W} height={H} fill={color.bg} />
        <Rect width={W} height={H} fill={`url(#lit${id})`} />
        {[60, 92, 128].map((r, k) => (
          <Circle key={k} cx={cx} cy={cy} r={r} stroke={color.orange} strokeOpacity={0.3 - k * 0.08} fill="none" />
        ))}
        <G transform={`translate(${cx - 36} ${cy - 36}) scale(3)`}>
          <Path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" stroke={color.ink} strokeWidth={2} strokeLinecap="square" fill="none" />
          <Path d="m8 12.5 3 3 5.5-6.5" stroke={color.orange} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </G>
      </Svg>
    </View>
  );
}

/**
 * Court lines in a card's right side, fading out to the left, like the court
 * cards on localchecksports.com. Basketball: arc, key and circle. Pickleball:
 * baseline box, kitchen and center line.
 */
export function CourtArt({ sport, width = 210, height = 150 }: { sport: SportKey; width?: number; height?: number }) {
  const id = useId().replace(/:/g, '');
  const stroke = `url(#cf${id})`;
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: 0, right: 0 }} pointerEvents="none">
      <Defs>
        <LinearGradient id={'cf' + id} x1="1" y1="0" x2="0" y2="0">
          <Stop offset="0" stopColor={color.ink} stopOpacity={0.14} />
          <Stop offset="0.55" stopColor={color.ink} stopOpacity={0.05} />
          <Stop offset="1" stopColor={color.ink} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {sport === 'bb' ? (
        <G>
          <Circle cx={width + 30} cy={height / 2} r={height * 0.7} stroke={stroke} fill="none" />
          <Rect x={width - 60} y={height / 2 - 30} width={70} height={60} stroke={stroke} fill="none" />
          <Path d={`M${width - 60} ${height / 2 - 26} A26 26 0 0 0 ${width - 60} ${height / 2 + 26}`} stroke={stroke} fill="none" />
        </G>
      ) : (
        <G>
          <Rect x={width - 170} y={18} width={190} height={height - 36} stroke={stroke} fill="none" />
          <Line x1={width - 110} y1={18} x2={width - 110} y2={height - 18} stroke={stroke} />
          <Line x1={width - 50} y1={18} x2={width - 50} y2={height - 18} stroke={stroke} />
          <Line x1={width - 170} y1={height / 2} x2={width - 110} y2={height / 2} stroke={stroke} strokeDasharray="3 4" />
          <Line x1={width - 50} y1={height / 2} x2={width + 20} y2={height / 2} stroke={stroke} />
        </G>
      )}
    </Svg>
  );
}

