import React from 'react'
import { StyleSheet, View, Button } from 'react-native'
import { connect } from 'react-redux'


class ParametresTournoi extends React.Component {
  _showMatchs() {
    this.props.navigation.goBack();   
  }

  _supprimerTournoi() {
    const suppressionAllJoueurs = { type: "SUPPR_ALL_JOUEURS" }
    this.props.dispatch(suppressionAllJoueurs);
    const suppressionAllMatchs = { type: "SUPPR_MATCHS"}
    this.props.dispatch(suppressionAllMatchs);
    this.props.navigation.navigate('AccueilGeneral')
  }

  render() {
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container}>
          <View style={styles.menu_container}>
            <View style={styles.buttonView}>
              <Button color='red' title='Supprimer le tournoi' onPress={() => this._supprimerTournoi()}/>
            </View>
            <View style={styles.buttonView}>
              <Button title='Retourner à la liste des parties' onPress={() => this._showMatchs()}/>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  body_container : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonView: {
    marginBottom: 60
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs,
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ParametresTournoi)