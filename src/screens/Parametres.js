import React from 'react'
import { expo } from '../../app.json'
import { connect } from 'react-redux'
import { _openURL } from '@utils/link'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HStack, VStack, Text, FlatList, Divider, AlertDialogContent, AlertDialog, Pressable, Box, Center, Button, ButtonText, Modal, Image, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, AlertDialogBody, AlertDialogHeader, AlertDialogFooter, ButtonGroup, Heading, AlertDialogCloseButton, CloseIcon, AlertDialogBackdrop } from '@gluestack-ui/themed'
import { FontAwesome5 } from '@expo/vector-icons';
import { _adsConsentShowForm } from '../utils/adMob/consentForm'
import { withTranslation } from "react-i18next";
import TopBarBack from '@components/TopBarBack'
import ChangelogData from '@assets/ChangelogData.json'
import { StyleSheet, Platform } from 'react-native'

class Parametres extends React.Component {
  constructor(props) {
    super(props)
    this.githubRepository = "https://github.com/sponsors/mathis-kdio";
    this.mail = "mailto:tournoispetanqueapp@gmail.com";
    this.crowdin = "https://crowdin.com/project/tournois-de-ptanque-gcu";
    this.state = {
      alertOpen: false,
      modalChangelogOpen: false,
      modalChangelogItem: undefined,
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

  _modalChangelog() {
    if (this.state.modalChangelogItem) {
      let title = "Version "+this.state.modalChangelogItem.version;
      return (
        <Modal isOpen={this.state.modalChangelogOpen} onClose={() => this.setState({modalChangelogOpen: false})}>
          <ModalBackdrop/>
          <ModalContent>
            <ModalHeader>
              <Heading>{title}</Heading>
              <ModalCloseButton>
                <CloseIcon/>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text>{this.state.modalChangelogItem.infos}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )
    }
  }

  _modalLanguages() {
    const { t } = this.props;
    let drapeauFrance = require('@assets/images/drapeau-france.png');
    let drapeauUSA = require('@assets/images/drapeau-usa.png');
    let drapeauPologne = require('@assets/images/drapeau-pologne.png');
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
            {this._item(t("francais"), () => this._changeLanguage("fr-FR"), undefined, "modal", drapeauFrance)}
            <Divider/>
            {this._item(t("anglais"), () => this._changeLanguage("en-US"), undefined, "modal", drapeauUSA)}
            <Divider/>
            {this._item(t("polonais"), () => this._changeLanguage("pl-PL"), undefined, "modal", drapeauPologne)}
            <Divider/>
            <Text textAlign='center'>{t("envie_aider_traduction")}</Text>
            <Text textAlign='center' onPress={() => _openURL(this.crowdin)} color='$blue500'>{t("texte_lien_traduction")}</Text>
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

  _item(text, action, icon, type, drapeau) {
    let colorTxt = '$white';
    let btnColor = 'white';
    if (type == "danger") {
      colorTxt = '$red500';
      btnColor = 'red';
    }
    else if (type == "modal") {
      colorTxt = '$black';
      btnColor = 'black';
    }
    return (
      <Pressable onPress={() => action()}>
        <HStack m={'$2'} alignItems='center' justifyContent='space-between'>
          <HStack alignItems='center'>
            {drapeau == undefined ?
              <FontAwesome5 name={icon} size={16} color={btnColor} style={{marginRight: 5}}/>
              :
              <Image source={drapeau} alt="drapeau" size='xs' style={styles.imageWeb} />//TMP FIX bug size web gluestack  
            }
            <Text fontSize={'$md'} color={colorTxt}>{text}</Text>
          </HStack>
          <FontAwesome5 name="arrow-right" size={20} color={btnColor}/>
        </HStack>
      </Pressable>
    )
  }

  _changelogItem(item) {
    return (
      <VStack>
        {this._item("Version "+item.version+" :", () => this.setState({modalChangelogOpen: true, modalChangelogItem: item}), undefined, undefined, undefined)}
        <Divider/>
      </VStack>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor='#0594ae'>
          <TopBarBack title={t("parametres")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} space='lg'>
            <VStack>
              <Text fontSize={'$xl'} color='$white'>{t("a_propos")}</Text>
              <Box borderWidth={'$1'} borderColor='$white' borderRadius={'$lg'}>
                {this._item(t("voir_source_code"), () => _openURL(this.githubRepository), "code", undefined, undefined)}
                <Divider/>
                {this._item("tournoispetanqueapp@gmail.com", () => _openURL(this.mail), "envelope", undefined, undefined)}
              </Box>
            </VStack>
            <VStack>
              <Text fontSize={'$xl'} color='$white'>{t("reglages")}</Text>
              <Box borderWidth={'$1'} borderColor='$white' borderRadius={'$lg'}>
                {this._item(t("changer_langue"), () => this.setState({modalLanguagesOpen: true}), "language", undefined, undefined)}
                <Divider/>
                {this._item(t("modifier_consentement"), () => _adsConsentShowForm(), "ad", undefined, undefined)}
                <Divider/>
                {this._item(t("supprimer_donnees"), () => this.setState({alertOpen: true}), "trash-alt", "danger", undefined)}
              </Box>
            </VStack>
            <VStack flex={1}>
              <Text fontSize={'$xl'} color='$white'>{t("nouveautes")}</Text>
              <FlatList 
                data={ChangelogData}
                keyExtractor={(item) => item.id.toString() }
                renderItem={({item}) => this._changelogItem(item)}
                borderWidth={'$1'}
                borderColor='white'
                borderRadius={'$lg'}
              />
            </VStack>
            <Center>
              <Text textAlign='center' fontSize={'$md'} color='$white'>Version {expo.version}</Text>
            </Center>
          </VStack>
        </VStack>
        {this._alertDialogClearData()}
        {this._modalChangelog()}
        {this._modalLanguages()}
      </SafeAreaView>
    )
  }
}

//TMP FIX bug size web gluestack
const styles = StyleSheet.create({
  imageWeb: {
    ...Platform.select({
      web: {
        height: '124px',
        width: '124px'
      }
    })
  }
});

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