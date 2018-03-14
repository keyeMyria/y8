import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import { changeAppRoot } from '../actions/AppActions';
import { ClearLoginToken } from '../services/AuthService';


class FirstTabScreen extends Component {
  onLogoutFinished = () => {
    ClearLoginToken().then((cleared) => {
      if (cleared) {
        this.props.changeAppRoot('AuthorizeScreen');
      }
    });
  };
  render() {
    return (
      <View>
        <LoginButton
          onLogoutFinished={this.onLogoutFinished}
        />
        <Text>
          FirstTabScreen
        </Text>
        <Text>
          You just use native components like 'View' and 'Text',
          instead of web components like 'div' and 'span'.
        </Text>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  // console.log('ActivitiesScreen:mapStateToProps:', state);
  return state;
};
export default connect(mapStateToProps, {
changeAppRoot
})(FirstTabScreen);
