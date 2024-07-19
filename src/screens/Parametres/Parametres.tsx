import { ScrollView } from "@/components/ui/scroll-view";
import { CloseIcon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";

import { Button, ButtonText, ButtonGroup } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";

import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCloseButton,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog";

import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from 'react'
import { expo } from '../../../app.json'
import { _openURL } from '@utils/link'
import { SafeAreaView } from 'react-native-safe-area-context'
import { _adsConsentShowForm } from '../../utils/adMob/consentForm'
import { withTranslation } from "react-i18next";
import TopBarBack from '@components/TopBarBack'
import Item from '@components/Item'
import { PropsFromRedux, connector } from '@/store/connector'
import { TFunction, i18n } from 'i18next'
import { StackNavigationProp } from '@react-navigation/stack'

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
  i18n: i18n;
}

interface State {
  alertOpen: boolean;
  modalLanguagesOpen: boolean;
}

class Parametres extends React.Component<Props, State> {
  githubRepository: string = "https://github.com/mathis-kdio/Tournois-Petanque-App";
  mail: string = "mailto:tournoispetanqueapp@gmail.com";
  crowdin: string = "https://crowdin.com/project/tournois-de-ptanque-gcu";

  constructor(props: Props) {
    super(props)
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
    );
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
        <ModalContent className="max-h-5/6">
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
            <Text className="text-center">{t("envie_aider_traduction")}</Text>
            <Text
              onPress={() => _openURL(this.crowdin)}
              className="text-center text-blue-500">{t("texte_lien_traduction")}</Text>
            <Text className="text-center">{t("remerciements_traduction")}</Text>
            <Text className="text-center">{`\u2022`} N. Mieczynska ({t("polonais_abreviation")})</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  _changeLanguage(language: string) {
    const { i18n } = this.props;
    i18n.changeLanguage(language);
    this.setState({modalLanguagesOpen: false});
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack className="flex-1 bg-[#0594ae]">
          <TopBarBack title={t("parametres")} navigation={this.props.navigation}/>
          <ScrollView className="h-1">
            <VStack space='lg' className="flex-1 px-10">
              <VStack>
                <Text className="text-xl text-white mb-1">{t("a_propos")}</Text>
                <Box className="border border-white rounded-lg">
                  <Item text={t("voir_source_code")} action={() => _openURL(this.githubRepository)} icon="code" type={undefined} drapeau={undefined}/>
                  <Divider/>
                  <Item text="tournoispetanqueapp@gmail.com" action={() => _openURL(this.mail)} icon="envelope" type={undefined} drapeau={undefined}/>
                </Box>
              </VStack>
              <VStack>
                <Text className="text-xl text-white mb-1">{t("reglages")}</Text>
                <Box className="border border-white rounded-lg">
                  <Item text={t("changer_langue")} action={() => this.setState({modalLanguagesOpen: true})} icon="language" type={undefined} drapeau={undefined}/>
                  <Divider/>
                  <Item text={t("modifier_consentement")} action={() => _adsConsentShowForm()} icon="ad" type={undefined} drapeau={undefined}/>
                  <Divider/>
                  <Item text={t("supprimer_donnees")} action={() => this.setState({alertOpen: true})} icon="trash-alt" type="danger" drapeau={undefined}/>
                </Box>
              </VStack>
              <VStack>
                <Text className="text-xl text-white mb-1">{t("nouveautes")}</Text>
                <Box className="border border-white rounded-lg">
                  <Item text={t("voir_nouveautes")} action={() => this.props.navigation.navigate('Changelog')} icon="certificate" type={undefined} drapeau={undefined}/>
                </Box>
              </VStack>
            </VStack>
          </ScrollView>
          <Center>
            <Text className="text-center text-md text-white">{t("version")} {expo.version}</Text>
          </Center>
          {this._alertDialogClearData()}
          {this._modalLanguages()}
        </VStack>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(Parametres))