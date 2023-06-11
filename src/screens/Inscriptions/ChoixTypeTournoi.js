import React from 'react'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { VStack, Text, Spacer } from 'native-base'
import TopBarBack from 'components/TopBarBack'
import CardButton from 'components/buttons/CardButton'

class ChoixTypeTournoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _navigate(typeTournoi) {
    const updateOptionTypeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['type', typeTournoi]}
    this.props.dispatch(updateOptionTypeTournoi);
    return this.props.navigation.navigate({name: 'ChoixModeTournoi'});
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
        <TopBarBack title="Type de tournoi" navigation={this.props.navigation}/>
          <VStack flex="1" px="10">
            <Spacer/>
            <CardButton
              text="Type Mêlée-Démêlée"
              icon="random"
              navigate={() => this._navigate('mele-demele')}
            />
            <VStack>
              <Text>En savoir plus:</Text>
              <Text>Choisissez vos équipes ou laisser la génération aléatoire. En tête-à-tête, doublettes ou triplettes :</Text>
            </VStack>
            <Spacer/>
            <CardButton
              text="Type Championnat"
              icon="table"
              navigate={() => this._navigate('championnat')}
            />
            <VStack>
              <Text>En savoir plus:</Text>
              <Text>Tous les joueurs se rencontrent à un moment dans le tournoi :</Text>
            </VStack>
            <Spacer/>
            <CardButton
              text="Type Coupe"
              icon="trophy"
              navigate={() => this._navigate('coupe')}
            />
            <VStack>
              <Text>En savoir plus:</Text>
              <Text>Une phase de poule puis les phases finales :</Text>
            </VStack>
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

export default connect(mapStateToProps)(ChoixTypeTournoi)