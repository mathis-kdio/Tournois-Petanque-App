import { createNavigatorFactory } from 'expo-router/react-navigation';
import {
  MaterialTopTabNavigationOptions,
  MaterialTopTabView,
} from 'expo-router/js-top-tabs';
import { cssInterop } from 'nativewind';
import React from 'react';
import { ViewStyle } from 'react-native';

const TopTab = createNavigatorFactory(MaterialTopTabView)();

const StyledTopTabsImpl = ({
  tabBarStyle,
  tabBarIndicatorStyle,
  ...props
}: React.ComponentProps<typeof TopTab.Navigator> & {
  tabBarStyle?: ViewStyle;
  tabBarIndicatorStyle?: ViewStyle;
}) => {
  props.screenOptions = {
    ...props.screenOptions,
    tabBarStyle,
    tabBarIndicatorStyle,
  } as MaterialTopTabNavigationOptions;

  return <TopTab.Navigator {...props} />;
};

export const StyledTopTabs = cssInterop(StyledTopTabsImpl, {
  tabBarClassName: 'tabBarStyle',
  tabBarIndicatorClassName: 'tabBarIndicatorStyle',
});
