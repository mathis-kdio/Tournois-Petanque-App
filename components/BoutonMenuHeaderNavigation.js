import React from 'react';
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
      index: 1,
      routes: [{
        name: 'AccueilGeneral'
      }],
    });
  };

  render() {
    return (
      <View style={styles.main_container}>
        <Menu
          visible={this.state.visible}
          anchor={<Text onPress={() => this._showMenu()}>Menu</Text>}
          onRequestClose={() => this._hideMenu()}
        >
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={() => this._showJoueurs()}>Liste des joueurs</MenuItem>
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={() => this._showSettings()}>Paramètres du tournoi</MenuItem>
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={() => this._showPDFExport()}>Exporter en PDF</MenuItem>
          <MenuDivider />
          <MenuItem style={styles.menuItem} textStyle={styles.texte_menuItem} onPress={() => this._showAccueil()}>Accueil</MenuItem>
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