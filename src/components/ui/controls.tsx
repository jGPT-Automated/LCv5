import type { ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { color, radius, space, sport as sportTokens, type FontSize } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

/** Shared press feedback: a quick dim, no ripple. */
export function Tap({
  onPress,
  style,
  children,
  disabled,
  hitSlop,
}: {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  children: ReactNode;
  disabled?: boolean;
  hitSlop?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={({ pressed }) => [style as ViewStyle, pressed && !disabled ? { opacity: 0.7 } : null]}>
      {children}
    </Pressable>
  );
}

type ButtonKind = 'orange' | 'light' | 'outline' | 'ghost' | 'dark' | 'here';

const KIND: Record<ButtonKind, { bg: string; border: string; ink: string; borderWidth: number }> = {
  orange: { bg: color.orange, border: color.orange, ink: color.onBright, borderWidth: 1 },
  light: { bg: color.ink, border: color.ink, ink: color.onBright, borderWidth: 1 },
  outline: { bg: 'transparent', border: color.ink, ink: color.ink, borderWidth: 1 },
  ghost: { bg: 'transparent', border: color.controlStrong, ink: color.ink, borderWidth: 1 },
  dark: { bg: color.bg, border: color.bg, ink: color.ink, borderWidth: 1 },
  here: { bg: 'transparent', border: color.orangeEdge, ink: color.orangeInk, borderWidth: 1.5 },
};

/** Rectangular action button (radius 4), uppercase tracked label. */
export function Button({
  label,
  kind,
  height = 44,
  size = 10.5,
  onPress,
  disabled,
  icon,
  grow,
  padX = space.xl,
}: {
  label: string;
  kind: ButtonKind;
  height?: number;
  size?: FontSize;
  onPress?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  grow?: boolean;
  padX?: number;
}) {
  const k = KIND[kind];
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      style={{
        height,
        flex: grow ? 1 : undefined,
        paddingHorizontal: padX,
        borderRadius: radius.button,
        backgroundColor: k.bg,
        borderWidth: k.borderWidth,
        borderColor: k.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space.sm,
        opacity: disabled ? 0.35 : 1,
      }}>
      {icon}
      <Text variant="label" size={size} tint={k.ink} numberOfLines={1}>
        {label}
      </Text>
    </Tap>
  );
}

/** Square outlined icon button, e.g. the bookmark. */
export function IconButton({ children, onPress, size = 34, r = radius.control }: { children: ReactNode; onPress?: () => void; size?: number; r?: number }) {
  return (
    <Tap
      onPress={onPress}
      hitSlop={6}
      style={{ width: size, height: size, borderRadius: r, borderWidth: 1, borderColor: color.control, alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </Tap>
  );
}

export function BookmarkButton({
  saved,
  onPress,
  size = 34,
  iconSize = 14,
  r,
}: {
  saved: boolean;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  r?: number;
}) {
  return (
    <IconButton onPress={onPress} size={size} r={r}>
      <Icon name="bookmark" size={iconSize} fill={saved ? color.ink : 'none'} />
    </IconButton>
  );
}

/** Pill with sport dot, e.g. "• BASKETBALL". */
export function SportTag({ sport }: { sport: keyof typeof sportTokens }) {
  const sp = sportTokens[sport];
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          height: 20,
          paddingHorizontal: space.m,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: sp.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.s,
        }}>
        <View style={{ width: 5, height: 5, borderRadius: radius.pill, backgroundColor: sp.dot }} />
        <Text variant="label" size={8} tint={sp.ink} track="caps">
          {sp.label}
        </Text>
      </View>
    </View>
  );
}

/** Segmented control. */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
  height = 32,
  size = 9.5,
  padX,
}: {
  options: [K, string][];
  value: K;
  onChange: (k: K) => void;
  height?: number;
  size?: FontSize;
  padX?: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: space.xxs,
        borderRadius: radius.segWrap,
        backgroundColor: color.field,
        borderWidth: 1,
        borderColor: color.border,
      }}>
      {options.map(([k, l]) => {
        const on = k === value;
        return (
          <Tap
            key={k}
            onPress={() => onChange(k)}
            style={{
              flex: padX ? undefined : 1,
              paddingHorizontal: padX,
              height,
              borderRadius: radius.seg,
              backgroundColor: on ? color.segOn : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text variant="label" size={size} weight="bold" tint={on ? color.ink : color.dim} track="label">
              {l}
            </Text>
          </Tap>
        );
      })}
    </View>
  );
}

/** Dashed empty-state row, e.g. "Nobody on court yet". */
export function EmptyRow({ children }: { children: string }) {
  return (
    <View
      style={{
        height: 48,
        paddingHorizontal: space.xl,
        justifyContent: 'center',
        borderRadius: radius.empty,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: color.dashed,
      }}>
      <Text size={12} weight="medium" tint={color.muted}>
        {children}
      </Text>
    </View>
  );
}

/** Section heading, e.g. "SAVED · 3". */
export function SectionLabel({ children, style }: { children: string; style?: ViewStyle }) {
  return (
    <View style={style}>
      <Text variant="label" size={10}>
        {children}
      </Text>
    </View>
  );
}
