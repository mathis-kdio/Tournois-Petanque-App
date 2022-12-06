import React from 'react'
import { StyleSheet, View, FlatList, Text, Button, Modal } from 'react-native'
import { connect } from 'react-redux'
import ListeTournoiItem from '../../components/ListeTournoiItem'

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
    let tournoi = this.state.infosTournoi;
    if (tournoi.tournoi) {
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
              <Text style={modalStyles.modalText}>Informations concernant le tournoi :</Text>
              <View>
                <Text style={modalStyles.modalText}>Id: {tournoi.tournoiId}</Text>
                <Text style={modalStyles.modalText}>Nom: {tournoi.name}</Text>
                <Text style={modalStyles.modalText}>Date de création: {tournoi.creationDate}</Text>
                <Text style={modalStyles.modalText}>Nombre de joueurs: {tournoi.tournoi.length}</Text>
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
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.titre}>Vous avez {this.props.listeTournois.length} tournois</Text>
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
    marginBottom: 15,
    textAlign: "left"
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(ListeTournois)