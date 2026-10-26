import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { color } from '@/theme';

/** Icons drawn exactly as in the LCPhoneV5 design file. */
export type IconName = 'check' | 'chevronDown' | 'chevronLeft' | 'bookmark' | 'search' | 'home' | 'calendar' | 'trophy' | 'map' | 'user' | 'gear';

type Props = { name: IconName; size?: number; tint?: string; fill?: string; strokeWidth?: number };

export function Icon({ name, size = 22, tint = color.ink, fill = 'none', strokeWidth = 1.8 }: Props) {
  switch (name) {
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 256 256">
          <Path fill={tint} d="M232.5 69.5l-128 128a12 12 0 0 1-17 0l-56-56a12 12 0 0 1 17-17L96 172l119.5-119.5a12 12 0 0 1 17 17Z" />
        </Svg>
      );
    case 'chevronDown':
      return (
        <Svg width={size} height={size} viewBox="0 0 256 256">
          <Path fill={tint} d="M213.7 101.7l-80 80a8 8 0 0 1-11.4 0l-80-80a8 8 0 0 1 11.4-11.4L128 164.7l74.3-74.4a8 8 0 0 1 11.4 11.4Z" />
        </Svg>
      );
    case 'chevronLeft':
      return (
        <Svg width={size} height={size} viewBox="0 0 256 256">
          <Path fill={tint} d="M165.7 202.3a8 8 0 0 1-11.4 11.4l-80-80a8 8 0 0 1 0-11.4l80-80a8 8 0 0 1 11.4 11.4L91.3 128Z" />
        </Svg>
      );
    case 'bookmark':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 3.5h12v17l-6-4-6 4z" fill={fill} stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </Svg>
      );
    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={2} strokeLinecap="round">
          <Circle cx="11" cy="11" r="6.5" />
          <Path d="m16 16 4.5 4.5" />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round">
          <Path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z" />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth}>
          <Rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <Path d="M3.5 10h17M8 3v4M16 3v4" />
        </Svg>
      );
    case 'trophy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round">
          <Path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0zM7.5 6H4.5a3 3 0 0 0 3.2 4M16.5 6h3a3 3 0 0 1-3.2 4M12 13.5V17M8 20h8" />
        </Svg>
      );
    case 'map':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round">
          <Path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4zM9 4v14M15 6v14" />
        </Svg>
      );
    case 'user':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinecap="round">
          <Circle cx="12" cy="8" r="4" />
          <Path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
        </Svg>
      );
    case 'gear':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth}>
          <Circle cx="12" cy="12" r="3" />
          <Path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
        </Svg>
      );
  }
}

/** The LocalCheck mark: corner brackets with a check. */
export function LogoMark({ size = 24, frame = color.ink, check = color.orange }: { size?: number; frame?: string; check?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" stroke={frame} strokeWidth={2} strokeLinecap="square" />
      <Path d="m8 12.5 3 3 5.5-6.5" stroke={check} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
