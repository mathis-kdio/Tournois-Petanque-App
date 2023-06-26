import React from 'react'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Checkbox, VStack, Button, Text, Input, Select, CheckIcon, Icon, Slider, HStack, ScrollView } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from 'components/TopBarBack';

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
    let btnDisabled = true;
    let btnTitle = "Un des champs n'est pas valide";
    if (this.state.nbTours > 0 && this.state.nbTours % 1 == 0 && this.state.nbPtVictoire > 0 && this.state.nbPtVictoire % 1 == 0) {
      btnTitle = 'Valider et passer aux inscriptions';
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
    return (
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView bgColor="#0594ae">
            <StatusBar backgroundColor="#0594ae"/>
            <VStack flex="1">
              <TopBarBack title="Options du tournoi" navigation={this.props.navigation}/>
              <VStack px="10" space="md">
                <VStack space="3">
                  <VStack>
                    <Text color="white" fontSize="md">Indiquer un nombre de tours : </Text>
                    <Input
                      placeholderTextColor='white'
                      placeholder="Veuillez indiquer un nombre"
                      keyboardType="numeric"
                      defaultValue={this.nbToursTxt}
                      onChangeText={(text) => this._nbToursTxtInputChanged(text)}
                      size="lg"
                    />
                  </VStack>
                  <VStack>
                    <Text color="white" fontSize="md">Indiquer le nombre de points pour gagner : </Text>
                    <Input
                      placeholderTextColor='white'
                      placeholder="Veuillez indiquer un nombre"
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
                    accessibilityLabel="Choix enfants dans équipes différentes"
                    defaultIsChecked
                    size="md"
                  >
                    Ne jamais faire jouer 2 enfants dans la même équipe
                  </Checkbox>
                  <Checkbox
                    onChange={() => this.setState({memesEquipes: !this.state.memesEquipes})}
                    accessibilityLabel="Choix ne jamais former les mêmes équipes"
                    defaultIsChecked
                    size="md"
                  >
                    Ne jamais former les mêmes équipes
                  </Checkbox>
                </VStack>
                <VStack>
                  <Text color="white" fontSize="md">Les joueurs peuvent avoir le même adversaire au maximum :</Text>
                  <HStack justifyContent="space-between">
                    <Text color="white">1 seul match</Text>
                    <Text color="white">100% des matchs</Text>
                  </HStack>
                  <Slider
                    minValue={0}
                    maxValue={100}
                    defaultValue={50}
                    step={50}
                    accessibilityLabel="Choix mêmes coéquipiers et mêmes adversaires"
                    onChangeEnd={v => {this.setState({memesAdversaires: v})}}
                  >
                    <Slider.Track >
                      <Slider.FilledTrack bg="#1c3969"/>
                    </Slider.Track>
                    <Slider.Thumb bg="#1c3969"/>
                  </Slider>
                  <HStack justifyContent="center">
                    <Text color="white">50% des matchs</Text>
                  </HStack>
                </VStack>
                <VStack>
                  <Text color="white" fontSize="md">En doublette, si le nombre de joueur n'est pas multiple de 4 alors les joueurs en trop seront mis en :</Text>
                  <Select
                    selectedValue={this.state.complement}
                    accessibilityLabel="Choix complément"
                    placeholder="Choix complément"
                    onValueChange={itemValue => this.setState({complement: itemValue})}
                    _selectedItem={{
                      endIcon: <CheckIcon size="5" color="cyan.500"/>
                    }}
                    size="lg"
                  >
                    <Select.Item label="Triplette" value="3"/>
                    <Select.Item label="Tête-à-Tête" value="1"/>
                  </Select>
                </VStack>
                <VStack>
                  <Checkbox
                    onChange={() => this.setState({avecTerrains: !this.state.avecTerrains})}
                    accessibilityLabel="Choix avec ou sans terrains"
                    size="md"
                  >
                    Avant de lancer le tournoi, créer une liste de terrains qui seront attribués aux matchs
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

export default connect()(OptionsTournoi)