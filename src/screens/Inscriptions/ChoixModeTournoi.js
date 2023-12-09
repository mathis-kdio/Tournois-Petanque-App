import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { VStack, Button, Text, Radio, RadioLabel, ButtonText, RadioGroup, RadioIndicator, CircleIcon, Box } from '@gluestack-ui/themed';
import TopBarBack from '@components/TopBarBack';
import { withTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '../../components/adMob/AdMobInscriptionsBanner';

class ChoixModeTournoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      typeEquipes: "doublette",
      modeTournoi: "avecNoms"
    }
  }

  _nextStep() {
    let modeTournoi = this.state.modeTournoi;
    if (this.props.optionsTournoi.type != 'mele-demele') {
      modeTournoi = "avecEquipes";
    }
    const updateOptionEquipesTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeEquipes', this.state.typeEquipes]};
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', modeTournoi]};
    this.props.dispatch(updateOptionModeTournoi);

    if (this.props.optionsTournoi.type != 'championnat' && this.props.optionsTournoi.type != 'coupe') {
      let screenName = this.state.modeTournoi == "sansNoms" ? "InscriptionsSansNoms" : "InscriptionsAvecNoms";
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
    if (this.props.optionsTournoi.type === "championnat" || this.props.optionsTournoi.type === "coupe") {
      title = t("valider_et_inscriptions");
    }
    if (this.state.modeTournoi == "avecEquipes" && this.state.typeEquipes == "teteatete") {
      buttonDisabled = true;
      title = t("erreur_tournoi_tete_a_tete_et_equipes");
    }
    return (
      <Button
        bg='#1c3969'
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
    if (this.props.optionsTournoi.type !== "mele-demele") return;
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
            <Radio value="avecNoms" size='lg'>
              <RadioIndicator mr={'$2'}>
                <CircleIcon stroke={this.state.modeTournoi == "avecNoms" ? '$white' : '$secondary700'}/>
              </RadioIndicator>
              <RadioLabel>{t("melee_demelee_avec_nom")}</RadioLabel>
            </Radio>
            <Radio value="sansNoms" size='lg'>
              <RadioIndicator mr={'$2'}>
                <CircleIcon stroke={this.state.modeTournoi == "sansNoms" ? '$white' : '$secondary700'}/>
              </RadioIndicator>
              <RadioLabel>{t("melee_demelee_sans_nom")}</RadioLabel>
            </Radio>
            <Radio value="avecEquipes" size='lg'>
              <RadioIndicator mr={'$2'}>
                <CircleIcon stroke={this.state.modeTournoi == "avecEquipes" ? '$white' : '$secondary700'}/>
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
        <StatusBar backgroundColor="#0594ae"/>
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
                  <Radio value="teteatete" size='lg'>
                    <RadioIndicator mr={'$2'}>
                      <CircleIcon stroke={this.state.typeEquipes == "teteatete" ? '$white' : '$secondary700'}/>
                    </RadioIndicator>
                    <RadioLabel>{t("tete_a_tete")}</RadioLabel>
                  </Radio>
                  <Radio value="doublette" size='lg'>
                    <RadioIndicator mr={'$2'}>
                      <CircleIcon stroke={this.state.typeEquipes == "doublette" ? '$white' : '$secondary700'}/>
                    </RadioIndicator>
                    <RadioLabel>{t("doublettes")}</RadioLabel>
                  </Radio>
                  <Radio value="triplette" size='lg'>
                    <RadioIndicator mr={'$2'}>
                      <CircleIcon stroke={this.state.typeEquipes == "triplette" ? '$white' : '$secondary700'}/>
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

const mapStateToProps = (state) => {
  return {
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(ChoixModeTournoi))