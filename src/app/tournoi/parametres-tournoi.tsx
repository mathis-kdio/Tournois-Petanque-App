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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { useDispatch, useSelector } from 'react-redux';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { useNavigation, useRouter } from 'expo-router';
import { CommonActions } from '@react-navigation/native';

const ParametresTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tournoi = useSelector((state: any) => state.gestionMatchs.listematchs);

  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  const _showMatchs = () => {
    router.navigate('/tournoi');
  };

  const _supprimerTournoi = () => {
    setModalDeleteIsOpen(false);
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'index' }],
      }),
    );

    const supprDansListeTournois = {
      type: 'SUPPR_TOURNOI',
      value: {
        tournoiId: tournoi.at(-1).tournoiID,
      },
    };
    const suppressionAllMatchs = { type: 'SUPPR_MATCHS' };
    setTimeout(() => {
      dispatch(supprDansListeTournois);
      dispatch(suppressionAllMatchs);
    }, 1000);
  };

  const _modalSupprimerTournoi = () => {
    let tournoiId = 0;
    if (tournoi) {
      tournoiId = tournoi.at(-1).tournoiID;
    }
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
              <Button action="negative" onPress={() => _supprimerTournoi()}>
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  let parametresTournoi: OptionsTournoi = {
    nbTours: 0,
    nbPtVictoire: 13,
    speciauxIncompatibles: false,
    memesEquipes: false,
    memesAdversaires: 50,
  };
  if (tournoi) {
    parametresTournoi = tournoi.at(-1) as OptionsTournoi;
    parametresTournoi.nbPtVictoire = parametresTournoi.nbPtVictoire
      ? parametresTournoi.nbPtVictoire
      : 13;
  }
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
              {t('nombre_tours')} {parametresTournoi.nbTours.toString()}
            </Text>
            <Text className="text-typography-white">
              {t('nombre_points_victoire')}{' '}
              {parametresTournoi.nbPtVictoire.toString()}
            </Text>
            <Text className="text-typography-white">
              {t('regle_speciaux')}{' '}
              {parametresTournoi.speciauxIncompatibles ? 'Activé' : 'Désactivé'}
            </Text>
            <Text className="text-typography-white">
              {t('regle_equipes_differentes')}{' '}
              {parametresTournoi.memesEquipes ? 'Activé' : 'Désactivé'}
            </Text>
            <Text className="text-typography-white">
              {t('regle_adversaires')}{' '}
              {parametresTournoi.memesAdversaires === 0
                ? '1 match'
                : parametresTournoi.memesAdversaires + '% des matchs'}
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
      {_modalSupprimerTournoi()}
    </SafeAreaView>
  );
};

export default ParametresTournoi;
