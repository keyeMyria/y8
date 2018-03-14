import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import {
  globalIconColor,
} from '../styles/Global';

class TextButton extends React.PureComponent {
  static defaultProps = {
    onPress: () => null,
    disabled: false,
  }
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress();
          }
        }}
      >
        <Text
          style={[
            styles.title,
            { color: this.props.disabled ? 'rgba(221,93,89,0.4)' : globalIconColor },
            this.props.titleStyle,
          ]}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1,
    //borderRadius: 5,
    padding: 5,
    //borderColor: 'black',
    //marginTop: 10,
    //backgroundColor: 'red'
  },
  title: {

    alignSelf: 'center',
    color: 'rgba(0,122,255,1)',
    fontSize: 18,
  }
});

export default TextButton;
