import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EStyleSheet from 'react-native-extended-stylesheet';

import { registerScreens } from './screens';
import configureStore from './store';
import { initApp } from './actions/AppActions';
import './services/Axios';
import './styles';
//TODO
console.disableYellowBox = true;

let heart;
let feed;
let users;
let menu;
let plus;

const store = configureStore();
registerScreens(store, Provider); // this is where you register all of your app's screens

let currentRoot = null;
let hasRehydrated = false;
let loadedOnce = false;


const populateIcons = () => {
    //console.log(styles);
    return new Promise((resolve, reject) => {
      Promise.all(
        [
          // Feather.getImageSource('ios-settings', 30),
          // Feather.getImageSource('ios-settings-outline', 30),
          // Feather.getImageSource('ios-people', 30),
          // Feather.getImageSource('ios-navigate-outline', 30),
          // Feather.getImageSource('ios-navigate', 30),
          Feather.getImageSource('heart', 30),
          FontAwesome.getImageSource('feed', 30),
          Feather.getImageSource('users', 30),
          Feather.getImageSource('menu', 30),
          Feather.getImageSource('plus', 30, EStyleSheet.value('$iconColor'))

        ]
      ).then((values) => {
        //console.log(values);
        // settingsIcon = values[0];
        // settingsOutlineIcon = values[1];
        // peopleIcon = values[2];
        // iosNavigateOutline = values[3];
        // iosNavigate = values[4];
        heart = values[0];
        feed = values[1];
        users = values[2];
        menu = values[3];
        plus = values[4];

        resolve(true);
      }).catch((error) => {
        console.log(error);
        reject(error);
      }).done();
    });
  };

const onStoreUpdate = () => {
  // console.log('onStoreUpdate');
  // console.log('hasRehydrated', hasRehydrated);
  // console.log('loadedOnce', loadedOnce);

  if (!hasRehydrated) {
    if (!loadedOnce) {
      loadedOnce = true;
      populateIcons().then(() => {
        persistStore(store, null, () => {
          //console.log('persistStore', store.getState());
          hasRehydrated = true;
          const { root } = store.getState().app;
          if (currentRoot !== root) {
            currentRoot = root;
            startApp(root);
          }
        });
      }).catch((error) => {
        console.log(error);
      }).done();
    } else {
      Navigation.startSingleScreenApp({
        screen: {
          screen: 'app.RehydratingScreen',
          title: 'RehydratingScreen',
          navigatorStyle: { navBarHidden: true },
          navigatorButtons: {},
        },
      });
    }
  } else {
    const { root } = store.getState().app;
    // console.log('currentRoot', currentRoot);
    // console.log('root', root);
    if (currentRoot !== root) {
      currentRoot = root;
      startApp(root);
    }
  }
};


const startApp = (root) => {
  //console.log('startApp', root);
  switch (root) {
    case 'AuthorizeScreen':
      Navigation.startSingleScreenApp({
        screen: {
          screen: 'app.AuthorizeScreen',
          navigatorStyle: { navBarHidden: true },
          navigatorButtons: {}
          },
        });
      return;
    case 'LoginScreen':
      Navigation.startSingleScreenApp({
        screen: {
          screen: 'app.LoginScreen',
          navigatorStyle: { navBarHidden: true },
          navigatorButtons: {}
          },
        });
      return;
    case 'afterLogin':
      Navigation.startTabBasedApp({
        tabs: [
          {
            label: 'Activities',
            screen: 'app.DashboardScreen', // this is a registered name for a screen
            icon: heart, //require('../img/one.png'),
            selectedIcon: heart, //require('../img/one_selected.png'), // iOS only
            title: 'Your activities',
            navigatorStyle: {
              navBarTextColor: EStyleSheet.value('$textColor'),
              navBarButtonColor: EStyleSheet.value('$iconColor')
            },
            navigatorButtons: {
              rightButtons: [{
                id: 'add',
                icon: plus,
                disableIconTint: true, // disable default color,
              }]
            }
          },
          {
            label: 'Feed',
            screen: 'app.FeedScreen',
            icon: feed,
            selectedIcon: feed, // iOS only
            title: 'Feed',
            navigatorStyle: {
              navBarButtonColor: EStyleSheet.value('$iconColor')
            }
          },
          {
            label: 'Friends',
            screen: 'app.FriendsScreen',
            icon: users,
            selectedIcon: users, // iOS only
            title: 'Friends',
            navigatorStyle: {
              navBarTextColor: EStyleSheet.value('$textColor'),
              navBarButtonColor: EStyleSheet.value('$iconColor')
            },
            navigatorButtons: {
              rightButtons: [{
                id: 'add',
                icon: plus,
                disableIconTint: true, // disable default color,
              }]
            }
          },
          {
            label: 'More',
            screen: 'app.MoreScreen',
            icon: menu,
            selectedIcon: menu, // iOS only
            title: 'More',
            navigatorStyle: {
              navBarButtonColor: EStyleSheet.value('$iconColor')
            }
          }
        ],
        tabsStyle: {
          //tabBarButtonColor: '#ffff00',
          tabBarSelectedButtonColor: EStyleSheet.value('$iconColor'),
          //tabBarBackgroundColor: '#551A8B',
          initialTabIndex: 0,
        }
      });
      return;
    default: //no root found

  }
};

store.subscribe(onStoreUpdate);
store.dispatch(initApp());
