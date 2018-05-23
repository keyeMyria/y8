import React from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';

class TimeIconButton extends React.PureComponent {
  static defaultProps = {
    offlineMode: false
  };
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.offlineMode}
        onPress={this.props.onPress}
        style={[styles.outerContainer, this.props.outerContainer]}
      >
        <View style={[styles.container, this.props.style]}>
          <Icon
            type={'ionicons'}
            name={'md-time'}
            size={26}
            color={
              !this.props.offlineMode ?
              EStyleSheet.value('$iconColor') : EStyleSheet.value('$subTextColor')
            }
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  outerContainer: {

  },
  container: {
    //flex: 1,
    //padding: 2,
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    //backgroundColor: 'lightpink'
  }
});

export default TimeIconButton;
