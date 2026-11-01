import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Segmented, SportTag, Switch } from '@/components/ui/controls';
import { useOverlay } from '@/components/ui/Overlay';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { courts, type CourtId } from '@/mock/data';
import { dayName, hourLabel } from '@/mock/model';
import { canSchedule } from '@/mock/runs';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme';

export type NewGameAt = { court: CourtId; d: number; h: number; ranked?: boolean };

const FORMATS = { bb: ['1v1', '3v3', '4v4', '5v5'], pb: ['Singles', 'Doubles'] } as const;
const CAP: Record<string, number> = { '1v1': 2, '3v3': 6, '4v4': 8, '5v5': 10, Singles: 2, Doubles: 4 };
type Req = 'Any' | 'Contender+' | 'Elite';

/** New game, from the V5 design: day and time as the headline, sport and court, format, ranked, who can join. */
export function NewGameSheet({ at, onClose }: { at: NewGameAt | null; onClose: () => void }) {
  const app = useApp();
  const [last, setLast] = useState(at);
  if (at && at !== last) setLast(at);
  const [fmt, setFmt] = useState<string>('5v5');
  const [ranked, setRanked] = useState(false);
  const [req, setReq] = useState<Req>('Any');
  useEffect(() => {
    if (at) {
      setRanked(!!at.ranked);
      setReq(at.ranked ? 'Contender+' : 'Any');
    }
  }, [at]);

  const q = last;
  const sp = q ? courts[q.court].sport : 'bb';
  const fmts = FORMATS[sp] as readonly string[];
  const f = fmts.includes(fmt) ? fmt : fmts[fmts.length - 1];
  const n = q ? app.d.plannedCount(q.court, q.d, q.h) : 0;
  const lb = q ? hourLabel(7 + q.h) : null;

  const post = () => {
    // The next 2 hours belong to open runs (src/mock/runs.ts).
    if (!q || !canSchedule(q.d, q.h)) return;
    app.postRun(q.court, q.d, q.h, ranked ? 'Ranked game' : 'Pickup game', f + (ranked ? ' · Ranked' + (req !== 'Any' ? ' · ' + req : '') : ''), CAP[f]);
    onClose();
  };

  useOverlay(
    <Sheet open={!!at} onClose={onClose}>
      {q && lb ? (
        <View style={{ gap: space.gutter, paddingTop: space.s }}>
          <View style={{ gap: space.m }}>
            <Text t="eyebrow" tint={color.muted}>
              New game
            </Text>
            <Text t="sheetTitle">{dayName(q.d) + ' · ' + lb.t + ' ' + lb.ap}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.m }}>
              <SportTag sport={sp} />
              <Text t="caption" tint={color.inkSub}>
                {courts[q.court].name}
              </Text>
            </View>
          </View>
          <View style={{ gap: space.m }}>
            <Text t="eyebrow" tint={color.muted}>
              Format
            </Text>
            <Segmented<string> options={fmts.map((x) => [x, x])} value={f} onChange={setFmt} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.l }}>
            <View>
              <Text t="rowTitle">Ranked</Text>
              <Text t="meta" tint={color.muted}>
                Counts toward ELO
              </Text>
            </View>
            <Switch on={ranked} onChange={setRanked} label="Ranked" />
          </View>
          {ranked ? (
            <View style={{ gap: space.m }}>
              <Text t="eyebrow" tint={color.muted}>
                Who can join
              </Text>
              <Segmented<Req>
                options={[
                  ['Any', 'Any'],
                  ['Contender+', 'Contender+'],
                  ['Elite', 'Elite'],
                ]}
                value={req}
                onChange={setReq}
              />
            </View>
          ) : null}
          <Text t="meta" tint={color.muted}>
            {n ? n + ' already going at this time. They get a heads-up when you post.' : 'Nobody is going yet. Locals see it on the court.'}
          </Text>
          <Button label="Post game" kind="light" size="large" feedback="success" onPress={post} />
        </View>
      ) : null}
    </Sheet>,
  );
  return null;
}
