import _ from 'lodash';
import React, { Component } from 'react';
import { NetInfo, AppState, Text } from 'react-native';
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
  class NetworkChangeTest extends Component {
    static navigationOptions = ComposedComponent.navigationOptions;
    constructor(props) {
      super(props);
      this.state = {
        didChange: false
      };
      //console.log('ComposedComponent', this.props);
    }

    componentWillMount() {
      console.log("NetworkChangeTest: componentWillMount ");
      //this.isLoggedIn(this.props);
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
      AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
      console.log("NetworkChangeTest: componentWillUnmount ");
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleConnectionChange = (isConnected) => {
      console.log('handleConnectionChange', isConnected);
      this.setState({
        didChange: true
      });
    };

    handleAppStateChange = (nextAppState) => {
      console.log('nextAppState', nextAppState);
      //if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (nextAppState === 'active') {
        //console.log('App has come to the foreground!');
        //this.props.offlineRequest();
      }
    };

    render() {
      console.log('this.state.didChange', this.state.didChange);
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
  })(NetworkChangeTest);
};


// In some other location ...not in this file...
// we ant to use this HOC

// import Authentication // this is my HOC
// import Resources // this is the comonent I want to wrap
//
// const ComposedComponent  = Authentication(Resources);

// In some render method

// <ComposedComponent resources={resourceList} />
