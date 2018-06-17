import { Navigation } from 'react-native-navigation';

import RehydratingScreen from './RehydratingScreen';
import AuthorizeScreen from './AuthorizeScreen';
import LoginScreen from './LoginScreen';

import DashboardScreen from './DashboardScreen';
import FeedScreen from './FeedScreen';
import FriendsScreen from './FriendsScreen';
import StatsScreen from './StatsScreen';
import MoreScreen from './MoreScreen';

import ActivitiesScreen from './ActivitiesScreen';
import TagsScreen from './TagsScreen';
import ShareScreen from './ShareScreen';
import TimeHistoryScreen from './TimeHistoryScreen';


// modals
import ActivityModal from '../modals/ActivityModal';
import StopActivityModal from '../modals/StopActivityModal';
import TagModal from '../modals/TagModal';
import FriendModal from '../modals/FriendModal';
import FriendInfoModal from '../modals/FriendInfoModal';
import SubscribersModal from '../modals/SubscribersModal';
import TimeHistoryModal from '../modals/TimeHistoryModal';

// PushNotifications
import InAppNotification from '../pushnotifications/InAppNotification';


// HOC
import NetworkChange from '../hoc/NetworkChange';

//TODO: samples need to delete these
import FirstTabScreen from './FirstTabScreen';
import SecondTabScreen from './SecondTabScreen';

import Loader from '../components/Loader';


// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  // Single apps
  Navigation.registerComponent('app.RehydratingScreen', () => RehydratingScreen, store, Provider);
  Navigation.registerComponent('app.AuthorizeScreen', () => AuthorizeScreen, store, Provider);
  Navigation.registerComponent('app.LoginScreen', () => LoginScreen, store, Provider);

  // Main Tabs
  Navigation.registerComponent('app.DashboardScreen', () => NetworkChange(DashboardScreen), store, Provider);
  Navigation.registerComponent('app.FeedScreen', () => FeedScreen, store, Provider);
  Navigation.registerComponent('app.FriendsScreen', () => FriendsScreen, store, Provider);
  Navigation.registerComponent('app.StatsScreen', () => StatsScreen, store, Provider);
  Navigation.registerComponent('app.MoreScreen', () => MoreScreen, store, Provider);

  // Sub screens
  Navigation.registerComponent('app.ActivitiesScreen', () => ActivitiesScreen, store, Provider);
  Navigation.registerComponent('app.TagsScreen', () => TagsScreen, store, Provider);
  Navigation.registerComponent('app.ShareScreen', () => ShareScreen, store, Provider);
  Navigation.registerComponent('app.TimeHistoryScreen', () => TimeHistoryScreen, store, Provider);

  // Modals
  Navigation.registerComponent('app.ActivityModal', () => ActivityModal, store, Provider);
  Navigation.registerComponent('app.StopActivityModal', () => StopActivityModal, store, Provider);
  Navigation.registerComponent('app.TagModal', () => TagModal, store, Provider);
  Navigation.registerComponent('app.FriendModal', () => FriendModal, store, Provider);
  Navigation.registerComponent('app.FriendInfoModal', () => FriendInfoModal, store, Provider);
  Navigation.registerComponent('app.SubscribersModal', () => SubscribersModal, store, Provider);
  Navigation.registerComponent('app.TimeHistoryModal', () => TimeHistoryModal, store, Provider);

  // pushnotifications
  Navigation.registerComponent('app.InAppNotification', () => InAppNotification, store, Provider);

  // Loading
  Navigation.registerComponent('app.Loader', () => Loader, store, Provider);


  //TODO: need to remove
  Navigation.registerComponent('app.FirstTabScreen', () => FirstTabScreen, store, Provider);
  Navigation.registerComponent('app.SecondTabScreen', () => SecondTabScreen, store, Provider);
}
