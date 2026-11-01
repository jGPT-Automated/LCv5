import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { color } from '@/theme';

/** Icons drawn exactly as in the LCPhoneV5 design file. */
export type IconName =
  | 'check'
  | 'chevronDown'
  | 'chevronLeft'
  | 'chevronRight'
  | 'bookmark'
  | 'search'
  | 'home'
  | 'calendar'
  | 'trophy'
  | 'map'
  | 'user'
  | 'gear'
  | 'bell'
  | 'plus'
  | 'minus'
  | 'more'
  | 'close'
  | 'pin'
  | 'apple'
  | 'mail'
  | 'info'
  | 'eye'
  | 'userMinus'
  | 'userPlus'
  | 'flag';

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
    case 'chevronRight':
      return (
        <Svg width={size} height={size} viewBox="0 0 256 256">
          <Path fill={tint} d="M90.3 202.3a8 8 0 0 0 11.4 11.4l80-80a8 8 0 0 0 0-11.4l-80-80a8 8 0 0 0-11.4 11.4L164.7 128Z" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
          <Path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={2} strokeLinecap="round">
          <Path d="M12 5v14M5 12h14" />
        </Svg>
      );
    case 'minus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={2} strokeLinecap="round">
          <Path d="M5 12h14" />
        </Svg>
      );
    case 'more':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={tint}>
          <Circle cx="5.5" cy="12" r="1.7" />
          <Circle cx="12" cy="12" r="1.7" />
          <Circle cx="18.5" cy="12" r="1.7" />
        </Svg>
      );
    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={2} strokeLinecap="round">
          <Path d="M6 6l12 12M18 6 6 18" />
        </Svg>
      );
    case 'pin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round">
          <Path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
          <Circle cx="12" cy="10" r="2.3" />
        </Svg>
      );
    case 'apple':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            fill={tint}
            d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"
          />
        </Svg>
      );
    case 'mail':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round">
          <Rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <Path d="m4 7 8 6 8-6" />
        </Svg>
      );
    case 'flag':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
          <Path d="M5 21V4M5 4h11l-2 4 2 4H5" />
        </Svg>
      );
    case 'info':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinecap="round">
          <Circle cx="12" cy="12" r="9" />
          <Path d="M12 11v5.5M12 7.6v.1" />
        </Svg>
      );
    case 'eye':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinejoin="round">
          <Path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
          <Circle cx="12" cy="12" r="3" />
        </Svg>
      );
    case 'userMinus':
    case 'userPlus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinecap="round">
          <Circle cx="9.5" cy="8" r="3.8" />
          <Path d="M2.5 20a7 7 0 0 1 14 0" />
          <Path d={name === 'userPlus' ? 'M17.5 8.5h5M20 6v5' : 'M17.5 8.5h5'} />
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
      // Lucide "settings" (ISC license): a cog, not a sun.
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <Circle cx="12" cy="12" r="3" />
        </Svg>
      );
  }
}

/** Back, in the LocalCheck mark's style: corner brackets with an orange chevron. */
export function BackMark({ size = 24, frame = color.ink, chevron = color.orange }: { size?: number; frame?: string; chevron?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" stroke={frame} strokeWidth={2} strokeLinecap="square" />
      <Path d="M14 7.5 9.5 12l4.5 4.5" stroke={chevron} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
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
