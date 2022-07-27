import React from 'react';
import { StyleSheet, Image, Text } from 'react-native';
import { connect, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Accueil from '../components/Accueil'
import Changelog from '../components/Changelog'
import ListeTournois from '../components/ListeTournois';
import ChoixTypeTournoi from '../components/ChoixTypeTournoi';
import ChoixModeTournoi from '../components/ChoixModeTournoi'
import Inscription from '../components/Inscriptions'
import InscriptionsSansNoms from '../components/InscriptionsSansNoms'
import OptionsTournoi from '../components/OptionsTournoi'
import GenerationChampionnat from '../components/GenerationChampionnat'
import GenerationCoupe from '../components/GenerationCoupe';
import GenerationMatchs from '../components/GenerationMatchs'
import GenerationMatchsTriplettes from '../components/GenerationMatchsTriplettes'
import GenerationMatchsAvecEquipes from '../components/GenerationMatchsAvecEquipes'
import ListeResultats from '../components/ListeResultats'
import ListeMatchs from '../components/ListeMatchs'
import MatchDetail from '../components/MatchDetail'
import JoueursTournoi from '../components/JoueursTournoi'
import ParametresTournoi from '../components/ParametresTournoi'
import PDFExport from '../components/PDFExport'

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
  let nbTours = 5
  if (counter != undefined) {
    nbTours = counter[counter.length - 1].nbTours
  }
  let TopTabScreenListe = []
  for (let i = 0; i < nbTours; i++) {
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
  let TabTitle = 'Tour '+numero;
  if (listeMatchs[listeMatchs.length - 1].typeTournoi == 'coupe') {
    TabTitle = listeMatchs.find(el => el.manche == numero).mancheName;
  }
  return <Text style={{color:titleColor, fontSize: 20}}>{TabTitle}</Text>
}

function ManchesTopTabNavigator() {
  return (
    <TopTab.Navigator initialRouteName='Screen1Manche' screenOptions={{tabBarScrollEnabled: true, tabBarStyle: {backgroundColor: '#ffda00'}, tabBarIndicatorStyle: {backgroundColor: "#1c3969"}}}>
      {topTabScreens()}
    </TopTab.Navigator>
  );
}

function MatchsStack() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}}>
      <Stack.Screen
        name="ListeMatchsStack"
        component={ManchesTopTabNavigator}
        options={{
          title: 'Liste des parties',
          headerTitleAlign: 'center',
          headerLeft: false,
          headerRight: () => (
            <BoutonMenuHeaderNav navigation={navigation}/>
          ),
          headerStyle: {backgroundColor: '#ffda00'},
          headerTitleStyle: {color: '#1c3969'}
        }}
      />
      <Stack.Screen name="MatchDetailStack" component={MatchDetail} options={{title: 'Détail de la partie'}} />
      <Stack.Screen name="ListeJoueur" component={JoueursTournoi} options={{title: 'Liste des joueurs inscrits'}} />
      <Stack.Screen name="ParametresTournoi" component={ParametresTournoi} options={{title: 'Paramètres du tournoi'}} />
      <Stack.Screen name="PDFExport" component={PDFExport} options={{title: 'Exporter en PDF'}} />
    </Stack.Navigator>
  );
}

function ResultatsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListeResultatsStack" component={ListeResultats} options={{title: 'Résultats & Classement', headerTitleAlign: 'center', headerLeft: false, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
    </Stack.Navigator>
  );
}

function MatchsResultatsBottomNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="ListeMatchsBottom" screenOptions={{headerShown: false, tabBarStyle: {backgroundColor: '#ffda00'}, tabBarActiveTintColor: '#1c3969', tabBarLabelStyle: {fontSize: 15}}}>
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

function General() {
  const listeMatchs = useSelector(state => state.gestionMatchs.listematchs);
  let typeTournoi = 'melee-demelee'
  if (listeMatchs[listeMatchs.length - 1].typeTournoi) {
    typeTournoi = listeMatchs[listeMatchs.length - 1].typeTournoi;
  }
  return (
    <Stack.Navigator initialRouteName='AccueilGeneral' screenOptions={{headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}}>
      <Stack.Screen name="AccueilGeneral" component={Accueil} options={{title: 'Accueil - Pétanque GCU'}} />
      <Stack.Screen name="Changelog" component={Changelog} options={{title: 'Changelog - Pétanque GCU'}} />

      <Stack.Screen name="ListeTournois" component={ListeTournois} options={{title: 'Choix d\'un tournoi'}} />

      <Stack.Screen name="ChoixTypeTournoi" component={ChoixTypeTournoi} options={{title: 'Choix du type de tournoi'}} />
      <Stack.Screen name="ChoixModeTournoi" component={ChoixModeTournoi} options={{title: 'Choix du mode de tournoi'}} />
      
      <Stack.Screen name="InscriptionsAvecNoms" component={Inscription} options={{title: 'Inscription Avec Noms'}} />
      <Stack.Screen name="InscriptionsSansNoms" component={InscriptionsSansNoms} options={{title: 'Inscription Sans Noms'}} />
      
      <Stack.Screen name="OptionsTournoi" component={OptionsTournoi} options={{title: 'Options du tournoi'}} />     
      
      <Stack.Screen name="GenerationChampionnat" component={GenerationChampionnat} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerLeft: false, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="GenerationCoupe" component={GenerationCoupe} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerLeft: false, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="GenerationMatchs" component={GenerationMatchs} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerLeft: false, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="GenerationMatchsTriplettes" component={GenerationMatchsTriplettes} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerLeft: false, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="GenerationMatchsAvecEquipes" component={GenerationMatchsAvecEquipes} options={{title: 'Générations des parties en cours', headerTitleAlign: 'center', headerLeft: false, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
    
      <Stack.Screen name="ListeMatchsInscription"
        component={typeTournoi != 'Coupe' ? MatchsResultatsBottomNavigator : MatchsStack} 
        options={{headerShown: false}}
      />   
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Root">
      <Stack.Screen name="Root" component={General} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}