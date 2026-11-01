/**
 * Mock games, profiles and notifications. Shapes follow what the real backend
 * will hold (a game, who played, the score and its review state) so screens
 * don't change when data is wired. Nothing here talks to a backend.
 */
import { courts, me, players, type CourtId, type Player } from './data';

/** Your initials double as your player id in the mock data. */
export const ME = me.i;

export type Format = '1v1' | '2v2' | '3v3' | '4v4' | '5v5';
export const formats: Format[] = ['1v1', '2v2', '3v3', '4v4', '5v5'];

/**
 * - final: approved by the other side, or auto-approved after 3 days.
 * - review: waiting on the other side to approve.
 * - disputed: someone disputed it; the logger can revise or it voids in 7 days.
 */
export type MatchStatus = 'final' | 'review' | 'disputed';

export type MatchEvent = { who: string; what: 'logged' | 'approved' | 'disputed' | 'revised' | 'auto'; ago: number; note?: string };

export type Match = {
  id: string;
  court: CourtId;
  /** Minutes ago the game was played. */
  ago: number;
  fmt: Format;
  ranked: boolean;
  /** Player ids per side. */
  a: string[];
  b: string[];
  score: [number, number];
  status: MatchStatus;
  loggedBy: string;
  /** Who still needs to approve, while in review or disputed. */
  waitingOn: string[];
  /** Hours left before it auto-approves (review) or voids (disputed). */
  hoursLeft?: number;
  /** Score the other side proposed when disputing. */
  proposed?: [number, number];
  /** ELO change per player id, once final. */
  delta: Record<string, number>;
  events: MatchEvent[];
};

const H = 60;
const D = 1440;

export const seedMatches: Match[] = [
  {
    id: 'g1',
    court: 'rc',
    ago: 2 * H,
    fmt: '1v1',
    ranked: true,
    a: [ME],
    b: ['MR'],
    score: [21, 17],
    status: 'final',
    loggedBy: ME,
    waitingOn: [],
    delta: { [ME]: 14, MR: -14 },
    events: [
      { who: ME, what: 'logged', ago: 2 * H },
      { who: 'MR', what: 'approved', ago: 90 },
    ],
  },
  {
    id: 'g2',
    court: 'rc',
    ago: 3 * H,
    fmt: '1v1',
    ranked: true,
    a: ['DW'],
    b: [ME],
    score: [21, 17],
    status: 'review',
    loggedBy: 'DW',
    waitingOn: [ME],
    hoursLeft: 69,
    delta: { DW: 11, [ME]: -11 },
    events: [{ who: 'DW', what: 'logged', ago: 3 * H }],
  },
  {
    id: 'g3',
    court: 'rc',
    ago: 5 * H,
    fmt: '1v1',
    ranked: false,
    a: [ME],
    b: ['KO'],
    score: [21, 18],
    status: 'review',
    loggedBy: ME,
    waitingOn: ['KO'],
    hoursLeft: 67,
    delta: {},
    events: [{ who: ME, what: 'logged', ago: 5 * H }],
  },
  {
    id: 'g4',
    court: 'rc',
    ago: D + 4 * H,
    fmt: '2v2',
    ranked: true,
    a: ['MR', 'LB'],
    b: ['DW', 'JT'],
    score: [21, 18],
    status: 'final',
    loggedBy: 'MR',
    waitingOn: [],
    delta: { MR: 9, LB: 10, DW: -9, JT: -10 },
    events: [
      { who: 'MR', what: 'logged', ago: D + 4 * H },
      { who: 'DW', what: 'approved', ago: D + 3 * H },
    ],
  },
  {
    id: 'g5',
    court: 'rc',
    ago: 2 * D,
    fmt: '3v3',
    ranked: true,
    a: ['DW', 'SK', 'AO'],
    b: [ME, 'NK', 'LB'],
    score: [21, 15],
    status: 'final',
    loggedBy: 'DW',
    waitingOn: [],
    delta: { DW: 8, SK: 7, AO: 9, [ME]: -9, NK: -8, LB: -7 },
    events: [
      { who: 'DW', what: 'logged', ago: 2 * D },
      { who: 'NK', what: 'approved', ago: 2 * D - 2 * H },
    ],
  },
  {
    id: 'g6',
    court: 'rc',
    ago: 2 * D + 2 * H,
    fmt: '1v1',
    ranked: true,
    a: ['JT'],
    b: [ME],
    score: [21, 11],
    status: 'disputed',
    loggedBy: 'JT',
    waitingOn: ['JT'],
    hoursLeft: 118,
    proposed: [21, 19],
    delta: {},
    events: [
      { who: 'JT', what: 'logged', ago: 2 * D + 2 * H },
      { who: ME, what: 'disputed', ago: 2 * D, note: 'It was 21–19, not 21–11.' },
    ],
  },
  {
    id: 'g7',
    court: 'rc',
    ago: 3 * D,
    fmt: '1v1',
    ranked: true,
    a: ['MR'],
    b: ['SK'],
    score: [21, 19],
    status: 'final',
    loggedBy: 'MR',
    waitingOn: [],
    delta: { MR: 6, SK: -6 },
    events: [
      { who: 'MR', what: 'logged', ago: 3 * D },
      { who: 'SK', what: 'approved', ago: 3 * D - H },
    ],
  },
  {
    id: 'g8',
    court: 'vb',
    ago: 4 * D,
    fmt: '1v1',
    ranked: false,
    a: [ME],
    b: ['NK'],
    score: [21, 12],
    status: 'final',
    loggedBy: ME,
    waitingOn: [],
    delta: {},
    events: [
      { who: ME, what: 'logged', ago: 4 * D },
      { who: 'NK', what: 'approved', ago: 4 * D - H },
    ],
  },
  {
    id: 'g9',
    court: 'vb',
    ago: 5 * D,
    fmt: '1v1',
    ranked: true,
    a: ['LB'],
    b: ['OB'],
    score: [21, 16],
    status: 'final',
    loggedBy: 'LB',
    waitingOn: [],
    delta: { LB: 7, OB: -7 },
    events: [
      { who: 'LB', what: 'logged', ago: 5 * D },
      { who: 'OB', what: 'auto', ago: 2 * D },
    ],
  },
  {
    id: 'g10',
    court: 'rc',
    ago: 6 * D,
    fmt: '1v1',
    ranked: true,
    a: ['MR'],
    b: [ME],
    score: [21, 19],
    status: 'final',
    loggedBy: 'MR',
    waitingOn: [],
    delta: { MR: 12, [ME]: -12 },
    events: [
      { who: 'MR', what: 'logged', ago: 6 * D },
      { who: ME, what: 'approved', ago: 6 * D - H },
    ],
  },
  {
    id: 'g11',
    court: 'pp',
    ago: 6 * D + 3 * H,
    fmt: '5v5',
    ranked: false,
    a: ['SK', 'AO', 'CP', 'TM', 'EP'],
    b: ['KO', 'RV', 'OB', 'JT', 'NK'],
    score: [21, 14],
    status: 'final',
    loggedBy: 'SK',
    waitingOn: [],
    delta: {},
    events: [
      { who: 'SK', what: 'logged', ago: 6 * D + 3 * H },
      { who: 'KO', what: 'approved', ago: 6 * D },
    ],
  },
];

/** Where each player plays most and when they joined. */
export const profileInfo: Record<string, { home: CourtId; since: string }> = {
  MR: { home: 'rc', since: 'Mar 2026' },
  SK: { home: 'rc', since: 'May 2026' },
  DW: { home: 'rc', since: 'Feb 2026' },
  LB: { home: 'vb', since: 'Jun 2026' },
  AO: { home: 'vb', since: 'Jul 2026' },
  JT: { home: 'rc', since: 'Apr 2026' },
  KO: { home: 'pp', since: 'Aug 2026' },
  NK: { home: 'rc', since: 'Mar 2026' },
  CP: { home: 'pp', since: 'Sep 2026' },
  TM: { home: 'wd', since: 'Aug 2026' },
  RV: { home: 'vb', since: 'Oct 2026' },
  EP: { home: 'pp', since: 'Sep 2026' },
  OB: { home: 'vb', since: 'Oct 2026' },
  [ME]: { home: 'rc', since: 'Jan 2026' },
};

export type Friendship = 'friend' | 'sent' | 'received' | 'none';

export const seedFriendships = (): Record<string, Friendship> => {
  const out: Record<string, Friendship> = {};
  players.forEach((p) => (out[p.i] = p.friend ? 'friend' : 'none'));
  out.SK = 'received';
  out.AO = 'received';
  return out;
};

/**
 * Notifications. Actionable ones (review, friend, invite) stay in "Needs you"
 * until acted on; the rest are a record of what happened.
 */
export type Note =
  | { id: string; kind: 'review'; match: string; ago: number }
  | { id: string; kind: 'friend'; who: string; ago: number }
  | { id: string; kind: 'invite'; who: string; court: CourtId; d: number; h: number; ago: number }
  | { id: string; kind: 'checkin'; who: string; court: CourtId; ago: number }
  | { id: string; kind: 'approved'; match: string; who: string; ago: number }
  | { id: string; kind: 'auto'; court: CourtId; ago: number };

export const seedNotes: Note[] = [
  { id: 'n1', kind: 'review', match: 'g2', ago: 3 * H },
  { id: 'n2', kind: 'friend', who: 'SK', ago: 5 * H },
  { id: 'n3', kind: 'invite', who: 'MR', court: 'rc', d: 3, h: 12, ago: 6 * H },
  { id: 'n4', kind: 'friend', who: 'AO', ago: D },
  { id: 'n5', kind: 'checkin', who: 'LB', court: 'rc', ago: 30 },
  { id: 'n6', kind: 'approved', match: 'g1', who: 'MR', ago: 90 },
  { id: 'n7', kind: 'auto', court: 'rc', ago: D + 2 * H },
  { id: 'n8', kind: 'checkin', who: 'MR', court: 'vb', ago: 2 * D },
];

export const actionable = (n: Note) => n.kind === 'review' || n.kind === 'friend' || n.kind === 'invite';

/** Look up a player by id, including you. */
export function person(i: string, you: Player): Player {
  if (i === ME) return you;
  return players.find((p) => p.i === i) ?? { i, n: i, elo: null, s: 0, seen: 0 };
}

export const sideOf = (m: Match, i: string): 'a' | 'b' | null => (m.a.includes(i) ? 'a' : m.b.includes(i) ? 'b' : null);

/** Did player `i` win this game? null when they didn't play. */
export function won(m: Match, i: string): boolean | null {
  const s = sideOf(m, i);
  if (!s) return null;
  return s === 'a' ? m.score[0] > m.score[1] : m.score[1] > m.score[0];
}

/** Score from player `i`'s side, e.g. "21–17". */
export function scoreFor(m: Match, i: string) {
  const [x, y] = sideOf(m, i) === 'b' ? [m.score[1], m.score[0]] : m.score;
  return x + '–' + y;
}

/** Head-to-head between two players across singles and team games where they were opponents. */
export function headToHead(list: Match[], i: string, j: string) {
  const games = list.filter((m) => m.status === 'final' && sideOf(m, i) && sideOf(m, j) && sideOf(m, i) !== sideOf(m, j));
  const w = games.filter((m) => won(m, i)).length;
  return { w, l: games.length - w, games };
}

/** Short day label for minutes ago: Today, Yesterday, Mon… */
export function dayLabel(minsAgo: number) {
  const DAYS = ['Wed', 'Tue', 'Mon', 'Sun', 'Sat', 'Fri', 'Thu'];
  const n = Math.floor((minsAgo + 7 * 60) / D);
  return n === 0 ? 'Today' : n === 1 ? 'Yesterday' : (DAYS[n % 7] ?? n + 'd ago');
}

/** Clock time for the mock "now" of Wednesday 5 PM, e.g. "3:00 PM". */
export function clock(minsAgo: number) {
  const m = (((17 * 60 - minsAgo) % D) + D) % D;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return (h % 12 || 12) + ':' + String(mm).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
}

export const courtName = (c: CourtId) => courts[c].name;
