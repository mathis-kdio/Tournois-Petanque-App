import { VStack, Button, Text, ButtonText, AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, Heading, AlertDialogCloseButton, CloseIcon, AlertDialogFooter, ButtonGroup, AlertDialogBody, ScrollView } from '@gluestack-ui/themed';
import React from 'react'
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux'
import TopBarBack from '../../components/TopBarBack';

class ParametresTournoi extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalDeleteIsOpen: false
    }
  }

  _showMatchs() {
    this.props.navigation.navigate('ListeMatchsStack');   
  }

  _supprimerTournoi() {
    const supprDansListeTournois = { type: "SUPPR_TOURNOI", value: {tournoiId: this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID}};
    this.props.dispatch(supprDansListeTournois);
    const suppressionAllMatchs = { type: "SUPPR_MATCHS"};
    this.props.dispatch(suppressionAllMatchs);
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'AccueilGeneral'
      }]
    });
  }

  _modalSupprimerTournoi() {
    const { t } = this.props;
    let tournoiId = 0;
    if (this.props.listeMatchs) {
      tournoiId = this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID;
    }
    return (
      <AlertDialog isOpen={this.state.modalDeleteIsOpen} onClose={() => this.setState({modalDeleteIsOpen: false})}>
        <AlertDialogBackdrop/>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading>{t("supprimer_tournoi_actuel_modal_titre")}</Heading>
            <AlertDialogCloseButton>
              <CloseIcon/>
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t("supprimer_tournoi_actuel_modal_texte", {id: tournoiId + 1})}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button variant='outline' action='secondary' onPress={() => this.setState({modalDeleteIsOpen: false})}>
                <ButtonText>{t("annuler")}</ButtonText>
              </Button>
              <Button action='negative' onPress={() => this._supprimerTournoi()}>
                <ButtonText>{t("oui")}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  render() {
    const { t } = this.props;
    let parametresTournoi = {nbTours: 0, nbPtVictoire: 13, speciauxIncompatibles: false, memesEquipes: false, memesAdversaires: 50};
    if (this.props.listeMatchs) {
      parametresTournoi = this.props.listeMatchs[this.props.listeMatchs.length - 1];
      parametresTournoi.nbPtVictoire = parametresTournoi.nbPtVictoire ? parametresTournoi.nbPtVictoire : 13;
    }
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView height={'$1'} bgColor='#0594ae'>
          <TopBarBack title={t("parametres_tournoi_navigation_title")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} justifyContent='space-around'>
            <VStack>
              <Text color='$white' fontSize={'$xl'} textAlign='center'>{t("options_tournoi")}</Text>
              <Text color='$white'>{t("nombre_tours")} {parametresTournoi.nbTours.toString()}</Text>
              <Text color='$white'>{t("nombre_points_victoire")} {parametresTournoi.nbPtVictoire.toString()}</Text>
              <Text color='$white'>{t("regle_speciaux")} {parametresTournoi.speciauxIncompatibles ? "Activé" : "Désactivé"}</Text>
              <Text color='$white'>{t("regle_equipes_differentes")} {parametresTournoi.memesEquipes ? "Activé" : "Désactivé"}</Text>
              <Text color='$white'>{t("regle_adversaires")} {parametresTournoi.memesAdversaires === 0 ? "1 match" : parametresTournoi.memesAdversaires+"% des matchs"}</Text>
            </VStack>
            <VStack space='xl'>
              <Button action='negative' onPress={() => this.setState({modalDeleteIsOpen: true})}>
                <ButtonText>{t("supprimer_tournoi")}</ButtonText>
              </Button>
              <Button action='primary' onPress={() => this._showMatchs()}>
                <ButtonText>{t("retour_liste_matchs_bouton")}</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
        {this._modalSupprimerTournoi()}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(ParametresTournoi))