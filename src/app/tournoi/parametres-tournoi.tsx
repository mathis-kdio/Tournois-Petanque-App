import { ScrollView } from '@/components/ui/scroll-view';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { useNavigation, useRouter } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import { useTournoisRepository } from '@/repositories/useTournoisRepository';
import { TournoiModel } from '@/types/interfaces/tournoi';

const ParametresTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();

  const { getActualTournoi, deleteTournoi } = useTournoisRepository();

  const [tournoi, setTournoi] = useState<TournoiModel | undefined>(undefined);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const resultTournoi = await getActualTournoi();
      setTournoi(resultTournoi);
    };
    fetchData();
  }, [getActualTournoi]);

  if (!tournoi) {
    return <></>;
  }

  const _showMatchs = () => {
    router.navigate('/tournoi');
  };

  const _supprimerTournoi = (tournoiId: number) => {
    setModalDeleteIsOpen(false);
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'index' }],
      }),
    );

    setTimeout(() => {
      deleteTournoi(tournoiId);
    }, 1000);
  };

  const _modalSupprimerTournoi = (tournoiId: number) => {
    return (
      <AlertDialog
        isOpen={modalDeleteIsOpen}
        onClose={() => setModalDeleteIsOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="color-custom-text-modal">
              {t('supprimer_tournoi_actuel_modal_titre')}
            </Heading>
            <AlertDialogCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              {t('supprimer_tournoi_actuel_modal_texte', { id: tournoiId })}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup flexDirection="row">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => setModalDeleteIsOpen(false)}
              >
                <ButtonText className="color-custom-text-modal">
                  {t('annuler')}
                </ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={() => _supprimerTournoi(tournoiId)}
              >
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
  } = tournoi.options;
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            <Button
              action="negative"
              onPress={() => setModalDeleteIsOpen(true)}
            >
              <ButtonText>{t('supprimer_tournoi')}</ButtonText>
            </Button>
            <Button action="primary" onPress={() => _showMatchs()}>
              <ButtonText>{t('retour_liste_matchs_bouton')}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
      {_modalSupprimerTournoi(tournoiID)}
    </SafeAreaView>
  );
};

export default ParametresTournoi;
