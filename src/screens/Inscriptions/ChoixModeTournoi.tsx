import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, Button, Text, Radio, RadioLabel, ButtonText, RadioGroup, RadioIndicator, CircleIcon, Box } from '@gluestack-ui/themed';
import TopBarBack from '@components/TopBarBack';
import { withTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '../../components/adMob/AdMobInscriptionsBanner';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  typeEquipes: string;
  modeTournoi: string;
}

class ChoixModeTournoi extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      typeEquipes: TypeEquipes.DOUBLETTE,
      modeTournoi: ModeTournoi.AVECNOMS
    }
  }

  _nextStep() {
    let modeTournoi = this.state.modeTournoi;
    if (this.props.optionsTournoi.type != TypeTournoi.MELEDEMELE) {
      modeTournoi = ModeTournoi.AVECEQUIPES;
    }
    const updateOptionEquipesTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeEquipes', this.state.typeEquipes]};
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', modeTournoi]};
    this.props.dispatch(updateOptionModeTournoi);

    if (this.props.optionsTournoi.type != TypeTournoi.CHAMPIONNAT && this.props.optionsTournoi.type != TypeTournoi.COUPE && this.props.optionsTournoi.type != TypeTournoi.MULTICHANCES) {
      let screenName = this.state.modeTournoi == ModeTournoi.SANSNOMS ? "InscriptionsSansNoms" : "InscriptionsAvecNoms";
      this.props.navigation.navigate({
        name: 'OptionsTournoi',
        params: {
          screenStackName: screenName
        }
      });
    }
    else {
      this.props.navigation.navigate("InscriptionsAvecNoms");
    }
  }

  _validButton() {
    const { t } = this.props;
    let buttonDisabled = false;
    let title = t("valider_et_options");
    if (this.props.optionsTournoi.type === TypeTournoi.CHAMPIONNAT || this.props.optionsTournoi.type === TypeTournoi.COUPE || this.props.optionsTournoi.type === TypeTournoi.MULTICHANCES) {
      title = t("valider_et_inscriptions");
    }
    if (this.state.modeTournoi == ModeTournoi.AVECEQUIPES && this.state.typeEquipes == TypeEquipes.TETEATETE) {
      buttonDisabled = true;
      title = t("erreur_tournoi_tete_a_tete_et_equipes");
    }
    return (
      <Button
        action='primary'
        isDisabled={buttonDisabled}
        onPress={() => this._nextStep()}
        size='md'
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    )
  }

  _modeTournoi() {
    const { t } = this.props;
    if (this.props.optionsTournoi.type !== TypeTournoi.MELEDEMELE) return;
    return (
      <VStack>
        <Text color='$white' fontSize={'$2xl'} textAlign='center'>{t("mode_tournoi")}</Text>
        <RadioGroup
          name="modeTournoiRadioGroup"
          aria-label={t("choix_mode_tournoi")}
          value={this.state.modeTournoi}
          onChange={nextValue => {this.setState({modeTournoi: nextValue})}}
        >
          <VStack space='lg'>
            <Radio value={ModeTournoi.AVECNOMS} size='lg'>
              <RadioIndicator mr={'$2'}>
                <CircleIcon stroke={this.state.modeTournoi == ModeTournoi.AVECNOMS ? '$white' : '$secondary700'}/>
              </RadioIndicator>
              <RadioLabel>{t("melee_demelee_avec_nom")}</RadioLabel>
            </Radio>
            <Radio value={ModeTournoi.SANSNOMS} size='lg'>
              <RadioIndicator mr={'$2'}>
                <CircleIcon stroke={this.state.modeTournoi == ModeTournoi.SANSNOMS ? '$white' : '$secondary700'}/>
              </RadioIndicator>
              <RadioLabel>{t("melee_demelee_sans_nom")}</RadioLabel>
            </Radio>
            <Radio value={ModeTournoi.AVECEQUIPES} size='lg'>
              <RadioIndicator mr={'$2'}>
                <CircleIcon stroke={this.state.modeTournoi == ModeTournoi.AVECEQUIPES ? '$white' : '$secondary700'}/>
              </RadioIndicator>
              <RadioLabel>{t("melee_avec_equipes_constituees")}</RadioLabel>
            </Radio>
          </VStack>
        </RadioGroup>
      </VStack>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor={"#0594ae"}>
          <TopBarBack title={t("mode_tournoi")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} justifyContent='space-between'>
            <VStack space='4xl'>
              <Text color='$white' fontSize={'$2xl'} textAlign='center'>{t("type_equipes")}</Text>
              <RadioGroup
                name="typeEquipesRadioGroup"
                aria-label={t("choix_type_equipes")}
                value={this.state.typeEquipes}
                onChange={nextValue => {this.setState({typeEquipes: nextValue})}}
              >
                <VStack space='lg'>
                  <Radio value={TypeEquipes.TETEATETE} size='lg'>
                    <RadioIndicator mr={'$2'}>
                      <CircleIcon stroke={this.state.typeEquipes == TypeEquipes.TETEATETE ? '$white' : '$secondary700'}/>
                    </RadioIndicator>
                    <RadioLabel>{t("tete_a_tete")}</RadioLabel>
                  </Radio>
                  <Radio value={TypeEquipes.DOUBLETTE} size='lg'>
                    <RadioIndicator mr={'$2'}>
                      <CircleIcon stroke={this.state.typeEquipes == TypeEquipes.DOUBLETTE ? '$white' : '$secondary700'}/>
                    </RadioIndicator>
                    <RadioLabel>{t("doublettes")}</RadioLabel>
                  </Radio>
                  <Radio value={TypeEquipes.TRIPLETTE} size='lg'>
                    <RadioIndicator mr={'$2'}>
                      <CircleIcon stroke={this.state.typeEquipes == TypeEquipes.TRIPLETTE ? '$white' : '$secondary700'}/>
                    </RadioIndicator>
                    <RadioLabel>{t("triplettes")}</RadioLabel>
                  </Radio>
                </VStack>
              </RadioGroup>
              {this._modeTournoi()}
              {this._validButton()}
            </VStack>
            <Box my={'$10'}>
              <AdMobInscriptionsBanner/>
            </Box>
          </VStack>
        </VStack>
      </SafeAreaView>
    )
  }
}

export default connector(withTranslation()(ChoixModeTournoi))