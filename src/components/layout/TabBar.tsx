import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { color, size, space } from '@/theme';

const TABS: { name: string; href: '/' | '/schedule' | '/compete' | '/explore' | '/me'; label: string; icon: IconName }[] = [
  { name: 'index', href: '/', label: 'Home', icon: 'home' },
  { name: 'schedule', href: '/schedule', label: 'Schedule', icon: 'calendar' },
  { name: 'compete', href: '/compete', label: 'Compete', icon: 'trophy' },
  { name: 'explore', href: '/explore', label: 'Explore', icon: 'map' },
  { name: 'me', href: '/me', label: 'Me', icon: 'user' },
];

type ButtonProps = TabTriggerSlotProps & { label: string; icon: IconName };

// React 19: `ref` arrives as a normal prop, so no forwardRef needed.
function TabButton({ isFocused, label, icon, ...props }: ButtonProps) {
  const tint = isFocused ? color.ink : color.faint;
  return (
    <Pressable {...(props as object)} style={{ flex: 1, alignItems: 'center', gap: space.xsm }}>
      <Icon name={icon} size={22} tint={tint} />
      <Text variant="label" size={8} weight="heavy" tint={tint} track="label">
        {label}
      </Text>
    </Pressable>
  );
}

/** Five-tab layout with the custom bottom bar from the design. */
export function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: size.tabBar,
          paddingTop: space.ml,
          backgroundColor: color.tabBar,
          borderTopWidth: 1,
          borderTopColor: color.border,
          flexDirection: 'row',
          alignItems: 'flex-start',
          zIndex: 6,
        }}>
        {TABS.map((t) => (
          <TabTrigger key={t.name} name={t.name} href={t.href} asChild>
            <TabButton label={t.label} icon={t.icon} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}
