import { TextInput, View } from 'react-native';

import { bodyFamily, color, radius, size, space, textStyle } from '@/theme';

import { Icon } from './Icon';

/** Search input with the magnifier. Filters as you type. */
export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <View
      style={{
        height: size.field,
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
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={color.faint}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel={placeholder}
        style={{ flex: 1, height: '100%', color: color.ink, fontFamily: bodyFamily.medium, fontSize: textStyle.body.size }}
      />
    </View>
  );
}
