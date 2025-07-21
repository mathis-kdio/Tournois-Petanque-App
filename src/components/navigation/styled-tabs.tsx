import { TextStyle, ViewStyle } from 'react-native';
import { Tabs } from 'expo-router';
import { cssInterop } from 'nativewind';

const StyledTabsImpl = ({
  tabBarStyle,
  tabBarActiveTintColor,
  headerStyle,
  ...props
}: React.ComponentProps<typeof Tabs> & {
  tabBarStyle?: ViewStyle;
  tabBarActiveTintColor?: TextStyle;
  headerStyle?: ViewStyle;
}) => {
  props.screenOptions = {
    ...props.screenOptions,
    tabBarStyle: { backgroundColor: 'var(--color-custom-background)' },
    tabBarActiveTintColor: 'var(--color-custom-bg-inverse)',
    headerStyle: { backgroundColor: 'var(--color-custom-background)' },
  };
  return <Tabs {...props} />;
};

export const StyledTabs = cssInterop(StyledTabsImpl, {
  tabBarClassName: 'tabBarStyle',
  tabBarActiveTintColorClassName: 'tabBarActiveTintColor',
  headerClassName: 'headerStyle',
});
