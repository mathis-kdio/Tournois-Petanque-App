import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import Inscriptions from '../../components/Inscriptions';

class CreateListeJoueur extends React.Component {

  constructor(props) {
    super(props)
  }

  _createList() {
    this.props.navigation.navigate('ListesJoueurs');
  }

  render() {
    return (
      <View style={styles.main_container}>
          <View style={styles.text_container}>
            <Text style={styles.titre}>Liste n° : </Text>
          </View>
          <Inscriptions
            typeEquipes={'teteatete'}
            typeInscription={'avecNoms'}
            avecEquipes={false}
          />
          <View>
            <View style={styles.buttonView}>
              <Button color="green" title="Valider la liste" onPress={() => this._createList()}/>
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
  titre: {
    fontSize: 20,
    color: 'white'
  },
  text_container: {
    alignItems: 'center',
    marginTop: 5
  },
  buttonView: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(CreateListeJoueur)