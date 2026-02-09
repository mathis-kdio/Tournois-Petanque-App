import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { screenStackNameType } from '@/types/types/searchParams';
import { Box } from '@/components/ui/box';

export interface Props {
  screenStackName: screenStackNameType;
  isLoading: boolean;
  isGenerationSuccess: boolean;
  erreurSpeciaux: boolean;
  erreurMemesEquipes: boolean;
}

const GenerationLoading: React.FC<Props> = ({
  screenStackName,
  isLoading,
  isGenerationSuccess,
  erreurSpeciaux,
  erreurMemesEquipes,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const retourInscription = () => {
    router.replace(`/inscriptions/${screenStackName}`);
  };

  const getTexts = () => {
    if (!isGenerationSuccess) {
      return {
        textInfo: t('erreur_generation_options'),
        textError: t('erreur_generation_options_regles'),
      };
    } else if (erreurSpeciaux) {
      return {
        textInfo: t('erreur_generation_options'),
        textError: t('erreur_generation_joueurs_speciaux'),
      };
    } else if (erreurMemesEquipes) {
      return {
        textInfo: t('erreur_generation_options'),
        textError: t('erreur_generation_regle_equipes'),
      };
    } else {
      return {
        textInfo: t('chargement_publicite'),
        textError: '',
      };
    }
  };

  if (isLoading) {
    return (
      <VStack className="border border-red-500">
        <Loading />
        <Text className="text-typography-white">
          {t('attente_generation_matchs')}
        </Text>
      </VStack>
    );
  }

  const { textInfo, textError } = getTexts();
  return (
    <VStack className="border border-red-500 items-center place-items-center">
      <Box>
        <Loading />
      </Box>
      <Text className="text-typography-white">{textInfo}</Text>
      <Text className="text-typography-white">{textError}</Text>
      <Button action="primary" onPress={() => retourInscription()}>
        <ButtonText>{t('retour_inscription')}</ButtonText>
      </Button>
    </VStack>
  );
};

export default GenerationLoading;
