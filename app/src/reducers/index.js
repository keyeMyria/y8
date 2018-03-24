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
import { users } from './SearchUsersReducer';
import { friendActions } from './FriendActionsReducer';
//import { acceptFriendRequest } from './AcceptFriendRequestReducer';
import { friendRequests } from './FriendRequestsReducer';
import { friends } from './FriendsReducer';
import { user } from './UserReducer';
import { login } from './LoginReducer';

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
  offlineQueue,
  user,
  friendRequests,
  friends,
  // no state for below data
  users,
  friendActions,
  login
};
