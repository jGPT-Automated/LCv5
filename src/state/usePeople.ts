import { useCallback } from 'react';

import { person, ME } from '@/mock/social';
import type { PlayerView } from '@/mock/model';

import { useApp } from './AppState';

/** Look up players by id as screens show them (friend, rank, live), plus a name function. */
export function usePeople() {
  const { d } = useApp();
  const get = useCallback((i: string): PlayerView => d.viewP(person(i, d.you)), [d]);
  const name = useCallback((i: string) => (i === ME ? 'You' : person(i, d.you).n), [d]);
  return { get, name };
}
