import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-root-toast';

// Toast.show(msg, {
//   duration: Toast.durations.SHORT, //LONG
//   position: Toast.positions.BOTTOM
// })
class ToastProvider extends Component {
  static childContextTypes = {
    showToast: PropTypes.func,
  };

  static propTypes = {
    children: PropTypes.any,
  };

  getChildContext() {
    return {
      showToast: (...args) => Toast.show(...args),
    };
  }
  //zIndex={0}
  //startDelta={WINDOW.height + 400} endDelta={WINDOW.height}
  render() {
    return (
      <View style={{ flex: 1 }}>
        {React.Children.only(this.props.children)}
      </View>
    );
  }
}

export default ToastProvider;
