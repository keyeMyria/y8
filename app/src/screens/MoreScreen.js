import React from 'react';
import {
  StyleSheet,
  View,
  Platform
} from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import { ClearLoginToken } from '../services/AuthService';
import TabBarMoreIcon from '../components/TabBarMoreIcon';
import HeaderAddIcon from '../components/HeaderAddIcon';
import { changeAppRoot } from '../actions/AppActions';


class MoreScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'Settings',
      tabBarLabel: 'More',
      headerStyle: {
        marginTop: Platform.OS === 'android' ? 24 : 0
      },
      tabBarIcon: ({ tintColor }) => (
        <TabBarMoreIcon color={tintColor} />
      ),
      headerRight: (
        <HeaderAddIcon onPress={() => { navigate('activities'); }} />
      )
    };
  };

  onLogoutFinished = () => {
    ClearLoginToken().then((cleared) => {
      if (cleared) {
        this.props.changeAppRoot('AuthorizeScreen');
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <LoginButton
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
const mapStateToProps = (state) => state;

export default connect(mapStateToProps, {
  changeAppRoot
})(MoreScreen);
