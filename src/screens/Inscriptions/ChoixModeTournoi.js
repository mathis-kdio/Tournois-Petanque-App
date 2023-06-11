import React from 'react'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { VStack, Button, Text, Radio, Icon } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import TopBarBack from 'components/TopBarBack';

class ChoixModeTournoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      typeEquipes: "doublette",
      modeTournoi: "avecNoms"
    }
  }

  _inscription() {
    let screenName;
    let modeTournoi;
    if (this.props.optionsTournoi.type == "mele-demele") {
      if (this.state.modeTournoi = "avecNoms") {
        screenName = 'InscriptionsAvecNoms';
        modeTournoi = this.state.modeTournoi;
      }
      else if (this.state.modeTournoi = "sansNoms") {
        screenName = 'InscriptionsSansNoms';
        modeTournoi = this.state.modeTournoi;
      }
      else {
        screenName = 'InscriptionsAvecNoms';
        modeTournoi = 'avecEquipes';
      }
    }
    else if (this.props.optionsTournoi.type == "championnat") {
      screenName = 'InscriptionsAvecNoms';
      modeTournoi = 'avecEquipes';
    }
    else if (this.props.optionsTournoi.type == "coupe") {
      screenName = 'InscriptionsAvecNoms';
      modeTournoi = 'avecEquipes';
    }
    
    const updateOptionEquipesTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeEquipes', this.state.typeEquipes]};
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', modeTournoi]};
    this.props.dispatch(updateOptionModeTournoi);

    if (this.props.optionsTournoi.type != 'championnat' && this.props.optionsTournoi.type != 'coupe') {
      this.props.navigation.navigate({
        name: 'OptionsTournoi',
        params: {
          screenStackName: screenName
        }
      });
    }
    else {
      this.props.navigation.navigate(screenName);
    }
  }

  _validButton() {
    let boutonDesactive = false;
    let title = "Valider et passer aux options";
    if (this.props.optionsTournoi.type === "championnat" || this.props.optionsTournoi.type === "coupe") {
      title = "Valider et passer aux inscriptions";
    }
    if(this.state.modeTournoi == "avecEquipes" && this.state.typeEquipes == "teteatete") {
      boutonDesactive = true;
      title = "Mode de tournois incompatible";
    }
    return (
      <Button
        bg="#1c3969"
        disabled={boutonDesactive}
        onPress={() => this._inscription()}
        endIcon={<Icon as={FontAwesome5} name="arrow-right"/>}
        size="lg"
      >
        {title}
      </Button>
    )
  }

  _typeEquipes() {
    return (
      <Radio.Group
        name="typeEquipesRadioGroup"
        accessibilityLabel="Choix du type des équipes"
        value={this.state.typeEquipes}
        onChange={nextValue => {this.setState({typeEquipes: nextValue})}}
        space={3}
      >
        <Radio value="teteatete" size="md" _text={{color:"white"}}>Tête-à-tête</Radio>
        <Radio value="doublette" size="md" _text={{color:"white"}}>Doublettes</Radio>
        <Radio value="triplette" size="md" _text={{color:"white"}}>Triplettes</Radio>
      </Radio.Group>
    )
  }

  _modeTournoi() {
    if (!this.props.optionsTournoi.type == "mele-demele") return;
    return (
      <Radio.Group
        name="modeTournoiRadioGroup"
        accessibilityLabel="Choix du mode du tournoi"
        value={this.state.modeTournoi}
        onChange={nextValue => {this.setState({modeTournoi: nextValue})}}
        space={3}
      >
        <Radio value="avecNoms" size="md" _text={{color:"white"}}>Mêlée-démêlée avec nom</Radio>
        <Radio value="sansNoms" size="md" _text={{color:"white"}}>Mêlée-dêmêlée sans nom</Radio>
        <Radio value="avecEquipes" size="md" _text={{color:"white"}}>Mêlée avec équipes constituées</Radio>
      </Radio.Group>
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
          <TopBarBack title="Mode du tournoi" navigation={this.props.navigation}/>
          <VStack flex="1" px="10" space="10">
            <VStack>
              <Text color="white" fontSize="2xl" textAlign="center">Type des équipes</Text>
              {this._typeEquipes()}
            </VStack>
            <VStack>
              <Text color="white" fontSize="2xl" textAlign="center">Mode du tournoi</Text>
              {this._modeTournoi()}
            </VStack>
            {this._validButton()}
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

export default connect(mapStateToProps)(ChoixModeTournoi)