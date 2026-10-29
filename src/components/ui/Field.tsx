import { TextInput, View, type TextInputProps } from 'react-native';

import { bodyFamily, color, radius, size, space, textStyle } from '@/theme';

import { Text } from './Text';

/**
 * Labeled text input. The label sits above, a hint or error below. Errors say
 * how to fix the input, not what went wrong (docs/COPY.md).
 */
export function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  prefix,
  secure,
  keyboard,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  /** Fixed text before the input, e.g. "@" for a username. */
  prefix?: string;
  secure?: boolean;
  keyboard?: TextInputProps['keyboardType'];
  autoComplete?: TextInputProps['autoComplete'];
}) {
  return (
    <View style={{ gap: space.s }}>
      <Text t="eyebrow" tint={color.muted}>
        {label}
      </Text>
      <View
        style={{
          height: size.large,
          paddingHorizontal: space.xl,
          borderRadius: radius.control,
          backgroundColor: color.field,
          borderWidth: 1,
          borderColor: error ? color.orangeEdge : color.borderStrong,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.xxs,
        }}>
        {prefix ? (
          <Text t="body" tint={color.dim}>
            {prefix}
          </Text>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={color.faint}
          secureTextEntry={secure}
          keyboardType={keyboard}
          autoComplete={autoComplete}
          autoCapitalize={secure || keyboard === 'email-address' || prefix ? 'none' : 'words'}
          autoCorrect={false}
          accessibilityLabel={label}
          style={{ flex: 1, height: '100%', color: color.ink, fontFamily: bodyFamily.medium, fontSize: textStyle.lead.size }}
        />
      </View>
      {error || hint ? (
        <Text t="meta" tint={error ? color.orangeInk : color.dim}>
          {error ?? hint}
        </Text>
      ) : null}
    </View>
  );
}
