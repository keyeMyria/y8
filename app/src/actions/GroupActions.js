import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import {
  GROUP_ADD_REQUEST,
  GROUP_ADD_SUCCESS,
  GROUP_ADD_ERROR,
  GROUP_ADD_RESET,

  GROUP_FETCH_REQUEST,
  GROUP_FETCH_SUCCESS,
  GROUP_FETCH_ERROR,
  GROUP_FETCH_RESET,

  ONLYGROUPS_FETCH_REQUEST,
  ONLYGROUPS_FETCH_SUCCESS,
  ONLYGROUPS_FETCH_ERROR,
  ONLYGROUPS_FETCH_RESET,

  GROUP_GROUP_ADD_REQUEST,
  GROUP_GROUP_ADD_SUCCESS,
  GROUP_GROUP_ADD_ERROR,
  GROUP_GROUP_ADD_RESET,

  GROUP_REMOVE_TAG_REQUEST,
  GROUP_REMOVE_TAG_SUCCESS,
  GROUP_REMOVE_TAG_ERROR,
  GROUP_REMOVE_TAG_RESET,

  GROUP_REMOVE_GROUP_REQUEST,
  GROUP_REMOVE_GROUP_SUCCESS,
  GROUP_REMOVE_GROUP_ERROR,
  GROUP_REMOVE_GROUP_RESET,

} from '../types/GroupTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
import ApiRequest from '../services/ApiRequest';
import { fakePromise } from '../services/Common';

import {
  startActivity
} from './TimeActions';


export const getMyActivities = (query) => (
  async (dispatch) => {
    const payload = {
      data: null,
      apiUrl: '/api/private/stats',
      method: 'get'
    };

    const response = await ApiRequest(payload);
    console.log(response);
  }
);

export const getMyActivitiesDontRemove = (query) => (
  async (dispatch, getState) => {
    const myactivities = {
      byActivityId: {},
      allActivityIds: []
    };

    try {
      //const { isConnected } = getState().network;
      dispatch({
        type: GROUP_FETCH_REQUEST
      });

      const payload = {
        data: null,
        apiUrl: `/api/private/group?page=${query.page}`,
        method: 'get'
      };

      const response = await ApiRequest(payload);
      const { rows, count, offset, limit, page, totalPages } = response.data;
      _.forEach(rows, (row) => {
        const { _id } = row;
        const { activityId } = _id;
        myactivities.allActivityIds.push(activityId);
        const allGroupIds = [];
        const byGroupId = {};
        _.forEach(row.groups, (group) => {
          allGroupIds.push(group.groupId);
          byGroupId[group.groupId] = {
            tagsGroup: group.tagsGroup,
            sharedWith: group.sharedWith,
            groupTimes: group.groupTimes
          };
        });
        myactivities.byActivityId[activityId] = { allGroupIds, byGroupId };
      });

      //filter already started activities
      const temp = [];
      const allActivityIds = Object.assign([], myactivities.allActivityIds);
      allActivityIds.forEach((aId) => {
        const gId = myactivities.byActivityId[aId].allGroupIds[0];
        const { groupTimes } = myactivities.byActivityId[aId].byGroupId[gId];
        if (!_.isNil(groupTimes) && !_.isNil(groupTimes[0])) {
          const { stoppedAt } = groupTimes[0];
          if (_.isNil(stoppedAt) || stoppedAt === '') {
            temp.push(aId);
          }
        }
      });

      temp.forEach((aId) => {
        const index = myactivities.allActivityIds.indexOf(aId);
        if (index !== -1) {
          myactivities.allActivityIds.splice(index, 1);
        }
      });

      myactivities.allActivityIds = [...temp, ...myactivities.allActivityIds];

      await dispatch({
        type: GROUP_FETCH_SUCCESS,
        payload: myactivities,
        count,
        offset,
        limit,
        page,
        totalPages
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    await fakePromise(100);
    dispatch({
      type: GROUP_FETCH_RESET
    });
  }
);


// add addTagsGroupToMyActivity action
export const addTagsGroupToMyActivity = (activity, tags, shouldStart) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GROUP_ADD_REQUEST,
      });

      const activityId = activity.id;
      const groupId = uuidv4();
      const myactivity = {
        byActivityId: {
          [activityId]: {
            byGroupId: {
              [groupId]: { tagsGroup: tags },
            },
            allGroupIds: [groupId]
          }
        },
        allActivityIds: [activityId]
      };

      const group = {
        groupId,
        activityId,
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const apiUrl = '/api/private/group';
      const payload = {
        UID: uuidv4(),
        data: group,
        apiUrl,
        method: 'post',
      };

      const { offlineMode } = getState().network;
      if (!offlineMode) {
        await ApiRequest(payload);
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(300);
      }
      await dispatch({
        type: GROUP_ADD_SUCCESS,
        payload: myactivity
      });

      if (shouldStart !== false) {
        await dispatch(startActivity(activityId, groupId));
      }
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_ADD_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: GROUP_ADD_RESET,
    });
  }
);

export const useThisGroupForActivity = (activityId, groupId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GROUP_GROUP_ADD_REQUEST,
      });

      const apiUrl = '/api/private/group';
      const payload = {
        UID: uuidv4(),
        data: { groupId, updatedAt: Date.now() },
        apiUrl,
        method: 'put',
      };
      const { offlineMode } = getState().network;
      if (!offlineMode) {
        await ApiRequest(payload);
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(300);
      }

      /*const onlygroups = getState().onlygroups;
      let tagsGroup = [];
      if (!_.isNil(groupId)) {
        tagsGroup = _.filter(onlygroups.data, { id: groupId });
      }
      if (tagsGroup.length > 0) {
        tagsGroup = tagsGroup[0].tags;
      } else {
        const myActivities = getState().myActivities;
        if (myActivities.byActivityId[activityId].byGroupId[groupId]) {
          if (myActivities.byActivityId[activityId].byGroupId[groupId].tagsGroup) {
            tagsGroup = myActivities.byActivityId[activityId].byGroupId[groupId].tagsGroup;
          }
        }
      }*/

      // console.log(tagsGroup);
      // const myActivities = getState().myActivities;
      //
      // console.log('myActivities', myActivities);
      //
      // const { tagsGroup } = myActivities.byActivityId[activityId].byGroupId[groupId];

      const data = {
        activityId,
        groupId
      };
      await dispatch({
        type: GROUP_GROUP_ADD_SUCCESS,
        payload: data
      });
      await dispatch(startActivity(activityId, groupId));
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_GROUP_ADD_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: GROUP_GROUP_ADD_RESET,
    });
  }
);


export const removeTagFromGroup = (activityId, groupId, tagId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GROUP_REMOVE_TAG_REQUEST,
        payload: {
          groupId
        }
      });

      const apiUrl = `/api/private/group/${groupId}/${tagId}/tag`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'delete',
      };

      const { offlineMode } = getState().network;
      if (!offlineMode) {
        await ApiRequest(payload);
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(100);
      }

      await dispatch({
        type: GROUP_REMOVE_TAG_SUCCESS,
        payload: {
          activityId,
          groupId,
          tagId
        }
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_REMOVE_TAG_ERROR,
          payload: {
            groupId,
            error: error.response
          }
        });
      }
    }
    dispatch({
      type: GROUP_REMOVE_TAG_RESET,
    });
  }
);

//removeGroupFromActivity
export const removeGroupFromActivity = (activityId, groupId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GROUP_REMOVE_GROUP_REQUEST,
        payload: {
          groupId
        }
      });

      const apiUrl = `/api/private/group/${groupId}/group`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'delete',
      };

      const { offlineMode } = getState().network;
      if (!offlineMode) {
        await ApiRequest(payload);
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(100);
      }

      await dispatch({
        type: GROUP_REMOVE_GROUP_SUCCESS,
        payload: {
          activityId,
          groupId,
        }
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_REMOVE_GROUP_ERROR,
          payload: {
            groupId,
            error: error.response
          }
        });
      }
    }
    dispatch({
      type: GROUP_REMOVE_GROUP_RESET,
    });
  }
);


//getGroupsByActivity
export const getGroupsByActivity = (activityId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: ONLYGROUPS_FETCH_REQUEST,
      });
      //const { isConnected } = getState().network;

      const apiUrl = `/api/private/group/${activityId}`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'get',
      };

      //if (isConnected) {
        const resp = await ApiRequest(payload);
      // } else {
      //   dispatch({
      //     type: OFFLINE_QUEUE,
      //     payload
      //   });
      //   await fakePromise(100);
      // }

      dispatch({
        type: ONLYGROUPS_FETCH_SUCCESS,
        payload: resp.data
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: ONLYGROUPS_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: ONLYGROUPS_FETCH_RESET,
    });
  }
);
