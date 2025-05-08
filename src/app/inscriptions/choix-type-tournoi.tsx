import { ScrollView } from '@/components/ui/scroll-view';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalBackdrop,
  ModalCloseButton,
} from '@/components/ui/modal';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from '@/components/topBar/TopBarBack';
import CardButton from '@components/buttons/CardButton';
import { withTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '../../components/adMob/AdMobInscriptionsBanner';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  showModal: boolean;
  modalType: TypeTournoi;
}

class ChoixTypeTournoi extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      modalType: undefined,
    };
  }

  _modalInfos() {
    const { t } = this.props;
    if (!this.state.modalType) return;
    const infosModal = {
      'mele-demele': {
        title: t('melee_demelee'),
        text: t('description_melee_demelee'),
      },
      championnat: {
        title: t('championnat'),
        text: t('description_championnat'),
      },
      coupe: {
        title: t('coupe'),
        text: t('description_coupe'),
      },
      'multi-chances': {
        title: t('multi_chances'),
        text: t('description_multi_chances'),
      },
    };
    let infos = infosModal[this.state.modalType];
    if (!infos) return;
    return (
      <Modal
        isOpen={this.state.showModal}
        onClose={() => this.setState({ showModal: false })}
      >
        <ModalBackdrop />
        <ModalContent className="max-h-5/6">
          <ModalHeader>
            <Heading className="text-black">{infos.title}</Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>{infos.text}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  _navigate(typeTournoi: TypeTournoi) {
    const updateOptionTypeTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['typeTournoi', typeTournoi],
    };
    this.props.dispatch(updateOptionTypeTournoi);
    return this.props.navigation.navigate('ChoixModeTournoi');
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('type_tournoi')}
            navigation={this.props.navigation}
          />
          <VStack space="2xl" className="flex-1 px-10">
            <VStack className="flex-1">
              <CardButton
                text={t('type_melee_demelee')}
                icons={['random']}
                navigate={() => this._navigate(TypeTournoi.MELEDEMELE)}
                newBadge={false}
              />
              <Pressable
                onPress={() =>
                  this.setState({
                    showModal: true,
                    modalType: TypeTournoi.MELEDEMELE,
                  })
                }
                className="flex-row justify-center mt-2"
              >
                <FontAwesome5 name="info-circle" color="white" size={24} />
                <Text className="text-white"> {t('savoir_plus')}</Text>
              </Pressable>
            </VStack>
            <VStack className="flex-1">
              <CardButton
                text={t('type_championnat')}
                icons={['table']}
                navigate={() => this._navigate(TypeTournoi.CHAMPIONNAT)}
                newBadge={false}
              />
              <Pressable
                onPress={() =>
                  this.setState({
                    showModal: true,
                    modalType: TypeTournoi.CHAMPIONNAT,
                  })
                }
                className="flex-row justify-center mt-2"
              >
                <FontAwesome5 name="info-circle" color="white" size={24} />
                <Text className="text-white"> {t('savoir_plus')}</Text>
              </Pressable>
            </VStack>
            <VStack className="flex-1">
              <CardButton
                text={t('type_coupe')}
                icons={['trophy']}
                navigate={() => this._navigate(TypeTournoi.COUPE)}
                newBadge={false}
              />
              <Pressable
                onPress={() =>
                  this.setState({
                    showModal: true,
                    modalType: TypeTournoi.COUPE,
                  })
                }
                className="flex-row justify-center mt-2"
              >
                <FontAwesome5 name="info-circle" color="white" size={24} />
                <Text className="text-white"> {t('savoir_plus')}</Text>
              </Pressable>
            </VStack>
            <VStack className="flex-1">
              <CardButton
                text={t('type_multi_chances')}
                icons={['code-branch']}
                navigate={() => this._navigate(TypeTournoi.MULTICHANCES)}
                newBadge={false}
              />
              <Pressable
                onPress={() =>
                  this.setState({
                    showModal: true,
                    modalType: TypeTournoi.MULTICHANCES,
                  })
                }
                className="flex-row justify-center mt-2"
              >
                <FontAwesome5 name="info-circle" color="white" size={24} />
                <Text className="text-white"> {t('savoir_plus')}</Text>
              </Pressable>
            </VStack>
            <VStack className="m-10">
              <AdMobInscriptionsBanner />
            </VStack>
          </VStack>
        </ScrollView>
        {this._modalInfos()}
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(ChoixTypeTournoi));
