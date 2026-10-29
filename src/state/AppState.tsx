import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { type CourtId, type Load, type MeTier, type SportKey } from '@/mock/data';
import { derive, goingKey, initialGames, type Derived, type MockState } from '@/mock/model';
import { ME, seedFriendships, seedMatches, seedNotes, type Format, type Friendship, type Match, type Note } from '@/mock/social';

/**
 * In-memory app state for the UI pass. Resets on reload; nothing is saved and
 * nothing leaves the device. Each action below is where a backend call will go.
 */

export type Visibility = 'everyone' | 'friends' | 'private';
/** Location permission as the app sees it. `always` is what auto check-in needs. */
export type LocationAccess = 'unasked' | 'denied' | 'whenInUse' | 'always';

export type Profile = { first: string; last: string; username: string; sport: SportKey; home: CourtId };

export type Prefs = {
  visibility: Visibility;
  autoCheckIn: boolean;
  location: LocationAccess;
  push: boolean;
  alerts: { friends: boolean; invites: boolean; reviews: boolean };
};

type Ctx = MockState & {
  d: Derived;
  /** The preview opens signed in, so reviewing never needs an account. */
  signedIn: boolean;
  profile: Profile;
  prefs: Prefs;
  matches: Match[];
  notes: Note[];
  blocked: string[];
  /** Which saved court Home is showing. */
  homeIndex: number;
  setHomeIndex: (i: number) => void;
  checkIn: (c: CourtId) => void;
  checkOut: () => void;
  toggleSaved: (c: CourtId) => void;
  toggleGoing: (c: CourtId, d: number, h: number) => void;
  postRun: (c: CourtId, d: number, h: number, title: string, fmt: string, cap: number) => void;
  setMeTier: (t: MeTier) => void;
  setLoad: (l: Load) => void;
  signIn: () => void;
  signOut: () => void;
  setProfile: (p: Partial<Profile>) => void;
  setPrefs: (p: Partial<Prefs>) => void;
  setFriendship: (i: string, f: Friendship) => void;
  block: (i: string) => void;
  unblock: (i: string) => void;
  approve: (id: string) => void;
  dispute: (id: string, score: [number, number], note: string) => void;
  /** The logger accepts the score proposed in a dispute; the game becomes final. */
  acceptProposed: (id: string) => void;
  logGame: (g: { court: CourtId; fmt: Format; ranked: boolean; a: string[]; b: string[]; score: [number, number] }) => string;
  dismissNote: (id: string) => void;
};

const AppState = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<MockState>({
    checkedAt: null,
    friendships: seedFriendships(),
    mine: ['rc', 'pp', 'vb'],
    going: { 'rc:3:12': true, 'rc:5:3': true, 'rc:2:13': true },
    games: initialGames,
    meTier: 'contender',
    load: 'normal',
  });
  const [homeIndex, setHomeIndex] = useState(0);
  const [signedIn, setSignedIn] = useState(true);
  const [profile, setProfileState] = useState<Profile>({ first: 'Jordan', last: 'D', username: 'jordand', sport: 'bb', home: 'rc' });
  const [prefs, setPrefsState] = useState<Prefs>({
    visibility: 'everyone',
    autoCheckIn: true,
    location: 'always',
    push: true,
    alerts: { friends: true, invites: true, reviews: true },
  });
  const [matches, setMatches] = useState<Match[]>(seedMatches);
  const [notes, setNotes] = useState<Note[]>(seedNotes);
  const [blocked, setBlocked] = useState<string[]>([]);

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
  const postRun = useCallback((c: CourtId, d: number, h: number, title: string, fmt: string, cap: number) => {
    setS((x) => ({
      ...x,
      games: { ...x.games, [c]: [...x.games[c].filter((g) => !(g.d === d && g.h === h)), { d, h, title, fmt, cap }] },
      going: { ...x.going, [goingKey(c, d, h)]: true },
    }));
  }, []);
  const setMeTier = useCallback((meTier: MeTier) => setS((x) => ({ ...x, meTier })), []);
  const setLoad = useCallback((load: Load) => setS((x) => ({ ...x, load })), []);
  const signIn = useCallback(() => setSignedIn(true), []);
  const signOut = useCallback(() => {
    setSignedIn(false);
    setS((x) => ({ ...x, checkedAt: null }));
  }, []);
  const setProfile = useCallback((p: Partial<Profile>) => setProfileState((x) => ({ ...x, ...p })), []);
  const setPrefs = useCallback((p: Partial<Prefs>) => setPrefsState((x) => ({ ...x, ...p })), []);
  const setFriendship = useCallback((i: string, f: Friendship) => {
    setS((x) => ({ ...x, friendships: { ...x.friendships, [i]: f } }));
    // Answering a request clears it from the inbox.
    if (f === 'friend' || f === 'none') setNotes((n) => n.filter((it) => !(it.kind === 'friend' && it.who === i)));
  }, []);
  const block = useCallback((i: string) => {
    setBlocked((b) => (b.includes(i) ? b : [...b, i]));
    setS((x) => ({ ...x, friendships: { ...x.friendships, [i]: 'none' } }));
  }, []);
  const unblock = useCallback((i: string) => setBlocked((b) => b.filter((x) => x !== i)), []);
  const approve = useCallback((id: string) => {
    setMatches((list) =>
      list.map((m) => {
        if (m.id !== id) return m;
        const waitingOn = m.waitingOn.filter((w) => w !== ME);
        return { ...m, waitingOn, status: waitingOn.length ? m.status : 'final', events: [...m.events, { who: ME, what: 'approved', ago: 0 }] };
      }),
    );
    setNotes((n) => n.filter((it) => !(it.kind === 'review' && it.match === id)));
  }, []);
  const dispute = useCallback((id: string, score: [number, number], note: string) => {
    setMatches((list) =>
      list.map((m) =>
        m.id === id
          ? { ...m, status: 'disputed', proposed: score, waitingOn: [m.loggedBy], hoursLeft: 168, events: [...m.events, { who: ME, what: 'disputed', ago: 0, note: note || undefined }] }
          : m,
      ),
    );
    setNotes((n) => n.filter((it) => !(it.kind === 'review' && it.match === id)));
  }, []);
  const acceptProposed = useCallback((id: string) => {
    setMatches((list) =>
      list.map((m) =>
        m.id === id && m.proposed
          ? { ...m, score: m.proposed, proposed: undefined, status: 'final', waitingOn: [], events: [...m.events, { who: ME, what: 'revised', ago: 0 }] }
          : m,
      ),
    );
  }, []);
  const logGame = useCallback<Ctx['logGame']>((g) => {
    const id = 'g' + Date.now();
    const others = g.b.length ? g.b : g.a.filter((x) => x !== ME);
    setMatches((list) => [
      { id, ...g, ago: 0, status: 'review', loggedBy: ME, waitingOn: others.slice(0, 1), hoursLeft: 72, delta: {}, events: [{ who: ME, what: 'logged', ago: 0 }] },
      ...list,
    ]);
    return id;
  }, []);
  const dismissNote = useCallback((id: string) => setNotes((n) => n.filter((it) => it.id !== id)), []);

  const value = useMemo<Ctx>(
    () => ({
      ...s,
      d: derive(s),
      signedIn,
      profile,
      prefs,
      matches,
      notes,
      blocked,
      homeIndex,
      setHomeIndex,
      checkIn,
      checkOut,
      toggleSaved,
      toggleGoing,
      postRun,
      setMeTier,
      setLoad,
      signIn,
      signOut,
      setProfile,
      setPrefs,
      setFriendship,
      block,
      unblock,
      approve,
      dispute,
      acceptProposed,
      logGame,
      dismissNote,
    }),
    [s, signedIn, profile, prefs, matches, notes, blocked, homeIndex, checkIn, checkOut, toggleSaved, toggleGoing, postRun, setMeTier, setLoad, signIn, signOut, setProfile, setPrefs, setFriendship, block, unblock, approve, dispute, acceptProposed, logGame, dismissNote],
  );
  return <AppState.Provider value={value}>{children}</AppState.Provider>;
}

export function useApp() {
  const v = useContext(AppState);
  if (!v) throw new Error('useApp must be used inside AppStateProvider');
  return v;
}
