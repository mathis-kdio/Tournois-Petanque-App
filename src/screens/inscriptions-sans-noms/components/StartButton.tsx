import { Button, ButtonText } from '@/components/ui/button';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useInscriptionSansNom } from '../hooks/use-inscription-sans-noms';

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

  const { addJoueurs, clearJoueursAutresInscriptions } =
    useInscriptionSansNom();

  const { typeEquipes, avecTerrains } = preparationTournoiModel;
  if (!typeEquipes) {
    throw Error('typeEquipes non défini');
  }

  const getNextScreen = (choixComplement: boolean) => {
    if (choixComplement) {
      return 'choix-complement';
    } else if (avecTerrains) {
      return 'liste-terrains';
    } else {
      return 'generation-matchs';
    }
  };

  const commencer = async (choixComplement: boolean) => {
    await clearJoueursAutresInscriptions();

    await addJoueurs(nbJoueurNormaux, nbJoueurEnfants);

    router.navigate({
      pathname: `/inscriptions/${getNextScreen(choixComplement)}`,
      params: {
        screenStackName: 'inscriptions-sans-noms',
      },
    });
  };

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
      onPress={() => commencer(choixComplement)}
      className="h-min min-h-10"
    >
      <ButtonText>{title}</ButtonText>
    </Button>
  );
};

export default StartButton;
