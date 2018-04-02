import _ from 'lodash';
import {
  SHARES_FETCH_REQUEST,
  SHARES_FETCH_SUCCESS,
  SHARES_FETCH_ERROR,
  SHARES_FETCH_RESET,

  SHARE_ADD_SUCCESS,
  SHARE_REMOVE_SUCCESS

} from '../types/ShareTypes';

const removeShareById = (state, action) => {
  const newState = Object.assign({}, state);
  const rows = [...newState.data.rows];
  _.pullAllBy(rows, [{ id: action.payload.shareId }], 'id');

  newState.data.rows = rows;
  return Object.assign({}, newState);
};

const addShare = (state, action) => {
  const newState = Object.assign({}, state);
  const rows = [...newState.data.rows];
  rows.unshift({
    id: action.payload.shareId,
    sharedWith: action.payload.sharedWithObj
  });
  newState.data.rows = rows;
  return Object.assign({}, newState);
};

const INITIAL_SHARES_STATE = {
  error: null,
  loading: false,
  data: []
};
export const shares = (state = INITIAL_SHARES_STATE, action) => {
  switch (action.type) {

    case SHARE_ADD_SUCCESS:
      return addShare(state, action);
    case SHARE_REMOVE_SUCCESS:
      return removeShareById(state, action);
    case SHARES_FETCH_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
      });
    case SHARES_FETCH_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: { ...action.payload }
      });
    case SHARES_FETCH_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      });
    case SHARES_FETCH_RESET:
      return Object.assign({}, state, {
        loading: false,
        error: null,
      });
    default:
      return state;
  }
};
