import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

class Loader extends React.PureComponent {
  render() {
    return (
      <ActivityIndicator size="small" color={EStyleSheet.value('$iconColor')} />
    );
    // return (
    //   <Spinner
    //     visible={this.props.visible}
    //     color={EStyleSheet.value('$textColor')}
    //     textContent={'Loading...'}
    //     textStyle={{ color: EStyleSheet.value('$textColor') }}
    //   />
    // );
  }
}

export default Loader;
