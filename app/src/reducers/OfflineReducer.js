import _ from 'lodash';
import {
  OFFLINE_REQUEST,
  OFFLINE_CLEAR,
  OFFLINE_DONE,
  OFFLINE_QUEUE,
  OFFLINE_RESET,
  OFFLINE_ERROR
} from '../types/OfflineTypes.js';


const addToQueue = (state, action) => {
  const newState = Object.assign({}, state);
  newState.syncing = false;
  newState.payloads.push(action.payload);
  return Object.assign({}, newState);
};

const clearQueue = (state, action) => {
  const newState = Object.assign({}, state);
  const UID = action.payload.UID;
  const index = _.findIndex(newState.payloads,
    o => o.UID.indexOf(UID) !== -1);
  newState.payloads.splice(index, 1);
  return Object.assign({}, newState);
};

/*const clearQueue = (state, action) => {
  const newState = Object.assign({}, state);
  const id = action.payload.data.id;
  const index = _.findIndex(newState.payloads,
    o => o.data.id.indexOf(id) !== -1);
  newState.payloads.splice(index, 1);
  return Object.assign({}, newState);
};*/

const INITIAL_OFFLINE_STATE = {
  error: null,
  syncing: false,
  payloads: []
};
export const offlineQueue = (state = INITIAL_OFFLINE_STATE, action) => {
  switch (action.type) {
    case OFFLINE_RESET:
      return Object.assign({}, state, {
        syncing: false,
        error: null
      });
    case OFFLINE_QUEUE:
      return addToQueue(state, action);
    case OFFLINE_REQUEST:
      return Object.assign({}, state, {
        syncing: true
      });
    case OFFLINE_CLEAR:
      return clearQueue(state, action);
    case OFFLINE_DONE:
      return Object.assign({}, state, {
        syncing: false,
        payloads: []
      });
    case OFFLINE_ERROR:
      return Object.assign({}, state, {
        syncing: false,
        error: action.payload
      });
    default:
      return state;
  }
};
