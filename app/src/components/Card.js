import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


class Card extends Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //borderWidth: 1,
    borderRadius: 5,
    //borderColor: '#ddd',
    //borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0.2, height: 0.4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    //elevation: 1,
    borderWidth: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    backgroundColor: 'transparent',

  }
});

export default Card;
