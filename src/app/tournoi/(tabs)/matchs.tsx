import { useTranslation } from 'react-i18next';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyledTopTabs } from '@/components/navigation/styled-top-tabs';
import MatchsManche from '@/screens/matchs/components/MatchsManche';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTournoisV2 } from '@/repositories/tournois/useTournois';
import Loading from '@/components/Loading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

export default function MatchsScreen() {
  const { t } = useTranslation();
  const { Screen } = createMaterialTopTabNavigator();
  const { actualTournoi } = useTournoisV2();

  if (!actualTournoi) {
    return <Loading />;
  }

  const { matchs, options } = actualTournoi;

  const getTitle = (numero: number) => {
    if (options.typeTournoi === TypeTournoi.COUPE) {
      const mancheName = matchs.find((el) => el.manche === numero)?.mancheName;
      if (mancheName === undefined) {
        throw Error;
      }
      return mancheName;
    }
    return `${t('tour')} ${numero}`;
  };

  const topTabItemLabel = (numero: number) => {
    let iconColor = '#ffda00';
    let textColor = 'text-yellow-400';
    let iconName = 'battery-half';
    const matchsManche = matchs.filter((match) => match.manche === numero);
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
        <Text className="text-typography-white text-lg mr-2">
          {getTitle(numero)}
        </Text>
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
      {Array.from({ length: options.nbTours }, (_, i) => (
        <Screen
          key={i}
          name={`tour-${i + 1}`}
          options={{
            tabBarLabel: () => topTabItemLabel(i + 1),
          }}
        >
          {() => <MatchsManche mancheNumber={i + 1} />}
        </Screen>
      ))}
    </StyledTopTabs>
  );
}
