import React from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, View, Text } from 'react-native'
import {Menu, MenuItem, MenuDivider } from 'react-native-material-menu'

class BoutonMenuHeaderNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  _hideMenu() {
    this.setState({
      visible: false,
    })
  }

  _showMenu() {
    this.setState({
      visible: true,
    })
  }

  _showSettings() {
    this._hideMenu();
    this.props.navigation.navigate('ParametresTournoi')
  };

  _showJoueurs() {
    this._hideMenu();
    this.props.navigation.navigate('ListeJoueur')
  };

  _showPDFExport() {
    this._hideMenu();
    this.props.navigation.navigate('PDFExport')
  };

  _showAccueil = () => {
    this._hideMenu();
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
      <View style={styles.main_container}>
        <Menu
          visible={this.state.visible}
          anchor={<Text onPress={() => this._showMenu()}>{t("menu")}</Text>}
          onRequestClose={() => this._hideMenu()}
        >
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={() => this._showJoueurs()}>{t("liste_joueurs")}</MenuItem>
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={() => this._showSettings()}>{t("parametres_tournoi")}</MenuItem>
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={() => this._showPDFExport()}>{t("exporter_pdf")}</MenuItem>
          <MenuDivider />
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={() => this._showAccueil()}>{t("accueil")}</MenuItem>
        </Menu>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  menuItem: {
    backgroundColor: "#1c3969",
  },
  texte_menuItem: {
    color: 'white'
  }
})

export default withTranslation()(BoutonMenuHeaderNav)