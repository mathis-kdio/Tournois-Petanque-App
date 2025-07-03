import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { screenStackNameType } from '@/types/types/searchParams';

type SearchParams = {
  screenStackName?: string;
};

const OptionsTournoi = () => {
  const router = useRouter();
  const param = useLocalSearchParams<SearchParams>();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [speciauxIncompatibles, setSpeciauxIncompatibles] = useState(true);
  const [memesEquipes, setMemesEquipes] = useState(true);
  const [memesAdversaires, setMemesAdversaires] = useState(50);
  const [nbTours, setNbTours] = useState<number | undefined>(5);
  const [nbPtVictoire, setNbPtVictoire] = useState<number | undefined>(13);
  const [avecTerrains, setAvecTerrains] = useState(false);

  let nbToursTxt: string = '5';
  let nbPtVictoireTxt: string = '13';

  const _nbToursTxtInputChanged = (text: string) => {
    nbToursTxt = text;
    setNbTours(nbToursTxt ? parseInt(nbToursTxt) : undefined);
  };

  const _nbPtVictoireTxtInputChanged = (text: string) => {
    nbPtVictoireTxt = text;
    setNbPtVictoire(nbPtVictoireTxt ? parseInt(nbPtVictoireTxt) : undefined);
  };

  const _nextStep = (screenStackName: screenStackNameType) => {
    const updateOptionNbTours = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['nbTours', nbTours],
    };
    dispatch(updateOptionNbTours);
    const updateOptionNbPtVictoire = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['nbPtVictoire', nbPtVictoire],
    };
    dispatch(updateOptionNbPtVictoire);
    const updateOptionSpeciauxIncompatibles = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['speciauxIncompatibles', speciauxIncompatibles],
    };
    dispatch(updateOptionSpeciauxIncompatibles);
    const updateOptionMemesEquipes = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['memesEquipes', memesEquipes],
    };
    dispatch(updateOptionMemesEquipes);
    const updateOptionMemesAdversaires = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['memesAdversaires', memesAdversaires],
    };
    dispatch(updateOptionMemesAdversaires);
    const updateOptionComplement = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['complement', undefined],
    };
    dispatch(updateOptionComplement);
    const updateOptionAvecTerrains = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['avecTerrains', avecTerrains],
    };
    dispatch(updateOptionAvecTerrains);

    router.navigate(`/inscriptions/${screenStackName}`);
  };

  const _boutonValider = (screenStackName: screenStackNameType) => {
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
        onPress={() => _nextStep(screenStackName)}
        size="md"
      >
        <ButtonText>{btnTitle}</ButtonText>
      </Button>
    );
  };

  if (
    param.screenStackName !== 'inscriptions-avec-noms' &&
    param.screenStackName !== 'inscriptions-sans-noms'
  ) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{ flex: 1, zIndex: 999 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-custom-background">
          <VStack className="flex-1">
            <TopBarBack title={t('options_tournoi_title')} />
            <VStack space="4xl" className="px-10">
              <VStack space="md">
                <VStack>
                  <Text className="text-white text-md">
                    {t('indiquer_nombre_tours')}{' '}
                  </Text>
                  <Input className="border-white">
                    <InputField
                      className="text-white placeholder:text-white"
                      placeholder={t('nombre_placeholder')}
                      keyboardType="numeric"
                      defaultValue={nbToursTxt}
                      onChangeText={(text) => _nbToursTxtInputChanged(text)}
                    />
                  </Input>
                </VStack>
                <VStack>
                  <Text className="text-white text-md">
                    {t('indiquer_nombre_points_victoire')}{' '}
                  </Text>
                  <Input className="border-white">
                    <InputField
                      className="text-white placeholder:text-white"
                      placeholder={t('nombre_placeholder')}
                      keyboardType="numeric"
                      defaultValue={nbPtVictoireTxt}
                      onChangeText={(text) =>
                        _nbPtVictoireTxtInputChanged(text)
                      }
                    />
                  </Input>
                </VStack>
              </VStack>
              <VStack space="md">
                <Checkbox
                  value="speciauxIncompatibles"
                  onChange={() =>
                    setSpeciauxIncompatibles(!speciauxIncompatibles)
                  }
                  aria-label={t('choix_regle_speciaux')}
                  defaultIsChecked
                  size="md"
                >
                  <CheckboxIndicator className="mr-2 border-white">
                    <CheckboxIcon
                      as={CheckIcon}
                      className="text-white bg-custom-background"
                    />
                  </CheckboxIndicator>
                  <CheckboxLabel className="text-white">
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
                  <CheckboxIndicator className="mr-2 border-white">
                    <CheckboxIcon
                      as={CheckIcon}
                      className="text-white bg-custom-background"
                    />
                  </CheckboxIndicator>
                  <CheckboxLabel className="text-white">
                    {t('options_regle_equipes')}
                  </CheckboxLabel>
                </Checkbox>
              </VStack>
              <VStack>
                <Text className="text-white text-md">
                  {t('options_regle_adversaires')}
                </Text>
                <HStack className="justify-between">
                  <Text className="text-white">{t('1_seul_match')}</Text>
                  <Text className="text-white">
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
                  <Text className="text-white">
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
                  <CheckboxIndicator className="mr-2 border-white">
                    <CheckboxIcon
                      as={CheckIcon}
                      className="text-white bg-custom-background"
                    />
                  </CheckboxIndicator>
                  <CheckboxLabel className="text-white">
                    {t('options_terrains_explications')}
                  </CheckboxLabel>
                </Checkbox>
              </VStack>
              <VStack>{_boutonValider(param.screenStackName)}</VStack>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default OptionsTournoi;
