import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from 'expo-router/js-top-tabs';
import { styled } from 'nativewind';
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

export const StyledTopTabs = styled(StyledTopTabsImpl, {
  tabBarClassName: 'tabBarStyle',
  tabBarIndicatorClassName: 'tabBarIndicatorStyle',
});
