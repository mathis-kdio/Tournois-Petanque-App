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
      option1: "doublette",
      option2: "avecNoms"
    }
  }

  _inscription() {
    let typeEquipes
    if (this.state.option1 = "teteatete") {
      typeEquipes = 'teteatete'
    }
    else if (this.state.option1 = "doublette") {
      typeEquipes = 'doublette'
    }
    else {
      typeEquipes = 'triplette'
    }

    let screenName
    let modeTournoi
    if (this.props.optionsTournoi.type == "mele-demele") {
      if (this.state.option2 = "avecNoms") {
        screenName = 'InscriptionsAvecNoms'
        modeTournoi = 'avecNoms'
      }
      else if (this.state.option2 = "sansNoms") {
        screenName = 'InscriptionsSansNoms'
        modeTournoi = 'sansNoms'
      }
      else {
        screenName = 'InscriptionsAvecNoms'
        modeTournoi = 'avecEquipes'
      }
    }
    else if (this.props.optionsTournoi.type == "championnat") {
      screenName = 'InscriptionsAvecNoms'
      modeTournoi = 'avecEquipes'
    }
    else if (this.props.optionsTournoi.type == "coupe") {
      screenName = 'InscriptionsAvecNoms'
      modeTournoi = 'avecEquipes'
    }
    
    const updateOptionEquipesTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeEquipes', typeEquipes]}
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', modeTournoi]}
    this.props.dispatch(updateOptionModeTournoi);

    if (this.props.optionsTournoi.type != 'championnat' && this.props.optionsTournoi.type != 'coupe') {
      this.props.navigation.navigate({
        name: 'OptionsTournoi',
        params: {
          screenStackName: screenName
        }
      })
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
    if(this.state.option2 == "avecEquipes" && this.state.option1 == "teteatete") {
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

  _titre() {
    const titles = {
      "mele-demele": {
        title: "Choix du types d'équipe et du mode du tournoi mêlée-démêlée :"
      },
      "championnat": {
        title: "Choix du mode du championnat :"
      },
      "coupe": {
        title: "Choix du mode de la coupe :"
      }
    };
    let title = titles[this.props.optionsTournoi.type];
    if (!title) return;
    return <Text color="white">{title.title}</Text>
  }

  _typeEquipes() {
    return (
      <Radio.Group
        name="myRadioGroup"
        accessibilityLabel="Choix"
        value={this.state.option1}
        onChange={nextValue => {this.setState({option1: nextValue})}}
        space={3}
      >
        <Radio value="teteatete" size="md" _text={{color:"white"}}>Tournoi mêlée-démêlée avec nom</Radio>
        <Radio value="doublette" size="md" _text={{color:"white"}}>Tournoi mêlée-dêmêlée sans nom</Radio>
        <Radio value="triplette" size="md" _text={{color:"white"}}>Tournoi mêlée avec équipes constituées</Radio>
      </Radio.Group>
    )
  }

  _typeTournoi() {
    if (!this.props.optionsTournoi.type == "mele-demele") return;
    return (
      <Radio.Group
        name="myRadioGroup"
        accessibilityLabel="Choix"
        value={this.state.option2}
        onChange={nextValue => {this.setState({option2: nextValue})}}
        space={3}
      >
        <Radio value="avecNoms" size="md" _text={{color:"white"}}>Tournoi mêlée-démêlée avec nom</Radio>
        <Radio value="sansNoms" size="md" _text={{color:"white"}}>Tournoi mêlée-dêmêlée sans nom</Radio>
        <Radio value="avecEquipes" size="md" _text={{color:"white"}}>Tournoi mêlée avec équipes constituées</Radio>
      </Radio.Group>
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
          <TopBarBack title="Mode du tournoi" navigation={this.props.navigation}/>
          <VStack flex="1" px="10">
            {this._titre()}
            {this._typeEquipes()}
            {this._typeTournoi()}
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