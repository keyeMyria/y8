import _ from 'lodash';
import {
  GROUP_FETCH_REQUEST,
  GROUP_FETCH_SUCCESS,
  GROUP_FETCH_ERROR,
  GROUP_FETCH_RESET,


  GROUP_GROUP_ADD_REQUEST,
  GROUP_GROUP_ADD_SUCCESS,
  GROUP_GROUP_ADD_ERROR,
  GROUP_GROUP_ADD_RESET,

  GROUP_ADD_REQUEST,
  GROUP_ADD_SUCCESS,
  GROUP_ADD_ERROR,
  GROUP_ADD_RESET,

  GROUP_REMOVE_GROUP_REQUEST,
  GROUP_REMOVE_GROUP_SUCCESS,
  GROUP_REMOVE_GROUP_ERROR,
  GROUP_REMOVE_GROUP_RESET,

  GROUP_REMOVE_TAG_REQUEST,
  GROUP_REMOVE_TAG_SUCCESS,
  GROUP_REMOVE_TAG_ERROR,
  GROUP_REMOVE_TAG_RESET,

} from '../types/GroupTypes.js';

import {
  ACTIVITY_DELETE_SUCCESS
} from '../types/ActivityTypes';

import {
  TAG_DELETE_SUCCESS
} from '../types/TagTypes';

import {
  TIME_TOGGLE_SUCCESS
} from '../types/TimeTypes';

import {
  UPDATE_SHARE_COUNT
} from '../types/ShareTypes';

const getMyActivities = (state, action) => {
  const { payload, count, offset, limit, page, totalPages } = action;
  const newState = Object.assign({}, state);


  newState.byActivityId = {
    ...payload.byActivityId,
    ...newState.byActivityId
  };

  if (page === 1) {
    newState.allActivityIds = [
      ...new Set(
        [
          ...payload.allActivityIds,
          ...newState.allActivityIds
        ]
      )
    ];
  } else {
    newState.allActivityIds = [
      ...new Set(
        [
          ...newState.allActivityIds,
          ...payload.allActivityIds
        ]
      )
    ];
  }

  if (count === 0) {
    newState.allActivityIds = [];
    newState.byActivityId = {};
  }


  newState.count = count;
  newState.offset = offset;
  newState.limit = limit;
  newState.page = page;
  newState.totalPages = totalPages;

  newState.refreshing = false;
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
  console.log('addTagsGroupToMyActivity', newState);

  const { payload } = action;
  const activityId = Object.keys(payload.byActivityId)[0];
  const groupId = Object.keys(payload.byActivityId[activityId].byGroupId)[0];
  const { tagsGroup } = payload.byActivityId[activityId].byGroupId[groupId];
  const sortedTags = tagsGroup.sort();

  if (!_.isEmpty(newState.byActivityId[activityId])) {
    // check if tags already exists for this activity
    let isExists = false;
    let currentGroupId = null;
    const groups = newState.byActivityId[activityId].byGroupId;
    _.forEach(groups, (value, key) => {
        const oldSortedTags = value.tagsGroup.sort();
        if (_.isEqual(oldSortedTags, sortedTags)) {
          isExists = true;
          currentGroupId = key;
        }
    });

    // if tags set is already exists, then pull activity to the top and return
    if (isExists) {
      // put groupId to 0 index
      const groupIndex = newState.byActivityId[activityId].allGroupIds.indexOf(currentGroupId);
      if (groupIndex !== -1) {
        newState.byActivityId[activityId].allGroupIds.splice(groupIndex, 1);
      }
      newState.byActivityId[activityId].allGroupIds = [
        currentGroupId,
        ...newState.byActivityId[activityId].allGroupIds
      ];

      // pull activityId to 0 index
      const activityIdIndex = newState.allActivityIds.indexOf(activityId);
      if (activityIdIndex !== -1) {
        newState.allActivityIds.splice(activityIdIndex, 1);
      }
      newState.allActivityIds = [activityId, ...newState.allActivityIds];
      newState.addingMyActivity = false;
      return Object.assign({}, newState);
    }
  }

  const newObject = {};
  if (_.isNil(newState.byActivityId[activityId])) {
    newState.byActivityId[activityId] = {};
    if (_.isNil(newState.byActivityId[activityId].byGroupId)) {
      newState.byActivityId[activityId].byGroupId = {};
    }
    if (_.isNil(newState.byActivityId[activityId].allGroupIds)) {
      newState.byActivityId[activityId].allGroupIds = [];
    }
  }
  newObject.byActivityId = {
    [activityId]: {
      byGroupId: {
        ...newState.byActivityId[activityId].byGroupId,
        ...payload.byActivityId[activityId].byGroupId
      },
      allGroupIds: [ // make unique array
        ...new Set(
          [
            ...payload.byActivityId[activityId].allGroupIds,
            ...newState.byActivityId[activityId].allGroupIds
          ]
        )
      ]
    }
  };

  newState.byActivityId = {
    ...newState.byActivityId,
    ...newObject.byActivityId
  };

  const index = newState.allActivityIds.indexOf(activityId);
  if (index !== -1) {
    newState.allActivityIds.splice(index, 1);
  }
  newState.allActivityIds = [activityId, ...newState.allActivityIds];

  newState.addingMyActivity = false;
  return Object.assign({}, newState);
};

const addTagsGroupToMyActivity1 = (state, action) => {
  const newState = Object.assign({}, state);

  // const myactivity = {
  //   byActivityId: {
  //     [activityId]: {
  //       byGroupId: {
  //         [groupId]: { tagsGroup: tags },
  //       },
  //       allGroupIds: [groupId]
  //     }
  //   },
  //   allActivityIds: [activityId]
  // };

  const { payload } = action;
  const activityId = Object.keys(payload.byActivityId)[0];
  const groupId = Object.keys(payload.byActivityId[activityId].byGroupId)[0];
  const { tagsGroup } = payload.byActivityId[activityId].byGroupId[groupId];
  const sortedTags = tagsGroup.sort();


  // const { payload } = action;
  // const activityId = Object.keys(payload.byActivityId)[0];
  // const groupId = Object.keys(payload.byActivityId[activityId].byGroupId)[0];
  // const { tagsGroup } = payload.byActivityId[activityId].byGroupId[groupId];
  //const sortedTags = tagsGroup.sort();

  // let isExists = false;
  // let prevGroupId = '';
  // if (!_.isEmpty(newState.byActivityId[activityId])) {
  //   const groups = newState.byActivityId[activityId].byGroupId;
  //   _.forEach(groups, (value, key) => {
  //       const oldSortedTags = value.tagsGroup.sort();
  //       if (_.isEqual(oldSortedTags, sortedTags)) {
  //         isExists = true;
  //         prevGroupId = key;
  //       }
  //   });
  // }

  // let prevGroupsObjects = {};
  // let prevGroupsArray = [];
  // const newObject = {};
  //
  // if (!_.isEmpty(newState.byActivityId[activityId])) {
  //   prevGroupsObjects = newState.byActivityId[activityId].byGroupId;
  //   prevGroupsArray = newState.byActivityId[activityId].allGroupIds;
  // }
  const newObject = {};
  //if (!isExists) {
    newObject.byActivityId = {
      [activityId]: {
        byGroupId: {
          ...payload.byActivityId[activityId].byGroupId
        },
        allGroupIds: [...payload.byActivityId[activityId].allGroupIds]
      }
    };
  // } else if (isExists && prevGroupId !== '') {
  //   const groupIdIndex = prevGroupsArray.indexOf(prevGroupId);
  //   prevGroupsArray.splice(groupIdIndex, 1);
  //   prevGroupsArray.unshift(prevGroupId);
  // }

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
        const { tagsGroup } = tags;
        const index = tagsGroup.indexOf(tagId);
        if (index !== -1) {
          tagsGroup.splice(index, 1);
        }
        if (tagsGroup.length === 0) {
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

  if (_.isNil(newState.byActivityId[activityId].byGroupId[groupId])) {
    return newState;
  }

  const { tagsGroup } = newState.byActivityId[activityId].byGroupId[groupId];
  const index = tagsGroup.indexOf(tagId);
  if (index !== -1) {
    // delete tag from group
    newState.byActivityId[activityId].byGroupId[groupId].tagsGroup.splice(index, 1);
    // if group tags length is zero then delete group & groupId from array
    if (newState.byActivityId[activityId].byGroupId[groupId].tagsGroup.length === 0) {
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
  newState.removingTag = { loading: false, groupId };
  return Object.assign({}, newState);
};

const removeGroupFromActivity = (state, action) => {
  const { activityId, groupId } = action.payload;
  const newState = Object.assign({}, state);

  if (!_.isNil(newState.byActivityId[activityId].byGroupId[groupId])) {
    delete newState.byActivityId[activityId].byGroupId[groupId];
  }


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

  newState.removingGroup = { loading: false, groupId };
  return Object.assign({}, newState);
};

const addGroupToMyActivity = (state, action) => {
  const { activityId, groupId } = action.payload;
  const newState = Object.assign({}, state);

  // const groupIndex = newState.byActivityId[activityId].allGroupIds.indexOf(groupId);
  // if (groupIndex !== -1) {
  //   newState.byActivityId[activityId].allGroupIds.splice(groupIndex, 1);
  //   newState.byActivityId[activityId].allGroupIds.unshift(groupId);
  // }

  /*if (!_.isNil(tagsGroup)) {
    newState.byActivityId[activityId].allGroupIds[0] = groupId;
    if (_.isNil(newState.byActivityId[activityId].byGroupId[groupId])) {
      newState.byActivityId[activityId].byGroupId[groupId] = {};
    }
    newState.byActivityId[activityId].byGroupId[groupId].tagsGroup = tagsGroup;
    //newState.byActivityId[activityId].byGroupId[gId].groupTimes = [action.payload.groupTimes];
  }*/

  const activityIndex = newState.allActivityIds.indexOf(activityId);
  if (activityIndex !== -1) {
    newState.allActivityIds.splice(activityIndex, 1);
    newState.allActivityIds.unshift(activityId);
  }

  const groupIndex = newState.byActivityId[activityId].allGroupIds.indexOf(groupId);
  if (groupIndex !== -1) {
    newState.byActivityId[activityId].allGroupIds.splice(groupIndex, 1);
    newState.byActivityId[activityId].allGroupIds.unshift(groupId);
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

const updateTimeForActivity = (state, action) => {
  const newState = Object.assign({}, state);
  const { id, activityId, groupId, startedAt, stoppedAt, isStart, newIndex } = action.payload;

  const activityIndex = newState.allActivityIds.indexOf(activityId);
  if (activityIndex !== -1) {
    newState.allActivityIds.splice(activityIndex, 1);
  }
  if (isStart) {
    newState.allActivityIds.unshift(activityId);
  } else {
    newState.allActivityIds.splice(newIndex, 0, activityId);
  }

  if (_.isNil(newState.byActivityId[activityId].byGroupId[groupId])) {
    newState.byActivityId[activityId].byGroupId[groupId] = {};
  }

  if (_.isNil(newState.byActivityId[activityId].byGroupId[groupId].groupTimes)) {
    newState.byActivityId[activityId].byGroupId[groupId].groupTimes = [];
  }

  if (_.isNil(newState.byActivityId[activityId].byGroupId[groupId].groupTimes[0])) {
    newState.byActivityId[activityId].byGroupId[groupId].groupTimes[0] = { _id: id };
  } else {
    newState.byActivityId[activityId].byGroupId[groupId].groupTimes[0]._id = id;
  }

  if (!_.isNil(startedAt) && isStart) {
    newState.byActivityId[activityId].byGroupId[groupId].groupTimes[0].startedAt = startedAt;
  }

  if (!_.isNil(stoppedAt) && !isStart) {
    newState.byActivityId[activityId].byGroupId[groupId].groupTimes[0].stoppedAt = stoppedAt;
  } else {
    newState.byActivityId[activityId].byGroupId[groupId].groupTimes[0].stoppedAt = null;
  }
  newState.addingGroup = false;
  //console.log(newState);
  return Object.assign({}, newState);
};

const updateShareCount = (state, action) => {
  const { activityId, groupId, increment } = action.payload;
  const newState = Object.assign({}, state);
  let sharedWith = newState.byActivityId[activityId].byGroupId[groupId].sharedWith;
  if (_.isNil(sharedWith)) {
    sharedWith = 0;
  }
  if (increment) {
    sharedWith += 1;
  } else {
    sharedWith -= 1;
  }
  newState.byActivityId[activityId].byGroupId[groupId].sharedWith = sharedWith;
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
  return Object.assign({}, state, {
    error: null,
    loading: false,
    addingMyActivity: false,
    addingGroup: false,
    removingGroup: {},
    removingTag: {},
  });
};

const INITIAL_GROUP_STATE = {
  error: null,
  loading: false,
  refreshing: false,
  addingMyActivity: false,
  addingGroup: false,
  removingGroup: {},
  removingTag: {},
  byActivityId: {},
  allActivityIds: [],
  count: 0,
  offset: 0,
  limit: 0,
  page: 1,
  totalPages: 0
};
export const myActivities = (state = INITIAL_GROUP_STATE, action) => {
  switch (action.type) {
    case UPDATE_SHARE_COUNT:
      return updateShareCount(state, action);
    case GROUP_FETCH_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        refreshing: action.page === 1,
        addingMyActivity: false,
        addingGroup: false,
        removingGroup: {},
        removingTag: {},
      });
    case GROUP_FETCH_SUCCESS:
      return getMyActivities(state, action);
    case GROUP_FETCH_ERROR:
      return getMyActivitiesError(state, action);
    case GROUP_FETCH_RESET:
      return getMyActivitiesReset(state, action);
    case GROUP_ADD_REQUEST:
      return Object.assign({}, state, {
        addingMyActivity: true,
        error: null
      });
    case GROUP_ADD_SUCCESS:
      return addTagsGroupToMyActivity(state, action);
    case GROUP_ADD_ERROR:
      return Object.assign({}, state, {
        addingMyActivity: false,
        error: action.payload
      });
    case GROUP_ADD_RESET:
      return Object.assign({}, state, {
        addingMyActivity: false,
        error: null
      });
    case TAG_DELETE_SUCCESS:
      return deleteTagFromGroup(state, action);
    case ACTIVITY_DELETE_SUCCESS:
      return deleteActivityFromMyActivity(state, action);

    case GROUP_REMOVE_TAG_REQUEST:
      return Object.assign({}, state, {
        removingTag: { loading: true, groupId: action.payload.groupId },
        error: null
      });
    case GROUP_REMOVE_TAG_SUCCESS:
      return removeTagFromGroup(state, action);
    case GROUP_REMOVE_TAG_ERROR:
      return Object.assign({}, state, {
        removingTag: { loading: false, groupId: action.payload.groupId },
        error: action.payload.error
      });
    case GROUP_REMOVE_TAG_RESET:
      return Object.assign({}, state, {
        removingTag: {},
        error: null
      });

    case GROUP_REMOVE_GROUP_REQUEST:
      return Object.assign({}, state, {
        removingGroup: { loading: true, groupId: action.payload.groupId },
        error: null
      });
    case GROUP_REMOVE_GROUP_SUCCESS:
      return removeGroupFromActivity(state, action);
    case GROUP_REMOVE_GROUP_ERROR:
      return Object.assign({}, state, {
        removingGroup: { loading: false, groupId: action.payload.groupId },
        error: action.payload.error
      });
    case GROUP_REMOVE_GROUP_RESET:
      return Object.assign({}, state, {
        removingGroup: {},
        error: null
      });

    case GROUP_GROUP_ADD_REQUEST:
      return Object.assign({}, state, {
        addingGroup: true,
        error: null
      });
    case GROUP_GROUP_ADD_SUCCESS:
      return addGroupToMyActivity(state, action);
    case GROUP_GROUP_ADD_ERROR:
      return Object.assign({}, state, {
        addingGroup: false,
        error: action.payload
      });
    case GROUP_GROUP_ADD_RESET:
      return Object.assign({}, state, {
        addingGroup: false,
        error: null
      });
    case TIME_TOGGLE_SUCCESS:
      return updateTimeForActivity(state, action);
      //return moveActivity(state, action);
    default:
      return state;
  }
};
