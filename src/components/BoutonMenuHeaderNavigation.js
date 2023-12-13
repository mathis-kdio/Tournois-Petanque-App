import { Menu, MenuItem, MenuItemLabel, Button, ButtonText } from '@gluestack-ui/themed';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';

class BoutonMenuHeaderNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined
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
        //FIX BUG https://github.com/gluestack/gluestack-ui/issues/1431
        selectionMode='single'
        onSelectionChange={(keys) => {
          this.setState({selected: keys});
          if (keys.currentKey === 'Joueurs') {
            this._showJoueurs();
          }
          if (keys.currentKey === 'Options') {
            this._showOptions();
          }
          if (keys.currentKey === 'PDF') {
            this._showPDFExport();
          }
          if (keys.currentKey === 'Accueil') {
            this._showAccueil();
          }
        }}
        trigger={({ ...triggerProps }) => {
          return (
            <Button {...triggerProps} bgColor='#0594ae'>
              <FontAwesome5 name="bars" size={28} color="white"/>
            </Button>
          )
        }}
        closeOnSelect={true}
      >
        <MenuItem key="Joueurs" textValue={t("liste_joueurs")}>
          <MenuItemLabel size='sm'>{t("liste_joueurs")}</MenuItemLabel>
        </MenuItem>
        <MenuItem key="Options" textValue={t("parametres_tournoi")}>
          <MenuItemLabel size='sm'>{t("parametres_tournoi")}</MenuItemLabel>
        </MenuItem>
        <MenuItem key="PDF" textValue={t("exporter_pdf")}>
          <MenuItemLabel size='sm'>{t("exporter_pdf")}</MenuItemLabel>
        </MenuItem>
        <MenuItem key="Accueil" textValue={t("accueil")}>
          <MenuItemLabel size='sm'>{t("accueil")}</MenuItemLabel>
        </MenuItem>
      </Menu>
    );
  }
}

export default withTranslation()(BoutonMenuHeaderNav)