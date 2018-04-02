import {
  SHARE_ADD_REQUEST,
  SHARE_ADD_SUCCESS,
  SHARE_ADD_ERROR,
  SHARE_ADD_RESET,

  SHARE_REMOVE_RESET,
  SHARE_REMOVE_REQUEST,
  SHARE_REMOVE_SUCCESS,
  SHARE_REMOVE_ERROR,
} from '../types/ShareTypes';

const INITIAL_SHARE_STATE = {
  error: null,
  loading: false,
  sharedWith: null,
  shareId: null,
  unshareDone: false
};
export const share = (state = INITIAL_SHARE_STATE, action) => {
  switch (action.type) {

    case SHARE_REMOVE_REQUEST:
    case SHARE_ADD_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
        sharedWith: null,
        shareId: null,
        unshareDone: false
      });
    case SHARE_REMOVE_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        sharedWith: action.payload.sharedWith,
        shareId: null,
        unshareDone: action.payload.unshareDone
      });
    case SHARE_ADD_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        sharedWith: action.payload.sharedWith,
        shareId: action.payload.shareId,
        unshareDone: false
      });
    case SHARE_REMOVE_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.payload.error,
        sharedWith: action.payload.sharedWith,
        shareId: null,
        unshareDone: false
      });
    case SHARE_ADD_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.payload.error,
        sharedWith: action.payload.sharedWith,
        shareId: action.payload.shareId,
        unshareDone: false
      });
    case SHARE_REMOVE_RESET:
    case SHARE_ADD_RESET:
      return Object.assign({}, state, {
        loading: false,
        error: null,
      });
    default:
      return state;
  }
};
