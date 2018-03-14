import _ from 'lodash';
import {
  TAGS_FETCH_REQUEST,
  TAGS_FETCH_SUCCESS,
  TAGS_FETCH_ERROR,
  TAGS_FETCH_RESET,

  TAG_ADD_REQUEST,
  TAG_ADD_SUCCESS,
  TAG_ADD_ERROR,
  TAG_ADD_RESET,

  TAG_UPDATE_REQUEST,
  TAG_UPDATE_SUCCESS,
  TAG_UPDATE_ERROR,
  TAG_UPDATE_RESET,

  TAG_DELETE_REQUEST,
  TAG_DELETE_SUCCESS,
  TAG_DELETE_ERROR,
  TAG_DELETE_RESET
} from '../types/TagTypes.js';

const getTags = (state, action) => {
  if (action.payload.allIds.length > 0) {
    return Object.assign({}, state, {
      error: null,
      loading: false,
      byId: { ...action.payload.byId },
      allIds: [...action.payload.allIds],
      adding: null,
      addingError: null,
      updating: null,
      updatingError: null,
      deleting: null,
      deletingError: null
    });
  }
  return Object.assign({}, state, {
    error: null,
    loading: false,
    byId: { ...state.byId },
    allIds: [...state.allIds],
    adding: null,
    addingError: null,
    updating: null,
    updatingError: null,
    deleting: null,
    deletingError: null
  });
};

const updateTag = (state, action) => {
  const newState = Object.assign({}, state, {});
  const id = action.payload.tag.id;
  const tag = { ...newState.byId[id], ...action.payload.tag };

  const index = newState.allIds.indexOf(id);
  newState.allIds = [...newState.allIds];
  newState.allIds.splice(index, 1);
  newState.allIds.unshift(id);

  return Object.assign({}, state, {
    error: null,
    loading: false,
    updating: false,
    updatingError: null,
    byId: { ...newState.byId, [id]: tag },
    allIds: [...newState.allIds]
  });
};

const deleteTag = (state, action) => {
  const { id } = action.payload;

  const newState = Object.assign({}, state);
  const index = newState.allIds.indexOf(id);
  newState.allIds = [...newState.allIds];
  newState.allIds.splice(index, 1);
  delete newState.byId[id];
  return Object.assign({}, newState, {
    error: null,
    loading: false,
    deleting: false,
    deletingError: null,
  });
};

const getTagsError = (state, action) => {
  const newState = Object.assign({}, state);
  if (_.isUndefined(action.payload)) {
    newState.error = 'Network error';
  } else {
    newState.error = 'TODO ERROR';
  }
  newState.loading = false;
  return Object.assign({}, newState);
};

const tagsReset = (state, action) => {
  return Object.assign({}, state, {
    error: null,
    loading: false,
    adding: null,
    addingError: null,
    updating: null,
    updatingError: null,
    deleting: null,
    deletingError: null,
  });
};

const INITIAL_TAGS_STATE = {
  error: null,
  loading: false,
  byId: {},
  allIds: [],
  adding: null,
  addingError: null,
  updating: null,
  updatingError: null,
  deleting: null,
  deletingError: null
};
export const tags = (state = INITIAL_TAGS_STATE, action) => {
  switch (action.type) {
    case TAGS_FETCH_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
        adding: null,
        addingError: null,
        updating: null,
        updatingError: null,
        deleting: null,
        deletingError: null
      });
    case TAGS_FETCH_SUCCESS:
      return getTags(state, action);
    case TAGS_FETCH_ERROR:
      return getTagsError(state, action);
    case TAG_ADD_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        adding: true,
        addingError: null,
      });
    case TAG_ADD_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        adding: false,
        addingError: null,
        byId: { ...action.payload.byId, ...state.byId },
        allIds: [...action.payload.allIds, ...state.allIds]
      });
    case TAG_ADD_ERROR:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        adding: false,
        addingError: action.payload
      });
    case TAG_UPDATE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        updating: true,
        updatingError: null,
      });
    case TAG_UPDATE_SUCCESS:
      return updateTag(state, action);
    case TAG_UPDATE_ERROR:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        updating: false,
        updatingError: action.payload
      });
    case TAG_DELETE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        deleting: true,
        deletingError: null
      });
    case TAG_DELETE_SUCCESS:
      return deleteTag(state, action);
    case TAG_DELETE_ERROR:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        deleting: false,
        deletingError: action.payload
      });
    case TAG_ADD_RESET:
    case TAG_UPDATE_RESET:
    case TAG_DELETE_RESET:
    case TAGS_FETCH_RESET:
      return tagsReset(state, action);
    default:
      return state;
  }
};
