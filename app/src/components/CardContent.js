import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


class CardContent extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderRadius: 0,
    padding: 10
  }
});

export default CardContent;
