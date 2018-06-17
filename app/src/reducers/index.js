//import { combineReducers } from 'redux';
import { app } from './AppReducer';
import { initData } from './InitDataReducer';
import { dashboard } from './DashboardReducer';
import { activities } from './ActivitiesReducer';
import { tags } from './TagsReducer';
//import { myActivities } from './MyActivitiesReducer';
import { myActivities } from './GroupsReducer';
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
import { device } from './DeviceReducer';
import { subscribe } from './SubscribeReducer';
import { subscribers } from './SubscribersReducer';
import { share } from './ShareReducer';
import { shares } from './SharesReducer';
import { onlygroups } from './OnlyGroupsReducer';
import { feed } from './FeedReducer';
import { timesByGroup } from './TimesByGroupReducer';
import { stats } from './StatsReducer';

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
  device,
  subscribers,
  onlygroups,
  feed,

  // no state for below data
  users,
  friendActions,
  login,
  subscribe,
  share,
  shares,
  timesByGroup,
  stats
};
