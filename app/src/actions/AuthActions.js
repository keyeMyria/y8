import axios from 'axios';
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_RESET,

  //LOGIN_REQUEST,
  //LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_RESET,
  LOGIN_ACTION_REQUEST,
  LOGIN_ACTION_DONE,
  //LOGIN_ACTION_RESET
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
} from './GroupActions';

import {
  getFriendRequests
} from './FriendActions';

import {
  INIT_FETCH_DATA_REQUEST,
  INIT_FETCH_DATA_DONE,
  //INIT_FETCH_DATA_RESET
} from '../types/InitTypes';

import {
  USER_SET_USER_ID
} from '../types/UserTypes';

import {
  changeAppRoot
} from './AppActions';

import { SetLoginToken } from '../services/AuthService';
import { fakePromise } from '../services/Common';

export const resetAuth = () => (
  async dispatch => {
    //TODO: make api call and get custom activities and merge with constant list
    dispatch({
      type: AUTH_RESET
    });
  });

// export const setUserId = (userId) => (
//   async dispatch => {
//     //TODO: make api call and get custom activities and merge with constant list
//     dispatch({
//       type: USER_SET_USER_ID,
//       payload: userId
//     });
//   });
/*
export const doAuthAndLoadInitData = () => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      const { dataLoaded } = getState().initData;
      // Initial Authorizing and data loading after authorization
      if (isConnected) {
        await dispatch({
          type: AUTH_REQUEST
        });
        const resp = await axios.get('/api/private/testAuth');
        await dispatch({
          type: USER_SET_USER_ID,
          payload: resp.data.id
        });
        await dispatch({
          type: AUTH_SUCCESS
        });

        if (dataLoaded === false || dataLoaded === null) {
          await dispatch({
            type: INIT_FETCH_DATA_REQUEST
          });
          await dispatch(getTags());
          await dispatch(getActivities());
          await dispatch(getMyActivities());
          await dispatch(getFriendRequests());
          await fakePromise(200);
          await dispatch({
            type: INIT_FETCH_DATA_DONE
          });
        }

        //await dispatch({ type: INIT_FETCH_DATA_RESET });
      }
      //await dispatch({ type: AUTH_RESET_ERROR });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: error.response
      });
    }
  });
*/
  export const doLogin = (accessToken) => (
    async (dispatch, getState) => {
      try {
        const { dataLoaded } = getState().initData;
        await dispatch({ type: LOGIN_ACTION_REQUEST });
        // await dispatch({
        //   type: LOGIN_REQUEST
        // });
        const response = await axios.post('/api/public/login', {
          loginType: 'facebook',
          accessToken
        });

        const { authToken, userId } = response.data;
        const isLoggedIn = await SetLoginToken(authToken);

        // await dispatch({
        //   type: LOGIN_SUCCESS,
        //   payload: isLoggedIn
        // });

        if (isLoggedIn === true) {
          await dispatch({
            type: USER_SET_USER_ID,
            payload: userId
          });
          if (dataLoaded === false || dataLoaded === null) {
            await dispatch({
              type: INIT_FETCH_DATA_REQUEST
            });
            await dispatch(getTags());
            await dispatch(getActivities());
            await dispatch(getMyActivities());
            await dispatch(getFriendRequests());
            await dispatch({
              type: INIT_FETCH_DATA_DONE
            });
          }

          //await dispatch({ type: LOGIN_ACTION_RESET });
        }
        await dispatch({ type: LOGIN_ACTION_DONE });
        await dispatch(changeAppRoot('afterLogin'));
      } catch (error) {
        dispatch({
          type: LOGIN_ERROR,
          payload: error.response
        });
      }
      dispatch({
        type: LOGIN_RESET,
      });
    });
