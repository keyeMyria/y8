import React from 'react';
import {
  PushNotificationIOS
} from 'react-native';
import { connect } from 'react-redux';

import PushNotification from 'react-native-push-notification';
import { Navigation } from 'react-native-navigation';

import {
  registerDevice
} from '../actions/DeviceActions';

class PushNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screens: {
        screenInstanceID6: 'app.DashboardScreen',
        screenInstanceID8: 'app.FriendsScreen'
      }
    };
  }

  componentDidMount() {
    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: (tokenInfo) => {
        console.log( 'TOKEN:', tokenInfo);
        this.props.registerDevice(tokenInfo);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: async (notification) => {
          const { userInteraction } = notification;
          const { title, body } = notification.message;
          const { payload } = notification.data;
          const { screen, data } = payload;
          console.log(this.props);
          console.log( 'NOTIFICATION:', notification);
          const visibleScreenInstanceId = await Navigation.getCurrentlyVisibleScreenId();
          console.log('visibleScreenInstanceId', visibleScreenInstanceId);
          if (userInteraction && screen === 'app.FriendsScreen') {
            this.props.navigator.switchToTab({
              tabIndex: 2 // (optional) if missing, this screen's tab will become selected
            });
          } else if (!userInteraction) {
            this.props.navigator.showInAppNotification({
              screen: 'app.InAppNotification', // unique ID registered with Navigation.registerScreen
              passProps: {
                title,
                body,
                payload
              }, // simple serializable object that will pass as props to the in-app notification (optional)
              autoDismissTimerSec: 5 // auto dismiss notification in seconds
            });
          }
          // this.props.navigator.switchToTab({
          //   tabIndex: 2 // (optional) if missing, this screen's tab will become selected
          // });


          // process the notification

          // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
          notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: "YOUR GCM SENDER ID",

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }


  handleNotification = (notification) => {
    const { userInteraction } = notification;
    const { title, body } = notification.message;
    const { payload } = notification.data;
    const { screen } = payload;

    switch (screen) {
      case 'app.FriendsScreen':
        if (userInteraction) {
          this.props.navigator.switchToTab({
            tabIndex: 2 // (optional) if missing, this screen's tab will become selected
          });
        } else {
          this.props.navigator.showInAppNotification({
            screen: 'app.InAppNotification', // unique ID registered with Navigation.registerScreen
            passProps: {
              title,
              body,
              payload
            },
            autoDismissTimerSec: 10 // auto dismiss notification in seconds
          });
        }
        break;
      default:
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  //console.log('PushNotifications:mapStateToProps:', state);
  const { device } = state;
  return {
    device,
  };
};
export default connect(mapStateToProps, {
  registerDevice
})(PushNotifications);
