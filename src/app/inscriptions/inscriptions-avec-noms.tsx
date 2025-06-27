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
import { Joueur } from '@/types/interfaces/joueur';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

const InscriptionsAvecNoms = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );
  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );

  const _commencer = (choixComplement: boolean) => {
    let screenName = 'generation-matchs';
    if (choixComplement) {
      screenName = 'choix-complement';
    } else if (optionsTournoi.avecTerrains) {
      screenName = 'liste-terrains';
    }
    router.navigate({
      pathname: `/inscriptions/${screenName}`,
      params: {
        screenStackName: 'inscriptions-avec-noms',
      },
    });
  };

  const _boutonCommencer = () => {
    let btnDisabled = false;
    let title = t('commencer_tournoi');
    const nbJoueurs = listesJoueurs[optionsTournoi.mode].length;
    let nbEquipes = 0;
    let choixComplement = false;

    if (optionsTournoi.typeEquipes === TypeEquipes.TETEATETE) {
      nbEquipes = nbJoueurs;
    } else if (optionsTournoi.typeEquipes === TypeEquipes.DOUBLETTE) {
      nbEquipes = Math.ceil(nbJoueurs / 2);
    } else {
      nbEquipes = Math.ceil(nbJoueurs / 3);
    }

    if (
      optionsTournoi.typeTournoi === TypeTournoi.COUPE &&
      (nbEquipes < 4 || Math.log2(nbEquipes) % 1 !== 0)
    ) {
      title = t('configuration_impossible_coupe');
      btnDisabled = true;
    } else if (
      optionsTournoi.typeTournoi === TypeTournoi.MULTICHANCES &&
      (nbEquipes === 0 || nbEquipes % 8 !== 0)
    ) {
      title = t('configuration_impossible_multichances');
      btnDisabled = true;
    } else if (optionsTournoi.mode === ModeTournoi.AVECEQUIPES) {
      if (
        listesJoueurs.avecEquipes.find(
          (el: Joueur) =>
            el.equipe === undefined || el.equipe === 0 || el.equipe > nbEquipes,
        ) !== undefined
      ) {
        title = t('joueurs_sans_equipe');
        btnDisabled = true;
      } else if (optionsTournoi.typeEquipes === TypeEquipes.TETEATETE) {
        if (
          listesJoueurs.avecEquipes.length % 2 !== 0 ||
          listesJoueurs.avecEquipes.length < 2
        ) {
          title = t('nombre_equipe_multiple_2');
          btnDisabled = true;
        } else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = listesJoueurs.avecEquipes.reduce(
              (counter: number, obj: Joueur) =>
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
      } else if (optionsTournoi.typeEquipes === TypeEquipes.DOUBLETTE) {
        if (
          listesJoueurs.avecEquipes.length % 4 !== 0 ||
          listesJoueurs.avecEquipes.length === 0
        ) {
          title = t('equipe_doublette_multiple_4');
          btnDisabled = true;
        } else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = listesJoueurs.avecEquipes.reduce(
              (counter: number, obj: Joueur) =>
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
        optionsTournoi.typeEquipes === TypeEquipes.TRIPLETTE &&
        (listesJoueurs.avecEquipes.length % 6 !== 0 ||
          listesJoueurs.avecEquipes.length === 0)
      ) {
        title = t('equipe_triplette_multiple_6');
        btnDisabled = true;
      }
    } else if (
      optionsTournoi.typeEquipes === TypeEquipes.TETEATETE &&
      (listesJoueurs.avecNoms.length % 2 !== 0 ||
        listesJoueurs.avecNoms.length < 2)
    ) {
      title = t('tete_a_tete_multiple_2');
      btnDisabled = true;
    } else if (optionsTournoi.typeEquipes === TypeEquipes.DOUBLETTE) {
      if (listesJoueurs.avecNoms.length < 4) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (listesJoueurs.avecNoms.length % 4 !== 0) {
        choixComplement = true;
      }
    } else if (optionsTournoi.typeEquipes === TypeEquipes.TRIPLETTE) {
      if (listesJoueurs.avecNoms.length < 6) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (listesJoueurs.avecNoms.length % 6 !== 0) {
        choixComplement = true;
      }
    }

    return (
      <Button
        isDisabled={btnDisabled}
        action={btnDisabled ? 'negative' : 'positive'}
        onPress={() => _commencer(choixComplement)}
        size="md"
        className="h-min min-h-10"
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  };

  const nbJoueur = listesJoueurs[optionsTournoi.mode].length;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('inscription_avec_noms_navigation_title')} />
        <VStack className="flex-1">
          <Text className="text-white text-xl text-center">
            {t('nombre_joueurs', { nb: nbJoueur })}
          </Text>
          <Inscriptions loadListScreen={false} />
          <Box className="px-10">{_boutonCommencer()}</Box>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default InscriptionsAvecNoms;
