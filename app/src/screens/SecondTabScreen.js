import React, { Component } from 'react';
import { Text, View } from 'react-native';

class SecondTabScreen extends Component {
  render() {
    return (
      <View>
        <Text>
          SecondTabScreen
        </Text>
        <Text>
          You just use native components like 'View' and 'Text',
          instead of web components like 'div' and 'span'.
        </Text>
      </View>
    );
  }
}

export default SecondTabScreen
