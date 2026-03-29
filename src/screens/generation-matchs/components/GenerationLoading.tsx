import Loading from '@/components/Loading';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { screenStackNameType } from '@/types/types/searchParams';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

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
      <VStack>
        <HStack>
          <Loading />
        </HStack>
        <Text className="text-typography-white">
          {t('attente_generation_matchs')}
        </Text>
      </VStack>
    );
  }

  const { textInfo, textError } = getTexts();
  return (
    <VStack>
      <Text className="text-typography-white text-center">{textInfo}</Text>
      <Text className="text-typography-white text-center">{textError}</Text>
      <Button action="primary" onPress={() => retourInscription()}>
        <ButtonText>{t('retour_inscription')}</ButtonText>
      </Button>
    </VStack>
  );
};

export default GenerationLoading;
