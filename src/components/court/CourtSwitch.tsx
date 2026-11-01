import { Tap } from '@/components/ui/controls';
import { Icon } from '@/components/ui/Icon';
import { Menu } from '@/components/ui/Menu';
import { Dot } from '@/components/ui/surfaces';
import { Text } from '@/components/ui/Text';
import { courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, size, space, sport } from '@/theme';

/** The court picker in a tab's header (Schedule, Compete): sport dot, court name, chevron. */
export function CourtSwitchButton({ court, onPress }: { court: CourtId; onPress: () => void }) {
  return (
    <Tap onPress={onPress} label="Switch court" style={{ height: size.compact, flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
      <Dot tint={sport[courts[court].sport].dot} />
      <Text t="section">{courts[court].name}</Text>
      <Icon name="chevronDown" size={10} tint={color.muted} />
    </Tap>
  );
}

/** Saved courts to switch between. Shares the selection with Home. */
export function CourtMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mine, homeIndex, setHomeIndex, d } = useApp();
  return (
    <Menu
      open={open}
      onClose={onClose}
      title="Saved courts"
      top={0}
      items={mine.map((c, k) => ({
        key: c,
        label: courts[c].name,
        leading: <Dot tint={sport[courts[c].sport].dot} />,
        trailing: d.liveCount(c) ? d.liveCount(c) + ' live' : undefined,
        selected: k === homeIndex,
        onPress: () => {
          setHomeIndex(k);
          onClose();
        },
      }))}
    />
  );
}
