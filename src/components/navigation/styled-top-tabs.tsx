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
  ...props
}: React.ComponentProps<typeof TopTab.Navigator> & {
  tabBarStyle?: ViewStyle;
  tabBarIndicatorStyle?: ViewStyle;
}) => {
  props.screenOptions = {
    ...props.screenOptions,
    tabBarStyle: { backgroundColor: 'var(--color-custom-background)' },
    tabBarIndicatorStyle: {
      backgroundColor: 'var(--color-custom-bg-inverse)',
    },
  } as MaterialTopTabNavigationOptions;

  return <TopTab.Navigator {...props} />;
};

export const StyledTopTabs = cssInterop(StyledTopTabsImpl, {
  tabBarClassName: 'tabBarStyle',
  tabBarIndicatorClassName: 'tabBarIndicatorStyle',
});
