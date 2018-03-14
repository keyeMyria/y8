import { Navigation } from 'react-native-navigation';

import RehydratingScreen from './RehydratingScreen';
import AuthorizeScreen from './AuthorizeScreen';
import LoginScreen from './LoginScreen';

import DashboardScreen from './DashboardScreen';
import FeedScreen from './FeedScreen';
import FriendsScreen from './FriendsScreen';
import MoreScreen from './MoreScreen';

import ActivitiesScreen from './ActivitiesScreen';
import TagsScreen from './TagsScreen';

// modals
import ActivityModal from '../modals/ActivityModal';
import TagModal from '../modals/TagModal';

import FirstTabScreen from './FirstTabScreen';
import SecondTabScreen from './SecondTabScreen';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  // Single apps
  Navigation.registerComponent('app.RehydratingScreen', () => RehydratingScreen, store, Provider);
  Navigation.registerComponent('app.AuthorizeScreen', () => AuthorizeScreen, store, Provider);
  Navigation.registerComponent('app.LoginScreen', () => LoginScreen, store, Provider);

  // Main Tabs
  Navigation.registerComponent('app.DashboardScreen', () => DashboardScreen, store, Provider);
  Navigation.registerComponent('app.FeedScreen', () => FeedScreen, store, Provider);
  Navigation.registerComponent('app.FriendsScreen', () => FriendsScreen, store, Provider);
  Navigation.registerComponent('app.MoreScreen', () => MoreScreen, store, Provider);

  // Sub screens
  Navigation.registerComponent('app.ActivitiesScreen', () => ActivitiesScreen, store, Provider);
  Navigation.registerComponent('app.TagsScreen', () => TagsScreen, store, Provider);

  // Modals
  Navigation.registerComponent('app.ActivityModal', () => ActivityModal, store, Provider);
  Navigation.registerComponent('app.TagModal', () => TagModal, store, Provider);

  //TODO: need to remove
  Navigation.registerComponent('app.FirstTabScreen', () => FirstTabScreen, store, Provider);
  Navigation.registerComponent('app.SecondTabScreen', () => SecondTabScreen, store, Provider);
}
