import _ from 'lodash';
import {
  //ACTIVITIES_FETCH_RESET,
  //ACTIVITIES_FETCH_REQUEST,

  //ACTIVITIES_FETCH_ERROR,
  MY_ACTIVITIES_FETCH_RESET,
  MY_ACTIVITIES_FETCH_SUCCESS,
  MY_ACTIVITIES_FETCH_ERROR,


  MY_ACTIVITY_GROUP_ADD_REQUEST,
  MY_ACTIVITY_GROUP_ADD_SUCCESS,
  MY_ACTIVITY_GROUP_ADD_ERROR,
  MY_ACTIVITY_GROUP_ADD_RESET,

  MY_ACTIVITY_ADD_REQUEST,
  MY_ACTIVITY_ADD_SUCCESS,
  MY_ACTIVITY_ADD_ERROR,
  MY_ACTIVITY_ADD_RESET,

  MY_ACTIVITY_REMOVE_GROUP_REQUEST,
  MY_ACTIVITY_REMOVE_GROUP_SUCCESS,
  MY_ACTIVITY_REMOVE_GROUP_ERROR,
  MY_ACTIVITY_REMOVE_GROUP_RESET,

  MY_ACTIVITY_REMOVE_TAG_REQUEST,
  MY_ACTIVITY_REMOVE_TAG_SUCCESS,
  MY_ACTIVITY_REMOVE_TAG_ERROR,
  MY_ACTIVITY_REMOVE_TAG_RESET,
} from '../types/MyActivityTypes.js';

import {
  ACTIVITY_DELETE_SUCCESS
} from '../types/ActivityTypes';

import {
  TAG_DELETE_SUCCESS
} from '../types/TagTypes';

import {
  TIME_TOGGLE_SUCCESS
} from '../types/TimeTypes';

const getMyActivities = (state, action) => {
  const { payload } = action;
  const newState = Object.assign({}, state);

  if (payload.allActivityIds.length !== 0) {
    newState.allActivityIds = payload.allActivityIds;
    newState.byActivityId = payload.byActivityId;
    newState.loading = false;
  }
  return Object.assign({}, newState);
};

const deleteActivityFromMyActivity = (state, action) => {
  const id = action.payload.id;
  const newState = Object.assign({}, state);
  const index = newState.allActivityIds.indexOf(action.payload.id);
  newState.allActivityIds.splice(index, 1);
  delete newState.byActivityId[id];
  return Object.assign({}, newState);
};

const addTagsGroupToMyActivity = (state, action) => {
  const newState = Object.assign({}, state);
  const { payload } = action;
  const activityId = Object.keys(payload.byActivityId)[0];
  const groupId = Object.keys(payload.byActivityId[activityId].byGroupId)[0];
  const tags = payload.byActivityId[activityId].byGroupId[groupId];
  const sortedTags = tags.sort();

  let isExists = false;
  let prevGroupId = '';
  if (!_.isEmpty(newState.byActivityId[activityId])) {
    const groups = newState.byActivityId[activityId].byGroupId;
    _.forEach(groups, (value, key) => {
        const oldSortedTags = value.sort();
        if (_.isEqual(oldSortedTags, sortedTags)) {
          isExists = true;
          prevGroupId = key;
        }
    });
  }
  let prevGroupsObjects = {};
  let prevGroupsArray = [];
  const newObject = {};

  if (!_.isEmpty(newState.byActivityId[activityId])) {
    prevGroupsObjects = newState.byActivityId[activityId].byGroupId;
    prevGroupsArray = newState.byActivityId[activityId].allGroupIds;
  }

  if (!isExists) {
    newObject.byActivityId = {
      [activityId]: {
        byGroupId: {
          ...prevGroupsObjects,
          ...payload.byActivityId[activityId].byGroupId
        },
        allGroupIds: [...payload.byActivityId[activityId].allGroupIds, ...prevGroupsArray]
      }
    };
  } else if (isExists && prevGroupId !== '') {
    const groupIdIndex = prevGroupsArray.indexOf(prevGroupId);
    prevGroupsArray.splice(groupIdIndex, 1);
    prevGroupsArray.unshift(prevGroupId);
  }

  newState.byActivityId = {
    ...newState.byActivityId,
    ...newObject.byActivityId
  };

  const index = newState.allActivityIds.indexOf(activityId);
  if (index !== -1) {
    newState.allActivityIds.splice(index, 1);
  }
  newState.allActivityIds = [...payload.allActivityIds, ...newState.allActivityIds];

  newState.addingMyActivity = false;
  return Object.assign({}, newState);
};

const deleteTagFromGroup = (state, action) => {
  const tagId = action.payload.id;
  const newState = Object.assign({}, state);

  _.forOwn(newState.byActivityId, (groups, activityId) => { // activityId
    _.forEach(groups.byGroupId, (tags, groupId) => { // groupId
        const index = tags.indexOf(tagId);
        if (index !== -1) {
          tags.splice(index, 1);
        }
        if (tags.length === 0) {
          const groupIndex = groups.allGroupIds.indexOf(groupId);
          if (groupIndex !== -1) {
            groups.allGroupIds.splice(groupIndex, 1);
          }
          //TODO
          delete groups.byGroupId[groupId]; // need to config eslist to disable error
        }
    });
    if (groups.allGroupIds.length === 0) {
      delete newState.byActivityId[activityId];
      const activityIndex = newState.allActivityIds.indexOf(activityId);
      if (activityIndex !== -1) {
        newState.allActivityIds.splice(activityIndex, 1);
      }
    }
  });
  return Object.assign({}, newState);
};

const removeTagFromGroup = (state, action) => {
  const { activityId, groupId, tagId } = action.payload;
  const newState = Object.assign({}, state);
  const index = newState.byActivityId[activityId].byGroupId[groupId].indexOf(tagId);
  if (index !== -1) {
    // delete tag from group
    newState.byActivityId[activityId].byGroupId[groupId].splice(index, 1);
    // if group tags length is zero then delete group & groupId from array
    if (newState.byActivityId[activityId].byGroupId[groupId].length === 0) {
      delete newState.byActivityId[activityId].byGroupId[groupId];
      const groupIndex = newState.byActivityId[activityId].allGroupIds.indexOf(groupId);
      if (groupIndex !== -1) {
        newState.byActivityId[activityId].allGroupIds.splice(groupIndex, 1);
      }
      // if activities length is zero, then remove activity
      if (newState.byActivityId[activityId].allGroupIds.length === 0) {
        delete newState.byActivityId[activityId];
        const activityIndex = newState.allActivityIds.indexOf(activityId);
        if (activityIndex !== -1) {
          newState.allActivityIds.splice(activityIndex, 1);
        }
      }
    }
  }
  newState.removingTag = false;
  return Object.assign({}, newState);
};

const removeGroupFromActivity = (state, action) => {
  const { activityId, groupId } = action.payload;
  const newState = Object.assign({}, state);
  delete newState.byActivityId[activityId].byGroupId[groupId];

  const groupIndex = newState.byActivityId[activityId].allGroupIds.indexOf(groupId);
  if (groupIndex !== -1) {
    newState.byActivityId[activityId].allGroupIds.splice(groupIndex, 1);
  }
  // if activities length is zero, then remove activity
  if (newState.byActivityId[activityId].allGroupIds.length === 0) {
    delete newState.byActivityId[activityId];
    const activityIndex = newState.allActivityIds.indexOf(activityId);
    if (activityIndex !== -1) {
      newState.allActivityIds.splice(activityIndex, 1);
    }
  }
  newState.removingGroup = false;
  return Object.assign({}, newState);
};

const addGroupToMyActivity = (state, action) => {
  const { activityId, groupId } = action.payload;
  const newState = Object.assign({}, state);
  const groupIndex = newState.byActivityId[activityId].allGroupIds.indexOf(groupId);
  if (groupIndex !== -1) {
    newState.byActivityId[activityId].allGroupIds.splice(groupIndex, 1);
    newState.byActivityId[activityId].allGroupIds.unshift(groupId);
  }

  const activityIndex = newState.allActivityIds.indexOf(activityId);
  if (activityIndex !== -1) {
    newState.allActivityIds.splice(activityIndex, 1);
    newState.allActivityIds.unshift(activityId);
  }
  newState.addingGroup = false;
  return Object.assign({}, newState);
};

const moveActivity = (state, action) => {
  const { activityId, isStart, newIndex } = action.payload;
  const newState = Object.assign({}, state);
  const activityIndex = newState.allActivityIds.indexOf(activityId);
  if (activityIndex !== -1) {
    newState.allActivityIds.splice(activityIndex, 1);
  }
  if (isStart) {
    newState.allActivityIds.unshift(activityId);
  } else {
    newState.allActivityIds.splice(newIndex, 0, activityId);
  }
  newState.addingGroup = false;
  return Object.assign({}, newState);
};

const getMyActivitiesError = (state, action) => {
  console.log(action);
  const newState = Object.assign({}, state);
  if (_.isUndefined(action.payload)) {
    newState.error = 'Network error';
  } else {
    newState.error = 'TODO ERROR';
  }
  console.log(newState);
  return Object.assign({}, newState);
};

const getMyActivitiesReset = (state, action) => {
  const newState = Object.assign({}, state);
  newState.error = null;
  return Object.assign({}, newState);
};

const INITIAL_MY_ACTIVITIES_STATE = {
  error: null,
  loading: false,
  addingMyActivity: false,
  addingGroup: false,
  removingGroup: false,
  removingTag: false,
  byActivityId: {},
  allActivityIds: [],
};
export const myActivities = (state = INITIAL_MY_ACTIVITIES_STATE, action) => {
  switch (action.type) {
    case MY_ACTIVITIES_FETCH_RESET:
      return getMyActivitiesReset(state, action);
    case MY_ACTIVITIES_FETCH_SUCCESS:
      return getMyActivities(state, action);
    case MY_ACTIVITIES_FETCH_ERROR:
      return getMyActivitiesError(state, action);

    case MY_ACTIVITY_ADD_REQUEST:
      return Object.assign({}, state, {
        addingMyActivity: true,
        error: null
      });
    case MY_ACTIVITY_ADD_SUCCESS:
      return addTagsGroupToMyActivity(state, action);
    case MY_ACTIVITY_ADD_ERROR:
      return Object.assign({}, state, {
        addingMyActivity: false,
        error: action.payload
      });
    case MY_ACTIVITY_ADD_RESET:
      return Object.assign({}, state, {
        addingMyActivity: false,
        error: null
      });
    case TAG_DELETE_SUCCESS:
      return deleteTagFromGroup(state, action);
    case ACTIVITY_DELETE_SUCCESS:
      return deleteActivityFromMyActivity(state, action);

    case MY_ACTIVITY_REMOVE_TAG_REQUEST:
      return Object.assign({}, state, {
        addingGroup: false,
        removingTag: true,
        error: null
      });
    case MY_ACTIVITY_REMOVE_TAG_SUCCESS:
      return removeTagFromGroup(state, action);
    case MY_ACTIVITY_REMOVE_TAG_ERROR:
      return Object.assign({}, state, {
        removingTag: false,
        error: action.payload
      });
    case MY_ACTIVITY_REMOVE_TAG_RESET:
      return Object.assign({}, state, {
        removingTag: false,
        error: null
      });

    case MY_ACTIVITY_REMOVE_GROUP_REQUEST:
      return Object.assign({}, state, {
        removingGroup: true,
        error: null
      });
    case MY_ACTIVITY_REMOVE_GROUP_SUCCESS:
      return removeGroupFromActivity(state, action);
    case MY_ACTIVITY_REMOVE_GROUP_ERROR:
      return Object.assign({}, state, {
        removingGroup: false,
        error: action.payload
      });
    case MY_ACTIVITY_REMOVE_GROUP_RESET:
      return Object.assign({}, state, {
        removingGroup: false,
        error: null
      });

    case MY_ACTIVITY_GROUP_ADD_REQUEST:
      return Object.assign({}, state, {
        addingGroup: true,
        error: null
      });
    case MY_ACTIVITY_GROUP_ADD_SUCCESS:
      return addGroupToMyActivity(state, action);
    case MY_ACTIVITY_GROUP_ADD_ERROR:
      return Object.assign({}, state, {
        addingGroup: false,
        error: action.payload
      });
    case MY_ACTIVITY_GROUP_ADD_RESET:
      return Object.assign({}, state, {
        addingGroup: false,
        error: null
      });
    case TIME_TOGGLE_SUCCESS:
      return moveActivity(state, action);
    default:
      return state;
  }
};
