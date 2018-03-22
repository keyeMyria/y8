import {
  FRIEND_REQUEST_REQUEST,
  FRIEND_REQUEST_SUCCESS,
  FRIEND_REQUEST_ERROR,
  FRIEND_REQUEST_RESET,

  FRIEND_ACCEPT_REQUEST,
  FRIEND_ACCEPT_SUCCESS,
  FRIEND_ACCEPT_ERROR,
  FRIEND_ACCEPT_RESET
} from '../types/FriendTypes';

const INITIAL_FRIEND_STATE = {
  error: null,
  sendLoading: false,
};
export const friendActions = (state = INITIAL_FRIEND_STATE, action) => {
  switch (action.type) {
    case FRIEND_REQUEST_REQUEST:
      return Object.assign({}, state, {
        error: null,
        sendLoading: true,
      });
    case FRIEND_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        sendLoading: false,
      });
    case FRIEND_REQUEST_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        sendLoading: false,
      });
    case FRIEND_REQUEST_RESET:
      return Object.assign({}, state, {
        error: null,
        sendLoading: false,
      });

    case FRIEND_ACCEPT_REQUEST:
      return Object.assign({}, state, {
        error: null,
        acceptLoading: true,
      });
    case FRIEND_ACCEPT_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        acceptLoading: false,
      });
    case FRIEND_ACCEPT_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        acceptLoading: false,
      });
    case FRIEND_ACCEPT_RESET:
      return Object.assign({}, state, {
        error: null,
        acceptLoading: false,
      });
    default:
      return state;
  }
};
