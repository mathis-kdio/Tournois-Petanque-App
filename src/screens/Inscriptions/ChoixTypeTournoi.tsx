import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, Text, Modal, Pressable, ModalContent, ModalHeader, ModalBody, ModalBackdrop, ModalCloseButton, CloseIcon, Heading } from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from '@components/TopBarBack';
import CardButton from '@components/buttons/CardButton';
import { withTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '../../components/adMob/AdMobInscriptionsBanner';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  showModal: boolean;
  modalType: TypeTournoi;
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

  _navigate(typeTournoi: TypeTournoi) {
    const updateOptionTypeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeTournoi', typeTournoi]}
    this.props.dispatch(updateOptionTypeTournoi);
    return this.props.navigation.navigate('ChoixModeTournoi');
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
                navigate={() => this._navigate(TypeTournoi.MELEDEMELE)}
                newBadge={false}
              />
              <Pressable flexDirection='row' justifyContent='center' mt={'$2'} onPress={() => this.setState({showModal: true, modalType: TypeTournoi.MELEDEMELE})}>
                <FontAwesome5 name="info-circle" color='white' size={24}/>
                <Text color='$white'> {t("savoir_plus")}</Text>
              </Pressable>
            </VStack>
            <VStack flex={1}>
              <CardButton
                text={t("type_championnat")}
                icon="table"
                navigate={() => this._navigate(TypeTournoi.CHAMPIONNAT)}
                newBadge={false}
              />
              <Pressable flexDirection='row' justifyContent='center' mt={'$2'} onPress={() => this.setState({showModal: true, modalType: TypeTournoi.CHAMPIONNAT})}>
                <FontAwesome5 name="info-circle" color='white' size={24}/>
                <Text color='$white'> {t("savoir_plus")}</Text>
              </Pressable>
            </VStack>
            <VStack flex={1}>
              <CardButton
                text={t("type_coupe")}
                icon="trophy"
                navigate={() => this._navigate(TypeTournoi.COUPE)}
                newBadge={false}
              />
              <Pressable flexDirection='row' justifyContent='center' mt={'$2'} onPress={() => this.setState({showModal: true, modalType: TypeTournoi.COUPE})}>
                <FontAwesome5 name="info-circle" color='white' size={24}/>
                <Text color='$white'> {t("savoir_plus")}</Text>
              </Pressable>
            </VStack>
            <VStack flex={1}>
              <CardButton
                text={t("type_multi_chances")}
                icon="code-branch"
                navigate={() => this._navigate(TypeTournoi.MULTICHANCES)}
                newBadge={true}
              />
              <Pressable flexDirection='row' justifyContent='center' mt={'$2'} onPress={() => this.setState({showModal: true, modalType: TypeTournoi.MULTICHANCES})}>
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

export default connector(withTranslation()(ChoixTypeTournoi))