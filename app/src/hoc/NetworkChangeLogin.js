import React, { Component } from 'react';
import { NetInfo, AppState, Platform } from 'react-native';
import { connect } from 'react-redux';

import {
  setConnectionStatus
} from '../actions/ConnectionActions';

export default (ComposedComponent) => {
  class NetworkChangeLogin extends Component {
    static navigationOptions = ComposedComponent.navigationOptions;
    constructor(props) {
      super(props);
      this.timeout = 0;
    }

    componentDidMount() {
      console.log("NetworkChangeLogin: componentDidMount ");
      if (Platform.OS === 'android') {
        NetInfo.isConnected.fetch().then(isConnected => {
          console.log('First, is ' + (isConnected ? 'online' : 'offline'));
          this.handleConnectionChange(isConnected);
        });
      }

      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
      AppState.addEventListener('change', this.handleAppStateChange);
    }


    componentWillUnmount() {
      //console.log("NetworkChangeLogin: componentWillUnmount ");
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleConnectionChange = async (isConnected) => {
      clearTimeout(this.timeout);
      console.log('handleConnectionChange', isConnected);
      this.timeout = setTimeout(() => {
        if (isConnected) {
          this.props.setConnectionStatus(isConnected);
        }
        clearTimeout(this.timeout);
      }, 1000);
    };

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  const mapStateToProps = (state) => state;
  return connect(mapStateToProps, {
    setConnectionStatus,
  })(NetworkChangeLogin);
};
