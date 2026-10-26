/**
 * Mock data for the UI pass. Nothing here talks to a backend.
 * Values come from the LCPhoneV5 prototype so screens match the design.
 */

export type SportKey = 'bb' | 'pb';
export type CourtId = 'rc' | 'pp' | 'vb' | 'wd' | 'jo';

export type Player = {
  /** Initials shown in the avatar square. */
  i: string;
  /** First name only, for privacy. */
  n: string;
  elo: number | null;
  friend?: boolean;
  /** Visits to this court. */
  s: number;
  /** Minutes since last seen. */
  seen: number;
  me?: boolean;
};

export type Court = {
  id: CourtId;
  name: string;
  area: string;
  sport: SportKey;
  /** People on court right now. */
  on: number;
  /** Activity multiplier for planned visits. */
  f: number;
  seed: number;
  locals: number;
  /** Position on the placeholder map, as a percentage. */
  x: number;
  y: number;
};

export type Game = { d: number; h: number; title: string; fmt: string; cap: number };

export const players: Player[] = [
  { i: 'MR', n: 'Marcus', elo: 1342, friend: true, s: 18, seen: 20 },
  { i: 'SK', n: 'Sam', elo: 1310, s: 14, seen: 120 },
  { i: 'DW', n: 'Dre', elo: 1288, s: 16, seen: 45 },
  { i: 'LB', n: 'Luis', elo: 1240, friend: true, s: 11, seen: 30 },
  { i: 'AO', n: 'Ade', elo: 1201, s: 9, seen: 180 },
  { i: 'JT', n: 'Jamal', elo: 1188, s: 12, seen: 300 },
  { i: 'KO', n: 'Kofi', elo: 1156, s: 7, seen: 1440 },
  { i: 'NK', n: 'Nate', elo: 1129, friend: true, s: 10, seen: 60 },
  { i: 'CP', n: 'Chris', elo: 1102, s: 5, seen: 2880 },
  { i: 'TM', n: 'Tariq', elo: 1061, s: 6, seen: 200 },
  { i: 'RV', n: 'Rico', elo: null, friend: true, s: 3, seen: 90 },
  { i: 'EP', n: 'Eli', elo: 1034, s: 4, seen: 4320 },
  { i: 'OB', n: 'Omar', elo: null, s: 2, seen: 600 },
];

export const courts: Record<CourtId, Court> = {
  rc: { id: 'rc', name: 'Rancho Park', area: 'Cheviot Hills · 0.4 mi', sport: 'bb', on: 5, f: 1, seed: 0, locals: 23, x: 34, y: 38 },
  pp: { id: 'pp', name: 'Pan Pacific', area: 'Fairfax · 1.9 mi', sport: 'bb', on: 2, f: 0.6, seed: 5, locals: 11, x: 62, y: 22 },
  vb: { id: 'vb', name: 'Venice Beach', area: 'Venice · 3.4 mi', sport: 'bb', on: 7, f: 1.3, seed: 3, locals: 41, x: 20, y: 60 },
  wd: { id: 'wd', name: 'Westwood Rec', area: 'Westwood · 2.6 mi', sport: 'pb', on: 3, f: 0.8, seed: 8, locals: 15, x: 54, y: 46 },
  jo: { id: 'jo', name: 'Jesse Owens', area: 'Westmont · 6.8 mi', sport: 'bb', on: 0, f: 0.4, seed: 7, locals: 4, x: 74, y: 72 },
};

export const courtIds = Object.keys(courts) as CourtId[];

/** Day index 0–6 is Mon–Sun; hour index 0–16 is 7 AM–11 PM. */
export const games: Record<CourtId, Game[]> = {
  rc: [
    { d: 2, h: 12, title: 'Evening run', fmt: '5v5', cap: 10 },
    { d: 5, h: 3, title: 'Saturday ranked', fmt: '3v3 · Ranked', cap: 6 },
    { d: 3, h: 12, title: 'Thursday run', fmt: '5v5', cap: 10 },
  ],
  pp: [{ d: 2, h: 13, title: 'Late run', fmt: '4v4', cap: 8 }],
  vb: [
    { d: 2, h: 12, title: 'Sunset run', fmt: '5v5', cap: 10 },
    { d: 4, h: 12, title: 'Friday night run', fmt: '4v4', cap: 8 },
  ],
  wd: [{ d: 3, h: 10, title: 'Doubles', fmt: 'Doubles · Ranked', cap: 8 }],
  jo: [],
};

export const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
export const dayNums = [12, 13, 14, 15, 16, 17, 18] as const;
/** Mock "now": Wednesday, 5 PM. */
export const TODAY = 2;
export const NOW_HOUR = 10;
export const HOURS = 17;

export type MeTier = 'unranked' | 'open' | 'contender' | 'top5';
export const myElo: Record<MeTier, number | null> = { unranked: null, open: 1092, contender: 1176, top5: 1334 };

export type Load = 'empty' | 'normal' | 'packed';

export const me = { i: 'JD', name: 'Jordan D', checkIns: 46, weekMinutes: [38, 0, 62, 0, 0, 0, 0] };

export const sessionLengths = ['41m', '38m', '24m', '17m', '12m', '9m', '6m', '4m', '3m', '2m', '2m', '1m', '1m'];
