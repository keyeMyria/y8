//import { combineReducers } from 'redux';
import { app } from './AppReducer';
import { initData } from './InitDataReducer';
import { dashboard } from './DashboardReducer';
import { activities } from './ActivitiesReducer';
import { tags } from './TagsReducer';
import { myActivities } from './MyActivitiesReducer';
import { times } from './TimesReducer';
import { auth } from './AuthReducer';
import { network } from './ConnectionReducer';
import { offlineQueue } from './OfflineReducer';


export default {
  app,
  initData,
  dashboard,
  activities,
  tags,
  myActivities,
  times,
  auth,
  network,
  offlineQueue
};
