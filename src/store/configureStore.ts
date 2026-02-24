import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import listesJoueurs from './reducers/listesJoueursReducer';
import gestionMatchs from './reducers/matchsReducer';
import optionsTournoi from './reducers/optionsTournoiReducer';
import listeTerrains from './reducers/terrainsReducer';
import listeTournois from './reducers/tournoisReducer';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

export default createStore(
  persistCombineReducers(rootPersistConfig, {
    listesJoueurs,
    gestionMatchs,
    listeTerrains,
    listeTournois,
    optionsTournoi,
  }),
);
