import React from 'react';
import { StyleSheet, Image } from 'react-native';

import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Accueil from '../components/Accueil'
import Inscription from '../components/Inscriptions'
import OptionsTournoi from '../components/OptionsTournoi'
import GenerationMatchs from '../components/GenerationMatchs'
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

function ManchesTopTabNavigator() {
  return (
    <TopTab.Navigator
      lazy='true'
      initialRouteName='Screen1Manche'
      tabBarOptions={{scrollEnabled: true}}    
    >
      <TopTab.Screen name="Screen1Manche" options={{title: 'Tour 1'}}>
        {props => <ListeMatchs {...props} extraData={1} />}
      </TopTab.Screen>
      <TopTab.Screen name="Screen2Manche" options={{title: 'Tour 2'}}>      
        {props => <ListeMatchs {...props} extraData={2} />}
      </TopTab.Screen>
      <TopTab.Screen name="Screen3Manche" options={{title: 'Tour 3'}}>
        {props => <ListeMatchs {...props} extraData={3} />}
      </TopTab.Screen>
      <TopTab.Screen name="Screen4Manche" options={{title: 'Tour 4'}}>
        {props => <ListeMatchs {...props} extraData={4} />}
      </TopTab.Screen>
      <TopTab.Screen name="Screen5Manche" options={{title: 'Tour 5'}}>
        {props => <ListeMatchs {...props} extraData={5} />}
      </TopTab.Screen>
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
          title: 'Liste des matchs',
          headerTitleAlign: 'center',
          herderLeft: () => (null),
          headerRight: () => (
            <BoutonMenuHeaderNav navigation={navigation}/>
          )
        }}
      />
      <Stack.Screen name="MatchDetailStack" component={MatchDetail} options={{title: 'Détail du match', headerTitleAlign: 'center'}} />        
      <Stack.Screen name="ListeJoueur" component={JoueursTournoi} options={{title: 'Liste des joueurs inscrits', headerTitleAlign: 'center'}} />    
      <Stack.Screen name="ParametresTournoi" component={ParametresTournoi} options={{title: 'Paramètres du tournois', headerTitleAlign: 'center'}} />    
    </Stack.Navigator>
  );
}

function ResultatsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListeResultatsStack" component={ListeResultats} options={{title: 'Résultats & Classement', headerTitleAlign: 'center', headerLeft: null}} />
    </Stack.Navigator>
  );
}

function MatchsResultatsBottomNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="ListeMatchsBottom">
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
          title: 'Matchs & Détails'
        }}
      />
    </BottomTab.Navigator>
  );
}

function InscriptionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="InscriptionStack" component={Inscription} options={{title: 'Inscription', headerTitleAlign: 'center'}} />
      <Stack.Screen name="OptionsTournoi" component={OptionsTournoi} options={{title: 'Paramètres du tournoi', headerTitleAlign: 'center'}} />      
      <Stack.Screen name="GenerationMatchs" component={GenerationMatchs} options={{title: 'Générations des matchs en cours', headerTitleAlign: 'center'}} />
      <Stack.Screen name="ListeMatchsInscription" component={MatchsResultatsBottomNavigator} options={{headerShown: false}} />    
    </Stack.Navigator>
  );
}

function General() {
  return (
    <Stack.Navigator
      initialRouteName='AccueilGeneral'
    >
      <Stack.Screen name="AccueilGeneral" component={Accueil} options={{title: 'Accueil - Pétanque GCU', headerTitleAlign: 'center'}} />
      <Stack.Screen name="InscriptionGeneral" component={InscriptionStack} options={{headerShown: false}} />
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