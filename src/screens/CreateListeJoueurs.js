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
        <View style={styles.body_container}>
          <View>
            <Text style={styles.titre}>Liste n° : </Text>
          </View>
          <View style={styles.flatList_container}>
            <Inscriptions/>
          </View>
          <View style={styles.createBtnView}>
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
  body_container: {
    flex: 1
  },
  titre: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  flatList_container: {
    flex: 1,
    margin: 10
  },
  tournoi_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text_container: {
    flex: 1,
  },
  tournoi_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonView: {
    flex: 1,
    alignItems: 'flex-end'
  },
  createBtnView: {
    flex: 1,
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(CreateListeJoueur)