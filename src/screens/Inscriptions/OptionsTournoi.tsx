import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox, VStack, Button, Text, Input, Select, CheckIcon, Slider, HStack, ScrollView, ButtonText, SliderTrack, SliderFilledTrack, SliderThumb, SelectItem, CheckboxIndicator, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, ChevronDownIcon, InputField, CheckboxLabel, KeyboardAvoidingView } from '@gluestack-ui/themed';
import TopBarBack from '@components/TopBarBack';
import { withTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { Complement } from '@/types/enums/complement';
import { PropsFromRedux, connector } from '@/store/connector';
import { RouteProp } from '@react-navigation/native';
import { InscriptionStackParamList } from '@/navigation/Navigation';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
  route: RouteProp<InscriptionStackParamList, 'OptionsTournoi'>;
}

interface State {
  speciauxIncompatibles: boolean;
  memesEquipes: boolean;
  memesAdversaires: number;
  complement: Complement;
  nbTours: number;
  nbPtVictoire: number;
  avecTerrains: boolean;
}

class OptionsTournoi extends React.Component<Props, State> {
  nbToursTxt: string = "5";
  nbPtVictoireTxt: string = "13";

  constructor(props: Props) {
    super(props)
    this.state = {
      speciauxIncompatibles: true,
      memesEquipes: true,
      memesAdversaires: 50,
      complement: Complement.TRIPLETTE,
      nbTours: 5,
      nbPtVictoire: 13,
      avecTerrains: false
    }
  }

  _nbToursTxtInputChanged(text: string) {
    this.nbToursTxt = text;
    this.setState({
      nbTours: this.nbToursTxt ? parseInt(this.nbToursTxt) : undefined
    });
  }

  _nbPtVictoireTxtInputChanged(text: string) {
    this.nbPtVictoireTxt = text;
    this.setState({
      nbPtVictoire: this.nbPtVictoireTxt ? parseInt(this.nbPtVictoireTxt) : undefined
    });
  }

  _nextStep() {
    const updateOptionNbTours = { type: "UPDATE_OPTION_TOURNOI", value: ['nbTours', this.state.nbTours]}
    this.props.dispatch(updateOptionNbTours);
    const updateOptionNbPtVictoire = { type: "UPDATE_OPTION_TOURNOI", value: ['nbPtVictoire', this.state.nbPtVictoire]}
    this.props.dispatch(updateOptionNbPtVictoire);
    const updateOptionSpeciauxIncompatibles = { type: "UPDATE_OPTION_TOURNOI", value: ['speciauxIncompatibles', this.state.speciauxIncompatibles]}
    this.props.dispatch(updateOptionSpeciauxIncompatibles);
    const updateOptionMemesEquipes = { type: "UPDATE_OPTION_TOURNOI", value: ['memesEquipes', this.state.memesEquipes]}
    this.props.dispatch(updateOptionMemesEquipes);
    const updateOptionMemesAdversaires = { type: "UPDATE_OPTION_TOURNOI", value: ['memesAdversaires', this.state.memesAdversaires]}
    this.props.dispatch(updateOptionMemesAdversaires);
    const updateOptionComplement = { type: "UPDATE_OPTION_TOURNOI", value: ['complement', this.state.complement]}
    this.props.dispatch(updateOptionComplement);
    const updateOptionAvecTerrains = { type: "UPDATE_OPTION_TOURNOI", value: ['avecTerrains', this.state.avecTerrains]}
    this.props.dispatch(updateOptionAvecTerrains);

    this.props.navigation.navigate(this.props.route.params.screenStackName);
  }

  _boutonValider() {
    const { t } = this.props;
    let btnDisabled = true;
    let btnTitle = t("champ_invalide");
    if (this.state.nbTours > 0 && this.state.nbTours % 1 == 0 && this.state.nbPtVictoire > 0 && this.state.nbPtVictoire % 1 == 0) {
      btnTitle = t("valider_et_inscriptions");
      btnDisabled = false;
    }
    return (
      <Button
        action='primary'
        isDisabled={btnDisabled}
        onPress={() => this._nextStep()}
        size='md'
      >
        <ButtonText>{btnTitle}</ButtonText>
      </Button>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : "height"}
        style={{ flex: 1, zIndex: 999 }}
      >
        <SafeAreaView style={{flex: 1}}>
          <ScrollView height={'$1'} bgColor='#0594ae'>
            <VStack flex={1}>
              <TopBarBack title={t("options_tournoi_title")} navigation={this.props.navigation}/>
              <VStack px={'$10'} space='4xl'>
                <VStack space='md'>
                  <VStack>
                    <Text color='$white' fontSize={'$md'}>{t("indiquer_nombre_tours")} </Text>
                    <Input size='md'>
                      <InputField
                        placeholder={t("nombre_placeholder")}
                        keyboardType="numeric"
                        defaultValue={this.nbToursTxt}
                        onChangeText={(text) => this._nbToursTxtInputChanged(text)}
                      />
                    </Input>
                  </VStack>
                  <VStack>
                    <Text color='$white' fontSize={'$md'}>{t("indiquer_nombre_points_victoire")} </Text>
                    <Input size='md'>
                      <InputField
                        placeholder={t("nombre_placeholder")}
                        keyboardType="numeric"
                        defaultValue={this.nbPtVictoireTxt}
                        onChangeText={(text) => this._nbPtVictoireTxtInputChanged(text)}
                      />
                    </Input>
                  </VStack>
                </VStack>
                <VStack space='md'>
                  <Checkbox
                    value="speciauxIncompatibles"
                    onChange={() => this.setState({speciauxIncompatibles: !this.state.speciauxIncompatibles})}
                    aria-label={t("choix_regle_speciaux")}
                    defaultIsChecked
                    size='md'
                  >
                    <CheckboxIndicator mr={'$2'}>
                      <CheckIcon color={this.state.speciauxIncompatibles ? '$white' : '$cyan600'}/>
                    </CheckboxIndicator>
                    <CheckboxLabel>{t("options_regle_speciaux")}</CheckboxLabel>
                  </Checkbox>
                  <Checkbox
                    value="memesEquipes"
                    onChange={() => this.setState({memesEquipes: !this.state.memesEquipes})}
                    aria-label={t("choix_regle_equipes")}
                    defaultIsChecked
                    size='md'
                  >
                    <CheckboxIndicator mr={'$2'}>
                      <CheckIcon color={this.state.memesEquipes ? '$white' : '$cyan600'}/>
                    </CheckboxIndicator>
                    <CheckboxLabel>{t("options_regle_equipes")}</CheckboxLabel>
                  </Checkbox>
                </VStack>
                <VStack>
                  <Text color='$white' fontSize={'$md'}>{t("options_regle_adversaires")}</Text>
                  <HStack justifyContent="space-between">
                    <Text color='$white'>{t("1_seul_match")}</Text>
                    <Text color='$white'>{t("pourcent_matchs", {pourcent: "100"})}</Text>
                  </HStack>
                  <Slider
                    minValue={0}
                    maxValue={100}
                    defaultValue={50}
                    step={50}
                    aria-label={t("choix_regle_adversaires")}
                    onChangeEnd={v => {this.setState({memesAdversaires: v})}}
                  >
                    <SliderTrack>
                      <SliderFilledTrack bg='#1c3969'/>
                    </SliderTrack>
                    <SliderThumb bg='#1c3969'/>
                  </Slider>
                  <HStack justifyContent='center'>
                    <Text color='$white'>{t("pourcent_matchs", {pourcent: "50"})}</Text>
                  </HStack>
                </VStack>
                <VStack>
                  <Text color='$white' fontSize={'$md'}>{t("options_regle_complement")}</Text>
                  <Select
                    selectedValue={this.state.complement}
                    defaultValue={Complement.TRIPLETTE}
                    initialLabel={t("triplettes")}
                    aria-label={t("choix_complement")}
                    placeholder={t("choix_complement")}
                    onValueChange={(itemValue: Complement) => this.setState({complement: itemValue})}
                  >
                    <SelectTrigger variant='outline' size='md'>
                      <SelectInput/>
                      <SelectIcon mr={'$3'}>
                        <ChevronDownIcon color='$white'/>
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop/>
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator/>
                        </SelectDragIndicatorWrapper>
                        <SelectItem label={t("triplettes")} value={Complement.TRIPLETTE} />
                        <SelectItem label={t("tete_a_tete")} value={Complement.TETEATETE}/>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </VStack>
                <VStack>
                  <Checkbox
                    value="avecTerrains"
                    onChange={() => this.setState({avecTerrains: !this.state.avecTerrains})}
                    aria-label={t("choix_option_terrains")}
                    size='md'
                  >
                    <CheckboxIndicator mr={'$2'}>
                      <CheckIcon color={this.state.avecTerrains ? '$white' : '$cyan600'}/>
                    </CheckboxIndicator>
                    <CheckboxLabel>{t("options_terrains_explications")}</CheckboxLabel>
                  </Checkbox>
                </VStack>
                <VStack>
                  {this._boutonValider()}
                </VStack>
              </VStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
        </KeyboardAvoidingView>
    )
  }
}

export default connector(withTranslation()(OptionsTournoi))