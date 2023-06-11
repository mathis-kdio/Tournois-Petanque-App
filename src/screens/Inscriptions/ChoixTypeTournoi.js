import React from 'react'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Box, VStack,Text, Button } from 'native-base'
import TopBarBack from 'components/TopBarBack'

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
          <VStack flex="1" px="10" space="4">
            <Box>
              <Text>Choisissez vos équipes ou laisser la génération aléatoire. En tête-à-tête, doublettes ou triplettes :</Text>
              <Button onPress={() => this._navigate('mele-demele')} bg="#1c3969">Type Mêlée-Démêlée</Button>
            </Box>
            <Box>
              <Text>Tous les joueurs se rencontrent à un moment dans le tournoi :</Text>
              <Button onPress={() => this._navigate('championnat')} bg="#1c3969">Type Championnat</Button>
            </Box>
            <Box>
              <Text>Une phase de poule puis les phases finales :</Text>
              <Button onPress={() => this._navigate('coupe')} bg="#1c3969">Type Coupe</Button>
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

export default connect(mapStateToProps)(ChoixTypeTournoi)