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
import TopBarBack from '@components/TopBarBack';
import CardButton from '@components/buttons/CardButton';
import { withTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';
import { Divider } from '@/components/ui/divider';
import { Complement } from '@/types/enums/complement';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  showModal: boolean;
  modalType: Complement;
  options: Complement[];
  complementTeteATeteDispo: boolean;
  complementTripletteDispo: boolean;
  complement2vs1Dispo: boolean;
}

class ChoixComplement extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      modalType: undefined,
      options: [],
      complementTeteATeteDispo: false,
      complementTripletteDispo: false,
      complement2vs1Dispo: false,
    };
  }

  componentDidMount(): void {
    this.complementDoublette();
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

  _navigate(complement: Complement) {
    const updateOptionComplement = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['complement', complement],
    };
    this.props.dispatch(updateOptionComplement);

    let screenName = 'GenerationMatchs';
    if (this.props.optionsTournoi.avecTerrains) {
      screenName = 'ListeTerrains';
    }
    this.props.navigation.navigate({
      name: screenName,
      params: {
        screenStackName: 'InscriptionsAvecNoms',
      },
    });
  }

  complementDoublette() {
    const { mode } = this.props.optionsTournoi;
    const { listesJoueurs } = this.props;
    const nbJoueurs = listesJoueurs[mode].length;

    let options = [];
    if (nbJoueurs === 7) {
      options.push(Complement.DEUXVSUN);
    } else if (nbJoueurs % 4 === 1) {
      options.push(Complement.TROISVSDEUX);
    } else {
      options.push(Complement.TETEATETE, Complement.TRIPLETTE);
    }

    this.setState({
      options: options,
    });
  }

  card(complement: Complement) {
    const { t } = this.props;
    return (
      <VStack className="flex-1">
        <CardButton
          text={complement.toString()}
          icon="random"
          navigate={() => this._navigate(complement)}
          newBadge={false}
        />
        <Pressable
          onPress={() =>
            this.setState({
              showModal: true,
              modalType: complement,
            })
          }
          className="flex-row justify-center mt-2"
        >
          <FontAwesome5 name="info-circle" color="white" size={24} />
          <Text className="text-white"> {t('savoir_plus')}</Text>
        </Pressable>
      </VStack>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('choix_complement')}
            navigation={this.props.navigation}
          />
          <VStack space="2xl" className="flex-1 px-10">
            {this.state.options.map((complement) => (
              <VStack>
                <VStack>{this.card(complement)}</VStack>
                <Divider className="my-0.5" />
              </VStack>
            ))}
          </VStack>
        </ScrollView>
        {this._modalInfos()}
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(ChoixComplement));
