// import _ from 'lodash';

import {
  USERS_FETCH_REQUEST,
  USERS_FETCH_SUCCESS,
  USERS_FETCH_ERROR,
  USERS_FETCH_RESET
} from '../types/FriendTypes';

const INITIAL_SEARCH_USER_STATE = {
  error: null,
  loading: false,
  data: []
};
export const users = (state = INITIAL_SEARCH_USER_STATE, action) => {
  switch (action.type) {
    case USERS_FETCH_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
      });
    case USERS_FETCH_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: { ...action.payload }
      });
    case USERS_FETCH_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        loading: false,
      });
    case USERS_FETCH_RESET:
      return Object.assign({}, state, {
        error: null,
        loading: false,
      });
    default:
      return state;
  }
};
