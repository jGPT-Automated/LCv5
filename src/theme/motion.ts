import { Easing, ReduceMotion } from 'react-native-reanimated';

/**
 * Motion tokens. Springs are beUI Native's (MIT, github.com/starc007/beui-native,
 * src/styles/motion.ts) so presses, glides and swaps feel like one family.
 * Values that disagree with Jakub Krehel's polish rules follow the rules:
 * press scale is 0.96 (not beUI's 0.93) and nothing bounces past its target.
 *
 * Every spring follows the system Reduce Motion setting.
 */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_STANDARD = Easing.bezier(0.2, 0, 0, 1);

export const spring = {
  /** Press feedback on tappable surfaces. */
  press: { stiffness: 500, damping: 30, mass: 0.6, reduceMotion: ReduceMotion.System },
  /** Content swaps inside a control: icon or label trading places. */
  swap: { stiffness: 460, damping: 30, mass: 0.55, reduceMotion: ReduceMotion.System },
  /** Indicators and panels gliding between positions. */
  layout: { stiffness: 360, damping: 32, mass: 0.6, reduceMotion: ReduceMotion.System },
  /** Dragged handles; critically damped so values never rebound off an end. */
  glide: { stiffness: 700, damping: 50, mass: 0.5, reduceMotion: ReduceMotion.System },
  /** Sheets settling after a drag. */
  sheet: { stiffness: 320, damping: 30, mass: 0.9, reduceMotion: ReduceMotion.System },
} as const;

export const timing = {
  /** High-frequency feedback (tab switch, row highlight): 150ms or less. */
  fast: { duration: 150, easing: EASE_OUT, reduceMotion: ReduceMotion.System },
  /** Infrequent entrances: 300ms ease-out. */
  enter: { duration: 300, easing: EASE_OUT, reduceMotion: ReduceMotion.System },
  /** Exits are shorter than entrances. */
  exit: { duration: 160, easing: EASE_OUT, reduceMotion: ReduceMotion.System },
} as const;

/** Pressed surfaces scale to this. Never below 0.95. */
export const PRESS_SCALE = 0.96;
/** Entrance offset and stagger for staged reveals (title, body, actions). */
export const ENTER_Y = 12;
export const STAGGER_MS = 100;
