import _ from 'lodash';
import React, { Component } from 'react';
import { NetInfo, AppState, Text, View, Platform, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
//import Spinner from 'react-native-loading-spinner-overlay';
import { ClearLoginToken } from '../services/AuthService';
//import { fakePromise } from '../services/Common';

import {
  setConnectionStatus
} from '../actions/ConnectionActions';

import {
  offlineRequest
} from '../actions/OfflineActions';

import {
  changeAppRoot
} from '../actions/AppActions';

import {
  doAuthAndLoadInitData
} from '../actions/AuthActions';


export default (ComposedComponent) => {
  class NetworkChange extends Component {
    static navigationOptions = ComposedComponent.navigationOptions;
    constructor(props) {
      super(props);
      this.state = {
        didChange: false
      };
      this.timeout = 0;
    }

    componentDidMount() {
      console.log("NetworkChange: componentDidMount ");
      if (Platform.OS === 'android') {
        NetInfo.isConnected.fetch().then(isConnected => {
          console.log('First, is ' + (isConnected ? 'online' : 'offline'));
          this.handleConnectionChange(isConnected);
        });
      }

      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
      AppState.addEventListener('change', this.handleAppStateChange);
    }

    // async componentWillUpdate(nextProps) {
    //   //console.log('Authenticator componentWillUpdate');
    //   //console.log(this.props);
    //   await this.isLoggedIn(nextProps);
    // }

    /*isLoggedIn = async (props) => {
      const { isAuthorized, error } = props.auth;
      const { isConnected } = props.network;
      //console.log('isLoggedIn', props.auth, this.props.auth);

      if (this.props.auth.isAuthorized === true
        && isAuthorized === false
        && isConnected
        && _.isNull(error)) {
          const cleared = await ClearLoginToken();
          if (cleared) {
            LoginManager.logOut();
            ResetNavigation('tmp', this.props);
          }
          // ClearLoginToken().then((cleared) => {
          //   if (cleared) {
          //     LoginManager.logOut();
          //     ResetNavigation('login', this.props);
          //   }
          // });
      } else if (isAuthorized === true && isConnected) {
        //this.props.getTags();
        //this.props.getActivities();
      } else if (!isConnected) {
        // TODO
      }
    }*/

    componentDidUpdate(nextProps) {
      //console.log('componentDidUpdate-Auth', nextProps.auth, this.props.auth);
      if (!_.isNull(this.props.auth.error) && _.isNull(nextProps.auth.error)) {
        //console.log('Inside');
        ClearLoginToken().then((cleared) => {
          if (cleared) {
            LoginManager.logOut();
            this.props.changeAppRoot('LoginScreen');
          }
        });
      }
    }

    componentWillUnmount() {
      //console.log("NetworkChange: componentWillUnmount ");
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleConnectionChange = async (isConnected) => {
      //clearTimeout(this.timeout);
      console.log('handleConnectionChange', isConnected);
      this.props.setConnectionStatus(isConnected);
      if (isConnected) {
        if (this.props.offlineQueue.payloads.length > 0) {
          this.props.offlineRequest();
        }
      }
      // await fakePromise(300);
      // this.timeout = setTimeout(() => {
      //   this.props.setConnectionStatus(isConnected);
      //   if (isConnected) {
      //     if (this.props.offlineQueue.payloads.length > 0) {
      //       this.props.offlineRequest();
      //     }
      //
      //     // if (this.props.initData.dataLoaded !== true) {
      //     //   this.props.doAuthAndLoadInitData();
      //     // }
      //     //this.props.getFriendRequests();
      //     // this.setState({
      //     //   didChange: true
      //     // });
      //   }
      //   clearTimeout(this.timeout);
      // }, 1000);
    };

    handleAppStateChange = (nextAppState) => {
      //console.log('handleAppStateChange', nextAppState);
      //if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (nextAppState === 'active') {
        //console.log('App has come to the foreground!');
        this.props.offlineRequest();
      }
    };

    render() {
      //const { syncing } = this.props.offlineQueue;
      // if (syncing) {
      //   text = 'Syncing';
      // }

      // if (syncing) {
      //   return (
      //     <Spinner
      //       visible={syncing}
      //       textContent={text}
      //       textStyle={{ color: 'black' }}
      //     />
      //   );
      // }
      // const text = 'Checking network status...';
      // return (
      //   <Spinner
      //     visible
      //     textContent={text}
      //     textStyle={{ color: 'black' }}
      //   />
      // );

      // if (this.state.didChange) {
      //   return (
      //     <ComposedComponent {...this.props} />
      //   );
      // }

      //if (this.state.didChange === true) {
        return (
          <ComposedComponent {...this.props} />
        );
      //}

      // return (
      //   <View style={styles.container}>
      //     <Text style={styles.welcome}>
      //       Loading...
      //     </Text>
      //   </View>
      // );
    }
  }

  const mapStateToProps = (state) => state;
  return connect(mapStateToProps, {
    setConnectionStatus,
    offlineRequest,
    changeAppRoot,
    doAuthAndLoadInitData
  })(NetworkChange);
};


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
// In some other location ...not in this file...
// we ant to use this HOC

// import Authentication // this is my HOC
// import Resources // this is the comonent I want to wrap
//
// const ComposedComponent  = Authentication(Resources);

// In some render method

// <ComposedComponent resources={resourceList} />
