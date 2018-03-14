import {
    DASHBOARD_FETCH_RESET,
    //DASHBOARD_FETCH_REQUEST,
    //DASHBOARD_FETCH_SUCCESS,
    //DASHBOARD_FETCH_ERROR,

  } from '../types/DashboardTypes.js';
  
  const INITIAL_DASHBOARD_STATE = {
    loading: false,
    byId: {},
    allIds: [],
  };
  export const dashboard = (state = INITIAL_DASHBOARD_STATE, action) => {
    switch (action.type) {
      case DASHBOARD_FETCH_RESET:
        return INITIAL_DASHBOARD_STATE;
      
      default:
        return state;
    }
  };
