import {
  CONNECTION_STATUS
} from '../types/ConnectionTypes.js';

const INITIAL_AUTH_STATE = {
  isConnected: true, //TODO
};
export const network = (state = INITIAL_AUTH_STATE, action) => {
  switch (action.type) {
    case CONNECTION_STATUS:
      return Object.assign({}, state, {
        isConnected: action.payload
      });
    default:
      return state;
  }
};
