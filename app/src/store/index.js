import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createMigrate, persistStore, persistReducer, persistCombineReducers } from 'redux-persist';
import { Platform } from 'react-native';
import storage from 'redux-persist/es/storage';
import reducers from '../reducers';
//import activities from '../data/activities_backup_4000.json';

/*const migrations = {
  0: (state) => {
    // migration clear out device state
    console.log('migrations:****************');
    console.log(state);
    return {
      ...state,
      activities: Object.assign({}, state.activities, {
        hello: true
      }),
    }
  }
};*/

const config = {
  key: 'root',
  storage,
  whitelist: [
    'app',
    'dashboard',
    'activities',
    'tags',
    'myActivities',
    'times',
    'offlineQueue'
  ],
  debounce: 100,
};

const reducer = persistReducer(config, combineReducers(reducers));
//const reducer = persistCombineReducers(config, reducers);


const configureStore = () => {
  const store = createStore(
    reducer,
    {},
    compose(
      //applyMiddleware(thunk, createLogger()),
      applyMiddleware(thunk),
    )
  );
  return store;
  //const persistor = persistStore(store);//.purge();
  //persistor.purge();
  //console.log('onComplete: rehydration complete');
  //return { store, persistor };
};


export default configureStore;
