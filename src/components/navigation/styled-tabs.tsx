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
    tabBarStyle,
    tabBarActiveTintColor: tabBarActiveTintColor?.color?.toString(),
    headerStyle,
  };
  return <Tabs {...props} />;
};

export const StyledTabs = cssInterop(StyledTabsImpl, {
  tabBarClassName: 'tabBarStyle',
  tabBarActiveTintColorClassName: 'tabBarActiveTintColor',
  headerClassName: 'headerStyle',
});
