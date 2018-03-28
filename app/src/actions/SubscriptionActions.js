import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import ApiRequest from '../services/ApiRequest';
import {
  SUBSCRIBE_RESET,
  SUBSCRIBE_REQUEST,
  SUBSCRIBE_SUCCESS,
  SUBSCRIBE_ERROR,

  UNSUBSCRIBE_RESET,
  UNSUBSCRIBE_REQUEST,
  UNSUBSCRIBE_SUCCESS,
  UNSUBSCRIBE_ERROR,

  SUBSCRIBERS_FETCH_RESET,
  SUBSCRIBERS_FETCH_REQUEST,
  SUBSCRIBERS_FETCH_SUCCESS,
  SUBSCRIBERS_FETCH_ERROR,

} from '../types/SubscribeTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
//import { fakePromise } from '../services/Common';

// subscribes userId to other user
export const doSubscribe = (subUserId) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: SUBSCRIBE_REQUEST
        });
        const apiUrl = '/api/private/subscribe';
        const payload = {
          UID: uuidv4(),
          data: { subUserId },
          apiUrl,
          method: 'post',
        };
        await ApiRequest(payload);
        dispatch({
          type: SUBSCRIBE_SUCCESS,
          payload: {
            subUserId,
            subscribed: true
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
          type: SUBSCRIBE_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: SUBSCRIBE_RESET
    });
  }
);

// subscribes userId to other user
export const doUnsubscribe = (subUserId) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: UNSUBSCRIBE_REQUEST
        });
        const apiUrl = '/api/private/unsubscribe';
        const payload = {
          UID: uuidv4(),
          data: { subUserId },
          apiUrl,
          method: 'post',
        };
        await ApiRequest(payload);
        dispatch({
          type: UNSUBSCRIBE_SUCCESS,
          payload: {
            subUserId,
            subscribed: false
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
          type: UNSUBSCRIBE_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: UNSUBSCRIBE_RESET
    });
  }
);


export const hasSubscribed = (subUserId) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: SUBSCRIBE_REQUEST
        });
        const apiUrl = `/api/private/subscribe/${subUserId}`;
        const payload = {
          UID: uuidv4(),
          data: null,
          apiUrl,
          method: 'get',
        };
        const resp = await ApiRequest(payload);
        dispatch({
          type: SUBSCRIBE_SUCCESS,
          payload: {
            subUserId,
            subscribed: resp.data.status === 1
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
          type: SUBSCRIBE_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: SUBSCRIBE_RESET
    });
  }
);

export const getSubscribers = (subUserId) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: SUBSCRIBERS_FETCH_REQUEST
        });
        const apiUrl = '/api/private/subscribe';
        const payload = {
          UID: uuidv4(),
          data: null,
          apiUrl,
          method: 'get',
        };
        const resp = await ApiRequest(payload);
        dispatch({
          type: SUBSCRIBERS_FETCH_SUCCESS,
          payload: resp.data
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
          type: SUBSCRIBERS_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: SUBSCRIBERS_FETCH_RESET
    });
  }
);
