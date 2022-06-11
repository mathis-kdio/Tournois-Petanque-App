import React from 'react'
import { StyleSheet, View, Button, Text } from 'react-native'

class ChoixTypeTournoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View style={styles.button_container}>
            <Text style={styles.texte}>Choisissez vos équipes ou laisser la génération aléatoire. En tête-à-tête, doublettes ou triplettes :</Text>
            <Button title='Mode Mélé-Démélé' onPress={() => this.props.navigation.navigate({name: 'ChoixModeTournoi'})} color="#1c3969"/>
          </View>
          <View style={styles.button_container}>
            <Text style={styles.texte}>Tous les joueurs se rencontrent à un moment dans le tournoi :</Text>
            <Button title='Mode Championnat (en test)' onPress={() => this.props.navigation.navigate({name: 'ChoixModeTournoi'})} color="#1c3969"/>
          </View>
          <View style={styles.button_container}>
            <Text style={styles.texte}>PROCHAINEMENT</Text>
            <Button color="#1c3969" disabled={true} title='Mode Coupe (prochainement)' onPress={() => this.props.navigation.navigate({name: 'ChoixModeTournoi'})} />
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

export default ChoixTypeTournoi