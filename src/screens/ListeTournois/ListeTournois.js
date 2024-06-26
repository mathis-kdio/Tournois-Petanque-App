import React from 'react'
import { connect } from 'react-redux'
import ListeTournoiItem from '@components/ListeTournoiItem'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VStack, Text, FlatList, Modal, CloseIcon, ModalBackdrop, ModalContent, ModalHeader, Heading, ModalCloseButton, ModalBody } from '@gluestack-ui/themed'
import TopBarBack from '../../components/TopBarBack'
import { dateFormatDateHeure } from '../../utils/date'

class ListeTournois extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalTournoiInfosIsOpen: false,
      infosTournoi: {}
    }
  }

  _showModalTournoiInfos(tournoi) {
    this.setState({
      modalTournoiInfosIsOpen: true,
      infosTournoi: tournoi
    });
  }

  _modalTournoiInfos() {
    const { t } = this.props;
    let tournoi = this.state.infosTournoi;
    if (tournoi.tournoi) {
      let tournoiOptions = tournoi.tournoi[tournoi.tournoi.length - 1];
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
          <ModalContent maxHeight='$5/6'>
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
      )
    }
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor={"#0594ae"}>
          <TopBarBack title={t("choix_tournoi_navigation_title")} navigation={this.props.navigation}/>
          <Text color='$white' fontSize={'$xl'} textAlign='center' px={'$10'}>{t("nombre_tournois", {nb: this.props.listeTournois.length})}</Text>
          <VStack flex={1} my={'$2'}>
            <FlatList
              height={'$1'}
              data={this.props.listeTournois}
              initialNumToRender={20}
              keyExtractor={(item) => item.tournoiId.toString() }
              renderItem={({item}) => (
                <ListeTournoiItem
                  tournoi={item}
                  navigation={this.props.navigation}
                  _showModalTournoiInfos={(tournoi) => this._showModalTournoiInfos(tournoi)}
                />
              )}
            />
          </VStack>
          {this._modalTournoiInfos()}
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeTournois))