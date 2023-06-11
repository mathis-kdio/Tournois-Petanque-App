import React from 'react'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { VStack, Text, Spacer, Modal, Pressable } from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from 'components/TopBarBack'
import CardButton from 'components/buttons/CardButton'

class ChoixTypeTournoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      modalType: undefined
    }
  }

  _modalInfos() {
    if (!this.state.modalType) return;
    const infosModal = {
      "melee-demelee": {
        title: "Mélée-Démêlée",
        text: "Les joueurs sont solitaires ou en équipes fixes.\nLes matchs peuvent se dérouler en tête-à-tête, doublettes ou triplettes.\nPossibilité de compléter un match avec une triplette ou tête à tête."
      },
      "championnat": {
        title: "Championnat",
        text: "Les joueurs ne se rencontrent qu'une seule fois pendant le tournoi."
      },
      "coupe": {
        title: "Coupe",
        text: "Un 1er tour aléatoire puis qualification si victoire sinon élimination du tournoi.\n\nIndisponible pour l'instant : phase de poule"
      }
    };
    let infos = infosModal[this.state.modalType];
    if (!infos) return;
    return (
      <Modal isOpen={this.state.showModal} onClose={() => this.setState({showModal: false})}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{infos.title}</Modal.Header>
          <Modal.Body>
            <Text>{infos.text}</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    )
  }

  _navigate(typeTournoi) {
    const updateOptionTypeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['type', typeTournoi]}
    this.props.dispatch(updateOptionTypeTournoi);
    return this.props.navigation.navigate({name: 'ChoixModeTournoi'});
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
        <TopBarBack title="Type de tournoi" navigation={this.props.navigation}/>
          <VStack flex="1" px="10">
            <Spacer/>
            <CardButton
              text="Type Mêlée-Démêlée"
              icon="random"
              navigate={() => this._navigate('mele-demele')}
            />
            <Pressable flexDirection="row" justifyContent="center" mt="2" onPress={() => this.setState({showModal: true, modalType: "melee-demelee"})}>
              <FontAwesome5 name="info-circle" color="white" size={24}/>
              <Text color="white"> En savoir plus</Text>
            </Pressable>
            <Spacer/>
            <CardButton
              text="Type Championnat"
              icon="table"
              navigate={() => this._navigate('championnat')}
            />
            <Pressable flexDirection="row" justifyContent="center" mt="2" onPress={() => this.setState({showModal: true, modalType: "championnat"})}>
              <FontAwesome5 name="info-circle" color="white" size={24}/>
              <Text color="white"> En savoir plus</Text>
            </Pressable>
            <Spacer/>
            <CardButton
              text="Type Coupe"
              icon="trophy"
              navigate={() => this._navigate('coupe')}
            />
            <Pressable flexDirection="row" justifyContent="center" mt="2" onPress={() => this.setState({showModal: true, modalType: "coupe"})}>
              <FontAwesome5 name="info-circle" color="white" size={24}/>
              <Text color="white"> En savoir plus</Text>
            </Pressable>
            <Spacer/>
          </VStack>
        </VStack>
        {this._modalInfos()}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(ChoixTypeTournoi)