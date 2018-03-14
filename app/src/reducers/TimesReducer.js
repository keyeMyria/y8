import _ from 'lodash';
import {
    TIME_TOGGLE_SUCCESS,
  } from '../types/TimeTypes.js';


const toggleActivity = (state, action) => {
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

// {
//   "activityId": {
//     "groupId": []
//   }
//}

const INITIAL_TIMES_STATE = {
  error: null,
  loading: false,
  byActivityId: {},
};
export const times = (state = INITIAL_TIMES_STATE, action) => {
  switch (action.type) {
    case TIME_TOGGLE_SUCCESS:
      return toggleActivity(state, action);
    default:
      return state;
  }
};
