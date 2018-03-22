import {
  USER_SET_USER_ID,
  USER_USER_ID_RESET
} from '../types/UserTypes';

const INITIAL_APP_STATE = {
  userId: null,
};
export const user = (state = INITIAL_APP_STATE, action) => {
  switch (action.type) {
    case USER_SET_USER_ID:
      return Object.assign({}, {
        userId: action.payload,
      });
    case USER_USER_ID_RESET:
      return INITIAL_APP_STATE;
    default:
      return state;
  }
};
