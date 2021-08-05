import React from 'react'
import { StyleSheet, View, TextInput, Text, Button } from 'react-native'
import CheckBox from 'react-native-check-box'
import { connect } from 'react-redux'

class OptionsTournoi extends React.Component {

  constructor(props) {
    super(props)
    this.nbTours = "5"
    this.state = {
      speciauxIncompatibles: true,
      memesEquipes: true,
      memesAdversaires: true,
      nbTours: "5"
    }
  }

  componentDidMount() {
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        this.setState({
          nbTours: routeparams.nbTours,
        })
        this.nbTours = routeparams.nbTours
      }
      if (routeparams.speciauxIncompatibles != undefined) {
        this.setState({
          speciauxIncompatibles: routeparams.speciauxIncompatibles,
        })
      }
      if (routeparams.memesEquipes != undefined) {
        this.setState({
          memesEquipes: routeparams.memesEquipes,
        })
      }
      if (routeparams.memesAdversaires != undefined) {
        this.setState({
          memesAdversaires: routeparams.memesAdversaires,
        })
      }
    }
  }

  _optionsNombreToursTextInputChanged(text) {
    this.nbTours = text.toString()
  }

  _retourInscription() {
    this.props.navigation.navigate({
      name: 'InscriptionStack',
      params: {
        nbTours: this.nbTours,
        speciauxIncompatibles: this.state.speciauxIncompatibles,
        memesEquipes: this.state.memesEquipes,
        memesAdversaires: this.state.memesAdversaires
      }
    })
  }

  render() {
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container} >
          <View style={styles.input_nbtours_container}>
            <Text style={styles.texte}>Nombre de tours: </Text>
            <TextInput
              style={styles.textinput}
              placeholderTextColor='white'
              underlineColorAndroid='white'
              placeholder="Nombre de tours"
              keyboardType="numeric"
              defaultValue= {this.state.nbTours}
              onChangeText={(text) => this._optionsNombreToursTextInputChanged(text)}
              ref={this.addPlayerTextInput}
            />
          </View>
          <View style={styles.checkbox_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  speciauxIncompatibles: !this.state.speciauxIncompatibles
                })
              }}
              isChecked={this.state.speciauxIncompatibles}
              leftText={"Ne jamais faire jouer 2 enfants dans la même équipe"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
            />
          </View>
          <View style={styles.checkbox_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  memesEquipes: !this.state.memesEquipes
                })
              }}
              isChecked={this.state.memesEquipes}
              leftText={"Ne jamais former les mêmes équipes"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
            />
          </View>
          <View style={styles.checkbox_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  memesAdversaires: !this.state.memesAdversaires
                })
              }}
              isChecked={this.state.memesAdversaires}
              leftText={"Empecher 2 joueurs de jouer + de la moitié des matchs contre et ensemble"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
            />
          </View>
        </View>
        <View style={styles.buttonView}>
          <Button color='green' title='Valider les options' onPress={() => this._retourInscription()}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  body_container: {
    flex:1,
    marginHorizontal: '5%'
  },
  input_nbtours_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox_container: {
    marginBottom: 10,
  },
  textinput: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  texte: {
    fontSize: 15,
    color: 'white'
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs
  }
}

export default connect(mapStateToProps)(OptionsTournoi)