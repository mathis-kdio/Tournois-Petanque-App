import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createStore } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import listesJoueurs from './reducers/listesJoueursReducer';
import gestionMatchs from './reducers/matchsReducer';
import optionsTournoi from './reducers/optionsTournoiReducer';
import listeTerrains from './reducers/terrainsReducer';
import listeTournois from './reducers/tournoisReducer';

const noopWebStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

const storage =
  Platform.OS === 'web'
    ? typeof window === 'undefined'
      ? noopWebStorage
      : createWebStorage('local')
    : AsyncStorage;

const rootPersistConfig = {
  key: 'root',
  storage,
};

export const store = createStore(
  persistCombineReducers(rootPersistConfig, {
    listesJoueurs,
    gestionMatchs,
    listeTerrains,
    listeTournois,
    optionsTournoi,
  }),
);

export type RootState = ReturnType<typeof store.getState>;

export default store;
