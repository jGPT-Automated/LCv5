import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ChoiceList } from '@/components/ui/ChoiceList';
import { Button } from '@/components/ui/controls';
import { MorphingModal, MorphingModalHeader } from '@/components/ui/MorphingModal';
import { PlayedDays } from '@/components/ui/PlayedDays';
import { ListRow } from '@/components/ui/ListRow';
import { ScoreField } from '@/components/ui/ScoreField';
import { Group } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, dayNums, days, TODAY, type CourtId } from '@/mock/data';
import { courtDistance } from '@/mock/model';
import { ME } from '@/mock/social';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme';

const PAST = Array.from({ length: 7 }, (_, k) => 6 - k).map((back) => {
  const d = (TODAY - back + 7) % 7;
  return { label: back === 0 ? 'Today' : days[d].charAt(0) + days[d].slice(1).toLowerCase(), num: dayNums[TODAY] - back };
});

type Step = 'score' | 'court' | 'sent';

/**
 * Log a 1v1 against the player whose profile you're on, without leaving it:
 * the score and the day, the court if it wasn't your usual one, then send.
 * Team games use the full Log game page from Compete.
 */
export function QuickLog({ opp, oppName, open, onClose }: { opp: string; oppName: string; open: boolean; onClose: () => void }) {
  const app = useApp();
  const [view, setView] = useState<Step | null>(null);
  const [court, setCourt] = useState<CourtId>(app.checkedAt ?? app.profile.home);
  const [day, setDay] = useState(6);
  const [score, setScore] = useState(['', '']);
  const [id, setId] = useState('');

  useEffect(() => {
    if (open) {
      setView('score');
      setScore(['', '']);
      setDay(6);
    } else setView(null);
  }, [open]);

  const a = Number(score[0]);
  const b = Number(score[1]);
  const ready = score[0] !== '' && score[1] !== '' && a !== b;

  const send = () => {
    setId(app.logGame({ court, fmt: '1v1', ranked: true, a: [ME], b: [opp], score: [a, b] }));
    setView('sent');
  };

  return (
    <MorphingModal view={view} onClose={onClose} label={'Log a game with ' + oppName}>
      {view === 'score' ? (
        <View>
          <MorphingModalHeader title={'Log game with ' + oppName} />
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space.l }}>
            <ScoreField label="You" value={score[0]} onChange={(v) => setScore([v, score[1]])} />
            <Text t="title2" tint={color.faint}>
              –
            </Text>
            <ScoreField label={oppName} value={score[1]} onChange={(v) => setScore([score[0], v])} />
          </View>
          <View style={{ marginTop: space.x5 }}>
            <PlayedDays days={PAST} value={day} onChange={setDay} />
          </View>
          <View style={{ marginTop: space.x5 }}>
            <Group>
              <ListRow title="Court" value={courts[court].name} onPress={() => setView('court')} last />
            </Group>
          </View>
          <View style={{ marginTop: space.x5 }}>
            <Button label={'Send to ' + oppName} kind="orange" size="large" disabled={!ready} feedback="commit" onPress={send} />
          </View>
        </View>
      ) : null}
      {view === 'court' ? (
        <View>
          <MorphingModalHeader title="Court" onBack={() => setView('score')} />
          <ChoiceList<CourtId>
            value={court}
            onChange={(c) => {
              setCourt(c);
              setView('score');
            }}
            choices={app.mine.map((c) => ({ key: c, title: courts[c].name, trailing: courtDistance(c) }))}
          />
        </View>
      ) : null}
      {view === 'sent' ? (
        <View>
          <MorphingModalHeader title="Sent" />
          <Text t="title1" align="center" upper={false}>
            {a + ' – ' + b}
          </Text>
          <Text t="subhead" tint={color.muted} align="center" style={{ marginTop: space.m }}>
            {oppName + ' has 3 days to approve it.'}
          </Text>
          <View style={{ flexDirection: 'row', gap: space.m, marginTop: space.x5 }}>
            <Button label="Done" kind="ghost" size="large" grow onPress={onClose} />
            <Button
              label="View game"
              kind="light"
              size="large"
              grow
              onPress={() => {
                onClose();
                router.push({ pathname: '/game/[id]', params: { id } });
              }}
            />
          </View>
        </View>
      ) : null}
    </MorphingModal>
  );
}
