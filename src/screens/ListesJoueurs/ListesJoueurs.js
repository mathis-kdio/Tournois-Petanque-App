import React from 'react'
import { connect } from 'react-redux'
import ListeJoueursItem from '@components/ListeJoueursItem';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, Text, Button, FlatList, ButtonText, Box } from '@gluestack-ui/themed';
import TopBarBack from '../../components/TopBarBack';

class ListesJoueurs extends React.Component {

  constructor(props) {
    super(props)
  }

  _addList() {
    const actionRemoveList = {type: "SUPPR_ALL_JOUEURS", value: ['sauvegarde']};
    this.props.dispatch(actionRemoveList);
    //Sera utilisé par le component inscription 
    const updateOptionTypeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['type', 'mele-demele']};
    this.props.dispatch(updateOptionTypeTournoi);
    const updateOptionEquipesTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeEquipes', 'teteatete']};
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', 'sauvegarde']};
    this.props.dispatch(updateOptionModeTournoi);

    this.props.navigation.navigate({
      name: 'CreateListeJoueurs',
      params: { type: "create" }
    });
  }

  _addListButton() {
    const { t } = this.props;
    if (this.props.route.params == undefined || this.props.route.params.loadListScreen != true) {
      return(
        <Button action='positive' onPress={() => this._addList()}>
          <ButtonText>{t("creer_liste")}</ButtonText>
        </Button>
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
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor={"#0594ae"}>
          <TopBarBack title={t("listes_joueurs_navigation_title")} navigation={this.props.navigation}/>
          <Text color='$white' fontSize={'$xl'} textAlign='center'>{t("nombre_listes", {nb: nbLists})}</Text>
          <Box px={'$10'}>
            {this._addListButton()}
          </Box>
          <VStack flex={1} my={'$2'}>
            <FlatList
              data={this.props.savedLists.avecNoms}
              initialNumToRender={20}
              keyExtractor={(item) => item[item.length - 1].listId.toString()}
              renderItem={({item}) => (
                <ListeJoueursItem
                  list={item}
                  navigation={this.props.navigation}
                  route={this.props.route}
                />
              )}
            />
          </VStack>
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    savedLists: state.listesJoueurs.listesSauvegarde
  }
}

export default connect(mapStateToProps)(withTranslation()(ListesJoueurs))