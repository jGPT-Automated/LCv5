import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import { color, PRESS_SCALE, radius, space, spring, sport as sportTokens, type FontSize } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

const APressable = Animated.createAnimatedComponent(Pressable);

type Feedback = keyof typeof haptic;

/**
 * Every tappable surface. Scales to 0.96 on press with a spring that
 * retargets if the finger lifts mid-press; disabled surfaces never scale.
 * `feedback` adds a haptic on press; `still` turns the scale off.
 */
export function Tap({
  onPress,
  style,
  children,
  disabled,
  hitSlop,
  feedback,
  still,
  label,
  role = 'button',
}: {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  children: ReactNode;
  disabled?: boolean;
  hitSlop?: number;
  feedback?: Feedback;
  still?: boolean;
  /** Accessibility label when the content isn't readable text. */
  label?: string;
  role?: 'button' | 'link' | 'tab' | 'switch' | 'radio';
}) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const scale = !still && !disabled && !!onPress;
  return (
    <APressable
      onPress={
        onPress
          ? () => {
              if (feedback) haptic[feedback]();
              onPress();
            }
          : undefined
      }
      onPressIn={scale ? () => (s.value = withSpring(PRESS_SCALE, spring.press)) : undefined}
      onPressOut={scale ? () => (s.value = withSpring(1, spring.press)) : undefined}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole={onPress ? role : undefined}
      accessibilityLabel={label}
      accessibilityState={disabled ? { disabled: true } : undefined}
      style={[style as ViewStyle, anim]}>
      {children}
    </APressable>
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
  feedback = 'tap',
}: {
  label: string;
  kind: ButtonKind;
  feedback?: Feedback;
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
      feedback={feedback}
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
export function IconButton({
  children,
  onPress,
  size = 34,
  r = radius.control,
  label,
}: {
  children: ReactNode;
  onPress?: () => void;
  size?: number;
  r?: number;
  label?: string;
}) {
  return (
    <Tap
      onPress={onPress}
      hitSlop={6}
      label={label}
      feedback="tap"
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
    <IconButton onPress={onPress} size={size} r={r} label={saved ? 'Remove from my courts' : 'Save to my courts'}>
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

/**
 * Segmented control. The selected pill glides between options on a layout
 * spring instead of jumping, and selection ticks a selection haptic.
 */
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
  const [frames, setFrames] = useState<Record<string, { x: number; w: number }>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const f = frames[value];
  useEffect(() => {
    if (!f) return;
    // First measurement snaps; later changes glide.
    if (w.value === 0) {
      x.value = f.x;
      w.value = f.w;
    } else {
      x.value = withSpring(f.x, spring.layout);
      w.value = withSpring(f.w, spring.layout);
    }
  }, [f, x, w]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }], width: w.value, opacity: w.value ? 1 : 0 }));
  const onLayout = (k: K) => (e: LayoutChangeEvent) => {
    const { x: lx, width } = e.nativeEvent.layout;
    setFrames((fr) => (fr[k]?.x === lx && fr[k]?.w === width ? fr : { ...fr, [k]: { x: lx, w: width } }));
  };
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        padding: space.xxs,
        borderRadius: radius.segWrap,
        backgroundColor: color.field,
        borderWidth: 1,
        borderColor: color.border,
      }}>
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: space.xxs, left: 0, height, borderRadius: radius.seg, backgroundColor: color.segOn }, pill]}
      />
      {options.map(([k, l]) => {
        const on = k === value;
        return (
          <Pressable
            key={k}
            onLayout={onLayout(k)}
            onPress={() => {
              if (!on) haptic.select();
              onChange(k);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{ flex: padX ? undefined : 1, paddingHorizontal: padX, height, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="label" size={size} weight="bold" tint={on ? color.ink : color.dim} track="label">
              {l}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** On/off switch. The thumb glides on a spring. */
export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  const x = useSharedValue(on ? 18 : 0);
  useEffect(() => {
    x.value = withSpring(on ? 18 : 0, spring.glide);
  }, [on, x]);
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <Pressable
      onPress={() => {
        haptic.select();
        onChange(!on);
      }}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: on }}
      hitSlop={8}
      style={{ width: 46, height: 28, padding: space.xxs, borderRadius: radius.pill, backgroundColor: on ? color.ink : color.grabber }}>
      <Animated.View style={[{ width: 22, height: 22, borderRadius: radius.pill, backgroundColor: on ? color.onBright : color.ink }, thumb]} />
    </Pressable>
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
