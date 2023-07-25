import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { VStack, Text, Spacer, Modal, Pressable } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from 'components/TopBarBack';
import CardButton from 'components/buttons/CardButton';
import AdMobBanner from 'components/adMob/AdMobBanner';
import { withTranslation } from 'react-i18next';

class ChoixTypeTournoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      modalType: undefined
    }
  }

  _modalInfos() {
    const { t } = this.props;
    if (!this.state.modalType) return;
    const infosModal = {
      "melee-demelee": {
        title: t("melee_demelee"),
        text:  t("description_melee_demelee")
      },
      "championnat": {
        title: t("championnat"),
        text: t("description_championnat")
      },
      "coupe": {
        title: t("coupe"),
        text: t("description_coupe")
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
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
          <TopBarBack title={t("type_tournoi")} navigation={this.props.navigation}/>
          <VStack flex="1" px="10">
            <Spacer/>
            <CardButton
              text={t("type_melee_demelee")}
              icon="random"
              navigate={() => this._navigate('mele-demele')}
            />
            <Pressable flexDirection="row" justifyContent="center" mt="2" onPress={() => this.setState({showModal: true, modalType: "melee-demelee"})}>
              <FontAwesome5 name="info-circle" color="white" size={24}/>
              <Text color="white"> {t("savoir_plus")}</Text>
            </Pressable>
            <Spacer/>
            <CardButton
              text={t("type_championnat")}
              icon="table"
              navigate={() => this._navigate('championnat')}
            />
            <Pressable flexDirection="row" justifyContent="center" mt="2" onPress={() => this.setState({showModal: true, modalType: "championnat"})}>
              <FontAwesome5 name="info-circle" color="white" size={24}/>
              <Text color="white"> {t("savoir_plus")}</Text>
            </Pressable>
            <Spacer/>
            <CardButton
              text={t("type_coupe")}
              icon="trophy"
              navigate={() => this._navigate('coupe')}
            />
            <Pressable flexDirection="row" justifyContent="center" mt="2" onPress={() => this.setState({showModal: true, modalType: "coupe"})}>
              <FontAwesome5 name="info-circle" color="white" size={24}/>
              <Text color="white"> {t("savoir_plus")}</Text>
            </Pressable>
            <Spacer/>
            <AdMobBanner/>
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

export default connect(mapStateToProps)(withTranslation()(ChoixTypeTournoi))