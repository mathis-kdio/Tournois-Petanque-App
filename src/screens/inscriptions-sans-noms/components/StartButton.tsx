import { Button, ButtonText } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { JoueurType } from '@/types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';

export interface Props {
  preparationTournoiModel: PreparationTournoiModel;
  nbJoueurNormaux: number;
  nbJoueurEnfants: number;
}

const StartButton: React.FC<Props> = ({
  preparationTournoiModel,
  nbJoueurNormaux,
  nbJoueurEnfants,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const ajoutJoueur = (type?: JoueurType) => {
    const action = {
      type: 'AJOUT_JOUEUR',
      value: [ModeTournoi.SANSNOMS, '', type, undefined],
    };
    dispatch(action);
  };

  const supprimerJoueurs = () => {
    const suppressionAllJoueurs = {
      type: 'SUPPR_ALL_JOUEURS',
      value: [ModeTournoi.SANSNOMS],
    };
    dispatch(suppressionAllJoueurs);
  };

  const getNextScreen = (choixComplement: boolean, avecTerrains: boolean) => {
    if (choixComplement) {
      return 'choix-complement';
    } else if (avecTerrains) {
      return 'liste-terrains';
    } else {
      return 'generation-matchs';
    }
  };

  const commencer = (choixComplement: boolean, avecTerrains: boolean) => {
    supprimerJoueurs();

    for (let i = 0; i < nbJoueurNormaux; i++) {
      ajoutJoueur();
    }

    for (let i = 0; i < nbJoueurEnfants; i++) {
      ajoutJoueur(JoueurType.ENFANT);
    }

    router.navigate({
      pathname: `/inscriptions/${getNextScreen(choixComplement, avecTerrains)}`,
      params: {
        screenStackName: 'inscriptions-sans-noms',
      },
    });
  };

  const { typeEquipes, avecTerrains } = preparationTournoiModel;
  if (!typeEquipes || !avecTerrains) {
    throw Error('typeEquipes ou avecTerrains non défini');
  }

  let btnDisabled = false;
  let title = t('commencer_tournoi');
  let nbJoueurs = nbJoueurNormaux + nbJoueurEnfants;
  let choixComplement = false;

  if (
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
      action="positive"
      onPress={() => commencer(choixComplement, avecTerrains)}
      className="h-min min-h-10"
    >
      <ButtonText>{title}</ButtonText>
    </Button>
  );
};

export default StartButton;
