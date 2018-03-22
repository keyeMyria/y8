import _ from 'lodash';

import {
  FRIEND_GET_REQUESTS_REQUEST,
  FRIEND_GET_REQUESTS_SUCCESS,
  FRIEND_GET_REQUESTS_ERROR,
  FRIEND_GET_REQUESTS_RESET,

  FRIEND_ACCEPT_SUCCESS
} from '../types/FriendTypes';

const removeRequestFromList = (state, action) => {
  const newState = Object.assign({}, state);
  const { id } = action.payload;
  //newState.data.rows = [...newState.data.rows];
  _.remove(newState.data.rows, { id });
  return Object.assign({}, newState);
};


const INITIAL_FRIEND_REQUESTS_STATE = {
  error: null,
  loading: false,
  data: []
};
export const friendRequests = (state = INITIAL_FRIEND_REQUESTS_STATE, action) => {
  switch (action.type) {
    case FRIEND_ACCEPT_SUCCESS:
      return removeRequestFromList(state, action);
    case FRIEND_GET_REQUESTS_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
      });
    case FRIEND_GET_REQUESTS_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: { ...action.payload }
      });
    case FRIEND_GET_REQUESTS_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        loading: false,
      });
    case FRIEND_GET_REQUESTS_RESET:
      return Object.assign({}, state, {
        error: null,
        loading: false,
      });
    default:
      return state;
  }
};
