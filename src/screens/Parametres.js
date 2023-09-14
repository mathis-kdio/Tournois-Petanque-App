import React from 'react'
import { expo } from '../../app.json'
import { connect } from 'react-redux'
import { _openURL } from '@utils/link'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { HStack, VStack, Text, Spacer, FlatList, Divider, AlertDialog, Pressable, Box, Center, Button, Modal } from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons';
import { AdsConsent } from 'react-native-google-mobile-ads';
import { withTranslation } from "react-i18next";
import TopBarBack from '@components/TopBarBack'
import ChangelogData from '@assets/ChangelogData.json'

class Parametres extends React.Component {
  constructor(props) {
    super(props)
    this.githubRepository = "https://github.com/sponsors/mathis-kdio";
    this.mail = "mailto: tournoispetanqueapp@gmail.com";
    this.state = {
      alertOpen: false,
      modalChangelogOpen: false,
      modalChangelogItem: undefined
    }
  }

  _alertDialogClearData() {
    const { t } = this.props;
    const cancelRef = React.createRef(null);
    return (
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={this.state.alertOpen} onClose={() => this.setState({alertOpen: false})}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton/>
          <AlertDialog.Header>{t("supprimer_donnees_modal_titre")}</AlertDialog.Header>
          <AlertDialog.Body>
          {t("supprimer_donnees_modal_texte")}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={() => this.setState({alertOpen: false})} ref={cancelRef}>
                {t("annuler")}
              </Button>
              <Button colorScheme="danger" onPress={() => this._clearData()}>
                {t("oui")}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
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

  _modalChangelog() {
    if (this.state.modalChangelogItem) {
      let title = "Version "+this.state.modalChangelogItem.version;
      return (
        <Modal isOpen={this.state.modalChangelogOpen} onClose={() => this.setState({modalChangelogOpen: false})}>
          <Modal.Content>
            <Modal.CloseButton/>
            <Modal.Header>{title}</Modal.Header>
            <Modal.Body>
              <Text>{this.state.modalChangelogItem.infos}</Text>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )
    }
  }

  _adsConsentShowForm() {
    AdsConsent.requestInfoUpdate().then(async consentInfo => {
      if (consentInfo.isConsentFormAvailable) {
        AdsConsent.showForm().then(async status => {console.log(status)});
      }
    });
  }

  _item(text, action, icon, type) {
    let colorTxt = "white";
    let btnColor = "white";
    if (type == "danger") {
      colorTxt = "red.500";
      btnColor = "red";
    }
    return (
      <Pressable onPress={() => action()}>
        <HStack m="2" alignItems="center">
          <FontAwesome5 name={icon} size={16} color={btnColor} style={{marginRight: 5}}/>
          <Text fontSize={16} color={colorTxt}>{text}</Text>
          <Spacer/>
          <FontAwesome5 name="arrow-right" size={20} color={btnColor}/>
        </HStack>
      </Pressable>
    )
  }

  _changelogItem(item) {
    return (
      <VStack>
        {this._item("Version "+item.version+" :", () => this.setState({modalChangelogOpen: true, modalChangelogItem: item}), undefined, undefined)}
        <Divider/>
      </VStack>
    )
  }

  render() {
    const { t, i18n } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
          <TopBarBack title={t("parametres")} navigation={this.props.navigation}/>
          <VStack flex="1" px="10" space="4">
            <VStack>
              <Text fontSize="xl" color="white">{t("a_propos")}</Text>
              <Box borderWidth="1" borderColor="white" borderRadius="lg">
                {this._item(t("voir_source_code"), () => _openURL(this.githubRepository), "code", undefined)}
                <Divider/>
                {this._item("tournoispetanqueapp@gmail.com", () => _openURL(this.mail), "envelope", undefined)}
              </Box>
            </VStack>
            <VStack>
              <Text fontSize="xl" color="white">{t("reglages")}</Text>
              <Box borderWidth="1" borderColor="white" borderRadius="lg">
                {this._item(t("francais"), () => i18n.changeLanguage("fr-FR"), "flag", undefined)}
                <Divider/>
                {this._item(t("anglais"), () => i18n.changeLanguage("en-US"), "flag-usa", undefined)}
                <Divider/>
                {this._item(t("modifier_consentement"), () => this._adsConsentShowForm(), "ad", undefined)}
                <Divider/>
                {this._item(t("supprimer_donnees"), () => this.setState({alertOpen: true}), "trash-alt", "danger")}
              </Box>
            </VStack>
            <VStack flex="1">
              <Text fontSize="xl" color="white">{t("nouveautes")}</Text>
              <FlatList 
                data={ChangelogData}
                keyExtractor={(item) => item.id.toString() }
                renderItem={({item}) => this._changelogItem(item)}
                borderWidth="1"
                borderColor="white"
                borderRadius="lg"
              />
            </VStack>
            <Center>
              <Text textAlign="center" fontSize="md" color="white">Version {expo.version}</Text>
            </Center>
          </VStack>
        </VStack>
        {this._alertDialogClearData()}
        {this._modalChangelog()}
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