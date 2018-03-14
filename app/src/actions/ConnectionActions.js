import {
  CONNECTION_STATUS
} from '../types/ConnectionTypes';

export const setConnectionStatus = (status) => (
  async dispatch => {
    dispatch({
      type: CONNECTION_STATUS,
      payload: status
    });
  });