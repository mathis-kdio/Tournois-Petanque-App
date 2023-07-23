import moment from 'moment/moment'
import 'moment/locale/fr'
import React from 'react'
import { StyleSheet, View, FlatList, Text, Button, Modal } from 'react-native'
import { connect } from 'react-redux'
import ListeTournoiItem from '@components/ListeTournoiItem'
import { withTranslation } from 'react-i18next'

class ListeTournois extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalTournoiInfos: false,
      infosTournoi: {}
    }
  }

  _showModalTournoiInfos(tournoi) {
    this.setState({
      modalTournoiInfos: true,
      infosTournoi: tournoi
    })
  }

  _modalTournoiInfos() {
    const { t } = this.props;
    let tournoi = this.state.infosTournoi;
    if (tournoi.tournoi) {
      let tournoiOptions = tournoi.tournoi[tournoi.tournoi.length - 1];
      let creationDate = t("date_inconnue");
      let updateDate = t("date_inconnue");
      moment.locale('fr');
      let dateFormat = 'd MMMM YYYY à HH:mm:ss';
      if (tournoi.creationDate) {
        creationDate = moment(tournoi.creationDate).format(dateFormat);
      }
      if (tournoi.updateDate) {
        updateDate = moment(tournoi.updateDate).format(dateFormat);
      }
      let nbPtVictoire = tournoiOptions.nbPtVictoire ? tournoiOptions.nbPtVictoire : 13;
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalTournoiInfos}
          onRequestClose={() => {
            this.setState({ modalTournoiInfos: false })
          }}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.modalText}>{t("informations_tournoi_modal_titre")}</Text>
              <View>
                <Text style={modalStyles.modalText}>{t("id_modal_informations_tournoi")}{tournoi.tournoiId}</Text>
                <Text style={modalStyles.modalText}>{t("nom_modal_informations_tournoi")}{tournoi.name}</Text>
                <Text style={modalStyles.modalText}>{t("creation_modal_informations_tournoi")}{creationDate}</Text>
                <Text style={modalStyles.modalText}>{t("derniere_modification_modal_informations_tournoi")}{updateDate}</Text>
                <Text style={modalStyles.modalText}>{t("nombre_joueurs_modal_informations_tournoi")}{tournoiOptions.listeJoueurs.length}</Text>
                <Text style={modalStyles.modalText}>{t("type_equipes_modal_informations_tournoi")}{tournoiOptions.typeEquipes}</Text>
                <Text style={modalStyles.modalText}>{t("nombre_tours_modal_informations_tournoi")}{tournoiOptions.nbTours}</Text>
                <Text style={modalStyles.modalText}>{t("nombre_matchs_modal_informations_tournoi")}{tournoiOptions.nbMatchs}</Text>
                <Text style={modalStyles.modalText}>{t("nombre_points_victoire_modal_informations_tournoi")}{nbPtVictoire}</Text>
                <Text style={modalStyles.modalText}>{t("complement_modal_informations_tournoi")}{tournoiOptions.complement}</Text>
                <Text style={modalStyles.modalText}>{t("regle_equipes_differentes_modal_informations_tournoi")}{tournoiOptions.memesEquipes ? t("oui") : t("non")}</Text>
                <Text style={modalStyles.modalText}>{t("regle_adversaires_modal_informations_tournoi")}{tournoiOptions.memesAdversaires === 0 ? t("1_match") : t("pourcent_matchs", {pourcent: tournoiOptions.memesAdversaires})}</Text>
                <Text style={modalStyles.modalText}>{t("regle_enfants_modal_informations_tournoi")}{tournoiOptions.speciauxIncompatibles ? t("oui") : t("non")}</Text>
              </View>
              <View style={styles.buttonView}>
                <Button color="red" title='Fermer' onPress={() => this.setState({modalTournoiInfos: false}) }/>
              </View>
            </View>
          </View>
        </Modal>
      )
    }
  }

  render() {
    const { t } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.titre}>{t("nombre_tournois", {nb: this.props.listeTournois.length})}</Text>
          </View>
          <View style={styles.flatList_container}>
            <FlatList
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
          </View>
        </View>
        {this._modalTournoiInfos()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  body_container: {
    flex: 1
  },
  titre: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  flatList_container: {
    flex: 1,
    margin: 10
  },
  tournoi_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tournoi_name_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tournoi_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonView: {
    alignItems: 'flex-end',
    marginHorizontal: 5
  },
})

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 5,
    textAlign: "left"
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeTournois))