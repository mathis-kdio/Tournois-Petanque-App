import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { CircleIcon } from "@/components/ui/icon";
import { Radio, RadioLabel, RadioIcon, RadioGroup, RadioIndicator } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    if (this.props.optionsTournoi.typeTournoi != TypeTournoi.MELEDEMELE) {
      modeTournoi = ModeTournoi.AVECEQUIPES;
    }
    const updateOptionEquipesTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeEquipes', this.state.typeEquipes]};
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', modeTournoi]};
    this.props.dispatch(updateOptionModeTournoi);

    if (this.props.optionsTournoi.typeTournoi != TypeTournoi.CHAMPIONNAT && this.props.optionsTournoi.typeTournoi != TypeTournoi.COUPE && this.props.optionsTournoi.typeTournoi != TypeTournoi.MULTICHANCES) {
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
    if (this.props.optionsTournoi.typeTournoi === TypeTournoi.CHAMPIONNAT || this.props.optionsTournoi.typeTournoi === TypeTournoi.COUPE || this.props.optionsTournoi.typeTournoi === TypeTournoi.MULTICHANCES) {
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
    );
  }

  _modeTournoi() {
    const { t } = this.props;
    if (this.props.optionsTournoi.typeTournoi !== TypeTournoi.MELEDEMELE) return;
    return (
      <VStack>
        <Text className="text-white text-2xl text-center">{t("mode_tournoi")}</Text>
        <RadioGroup
          aria-label={t("choix_mode_tournoi")}
          value={this.state.modeTournoi}
          onChange={nextValue => {this.setState({modeTournoi: nextValue})}}
        >
          <VStack space='lg'>
            <Radio value={ModeTournoi.AVECNOMS} size='lg'>
              <RadioIndicator className="mr-2 border-white">
                <RadioIcon as={CircleIcon} className="fill-white text-background-white"/>
              </RadioIndicator>
              <RadioLabel className="text-white">{t("melee_demelee_avec_nom")}</RadioLabel>
            </Radio>
            <Radio value={ModeTournoi.SANSNOMS} size='lg'>
              <RadioIndicator className="mr-2 border-white">
                <RadioIcon as={CircleIcon} className="fill-white text-background-white"/>
              </RadioIndicator>
              <RadioLabel className="text-white">{t("melee_demelee_sans_nom")}</RadioLabel>
            </Radio>
            <Radio value={ModeTournoi.AVECEQUIPES} size='lg'>
              <RadioIndicator className="mr-2 border-white">
                <RadioIcon as={CircleIcon} className="fill-white text-background-white"/>
              </RadioIndicator>
              <RadioLabel className="text-white">{t("melee_avec_equipes_constituees")}</RadioLabel>
            </Radio>
          </VStack>
        </RadioGroup>
      </VStack>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack title={t("mode_tournoi")} navigation={this.props.navigation}/>
          <VStack className="flex-1 px-10 justify-between">
            <VStack space='4xl'>
              <Text className="text-white text-2xl text-center">{t("type_equipes")}</Text>
              <RadioGroup
                aria-label={t("choix_type_equipes")}
                value={this.state.typeEquipes}
                onChange={nextValue => {this.setState({typeEquipes: nextValue})}}
              >
                <VStack space='lg'>
                  <Radio value={TypeEquipes.TETEATETE} size='lg'>
                    <RadioIndicator className="mr-2 border-white">
                      <RadioIcon as={CircleIcon} className="fill-white text-background-white"/>
                    </RadioIndicator>
                    <RadioLabel className="text-white">{t("tete_a_tete")}</RadioLabel>
                  </Radio>
                  <Radio value={TypeEquipes.DOUBLETTE} size='lg'>
                    <RadioIndicator className="mr-2 border-white">
                      <RadioIcon as={CircleIcon} className="fill-white text-background-white"/>
                    </RadioIndicator>
                    <RadioLabel className="text-white">{t("doublettes")}</RadioLabel>
                  </Radio>
                  <Radio value={TypeEquipes.TRIPLETTE} size='lg'>
                    <RadioIndicator className="mr-2 border-white">
                      <RadioIcon as={CircleIcon} className="fill-white text-background-white"/>
                    </RadioIndicator>
                    <RadioLabel className="text-white">{t("triplettes")}</RadioLabel>
                  </Radio>
                </VStack>
              </RadioGroup>
              {this._modeTournoi()}
              {this._validButton()}
            </VStack>
            <Box className="my-10">
              <AdMobInscriptionsBanner/>
            </Box>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(ChoixModeTournoi))