import { ScrollView } from '@/components/ui/scroll-view';
import { Box } from '@/components/ui/box';
import { CircleIcon } from '@/components/ui/icon';
import {
  Radio,
  RadioLabel,
  RadioIcon,
  RadioGroup,
  RadioIndicator,
} from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { useTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '@/components/adMob/AdMobInscriptionsBanner';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';

const ChoixModeTournoi = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );

  const [typeEquipes, setTypeEquipes] = useState(TypeEquipes.DOUBLETTE);
  const [modeTournoi, setModeTournoi] = useState(ModeTournoi.AVECNOMS);
  const [modeCreationEquipes, setModeCreationEquipes] = useState(
    ModeCreationEquipes.MANUELLE,
  );

  const _nextStep = () => {
    //Sauvegarde typeEquipes
    const updateOptionEquipesTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['typeEquipes', typeEquipes],
    };
    dispatch(updateOptionEquipesTournoi);

    //Sauvegarde modeTournoi
    let finalModeTournoi = modeTournoi;
    let typeTournoi = optionsTournoi.typeTournoi;
    if (typeTournoi !== TypeTournoi.MELEDEMELE) {
      finalModeTournoi = ModeTournoi.AVECEQUIPES;
    }
    const updateOptionModeTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['mode', finalModeTournoi],
    };
    dispatch(updateOptionModeTournoi);

    //Sauvegarde modeCreationEquipes
    if (typeTournoi !== TypeTournoi.MELEDEMELE) {
      const updateOptionModeCreationEquipes = {
        type: 'UPDATE_OPTION_TOURNOI',
        value: ['modeCreationEquipes', modeCreationEquipes],
      };
      dispatch(updateOptionModeCreationEquipes);
    }

    if (
      typeTournoi !== TypeTournoi.CHAMPIONNAT &&
      typeTournoi !== TypeTournoi.COUPE &&
      typeTournoi !== TypeTournoi.MULTICHANCES
    ) {
      let screenName =
        modeTournoi === ModeTournoi.SANSNOMS
          ? 'inscriptions-sans-noms'
          : 'inscriptions-avec-noms';
      router.navigate({
        pathname: '/inscriptions/options-tournoi',
        params: {
          screenStackName: screenName,
        },
      });
    } else {
      router.navigate('/inscriptions/inscriptions-avec-noms');
    }
  };

  const _validButton = () => {
    let buttonDisabled = false;
    let title = t('valider_et_options');
    let typeTournoi = optionsTournoi.typeTournoi;
    if (
      typeTournoi === TypeTournoi.CHAMPIONNAT ||
      typeTournoi === TypeTournoi.COUPE ||
      typeTournoi === TypeTournoi.MULTICHANCES
    ) {
      title = t('valider_et_inscriptions');
    }
    return (
      <Button
        action="primary"
        isDisabled={buttonDisabled}
        onPress={() => _nextStep()}
        size="md"
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  };

  const _modeTournoi = () => {
    const { typeTournoi } = optionsTournoi;
    if (typeTournoi !== TypeTournoi.MELEDEMELE) {
      return;
    }
    return (
      <VStack>
        <Text className="text-typography-white text-2xl text-center">
          {t('mode_tournoi')}
        </Text>
        <RadioGroup
          aria-label={t('choix_mode_tournoi')}
          value={modeTournoi}
          onChange={(nextValue) => setModeTournoi(nextValue)}
        >
          <VStack space="lg">
            <Radio value={ModeTournoi.AVECNOMS} size="lg">
              <RadioIndicator className="mr-2 border-custom-bg-inverse">
                <RadioIcon as={CircleIcon} className="fill-custom-bg-inverse" />
              </RadioIndicator>
              <RadioLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                {t('melee_demelee_avec_nom')}
              </RadioLabel>
            </Radio>
            <Radio value={ModeTournoi.SANSNOMS} size="lg">
              <RadioIndicator className="mr-2 border-custom-bg-inverse">
                <RadioIcon as={CircleIcon} className="fill-custom-bg-inverse" />
              </RadioIndicator>
              <RadioLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                {t('melee_demelee_sans_nom')}
              </RadioLabel>
            </Radio>
          </VStack>
        </RadioGroup>
      </VStack>
    );
  };

  const _typeEquipe = () => {
    const { typeTournoi } = optionsTournoi;
    if (typeTournoi === TypeTournoi.MELEDEMELE) {
      return;
    }
    return (
      <VStack>
        <Text className="text-typography-white text-2xl text-center mb-4">
          {t('mode_creation_equipe')}
        </Text>
        <RadioGroup
          aria-label={t('choix_mode_creation_equipes')}
          value={modeCreationEquipes}
          onChange={setModeCreationEquipes}
        >
          <VStack space="lg">
            {[ModeCreationEquipes.ALEATOIRE, ModeCreationEquipes.MANUELLE].map(
              (mode) => (
                <Radio key={mode} value={mode} size="lg">
                  <RadioIndicator className="mr-2 border-custom-bg-inverse">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-custom-bg-inverse"
                    />
                  </RadioIndicator>
                  <RadioLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white">
                    {t(
                      mode === ModeCreationEquipes.ALEATOIRE
                        ? 'equipes_aleatoires'
                        : 'equipes_manuelles',
                    )}
                  </RadioLabel>
                </Radio>
              ),
            )}
          </VStack>
        </RadioGroup>
      </VStack>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-custom-background">
        <TopBarBack title={t('mode_tournoi')} />
        <VStack className="flex-1 px-10 justify-between">
          <VStack space="4xl">
            <Text className="text-typography-white text-2xl text-center">
              {t('type_equipes')}
            </Text>
            <RadioGroup
              aria-label={t('choix_type_equipes')}
              value={typeEquipes}
              onChange={(nextValue) => setTypeEquipes(nextValue)}
            >
              <VStack space="lg">
                <Radio value={TypeEquipes.TETEATETE} size="lg">
                  <RadioIndicator className="mr-2 border-custom-bg-inverse">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-custom-bg-inverse"
                    />
                  </RadioIndicator>
                  <RadioLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                    {t('tete_a_tete')}
                  </RadioLabel>
                </Radio>
                <Radio value={TypeEquipes.DOUBLETTE} size="lg">
                  <RadioIndicator className="mr-2 border-custom-bg-inverse">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-custom-bg-inverse"
                    />
                  </RadioIndicator>
                  <RadioLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                    {t('doublettes')}
                  </RadioLabel>
                </Radio>
                <Radio value={TypeEquipes.TRIPLETTE} size="lg">
                  <RadioIndicator className="mr-2 border-custom-bg-inverse">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-custom-bg-inverse"
                    />
                  </RadioIndicator>
                  <RadioLabel className="text-typography-white data-[hover=true]:text-typography-white data-[checked=true]:text-typography-white data-[hover=true]:data-[checked=true]:text-typography-white">
                    {t('triplettes')}
                  </RadioLabel>
                </Radio>
              </VStack>
            </RadioGroup>
            {_modeTournoi()}
            {_typeEquipe()}
            {_validButton()}
          </VStack>
          <Box className="my-10">
            <AdMobInscriptionsBanner />
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChoixModeTournoi;
