import React, { Component } from 'react';
import { View, Text, StyleSheet, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { LoginManager } from 'react-native-fbsdk';
import Spinner from 'react-native-loading-spinner-overlay';
import _ from 'lodash';

import { ClearLoginToken } from '../../services/AuthService';
import ResetNavigation from '../../helpers/ResetNavigation';

import {
  setConnectionStatus
} from '../../actions/ConnectionActions';

import {
  offlineRequest
} from '../../actions/OfflineActions';

import {
  getTags
} from '../../actions/TagActions';

import {
  getActivities
} from '../../actions/ActivityActions';


export default (ComposedComponent) => {
  class Authenticator extends Component {
    static navigationOptions = ComposedComponent.navigationOptions;
    constructor(props) {
      super(props);
      this.state = {
        hasInitDataLoaded: false
      };
    }

    componentWillMount() {
      this.isLoggedIn(this.props);
      //NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }


    componentWillUnmount() {
      //NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    // componentWillMount() {
    //   //console.log('Authenticator componentWillMount');
    //   //console.log(this.props);
    //   this.isLoggedIn(this.props);
    //
    // }

    componentWillUpdate(nextProps) {
      //console.log('Authenticator componentWillUpdate');
      //console.log(this.props);
      this.isLoggedIn(nextProps);
    }
    handleConnectionChange = (isConnected) => {
      this.props.setConnectionStatus(isConnected);
      if (isConnected && this.props.offlineQueue.payloads.length > 0) {
        this.props.offlineRequest();
      }
    };

    isLoggedIn = (props) => {
      const { isAuthorized, error } = props.auth;
      const { isConnected } = props.network;
      if (isAuthorized === false && isConnected && _.isNull(error)) {
        ClearLoginToken().then((cleared) => {
          if (cleared) {
            LoginManager.logOut();
            ResetNavigation('login', this.props);
          }
        });
      } else if (isAuthorized === true && isConnected) {
        //this.props.getTags();
        //this.props.getActivities();
      } else if (!isConnected) {
        // TODO
      }
    }

    render() {
      //const { params } = this.props.navigation.state;
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
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  const mapStateToProps = (state) => state;
  return connect(mapStateToProps, {
    setConnectionStatus,
    offlineRequest,
    getActivities,
    getTags
  })(Authenticator);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'//globalBackgroundColor,
  }
});

// In some other location ...not in this file...
// we ant to use this HOC

// import Authentication // this is my HOC
// import Resources // this is the comonent I want to wrap
//
// const ComposedComponent  = Authentication(Resources);

// In some render method

// <ComposedComponent resources={resourceList} />
