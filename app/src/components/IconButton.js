import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

class IconButton extends React.PureComponent {
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
            type={this.props.type}
            name={this.props.name}
            size={this.props.size}
            color={this.props.color}
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
    //backgroundColor: 'red'
  }
});

export default IconButton;
