import { Button, ButtonText } from '@/components/ui/button';
import { calcNbMatchsParTour } from '@utils/generations/generation';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { screenStackNameType } from '@/types/types/searchParams';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { JoueurModel } from '@/types/interfaces/joueurModel';

export interface Props {
  screenStackName: screenStackNameType;
  joueursModel: JoueurModel[];
  terrainsModel: TerrainModel[];
  preparationTournoiModel: PreparationTournoiModel;
}

const StartButton: React.FC<Props> = ({
  screenStackName,
  joueursModel,
  terrainsModel,
  preparationTournoiModel,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const commencer = () => {
    router.navigate({
      pathname: '/inscriptions/generation-matchs',
      params: {
        screenStackName: screenStackName,
      },
    });
  };

  const { typeEquipes, mode, typeTournoi, complement } =
    preparationTournoiModel;
  if (!typeEquipes || !mode || !typeTournoi) {
    throw Error('options incomplètes');
  }

  const nbJoueurs = joueursModel.length;
  const nbTerrainsNecessaires = calcNbMatchsParTour(
    nbJoueurs,
    typeEquipes,
    mode,
    typeTournoi,
    complement,
  );
  const disabled = terrainsModel.length < nbTerrainsNecessaires;
  const title = disabled ? t('terrains_insuffisants') : t('commencer');
  return (
    <Button isDisabled={disabled} action="positive" onPress={() => commencer()}>
      <ButtonText>{title}</ButtonText>
    </Button>
  );
};

export default StartButton;
