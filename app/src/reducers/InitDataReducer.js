import {
  INIT_FETCH_DATA_REQUEST,
  INIT_FETCH_DATA_DONE,
  INIT_FETCH_DATA_RESET
} from '../types/InitTypes.js';

import {
  AUTH_ERROR,
} from '../types/AuthTypes.js';

const INITIAL_DATA_STATE = {
  loading: null,
  dataLoaded: null
};

export const initData = (state = INITIAL_DATA_STATE, action) => {
  switch (action.type) {
    case INIT_FETCH_DATA_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        dataLoaded: false
      });
    case INIT_FETCH_DATA_DONE:
      return Object.assign({}, state, {
        loading: false,
        dataLoaded: true
      });
    case AUTH_ERROR:
    case INIT_FETCH_DATA_RESET:
      return INITIAL_DATA_STATE;
    default:
      return state;
  }
};
