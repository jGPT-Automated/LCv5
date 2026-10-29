/**
 * Pure helpers that turn a game into what screens show. No React.
 */
import { courts } from './data';
import { dayLabel, ME, sideOf, won, type Match } from './social';

type Named = (i: string) => string;

/** "You", "Marcus", or "Marcus + Luis" for a side. */
export const sideNames = (ids: string[], name: Named) => ids.map((i) => (i === ME ? 'You' : name(i))).join(' + ');

/** One line that says what happened: first person when you played, otherwise neutral. */
export function headline(m: Match, name: Named, firstPerson = true) {
  const mine = firstPerson ? sideOf(m, ME) : null;
  const winA = m.score[0] > m.score[1];
  if (mine) {
    const them = sideNames(mine === 'a' ? m.b : m.a, name);
    return won(m, ME) ? 'Beat ' + them : 'Lost to ' + them;
  }
  const [w, l] = winA ? [m.a, m.b] : [m.b, m.a];
  return sideNames(w, name) + ' beat ' + sideNames(l, name).replace(/^You\b/, 'you');
}

export const detailLine = (m: Match) => [m.fmt, m.ranked ? 'Ranked' : 'Casual', courts[m.court].name, dayLabel(m.ago)].join(' · ');

/** Status as a short label and how loud to show it. */
export function statusOf(m: Match, name: Named): { label: string; tone: 'orange' | 'neutral' | 'quiet' } {
  if (m.status === 'final') return { label: 'Final', tone: 'quiet' };
  if (m.status === 'disputed') return { label: 'Disputed', tone: 'orange' };
  const w = m.waitingOn[0];
  return w === ME ? { label: 'Needs you', tone: 'orange' } : { label: 'Waiting on ' + (w ? name(w) : 'review'), tone: 'neutral' };
}

/** Hours as "2d 21h" or "5h". */
export const timeLeft = (h: number) => (h >= 24 ? Math.floor(h / 24) + 'd ' + (h % 24) + 'h' : h + 'h');
