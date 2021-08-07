import React from 'react';
import { StyleSheet, Image, Text } from 'react-native';
import { connect, useSelector } from 'react-redux';

import { useBackHandler } from '@react-native-community/hooks'

import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Accueil from '../components/Accueil'
import Changelog from '../components/Changelog'
import ChoixTournois from '../components/ChoixTournois'
import Inscription from '../components/Inscriptions'
import InscriptionsSansNoms from '../components/InscriptionsSansNoms'
import OptionsTournoi from '../components/OptionsTournoi'
import GenerationMatchs from '../components/GenerationMatchs'
import GenerationMatchsTriplettes from '../components/GenerationMatchsTriplettes'
import ListeResultats from '../components/ListeResultats'
import ListeMatchs from '../components/ListeMatchs'
import MatchDetail from '../components/MatchDetail'
import JoueursTournoi from '../components/JoueursTournoi'
import ParametresTournoi from '../components/ParametresTournoi'

import BoutonMenuHeaderNav from '../components/BoutonMenuHeaderNavigation'

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30
  }
})

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function topTabScreens() {
  const counter = useSelector(state => state.gestionMatchs.listematchs)
  let nbManches = 5
  if (counter != undefined) {
    nbManches = counter[counter.length - 1].nbManches
  }
  let TopTabScreenListe = []
  for (let i = 0; i < nbManches; i++) {
    const name = "Screen"+ (i + 1) +"Manche"
    let titleTour = {tabBarLabel: () => <TitleTopTabContainer numero={i + 1} />}
    TopTabScreenListe.push(
      <TopTab.Screen key={i} name={name} options={titleTour}>
        {props => <ListeMatchs {...props} extraData={i + 1} />}
      </TopTab.Screen>
    )
  }
  return TopTabScreenListe
}

const TitleTopTabContainer = connect((state, numero) => ({ listeMatchs: state.gestionMatchs.listematchs}))(texteTitleTopTab);

function texteTitleTopTab({ listeMatchs, numero }) {
  let titleColor = '#1c3969'
  if (listeMatchs) {
    let testTourFiltre = listeMatchs.filter(el => el.manche === numero)
    //Test si tous les matchs d'un tour sont finis si oui alors vert
    if (testTourFiltre.every(e => e.score1 != undefined && e.score2 != undefined) == true) {
      titleColor = 'green'
    } //Test si tous les matchs d'un tour ne sont pas commencé si oui alors rouge
    else if (testTourFiltre.every(e => e.score1 == undefined && e.score2 == undefined) == true) {
      titleColor = 'red'
    }
  }
  return <Text style={{color:titleColor, fontSize: 20}}>Tour {numero}</Text>
}

function ManchesTopTabNavigator() {
  //tabBarOptions={{style: {backgroundColor: '#ffda00'}, activeTintColor: '#1c3969', labelStyle: {fontSize: 15}}
  return (
    <TopTab.Navigator initialRouteName='Screen1Manche' tabBarOptions={{scrollEnabled: true, style: {backgroundColor: '#ffda00'}, indicatorStyle: {backgroundColor: "#1c3969"}}}>
      {topTabScreens()}
    </TopTab.Navigator>
  );
}

function MatchsStack() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListeMatchsStack"
        component={ManchesTopTabNavigator}
        options={{
          title: 'Liste des parties',
          headerTitleAlign: 'center',
          headerLeft: () => (null),
          headerRight: () => (
            <BoutonMenuHeaderNav navigation={navigation}/>
          ),
          headerStyle: {backgroundColor: '#ffda00'},
          headerTitleStyle: {color: '#1c3969'}
        }}
      />
      <Stack.Screen name="MatchDetailStack" component={MatchDetail} options={{title: 'Détail de la partie', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />        
      <Stack.Screen name="ListeJoueur" component={JoueursTournoi} options={{title: 'Liste des joueurs inscrits', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />    
      <Stack.Screen name="ParametresTournoi" component={ParametresTournoi} options={{title: 'Paramètres du tournoi', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />    
    </Stack.Navigator>
  );
}

function ResultatsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListeResultatsStack" component={ListeResultats} options={{title: 'Résultats & Classement', headerTitleAlign: 'center', headerLeft: null, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
    </Stack.Navigator>
  );
}

function MatchsResultatsBottomNavigator() {
  //Empeche retour en arrière avec bouton hardware
  useBackHandler(() => {
    return true
  })
  return (
    <BottomTab.Navigator initialRouteName="ListeMatchsBottom" tabBarOptions={{style: {backgroundColor: '#ffda00'}, activeTintColor: '#1c3969', labelStyle: {fontSize: 15}}}>
      <BottomTab.Screen
        name="ListeResultatsBottom"
        component={ResultatsStack}
        options={{
          tabBarIcon: () => {
          return <Image
            source={require('../images/ic_trophy.png')}
            style={styles.icon}/>
          },
          title: 'Résultats & Classement',
        }} 
      />
      <BottomTab.Screen 
        name="ListeMatchsBottom" 
        component={MatchsStack}
        options={{
          tabBarIcon: () => {
          return <Image
            source={require('../images/ic_menu.png')}
            style={styles.icon}/>
          },
          title: 'Parties & Détails'
        }}
      />
    </BottomTab.Navigator>
  );
}

function InscriptionStack() {
  return (
    <Stack.Navigator initialRouteName='InscriptionStack'>
      <Stack.Screen name="InscriptionStack" component={Inscription} options={{title: 'Inscription', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="OptionsTournoi" component={OptionsTournoi} options={{title: 'Options du tournoi', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />      
      <Stack.Screen name="GenerationMatchs" component={GenerationMatchs} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="GenerationMatchsTriplettes" component={GenerationMatchsTriplettes} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="ListeMatchsInscription" component={MatchsResultatsBottomNavigator} options={{headerShown: false}} />    
    </Stack.Navigator>
  );
}

function InscriptionsSansNomsStack() {
  return (
    <Stack.Navigator initialRouteName='InscriptionsSansNomsStack'>
      <Stack.Screen name="InscriptionsSansNomsStack" component={InscriptionsSansNoms} options={{title: 'Inscription Sans Noms', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="OptionsTournoi" component={OptionsTournoi} options={{title: 'Options du tournoi', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />      
      <Stack.Screen name="GenerationMatchs" component={GenerationMatchs} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="GenerationMatchsTriplettes" component={GenerationMatchsTriplettes} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="ListeMatchsInscription" component={MatchsResultatsBottomNavigator} options={{headerShown: false}} />    
    </Stack.Navigator>
  );
}

function General() {
  return (
    <Stack.Navigator initialRouteName='AccueilGeneral'>
      <Stack.Screen name="AccueilGeneral" component={Accueil} options={{title: 'Accueil - Pétanque GCU', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="Changelog" component={Changelog} options={{title: 'Changelog - Pétanque GCU', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="ChoixTournois" component={ChoixTournois} options={{title: 'Choix du mode de tournoi', headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="InscriptionGeneral" component={InscriptionStack} options={{headerShown: false}} />
      <Stack.Screen name="InscriptionsSansNoms" component={InscriptionsSansNomsStack} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
        <Stack.Screen name="Root" component={General} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}