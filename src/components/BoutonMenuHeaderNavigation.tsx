import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Pressable } from '@/components/ui/pressable';
import { FontAwesome5 } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const BoutonMenuHeaderNav = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  const showOptions = () => {
    router.navigate('/tournoi/parametres-tournoi');
  };

  const showJoueurs = () => {
    router.navigate('/tournoi/joueurs-tournoi');
  };

  const showPDFExport = () => {
    router.navigate('/tournoi/pdf-export');
  };

  const showAccueil = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'index' }],
      }),
    );
  };

  return (
    <Menu
      placement="bottom left"
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable {...triggerProps} className="mr-10">
            <FontAwesome5
              name="bars"
              size={28}
              className="text-custom-bg-inverse"
            />
          </Pressable>
        );
      }}
    >
      <MenuItem
        key="Joueurs"
        textValue={t('liste_joueurs')}
        onPress={showJoueurs}
      >
        <MenuItemLabel size="sm">{t('liste_joueurs')}</MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Options"
        textValue={t('parametres_tournoi')}
        onPress={showOptions}
      >
        <MenuItemLabel size="sm">{t('parametres_tournoi')}</MenuItemLabel>
      </MenuItem>
      <MenuItem key="PDF" textValue={t('exporter_pdf')} onPress={showPDFExport}>
        <MenuItemLabel size="sm">{t('exporter_pdf')}</MenuItemLabel>
      </MenuItem>
      <MenuItem key="Accueil" textValue={t('accueil')} onPress={showAccueil}>
        <MenuItemLabel size="sm">{t('accueil')}</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

export default BoutonMenuHeaderNav;
