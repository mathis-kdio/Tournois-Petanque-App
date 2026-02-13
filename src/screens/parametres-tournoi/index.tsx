import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonText } from '@/components/ui/button';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTournois } from '@/repositories/tournois/useTournois';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteTournoiModal from './components/DeleteTournoiModal';

const ParametresTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  const { actualTournoi } = useTournois();

  if (!actualTournoi) {
    return <Loading />;
  }

  const showMatchs = () => {
    router.navigate('/tournoi');
  };

  const modalSupprimerTournoi = (tournoiId: number) => {
    return (
      <DeleteTournoiModal
        tournoiId={tournoiId}
        modalDeleteIsOpen={modalDeleteIsOpen}
        setModalDeleteIsOpen={setModalDeleteIsOpen}
      />
    );
  };

  const {
    tournoiID,
    typeTournoi,
    typeEquipes,
    nbTours,
    nbMatchs,
    nbPtVictoire,
    complement,
    speciauxIncompatibles,
    memesEquipes,
    memesAdversaires,
  } = actualTournoi.options;
  return (
    <ScrollView className="h-1 bg-custom-background">
      <TopBarBack title={t('parametres_tournoi_navigation_title')} />
      <VStack className="flex-1 px-10 justify-around">
        <VStack>
          <Text className="text-typography-white text-xl text-center">
            {t('options_tournoi')}
          </Text>
          <Text className="text-typography-white">
            {`${t('type_tournoi_tiret')} ${typeTournoi}`}
          </Text>
          <Text className="text-typography-white">
            {`${t('type_equipes_tiret')} ${typeEquipes}`}
          </Text>
          <Text className="text-typography-white">
            {`${t('nombre_tours_tiret')} ${nbTours}`}
          </Text>
          <Text className="text-typography-white">
            {`${t('nombre_matchs_tiret')} ${nbMatchs}`}
          </Text>
          <Text className="text-typography-white">
            {`${t('nombre_points_victoire_tiret')} ${nbPtVictoire ? nbPtVictoire : 13}`}
          </Text>
          {complement && (
            <Text className="text-typography-white">
              {`${t('complement_tiret')} ${complement}`}
            </Text>
          )}
          <Text className="text-typography-white">
            {`${t('regle_equipes_differentes_tiret')} ${memesEquipes ? t('oui') : t('non')}`}
          </Text>
          <Text className="text-typography-white">
            {`${t('regle_adversaires_tiret')} ${memesAdversaires === 0 ? t('1_match') : t('pourcent_matchs', { pourcent: memesAdversaires })}`}
          </Text>
          <Text className="text-typography-white">
            {`${t('regle_speciaux_tiret')} ${speciauxIncompatibles ? t('oui') : t('non')}`}
          </Text>
        </VStack>
        <VStack space="xl">
          <Button action="negative" onPress={() => setModalDeleteIsOpen(true)}>
            <ButtonText>{t('supprimer_tournoi')}</ButtonText>
          </Button>
          <Button action="primary" onPress={() => showMatchs()}>
            <ButtonText>{t('retour_liste_matchs_bouton')}</ButtonText>
          </Button>
        </VStack>
      </VStack>
      {modalSupprimerTournoi(tournoiID)}
    </ScrollView>
  );
};

export default ParametresTournoi;
