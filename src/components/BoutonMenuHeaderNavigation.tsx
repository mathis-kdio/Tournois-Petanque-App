import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

const BoutonMenuHeaderNav = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  let navigator: string;

  const _showOptions = () => {
    navigation.navigate(navigator, {
      screen: 'ParametresTournoi',
    });
  };

  const _showJoueurs = () => {
    navigation.navigate(navigator, {
      screen: 'ListeJoueur',
    });
  };

  const _showPDFExport = () => {
    navigation.navigate(navigator, {
      screen: 'PDFExport',
    });
  };

  const _showAccueil = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'AccueilGeneral',
        },
      ],
    });
  };

  let parametresTournoi = listeMatchs.at(-1) as OptionsTournoi;
  navigator =
    parametresTournoi.typeTournoi === TypeTournoi.COUPE
      ? 'ListeMatchsScreen'
      : 'ListeMatchsBottom';
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
