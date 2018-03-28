import {
  SUBSCRIBERS_FETCH_REQUEST,
  SUBSCRIBERS_FETCH_SUCCESS,
  SUBSCRIBERS_FETCH_ERROR,
  SUBSCRIBERS_FETCH_RESET,

} from '../types/SubscribeTypes';

const INITIAL_SUBSCRIBERS_STATE = {
  error: null,
  loading: false,
  data: []
};
export const subscribers = (state = INITIAL_SUBSCRIBERS_STATE, action) => {
  switch (action.type) {

    case SUBSCRIBERS_FETCH_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
      });
    case SUBSCRIBERS_FETCH_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: { ...action.payload }
      });
    case SUBSCRIBERS_FETCH_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      });
    case SUBSCRIBERS_FETCH_RESET:
      return Object.assign({}, state, {
        loading: false,
        error: null,
      });
    default:
      return state;
  }
};
