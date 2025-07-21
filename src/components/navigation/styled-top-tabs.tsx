import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { cssInterop } from 'nativewind';
import React from 'react';
import { ViewStyle } from 'react-native';

const TopTab = createMaterialTopTabNavigator();

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
