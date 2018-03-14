import {
  APP_ROOT,
  APP_INIT_ACTIVITIES_DONE
} from '../types/AppTypes';

const INITIAL_APP_STATE = {
  root: 'AuthorizeScreen',
  hasInitialActivities: false
};
export const app = (state = INITIAL_APP_STATE, action) => {
  switch (action.type) {
    case APP_ROOT:
      return Object.assign({}, state, {
        root: action.payload,
      });
    case APP_INIT_ACTIVITIES_DONE:
      return Object.assign({}, state, {
        hasInitialActivities: true,
      });
    default:
      return state;
  }
};
