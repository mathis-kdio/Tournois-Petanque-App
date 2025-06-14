import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import BoutonMenuHeaderNav from '@/components/BoutonMenuHeaderNavigation';
import { Text } from '@/components/ui/text';
import { Tournoi } from '@/types/interfaces/tournoi';
import { captureMessage } from '@sentry/react-native';
import { useSelector } from 'react-redux';

export default function TabLayout() {
  const { t } = useTranslation();

  const listeTournois = useSelector(
    (state: any) => state.listeTournois.listeTournois,
  );
  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  const getTournoiName = () => {
    let tournoiName = '';
    if (listeTournois !== undefined && listeMatchs !== undefined) {
      let tournoiId = listeMatchs.at(-1).tournoiID;
      let tournoi = listeTournois.find(
        (element: Tournoi) => element.tournoiId === tournoiId,
      );
      if (tournoi) {
        tournoiName =
          tournoi.name !== undefined ? tournoi.name : 'n°' + tournoi.tournoiId;
      } else {
        captureMessage(`ID du tournoi : ${tournoiId}`, 'warning');
      }
    }
    return tournoiName;
  };

  let tournoiName = getTournoiName();

  return (
    <Tabs
      initialRouteName="matchs"
      backBehavior="none"
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0594ae' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: { fontSize: 15 },
        headerStyle: { backgroundColor: '#0594ae', elevation: 0 },
      }}
    >
      <Tabs.Screen
        name="resultats"
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Text className="text-white text-xl ml-2">
              {t('tournoi')} {tournoiName}
            </Text>
          ),
          headerRight: () => <BoutonMenuHeaderNav />,
          tabBarLabel: t('resultats_classement_navigation_title'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="trophy" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matchs"
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Text className="text-white text-xl ml-2">
              {t('tournoi')} {tournoiName}
            </Text>
          ),
          headerRight: () => <BoutonMenuHeaderNav />,
          tabBarLabel: t('matchs_details_navigation_title'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bars" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
