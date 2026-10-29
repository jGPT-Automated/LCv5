/**
 * Open runs: every hour without a scheduled game is an open run anyone at
 * the court, or on their way within the hour, can join.
 *
 * - Basketball: one list. When it reaches the run's size it auto-balances
 *   into two teams by ELO and locks.
 * - Pickleball: you join with a partner. Two pairs are on court, the rest
 *   wait in line. Winners stay; losers leave; the next pair steps on.
 *
 * Games can only be scheduled 2 or more hours out, so the next two hours
 * always belong to open runs.
 */
import { courts, NOW_HOUR, players, TODAY, type CourtId } from './data';
import { ME } from './social';

export const SCHEDULE_LEAD_HOURS = 2;

/** Basketball runs are 5v5 by default: 10 spots. */
export const LIST_SIZE = 10;

export type ListRun = { kind: 'list'; ids: string[] };
export type Pair = [string, string];
export type PairRun = { kind: 'pairs'; court: [Pair, Pair] | []; line: Pair[]; streak: number };
export type Run = ListRun | PairRun;

export const runKey = (c: CourtId, d: number, h: number) => c + ':' + d + ':' + h;

const elo = (i: string, mine: number | null) => (i === ME ? (mine ?? 1100) : (players.find((p) => p.i === i)?.elo ?? 1100));

/** Snake draft by ELO so the two sides come out even: A B B A A B B A … */
export function balance(ids: string[], myElo: number | null): [string[], string[]] {
  const sorted = [...ids].sort((x, y) => elo(y, myElo) - elo(x, myElo));
  const a: string[] = [];
  const b: string[] = [];
  sorted.forEach((id, k) => ((k % 4 === 0 || k % 4 === 3 ? a : b) as string[]).push(id));
  return [a, b];
}

/** Can a game be posted at this day and hour? Only 2+ hours from now. */
export const canSchedule = (d: number, h: number) => d > TODAY || (d === TODAY && h >= NOW_HOUR + SCHEDULE_LEAD_HOURS);

export function seedRuns(): Record<string, Run> {
  const now = NOW_HOUR;
  return {
    // Rancho Park, 5 PM: 9 of 10 in. One more and it locks.
    [runKey('rc', TODAY, now)]: { kind: 'list', ids: ['MR', 'SK', 'DW', 'LB', 'AO', 'JT', 'KO', 'NK', 'CP'] },
    [runKey('rc', TODAY, now + 1)]: { kind: 'list', ids: ['TM', 'EP'] },
    [runKey('vb', TODAY, now)]: { kind: 'list', ids: ['RV', 'OB', 'LB', 'MR'] },
    [runKey('pp', TODAY, now)]: { kind: 'list', ids: [] },
    // Westwood Rec (pickleball), 5 PM: a game on, two pairs waiting.
    [runKey('wd', TODAY, now)]: {
      kind: 'pairs',
      court: [
        ['MR', 'LB'],
        ['SK', 'AO'],
      ],
      line: [
        ['DW', 'JT'],
        ['NK', 'RV'],
      ],
      streak: 2,
    },
    [runKey('wd', TODAY, now + 1)]: { kind: 'pairs', court: [], line: [['CP', 'TM']], streak: 0 },
  };
}

export const emptyRun = (c: CourtId): Run => (courts[c].sport === 'pb' ? { kind: 'pairs', court: [], line: [], streak: 0 } : { kind: 'list', ids: [] });
