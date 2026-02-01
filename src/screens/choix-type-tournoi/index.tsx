import { ScrollView } from '@/components/ui/scroll-view';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from '@/components/topBar/TopBarBack';
import CardButton from '@components/buttons/CardButton';
import { useTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '@/components/adMob/AdMobInscriptionsBanner';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { useRouter } from 'expo-router';
import { usePreparationTournoiV2 } from '@/repositories/preparationTournoi/usePreparationTournoi';
import TypeTournoiModal from './components/TypeTournoiModal';

const ChoixTypeTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { updateTypePreparationTournoi } = usePreparationTournoiV2();

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

  const navigate = (typeTournoi: TypeTournoi) => {
    updateTypePreparationTournoi(typeTournoi);
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
      {modalInfos()}
    </ScrollView>
  );
};

export default ChoixTypeTournoi;
