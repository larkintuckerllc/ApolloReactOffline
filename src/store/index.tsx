import AsyncStorage from '@react-native-community/async-storage';
import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import reducer from './ducks/';

interface MyWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__?: any;
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['trackedQueries'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(
  persistedReducer,
  (window as MyWindow).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as MyWindow).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

export const persistor = persistStore(store);
