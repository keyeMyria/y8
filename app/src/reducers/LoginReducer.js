import {
  LOGIN_ERROR,
  LOGIN_RESET,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ACTION_DONE,
  LOGIN_ACTION_RESET,
  LOGIN_ACTION_REQUEST
} from '../types/AuthTypes';

const INITIAL_LOGIN_STATE = {
  loading: false,
  isLoggedIn: false,
  error: null,
  loginLoding: false,
};
export const login = (state = INITIAL_LOGIN_STATE, action) => {
  switch (action.type) {
    case LOGIN_ACTION_REQUEST:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loading: false,
        error: null,
        loginLoding: true
      });
    case LOGIN_ACTION_DONE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loading: false,
        error: null,
        loginLoding: false
      });
    case LOGIN_ACTION_RESET:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loading: false,
        error: null,
        loginLoding: false
      });

    case LOGIN_RESET:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loading: false,
        error: null,
        loginLoding: false
      });
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loading: true,
        error: null,
      });
    case LOGIN_ERROR:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loading: false,
        error: action.payload,
        loginLoding: false
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        loading: false,
        error: null,
      });
    default:
      return state;
  }
};
