import React from 'react'
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import { withTranslation } from 'react-i18next';

class ListeTournoiItem extends React.Component {
  constructor(props) {
    super(props)
    this.tournoiNameText = ""
    this.state = {
      renommerOn: false,
      disabledBoutonRenommer: true
    }
  }

  _chargerTournoi(tournoi) {
    const actionUpdateListeMatchs = {type: "AJOUT_MATCHS", value: tournoi.tournoi};
    this.props.dispatch(actionUpdateListeMatchs);
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'ListeMatchsInscription', 
        params: {
          tournoiId: tournoi.tournoiId, 
          tournoi: tournoi
        }
      }],
    });
  }

  _supprimerTournoi(tournoiId) {
    const actionSupprimerTournoi = {type: "SUPPR_TOURNOI", value: {tournoiId: tournoiId}};
    this.props.dispatch(actionSupprimerTournoi);
  }

  _modalSupprimerTournoi(tournoi) {
    const { t } = this.props;
    Alert.alert(
      t("supprimer_tournoi_modal_titre"),
      t("supprimer_tournoi_modal_texte", {id: tournoi.tournoiId}),
      [
        { text: t("annuler"), onPress: () => undefined, style: "cancel" },
        { text: t("oui"), onPress: () => this._supprimerTournoi(tournoi.tournoiId) },
      ],
      { cancelable: true }
    );
  }
  
  _showRenameTournoi(tournoi) {
    if (this.state.renommerOn) {
      if (this.state.disabledBoutonRenommer) {
        return (
          <FontAwesome5.Button name="check" backgroundColor="gray" iconStyle={{paddingHorizontal: 2, marginRight: 0}}/>
        )
      }
      else {
        return (
          <FontAwesome5.Button name="check" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renameTournoi(tournoi)}/>
        )
      }
    }
    else {
      return (
        <FontAwesome5.Button name="edit" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renameTournoiInput(tournoi)}/>
      )
    }
  }

  _renameTournoiInput(tournoi) {
    this.setState({
      renommerOn: true
    })
    this.tournoiNameText = tournoi.name
  }

  _renameTournoi(tournoi) {
    if (this.tournoiNameText != "") {
      this.setState({
        renommerOn: false,
        disabledBoutonRenommer: true
      })
      const actionRenameTournoi = { type: "RENOMMER_TOURNOI", value: {tournoiId: tournoi.tournoiId, newName: this.tournoiNameText} }
      this.props.dispatch(actionRenameTournoi)
      this.tournoiNameText = ""
    }
  }

  _tournoiTextInputChanged(text) {
    this.tournoiNameText = text
    this.setState({
      disabledBoutonRenommer: this.tournoiNameText == '' ? true : false
    })
  }

  _tournoiName(tournoi) {
    let tournoiName = 'Tournoi ' + (tournoi.name ? tournoi.name : 'n°' + tournoi.tournoiId);
    if (this.state.renommerOn) {
      return (
        <TextInput
          style={styles.text_input}
          placeholder={tournoiName}
          autoFocus={true}
          onChangeText={(text) => this._tournoiTextInputChanged(text)}
          onSubmitEditing={() => this._renameTournoi(tournoi)}
        />
      )
    }
    else {
      return (
        <Text style={styles.tournoi_text}>{tournoiName}</Text>
      )
    }
  }

  render() {
    const { tournoi, _showModalTournoiInfos, t } = this.props;
    let boutonDesactive = false;
    if (this.props.listeMatchs && tournoi.tournoiId == this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID) {
      boutonDesactive = true;
    }
    return (
      <View style={styles.tournoi_container}>
        <View style={styles.tournoi_name_container}>
          <View style={{flex: 1}}>
            {this._tournoiName(tournoi)}
          </View>
          {this._showRenameTournoi(tournoi)}
        </View>
        <View style={styles.buttonView}>
          <FontAwesome5.Button name="info-circle" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => _showModalTournoiInfos(tournoi)}/>
        </View>
        <View style={styles.buttonView}>
          <Button disabled={boutonDesactive} color="#1c3969" title={t("charger")} onPress={() => this._chargerTournoi(tournoi)}/>
        </View>
        <View style={styles.buttonView}>
          <FontAwesome5.Button disabled={boutonDesactive} name="times" backgroundColor={boutonDesactive ? "#c0c0c0" : "red"} iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._modalSupprimerTournoi(tournoi)}/>
        </View>
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

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeTournoiItem))