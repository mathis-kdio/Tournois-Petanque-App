import React from 'react'
import { StyleSheet, View, Text, Button, FlatList } from 'react-native'
import { connect } from 'react-redux'
import ListeJoueursItem from '@components/ListeJoueursItem';
import { withTranslation } from 'react-i18next';

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
      params: { type: "create" }
    })
  }

  _addListButton() {
    const { t } = this.props;
    if (this.props.route.params == undefined || this.props.route.params.loadListScreen != true) {
      return(
        <Button color="green" title={t("creer_liste")} onPress={() => this._addList()}/>
      )
    }
  }

  render() {
    const { t } = this.props;
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
            <Text style={styles.title}>{t("nombre_listes", {nb: nbLists})}</Text>
          </View>
          <View style={styles.createBtnView}>
            {this._addListButton()}
          </View>
          <View style={styles.flatList_container}>
          <FlatList
              data={this.props.savedLists.avecNoms}
              initialNumToRender={20}
              keyExtractor={(item) => item[item.length - 1].listId.toString() }
              renderItem={({item}) => (
                <ListeJoueursItem
                  list={item}
                  navigation={this.props.navigation}
                  route={this.props.route}
                />
              )}
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
  createBtnView: {
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => {
  return {
    savedLists: state.listesJoueurs.listesSauvegarde
  }
}

export default connect(mapStateToProps)(withTranslation()(ListesJoueurs))