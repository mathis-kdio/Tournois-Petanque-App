import BoutonMenuHeaderNav from '@/components/BoutonMenuHeaderNavigation';
import { StyledTabs } from '@/components/navigation/styled-tabs';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import { useTournois } from '@/repositories/tournois/useTournois';
import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  const { theme } = useTheme();

  const { actualTournoi } = useTournois();

  if (!actualTournoi) {
    return;
  }

  const { name, tournoiId } = actualTournoi;

  const tournoiName = name !== undefined ? name : `n° ${tournoiId}`;
  const tabBarInactiveTintColor = theme === 'default' ? 'black' : 'grey';

  return (
    <StyledTabs
      initialRouteName="matchs"
      backBehavior="none"
      screenOptions={{
        tabBarInactiveTintColor,
        tabBarLabelStyle: { fontSize: 15 },
      }}
      headerClassName="bg-custom-background"
      tabBarActiveTintColorClassName="color-custom-bg-inverse"
      tabBarClassName="bg-custom-background"
    >
      <Tabs.Screen
        name="resultats"
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Text className="text-typography-white text-xl ml-2">
              {`${t('tournoi')} ${tournoiName}`}
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
            <Text className="text-typography-white text-xl ml-2">
              {`${t('tournoi')} ${tournoiName}`}
            </Text>
          ),
          headerRight: () => <BoutonMenuHeaderNav />,
          tabBarLabel: t('matchs_details_navigation_title'),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bars" size={28} color={color} />
          ),
        }}
      />
    </StyledTabs>
  );
}
