import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { CourtId, Load, MeTier } from '@/mock/data';
import { derive, goingKey, initialGames, type Derived, type MockState } from '@/mock/model';

/** In-memory app state for the UI pass. Resets on reload; nothing is saved. */
type Ctx = MockState & {
  d: Derived;
  /** Which saved court Home is showing. */
  homeIndex: number;
  setHomeIndex: (i: number) => void;
  checkIn: (c: CourtId) => void;
  checkOut: () => void;
  toggleSaved: (c: CourtId) => void;
  toggleGoing: (c: CourtId, d: number, h: number) => void;
  setMeTier: (t: MeTier) => void;
  setLoad: (l: Load) => void;
};

const AppState = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<MockState>({
    checkedAt: null,
    mine: ['rc', 'pp', 'vb'],
    going: { 'rc:3:12': true, 'rc:5:3': true, 'rc:2:13': true },
    games: initialGames,
    meTier: 'contender',
    load: 'normal',
  });
  const [homeIndex, setHomeIndex] = useState(0);

  const checkIn = useCallback((c: CourtId) => setS((x) => ({ ...x, checkedAt: c })), []);
  const checkOut = useCallback(() => setS((x) => ({ ...x, checkedAt: null })), []);
  const toggleSaved = useCallback((c: CourtId) => {
    setS((x) => ({
      ...x,
      // Keep at least one saved court so Home always has something to show.
      mine: x.mine.includes(c) ? (x.mine.length > 1 ? x.mine.filter((y) => y !== c) : x.mine) : [...x.mine, c],
    }));
    setHomeIndex(0);
  }, []);
  const toggleGoing = useCallback((c: CourtId, d: number, h: number) => {
    const k = goingKey(c, d, h);
    setS((x) => ({ ...x, going: { ...x.going, [k]: !x.going[k] } }));
  }, []);
  const setMeTier = useCallback((meTier: MeTier) => setS((x) => ({ ...x, meTier })), []);
  const setLoad = useCallback((load: Load) => setS((x) => ({ ...x, load })), []);

  const value = useMemo<Ctx>(
    () => ({ ...s, d: derive(s), homeIndex, setHomeIndex, checkIn, checkOut, toggleSaved, toggleGoing, setMeTier, setLoad }),
    [s, homeIndex, checkIn, checkOut, toggleSaved, toggleGoing, setMeTier, setLoad],
  );
  return <AppState.Provider value={value}>{children}</AppState.Provider>;
}

export function useApp() {
  const v = useContext(AppState);
  if (!v) throw new Error('useApp must be used inside AppStateProvider');
  return v;
}
