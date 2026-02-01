import { useTranslation } from 'react-i18next';
import { StyledTopTabs } from '@/components/navigation/styled-top-tabs';
import Matchs from '@/screens/matchs';

export default function MatchsScreen() {
  const { t } = useTranslation();

  return (
    <StyledTopTabs
      screenOptions={{
        title: t('liste_matchs_navigation_title'),
        tabBarScrollEnabled: true,
      }}
      tabBarClassName="bg-custom-background"
      tabBarIndicatorClassName="bg-custom-bg-inverse"
    >
      <Matchs />
    </StyledTopTabs>
  );
}
