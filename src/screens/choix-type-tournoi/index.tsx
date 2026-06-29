import AdMobInscriptionsBanner from '@/components/adMob/AdMobInscriptionsBanner';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { updateTypePreparationTournoi } from '@/repositories/preparationTournoi/preparationTournoiActions';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import CardButton from '@components/buttons/CardButton';
import {
  FontAwesome,
  FontAwesomeIconName,
} from '@react-native-vector-icons/fontawesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TypeTournoiModal from './components/TypeTournoiModal';

const ChoixTypeTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<TypeTournoi | undefined>();

  const listeTypeTournois = [
    {
      type: TypeTournoi.MELEDEMELE,
      text: t('type_melee_demelee'),
      icons: ['random'] as FontAwesomeIconName[],
    },
    {
      type: TypeTournoi.MELEE,
      text: t('type_melee'),
      icons: ['users'] as FontAwesomeIconName[],
    },
    {
      type: TypeTournoi.CHAMPIONNAT,
      text: t('type_championnat'),
      icons: ['table'] as FontAwesomeIconName[],
    },
    {
      type: TypeTournoi.COUPE,
      text: t('type_coupe'),
      icons: ['trophy'] as FontAwesomeIconName[],
    },
    {
      type: TypeTournoi.MULTICHANCES,
      text: t('type_multi_chances'),
      icons: ['code-fork'] as FontAwesomeIconName[],
    },
  ];

  const modalInfos = () => {
    if (!modalType) {
      return;
    }
    return (
      <TypeTournoiModal
        modalType={modalType}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    );
  };

  const navigate = async (typeTournoi: TypeTournoi) => {
    await updateTypePreparationTournoi(typeTournoi);
    return router.navigate('inscriptions/choix-mode-tournoi');
  };

  const setState = (modalType: TypeTournoi) => {
    setShowModal(true);
    setModalType(modalType);
  };

  return (
    <ScrollView className="h-1 bg-custom-background">
      <TopBarBack title={t('type_tournoi')} />
      <VStack space="2xl" className="flex-1 px-10">
        {listeTypeTournois.map(({ type, text, icons }) => (
          <VStack className="flex-1" key={type}>
            <CardButton
              text={text}
              icons={icons}
              navigate={() => navigate(type)}
              newBadge={false}
            />
            <Pressable
              onPress={() => setState(type)}
              className="flex-row justify-center mt-2"
            >
              <FontAwesome
                name="info-circle"
                className="!text-custom-bg-inverse"
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
      {modalInfos()}
    </ScrollView>
  );
};

export default ChoixTypeTournoi;
