import {
  SUBSCRIBE_REQUEST,
  SUBSCRIBE_SUCCESS,
  SUBSCRIBE_ERROR,
  SUBSCRIBE_RESET,

  UNSUBSCRIBE_RESET,
  UNSUBSCRIBE_REQUEST,
  UNSUBSCRIBE_SUCCESS,
  UNSUBSCRIBE_ERROR,
} from '../types/SubscribeTypes';

const INITIAL_SUBSCRIBE_STATE = {
  error: null,
  loading: false,
  subscribeId: null,
  subUserId: null,
  subscribed: false,
};
export const subscribe = (state = INITIAL_SUBSCRIBE_STATE, action) => {
  switch (action.type) {

    case UNSUBSCRIBE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
        subscribeId: null,
        subUserId: null,
        subscribed: false
      });
    case SUBSCRIBE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
        subscribeId: null,
        subUserId: null,
        subscribed: true
      });
    case UNSUBSCRIBE_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        subscribeId: null,
        subUserId: action.payload.subUserId,
        subscribed: action.payload.subscribed
      });
    case SUBSCRIBE_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        subscribeId: action.payload.subscribeId,
        subUserId: action.payload.subUserId,
        subscribed: action.payload.subscribed
      });
    case UNSUBSCRIBE_ERROR:
    case SUBSCRIBE_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
        subscribeId: null,
        subUserId: null,
        subscribed: false
      });
    case UNSUBSCRIBE_RESET:
    case SUBSCRIBE_RESET:
      return Object.assign({}, state, {
        loading: false,
        error: null,
      });
    default:
      return state;
  }
};
