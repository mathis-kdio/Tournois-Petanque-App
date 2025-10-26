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
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from '@/components/topBar/TopBarBack';
import CardButton from '@components/buttons/CardButton';
import { useTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '@/components/adMob/AdMobInscriptionsBanner';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { useRouter } from 'expo-router';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';

const ChoixTypeTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { updatePreparationTournoi } = usePreparationTournoi();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<TypeTournoi | undefined>();

  const listeTypeTournois = [
    {
      type: TypeTournoi.MELEDEMELE,
      text: t('type_melee_demelee'),
      icons: ['random'],
    },
    {
      type: TypeTournoi.MELEE,
      text: t('type_melee'),
      icons: ['people-arrows'],
    },
    {
      type: TypeTournoi.CHAMPIONNAT,
      text: t('type_championnat'),
      icons: ['table'],
    },
    {
      type: TypeTournoi.COUPE,
      text: t('type_coupe'),
      icons: ['trophy'],
    },
    {
      type: TypeTournoi.MULTICHANCES,
      text: t('type_multi_chances'),
      icons: ['code-branch'],
    },
  ];

  const _modalInfos = () => {
    if (!modalType) return;
    const infosModal = {
      'mele-demele': {
        title: t('melee_demelee'),
        text: t('description_melee_demelee'),
      },
      melee: {
        title: t('melee'),
        text: t('description_melee'),
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
    let infos = infosModal[modalType] as { title: string; text: string };
    if (!infos) return;
    return (
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBackdrop />
        <ModalContent className="max-h-5/6">
          <ModalHeader>
            <Heading className="color-custom-text-modal">{infos.title}</Heading>
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
  };

  const _navigate = (typeTournoi: TypeTournoi) => {
    const preparationTournoi: PreparationTournoiModel = {
      id: 0,
      typeTournoi: typeTournoi,
    };
    updatePreparationTournoi(preparationTournoi);
    return router.navigate('inscriptions/choix-mode-tournoi');
  };

  const _setState = (modalType: TypeTournoi) => {
    setShowModal(true);
    setModalType(modalType);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('type_tournoi')} />
        <VStack space="2xl" className="flex-1 px-10">
          {listeTypeTournois.map(({ type, text, icons }) => (
            <VStack className="flex-1" key={type}>
              <CardButton
                text={text}
                icons={icons}
                navigate={() => _navigate(type)}
                newBadge={false}
              />
              <Pressable
                onPress={() => _setState(type)}
                className="flex-row justify-center mt-2"
              >
                <FontAwesome5
                  name="info-circle"
                  className="text-custom-bg-inverse"
                  size={24}
                />
                <Text className="text-typography-white">
                  {` ${t('savoir_plus')}`}
                </Text>
              </Pressable>
            </VStack>
          ))}
          <VStack className="m-10">
            <AdMobInscriptionsBanner />
          </VStack>
        </VStack>
      </ScrollView>
      {_modalInfos()}
    </SafeAreaView>
  );
};

export default ChoixTypeTournoi;
