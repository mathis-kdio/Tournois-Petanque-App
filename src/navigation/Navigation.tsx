import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import Accueil from '@/app';
import Authentification from '@/app/connexion/authentification';
import Compte from '@/app/connexion/compte';
import InfosPerso from '@/app/connexion/infos-perso';
import Parametres from '@/app/parametres';
import Changelog from '@/app/parametres/changelog';
import ListeTournois from '@/app/liste-tournois/liste-tournois';
import ChoixTypeTournoi from '@/app/inscriptions/choix-type-tournoi';
import ChoixModeTournoi from '@/app/inscriptions/choix-mode-tournoi';
import Inscription from '@/app/connexion/inscription';
import InscriptionsAvecNoms from '@/app/inscriptions/inscriptions-avec-noms';
import InscriptionsSansNoms from '@/app/inscriptions/inscriptions-sans-noms';
import OptionsTournoi from '@/app/inscriptions/options-tournoi';
import ChoixComplement from '@/app/inscriptions/choix-complement';
import GenerationMatchs from '@/app/inscriptions/generation-matchs';
import ListeResultats from '@/app/resultats/liste-resultats';
import ListeMatchs from '@/app/matchs/liste-matchs';
import ListeTerrains from '@/app/liste-terrains/liste-terrains';
import MatchDetail from '@/app/matchs/match-detail';
import JoueursTournoi from '@/app/matchs/joueurs-tournoi';
import ParametresTournoi from '@/app/matchs/parametres-tournoi';
import PDFExport from '@/app/matchs/pdf-export';
import ConfirmationEmail from '@/app/connexion/confirmation-email';
import Securite from '@/app/connexion/securite';
import ListesJoueurs from '@/app/listes-joueurs/listes-joueurs';
import CreateListeJoueurs from '@/app/listes-joueurs/create-liste-joueurs';

import BoutonMenuHeaderNav from '@components/BoutonMenuHeaderNavigation';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { Match } from '@/types/interfaces/match';
import { Tournoi } from '@/types/interfaces/tournoi';
import { captureMessage } from '@sentry/react-native';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const TopTabScreens = () => {
  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );
  let nbTours = 5;
  if (listeMatchs !== undefined) {
    nbTours = listeMatchs.at(-1).nbTours;
  }
  let topTabScreenListe = [];
  for (let i = 0; i < nbTours; i++) {
    const name = 'Screen' + (i + 1) + 'Manche';
    topTabScreenListe.push(
      <TopTab.Screen
        key={i}
        name={name}
        options={{
          tabBarLabel: () => TopTabItemLabel(i + 1, listeMatchs),
        }}
      >
        {(props) => <ListeMatchs {...props} extraData={i + 1} />}
      </TopTab.Screen>,
    );
  }
  return topTabScreenListe;
};

const TopTabItemLabel = (numero: number, listeMatchs) => {
  let title = 'Tour ' + numero;
  if (listeMatchs && listeMatchs.at(-1).typeTournoi === TypeTournoi.COUPE) {
    title = listeMatchs.find((el) => el.manche === numero).mancheName;
  }

  let iconColor = '#ffda00';
  let iconName = 'battery-half';
  let matchsRestant = 0;
  if (listeMatchs) {
    let matchs: Match[] = listeMatchs.filter(
      (el: Match) => el.manche === numero,
    );
    matchsRestant = matchs.length;
    if (matchs) {
      let count = matchs.reduce(
        (acc, obj) =>
          obj.score1 !== undefined && obj.score2 !== undefined
            ? (acc += 1)
            : acc,
        0,
      );
      if (count === matchs.length) {
        iconColor = 'success-500';
        iconName = 'battery-full';
      } else if (count === 0) {
        iconColor = 'error-500';
        iconName = 'battery-empty';
      }
      matchsRestant -= count;
    }
  }

  return (
    <HStack className="items-center">
      <Text className="text-white text-lg mr-2">{title}</Text>
      <FontAwesome5 name={iconName} size={20} color={iconColor} />
      <Text className={`text-${iconColor} ml-0.5`} size="lg">
        {matchsRestant.toString()}
      </Text>
    </HStack>
  );
};

const ManchesTopTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <TopTab.Navigator
      initialRouteName="Screen1Manche"
      screenOptions={{
        title: t('liste_matchs_navigation_title'),
        tabBarScrollEnabled: true,
        tabBarStyle: { backgroundColor: '#0594ae' },
        tabBarIndicatorStyle: { backgroundColor: 'white' },
        //Code temporaire lié au BUG : https://github.com/nativewind/nativewind/issues/1039
        tabBarContentContainerStyle: {
          flexDirection: 'row',
          justifyContent: 'space-around',
        },
      }}
    >
      {TopTabScreens()}
    </TopTab.Navigator>
  );
};

const GetTournoiName = () => {
  const listeTournois = useSelector(
    (state: any) => state.listeTournois.listeTournois,
  );
  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  let tournoiName = '';
  if (listeTournois !== undefined && listeMatchs !== undefined) {
    let tournoiId = listeMatchs.at(-1).tournoiID;
    let tournoi = listeTournois.find(
      (element: Tournoi) => element.tournoiId === tournoiId,
    );
    if (tournoi) {
      tournoiName =
        tournoi.name !== undefined ? tournoi.name : 'n°' + tournoi.tournoiId;
    } else {
      captureMessage(`ID du tournoi : ${tournoiId}`, 'warning');
    }
  }
  return tournoiName;
};

export type MatchsStackParamList = {
  ListeMatchsStack: null;
  MatchDetailStack: { idMatch: number; match: Match; nbPtVictoire: number };
  ListeJoueur: null;
  ParametresTournoi: null;
  PDFExport: null;
};

const MatchsStack = () => {
  const { t } = useTranslation();
  let tournoiName = GetTournoiName();
  return (
    <Stack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: '#ffda00' } }}
    >
      <Stack.Screen
        name="ListeMatchsStack"
        component={ManchesTopTabNavigator}
        options={{
          title: '',
          headerStyle: { backgroundColor: '#0594ae', elevation: 0 },
          headerLeft: () => (
            <Text className="text-white text-xl ml-2">
              {t('tournoi')} {tournoiName}
            </Text>
          ),
          headerRight: () => <BoutonMenuHeaderNav />,
        }}
      />
      <Stack.Screen
        name="MatchDetailStack"
        component={MatchDetail}
        options={{
          title: t('detail_match_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ListeJoueur"
        component={JoueursTournoi}
        options={{
          title: t('liste_joueurs_inscrits_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ParametresTournoi"
        component={ParametresTournoi}
        options={{
          title: t('parametres_tournoi_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PDFExport"
        component={PDFExport}
        options={{
          title: t('exporter_pdf_navigation_title'),
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const ResultatsStack = () => {
  const { t } = useTranslation();
  let tournoiName = GetTournoiName();
  return (
    <Stack.Navigator
      screenOptions={{ title: t('resultats_classement_navigation_title') }}
    >
      <Stack.Screen
        name="ListeResultatsStack"
        component={ListeResultats}
        options={{
          headerTitle: '',
          headerStyle: { backgroundColor: '#0594ae', elevation: 0 },
          headerLeft: () => (
            <Text className="text-white text-xl ml-2">
              {t('tournoi')} {tournoiName}
            </Text>
          ),
          headerRight: () => <BoutonMenuHeaderNav />,
        }}
      />
    </Stack.Navigator>
  );
};

const MatchsResultatsBottomNavigator = () => {
  const { t } = useTranslation();
  return (
    <BottomTab.Navigator
      initialRouteName="ListeMatchsBottom"
      backBehavior="none"
      screenOptions={{
        title: '',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0594ae' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: { fontSize: 15 },
      }}
    >
      <BottomTab.Screen
        name="ListeResultatsBottom"
        component={ResultatsStack}
        options={{
          tabBarIcon: ({ color }) => {
            return <FontAwesome5 name="trophy" size={28} color={color} />;
          },
          title: t('resultats_classement_navigation_title'),
        }}
      />
      <BottomTab.Screen
        name="ListeMatchsBottom"
        component={MatchsStack}
        options={{
          tabBarIcon: ({ color }) => {
            return <FontAwesome5 name="bars" size={28} color={color} />;
          },
          title: t('matchs_details_navigation_title'),
        }}
      />
    </BottomTab.Navigator>
  );
};

export type InscriptionStackParamList = {
  ChoixTypeTournoi: null;
  ChoixModeTournoi: null;
  OptionsTournoi: { screenStackName: string };
  InscriptionsAvecNoms: null;
  InscriptionsSansNoms: null;
  ListeTerrains: { screenStackName: string };
  GenerationMatchs: { screenStackName: string };
  ListeMatchsInscription: { tournoiId: number; tournoi: Tournoi };
};

const InscriptionStack = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="ChoixTypeTournoi"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#ffda00' },
        headerTitleStyle: { color: '#1c3969' },
      }}
    >
      <Stack.Screen
        name="ChoixTypeTournoi"
        component={ChoixTypeTournoi}
        options={{ title: t('choix_type_tournoi'), headerShown: false }}
      />
      <Stack.Screen
        name="ChoixModeTournoi"
        component={ChoixModeTournoi}
        options={{ title: t('choix_mode_tournoi'), headerShown: false }}
      />
      <Stack.Screen
        name="OptionsTournoi"
        component={OptionsTournoi}
        options={{ title: t('choix_options_tournoi'), headerShown: false }}
      />
      <Stack.Screen
        name="InscriptionsAvecNoms"
        component={InscriptionsAvecNoms}
        options={{
          title: t('inscription_avec_noms_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InscriptionsSansNoms"
        component={InscriptionsSansNoms}
        options={{
          title: t('inscription_sans_noms_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ListeTerrains"
        component={ListeTerrains}
        options={{
          title: t('liste_terrains_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChoixComplement"
        component={ChoixComplement}
        options={{
          title: t('choix_complement_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GenerationMatchs"
        component={GenerationMatchs}
        options={{
          title: t('generation_matchs_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ListeMatchsInscription"
        component={ListeMatchsStack}
        options={{ title: '', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ParametresStack = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="Parametres"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#ffda00' },
        headerTitleStyle: { color: '#1c3969' },
      }}
    >
      <Stack.Screen
        name="Parametres"
        component={Parametres}
        options={{ title: t('parametres'), headerShown: false }}
      />
      <Stack.Screen
        name="Changelog"
        component={Changelog}
        options={{ title: t('Nouveautes'), headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export type ConnexionStackParamList = {
  Authentification: null;
  ConfirmationEmail: { email: string };
  Inscription: null;
  Compte: null;
};

const ConnexionStack = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="Authentification"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#ffda00' },
        headerTitleStyle: { color: '#1c3969' },
      }}
    >
      <Stack.Screen
        name="Authentification"
        component={Authentification}
        options={{ title: t('authentification'), headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmationEmail"
        component={ConfirmationEmail}
        options={{ title: t('confirmation_email'), headerShown: false }}
      />
      <Stack.Screen
        name="Inscription"
        component={Inscription}
        options={{ title: t('inscription'), headerShown: false }}
      />
      <Stack.Screen
        name="Compte"
        component={Compte}
        options={{ title: t('mon_compte'), headerShown: false }}
      />
      <Stack.Screen
        name="InfosPerso"
        component={InfosPerso}
        options={{ title: t('mon_compte'), headerShown: false }}
      />
      <Stack.Screen
        name="Securite"
        component={Securite}
        options={{ title: t('securite'), headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ListeMatchsStack = () => {
  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );
  let typeTournoi = TypeTournoi.MELEDEMELE;
  if (listeMatchs && listeMatchs.length > 0 && listeMatchs.at(-1).typeTournoi) {
    typeTournoi = listeMatchs.at(-1).typeTournoi;
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListeMatchsScreen"
        component={
          typeTournoi !== TypeTournoi.COUPE
            ? MatchsResultatsBottomNavigator
            : MatchsStack
        }
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export type GeneralStackParamList = {
  AccueilGeneral: null;
  Parametres: null;
  ListeTournois: null;
  ListesJoueurs: { loadListScreen: boolean };
  CreateListeJoueurs: { type: string; listId: number };
  InscriptionStack: null;
  ListeMatchsStack: null;
};

const General = () => {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="AccueilGeneral"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#ffda00' },
        headerTitleStyle: { color: '#1c3969' },
      }}
    >
      <Stack.Screen
        name="AccueilGeneral"
        component={Accueil}
        options={{ title: t('accueil'), headerShown: false }}
      />
      <Stack.Screen
        name="ConnexionStack"
        component={ConnexionStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ParametresStack"
        component={ParametresStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListeTournois"
        component={ListeTournois}
        options={{
          title: t('choix_tournoi_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ListesJoueurs"
        component={ListesJoueurs}
        options={{
          title: t('listes_joueurs_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateListeJoueurs"
        component={CreateListeJoueurs}
        options={{
          title: t('creation_liste_joueurs_navigation_title'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InscriptionStack"
        component={InscriptionStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListeMatchsStack"
        component={ListeMatchsStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Root">
      <Stack.Screen
        name="Root"
        component={General}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
