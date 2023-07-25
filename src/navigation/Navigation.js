import React from 'react';
import { Text } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import Accueil from '@screens/Accueil'
import Parametres from '@screens/Parametres'
import ListeTournois from '@screens/ListeTournois/ListeTournois';
import ChoixTypeTournoi from '@screens/Inscriptions/ChoixTypeTournoi';
import ChoixModeTournoi from '@screens/Inscriptions/ChoixModeTournoi'
import InscriptionsAvecNoms from '@screens/Inscriptions/InscriptionsAvecNoms'
import InscriptionsSansNoms from '@screens/Inscriptions/InscriptionsSansNoms'
import OptionsTournoi from '@screens/Inscriptions/OptionsTournoi'
import GenerationMatchs from '@screens/Inscriptions/GenerationMatchs'
import ListeResultats from '@screens/Resultats/ListeResultats'
import ListeMatchs from '@screens/Matchs/ListeMatchs'
import ListeTerrains from '@screens/ListeTerrains/ListeTerrains'
import MatchDetail from '@screens/Matchs/MatchDetail'
import JoueursTournoi from '@screens/Matchs/JoueursTournoi'
import ParametresTournoi from '@screens/Matchs/ParametresTournoi'
import PDFExport from '@components/PDFExport'

import BoutonMenuHeaderNav from '@components/BoutonMenuHeaderNavigation'
import ListesJoueurs from '@screens/ListesJoueurs/ListesJoueurs';
import CreateListeJoueurs from '@screens/ListesJoueurs/CreateListeJoueurs';

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
  let TabTitle = 'Tour '+numero;
  if (listeMatchs) {
    let testTourFiltre = listeMatchs.filter(el => el.manche === numero)
    //Test si tous les matchs d'un tour sont finis si oui alors vert
    if (testTourFiltre.every(e => e.score1 != undefined && e.score2 != undefined) == true) {
      titleColor = 'green'
    } //Test si tous les matchs d'un tour ne sont pas commencé si oui alors rouge
    else if (testTourFiltre.every(e => e.score1 == undefined && e.score2 == undefined) == true) {
      titleColor = 'red'
    }

    if (listeMatchs[listeMatchs.length - 1].typeTournoi == 'coupe') {
      TabTitle = listeMatchs.find(el => el.manche == numero).mancheName;
    }
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
  const { t } = this.props;
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}}>
      <Stack.Screen
        name="ListeMatchsStack"
        component={ManchesTopTabNavigator}
        options={{
          title: t("liste_matchs_navigation_title"),
          headerTitleAlign: 'center',
          headerLeft: false,
          headerRight: () => (
            <BoutonMenuHeaderNav navigation={navigation}/>
          ),
          headerStyle: {backgroundColor: '#ffda00'},
          headerTitleStyle: {color: '#1c3969'}
        }}
      />
      <Stack.Screen name="MatchDetailStack" component={MatchDetail} options={{title: t("detail_match_navigation_title")}} />
      <Stack.Screen name="ListeJoueur" component={JoueursTournoi} options={{title: t("liste_joueurs_inscrits_navigation_title")}} />
      <Stack.Screen name="ParametresTournoi" component={ParametresTournoi} options={{title: t("parametres_tournoi_navigation_title")}} />
      <Stack.Screen name="PDFExport" component={PDFExport} options={{title: t("exporter_pdf_navigation_title")}} />
    </Stack.Navigator>
  );
}

function ResultatsStack() {
  const { t } = this.props;
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListeResultatsStack" component={ListeResultats} options={{title: t("resultats_classement_navigation_title"), headerTitleAlign: 'center', headerLeft: false, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
    </Stack.Navigator>
  );
}

function MatchsResultatsBottomNavigator() {
  const { t } = this.props;
  return (
    <BottomTab.Navigator initialRouteName="ListeMatchsBottom" backBehavior='none' screenOptions={{headerShown: false, tabBarStyle: {backgroundColor: '#ffda00'}, tabBarActiveTintColor: '#1c3969', tabBarLabelStyle: {fontSize: 15}}}>
      <BottomTab.Screen
        name="ListeResultatsBottom"
        component={ResultatsStack}
        options={{
          tabBarIcon: () => {return <FontAwesome5 name="trophy" size={28}/>},
          title: t("resultats_classement_navigation_title")
        }} 
      />
      <BottomTab.Screen 
        name="ListeMatchsBottom" 
        component={MatchsStack}
        options={{
          tabBarIcon: () => {return <FontAwesome5 name="bars" size={28}/>},
          title: t("matchs_details_navigation_title")
        }}
      />
    </BottomTab.Navigator>
  );
}

function InscriptionStack() {
  const { t } = this.props;
  return (
    <Stack.Navigator initialRouteName='ChoixTypeTournoi' screenOptions={{headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}}>
      <Stack.Screen name="ChoixTypeTournoi" component={ChoixTypeTournoi} options={{headerShown: false}} />
      <Stack.Screen name="ChoixModeTournoi" component={ChoixModeTournoi} options={{headerShown: false}} />
      <Stack.Screen name="OptionsTournoi" component={OptionsTournoi} options={{headerShown: false}} />     
      <Stack.Screen name="InscriptionsAvecNoms" component={InscriptionsAvecNoms} options={{title: t("inscription_avec_noms_navigation_title")}} />
      <Stack.Screen name="InscriptionsSansNoms" component={InscriptionsSansNoms} options={{title: t("inscription_sans_noms_navigation_title")}} />
      <Stack.Screen name="ListeTerrains" component={ListeTerrains} options={{title: t("liste_terrains_navigation_title")}} />     
      <Stack.Screen name="GenerationMatchs" component={GenerationMatchs} options={{title: t("generation_matchs_navigation_title"), headerTitleAlign: 'center', headerLeft: false, headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}} />
      <Stack.Screen name="ListeMatchsInscription" component={ListeMatchsStack} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

function ListeMatchsStack() {
  const listeMatchs = useSelector(state => state.gestionMatchs.listematchs);
  let typeTournoi = 'mele-demele'
  if (listeMatchs && listeMatchs.length > 0 && listeMatchs[listeMatchs.length - 1].typeTournoi) {
    typeTournoi = listeMatchs[listeMatchs.length - 1].typeTournoi;
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListeMatchsScreen"
        component={typeTournoi != 'Coupe' ? MatchsResultatsBottomNavigator : MatchsStack} 
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

function General() {
  const { t } = this.props;
  return (
    <Stack.Navigator initialRouteName='AccueilGeneral' screenOptions={{headerTitleAlign: 'center', headerStyle: {backgroundColor: '#ffda00'}, headerTitleStyle: {color: '#1c3969'}}}>
      <Stack.Screen name="AccueilGeneral" component={Accueil} options={{headerShown: false}} />
      <Stack.Screen name="Parametres" component={Parametres} options={{headerShown: false}} />

      <Stack.Screen name="ListeTournois" component={ListeTournois} options={{title: t("choix_tournoi_navigation_title")}} />

      <Stack.Screen name="ListesJoueurs" component={ListesJoueurs} options={{title: t("listes_joueurs_navigation_title")}} />
      <Stack.Screen name="CreateListeJoueurs" component={CreateListeJoueurs} options={{title: t("creation_liste_joueurs_navigation_title")}} />

      <Stack.Screen name="InscriptionStack" component={InscriptionStack} options={{headerShown: false}} />
      <Stack.Screen name="ListeMatchsStack" component={ListeMatchsStack} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <Stack.Navigator initialRouteName="Root">
      <Stack.Screen name="Root" component={General} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default withTranslation()(App)