import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Text } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Icon from 'react-native-vector-icons/FontAwesome'

class JoueurSuggere extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSpecial: false,
    }
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
    const action = { type: "AJOUT_JOUEUR", value: [this.props.optionsTournoi.mode, playerName, this.state.isSpecial, equipe] };
    this.props.dispatch(action);
  }

  render() {
    const { joueur } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          <Text style={styles.name_text}>{joueur.name}</Text>
        </View>
        <View style={styles.special_container}>
          <BouncyCheckbox
            onPress={()=>{
              this.setState({
                isSpecial: !this.state.isSpecial
              })
            }}
            disableBuiltInState="true"
            isChecked={this.state.isSpecial}
            text="Enfant"
            textStyle={{color: "white", fontSize: 15, textDecorationLine: "none"}}
            fillColor="white"
          />
        </View>
        <View style={styles.button_container}>
          <Icon.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._removePlayer(joueur.id)}/>
        </View>
        <View style={styles.button_container}>
          <Icon.Button name="plus" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._addPlayer(joueur.name)}/>
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
  special_container: {
    flex: 1,
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