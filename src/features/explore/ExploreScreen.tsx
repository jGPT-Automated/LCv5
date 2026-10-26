import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { PageHeader } from '@/components/nav/PageHeader';
import { Screen } from '@/components/nav/Screen';
import { Glow } from '@/components/ui/Glow';
import { Icon } from '@/components/ui/Icon';
import { SectionLabel, Segmented, Tap } from '@/components/ui/controls';
import { Text } from '@/components/ui/Text';
import { courtIds, courts, type CourtId } from '@/mock/data';
import { useApp } from '@/state/AppState';
import { color, radius, space, sport } from '@/theme';

import { CourtCard } from './CourtCard';
import { CourtDrawer } from './CourtDrawer';

type Mode = 'list' | 'map';

export function ExploreScreen() {
  const { mine } = useApp();
  const [mode, setMode] = useState<Mode>('list');
  const [open, setOpen] = useState<CourtId | null>(null);
  const others = courtIds.filter((c) => !mine.includes(c));

  return (
    <View style={{ flex: 1 }}>
      <Screen
        header={
          <PageHeader
            title="Explore"
            right={
              <Segmented<Mode>
                options={[
                  ['list', 'List'],
                  ['map', 'Map'],
                ]}
                value={mode}
                onChange={setMode}
                height={30}
                size={9}
                padX={space.xl}
              />
            }
          />
        }>
        <View
          style={{
            marginTop: space.s,
            marginHorizontal: space.xxl,
            height: 42,
            paddingHorizontal: space.xl,
            borderRadius: radius.control,
            backgroundColor: color.field,
            borderWidth: 1,
            borderColor: color.border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.ml,
          }}>
          <Icon name="search" size={15} tint={color.dim} />
          <Text size={13} weight="medium" tint={color.faint}>
            Search courts
          </Text>
        </View>

        {mode === 'list' ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: space.x3, paddingHorizontal: space.xxl, paddingBottom: space.gutter }}
            showsVerticalScrollIndicator={false}>
            <SectionLabel style={{ marginHorizontal: space.xs, marginBottom: space.ml }}>{'Saved · ' + mine.length}</SectionLabel>
            <View style={{ gap: space.m }}>
              {mine.map((c) => (
                <CourtCard key={c} id={c} onOpen={() => setOpen(c)} />
              ))}
            </View>
            {others.length ? (
              <>
                <SectionLabel style={{ marginHorizontal: space.xs, marginTop: space.x4, marginBottom: space.ml }}>Near you</SectionLabel>
                <View style={{ gap: space.m }}>
                  {others.map((c) => (
                    <CourtCard key={c} id={c} onOpen={() => setOpen(c)} />
                  ))}
                </View>
              </>
            ) : null}
          </ScrollView>
        ) : (
          <MapPlaceholder onPick={setOpen} />
        )}
      </Screen>
      <CourtDrawer id={open} onClose={() => setOpen(null)} />
    </View>
  );
}

/** Stand-in map texture with court pins. A real map comes in a later chunk. */
function MapPlaceholder({ onPick }: { onPick: (c: CourtId) => void }) {
  const { d } = useApp();
  return (
    <View style={{ flex: 1, marginTop: space.l, borderTopWidth: 1, borderTopColor: color.divider, backgroundColor: color.quiet, overflow: 'hidden' }}>
      <Glow rgb={sport.bb.glowRGB} alpha={0.12} rx="60%" ry="50%" stop={0.7} />
      <Svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" pointerEvents="none">
        <Defs>
          <Pattern id="streetsA" width={41} height={41} patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
            <Line x1={40} y1={0} x2={40} y2={41} stroke={color.ink} strokeOpacity={0.04} strokeWidth={1} />
          </Pattern>
          <Pattern id="streetsB" width={53} height={53} patternUnits="userSpaceOnUse" patternTransform="rotate(147)">
            <Line x1={52} y1={0} x2={52} y2={53} stroke={color.ink} strokeOpacity={0.035} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#streetsA)" />
        <Rect width="100%" height="100%" fill="url(#streetsB)" />
      </Svg>
      {courtIds.map((id) => {
        const c = courts[id];
        const n = d.liveCount(id);
        const sz = n ? 28 : 16;
        return (
          <Tap
            key={id}
            onPress={() => onPick(id)}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
              alignItems: 'center',
              gap: space.s,
            }}>
            <View
              style={{
                minWidth: sz,
                height: sz,
                paddingHorizontal: space.s,
                borderRadius: radius.pill,
                backgroundColor: n ? color.orange : sport[c.sport].dot,
                borderWidth: 2,
                borderColor: color.bg,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: n ? `0 0 0 7px ${color.orangeRing}, 0 10px 35px ${color.shadow}` : `0 6px 18px ${color.shadow}`,
              }}>
              {n ? (
                <Text variant="display" size={13} tint={color.onBright}>
                  {String(n)}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                paddingVertical: space.xxs,
                paddingHorizontal: space.sm,
                borderRadius: radius.pill,
                backgroundColor: color.pillBg,
                borderWidth: 1,
                borderColor: color.borderStrong,
              }}>
              <Text variant="label" size={8} track="wider" numberOfLines={1}>
                {c.name}
              </Text>
            </View>
          </Tap>
        );
      })}
    </View>
  );
}
