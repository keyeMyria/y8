import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


class CardFooter extends Component {
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomWidth: 1,

    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 10

  }
});

export default CardFooter;
