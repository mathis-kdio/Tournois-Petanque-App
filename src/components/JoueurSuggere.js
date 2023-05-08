import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Text, Alert } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import JoueurType from '@components/JoueurType'

class JoueurSuggere extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      joueurType: undefined,
    }
  }

  _modalRemovePlayer(playerId) {
    Alert.alert(
      "Supprimer le joueur des suggestions",
      "Êtes-vous sûr de vouloir supprimer définitivement ce joueur des suggestions ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "Oui", onPress: () => this._removePlayer(playerId) },
      ],
      { cancelable: true }
    );
  }

  _removePlayer(playerId) {
    const actionSuppr = {type: "SUPPR_JOUEUR", value: ["historique", playerId]};
    this.props.dispatch(actionSuppr);
  }

  _addPlayer(playerName) {
    let equipe = undefined;
    if (this.props.optionsTournoi.typeEquipes == "teteatete") {
      equipe = this.props.listesJoueurs.avecEquipes.length + 1;
    }
    const action = { type: "AJOUT_JOUEUR", value: [this.props.optionsTournoi.mode, playerName, this.state.joueurType, equipe] };
    this.props.dispatch(action);
  }

  _setJoueurType(type) {
    this.setState({
      joueurType: type
    })
  }

  render() {
    const { joueur } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          <Text style={styles.name_text}>{joueur.name}</Text>
        </View>
        <View style={styles.type_container}>
          <JoueurType
            joueurType={this.state.joueurType}
            _setJoueurType={(type) => this._setJoueurType(type)}
          />
        </View>
        <View style={styles.button_container}>
          <FontAwesome5.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._modalRemovePlayer(joueur.id)}/>
        </View>
        <View style={styles.button_container}>
          <FontAwesome5.Button name="plus" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._addPlayer(joueur.name)}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 10,
    paddingBottom: 2,
    marginBottom: 2,
  },
  name_container: {
    flex: 2,
  },
  name_text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  type_container: {
    flex: 2,
  },
  button_container: {
    marginLeft: 5
  }
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(JoueurSuggere)