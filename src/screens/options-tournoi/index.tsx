import { ScrollView } from '@/components/ui/scroll-view';
import { HStack } from '@/components/ui/hstack';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@/components/ui/slider';
import { CheckIcon } from '@/components/ui/icon';

import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import TopBarBack from '@/components/topBar/TopBarBack';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { screenStackNameType } from '@/types/types/searchParams';
import { usePreparationTournoiV2 } from '@/repositories/preparationTournoi/usePreparationTournoi';

export interface Props {
  screenStackName: screenStackNameType;
}

const OptionsTournoi: React.FC<Props> = ({ screenStackName }) => {
  const router = useRouter();

  const { t } = useTranslation();

  const { preparationTournoiVM, updateOptionsPreparationTournoi } =
    usePreparationTournoiV2();

  const defaultNbTours = 5;
  const defaultNbPtVictoire = 13;

  const [speciauxIncompatibles, setSpeciauxIncompatibles] = useState(true);
  const [memesEquipes, setMemesEquipes] = useState(true);
  const [memesAdversaires, setMemesAdversaires] = useState(50);
  const [nbTours, setNbTours] = useState<number | undefined>(defaultNbTours);
  const [nbPtVictoire, setNbPtVictoire] = useState<number | undefined>(
    defaultNbPtVictoire,
  );
  const [avecTerrains, setAvecTerrains] = useState(false);

  if (!preparationTournoiVM) {
    return <Loading />;
  }

  const _nbToursTxtInputChanged = (text: string) => {
    setNbTours(text ? parseInt(text) : undefined);
  };

  const _nbPtVictoireTxtInputChanged = (text: string) => {
    setNbPtVictoire(text ? parseInt(text) : undefined);
  };

  const nextStep = () => {
    if (!nbTours || !nbPtVictoire) {
      throw Error('nbTours ou nbPtVictoire ne devrait pas être undefined');
    }
    updateOptionsPreparationTournoi(
      nbTours,
      nbPtVictoire,
      speciauxIncompatibles,
      memesEquipes,
      memesAdversaires,
      avecTerrains,
    );

    router.navigate(`/inscriptions/${screenStackName}`);
  };

  const boutonValider = () => {
    let btnDisabled = true;
    let btnTitle = t('champ_invalide');
    if (
      nbTours &&
      nbTours > 0 &&
      nbTours % 1 === 0 &&
      nbPtVictoire &&
      nbPtVictoire > 0 &&
      nbPtVictoire % 1 === 0
    ) {
      btnTitle = t('valider_et_inscriptions');
      btnDisabled = false;
    }
    return (
      <Button
        action="primary"
        isDisabled={btnDisabled}
        onPress={() => nextStep()}
        size="md"
      >
        <ButtonText>{btnTitle}</ButtonText>
      </Button>
    );
  };

  return (
    <ScrollView className="h-1 bg-custom-background">
      <VStack className="flex-1">
        <TopBarBack title={t('options_tournoi_title')} />
        <VStack space="4xl" className="px-10">
          <VStack space="md">
            <VStack>
              <Text className="text-typography-white text-md">
                {t('indiquer_nombre_tours')}{' '}
              </Text>
              <Input className="border-custom-bg-inverse">
                <InputField
                  className="text-typography-white placeholder:text-typography-white"
                  placeholder={t('nombre_placeholder')}
                  keyboardType="numeric"
                  defaultValue={defaultNbTours.toString()}
                  onChangeText={(text) => _nbToursTxtInputChanged(text)}
                />
              </Input>
            </VStack>
            <VStack>
              <Text className="text-typography-white text-md">
                {t('indiquer_nombre_points_victoire')}{' '}
              </Text>
              <Input className="border-custom-bg-inverse">
                <InputField
                  className="text-typography-white placeholder:text-typography-white"
                  placeholder={t('nombre_placeholder')}
                  keyboardType="numeric"
                  defaultValue={defaultNbPtVictoire.toString()}
                  onChangeText={(text) => _nbPtVictoireTxtInputChanged(text)}
                />
              </Input>
            </VStack>
          </VStack>
          <VStack space="md">
            <Checkbox
              value="speciauxIncompatibles"
              onChange={() => setSpeciauxIncompatibles(!speciauxIncompatibles)}
              aria-label={t('choix_regle_speciaux')}
              defaultIsChecked
              size="md"
            >
              <CheckboxIndicator className="mr-2 border-custom-bg-inverse">
                <CheckboxIcon
                  as={CheckIcon}
                  className="text-typography-white bg-custom-background"
                />
              </CheckboxIndicator>
              <CheckboxLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                {t('options_regle_speciaux')}
              </CheckboxLabel>
            </Checkbox>
            <Checkbox
              value="memesEquipes"
              onChange={() => setMemesEquipes(!memesEquipes)}
              aria-label={t('choix_regle_equipes')}
              defaultIsChecked
              size="md"
            >
              <CheckboxIndicator className="mr-2 border-custom-bg-inverse">
                <CheckboxIcon
                  as={CheckIcon}
                  className="text-typography-white bg-custom-background"
                />
              </CheckboxIndicator>
              <CheckboxLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                {t('options_regle_equipes')}
              </CheckboxLabel>
            </Checkbox>
          </VStack>
          <VStack>
            <Text className="text-typography-white text-md">
              {t('options_regle_adversaires')}
            </Text>
            <HStack className="justify-between">
              <Text className="text-typography-white">{t('1_seul_match')}</Text>
              <Text className="text-typography-white">
                {t('pourcent_matchs', { pourcent: '100' })}
              </Text>
            </HStack>
            <Slider
              minValue={0}
              maxValue={100}
              defaultValue={50}
              step={50}
              aria-label={t('choix_regle_adversaires')}
              onChangeEnd={(v) => setMemesAdversaires(v)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <HStack className="justify-center">
              <Text className="text-typography-white">
                {t('pourcent_matchs', { pourcent: '50' })}
              </Text>
            </HStack>
          </VStack>
          <VStack>
            <Checkbox
              value="avecTerrains"
              onChange={() => setAvecTerrains(!avecTerrains)}
              aria-label={t('choix_option_terrains')}
              size="md"
            >
              <CheckboxIndicator className="mr-2 border-custom-bg-inverse">
                <CheckboxIcon
                  as={CheckIcon}
                  className="text-typography-white bg-custom-background"
                />
              </CheckboxIndicator>
              <CheckboxLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                {t('options_terrains_explications')}
              </CheckboxLabel>
            </Checkbox>
          </VStack>
          <VStack>{boutonValider()}</VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default OptionsTournoi;
