//import _ from 'lodash';
import {
  STATS_FETCH_REQUEST,
  STATS_FETCH_SUCCESS,
  STATS_FETCH_ERROR,
} from '../types/StatsTypes';

const INITIAL_STATS_STATE = {
  error: null,
  loading: false,
  activityId: null,
  maxNoOfTimes: 0,
  tagIds: [],
  totalMilliSecs: 0
};
export const stats = (state = INITIAL_STATS_STATE, action) => {
  switch (action.type) {
    case STATS_FETCH_REQUEST:
      return INITIAL_STATS_STATE;
    case STATS_FETCH_SUCCESS:
      console.log('STATS_FETCH_SUCCESS', action);
      return Object.assign({}, state, {
        error: null,
        loading: false,
        activityId: action.payload.activityId,
        maxNoOfTimes: action.payload.maxNoOfTimes,
        tagIds: action.payload.tagIds,
        totalMilliSecs: action.payload.totalMilliSecs
      });
    case STATS_FETCH_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        loading: false,
      });
    default:
      return state;
  }
};
