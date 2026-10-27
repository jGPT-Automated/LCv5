import { Easing, ReduceMotion } from 'react-native-reanimated';

/**
 * Motion tokens. Used only by components, on the interactions listed in
 * docs/DESIGN.md "Motion". Springs follow beUI Native's tuning
 * (github.com/starc007/beui-native, src/styles/motion.ts); press scale and
 * icon-swap values follow Jakub Krehel's polish rules (0.96, no bounce).
 * Everything respects the system Reduce Motion setting.
 */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const spring = {
  /** Press feedback on key actions. Fast and firm, no overshoot. */
  press: { stiffness: 500, damping: 30, mass: 0.6, reduceMotion: ReduceMotion.System },
  /** A selection highlight gliding to a new option. */
  layout: { stiffness: 360, damping: 32, mass: 0.6, reduceMotion: ReduceMotion.System },
  /** An icon or label swapping state: 300ms, no bounce. */
  swap: { duration: 300, dampingRatio: 1, reduceMotion: ReduceMotion.System },
  /** Sheets settling after a drag; carries the release velocity. */
  sheet: { stiffness: 320, damping: 30, mass: 0.9, reduceMotion: ReduceMotion.System },
} as const;

export const timing = {
  /** Header easing to orange on check-in, and back. */
  header: { duration: 300, easing: EASE_OUT, reduceMotion: ReduceMotion.System },
  /** Sheet closing without a drag. */
  exit: { duration: 200, easing: EASE_OUT, reduceMotion: ReduceMotion.System },
  /** A digit rolling to a new value. */
  digit: { duration: 900, easing: EASE_OUT, reduceMotion: ReduceMotion.System },
  /** Staged entrance for rare moments (success, empty states). */
  enter: { duration: 300, easing: EASE_OUT, reduceMotion: ReduceMotion.System },
} as const;

/** Key actions scale to this while pressed. Never below 0.95. */
export const PRESS_SCALE = 0.96;
/** Icon swaps start from this scale. */
export const SWAP_FROM = 0.25;
/** Staged entrances rise this far and step by this much. */
export const ENTER_Y = 12;
export const STAGGER_MS = 100;
