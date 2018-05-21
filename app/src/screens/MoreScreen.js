import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Switch
} from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import { ClearLoginToken } from '../services/AuthService';
import { changeAppRoot } from '../actions/AppActions';
import {
  setConnectionStatus,
  setOfflineMode
} from '../actions/ConnectionActions';
import {
  offlineRequest
} from '../actions/OfflineActions';
import { resetUserId } from '../actions/UserActions';

class MoreScreen extends React.Component {
  state = {
    isOffline: false
  };

  onLogoutFinished = () => {
    this.props.resetUserId();
    ClearLoginToken().then((cleared) => {
      if (cleared) {
        this.props.changeAppRoot('LoginScreen');
      }
    });
  };

  onValueChange = (isOffline) => {
    this.props.setOfflineMode(isOffline);
    if (!isOffline) {
      this.props.offlineRequest();
    }

    // this.props.setConnectionStatus(!isOffline);
    // if (!isOffline) {
    //   this.props.offlineRequest();
    // }
    // this.setState({
    //   isOffline
    // }, () => {
    //   this.props.setConnectionStatus(!isOffline);
    //   if (!isOffline) {
    //     this.props.offlineRequest();
    //   }
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginButton
          onLogoutFinished={this.onLogoutFinished}
        />
        <Text>Offline mode</Text>
        <Switch
         value={this.props.network.offlineMode}
         onValueChange={this.onValueChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
const mapStateToProps = (state) => state;

export default connect(mapStateToProps, {
  changeAppRoot,
  setConnectionStatus,
  setOfflineMode,
  offlineRequest,
  resetUserId
})(MoreScreen);
