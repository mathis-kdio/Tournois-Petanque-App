import { Button, ButtonText } from '@/components/ui/button';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';

export interface Props {
  preparationTournoi: PreparationTournoiModel;
  listeJoueurs: JoueurModel[];
}

const StartButton: React.FC<Props> = ({ preparationTournoi, listeJoueurs }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { mode, typeTournoi, typeEquipes, modeCreationEquipes, avecTerrains } =
    preparationTournoi;
  if (!mode || !typeTournoi || !typeEquipes || avecTerrains === undefined) {
    throw Error('options tournoi manqutes');
  }
  if (mode === ModeTournoi.AVECEQUIPES && !modeCreationEquipes) {
    throw Error('modeCreationEquipes manquant');
  }

  const nbJoueurs = listeJoueurs.length;

  const getScreenName = (choixComplement: boolean) => {
    if (choixComplement) {
      return 'choix-complement';
    } else if (avecTerrains) {
      return 'liste-terrains';
    } else {
      return 'generation-matchs';
    }
  };

  const commencer = (choixComplement: boolean) => {
    router.navigate({
      pathname: `/inscriptions/${getScreenName(choixComplement)}`,
      params: {
        screenStackName: 'inscriptions-avec-noms',
      },
    });
  };

  const getNbEquipes = () => {
    if (typeEquipes === TypeEquipes.TETEATETE) {
      return nbJoueurs;
    } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
      return Math.ceil(nbJoueurs / 2);
    } else {
      return Math.ceil(nbJoueurs / 3);
    }
  };

  let btnDisabled = false;
  let title = t('commencer_tournoi');

  let nbEquipes = getNbEquipes();
  let choixComplement = false;

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
        const allValid = Array.from({ length: nbEquipes }).every((_, i) => {
          const count = listeJoueurs.reduce(
            (counter: number, obj: JoueurModel) =>
              obj.equipe === i ? (counter += 1) : counter,
            0,
          );
          return count <= 1;
        });
        if (!allValid) {
          title = t('equipes_trop_joueurs');
          btnDisabled = true;
        }
      }
    } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
      if (nbJoueurs % 4 !== 0 || nbJoueurs === 0) {
        title = t('equipe_doublette_multiple_4');
        btnDisabled = true;
      } else if (modeCreationEquipes === ModeCreationEquipes.MANUELLE) {
        const allValid = Array.from({ length: nbEquipes }).every((_, i) => {
          const count = listeJoueurs.reduce(
            (counter: number, obj: JoueurModel) =>
              obj.equipe === i ? (counter += 1) : counter,
            0,
          );
          return count <= 2;
        });
        if (!allValid) {
          title = t('equipes_trop_joueurs');
          btnDisabled = true;
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
      onPress={() => commencer(choixComplement)}
      size="md"
      className="h-min min-h-10"
    >
      <ButtonText>{title}</ButtonText>
    </Button>
  );
};

export default StartButton;
