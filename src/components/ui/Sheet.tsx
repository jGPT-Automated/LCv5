import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { color, layout, radius, space } from '@/theme';

/**
 * Bottom drawer.
 * - Springs up when opened.
 * - Drag down anywhere on it to dismiss: past 30% of its height, or a downward
 *   flick faster than 800 pt/s, closes it; otherwise it springs back.
 * - Dragging up rubber-bands instead of tearing away from the bottom edge.
 * - Tapping the scrim or the grab bar closes it.
 */
const SPRING = { damping: 30, stiffness: 320, mass: 0.9 };
const OFF = 1200;

export function Sheet({
  open,
  onClose,
  children,
  background,
  scrim = color.scrim,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Rendered behind the content, e.g. a <Glow />. */
  background?: ReactNode;
  scrim?: string;
}) {
  const [mounted, setMounted] = useState(open);
  const h = useSharedValue(OFF);
  const y = useSharedValue(OFF);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Re-opening: height is already known, so animate from just off-screen.
      if (h.value !== OFF) {
        y.value = h.value;
        y.value = withSpring(0, SPRING);
      }
    } else {
      y.value = withTiming(h.value, { duration: 220 }, (done) => {
        if (done) scheduleOnRN(setMounted, false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to open/close
  }, [open]);

  const onLayout = (e: LayoutChangeEvent) => {
    const first = h.value === OFF;
    h.value = e.nativeEvent.layout.height;
    if (first && open) {
      y.value = h.value;
      y.value = withSpring(0, SPRING);
    }
  };

  const pan = usePanGesture({
    activeOffsetY: [-8, 8],
    failOffsetX: [-24, 24],
    onUpdate: (e) => {
      'worklet';
      const t = e.translationY;
      y.value = t >= 0 ? t : t * 0.15;
    },
    onDeactivate: (e) => {
      'worklet';
      const shouldClose = y.value > h.value * 0.3 || e.velocityY > 800;
      if (shouldClose) {
        y.value = withSpring(h.value, { ...SPRING, velocity: e.velocityY });
        scheduleOnRN(onClose);
      } else {
        y.value = withSpring(0, { ...SPRING, velocity: e.velocityY });
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: interpolate(y.value, [0, h.value], [1, 0], 'clamp') }));

  if (!mounted) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: scrim }, scrimStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View
          onLayout={onLayout}
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: space.ml,
              paddingHorizontal: space.gutter,
              paddingBottom: layout.sheetBottom,
              backgroundColor: color.sheet,
              borderTopLeftRadius: radius.sheet,
              borderTopRightRadius: radius.sheet,
              borderTopWidth: 1,
              borderColor: color.borderStrong,
              overflow: 'hidden',
              boxShadow: `0 -30px 90px ${color.shadow}`,
            },
            sheetStyle,
          ]}>
          {background}
          <Pressable onPress={onClose} accessibilityLabel="Close" style={{ alignItems: 'center', paddingTop: space.xxxs, paddingBottom: space.xs }}>
            <View style={{ width: 36, height: 4, borderRadius: radius.pill, backgroundColor: color.grabber }} />
          </Pressable>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
