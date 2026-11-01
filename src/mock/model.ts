/**
 * Pure helpers that turn mock data + app state into what screens show.
 * Ported from the LCPhoneV5 prototype logic. No React, no side effects.
 */
import type { Tier } from '@/theme';

import {
  courtIds,
  courts,
  days,
  dayNums,
  games as seedGames,
  HOURS,
  me,
  myElo,
  NOW_HOUR,
  players,
  TODAY,
  type CourtId,
  type Game,
  type Load,
  type MeTier,
  type Player,
} from './data';
import type { Friendship } from './social';

export type PlayerView = Player & { rank?: number; live?: boolean };

export type MockState = {
  checkedAt: CourtId | null;
  /** Friend status per player id; overrides the seed `friend` flag. */
  friendships: Record<string, Friendship>;
  mine: CourtId[];
  going: Record<string, boolean>;
  games: Record<CourtId, Game[]>;
  meTier: MeTier;
  load: Load;
};

export const initialGames = seedGames;

export function tierOf(elo: number | null | undefined): Tier | null {
  if (elo == null) return null;
  return elo >= 1300 ? 'elite' : elo >= 1150 ? 'contender' : 'open';
}

/** Planned-visit curve: weekday evening peak, weekend morning peak. */
export function base(d: number, h: number) {
  const hr = 7 + h;
  const g = (c: number, w: number) => Math.exp(-((hr - c) ** 2) / (2 * w * w));
  const v = d >= 5 ? g(10.5, 2.2) * 7 + g(17, 2.5) * 3 : g(18.5, 1.8) * 9 + g(7.5, 1) * 2 + g(12.5, 1) * 1.5;
  return Math.max(0, Math.round(v + ((d * 31 + h * 17) % 7) / 7 - 0.5));
}

export function pick(n: number, seed: number) {
  const out: Player[] = [];
  for (let k = 0; k < Math.min(n, players.length); k++) out.push(players[(k * 5 + seed) % players.length]);
  return out;
}

export function hourLabel(hr: number) {
  const h = hr > 12 ? hr - 12 : hr;
  const pm = hr >= 12;
  return { t: String(h), ap: pm ? 'PM' : 'AM', short: h + (pm ? 'P' : 'A') };
}

export function ago(m: number) {
  return m < 60 ? m + 'm ago' : m < 1440 ? Math.round(m / 60) + 'h ago' : Math.round(m / 1440) + 'd ago';
}

export function dayName(d: number) {
  return d === TODAY ? 'Today' : days[d].charAt(0) + days[d].slice(1).toLowerCase() + ' ' + dayNums[d];
}

export const heatLevel = (c: number) => (c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 8 ? 3 : 4);

export const goingKey = (c: CourtId, d: number, h: number) => c + ':' + d + ':' + h;

/** Friends' first names in a list, e.g. "Marcus, Luis +1". */
export function friendNames(list: Player[]) {
  const f = list.filter((p) => p.friend).map((p) => p.n);
  return f.length ? f.slice(0, 2).join(', ') + (f.length > 2 ? ' +' + (f.length - 2) : '') : '';
}

export function record(elo: number) {
  const w = Math.round((elo - 1000) / 9) + 4;
  return w + '–' + Math.max(3, 30 - w);
}

/** Everything a screen needs, derived from state. */
export function derive(s: MockState) {
  const LF = s.load === 'empty' ? 0 : s.load === 'packed' ? 2.2 : 1;
  const you: Player = { i: me.i, n: 'You', elo: myElo[s.meTier], me: true, s: 12, seen: 1440 };

  const rankOf: Record<string, number> = {};
  [...players, you]
    .filter((x) => x.elo != null)
    .sort((a, b) => (b.elo as number) - (a.elo as number))
    .forEach((x, k) => {
      rankOf[x.i] = k + 1;
    });

  const baseOn = (c: CourtId) => (s.load === 'empty' ? 0 : s.load === 'packed' ? Math.min(12, Math.round(courts[c].on * 2.2)) : courts[c].on);
  const liveCount = (c: CourtId) => baseOn(c) + (s.checkedAt === c ? 1 : 0);
  const livePeople = (c: CourtId): Player[] => [...(s.checkedAt === c ? [you] : []), ...pick(baseOn(c), courts[c].seed)];
  const gameAt = (c: CourtId, d: number, h: number) => s.games[c].find((g) => g.d === d && g.h === h);
  const plannedCount = (c: CourtId, d: number, h: number) => Math.round(base(d, h) * courts[c].f * LF) + (s.going[goingKey(c, d, h)] ? 1 : 0);
  const crowd = (c: CourtId, d: number, h: number): Player[] => [
    ...(s.going[goingKey(c, d, h)] ? [you] : []),
    ...pick(Math.round(base(d, h) * courts[c].f * LF), courts[c].seed + d * 3 + h),
  ];
  const view = (c: CourtId) => {
    const live = new Set(livePeople(c).map((p) => p.i));
    return (p: Player): PlayerView => ({ ...p, friend: !p.me && s.friendships[p.i] === 'friend', rank: rankOf[p.i], live: live.has(p.i) });
  };
  const anyLive = new Set(courtIds.flatMap((c) => livePeople(c).map((p) => p.i)));
  /** A player as shown anywhere outside a court page: live means on any court. */
  const viewP = (p: Player): PlayerView => ({ ...p, friend: !p.me && s.friendships[p.i] === 'friend', rank: rankOf[p.i], live: anyLive.has(p.i) });
  const gamesThisWeek = (c: CourtId) => s.games[c].filter((g) => g.d >= TODAY).length;
  /** Today's activity per hour: who checked in (past), who's on now, who's going (later). */
  const todayCounts = (c: CourtId) => Array.from({ length: HOURS }, (_, i) => (i === NOW_HOUR ? liveCount(c) : Math.round(base(TODAY, i) * courts[c].f * LF)));

  return { you, rankOf, liveCount, livePeople, gameAt, plannedCount, crowd, view, viewP, gamesThisWeek, todayCounts };
}

export type Derived = ReturnType<typeof derive>;

/** "Cheviot Hills · 0.4 mi" → neighborhood and distance, shown in different spots. */
export const courtPlace = (c: CourtId) => courts[c].area.split(' · ')[0];
export const courtDistance = (c: CourtId) => courts[c].area.split(' · ')[1] ?? '';
