import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectSource } from './check-design-system.mjs';

const screen = 'src/features/example/ExampleScreen.tsx';
test('shared components and layout composition pass', () => {
  assert.deepEqual(inspectSource(screen, `import { View } from 'react-native';
    import { Text } from '@/components/ui/Text';
    const Page = () => <View style={{ gap: space.m }}><Text size={14}>Hello</Text></View>;`), []);
});
test('native controls cannot bypass shared owners through import aliases', () => {
  for (const name of ['Text', 'Pressable', 'Button', 'Switch', 'TextInput', 'Modal']) {
    assert.equal(inspectSource(screen, `import { ${name} as Custom } from 'react-native';`).length, 1);
  }
});
test('namespace and default imports cannot hide native controls', () => {
  assert.equal(inspectSource(screen, `import * as Native from 'react-native';`).length, 1);
  assert.equal(inspectSource(screen, `import Native from 'react-native';`).length, 1);
});
test('type-only imports are permitted', () => {
  assert.deepEqual(inspectSource(screen, `import type * as Native from 'react-native';
    import { type Text, View } from 'react-native';`), []);
});
test('native adapters remain narrow', () => {
  assert.deepEqual(inspectSource('src/components/ui/Text.tsx', `import { Text as RNText } from 'react-native';`), []);
  assert.equal(inspectSource('src/components/ui/Text.tsx', `import { Switch } from 'react-native';`).length, 1);
});
test('local typography overrides fail even when token-valued', () => {
  assert.equal(inspectSource(screen, `const styles = { fontFamily: font.body, 'fontSize': 14 };`).length, 2);
  assert.deepEqual(inspectSource('src/components/ui/Text.tsx', `const style = {fontFamily: family, fontSize: size};`), []);
  assert.deepEqual(inspectSource('src/theme/type.ts', `const body = {fontSize: 14};`), []);
});
test('legacy Home controls cannot grow beyond the existing two', () => {
  const code = `import { Pressable as P } from 'react-native'; const a = <><P/><P/></>;`;
  assert.deepEqual(inspectSource('src/features/home/HomeScreen.tsx', code), []);
  assert.equal(inspectSource('src/features/home/HomeScreen.tsx', code + 'const b = <P/>;').length, 1);
  assert.equal(inspectSource(screen, code).length, 1);
});
