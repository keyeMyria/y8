import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { ClearLoginToken } from '../services/AuthService';
import { changeAppRoot } from '../actions/AppActions';
import { doLogin } from '../actions/AuthActions';
import { fakePromise } from '../services/Common';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginFinished: false,
    };
  }

  onLoginFinished = async (error, result) => {
    this.setState({
      loginFinished: true
    }, async () => {
      if (error) {
        console.log(`login has error: ${result.error}`);
      } else if (result.isCancelled) {
        console.log('login is cancelled.');
      } else {
        try {
          const data = await AccessToken.getCurrentAccessToken();
          //console.log(data.accessToken);
          await fakePromise(800);
          this.props.doLogin(data.accessToken);
        } catch (err) {
          console.error(err);
        }
      }
    });


      /*AccessToken.getCurrentAccessToken()
        .then((data) => data.accessToken.toString())
        .then((accessToken) => {
          console.log(accessToken);
          return axios.post('/api/public/login', {
            loginType: 'facebook',
            accessToken
          });
        })
        .then((response) => {
          console.log(response.data.authToken);
          return SetLoginToken(response.data.authToken);
        })
        .then((loggedIn) => {
          if (loggedIn === true) {
            //this.props.changeAppRoot('AuthorizeScreen');

          } else {
            const errorMsg = 'Login failed, could not set login token';
            console.log(errorMsg);
            throw new Error(errorMsg);
          }
        })
        .catch((err) => {
          console.error(err);
        });*/
    //}
  }

  onLogoutFinished = () => {
    ClearLoginToken().then((cleared) => {
      if (cleared) {
        this.props.changeAppRoot('LoginScreen');
      }
    });
  };

  render() {
    if (this.state.loginFinished) {
      return <View style={styles.container}><Text style={styles.welcome}>Loading...</Text></View>;
    }

    return (
      <View style={styles.container}>
        <LoginButton
          publishPermissions={['publish_actions']}
          //readPermissions={['public_profile', 'email']}
          onLoginFinished={this.onLoginFinished}
          onLogoutFinished={this.onLogoutFinished}
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

const mapStateToProps = (state) => {
  // console.log('ActivitiesScreen:mapStateToProps:', state);
  return {
    login: state.login,
    //initData: state.initData
  };
};
export default connect(mapStateToProps, {
  changeAppRoot,
  doLogin
})(LoginScreen);
