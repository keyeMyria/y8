import {
  APP_ROOT,
  APP_INIT_ACTIVITIES_DONE
} from '../types/AppTypes';

import {
  getActivities,
} from './ActivityActions';

// initial dispatcher before app starts
export const initApp = () => (
  async (dispatch) => {
    // put all initialization code here.
    dispatch({
      type: APP_ROOT,
      payload: 'LoginScreen'
    });
  });

// change apps root element
export const changeAppRoot = (name) => (
  async (dispatch) => {
    dispatch({
      type: APP_ROOT,
      payload: name
    });
  });

export const loadInitialActivities = () => (
  async (dispatch) => {
    await dispatch(getActivities());
    dispatch({ type: APP_INIT_ACTIVITIES_DONE });
  });
