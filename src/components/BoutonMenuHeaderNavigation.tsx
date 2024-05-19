import { Menu, MenuItem, MenuItemLabel, Button, ButtonText } from '@gluestack-ui/themed';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import { TFunction } from 'i18next';
import { NavigationProp } from '@react-navigation/native';
import { MatchsStackParamList } from '@/navigation/Navigation';

export interface Props {
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  t: TFunction;
}

interface State {
}

class BoutonMenuHeaderNav extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    }
  }

  _showOptions() {
    this.props.navigation.navigate('ParametresTournoi')
  };

  _showJoueurs() {
    this.props.navigation.navigate('ListeJoueur')
  };

  _showPDFExport() {
    this.props.navigation.navigate('PDFExport')
  };

  _showAccueil = () => {
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'AccueilGeneral'
      }],
    });
  };

  render() {
    const { t } = this.props;
    return (
      <Menu
        placement='bottom left'
        trigger={({ ...triggerProps }) => {
          return (
            <Button {...triggerProps} bgColor='#0594ae'>
              <FontAwesome5 name="bars" size={28} color="white"/>
            </Button>
          )
        }}
      >
        <MenuItem key="Joueurs" textValue={t("liste_joueurs")} onPress={() => this._showJoueurs()}>
          <MenuItemLabel size='sm'>{t("liste_joueurs")}</MenuItemLabel>
        </MenuItem>
        <MenuItem key="Options" textValue={t("parametres_tournoi")} onPress={() => this._showOptions()}>
          <MenuItemLabel size='sm'>{t("parametres_tournoi")}</MenuItemLabel>
        </MenuItem>
        <MenuItem key="PDF" textValue={t("exporter_pdf")} onPress={() => this._showPDFExport()}>
          <MenuItemLabel size='sm'>{t("exporter_pdf")}</MenuItemLabel>
        </MenuItem>
        <MenuItem key="Accueil" textValue={t("accueil")} onPress={() => this._showAccueil()}>
          <MenuItemLabel size='sm'>{t("accueil")}</MenuItemLabel>
        </MenuItem>
      </Menu>
    );
  }
}

export default withTranslation()(BoutonMenuHeaderNav)