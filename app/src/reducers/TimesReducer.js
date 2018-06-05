import _ from 'lodash';
import {
  TIME_TOGGLE_REQUEST,
  TIME_TOGGLE_SUCCESS,
  TIME_TOGGLE_ERROR,
  TIME_TOGGLE_RESET,

  TIME_FETCH_REQUEST,
  TIME_FETCH_SUCCESS,
  TIME_FETCH_ERROR,
  TIME_FETCH_RESET,

} from '../types/TimeTypes.js';


const toggActivity = (state, action) => {
  const { activityId, groupId, isStart } = action.payload;
  const newState = Object.assign({}, state);

  //console.log(_.isEmpty(newState.byId[activityId]));
  if (_.isEmpty(newState.byActivityId[activityId])) {
    newState.byActivityId[activityId] = {};
  }
  if (_.isEmpty(newState.byActivityId[activityId][groupId])) {
    newState.byActivityId[activityId][groupId] = [];
  }
  const times = newState.byActivityId[activityId][groupId];

  if (!isStart) {
    times[0].stoppedAt = action.payload.stoppedAt;
  } else if (isStart) {
    times.unshift({ startedAt: action.payload.startedAt, stoppedAt: null });
  }

  return Object.assign({}, newState);
};


const startActivity = (state, action) => {
  // const { activityId, groupId, startedAt } = action.payload;
  // const newState = Object.assign({}, state);
  //
  // if (_.isEmpty(newState.byActivityId[activityId])) {
  //   newState.byActivityId[activityId] = {};
  // }
  // if (_.isEmpty(newState.byActivityId[activityId][groupId])) {
  //   newState.byActivityId[activityId][groupId] = [];
  // }
  // const { groupTimes } = newState.byActivityId[activityId][groupId];
  // groupTimes.unshift({ startedAt, stoppedAt: null });

  return Object.assign({}, state, {
    error: null,
    loading: false
  });
};

const stopActivity = (state, action) => {
  // const { activityId, groupId, stoppedAt } = action.payload;
  // const newState = Object.assign({}, state);
  //
  // if (_.isEmpty(newState.byActivityId[activityId])) {
  //   newState.byActivityId[activityId] = {};
  // }
  // if (_.isEmpty(newState.byActivityId[activityId][groupId])) {
  //   newState.byActivityId[activityId][groupId] = [];
  // }
  // const { groupTimes } = newState.byActivityId[activityId][groupId];
  // groupTimes[0].stoppedAt = stoppedAt;

  return Object.assign({}, state, {
    error: null,
    loading: false
  });
};

const toggleActivity = (state, action) => {
  const { startedAt, stoppedAt } = action.payload;
  if (!_.isUndefined(startedAt)) {
    return startActivity(state, action);
  } else if (!_.isUndefined(stoppedAt)) {
    return stopActivity(state, action);
  }
};

const INITIAL_TIMES_STATE = {
  error: null,
  loading: false,
};
export const times = (state = INITIAL_TIMES_STATE, action) => {
  switch (action.type) {
    case TIME_TOGGLE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: {
          activityId: action.payload.activityId,
          groupId: action.payload.groupId
        }
      });
    case TIME_TOGGLE_SUCCESS:
      return toggleActivity(state, action);
      //return toggActivity(state, action);
    case TIME_TOGGLE_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        loading: false
      });
    case TIME_TOGGLE_RESET:
      return Object.assign({}, state, {
        error: null,
        loading: false
      });
    default:
      return state;
  }
};
