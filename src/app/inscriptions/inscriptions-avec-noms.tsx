import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import Inscriptions from '@components/Inscriptions';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';

const InscriptionsAvecNoms = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { getActualPreparationTournoi } = usePreparationTournoi();

  const [preparationTournoi, setPreparationTournoi] = useState<
    PreparationTournoiModel | undefined
  >(undefined);
  const [listeJoueurs, setlisteJoueurs] = useState<JoueurModel[]>([]);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const resultpreparationTournoi = await getActualPreparationTournoi();
      setPreparationTournoi(resultpreparationTournoi);
      setlisteJoueurs([]);
      setloading(false);
    };
    fetchData();
  }, [getActualPreparationTournoi]);

  if (loading) {
    return <Loading />;
  }

  if (!preparationTournoi) {
    throw Error;
  }

  const _commencer = (choixComplement: boolean, avecTerrains: boolean) => {
    let screenName = 'generation-matchs';
    if (choixComplement) {
      screenName = 'choix-complement';
    } else if (avecTerrains) {
      screenName = 'liste-terrains';
    }
    router.navigate({
      pathname: `/inscriptions/${screenName}`,
      params: {
        screenStackName: 'inscriptions-avec-noms',
      },
    });
  };

  const _boutonCommencer = (
    listeJoueurs: JoueurModel[],
    preparationTournoi: PreparationTournoiModel,
  ) => {
    let btnDisabled = false;
    let title = t('commencer_tournoi');
    const {
      mode,
      typeTournoi,
      typeEquipes,
      modeCreationEquipes,
      avecTerrains,
    } = preparationTournoi;
    if (!mode || !typeTournoi || !typeEquipes || avecTerrains === undefined) {
      throw Error('options tournoi manqutes');
    }
    if (mode === ModeTournoi.AVECEQUIPES && !modeCreationEquipes) {
      throw Error('modeCreationEquipes manquant');
    }

    const nbJoueurs = listeJoueurs.length;
    let nbEquipes = 0;
    let choixComplement = false;

    if (typeEquipes === TypeEquipes.TETEATETE) {
      nbEquipes = nbJoueurs;
    } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
      nbEquipes = Math.ceil(nbJoueurs / 2);
    } else {
      nbEquipes = Math.ceil(nbJoueurs / 3);
    }

    if (
      typeTournoi === TypeTournoi.COUPE &&
      (nbEquipes < 4 || Math.log2(nbEquipes) % 1 !== 0)
    ) {
      title = t('configuration_impossible_coupe');
      btnDisabled = true;
    } else if (
      typeTournoi === TypeTournoi.MULTICHANCES &&
      (nbEquipes === 0 || nbEquipes % 8 !== 0)
    ) {
      title = t('configuration_impossible_multichances');
      btnDisabled = true;
    } else if (mode === ModeTournoi.AVECEQUIPES) {
      if (
        modeCreationEquipes === ModeCreationEquipes.MANUELLE &&
        listeJoueurs.find(
          (el: JoueurModel) =>
            el.equipe === undefined || el.equipe === 0 || el.equipe > nbEquipes,
        ) !== undefined
      ) {
        title = t('joueurs_sans_equipe');
        btnDisabled = true;
      } else if (typeEquipes === TypeEquipes.TETEATETE) {
        if (nbJoueurs % 2 !== 0 || nbJoueurs < 2) {
          title = t('nombre_equipe_multiple_2');
          btnDisabled = true;
        } else if (modeCreationEquipes === ModeCreationEquipes.MANUELLE) {
          for (let i = 0; i < nbEquipes; i++) {
            let count = listeJoueurs.reduce(
              (counter: number, obj: JoueurModel) =>
                obj.equipe === i ? (counter += 1) : counter,
              0,
            );
            if (count > 1) {
              title = t('equipes_trop_joueurs');
              btnDisabled = true;
              break;
            }
          }
        }
      } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
        if (nbJoueurs % 4 !== 0 || nbJoueurs === 0) {
          title = t('equipe_doublette_multiple_4');
          btnDisabled = true;
        } else if (modeCreationEquipes === ModeCreationEquipes.MANUELLE) {
          for (let i = 0; i < nbEquipes; i++) {
            let count = listeJoueurs.reduce(
              (counter: number, obj: JoueurModel) =>
                obj.equipe === i ? (counter += 1) : counter,
              0,
            );
            if (count > 2) {
              title = t('equipes_trop_joueurs');
              btnDisabled = true;
              break;
            }
          }
        }
      } else if (
        typeEquipes === TypeEquipes.TRIPLETTE &&
        (nbJoueurs % 6 !== 0 || nbJoueurs === 0)
      ) {
        title = t('equipe_triplette_multiple_6');
        btnDisabled = true;
      }
    } else if (
      typeEquipes === TypeEquipes.TETEATETE &&
      (nbJoueurs % 2 !== 0 || nbJoueurs < 2)
    ) {
      title = t('tete_a_tete_multiple_2');
      btnDisabled = true;
    } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
      if (nbJoueurs < 4) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (nbJoueurs % 4 !== 0) {
        choixComplement = true;
      }
    } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
      if (nbJoueurs < 6) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (nbJoueurs % 6 !== 0) {
        choixComplement = true;
      }
    }

    return (
      <Button
        isDisabled={btnDisabled}
        action={btnDisabled ? 'negative' : 'positive'}
        onPress={() => _commencer(choixComplement, avecTerrains)}
        size="md"
        className="h-min min-h-10"
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  };

  const nbJoueur = listeJoueurs.length;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('inscription_avec_noms_navigation_title')} />
        <VStack className="flex-1">
          <Text className="text-typography-white text-xl text-center">
            {t('nombre_joueurs', { nb: nbJoueur })}
          </Text>
          <Inscriptions
            listeJoueurs={listeJoueurs}
            preparationTournoi={preparationTournoi}
            loadListScreen={false}
          />
          <Box className="px-10">
            {_boutonCommencer(listeJoueurs, preparationTournoi)}
          </Box>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default InscriptionsAvecNoms;
