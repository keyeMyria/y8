import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import ApiRequest from '../services/ApiRequest';
import {

  USERS_FETCH_RESET,
  USERS_FETCH_REQUEST,
  USERS_FETCH_SUCCESS,
  USERS_FETCH_ERROR,

  FRIENDS_FETCH_RESET,
  FRIENDS_FETCH_REQUEST,
  FRIENDS_FETCH_SUCCESS,
  FRIENDS_FETCH_ERROR,

  FRIEND_REQUEST_RESET,
  FRIEND_REQUEST_REQUEST,
  FRIEND_REQUEST_SUCCESS,
  FRIEND_REQUEST_ERROR,

  FRIEND_GET_REQUESTS_REQUEST,
  FRIEND_GET_REQUESTS_SUCCESS,
  FRIEND_GET_REQUESTS_ERROR,
  FRIEND_GET_REQUESTS_RESET,


  FRIEND_ACCEPT_RESET,
  FRIEND_ACCEPT_REQUEST,
  FRIEND_ACCEPT_SUCCESS,
  FRIEND_ACCEPT_ERROR,

  FRIEND_REJECT_RESET,
  FRIEND_REJECT_REQUEST,
  FRIEND_REJECT_SUCCESS,
  FRIEND_REJECT_ERROR,
} from '../types/FriendTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
import { fakePromise } from '../services/Common';

export const searchUsers = (text) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        await dispatch({
          type: USERS_FETCH_REQUEST
        });

        const payload = {
          data: null,
          apiUrl: `/api/private/friend/user?q=${text}`,
          method: 'get'
        };

        //console.log(payload);

        const response = await ApiRequest(payload);
        //console.log(response);
        const { data } = response;
        await dispatch({
          type: USERS_FETCH_SUCCESS,
          payload: data
        });
      }
    } catch (error) {
      //console.log(error);
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        await dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        await dispatch({
          type: USERS_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    await dispatch({
      type: USERS_FETCH_RESET
    });
  }
);

export const getFriendRequests = () => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        await dispatch({
          type: FRIEND_GET_REQUESTS_REQUEST
        });

        const payload = {
          data: null,
          apiUrl: '/api/private/friend/requests',
          method: 'get'
        };

        //console.log(payload);

        const response = await ApiRequest(payload);
        //console.log(response);
        const { data } = response;
        await dispatch({
          type: FRIEND_GET_REQUESTS_SUCCESS,
          payload: data
        });
      }
    } catch (error) {
      //console.log(error);
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        await dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        await dispatch({
          type: FRIEND_GET_REQUESTS_ERROR,
          payload: error.response
        });
      }
    }
    await dispatch({
      type: FRIEND_GET_REQUESTS_RESET
    });
  }
);


export const getFriends = () => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: FRIENDS_FETCH_REQUEST
        });

        const payload = {
          data: null,
          apiUrl: '/api/private/friend',
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
          type: FRIENDS_FETCH_SUCCESS,
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
          type: FRIENDS_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    await fakePromise(100);
    dispatch({
      type: FRIENDS_FETCH_RESET
    });
  }
);

// add activity action
export const sendFriendRequest = (userId) => (
  async (dispatch, getState) => {
    const { isConnected } = getState().network;
    try {
      if (isConnected) {
        dispatch({
          type: FRIEND_REQUEST_REQUEST
        });

        const data = {
          toUser: userId
        };
        const apiUrl = '/api/private/friend/send';
        const payload = {
          UID: uuidv4(),
          data,
          apiUrl,
          method: 'post',
        };
        const resp = await ApiRequest(payload);
        //console.log(resp);
        dispatch({
          type: FRIEND_REQUEST_SUCCESS,
          payload: {
            id: resp.data.id
          }
        });
      }
    } catch (error) {
      //console.log(error);
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: FRIEND_REQUEST_ERROR,
          payload: error.response
        });
      }
    }
    if (isConnected) {
      dispatch({
        type: FRIEND_REQUEST_RESET
      });
    }
  }
);

// update activity action
export const acceptFriendRequest = (requestId) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: FRIEND_ACCEPT_REQUEST
        });

        const apiUrl = '/api/private/friend/accept';
        const payload = {
          UID: uuidv4(),
          data: { requestId },
          apiUrl,
          method: 'post',
        };

        const resp = await ApiRequest(payload);
        console.log('acceptFriendRequest', resp);

        dispatch({
          type: FRIEND_ACCEPT_SUCCESS,
          payload: {
            id: resp.data.id
          }
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
          type: FRIEND_ACCEPT_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: FRIEND_ACCEPT_RESET
    });
  }
);

// update activity action
export const deleteActivity = (id) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: FRIEND_REJECT_REQUEST
      });
      const { isConnected } = getState().network;
      const apiUrl = `/api/private/activity/${id}`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'delete',
      };

      if (isConnected) {
        await ApiRequest(payload);
        //const { data } = response;
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(100);
      }
      dispatch({
        type: FRIEND_REJECT_SUCCESS,
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
          type: FRIEND_REJECT_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: FRIEND_REJECT_RESET
    });
  }
);
