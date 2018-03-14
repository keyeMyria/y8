import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import {
  // ACTIVITIES_FETCH_RESET,
  // ACTIVITIES_FETCH_REQUEST,
  //MY_ACTIVITIES_FETCH_SUCCESS,
  //ACTIVITIES_FETCH_ERROR,
  //ACTIVITY_ADD_RESET,

  MY_ACTIVITIES_FETCH_RESET,
  MY_ACTIVITIES_FETCH_REQUEST,
  MY_ACTIVITIES_FETCH_SUCCESS,
  MY_ACTIVITIES_FETCH_ERROR,


  MY_ACTIVITY_ADD_REQUEST,
  MY_ACTIVITY_ADD_SUCCESS,
  MY_ACTIVITY_ADD_ERROR,

  MY_ACTIVITY_REMOVE_TAG_REQUEST,
  MY_ACTIVITY_REMOVE_TAG_SUCCESS,
  MY_ACTIVITY_REMOVE_TAG_ERROR,
  MY_ACTIVITY_REMOVE_TAG_RESET,

  MY_ACTIVITY_REMOVE_GROUP_REQUEST,
  MY_ACTIVITY_REMOVE_GROUP_SUCCESS,
  MY_ACTIVITY_REMOVE_GROUP_ERROR,
  MY_ACTIVITY_REMOVE_GROUP_RESET,

  MY_ACTIVITY_GROUP_ADD_REQUEST,
  MY_ACTIVITY_GROUP_ADD_SUCCESS,
  MY_ACTIVITY_GROUP_ADD_ERROR,
  MY_ACTIVITY_GROUP_ADD_RESET
} from '../types/MyActivityTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
import ApiRequest from '../services/ApiRequest';
import { fakePromise } from '../services/Common';

export const getMyActivities = () => (
  async (dispatch, getState) => {
    let myactivities = {
      byActivityId: {},
      allActivityIds: []
    };

    try {
      dispatch({
        type: MY_ACTIVITIES_FETCH_REQUEST
      });
      const { isConnected } = getState().network;
      const payload = {
        data: null,
        apiUrl: '/api/private/myactivity',
        method: 'get'
      };

      if (isConnected) {
        const response = await ApiRequest(payload);
        //console.log('responseGetMyActivities:');
        //console.log(response);
        const { data } = response;
        myactivities = data;
      }

      dispatch({
        type: MY_ACTIVITIES_FETCH_SUCCESS,
        payload: myactivities
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: MY_ACTIVITIES_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    await fakePromise(100);
    dispatch({
      type: MY_ACTIVITIES_FETCH_RESET
    });
  }
);


export const removeTagFromGroup = (activityId, groupId, tagId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: MY_ACTIVITY_REMOVE_TAG_REQUEST,
      });
      const { isConnected } = getState().network;

      const apiUrl = `/api/private/myactivity/${activityId}/${groupId}/${tagId}`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'delete',
      };

      if (isConnected) {
        await ApiRequest(payload);
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(100);
      }

      dispatch({
        type: MY_ACTIVITY_REMOVE_TAG_SUCCESS,
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
          type: MY_ACTIVITY_REMOVE_TAG_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: MY_ACTIVITY_REMOVE_TAG_RESET,
    });
  }
);

//removeGroupFromActivity
export const removeGroupFromActivity = (activityId, groupId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: MY_ACTIVITY_REMOVE_GROUP_REQUEST,
      });
      const { isConnected } = getState().network;

      const apiUrl = `/api/private/myactivity/${activityId}/${groupId}`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'delete',
      };

      if (isConnected) {
        await ApiRequest(payload);
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(100);
      }

      dispatch({
        type: MY_ACTIVITY_REMOVE_GROUP_SUCCESS,
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
          type: MY_ACTIVITY_REMOVE_GROUP_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: MY_ACTIVITY_REMOVE_GROUP_RESET,
    });
  }
);

export const useThisGroupForActivity = (activityId, groupId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: MY_ACTIVITY_GROUP_ADD_REQUEST,
      });

      const data = {
        activityId,
        groupId
      };

      const { isConnected } = getState().network;
      const apiUrl = '/api/private/myactivity';
      const payload = {
        UID: uuidv4(),
        data,
        apiUrl,
        method: 'put',
      };
      if (isConnected) {
        //TODO: Make api call if network available, otherwise store in activity queue
        await ApiRequest(payload);
        //const { data } = response;
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(300);
      }

      dispatch({
        type: MY_ACTIVITY_GROUP_ADD_SUCCESS,
        payload: data
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: MY_ACTIVITY_GROUP_ADD_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: MY_ACTIVITY_GROUP_ADD_RESET,
    });
  }
);

// add addTagsGroupToMyActivity action
export const addTagsGroupToMyActivity = (activity, tags) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: MY_ACTIVITY_ADD_REQUEST,
      });

      const activityId = activity.id;
      const groupId = uuidv4();
      const group = {
        byActivityId: {
          [activityId]: {
            byGroupId: {
              [groupId]: tags,
            },
            allGroupIds: [groupId]
          }
        },
        allActivityIds: [activityId]
      };

      const myActivity = {
        activityId,
        groupId,
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const { isConnected } = getState().network;
      const apiUrl = '/api/private/myactivity';
      const payload = {
        UID: uuidv4(),
        data: myActivity,
        apiUrl,
        method: 'post',
      };

      if (isConnected) {
        //TODO: Make api call if network available, otherwise store in activity queue
        await ApiRequest(payload);
        //const { data } = response;
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(300);
      }
      dispatch({
        type: MY_ACTIVITY_ADD_SUCCESS,
        payload: group
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: MY_ACTIVITY_ADD_ERROR,
          payload: error.response
        });
      }
    }
  }
);
