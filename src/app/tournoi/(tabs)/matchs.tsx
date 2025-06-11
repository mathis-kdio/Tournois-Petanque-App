import { useTranslation } from 'react-i18next';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Match } from '@/types/interfaces/match';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useSelector } from 'react-redux';
import ListeMatchs from '@components/matchs/liste-matchs';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { FontAwesome5 } from '@expo/vector-icons';

export default function MatchsPage() {
  const { t } = useTranslation();

  const { Navigator, Screen } = createMaterialTopTabNavigator();

  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  const TopTabScreens = () => {
    let nbTours = 5;
    if (listeMatchs !== undefined) {
      nbTours = listeMatchs.at(-1).nbTours;
    }
    let topTabScreenListe = [];
    for (let i = 0; i < nbTours; i++) {
      topTabScreenListe.push(
        <Screen
          key={i}
          name={`tour-${i + 1}`}
          options={{
            tabBarLabel: () => TopTabItemLabel(i + 1),
          }}
          children={() => <ListeMatchs mancheNumber={i + 1} />}
        />,
      );
    }
    return topTabScreenListe;
  };

  const TopTabItemLabel = (numero: number) => {
    let title = 'Tour ' + numero;
    if (listeMatchs && listeMatchs.at(-1).typeTournoi === TypeTournoi.COUPE) {
      title = listeMatchs.find((el) => el.manche === numero).mancheName;
    }

    let iconColor = '#ffda00';
    let textColor = 'text-yellow-400';
    let iconName = 'battery-half';
    let matchsRestant = 0;
    if (listeMatchs) {
      let matchs: Match[] = listeMatchs.filter(
        (el: Match) => el.manche === numero,
      );
      matchsRestant = matchs.length;
      if (matchs) {
        let count = matchs.reduce(
          (acc, obj) =>
            obj.score1 !== undefined && obj.score2 !== undefined
              ? (acc += 1)
              : acc,
          0,
        );
        if (count === matchs.length) {
          textColor = 'text-success-500';
          iconColor = 'green';
          iconName = 'battery-full';
        } else if (count === 0) {
          textColor = 'text-error-500';
          iconColor = 'red';
          iconName = 'battery-empty';
        }
        matchsRestant -= count;
      }
    }

    return (
      <HStack className="items-center">
        <Text className="text-white text-lg mr-2">{title}</Text>
        <FontAwesome5 name={iconName} size={20} color={iconColor} />
        <Text className={`${textColor} ml-1`} size="xl">
          {matchsRestant.toString()}
        </Text>
      </HStack>
    );
  };

  return (
    <Navigator
      screenOptions={{
        title: t('liste_matchs_navigation_title'),
        tabBarScrollEnabled: true,
        tabBarStyle: { backgroundColor: '#0594ae' },
        tabBarIndicatorStyle: { backgroundColor: 'white' },
      }}
    >
      {TopTabScreens()}
    </Navigator>
  );
}
