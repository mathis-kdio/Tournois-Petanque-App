import { useTranslation } from 'react-i18next';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

export default function TabLayout() {
  const { t } = useTranslation();

  const { Navigator } = createMaterialTopTabNavigator();

  const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
  >(Navigator);

  return (
    <MaterialTopTabs
      //initialRouteName="Screen1Manche"
      screenOptions={{
        title: t('liste_matchs_navigation_title'),
        tabBarScrollEnabled: true,
        tabBarStyle: { backgroundColor: '#0594ae' },
        tabBarIndicatorStyle: { backgroundColor: 'white' },
        //Code temporaire lié au BUG : https://github.com/nativewind/nativewind/issues/1039
        tabBarContentContainerStyle: {
          flexDirection: 'row',
          justifyContent: 'space-around',
        },
      }}
    >
      {/*TopTabScreens()*/}
    </MaterialTopTabs>
  );
}
