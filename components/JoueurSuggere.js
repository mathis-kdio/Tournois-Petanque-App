import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

class JoueurSuggere extends React.Component {
  constructor(props) {
    super(props)
  }

  _isSpecial = (joueurSpecial) => {
    if (joueurSpecial === true) {
      return (
        <View style={styles.special_container}>
          <Text style={styles.special_text}>Enfant</Text>
        </View>
      )
    }
  }

  _showSupprimerJoueur(joueur, supprimerJoueur) {
    return (
      <View>
          <Icon.Button name="times" backgroundColor="red" onPress={() => supprimerJoueur(joueur.id)}/>
      </View>
    )
  }

  render() {
    const { joueur, supprimerJoueur } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          <Text style={styles.name_text}>{joueur.name}</Text>
        </View>
        {/*this._isSpecial(joueur.special)*/}
        {/*this._showSupprimerJoueur(joueur, supprimerJoueur, isInscription)*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  name_container: {
    flex: 1,
  },
  name_text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  special_container: {
    marginLeft: 5,
    marginRight: 5,
  },
  special_text: {
    fontSize: 20,
    color: 'white'
  }
})

const mapStateToProps = (state) => {
  return {

  }
}

export default connect(mapStateToProps)(JoueurSuggere)