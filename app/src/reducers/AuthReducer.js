import _ from 'lodash';
import {
  AUTH_ERROR,
  AUTH_RESET,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_RESET_ERROR
} from '../types/AuthTypes.js';

const authError = (state, action) => {
  if (!_.isUndefined(action.payload) && action.payload.status === 401) {
    return Object.assign({}, state, {
      isAuthorized: false,
      loading: false,
      error: null
    });
  }
  return Object.assign({}, state, {
    isAuthorized: false,
    loading: false,
    error: action.payload
  });
};

const INITIAL_AUTH_STATE = {
  loading: false,
  isAuthorized: false,
  error: null
};
export const auth = (state = INITIAL_AUTH_STATE, action) => {
  switch (action.type) {
    case AUTH_RESET:
      return Object.assign({}, state, {
        isAuthorized: false,
        loading: false,
        error: null
      });
    case AUTH_REQUEST:
      return Object.assign({}, state, {
        //isAuthorized: false,
        loading: true,
        error: null
      });
    case AUTH_RESET_ERROR:
      return Object.assign({}, state, {
        error: null
      });
    case AUTH_SUCCESS:
      return Object.assign({}, state, {
        isAuthorized: true,
        loading: false,
        error: null
      });
    case AUTH_ERROR:
      return authError(state, action);
    default:
      return state;
  }
};
