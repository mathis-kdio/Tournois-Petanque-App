// Store/configureStore.js

import { createStore } from 'redux'
import toggleJoueur from './reducers/joueurReducer'
import gestionMatchs from './reducers/matchsReducer'
import { persistCombineReducers } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

export default createStore(persistCombineReducers(rootPersistConfig, {toggleJoueur, gestionMatchs}))