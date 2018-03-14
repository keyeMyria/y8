import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  globalIconColor,
} from '../styles/Global';

class HeaderAddIcon extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress();
          }
        }}
      >
        <View style={[styles.container, this.props.style]}>
          <Icon
            type={'feather'}
            name={'plus'}
            size={28}
            color={globalIconColor}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    padding: 5,
    height: 25,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
    //backgroundColor: 'red'
  }
});

export default HeaderAddIcon;
