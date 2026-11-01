import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

import { color, radius, size, space } from '@/theme';

import { Tap } from './controls';
import { Glow } from './Glow';
import { LiveDot } from './LiveDot';
import { Text } from './Text';

/**
 * Surface for a group that reads as one unit. Radius 16, surface fill,
 * 1pt border, 14pt padding. `glow` adds the sport or tier wash in the corner.
 */
export function Card({
  children,
  onPress,
  glow,
  edge = color.border,
  flush,
  label,
}: {
  children: ReactNode;
  onPress?: () => void;
  glow?: { rgb: string; alpha: number };
  /** Border color, e.g. a tier edge on the profile card. */
  edge?: string;
  /** No inner padding, for cards whose content runs to the edges (stat strips). */
  flush?: boolean;
  label?: string;
}) {
  const style: ViewStyle = {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: edge,
    backgroundColor: color.surface,
    padding: flush ? 0 : space.xl,
    overflow: 'hidden',
    // Depth: a hairline of light along the top edge, as in the V5 panels.
    boxShadow: `inset 0 1px 0 ${color.topHighlight}`,
  };
  const inner = (
    <>
      {glow ? <Glow rgb={glow.rgb} alpha={glow.alpha} /> : null}
      {children}
    </>
  );
  if (onPress)
    return (
      <Tap onPress={onPress} style={style} label={label}>
        {inner}
      </Tap>
    );
  return <View style={style}>{inner}</View>;
}

/**
 * List item. 56pt minimum height, 12pt between slots, hairline divider.
 * `tone="you"` marks your own row; `tone="highlight"` a focused row.
 */
export function Row({
  leading,
  title,
  subtitle,
  subtitleTint = color.muted,
  trailing,
  onPress,
  tone,
  divider = true,
  dim,
  wash,
}: {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: string;
  subtitleTint?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  tone?: 'you' | 'highlight';
  divider?: boolean;
  /** Past or inactive rows. */
  dim?: boolean;
  /** Background tint for emphasized rows, e.g. a top-5 tier wash. */
  wash?: string;
}) {
  const style: ViewStyle = {
    minHeight: size.row,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.l,
    // Tinted rows bleed to the gutter so the tint has room around the content.
    marginHorizontal: tone || wash ? -space.ml : 0,
    paddingHorizontal: tone || wash ? space.ml : 0,
    borderRadius: tone ? radius.control : 0,
    backgroundColor: tone === 'you' ? color.orangeSoft : tone === 'highlight' ? color.highlight : (wash ?? 'transparent'),
    borderBottomWidth: divider && !tone ? 1 : 0,
    borderBottomColor: color.line,
    opacity: dim ? 0.55 : 1,
  };
  const content = (
    <>
      {leading}
      <View style={{ flex: 1, minWidth: 0 }}>
        {typeof title === 'string' ? (
          <Text t="rowTitle" numberOfLines={1}>
            {title}
          </Text>
        ) : (
          title
        )}
        {subtitle ? (
          <Text t="rowSub" tint={subtitleTint} numberOfLines={1} style={{ marginTop: space.xxxs }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </>
  );
  if (onPress)
    return (
      <Tap onPress={onPress} style={style}>
        {content}
      </Tap>
    );
  return <View style={style}>{content}</View>;
}

/** Trailing number with a small label under it, right-aligned. */
export function RowValue({ value, label }: { value: string | number; label?: string }) {
  return (
    <View style={{ alignItems: 'flex-end' }}>
      <Text t="statS" upper={false}>
        {String(value)}
      </Text>
      {label ? (
        <Text t="micro" tint={color.faint} style={{ marginTop: space.xxs }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

/** A labeled group of content. 24pt above (except the first), 10pt label to content. */
export function Section({ title, action, children, first }: { title?: string; action?: ReactNode; children: ReactNode; first?: boolean }) {
  return (
    <View style={{ marginTop: first ? 0 : space.x5 }}>
      {title ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.ml }}>
          <Text t="section">{title}</Text>
          {action}
        </View>
      ) : null}
      {children}
    </View>
  );
}

/**
 * Numbers side by side in equal cells with dividers. `framed` draws its own
 * border (in a sheet); otherwise it sits at the bottom of a flush Card.
 */
export function StatStrip({
  items,
  framed,
  align = 'center',
}: {
  items: { value: string | number; label: string; tint?: string }[];
  framed?: boolean;
  align?: 'center' | 'start';
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: color.inset,
        borderTopWidth: 1,
        borderTopColor: color.divider,
        ...(framed ? { borderWidth: 1, borderColor: color.border, borderRadius: radius.panel } : null),
      }}>
      {items.map((it, j) => (
        <View
          key={it.label}
          style={{
            flex: 1,
            paddingVertical: space.l,
            paddingHorizontal: align === 'start' ? space.l : 0,
            alignItems: align === 'center' ? 'center' : 'flex-start',
            gap: space.xs,
            borderLeftWidth: j ? 1 : 0,
            borderLeftColor: color.divider,
          }}>
          <Text t={framed ? 'statL' : 'stat'} tint={it.tint} upper={false}>
            {String(it.value)}
          </Text>
          <Text t="micro" tint={color.muted}>
            {it.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** "• 5 LIVE" pill. Orange only when someone is on court. */
export function LivePill({ count }: { count: number }) {
  return (
    <View
      style={{
        height: 26,
        paddingHorizontal: space.ml,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: count ? color.orangeLine : color.dashed,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s,
      }}>
      {count ? <LiveDot /> : null}
      <Text variant="display" size={14} tint={count ? color.orangeInk : color.muted}>
        {String(count)}
      </Text>
      <Text t="micro" tint={color.muted}>
        Live
      </Text>
    </View>
  );
}

/** Small round marker, e.g. a sport dot. */
export function Dot({ tint, small }: { tint: string; small?: boolean }) {
  const d = small ? size.dotSm : size.dot;
  return <View style={{ width: d, height: d, borderRadius: radius.pill, backgroundColor: tint }} />;
}

/** A hairline rule. `flex` fills the remaining row space (e.g. the NOW line). */
export function Rule({ tint = color.divider, flex, gap }: { tint?: string; flex?: boolean; gap?: number }) {
  return <View style={{ height: 1, flex: flex ? 1 : undefined, backgroundColor: tint, marginVertical: gap }} />;
}

/** Thin progress track, filled to `pct` (0–100). */
export function ProgressBar({ pct, fill }: { pct: number; fill: string }) {
  return (
    <View style={{ height: size.progress, borderRadius: radius.pill, backgroundColor: color.track, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: `${Math.max(0, Math.min(100, pct))}%`, borderRadius: radius.pill, backgroundColor: fill }} />
    </View>
  );
}

/** Square tile holding a single glyph (W, L, check), as a row's leading mark. */
export function Glyph({ children, tint = color.ink }: { children: string; tint?: string }) {
  return (
    <View
      style={{
        width: size.compact,
        height: size.compact,
        borderRadius: radius.segWrap,
        backgroundColor: color.surface,
        borderWidth: 1,
        borderColor: color.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text t="statS" tint={tint}>
        {children}
      </Text>
    </View>
  );
}

/** A grouped list on a card surface (settings-style). Rows inside keep their hairlines. */
export function Group({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: color.border,
        backgroundColor: color.surface,
        paddingHorizontal: space.xl,
        overflow: 'hidden',
        boxShadow: `inset 0 1px 0 ${color.topHighlight}`,
      }}>
      {children}
    </View>
  );
}
