import { TextInput, View } from 'react-native';

import { color, displayFamily, space, textStyle } from '@/theme';

import { Text } from './Text';

/** A big score you type, with a label above and a line under it. */
export function ScoreField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: space.s }}>
      <Text t="eyebrow" tint={color.muted} numberOfLines={1}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.replace(/[^0-9]/g, '').slice(0, 3))}
        keyboardType="number-pad"
        placeholder="–"
        placeholderTextColor={color.grabber}
        accessibilityLabel={label + ' score'}
        style={{
          width: '100%',
          textAlign: 'center',
          color: color.ink,
          fontFamily: displayFamily.semi,
          fontSize: textStyle.statXL.size,
          paddingVertical: space.s,
          borderBottomWidth: 1.5,
          borderBottomColor: value ? color.ink : color.controlStrong,
          // Web only: no browser focus box; the underline shows the field.
          ...({ outlineStyle: 'none' } as object),
        }}
      />
    </View>
  );
}
