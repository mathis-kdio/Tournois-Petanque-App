import React from 'react'
import { StyleSheet, View, TextInput, Text, Button } from 'react-native'
import CheckBox from 'react-native-check-box'
import { connect } from 'react-redux'

class OptionsTournoi extends React.Component {

  constructor(props) {
    super(props)
    this.nbTours = 5
    this.state = {
      speciauxIncompatibles: true,
      isChecked: true
    }
  }

  _optionsNombreToursTextInputChanged(text) {
    this.nbTours = text;
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
              defaultValue= "5"
              onChangeText={(text) => this._optionsNombreToursTextInputChanged(text)}
              onSubmitEditing={() => this._optionsNombreToursTextInputChanged()}
              ref={this.addPlayerTextInput}
            />
          </View>
          <View style={styles.checkbox_ajoutjoueur_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  speciauxIncompatibles:!this.state.speciauxIncompatibles
                })
              }}
              isChecked={this.state.speciauxIncompatibles}
              leftText={"Ne pas faire jouer 2 femme/enfant ensembles"}
            />
          </View>
          <View style={styles.checkbox_ajoutjoueur_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  isChecked:!this.state.isChecked
                })
              }}
              isChecked={this.state.isChecked}
              leftText={"Femme/Enfant"}
            />
          </View>
        </View>
        <View style={styles.buttonView}>
          <Button color='#32cd32' title='Valider les paramètres' onPress={() => this.props.navigation.goBack()}/>
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
  checkbox_ajoutjoueur_container: {
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