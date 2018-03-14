import axios from 'axios';
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_RESET,
  //AUTH_RESET_ERROR
} from '../types/AuthTypes';

import {
  getTags,
} from './TagActions';
import {
  getActivities,
} from './ActivityActions';
import {
  getMyActivities
} from './MyActivityActions';

import {
  INIT_FETCH_DATA_REQUEST,
  INIT_FETCH_DATA_DONE,
  INIT_FETCH_DATA_RESET
} from '../types/InitTypes';

import { fakePromise } from '../services/Common';

export const resetAuth = () => (
  async dispatch => {
    //TODO: make api call and get custom activities and merge with constant list
    dispatch({
      type: AUTH_RESET
    });
  });

export const doAuthAndLoadInitData = () => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      // Initial Authorizing and data loading after authorization
      if (isConnected) {
        await dispatch({
          type: AUTH_REQUEST
        });
        await axios.get('/api/private/testAuth');
        await dispatch({
          type: AUTH_SUCCESS
        });

        await dispatch({
          type: INIT_FETCH_DATA_REQUEST
        });
        await dispatch(getTags());
        await dispatch(getActivities());
        await dispatch(getMyActivities());
        await fakePromise(200);
        await dispatch({
          type: INIT_FETCH_DATA_DONE
        });
        await dispatch({ type: INIT_FETCH_DATA_RESET });
      }
      //await dispatch({ type: AUTH_RESET_ERROR });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: error.response//{ isAuthorized: false }
      });
    }
  });
