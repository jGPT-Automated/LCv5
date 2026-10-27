import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, Switch as RNSwitch, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import { color, PRESS_SCALE, radius, size, space, spring, sport as sportTokens, SWAP_FROM, type FontSize } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

const APressable = Animated.createAnimatedComponent(Pressable);

type Feedback = keyof typeof haptic;

type TapProps = {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  children: ReactNode;
  disabled?: boolean;
  hitSlop?: number;
  feedback?: Feedback;
  /** Accessibility label when the content isn't readable text. */
  label?: string;
  role?: 'button' | 'link' | 'tab' | 'switch' | 'radio';
  selected?: boolean;
};

const a11y = (p: TapProps) => ({
  accessibilityRole: p.onPress ? (p.role ?? 'button') : undefined,
  accessibilityLabel: p.label,
  accessibilityState: { disabled: !!p.disabled, selected: p.selected },
});

const run = (p: TapProps) =>
  p.onPress
    ? () => {
        if (p.feedback) haptic[p.feedback]();
        p.onPress?.();
      }
    : undefined;

/**
 * Every routine tappable surface: rows, chips, links. Instant dim while
 * pressed, nothing else (docs/DESIGN.md, Motion).
 */
export function Tap(p: TapProps) {
  return (
    <Pressable
      {...a11y(p)}
      onPress={run(p)}
      disabled={p.disabled}
      hitSlop={p.hitSlop}
      style={({ pressed }) => [p.style as ViewStyle, pressed && p.onPress && !p.disabled ? { opacity: 0.6 } : null]}>
      {p.children}
    </Pressable>
  );
}

/**
 * Key actions only (check in, post, confirm, join). Scales to 0.96 on a
 * firm spring and comes back the moment the finger lifts. Disabled never scales.
 */
export function PressScale(p: TapProps) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const live = !!p.onPress && !p.disabled;
  return (
    <APressable
      {...a11y(p)}
      onPress={run(p)}
      disabled={p.disabled}
      hitSlop={p.hitSlop}
      onPressIn={live ? () => (s.value = withSpring(PRESS_SCALE, spring.press)) : undefined}
      onPressOut={live ? () => (s.value = withSpring(1, spring.press)) : undefined}
      style={[p.style as ViewStyle, anim]}>
      {p.children}
    </APressable>
  );
}

type ButtonKind = 'orange' | 'light' | 'outline' | 'ghost' | 'dark' | 'here';

const KIND: Record<ButtonKind, { bg: string; border: string; ink: string; borderWidth: number; key: boolean }> = {
  orange: { bg: color.orange, border: color.orange, ink: color.onBright, borderWidth: 1, key: true },
  light: { bg: color.ink, border: color.ink, ink: color.onBright, borderWidth: 1, key: true },
  outline: { bg: 'transparent', border: color.ink, ink: color.ink, borderWidth: 1, key: true },
  ghost: { bg: 'transparent', border: color.controlStrong, ink: color.ink, borderWidth: 1, key: false },
  dark: { bg: color.bg, border: color.bg, ink: color.ink, borderWidth: 1, key: true },
  here: { bg: 'transparent', border: color.orangeEdge, ink: color.orangeInk, borderWidth: 1.5, key: false },
};

const BUTTON_SIZE = {
  compact: { height: size.compact, text: 9.5 as FontSize, padX: space.l },
  regular: { height: size.button, text: 10.5 as FontSize, padX: space.xl },
  large: { height: size.large, text: 11 as FontSize, padX: space.xl },
};

/**
 * Action button. Kinds and when to use them: docs/DESIGN.md, Buttons.
 * Commit kinds (orange, light, outline, dark) get the press scale; the rest dim.
 */
export function Button({
  label,
  kind,
  size: sz = 'regular',
  onPress,
  disabled,
  icon,
  grow,
  feedback,
}: {
  label: string;
  kind: ButtonKind;
  size?: keyof typeof BUTTON_SIZE;
  onPress?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  grow?: boolean;
  feedback?: Feedback;
}) {
  const k = KIND[kind];
  const z = BUTTON_SIZE[sz];
  const Surface = k.key ? PressScale : Tap;
  return (
    <Surface
      onPress={onPress}
      disabled={disabled}
      feedback={feedback ?? (k.key ? 'tap' : undefined)}
      label={label}
      style={{
        height: z.height,
        flex: grow ? 1 : undefined,
        paddingHorizontal: z.padX,
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
      <Text variant="label" size={z.text} tint={k.ink} numberOfLines={1}>
        {label}
      </Text>
    </Surface>
  );
}

/** Square outlined icon button, 36pt. One size everywhere. */
export function IconButton({ children, onPress, label }: { children: ReactNode; onPress?: () => void; label: string }) {
  return (
    <Tap
      onPress={onPress}
      hitSlop={6}
      label={label}
      style={{
        width: size.compact,
        height: size.compact,
        borderRadius: radius.control,
        borderWidth: 1,
        borderColor: color.control,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </Tap>
  );
}

/**
 * Two states of an icon, cross-faded: the incoming one scales up from 0.25
 * while the outgoing one shrinks away, 300ms, no bounce. The first render
 * doesn't animate.
 */
export function IconSwap({ on, onIcon, offIcon }: { on: boolean; onIcon: ReactNode; offIcon: ReactNode }) {
  const t = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    t.value = withSpring(on ? 1 : 0, spring.swap);
  }, [on, t]);
  const inStyle = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ scale: SWAP_FROM + (1 - SWAP_FROM) * t.value }] }));
  const outStyle = useAnimatedStyle(() => ({ opacity: 1 - t.value, transform: [{ scale: 1 - (1 - SWAP_FROM) * t.value }] }));
  return (
    <View>
      <Animated.View style={outStyle}>{offIcon}</Animated.View>
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }, inStyle]}>
        {onIcon}
      </Animated.View>
    </View>
  );
}

/** Save a court to My courts. The fill cross-fades in when saved. */
export function BookmarkButton({ saved, onPress }: { saved: boolean; onPress: () => void }) {
  return (
    <IconButton
      onPress={() => {
        haptic.tap();
        onPress();
      }}
      label={saved ? 'Remove from my courts' : 'Save to my courts'}>
      <IconSwap on={saved} onIcon={<Icon name="bookmark" size={15} fill={color.ink} />} offIcon={<Icon name="bookmark" size={15} />} />
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
        <View style={{ width: size.dotSm, height: size.dotSm, borderRadius: radius.pill, backgroundColor: sp.dot }} />
        <Text variant="label" size={8} tint={sp.ink} track="caps">
          {sp.label}
        </Text>
      </View>
    </View>
  );
}

/** Tracks each option's frame so a highlight can glide between them. */
function useGlide<K extends string>(value: K) {
  const [frames, setFrames] = useState<Record<string, { x: number; w: number }>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const f = frames[value];
  useEffect(() => {
    if (!f) return;
    // The first measurement places the highlight without animating.
    if (w.value === 0) {
      x.value = f.x;
      w.value = f.w;
    } else {
      x.value = withSpring(f.x, spring.layout);
      w.value = withSpring(f.w, spring.layout);
    }
  }, [f, x, w]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }], width: w.value, opacity: w.value ? 1 : 0 }));
  const measure = (k: K) => (e: LayoutChangeEvent) => {
    const { x: lx, width } = e.nativeEvent.layout;
    setFrames((fr) => (fr[k]?.x === lx && fr[k]?.w === width ? fr : { ...fr, [k]: { x: lx, w: width } }));
  };
  return { style, measure };
}

/** Segmented control. The selected pill glides to the new option. */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
  compact,
}: {
  options: [K, string][];
  value: K;
  onChange: (k: K) => void;
  /** Header-sized: hugs its labels instead of filling the width. */
  compact?: boolean;
}) {
  const glide = useGlide(value);
  const h = compact ? size.segment - 2 : size.segment;
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
        style={[{ position: 'absolute', top: space.xxs, left: 0, height: h, borderRadius: radius.seg, backgroundColor: color.segOn }, glide.style]}
      />
      {options.map(([k, l]) => {
        const on = k === value;
        return (
          <Pressable
            key={k}
            onLayout={glide.measure(k)}
            onPress={() => {
              if (!on) haptic.select();
              onChange(k);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{ flex: compact ? undefined : 1, paddingHorizontal: compact ? space.xl : 0, height: h, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="label" size={compact ? 9 : 9.5} weight="bold" tint={on ? color.ink : color.dim} track="label">
              {l}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Underlined tabs across the full width. The underline glides to the new tab. */
export function Tabs<K extends string>({ options, value, onChange }: { options: [K, string][]; value: K; onChange: (k: K) => void }) {
  const glide = useGlide(value);
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: color.divider }}>
      {options.map(([k, l]) => {
        const on = k === value;
        return (
          <Pressable
            key={k}
            onLayout={glide.measure(k)}
            onPress={() => {
              if (!on) haptic.select();
              onChange(k);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{ flex: 1, height: size.tab, alignItems: 'center', justifyContent: 'center' }}>
            <Text t="section" tint={on ? color.ink : color.faint}>
              {l}
            </Text>
          </Pressable>
        );
      })}
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 0, bottom: -1, height: 2, backgroundColor: color.ink }, glide.style]} />
    </View>
  );
}

/** On/off switch: the platform switch, orange when on. */
export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <RNSwitch
      value={on}
      onValueChange={(v) => {
        haptic.select();
        onChange(v);
      }}
      accessibilityLabel={label}
      trackColor={{ false: color.grabber, true: color.orange }}
      thumbColor={color.ink}
      ios_backgroundColor={color.grabber}
      {
        ...{ activeThumbColor: color.ink } /* web only: react-native-web tints the thumb otherwise */
      }
    />
  );
}

/** Dashed empty-state row: one plain sentence. */
export function EmptyRow({ children }: { children: string }) {
  return (
    <View
      style={{
        height: size.empty,
        paddingHorizontal: space.xl,
        justifyContent: 'center',
        borderRadius: radius.empty,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: color.dashed,
      }}>
      <Text t="caption" weight="medium" tint={color.muted}>
        {children}
      </Text>
    </View>
  );
}
