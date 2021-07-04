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
          nbTours: routeparams.nbTours
        })
        this.nbTours = routeparams.nbTours
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
        nbTours: this.nbTours
      }
    })
  }

  render() {
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container} >
          <View style={styles.textinput_nbtours_container}>
            <Text>Nombre de tours: </Text>
            <TextInput
              style={styles.textinput}
              placeholder="Nombre de tours"
              keyboardType="numeric"
              defaultValue= {this.state.nbTours}
              onChangeText={(text) => this._optionsNombreToursTextInputChanged(text)}
              onSubmitEditing={(text) => this._optionsNombreToursTextInputChanged(text)}
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
              leftText={"Ne pas faire jouer 2 femme/enfant ensembles"}
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
              leftText={"Eviter de former les mêmes équipes"}
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
              leftText={"Eviter de faire s'affronter les mêmes personnes"}
            />
          </View>
        </View>
        <View style={styles.buttonView}>
          <Button color='#32cd32' title='Valider les paramètres' onPress={() => this._retourInscription()}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginLeft: '5%',
    marginRight: '5%'
  },
  body_container: {
    flex:1,
  },
  textinput_nbtours_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox_container: {
    marginBottom: 10,
  },
  textinput: {
    height: 50,
    borderColor: '#000000',
    borderBottomWidth: 1,
    paddingLeft: 5,
  },
  buttonView: {
    marginBottom: 10
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs
  }
}

export default connect(mapStateToProps)(OptionsTournoi)