import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const LoadSavedListButton = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const loadSavedList = () => {
    router.navigate({
      pathname: '/listes-joueurs',
      params: {
        loadListScreen: 'true',
      },
    });
  };

  return (
    <Button action="primary" onPress={loadSavedList}>
      <ButtonText>{t('charger_liste_joueurs_bouton')}</ButtonText>
    </Button>
  );
};

export default LoadSavedListButton;
