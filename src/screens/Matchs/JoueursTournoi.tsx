import React from 'react'
import ListeJoueurItem from '@components/ListeJoueurItem'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ButtonText, VStack, Button, Text, Box, FlatList } from '@gluestack-ui/themed'
import TopBarBack from '@components/TopBarBack'
import { StackNavigationProp } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { Joueur } from '@/types/interfaces/joueur'
import { PropsFromRedux, connector } from '@/store/connector'
import { ListRenderItem } from 'react-native'
import { ModeTournoi } from '@/types/enums/modeTournoi'
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi'

export interface Props extends PropsFromRedux {
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

  _displayListeJoueur(optionsTournoi: OptionsTournoi) {
    if (optionsTournoi.listeJoueurs !== undefined) {
      const renderItem: ListRenderItem<Joueur> = ({item}) => (
        <ListeJoueurItem
          joueur={item}
          isInscription={false}
          avecEquipes={optionsTournoi.mode == ModeTournoi.AVECEQUIPES}
          typeEquipes={optionsTournoi.typeEquipes}
          nbJoueurs={optionsTournoi.listeJoueurs.length}
          showCheckbox={true}
        />
      );

      return (
        <FlatList
          removeClippedSubviews={false}
          data={optionsTournoi.listeJoueurs}
          keyExtractor={(item: Joueur) => item.id.toString() }
          renderItem={renderItem}
        />
      )
    }
  }

  render() {
    const { t } = this.props;
    let optionsTournoi = this.props.listeMatchs.at(-1) as OptionsTournoi;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor={"#0594ae"}>
          <TopBarBack title={t("liste_joueurs_inscrits_navigation_title")} navigation={this.props.navigation}/>
          <Text color='$white' fontSize={'$xl'} textAlign='center'>{t("nombre_joueurs", {nb: optionsTournoi.listeJoueurs.length})}</Text>
          <VStack flex={1} my={'$2'}>
            {this._displayListeJoueur(optionsTournoi)}
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

export default connector(withTranslation()(JoueursTournoi))