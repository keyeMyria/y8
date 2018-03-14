import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';

const WINDOW = Dimensions.get('window');

class AlertProvider extends Component {
  static childContextTypes = {
    alertWithType: PropTypes.func,
    alert: PropTypes.func,
  };

  static propTypes = {
    children: PropTypes.any,
  };

  getChildContext() {
    return {
      alert: (...args) => this.dropdown.alert(...args),
      alertWithType: (...args) => this.dropdown.alertWithType(...args),
    };
  }
  //zIndex={0}
  //startDelta={WINDOW.height + 400} endDelta={WINDOW.height}
  render() {
    return (
      <View style={{ flex: 1 }}>
        {React.Children.only(this.props.children)}
        <DropdownAlert


          ref={(ref) => {
            this.dropdown = ref;
          }}
        />
      </View>
    );
  }
}

export default AlertProvider;
