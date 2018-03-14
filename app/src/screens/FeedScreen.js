import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';
import TabBarFeedIcon from '../components/TabBarFeedIcon';
import HeaderAddIcon from '../components/HeaderAddIcon';

class FeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'Feed',
      tabBarLabel: 'Feed',
      headerStyle: {
        marginTop: Platform.OS === 'android' ? 24 : 0
      },
      tabBarIcon: ({ tintColor }) => (
        <TabBarFeedIcon color={tintColor} />
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
          FeedScreen to React Native!
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


export default FeedScreen;
