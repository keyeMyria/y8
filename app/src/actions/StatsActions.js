//import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import ApiRequest from '../services/ApiRequest';
import {
  //STATS_FETCH_RESET,
  STATS_FETCH_REQUEST,
  STATS_FETCH_SUCCESS,
  STATS_FETCH_ERROR,
} from '../types/StatsTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
//import { fakePromise } from '../services/Common';

export const getStats = (query) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: STATS_FETCH_REQUEST
        });

        const payload = {
          data: null,
          apiUrl: `/api/private/stats?activityId=${query.activityId}`,
          method: 'get'
        };

        const response = await ApiRequest(payload);
        const { data } = response;
        console.log(query, response);
        dispatch({
          type: STATS_FETCH_SUCCESS,
          payload: { ...data },
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
          type: STATS_FETCH_ERROR,
          payload: error.response
        });
      }
    }
  }
);
