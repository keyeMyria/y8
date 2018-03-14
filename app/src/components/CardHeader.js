import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


class CardHeader extends Component {
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#ffffff',
    //backgroundColor: 'rgba(221,93,89,0.8)'
  }
});

export default CardHeader;
