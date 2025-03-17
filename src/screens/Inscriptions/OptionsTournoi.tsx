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
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@components/TopBarBack';
import { withTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';
import { RouteProp } from '@react-navigation/native';
import { InscriptionStackParamList } from '@/navigation/Navigation';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  route: RouteProp<InscriptionStackParamList, 'OptionsTournoi'>;
}

interface State {
  speciauxIncompatibles: boolean;
  memesEquipes: boolean;
  memesAdversaires: number;
  nbTours: number;
  nbPtVictoire: number;
  avecTerrains: boolean;
}

class OptionsTournoi extends React.Component<Props, State> {
  nbToursTxt: string = '5';
  nbPtVictoireTxt: string = '13';

  constructor(props: Props) {
    super(props);
    this.state = {
      speciauxIncompatibles: true,
      memesEquipes: true,
      memesAdversaires: 50,
      nbTours: 5,
      nbPtVictoire: 13,
      avecTerrains: false,
    };
  }

  _nbToursTxtInputChanged(text: string) {
    this.nbToursTxt = text;
    this.setState({
      nbTours: this.nbToursTxt ? parseInt(this.nbToursTxt) : undefined,
    });
  }

  _nbPtVictoireTxtInputChanged(text: string) {
    this.nbPtVictoireTxt = text;
    this.setState({
      nbPtVictoire: this.nbPtVictoireTxt
        ? parseInt(this.nbPtVictoireTxt)
        : undefined,
    });
  }

  _nextStep() {
    const updateOptionNbTours = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['nbTours', this.state.nbTours],
    };
    this.props.dispatch(updateOptionNbTours);
    const updateOptionNbPtVictoire = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['nbPtVictoire', this.state.nbPtVictoire],
    };
    this.props.dispatch(updateOptionNbPtVictoire);
    const updateOptionSpeciauxIncompatibles = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['speciauxIncompatibles', this.state.speciauxIncompatibles],
    };
    this.props.dispatch(updateOptionSpeciauxIncompatibles);
    const updateOptionMemesEquipes = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['memesEquipes', this.state.memesEquipes],
    };
    this.props.dispatch(updateOptionMemesEquipes);
    const updateOptionMemesAdversaires = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['memesAdversaires', this.state.memesAdversaires],
    };
    this.props.dispatch(updateOptionMemesAdversaires);
    const updateOptionComplement = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['complement', undefined],
    };
    this.props.dispatch(updateOptionComplement);
    const updateOptionAvecTerrains = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['avecTerrains', this.state.avecTerrains],
    };
    this.props.dispatch(updateOptionAvecTerrains);

    this.props.navigation.navigate(this.props.route.params.screenStackName);
  }

  _boutonValider() {
    const { t } = this.props;
    let btnDisabled = true;
    let btnTitle = t('champ_invalide');
    if (
      this.state.nbTours > 0 &&
      this.state.nbTours % 1 === 0 &&
      this.state.nbPtVictoire > 0 &&
      this.state.nbPtVictoire % 1 === 0
    ) {
      btnTitle = t('valider_et_inscriptions');
      btnDisabled = false;
    }
    return (
      <Button
        action="primary"
        isDisabled={btnDisabled}
        onPress={() => this._nextStep()}
        size="md"
      >
        <ButtonText>{btnTitle}</ButtonText>
      </Button>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={{ flex: 1, zIndex: 999 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView className="h-1 bg-[#0594ae]">
            <VStack className="flex-1">
              <TopBarBack
                title={t('options_tournoi_title')}
                navigation={this.props.navigation}
              />
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
                        defaultValue={this.nbToursTxt}
                        onChangeText={(text) =>
                          this._nbToursTxtInputChanged(text)
                        }
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
                        defaultValue={this.nbPtVictoireTxt}
                        onChangeText={(text) =>
                          this._nbPtVictoireTxtInputChanged(text)
                        }
                      />
                    </Input>
                  </VStack>
                </VStack>
                <VStack space="md">
                  <Checkbox
                    value="speciauxIncompatibles"
                    onChange={() =>
                      this.setState({
                        speciauxIncompatibles:
                          !this.state.speciauxIncompatibles,
                      })
                    }
                    aria-label={t('choix_regle_speciaux')}
                    defaultIsChecked
                    size="md"
                  >
                    <CheckboxIndicator className="mr-2 border-white">
                      <CheckboxIcon
                        as={CheckIcon}
                        className="text-white bg-[#0594ae]"
                      />
                    </CheckboxIndicator>
                    <CheckboxLabel className="text-white">
                      {t('options_regle_speciaux')}
                    </CheckboxLabel>
                  </Checkbox>
                  <Checkbox
                    value="memesEquipes"
                    onChange={() =>
                      this.setState({ memesEquipes: !this.state.memesEquipes })
                    }
                    aria-label={t('choix_regle_equipes')}
                    defaultIsChecked
                    size="md"
                  >
                    <CheckboxIndicator className="mr-2 border-white">
                      <CheckboxIcon
                        as={CheckIcon}
                        className="text-white bg-[#0594ae]"
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
                    onChangeEnd={(v) => {
                      this.setState({ memesAdversaires: v });
                    }}
                  >
                    <SliderTrack>
                      <SliderFilledTrack className="bg-[#1c3969]" />
                    </SliderTrack>
                    <SliderThumb className="bg-[#1c3969]" />
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
                    onChange={() =>
                      this.setState({ avecTerrains: !this.state.avecTerrains })
                    }
                    aria-label={t('choix_option_terrains')}
                    size="md"
                  >
                    <CheckboxIndicator className="mr-2 border-white">
                      <CheckboxIcon
                        as={CheckIcon}
                        className="text-white bg-[#0594ae]"
                      />
                    </CheckboxIndicator>
                    <CheckboxLabel className="text-white">
                      {t('options_terrains_explications')}
                    </CheckboxLabel>
                  </Checkbox>
                </VStack>
                <VStack>{this._boutonValider()}</VStack>
              </VStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

export default connector(withTranslation()(OptionsTournoi));
