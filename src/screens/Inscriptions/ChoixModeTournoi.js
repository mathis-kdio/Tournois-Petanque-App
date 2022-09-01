import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Button, Text } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";

class ChoixModeTournoi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teteatete: false,
      doublette: true,
      triplette: false,
      avecNoms: true,
      sansNoms: false,
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
    let modeTournoi
    if (this.props.optionsTournoi.type == "mele-demele") {
      if (this.state.avecNoms == true) {
        screenName = 'InscriptionsAvecNoms'
        modeTournoi = 'avecNoms'
      }
      else if (this.state.sansNoms == true) {
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

    this.props.navigation.navigate(screenName);
  }

  _buttonInscription() {
    let boutonDesactive = false
    let title = "Valider et passer à l'inscription"
    if(this.state.avecEquipes == true && this.state.teteatete) {
      boutonDesactive = true
      title = "Mode de tournois incompatible"
    }
    return <Button color="#1c3969" disabled={boutonDesactive} title={title} onPress={() => this._inscription()}/>
  }

  _titre() {
    if (this.props.optionsTournoi.type == "mele-demele") {
      return <Text style={styles.titre}>Choix du types d'équipe et mode du tournoi mêlée-démêlée :</Text>
    }
    else if (this.props.optionsTournoi.type == "championnat") {
      return <Text style={styles.titre}>Choix du mode du championnat :</Text>
    }
    else if (this.props.optionsTournoi.type == "coupe") {
      return <Text style={styles.titre}>Choix du mode de la coupe :</Text>
    }
  }

  _typeEquipes() {
    return (
      <View>
        <View style={styles.checkbox_container}>
          <BouncyCheckbox 
            onPress={()=>{
              this.setState({
                teteatete: true,
                doublette: false,
                triplette: false
              })
            }}
            disableBuiltInState="true"
            isChecked={this.state.teteatete}
            text="Tête-à-tête"
            textStyle={{color: "white", fontSize: 15, textDecorationLine: "none"}}
            fillColor="white"
          />
        </View>
        <View style={styles.checkbox_container}>
          <BouncyCheckbox 
            onPress={()=>{
              this.setState({
                teteatete: false,
                doublette: true,
                triplette: false
              })
            }}
            disableBuiltInState="true"
            isChecked={this.state.doublette}
            text="Doublettes"
            textStyle={{color: "white", fontSize: 15, textDecorationLine: "none"}}
            fillColor="white"
          />
        </View>
        <View style={styles.checkbox_container}>
          <BouncyCheckbox 
            onPress={()=>{
              this.setState({
                teteatete: false,
                doublette: false,
                triplette: true
              })
            }}
            disableBuiltInState="true"
            isChecked={this.state.triplette}
            text="Triplettes"
            textStyle={{color: "white", fontSize: 15, textDecorationLine: "none"}}
            fillColor="white"
          />
        </View>
      </View>
    )
  }

  _typeTournoi() {
    if (this.props.optionsTournoi.type == "mele-demele") {
      return (
        <View>
          <View style={styles.checkbox_container}>
            <BouncyCheckbox 
              onPress={()=>{
                this.setState({
                  avecNoms: true,
                  sansNoms: false,
                  avecEquipes: false
                })
              }}
              disableBuiltInState="true"
              isChecked={this.state.avecNoms}
              text="Tournoi mêlée-démêlée avec nom"
              textStyle={{color: "white", fontSize: 15, textDecorationLine: "none"}}
              fillColor="white"
            />
          </View>
          <View style={styles.checkbox_container}>
            <BouncyCheckbox 
              onPress={()=>{
                this.setState({
                  avecNoms: false,
                  sansNoms: true,
                  avecEquipes: false
                })
              }}
              disableBuiltInState="true"
              isChecked={this.state.sansNoms}
              text="Tournoi mêlée-dêmêlée sans nom"
              textStyle={{color: "white", fontSize: 15, textDecorationLine: "none"}}
              fillColor="white"
            />
          </View>
          <View style={styles.checkbox_container}>
            <BouncyCheckbox 
              onPress={()=>{
                this.setState({
                  avecNoms: false,
                  sansNoms: false,
                  avecEquipes: true,
                })
              }}
              disableBuiltInState="true"
              isChecked={this.state.avecEquipes}
              text="Tournoi mêlée avec équipes constituées"
              textStyle={{color: "white", fontSize: 15, textDecorationLine: "none"}}
              fillColor="white"
            />
          </View>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            {this._titre()}
          </View>
          <View style={styles.type_equipe}>
            {this._typeEquipes()}
          </View>
          <View style={styles.type_tournoi}>
            {this._typeTournoi()}
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

const mapStateToProps = (state) => {
  return {
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(ChoixModeTournoi)