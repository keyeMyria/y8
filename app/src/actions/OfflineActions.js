import ApiRequest from '../services/ApiRequest';

import {
  OFFLINE_RESET,
  OFFLINE_REQUEST,
  OFFLINE_DONE,
  OFFLINE_CLEAR,
  OFFLINE_ERROR,
} from '../types/OfflineTypes';

export const offlineRequest = () => (
  async (dispatch, getState) => {
    try {
      const { network, offlineQueue } = Object.assign({}, getState());
      const { isConnected } = network;
      const { payloads } = offlineQueue;
      // && !syncing
      dispatch({
        type: OFFLINE_RESET
      });
      if (isConnected && payloads.length > 0) {
        dispatch({
          type: OFFLINE_REQUEST
        });
        await Promise.all(payloads.map(async (payload) => {
          if (isConnected) {
            await ApiRequest(payload);
            dispatch({
              type: OFFLINE_CLEAR,
              payload
            });
          }
        }));
        if (isConnected) {
          dispatch({
            type: OFFLINE_DONE,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: OFFLINE_ERROR,
        payload: error
      });
    }
  }
);
