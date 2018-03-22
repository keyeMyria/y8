import {
  USER_SET_USER_ID,
  USER_USER_ID_RESET
} from '../types/UserTypes';

// initial dispatcher before app starts
export const setUserId = (userId) => (
  async (dispatch) => {
    // put all initialization code here.
    dispatch({
      type: USER_SET_USER_ID,
      payload: userId
    });
  });
export const resetUserId = () => (
  async (dispatch) => {
    // put all initialization code here.
    dispatch({
      type: USER_USER_ID_RESET,
    });
  });
