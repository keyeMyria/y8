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
    'offlineQueue',
    'initData',
    'user',
    'friendRequests',
    'friends',
    'device',
    'subscribers',
    'onlygroups',
    'feed'
  ],
  debounce: 100,
  migrate: (state) => {
    //console.log('Migration Running!');
    if (!state) {
      return Promise.resolve(state);
    }
    // reset activities state every time on app launch
    const newActivitiesState = Object.assign({}, state.activities, {
      error: null,
      loading: false,
      adding: null,
      addingError: null,
      updating: null,
      updatingError: null,
      deleting: null,
      deletingError: null,
    });

    // reset tags state every time on app launch
    const newTagsState = Object.assign({}, state.tags, {
      error: null,
      loading: false,
      adding: null,
      addingError: null,
      updating: null,
      updatingError: null,
      deleting: null,
      deletingError: null,
    });

    // reset tags state every time on app launch
    const newMyActivitiesState = Object.assign({}, state.myActivities, {
      error: null,
      loading: false,
      byActivityId: {},
      allActivityIds: [],
      addingMyActivity: false,
      addingGroup: false,
      removingGroup: false,
      removingTag: false,
    });


    // reset tags state every time on app launch
    const newOfflineQueueState = Object.assign({}, state.offlineQueue, {
      error: null,
      syncing: false,
      //payloads: []
    });

    // reset tags state every time on app launch
    // const newInitDataState = Object.assign({}, state.initData, {
    //   //dataLoaded: false,
    //   loading: false
    // });

    const newTimesState = Object.assign({}, state.times, {
      error: null,
      loading: false
    });

    const newNetworkState = Object.assign({}, state.network, {
      isConnected: false
    });

    const newState = Object.assign({}, state, {
      activities: newActivitiesState,
      tags: newTagsState,
      myActivities: newMyActivitiesState,
      times: newTimesState,
      offlineQueue: newOfflineQueueState,
      //initData: newInitDataState,
      network: newNetworkState
    });

    // return migrated state
    return Promise.resolve(newState);
  }
};

const reducer = persistReducer(config, combineReducers(reducers));
//const reducer = persistCombineReducers(config, reducers);


const configureStore = () => {
  const store = createStore(
    reducer,
    {},
    compose(
      applyMiddleware(thunk, createLogger()),
      //applyMiddleware(thunk),
    )
  );
  return store;
  //const persistor = persistStore(store);//.purge();
  //persistor.purge();
  //console.log('onComplete: rehydration complete');
  //return { store, persistor };
};


export default configureStore;
