import { useTranslation } from 'react-i18next';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import ListeMatchs from '@components/matchs/liste-matchs';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyledTopTabs } from '@/components/navigation/styled-top-tabs';
import { useEffect, useState } from 'react';
import { useTournois } from '@/repositories/tournois/useTournois';
import { TournoiModel } from '@/types/interfaces/tournoi';
import Loading from '@/components/Loading';

export default function MatchsPage() {
  const { t } = useTranslation();

  const { Screen } = createMaterialTopTabNavigator();

  const { getActualTournoi } = useTournois();

  const [tournoi, setTournoi] = useState<TournoiModel | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const resultTournoi = await getActualTournoi();
      setTournoi(resultTournoi);
    };
    fetchData();
  }, [getActualTournoi]);

  if (!tournoi) {
    return <Loading />;
  }

  const { matchs, options } = tournoi;

  const TopTabScreens = () => {
    let topTabScreenListe = [];
    for (let i = 0; i < options.nbTours; i++) {
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
    let title = `${t('tour')} ${numero}`;
    if (options.typeTournoi === TypeTournoi.COUPE) {
      const mancheName = matchs.find((el) => el.manche === numero)?.mancheName;
      if (mancheName === undefined) {
        throw Error;
      }
      title = mancheName;
    }

    let iconColor = '#ffda00';
    let textColor = 'text-yellow-400';
    let iconName = 'battery-half';
    let matchsManche = matchs.filter((match) => match.manche === numero);
    let matchsRestant = matchsManche.length;
    if (matchsManche) {
      let count = matchsManche.reduce(
        (acc, obj) =>
          obj.score1 !== undefined && obj.score2 !== undefined
            ? (acc += 1)
            : acc,
        0,
      );
      if (count === matchsManche.length) {
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

    return (
      <HStack className="items-center">
        <Text className="text-typography-white text-lg mr-2">{title}</Text>
        <FontAwesome5 name={iconName} size={20} color={iconColor} />
        <Text className={`${textColor} ml-1`} size="xl">
          {matchsRestant.toString()}
        </Text>
      </HStack>
    );
  };

  return (
    <StyledTopTabs
      screenOptions={{
        title: t('liste_matchs_navigation_title'),
        tabBarScrollEnabled: true,
      }}
      tabBarClassName="bg-custom-background"
      tabBarIndicatorClassName="bg-custom-bg-inverse"
    >
      {TopTabScreens()}
    </StyledTopTabs>
  );
}
