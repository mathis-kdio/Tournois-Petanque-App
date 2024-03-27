import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, Text, Modal, Pressable, ModalContent, ModalHeader, ModalBody, ModalBackdrop, ModalCloseButton, CloseIcon, Heading } from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from '@components/TopBarBack';
import CardButton from '@components/buttons/CardButton';
import { withTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '../../components/adMob/AdMobInscriptionsBanner';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';

export interface Props {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  showModal: boolean;
  modalType: string;
}

class ChoixTypeTournoi extends React.Component<Props, State> {
  constructor(props: Props) {
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
      },
      "multi-chances": {
        title: t("multi_chances"),
        text: t("description_multi_chances")
      }
    };
    let infos = infosModal[this.state.modalType];
    if (!infos) return;
    return (
      <Modal isOpen={this.state.showModal} onClose={() => this.setState({showModal: false})}>
        <ModalBackdrop/>
        <ModalContent>
          <ModalHeader>
            <Heading>{infos.title}</Heading>
            <ModalCloseButton>
              <CloseIcon/>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>{infos.text}</Text>
          </ModalBody>
        </ModalContent>
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
        <VStack flex={1} bgColor='#0594ae'>
          <TopBarBack title={t("type_tournoi")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} space='2xl'>
            <VStack flex={1}>
              <CardButton
                text={t("type_melee_demelee")}
                icon="random"
                navigate={() => this._navigate('mele-demele')}
                newBadge={false}
              />
              <Pressable flexDirection='row' justifyContent='center' mt={'$2'} onPress={() => this.setState({showModal: true, modalType: "melee-demelee"})}>
                <FontAwesome5 name="info-circle" color='white' size={24}/>
                <Text color='$white'> {t("savoir_plus")}</Text>
              </Pressable>
            </VStack>
            <VStack flex={1}>
              <CardButton
                text={t("type_championnat")}
                icon="table"
                navigate={() => this._navigate('championnat')}
                newBadge={false}
              />
              <Pressable flexDirection='row' justifyContent='center' mt={'$2'} onPress={() => this.setState({showModal: true, modalType: "championnat"})}>
                <FontAwesome5 name="info-circle" color='white' size={24}/>
                <Text color='$white'> {t("savoir_plus")}</Text>
              </Pressable>
            </VStack>
            <VStack flex={1}>
              <CardButton
                text={t("type_coupe")}
                icon="trophy"
                navigate={() => this._navigate('coupe')}
                newBadge={false}
              />
              <Pressable flexDirection='row' justifyContent='center' mt={'$2'} onPress={() => this.setState({showModal: true, modalType: "coupe"})}>
                <FontAwesome5 name="info-circle" color='white' size={24}/>
                <Text color='$white'> {t("savoir_plus")}</Text>
              </Pressable>
            </VStack>
            <VStack flex={1}>
              <CardButton
                text={t("type_multi_chances")}
                icon="code-branch"
                navigate={() => this._navigate('multi-chances')}
                newBadge={true}
              />
              <Pressable flexDirection='row' justifyContent='center' mt={'$2'} onPress={() => this.setState({showModal: true, modalType: "multi-chances"})}>
                <FontAwesome5 name="info-circle" color='white' size={24}/>
                <Text color='$white'> {t("savoir_plus")}</Text>
              </Pressable>
            </VStack>
            <VStack m={'$10'}>
              <AdMobInscriptionsBanner/>
            </VStack>
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