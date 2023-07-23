import React from 'react'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Checkbox, VStack, Button, Text, Input, Select, CheckIcon, Icon, Slider, HStack, ScrollView } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from 'components/TopBarBack';
import { withTranslation } from 'react-i18next';

class OptionsTournoi extends React.Component {

  constructor(props) {
    super(props)
    this.nbToursTxt = "5";
    this.nbPtVictoireTxt = "13";
    this.state = {
      speciauxIncompatibles: true,
      memesEquipes: true,
      memesAdversaires: 50,
      complement: "3",
      nbTours: 5,
      nbPtVictoire: 13,
      avecTerrains: false
    }
  }

  _nbToursTxtInputChanged(text) {
    this.nbToursTxt = text;
    this.setState({
      nbTours: this.nbToursTxt ? parseInt(this.nbToursTxt) : undefined
    });
  }

  _nbPtVictoireTxtInputChanged(text) {
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
        bg="#1c3969"
        isDisabled={btnDisabled}
        onPress={() => this._nextStep()}
        endIcon={<Icon as={FontAwesome5} name="arrow-right"/>}
        size="lg"
      >
        {btnTitle}
      </Button>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView bgColor="#0594ae">
            <StatusBar backgroundColor="#0594ae"/>
            <VStack flex="1">
              <TopBarBack title={t("options_tournoi_title")} navigation={this.props.navigation}/>
              <VStack px="10" space="md">
                <VStack space="3">
                  <VStack>
                    <Text color="white" fontSize="md">{t("indiquer_nombre_tours")}</Text>
                    <Input
                      placeholderTextColor='white'
                      placeholder={t("indiquer_nombre")}
                      keyboardType="numeric"
                      defaultValue={this.nbToursTxt}
                      onChangeText={(text) => this._nbToursTxtInputChanged(text)}
                      size="lg"
                    />
                  </VStack>
                  <VStack>
                    <Text color="white" fontSize="md">{t("indiquer_nombre_points_victoire")}</Text>
                    <Input
                      placeholderTextColor='white'
                      placeholder={t("indiquer_nombre")}
                      keyboardType="numeric"
                      defaultValue={this.nbPtVictoireTxt}
                      onChangeText={(text) => this._nbPtVictoireTxtInputChanged(text)}
                      size="lg"
                    />
                  </VStack>
                </VStack>
                <VStack space="5">
                  <Checkbox
                    onChange={() => this.setState({speciauxIncompatibles: !this.state.speciauxIncompatibles})}
                    accessibilityLabel={t("choix_regle_enfants")}
                    defaultIsChecked
                    size="md"
                  >
                    {t("options_regle_enfants")}
                  </Checkbox>
                  <Checkbox
                    onChange={() => this.setState({memesEquipes: !this.state.memesEquipes})}
                    accessibilityLabel={t("choix_regle_equipes")}
                    defaultIsChecked
                    size="md"
                  >
                    {t("options_regle_equipes")}
                  </Checkbox>
                </VStack>
                <VStack>
                  <Text color="white" fontSize="md">{t("options_regle_adversaires")}</Text>
                  <HStack justifyContent="space-between">
                    <Text color="white">{t("1_seul_match")}</Text>
                    <Text color="white">{t("pourcent_matchs", {pourcent: "100"})}</Text>
                  </HStack>
                  <Slider
                    minValue={0}
                    maxValue={100}
                    defaultValue={50}
                    step={50}
                    accessibilityLabel={t("choix_regle_adversaires")}
                    onChangeEnd={v => {this.setState({memesAdversaires: v})}}
                  >
                    <Slider.Track >
                      <Slider.FilledTrack bg="#1c3969"/>
                    </Slider.Track>
                    <Slider.Thumb bg="#1c3969"/>
                  </Slider>
                  <HStack justifyContent="center">
                    <Text color="white">{t("pourcent_matchs", {pourcent: "50"})}</Text>
                  </HStack>
                </VStack>
                <VStack>
                  <Text color="white" fontSize="md">{t("options_regle_complement")}</Text>
                  <Select
                    selectedValue={this.state.complement}
                    accessibilityLabel={t("choix_complement")}
                    placeholder={t("choix_complement")}
                    onValueChange={itemValue => this.setState({complement: itemValue})}
                    _selectedItem={{
                      endIcon: <CheckIcon size="5" color="cyan.500"/>
                    }}
                    size="lg"
                  >
                    <Select.Item label={t("triplette")} value="3"/>
                    <Select.Item label={t("tete_a_tete")} value="1"/>
                  </Select>
                </VStack>
                <VStack>
                  <Checkbox
                    onChange={() => this.setState({avecTerrains: !this.state.avecTerrains})}
                    accessibilityLabel={t("choix_option_terrains")}
                    size="md"
                  >
                    {t("options_terrains_explications")}
                  </Checkbox>
                </VStack>
                <VStack>
                  {this._boutonValider()}
                </VStack>
              </VStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    )
  }
}

export default connect()(withTranslation()(OptionsTournoi))