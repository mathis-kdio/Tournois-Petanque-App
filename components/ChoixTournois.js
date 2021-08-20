import React from 'react'
import { StyleSheet, View, Button, Text } from 'react-native'
import CheckBox from 'react-native-check-box'

class ChoixTournois extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teteatete: false,
      doublette: true,
      triplette: false,
      avecNom: true,
      sansNom: false,
      avecEquipes: false,
    }
  }

  _inscription() {
    let typeEquipes
    if (this.state.teteatete == true) {
      typeEquipes = 'teteatete'
    }
    else if (this.state.doublette == true) {
      typeEquipes = 'doublette'
    }
    else {
      typeEquipes = 'triplette'
    }

    let screenName
    let avecEquipes
    if (this.state.avecNom == true) {
      screenName = 'InscriptionsAvecNoms'
      avecEquipes = false
    }
    else if (this.state.sansNom == true) {
      screenName = 'InscriptionsSansNoms'
      avecEquipes = false
    }
    else {
      screenName = 'InscriptionsAvecNoms'
      avecEquipes = true
    }
    this.props.navigation.navigate({
      name: screenName, 
      params: { typeEquipes: typeEquipes, avecEquipes: avecEquipes }
    })
  }

  _buttonInscription() {
    let boutonDesactive = true
    if(this.state.avecNom == true || this.state.sansNom == true || this.state.avecEquipes == true) {
      boutonDesactive = false
    }
    return <Button color="#1c3969" disabled={boutonDesactive} title="Valider et passer à l'inscription" onPress={() => this._inscription()}/>
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.titre}>Types d'équipe et de tournoi</Text>
          </View>
          <View style={styles.type_equipe}>
            <View style={styles.checkbox_container}>
              <CheckBox
                onClick={()=>{
                  this.setState({
                    teteatete: true,
                    doublette: false,
                    triplette: false
                  })
                }}
                isChecked={this.state.teteatete}
                leftText={"Tête-à-tête"}
                leftTextStyle={{color: "white", fontSize: 15}}
                checkBoxColor={'white'}
              />
            </View>
            <View style={styles.checkbox_container}>
              <CheckBox
                onClick={()=>{
                  this.setState({
                    teteatete: false,
                    doublette: true,
                    triplette: false
                  })
                }}
                isChecked={this.state.doublette}
                leftText={"Doublettes"}
                leftTextStyle={{color: "white", fontSize: 15}}
                checkBoxColor={'white'}
              />
            </View>
            <View style={styles.checkbox_container}>
              <CheckBox
              onClick={()=>{
                this.setState({
                  teteatete: false,
                  doublette: false,
                  triplette: true
                })
              }}
              isChecked={this.state.triplette}
              leftText={"Triplettes"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
              />
            </View>
          </View>
          <View style={styles.type_tournoi}>
            <View style={styles.checkbox_container}>
              <CheckBox
              onClick={()=>{
                this.setState({
                  avecNom: !this.state.avecNom,
                  sansNom: false,
                  avecEquipes: false
                })
              }}
              isChecked={this.state.avecNom}
              leftText={"Tournoi mêlée-dêmélée avec nom"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
              />
            </View>
            <View style={styles.checkbox_container}>
              <CheckBox
              onClick={()=>{
                this.setState({
                  avecNom: false,
                  sansNom: !this.state.sansNom,
                  avecEquipes: false
                })
              }}
              isChecked={this.state.sansNom}
              leftText={"Tournoi mêlée-dêmélée sans nom"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
              />
            </View>
            <View style={styles.checkbox_container}>
              <CheckBox
              onClick={()=>{
                this.setState({
                  avecNom: false,
                  sansNom: false,
                  avecEquipes: !this.state.avecEquipes,
                })
              }}
              isChecked={this.state.avecEquipes}
              leftText={"Tournoi mêlée avec équipes constituées"}
              leftTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
              />
            </View>
          </View>
          <View style={styles.buttonView}>
            {this._buttonInscription()}
          </View>
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
    flex: 1,
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
  titre: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  type_equipe: {
    marginBottom: 20,
  },
  type_tournoi: {
    marginBottom: 20,
  },
  checkbox_container: {
    marginBottom: 10,
  },
  buttonView: {
    paddingLeft: 15,
    paddingRight: 15
  },
})

export default ChoixTournois