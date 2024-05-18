import React from 'react'
import { connect } from 'react-redux'
import ListeJoueurItem from '@components/ListeJoueurItem'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ButtonText, VStack, Button, Text, Box, FlatList } from '@gluestack-ui/themed'
import TopBarBack from '@components/TopBarBack'
import { StackNavigationProp } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { Joueur } from '@/types/interfaces/joueur'

export interface Props {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
}

class JoueursTournoi extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  _retourMatchs() {
    this.props.navigation.navigate('ListeMatchsStack');   
  }

  _displayListeJoueur(listeJoueurs: Joueur[]) {
    if (listeJoueurs !== undefined) {
      return (
        <FlatList
          removeClippedSubviews={false}
          data={listeJoueurs}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <ListeJoueurItem
              joueur={item}
              isInscription={false}
              showCheckbox={true}
            />
          )}
        />
      )
    }
  }

  render() {
    const { t } = this.props;
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor={"#0594ae"}>
          <TopBarBack title={t("liste_joueurs_inscrits_navigation_title")} navigation={this.props.navigation}/>
          <Text color='$white' fontSize={'$xl'} textAlign='center'>{t("nombre_joueurs", {nb: listeJoueurs.length})}</Text>
          <VStack flex={1} my={'$2'}>
            {this._displayListeJoueur(listeJoueurs)}
          </VStack>
          <Box px={'$10'} mb={'$2'}>
            <Button action='primary' onPress={() => this._retourMatchs()}>
              <ButtonText>{t("retour_liste_matchs_bouton")}</ButtonText>
            </Button>
          </Box>
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(JoueursTournoi))