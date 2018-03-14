import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';
import TabBarFriendsIcon from '../components/TabBarFriendsIcon';
import HeaderAddIcon from '../components/HeaderAddIcon';

class FriendsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'Friends',
      tabBarLabel: 'Friends',
      headerStyle: {
        marginTop: Platform.OS === 'android' ? 24 : 0
      },
      tabBarIcon: ({ tintColor }) => (
        <TabBarFriendsIcon color={tintColor} />
      ),
      headerRight: (
        <HeaderAddIcon onPress={() => { navigate('activities'); }} />
      )
    };
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          FriendsScreen to React Native!
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


export default FriendsScreen;
