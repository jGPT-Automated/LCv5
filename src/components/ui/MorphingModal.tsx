/**
 * Morphing Modal, ported from beUI Native (MIT, Copyright (c) 2026 beUI and
 * Saurabh, github.com/starc007/beui-native, src/components/morphing-modal).
 * Same springs, gestures and view transitions; Tailwind classes replaced with
 * our tokens, and drawn through our root overlay so it covers the tab bar.
 *
 * A card that rises from the bottom and springs to the height of each view
 * shown in it. Swipe it down or tap outside to close. Used for quick tasks
 * that shouldn't take over a whole page: logging a game from a profile,
 * starting a game from Schedule.
 */
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { usePresence } from '@/lib/usePresence';
import { useReducedMotionPreference } from '@/lib/useReducedMotion';
import { color, layout, radius, size, space } from '@/theme';

import { Icon } from './Icon';
import { useOverlay } from './Overlay';
import { Text } from './Text';

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const SPRING_OPEN = { stiffness: 380, damping: 38, mass: 0.8, reduceMotion: ReduceMotion.System } as const;
const SPRING_MORPH = { stiffness: 420, damping: 36, mass: 0.7, reduceMotion: ReduceMotion.System } as const;
const CLOSE = { duration: 220, easing: Easing.bezier(0.32, 0, 0.67, 0), reduceMotion: ReduceMotion.System } as const;
const VIEW_IN = { duration: 240, easing: EASE_OUT } as const;
const VIEW_OUT = { duration: 150, easing: EASE_OUT } as const;
const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 900;

const ModalContext = createContext<{ close: () => void } | null>(null);

export function MorphingModal({ view, onClose, children, label }: { view: string | null; onClose: () => void; children: ReactNode; label?: string }) {
  useOverlay(
    <ModalBody view={view} onClose={onClose} label={label}>
      {children}
    </ModalBody>,
  );
  return null;
}

function ModalBody({ view, onClose, children, label }: { view: string | null; onClose: () => void; children: ReactNode; label?: string }) {
  const reduce = useReducedMotionPreference();
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const open = view !== null;

  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);
  const shown = useRef(view);
  if (view !== null) shown.current = view;
  const latest = useRef(new Map<string, ReactNode>());
  if (view !== null) latest.current.set(view, children);
  const items = usePresence(present ? shown.current : null, children, () => VIEW_OUT.duration);

  const progress = useSharedValue(0);
  const drag = useSharedValue(0);
  const height = useSharedValue(0);
  const [measured, setMeasured] = useState(false);
  const measuredRef = useRef(false);

  const hide = useCallback(() => {
    latest.current.clear();
    setPresent(false);
    setMeasured(false);
    measuredRef.current = false;
    drag.value = 0;
  }, [drag]);

  useEffect(() => {
    if (!present) return;
    if (open) {
      if (!measured) return;
      progress.value = reduce ? withTiming(1, { duration: 160 }) : withSpring(1, SPRING_OPEN);
    } else {
      progress.value = withTiming(0, reduce ? { duration: 140 } : CLOSE, (done) => {
        if (done) scheduleOnRN(hide);
      });
    }
  }, [hide, measured, open, present, progress, reduce]);

  const onMeasure = useCallback(
    (next: number) => {
      if (!measuredRef.current) {
        height.value = next;
        measuredRef.current = true;
        setMeasured(true);
        return;
      }
      height.value = reduce ? next : withSpring(next, SPRING_MORPH);
    },
    [height, reduce],
  );

  const close = useCallback(() => {
    if (open) onClose();
  }, [onClose, open]);

  const travel = window.height * 0.6;
  const pan = Gesture.Pan()
    .enabled(open)
    .activeOffsetY(10)
    .failOffsetX([-16, 16])
    .onUpdate((e) => {
      drag.value = e.translationY > 0 ? e.translationY : -Math.sqrt(-e.translationY) * 3;
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) scheduleOnRN(close);
      else drag.value = withSpring(0, SPRING_OPEN);
    });

  const panelStyle = useAnimatedStyle(() => {
    const p = progress.value;
    if (reduce) return { opacity: p, transform: [{ translateY: drag.value }] };
    return {
      opacity: Math.min(1, p * 2),
      transform: [{ translateY: (1 - p) * travel + Math.max(-40, drag.value) }, { scale: 0.96 + 0.04 * Math.min(1, p) }],
    };
  }, [reduce, travel]);
  const sizeStyle = useAnimatedStyle(() => ({ height: height.value }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, progress.value) * (1 - Math.min(0.6, Math.max(0, drag.value) / 400)) }));

  if (!present) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: color.scrimHeavy }, scrimStyle]}>
        <Pressable accessibilityLabel="Close" accessibilityRole="button" style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: space.l, paddingBottom: Math.max(space.l, insets.bottom - space.gutter) }}>
        <GestureDetector gesture={pan}>
          <Animated.View
            accessibilityViewIsModal
            accessibilityLabel={label}
            style={[
              {
                width: '100%',
                maxWidth: layout.maxWebWidth,
                borderRadius: radius.modal,
                borderCurve: 'continuous',
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: color.borderStrong,
                backgroundColor: color.sheet,
              },
              panelStyle,
            ]}>
            <ModalContext.Provider value={{ close }}>
              <Animated.View style={[{ overflow: 'hidden' }, sizeStyle]}>
                {items.map((item) => (
                  <ViewLayer key={item.key} appear={item.appear && measured} exiting={item.exiting} reduce={reduce} onMeasure={item.exiting ? undefined : onMeasure}>
                    {latest.current.get(item.key) ?? item.value}
                  </ViewLayer>
                ))}
              </Animated.View>
            </ModalContext.Provider>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

function ViewLayer({ appear, exiting, reduce, onMeasure, children }: { appear: boolean; exiting: boolean; reduce: boolean; onMeasure?: (h: number) => void; children: ReactNode }) {
  const shown = useSharedValue(appear ? 0 : 1);
  useEffect(() => {
    shown.value = withTiming(exiting ? 0 : 1, exiting ? VIEW_OUT : VIEW_IN);
  }, [exiting, shown]);
  const style = useAnimatedStyle(() => {
    const p = shown.value;
    if (reduce) return { opacity: p };
    const offset = exiting ? -10 : 10;
    return { opacity: p, transform: [{ translateY: (1 - p) * offset }, { scale: 0.98 + 0.02 * p }] };
  }, [exiting, reduce]);
  return (
    <Animated.View
      pointerEvents={exiting ? 'none' : 'auto'}
      accessibilityElementsHidden={exiting}
      importantForAccessibility={exiting ? 'no-hide-descendants' : 'auto'}
      onLayout={({ nativeEvent }) => onMeasure?.(nativeEvent.layout.height)}
      style={[{ position: 'absolute', top: 0, left: 0, right: 0, padding: space.gutter }, style]}>
      {children}
    </Animated.View>
  );
}

/** The top row of a view: optional back, the title, and close. */
export function MorphingModalHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const ctx = useContext(ModalContext);
  const btn = (label: string, onPress: () => void, glyph: 'chevronLeft' | 'close') => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => ({
        width: size.modalButton,
        height: size.modalButton,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? color.control : color.highlight,
      })}>
      <Icon name={glyph} size={14} tint={color.muted} />
    </Pressable>
  );
  return (
    <View style={{ minHeight: size.modalButton, flexDirection: 'row', alignItems: 'center', gap: space.l, marginBottom: space.xxl }}>
      {onBack ? btn('Back', onBack, 'chevronLeft') : null}
      <Text t="headline" numberOfLines={1} style={{ flex: 1 }}>
        {title}
      </Text>
      {btn('Close', () => ctx?.close(), 'close')}
    </View>
  );
}
