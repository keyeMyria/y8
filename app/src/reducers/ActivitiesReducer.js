import _ from 'lodash';
import {
  ACTIVITIES_FETCH_REQUEST,
  ACTIVITIES_FETCH_SUCCESS,
  ACTIVITIES_FETCH_ERROR,
  ACTIVITIES_FETCH_RESET,

  ACTIVITY_ADD_REQUEST,
  ACTIVITY_ADD_SUCCESS,
  ACTIVITY_ADD_ERROR,
  ACTIVITY_ADD_RESET,

  ACTIVITY_UPDATE_REQUEST,
  ACTIVITY_UPDATE_SUCCESS,
  ACTIVITY_UPDATE_ERROR,
  ACTIVITY_UPDATE_RESET,

  ACTIVITY_DELETE_REQUEST,
  ACTIVITY_DELETE_SUCCESS,
  ACTIVITY_DELETE_ERROR,
  ACTIVITY_DELETE_RESET,
} from '../types/ActivityTypes';

import InitialActivities from '../data/activities_backup_4000.json';

const getActivities = (state, action) => {
  const newState = Object.assign({}, state);

  newState.error = null;
  newState.loading = false;
  newState.adding = null;
  newState.addingError = null;
  newState.updating = null;
  newState.updatingError = null;
  newState.deleting = null;
  newState.deletingError = null;

  // TODO: need to fix for it when offline

  //if (action.payload.allIds.length > 0) {
    newState.byId = { ...action.payload.byId, ...InitialActivities.byId };
    newState.allIds = [...action.payload.allIds, ...InitialActivities.allIds];
  // } else {
  //   newState.byId = { ...InitialActivities.byId };
  //   newState.allIds = [...InitialActivities.allIds];
  // }

  return Object.assign({}, newState);
};


const updateActivity = (state, action) => {
  const newState = Object.assign({}, state, {});
  const id = action.payload.activity.id;
  const activity = { ...newState.byId[id], ...action.payload.activity };

  const index = newState.allIds.indexOf(id);
  //console.log('index',index);
  newState.allIds = [...newState.allIds];
  newState.allIds.splice(index, 1);
  newState.allIds.unshift(id);

  return Object.assign({}, newState, {
    error: null,
    loading: false,
    updating: false,
    updatingError: null,
    byId: { ...newState.byId, [id]: activity },
    allIds: [...newState.allIds]
  });
};

const deleteActivity = (state, action) => {
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


const getActivitiesError = (state, action) => {
  console.log(action);
  const newState = Object.assign({}, state);
  if (_.isUndefined(action.payload)) {
    newState.error = 'Network error';
  } else {
    newState.error = 'TODO ERROR';
  }
  newState.loading = false;
  return Object.assign({}, newState);
};

const activitiesReset = (state, action) => {
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
const INITIAL_ACTIVITIES_STATE = {
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
export const activities = (state = INITIAL_ACTIVITIES_STATE, action) => {
  switch (action.type) {
    case ACTIVITIES_FETCH_REQUEST:
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
    case ACTIVITIES_FETCH_SUCCESS:
      return getActivities(state, action);
    case ACTIVITIES_FETCH_ERROR:
      return getActivitiesError(state, action);
    case ACTIVITY_ADD_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        adding: true,
        addingError: null,
      });
    case ACTIVITY_ADD_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        adding: false,
        addingError: null,
        byId: { ...action.payload.byId, ...state.byId },
        allIds: [...action.payload.allIds, ...state.allIds]
      });
    case ACTIVITY_ADD_ERROR:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        adding: false,
        addingError: action.payload
      });
    case ACTIVITY_UPDATE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        updating: true,
        updatingError: null,
      });
    case ACTIVITY_UPDATE_SUCCESS:
      return updateActivity(state, action);
    case ACTIVITY_UPDATE_ERROR:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        updating: false,
        updatingError: action.payload
      });
    case ACTIVITY_DELETE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        deleting: true,
        deletingError: null
      });
    case ACTIVITY_DELETE_SUCCESS:
      return deleteActivity(state, action);
    case ACTIVITY_DELETE_ERROR:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        deleting: false,
        deletingError: action.payload
      });
    case ACTIVITY_ADD_RESET:
    case ACTIVITY_UPDATE_RESET:
    case ACTIVITY_DELETE_RESET:
    case ACTIVITIES_FETCH_RESET:
      return activitiesReset(state, action);
    default:
      return state;
  }
};
