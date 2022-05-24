import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import {Menu, MenuItem, MenuDivider } from 'react-native-material-menu'

class BoutonMenuHeaderNav extends React.Component {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showSettings = () => {
    this._menu.hide();
    this.props.navigation.navigate('ParametresTournoi')
  };

  showJoueurs = () => {
    this._menu.hide();
    this.props.navigation.navigate('ListeJoueur')
  };

  showPDFExport = () => {
    this._menu.hide();
    this.props.navigation.navigate('PDFExport')
  };

  showMenu = () => {
    this._menu.show();
  };

  showAccueil = () => {
    this._menu.hide();
    this.props.navigation.navigate('AccueilGeneral')
  };

  render() {
    return (
      <View style={styles.main_container}>
        <Menu ref={this.setMenuRef} anchor={<Text onPress={this.showMenu}>Menu</Text>}>
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={this.showJoueurs}>Liste des joueurs</MenuItem>
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={this.showSettings}>Paramètres du tournoi</MenuItem>
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={this.showPDFExport}>Exporter en PDF</MenuItem>
          <MenuDivider />
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={this.showAccueil}>Accueil</MenuItem>
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

export default BoutonMenuHeaderNav