import _ from 'lodash';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { GetLoginToken } from '../services/AuthService';
import { changeAppRoot, loadInitialActivities } from '../actions/AppActions';
import { doAuthAndLoadInitData } from '../actions/AuthActions';

class AuthorizeScreen extends React.Component {
  componentDidMount() {
    if (!this.props.app.hasInitialActivities) {
      this.props.loadInitialActivities();
    }

    const { isConnected } = this.props.network;
    GetLoginToken().then((loginToken) => {
      if (!_.isNull(loginToken) && loginToken !== '') {
        if (isConnected) {
          this.props.doAuthAndLoadInitData();
        } else {
          this.props.changeAppRoot('afterLogin');
        }
      } else if (isConnected) {
        this.props.changeAppRoot('LoginScreen');
      } else {
        this.props.changeAppRoot('afterLogin');
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Authorizing...
        </Text>
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
  doAuthAndLoadInitData,
  loadInitialActivities
})(AuthorizeScreen);
