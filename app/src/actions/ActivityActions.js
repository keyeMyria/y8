import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import ApiRequest from '../services/ApiRequest';
import {
  ACTIVITIES_FETCH_RESET,
  ACTIVITIES_FETCH_REQUEST,
  ACTIVITIES_FETCH_SUCCESS,
  ACTIVITIES_FETCH_ERROR,

  ACTIVITY_ADD_RESET,
  ACTIVITY_ADD_REQUEST,
  ACTIVITY_ADD_SUCCESS,
  ACTIVITY_ADD_ERROR,

  ACTIVITY_UPDATE_RESET,
  ACTIVITY_UPDATE_REQUEST,
  ACTIVITY_UPDATE_SUCCESS,
  ACTIVITY_UPDATE_ERROR,

  ACTIVITY_DELETE_RESET,
  ACTIVITY_DELETE_REQUEST,
  ACTIVITY_DELETE_SUCCESS,
  ACTIVITY_DELETE_ERROR,
} from '../types/ActivityTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
import { fakePromise } from '../services/Common';

export const getActivities = () => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: ACTIVITIES_FETCH_REQUEST
        });

        const payload = {
          data: null,
          apiUrl: '/api/private/activity',
          method: 'get'
        };
        const activities = {
          byId: {},
          allIds: []
        };

        const response = await ApiRequest(payload);
        const { data } = response;
        data.forEach((activity) => {
          activities.byId[activity.id] = activity;
          activities.allIds.push(activity.id);
        });

        dispatch({
          type: ACTIVITIES_FETCH_SUCCESS,
          payload: activities,
          isOnline: isConnected
        });
      }
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: ACTIVITIES_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    await fakePromise(100);
    dispatch({
      type: ACTIVITIES_FETCH_RESET
    });
  }
);

// add activity action
export const addActivity = (newActivity) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: ACTIVITY_ADD_REQUEST
      });
      let activity = newActivity;

      if (!_.has(activity, 'id')) {
        activity.id = uuidv4();
      }
      if (!_.has(activity, 'createdAt')) {
        activity.createdAt = Date.now();
      }
      if (!_.has(activity, 'updatedAt')) {
        activity.updatedAt = Date.now();
      }

      //const { isConnected } = getState().network;
      const apiUrl = '/api/private/activity';
      const payload = {
        UID: uuidv4(),
        data: activity,
        apiUrl,
        method: 'post',
      };

      //if (isConnected) {
        //TODO: Make api call if network available, otherwise store in activity queue
        await ApiRequest(payload);
        //const { data } = response;
      // } else {
      //   dispatch({
      //     type: OFFLINE_QUEUE,
      //     payload
      //   });
      //   await fakePromise(100);
      // }

      const activityId = activity.id;
      activity = {
        [activityId]: activity
      };

      dispatch({
        type: ACTIVITY_ADD_SUCCESS,
        payload: {
          byId: activity,
          allIds: [activityId]
        }
      });
      // await fakePromise(100);
      // await callback();
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: ACTIVITY_ADD_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: ACTIVITY_ADD_RESET
    });
  }
);

// update activity action
export const updateActivity = (updatedActivity) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: ACTIVITY_UPDATE_REQUEST
      });
      const activity = updatedActivity;
      activity.updatedAt = Date.now();

      //const { isConnected } = getState().network;
      const apiUrl = '/api/private/activity';
      const payload = {
        UID: uuidv4(),
        data: activity,
        apiUrl,
        method: 'put',
      };

      //if (isConnected) {
        await ApiRequest(payload);
        //const { data } = response;
      // } else {
      //   dispatch({
      //     type: OFFLINE_QUEUE,
      //     payload
      //   });
      //   await fakePromise(100);
      // }
      dispatch({
        type: ACTIVITY_UPDATE_SUCCESS,
        payload: {
          activity
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
          type: ACTIVITY_UPDATE_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: ACTIVITY_UPDATE_RESET
    });
  }
);

// update activity action
export const deleteActivity = (id) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: ACTIVITY_DELETE_REQUEST
      });
      const { isConnected } = getState().network;
      const apiUrl = `/api/private/activity/${id}`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'delete',
      };

      //if (isConnected) {
        await ApiRequest(payload);
        //const { data } = response;
      //} else {
      //   dispatch({
      //     type: OFFLINE_QUEUE,
      //     payload
      //   });
      //   await fakePromise(100);
      // }
      dispatch({
        type: ACTIVITY_DELETE_SUCCESS,
        payload: {
          id
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
          type: ACTIVITY_DELETE_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: ACTIVITY_DELETE_RESET
    });
  }
);
