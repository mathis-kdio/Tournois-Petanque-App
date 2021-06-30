import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu'

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
        <Menu
          ref={this.setMenuRef}
          button={<Text onPress={this.showMenu}>Menu</Text>}
        >
          <MenuItem onPress={this.showJoueurs}>Liste des joueurs</MenuItem>
          <MenuItem onPress={this.showSettings}>Paramètres du tournois</MenuItem>
          <MenuDivider />
          <MenuItem onPress={this.showAccueil}>Accueil</MenuItem>
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
})

export default BoutonMenuHeaderNav