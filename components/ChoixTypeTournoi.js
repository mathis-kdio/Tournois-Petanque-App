import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Button, Text } from 'react-native'

class ChoixTypeTournoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _navigate(typeTournoi) {
    const updateOptionTypeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['type', typeTournoi]}
    this.props.dispatch(updateOptionTypeTournoi);
    return this.props.navigation.navigate({name: 'ChoixModeTournoi'});
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View style={styles.button_container}>
            <Text style={styles.texte}>Choisissez vos équipes ou laisser la génération aléatoire. En tête-à-tête, doublettes ou triplettes :</Text>
            <Button title='Type Mêlée-Démêlée' onPress={() => this._navigate('mele-demele')} color="#1c3969"/>
          </View>
          <View style={styles.button_container}>
            <Text style={styles.texte}>Tous les joueurs se rencontrent à un moment dans le tournoi :</Text>
            <Button title='Type Championnat' onPress={() => this._navigate('championnat')} color="#1c3969"/>
          </View>
          <View style={styles.button_container}>
            <Text style={styles.texte}>Une phase de poule puis les phases finales :</Text>
            <Button title='Type Coupe' onPress={() => this._navigate('coupe')} color="#1c3969"/>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  body_container: {
    flex: 1,
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
  button_container: {
    marginBottom: 40,
    paddingLeft: 15,
    paddingRight: 15
  },
  texte: {
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 15,
    color: 'white'
  },
})

const mapStateToProps = (state) => {
  return {
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(ChoixTypeTournoi)