import { Heading } from "@/components/ui/heading";
import { CloseIcon } from "@/components/ui/icon";

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@/components/ui/modal";

import { FlatList } from "@/components/ui/flat-list";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from 'react'
import ListeTournoiItem from '@components/ListeTournoiItem'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBarBack from '@components/TopBarBack'
import { StackNavigationProp } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi'
import { Tournoi } from '@/types/interfaces/tournoi'
import { PropsFromRedux, connector } from '@/store/connector'
import { ListRenderItem } from 'react-native'
import { dateFormatDateHeure } from '../../utils/date'

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  modalTournoiInfosIsOpen: boolean;
  infosTournoi: Tournoi;
}

class ListeTournois extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      modalTournoiInfosIsOpen: false,
      infosTournoi: undefined
    }
  }

  _showModalTournoiInfos(tournoi: Tournoi) {
    this.setState({
      modalTournoiInfosIsOpen: true,
      infosTournoi: tournoi
    });
  }

  _modalTournoiInfos() {
    const { t } = this.props;
    let tournoi = this.state.infosTournoi;
    if (tournoi && tournoi.tournoi) {
      let tournoiOptions = tournoi.tournoi.at(-1) as OptionsTournoi;
      let creationDate = t("date_inconnue");
      let updateDate = t("date_inconnue");
      if (tournoi.creationDate) {
        creationDate = dateFormatDateHeure(tournoi.creationDate);
      }
      if (tournoi.updateDate) {
        updateDate = dateFormatDateHeure(tournoi.updateDate);
      }
      let nbPtVictoire = tournoiOptions.nbPtVictoire ? tournoiOptions.nbPtVictoire : 13;
      return (
        <Modal
          isOpen={this.state.modalTournoiInfosIsOpen}
          onClose={() => this.setState({modalTournoiInfosIsOpen: false})}
        >
          <ModalBackdrop/>
          <ModalContent className="max-h-5/6">
            <ModalHeader>
              <Heading size='lg'>{t("informations_tournoi_modal_titre")}</Heading>
              <ModalCloseButton>
                <CloseIcon/>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text>{t("id_modal_informations_tournoi")} {tournoi.tournoiId}</Text>
              <Text>{t("nom_modal_informations_tournoi")} {tournoi.name}</Text>
              <Text>{t("creation_modal_informations_tournoi")}{creationDate}</Text>
              <Text>{t("derniere_modification_modal_informations_tournoi")} {updateDate}</Text>
              <Text>{t("nombre_joueurs_modal_informations_tournoi")} {tournoiOptions.listeJoueurs.length}</Text>
              <Text>{t("type_equipes_modal_informations_tournoi")} {tournoiOptions.typeEquipes}</Text>
              <Text>{t("nombre_tours_modal_informations_tournoi")} {tournoiOptions.nbTours}</Text>
              <Text>{t("nombre_matchs_modal_informations_tournoi")} {tournoiOptions.nbMatchs}</Text>
              <Text>{t("nombre_points_victoire_modal_informations_tournoi")} {nbPtVictoire}</Text>
              <Text>{t("complement_modal_informations_tournoi")}{tournoiOptions.complement}</Text>
              <Text>{t("regle_equipes_differentes_modal_informations_tournoi")} {tournoiOptions.memesEquipes ? t("oui") : t("non")}</Text>
              <Text>{t("regle_adversaires_modal_informations_tournoi")} {tournoiOptions.memesAdversaires === 0 ? t("1_match") : t("pourcent_matchs", {pourcent: tournoiOptions.memesAdversaires})}</Text>
              <Text>{t("regle_speciaux_modal_informations_tournoi")} {tournoiOptions.speciauxIncompatibles ? t("oui") : t("non")}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      );
    }
  }

  render() {
    const { t } = this.props;
    const renderItem: ListRenderItem<Tournoi> = ({item}) => (
      <ListeTournoiItem
        tournoi={item}
        navigation={this.props.navigation}
        _showModalTournoiInfos={(tournoi: Tournoi) => this._showModalTournoiInfos(tournoi)}
      />
    );
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack className="flex-1 bg-[#0594ae]">
          <TopBarBack title={t("choix_tournoi_navigation_title")} navigation={this.props.navigation}/>
          <Text className="text-white text-xl text-center px-10">{t("nombre_tournois", {nb: this.props.listeTournois.length})}</Text>
          <VStack className="flex-1 my-2">
            <FlatList
              data={this.props.listeTournois}
              initialNumToRender={20}
              keyExtractor={(item: Tournoi) => item.tournoiId.toString() }
              renderItem={renderItem}
              className="h-1"
            />
          </VStack>
          {this._modalTournoiInfos()}
        </VStack>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(ListeTournois))