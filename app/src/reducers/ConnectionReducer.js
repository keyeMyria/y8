import {
  CONNECTION_STATUS
} from '../types/ConnectionTypes.js';

const INITIAL_CONNECTION_STATE = {
  isConnected: true, 
  offlineMode: false,

};
export const network = (state = INITIAL_CONNECTION_STATE, action) => {
  switch (action.type) {
    case CONNECTION_STATUS:
      return Object.assign({}, state, {
        isConnected: action.payload,
        offlineMode: action.payload
      });
    default:
      return state;
  }
};
