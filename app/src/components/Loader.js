import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import EStyleSheet from 'react-native-extended-stylesheet';

class Loader extends React.PureComponent {
  render() {
    return (
      <Spinner
        visible={this.props.visible}
        color={EStyleSheet.value('$textColor')}
        textContent={'Loading...'}
        textStyle={{ color: EStyleSheet.value('$textColor') }}
      />
    );
  }
}

export default Loader;
