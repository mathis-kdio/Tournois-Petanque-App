import React from 'react'
import { expo } from '../../../app.json'
import { connect } from 'react-redux'
import { _openURL } from '@utils/link'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VStack, Text, Divider, AlertDialogContent, AlertDialog, Box, Center, Button, ButtonText, Modal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, AlertDialogBody, AlertDialogHeader, AlertDialogFooter, ButtonGroup, Heading, AlertDialogCloseButton, CloseIcon, AlertDialogBackdrop, ScrollView } from '@gluestack-ui/themed'
import { _adsConsentShowForm } from '../../utils/adMob/consentForm'
import { withTranslation } from "react-i18next";
import TopBarBack from '@components/TopBarBack'
import Item from '@components/Item'

class Parametres extends React.Component {
  constructor(props) {
    super(props)
    this.githubRepository = "https://github.com/mathis-kdio/Tournois-Petanque-App";
    this.mail = "mailto:tournoispetanqueapp@gmail.com";
    this.crowdin = "https://crowdin.com/project/tournois-de-ptanque-gcu";
    this.state = {
      alertOpen: false,
      modalLanguagesOpen: false,
    }
  }

  _alertDialogClearData() {
    const { t } = this.props;
    return (
      <AlertDialog isOpen={this.state.alertOpen} onClose={() => this.setState({alertOpen: false})}>
        <AlertDialogBackdrop/>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading>{t("supprimer_donnees_modal_titre")}</Heading>
            <AlertDialogCloseButton>
              <CloseIcon/>
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t("supprimer_donnees_modal_texte")}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button variant='outline' action='secondary' onPress={() => this.setState({alertOpen: false})}>
                <ButtonText>{t("annuler")}</ButtonText>
              </Button>
              <Button action='negative' onPress={() => this._clearData()}>
                <ButtonText>{t("oui")}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  _clearData() {
    this.setState({alertOpen: false})
    const actionRemoveAllPlayersAvecNoms = { type: "SUPPR_ALL_JOUEURS", value: ["avecNoms"] }
    this.props.dispatch(actionRemoveAllPlayersAvecNoms);
    const actionRemoveAllPlayersSansNoms = { type: "SUPPR_ALL_JOUEURS", value: ["sansNoms"] }
    this.props.dispatch(actionRemoveAllPlayersSansNoms);
    const actionRemoveAllPlayersAvecEquipes = { type: "SUPPR_ALL_JOUEURS", value: ["avecEquipes"] }
    this.props.dispatch(actionRemoveAllPlayersAvecEquipes);
    const actionRemoveAllPlayersHistorique = { type: "SUPPR_ALL_JOUEURS", value: ["historique"] }
    this.props.dispatch(actionRemoveAllPlayersHistorique);
    const actionRemoveAllPlayersSauvegarde = { type: "SUPPR_ALL_JOUEURS", value: ["sauvegarde"] }
    this.props.dispatch(actionRemoveAllPlayersSauvegarde);
    const actionRemoveAllSavedList = { type: "REMOVE_ALL_SAVED_LIST"}
    this.props.dispatch(actionRemoveAllSavedList);
    const actionRemoveAllTournaments = { type: "SUPPR_ALL_TOURNOIS"}
    this.props.dispatch(actionRemoveAllTournaments);
    const actionRemoveAllMatchs = { type: "REMOVE_ALL_MATCHS"}
    this.props.dispatch(actionRemoveAllMatchs);
    const actionRemoveAllTerrains = { type: "REMOVE_ALL_TERRAINS"}
    this.props.dispatch(actionRemoveAllTerrains);
    const actionRemoveAllOptions = { type: "SUPPR_ALL_OPTIONS"}
    this.props.dispatch(actionRemoveAllOptions);
  }

  _modalLanguages() {
    const { t } = this.props;
    let drapeauFrance = require('@assets/images/drapeau-france.png');
    let drapeauUSA = require('@assets/images/drapeau-usa.png');
    let drapeauPologne = require('@assets/images/drapeau-pologne.png');
    let drapeauPaysBas = require('@assets/images/drapeau-pays-bas.png');
    return (
      <Modal isOpen={this.state.modalLanguagesOpen} onClose={() => this.setState({modalLanguagesOpen: false})}>
        <ModalBackdrop/>
        <ModalContent>
          <ModalHeader>
            <Heading>{t("languages_disponibles")}</Heading>
            <ModalCloseButton>
              <CloseIcon/>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Item text={t("francais")} action={() => this._changeLanguage("fr-FR")} icon={undefined} type="modal" drapeau={drapeauFrance}/>
            <Divider/>
            <Item text={t("anglais")} action={() => this._changeLanguage("en-US")} icon={undefined} type="modal" drapeau={drapeauUSA}/>
            <Divider/>
            <Item text={t("polonais")} action={() => this._changeLanguage("pl-PL")} icon={undefined} type="modal" drapeau={drapeauPologne}/>
            <Divider/>
            <Item text={t("neerlandais")} action={() => this._changeLanguage("nl-NL")} icon={undefined} type="modal" drapeau={drapeauPaysBas}/>
            <Divider/>
            <Text textAlign='center'>{t("envie_aider_traduction")}</Text>
            <Text textAlign='center' onPress={() => _openURL(this.crowdin)} color='$blue500'>{t("texte_lien_traduction")}</Text>
            <Text textAlign='center'>{t("remerciements_traduction")}</Text>
            <Text textAlign='center'>{`\u2022`} N. Mieczynska ({t("polonais_abreviation")})</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  _changeLanguage(language) {
    const { i18n } = this.props;
    i18n.changeLanguage(language);
    this.setState({modalLanguagesOpen: false});
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor='#0594ae'>
          <TopBarBack title={t("parametres")} navigation={this.props.navigation}/>
          <ScrollView height={'$1'}>
            <VStack flex={1} px={'$10'} space='lg'>
              <VStack>
                <Text fontSize={'$xl'} color='$white' mb={'$1'}>{t("a_propos")}</Text>
                <Box borderWidth={'$1'} borderColor='$white' borderRadius={'$lg'}>
                  <Item text={t("voir_source_code")} action={() => _openURL(this.githubRepository)} icon="code" type={undefined} drapeau={undefined}/>
                  <Divider/>
                  <Item text="tournoispetanqueapp@gmail.com" action={() => _openURL(this.mail)} icon="envelope" type={undefined} drapeau={undefined}/>
                </Box>
              </VStack>
              <VStack>
                <Text fontSize={'$xl'} color='$white' mb={'$1'}>{t("reglages")}</Text>
                <Box borderWidth={'$1'} borderColor='$white' borderRadius={'$lg'}>
                  <Item text={t("changer_langue")} action={() => this.setState({modalLanguagesOpen: true})} icon="language" type={undefined} drapeau={undefined}/>
                  <Divider/>
                  <Item text={t("modifier_consentement")} action={() => _adsConsentShowForm()} icon="ad" type={undefined} drapeau={undefined}/>
                  <Divider/>
                  <Item text={t("supprimer_donnees")} action={() => this.setState({alertOpen: true})} icon="trash-alt" type="danger" drapeau={undefined}/>
                </Box>
              </VStack>
              <VStack>
                <Text fontSize={'$xl'} color='$white' mb={'$1'}>{t("nouveautes")}</Text>
                <Box borderWidth={'$1'} borderColor='$white' borderRadius={'$lg'}>
                  <Item text={t("voir_nouveautes")} action={() => this.props.navigation.navigate('Changelog')} icon="certificate" type={undefined} drapeau={undefined}/>
                </Box>
              </VStack>
            </VStack>
          </ScrollView>
          <Center>
            <Text textAlign='center' fontSize={'$md'} color='$white'>Version {expo.version}</Text>
          </Center>
          {this._alertDialogClearData()}
          {this._modalLanguages()}
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    savedLists: state.listesJoueurs.listesSauvegarde,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois,
    listeTerrains: state.listeTournois.listeTerrains,
    optionsTournoi: state.optionsTournoi.options,
  }
}

export default connect(mapStateToProps)(withTranslation()(Parametres))