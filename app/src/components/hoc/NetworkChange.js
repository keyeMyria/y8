import _ from 'lodash';
import React, { Component } from 'react';
import { NetInfo, AppState, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
import Spinner from 'react-native-loading-spinner-overlay';
import { ClearLoginToken } from '../../services/AuthService';
import ResetNavigation from '../../helpers/ResetNavigation';


import {
  setConnectionStatus
} from '../../actions/ConnectionActions';

import {
  offlineRequest
} from '../../actions/OfflineActions';


export default (ComposedComponent) => {
  class NetworkChange extends Component {
    static navigationOptions = ComposedComponent.navigationOptions;
    constructor(props) {
      super(props);
      this.state = {
        didChange: false
      };
      //console.log('ComposedComponent', this.props);
      //console.log('constructor');
    }


    componentDidMount() {
      //console.log("NetworkChange: componentWillMount ");
      //this.isLoggedIn(this.props);
      if (Platform.OS === 'android') {
        NetInfo.isConnected.fetch().then(isConnected => {
          console.log('First, is ' + (isConnected ? 'online' : 'offline'));
          this.handleConnectionChange(isConnected);
        });
      }

      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
      AppState.addEventListener('change', this.handleAppStateChange);
    }

    async componentWillUpdate(nextProps) {
      //console.log('Authenticator componentWillUpdate');
      //console.log(this.props);
      await this.isLoggedIn(nextProps);
    }

    componentWillUnmount() {
      //console.log("NetworkChange: componentWillUnmount ");
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    isLoggedIn = async (props) => {
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
    }

    handleConnectionChange = (isConnected) => {
      //console.log('handleConnectionChange', isConnected);
      this.props.setConnectionStatus(isConnected);
      if (isConnected && this.props.offlineQueue.payloads.length > 0) {
        this.props.offlineRequest();
      }
      this.setState({
        didChange: true
      });
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
      const { syncing } = this.props.offlineQueue;
      if (syncing) {
        return (
          <Spinner
            visible={syncing}
            textContent={'Syncing...'}
            textStyle={{ color: 'blue' }}
          />
        );
      }

      if (this.state.didChange) {
        return (
          <ComposedComponent />
        );
      }

      return <Text>Checking network status...</Text>;
    }
  }

  const mapStateToProps = (state) => state;
  return connect(mapStateToProps, {
    setConnectionStatus,
    offlineRequest
  })(NetworkChange);
};


// In some other location ...not in this file...
// we ant to use this HOC

// import Authentication // this is my HOC
// import Resources // this is the comonent I want to wrap
//
// const ComposedComponent  = Authentication(Resources);

// In some render method

// <ComposedComponent resources={resourceList} />
