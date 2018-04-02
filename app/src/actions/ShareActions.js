import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import ApiRequest from '../services/ApiRequest';
import {
  SHARE_ADD_RESET,
  SHARE_ADD_REQUEST,
  SHARE_ADD_SUCCESS,
  SHARE_ADD_ERROR,

  SHARE_REMOVE_RESET,
  SHARE_REMOVE_REQUEST,
  SHARE_REMOVE_SUCCESS,
  SHARE_REMOVE_ERROR,

  SHARES_FETCH_RESET,
  SHARES_FETCH_REQUEST,
  SHARES_FETCH_SUCCESS,
  SHARES_FETCH_ERROR,

} from '../types/ShareTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { fakePromise } from '../services/Common';

// subscribes userId to other user
export const shareWith = (groupId, sharedWith, sharedWithObj) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: SHARE_ADD_REQUEST
        });
        const apiUrl = '/api/private/share';
        const payload = {
          UID: uuidv4(),
          data: { groupId, sharedWith },
          apiUrl,
          method: 'post',
        };

        const resp = await ApiRequest(payload);
        const { data } = resp;
        console.log(data);

        dispatch({
          type: SHARE_ADD_SUCCESS,
          payload: {
            shareId: data.id,
            sharedWith,
            sharedWithObj
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
          type: SHARE_ADD_ERROR,
          payload: {
            error: error.response,
            shareId: null,
            sharedWith
          }
        });
      }
    }
    dispatch({
      type: SHARE_ADD_RESET
    });
  }
);

export const unshare = (id, sharedWith) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: SHARE_REMOVE_REQUEST
        });
        const apiUrl = `/api/private/share/${id}`;
        const payload = {
          UID: uuidv4(),
          data: null,
          apiUrl,
          method: 'delete',
        };

        const resp = await ApiRequest(payload);
        const { data } = resp;
        console.log(data);

        dispatch({
          type: SHARE_REMOVE_SUCCESS,
          payload: {
            shareId: id,
            unshareDone: data === 'done',
            sharedWith
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
          type: SHARE_REMOVE_ERROR,
          payload: {
            error: error.response,
            sharedWith
          }
        });
      }
    }
    dispatch({
      type: SHARE_REMOVE_RESET
    });
  }
);

export const getShares = (groupId) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: SHARES_FETCH_REQUEST
        });
        const apiUrl = `/api/private/share?groupId=${groupId}`;
        const payload = {
          UID: uuidv4(),
          data: null,
          apiUrl,
          method: 'get',
        };
        const resp = await ApiRequest(payload);
        dispatch({
          type: SHARES_FETCH_SUCCESS,
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
          type: SHARES_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: SHARES_FETCH_RESET
    });
  }
);
