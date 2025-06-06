import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BoutonMenuHeaderNav = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const _showOptions = () => {
    router.navigate('/tournoi/parametres-tournoi');
  };

  const _showJoueurs = () => {
    router.navigate('/tournoi/joueurs-tournoi');
  };

  const _showPDFExport = () => {
    router.navigate('/tournoi/pdf-export');
  };

  const _showAccueil = () => {
    /*
    router.reset({
      index: 0,
      routes: [
        {
          name: 'AccueilGeneral',
        },
      ],
    });*/
    router.dismissAll();
    router.replace('/');
  };

  return (
    <Menu
      placement="bottom left"
      trigger={({ ...triggerProps }) => {
        return (
          <Button {...triggerProps} className="bg-[#0594ae]">
            <FontAwesome5 name="bars" size={28} color="white" />
          </Button>
        );
      }}
    >
      <MenuItem
        key="Joueurs"
        textValue={t('liste_joueurs')}
        onPress={() => _showJoueurs()}
      >
        <MenuItemLabel size="sm">{t('liste_joueurs')}</MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Options"
        textValue={t('parametres_tournoi')}
        onPress={() => _showOptions()}
      >
        <MenuItemLabel size="sm">{t('parametres_tournoi')}</MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="PDF"
        textValue={t('exporter_pdf')}
        onPress={() => _showPDFExport()}
      >
        <MenuItemLabel size="sm">{t('exporter_pdf')}</MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Accueil"
        textValue={t('accueil')}
        onPress={() => _showAccueil()}
      >
        <MenuItemLabel size="sm">{t('accueil')}</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

export default BoutonMenuHeaderNav;
