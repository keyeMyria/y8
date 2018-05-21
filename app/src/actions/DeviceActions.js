import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import ApiRequest from '../services/ApiRequest';
import {
  REGISTER_DEVICE_RESET,
  REGISTER_DEVICE_REQUEST,
  REGISTER_DEVICE_SUCCESS,
  REGISTER_DEVICE_ERROR,
} from '../types/DeviceTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
//import { fakePromise } from '../services/Common';

// add activity action
export const registerDevice = (tokenInfo) => (
  async (dispatch, getState) => {
    try {
      const { offlineMode } = getState().network;
      if (!offlineMode) {
        dispatch({
          type: REGISTER_DEVICE_REQUEST
        });

        const apiUrl = '/api/private/device';
        const payload = {
          UID: uuidv4(),
          data: { tokenInfo },
          apiUrl,
          method: 'post',
        };

        await ApiRequest(payload);

        dispatch({
          type: REGISTER_DEVICE_SUCCESS,
          payload: {
            deviceId: tokenInfo.token
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
          type: REGISTER_DEVICE_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: REGISTER_DEVICE_RESET
    });
  }
);
