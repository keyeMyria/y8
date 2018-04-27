import React, { Component } from 'react';
import {
  ActivityIndicator,
  View
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

class Loading extends Component {
  static defaultProps = {
    containerStyle: {},
    show: false
    
  }
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <View style={[styles.loading, this.props.containerStyle]}>
        <ActivityIndicator size="small" color={EStyleSheet.value('$iconColor')} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  loading: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Loading;
