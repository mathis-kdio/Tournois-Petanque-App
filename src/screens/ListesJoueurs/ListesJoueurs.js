import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import ListeJoueur from '../../components/ListeJoueur';

class ListesJoueurs extends React.Component {

  constructor(props) {
    super(props)
  }

  _addList() {
    const actionRemoveList = {type: "SUPPR_ALL_JOUEURS", value: ['sauvegarde']};
    this.props.dispatch(actionRemoveList);
    //Sera utilisé par le component inscription 
    const updateOptionTypeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['type', 'mele-demele']}
    this.props.dispatch(updateOptionTypeTournoi);
    const updateOptionEquipesTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeEquipes', 'teteatete']}
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', 'sauvegarde']}
    this.props.dispatch(updateOptionModeTournoi);

    this.props.navigation.navigate({
      name: 'CreateListeJoueurs',
      params: { }
    })
  }

  render() {
    let nbLists = 0;
    if (this.props.savedLists) {
      nbLists += this.props.savedLists.avecEquipes.length;
      nbLists += this.props.savedLists.avecNoms.length;
      nbLists += this.props.savedLists.sansNoms.length;
    }
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.title}>Vous avez {nbLists} listes</Text>
          </View>
          <View style={styles.createBtnView}>
            <Button color="green" title="Créer une liste" onPress={() => this._addList()}/>
          </View>
          <View style={styles.flatList_container}>
            <ListeJoueur
              savedLists={this.props.savedLists}
            />
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
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  flatList_container: {
    flex: 1,
    margin: 10
  },
  saved_list_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text_container: {
    flex: 1,
  },
  title_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonView: {
    flex: 1,
    alignItems: 'flex-end'
  },
  createBtnView: {
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => {
  return {
    savedLists: state.listesJoueurs.listesSauvegarde,
  }
}

export default connect(mapStateToProps)(ListesJoueurs)