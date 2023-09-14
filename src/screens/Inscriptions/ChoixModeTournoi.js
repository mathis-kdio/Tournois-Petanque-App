import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { VStack, Button, Text, Radio, Icon, Spacer } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from '@components/TopBarBack';
import AdMobBanner from '@components/adMob/AdMobBanner';
import { withTranslation } from 'react-i18next';

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
        bg="#1c3969"
        isDisabled={buttonDisabled}
        onPress={() => this._nextStep()}
        endIcon={<Icon as={FontAwesome5} name="arrow-right"/>}
        size="lg"
      >
        {title}
      </Button>
    )
  }

  _modeTournoi() {
    const { t } = this.props;
    if (this.props.optionsTournoi.type !== "mele-demele") return;
    return (
      <VStack>
        <Text color="white" fontSize="2xl" textAlign="center">{t("mode_tournoi")}</Text>
        <Radio.Group
          name="modeTournoiRadioGroup"
          accessibilityLabel={t("choix_mode_tournoi")}
          value={this.state.modeTournoi}
          onChange={nextValue => {this.setState({modeTournoi: nextValue})}}
          space={3}
        >
          <Radio value="avecNoms" size="md" _text={{color:"white"}}>{t("melee_demelee_avec_nom")}</Radio>
          <Radio value="sansNoms" size="md" _text={{color:"white"}}>{t("melee_demelee_sans_nom")}</Radio>
          <Radio value="avecEquipes" size="md" _text={{color:"white"}}>{t("melee_avec_equipes_constituees")}</Radio>
        </Radio.Group>
      </VStack>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
          <TopBarBack title={t("mode_tournoi")} navigation={this.props.navigation}/>
          <VStack flex="1" px="10" space="10">
            <VStack>
              <Text color="white" fontSize="2xl" textAlign="center">{t("type_equipes")}</Text>
              <Radio.Group
                name="typeEquipesRadioGroup"
                accessibilityLabel={t("choix_type_equipes")}
                value={this.state.typeEquipes}
                onChange={nextValue => {this.setState({typeEquipes: nextValue})}}
                space={3}
              >
                <Radio value="teteatete" size="md" _text={{color:"white"}}>{t("tete_a_tete")}</Radio>
                <Radio value="doublette" size="md" _text={{color:"white"}}>{t("doublettes")}</Radio>
                <Radio value="triplette" size="md" _text={{color:"white"}}>{t("triplettes")}</Radio>
              </Radio.Group>
            </VStack>
            {this._modeTournoi()}
            {this._validButton()}
            <Spacer/>
            <AdMobBanner type="ANCHORED_ADAPTIVE_BANNER"/>
            <Spacer/>
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