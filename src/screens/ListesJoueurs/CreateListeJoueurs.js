import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import Inscriptions from '../../components/Inscriptions';

class CreateListeJoueur extends React.Component {
  constructor(props) {
    super(props)
  }

  _dispatch(type) {
    if (type == "create") {
      const addSavedList = { type: "ADD_SAVED_LIST", value: {typeInscription: 'avecNoms', savedList: this.props.listesJoueurs.sauvegarde}};
      this.props.dispatch(addSavedList);
    }
    else if (type == "edit") {
      //const editSavedList = { type: "EDIT_SAVED_LIST", value: {typeInscription: 'avecNoms', savedList: this.props.listesJoueurs.sauvegarde}};
      //this.props.dispatch(editSavedList);
    }

    this.props.navigation.navigate('ListesJoueurs');
  }

  _submitButton() {
    let params = this.props.route.params;
    if (params) {
      let nbPlayers = this.props.listesJoueurs.sauvegarde.length;
      let title = "error";
      if (params.type == "create") {
        title = "Créer cette liste";
      }
      else if (params.type == "edit") {
        title = "Valider la modification";
      }
      return (
        <Button
          disabled={nbPlayers == 0}
          color="green"
          title={title}
          onPress={() => this._dispatch(params.type)}
        />
      )
    }
  }

  render() {
    let nbJoueurs = 0;
    if (this.props.listesJoueurs.sauvegarde) {
      nbJoueurs = this.props.listesJoueurs.sauvegarde.length;
    }
    return (
      <View style={styles.main_container}>
          <View style={styles.text_container}>
            <Text style={styles.titre}>Il y a {nbJoueurs} joueurs:</Text>
          </View>
          <Inscriptions
            navigation={this.props.navigation}
            loadListScreen={true}
          />
          <View>
            <View style={styles.buttonView}>
              {this._submitButton()}
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
    listesJoueurs: state.listesJoueurs.listesJoueurs
  }
}

export default connect(mapStateToProps)(CreateListeJoueur)