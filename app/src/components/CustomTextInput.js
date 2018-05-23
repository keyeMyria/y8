import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';

import {
  globalTextColor,
  globalIconColor,
  globalBackgroundColor,
} from '../styles/Global';

class CustomTextInput extends React.PureComponent {
  static defaultProps = {
    errorMsg: '',
    editable: true,
    onFocus: () => null,
    onBlur: () => null
  }
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  onChangeText = (text) => {
    this.setState({ text });
    this.props.onChangeText(text);
  }

  render() {
    const {
      placeholderText,
      placeholderTextColor,
      containerStyle,
      labelStyle,
      textInputStyle,
      errorStyle
    } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.label, labelStyle]}>{this.props.label}</Text>
        <TextInput
          editable={this.props.editable}
          autoCapitalize={'none'}
          autoCorrect={false}
          ref={this.props.textInputRef}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder={placeholderText || 'Enter valid name'}
          placeholderTextColor={placeholderTextColor || 'lightgray'}
          style={[styles.textInput, textInputStyle]}
          onChangeText={this.onChangeText}
          value={this.props.defaultValue ? this.props.defaultValue : this.state.text}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <Text
          style={[styles.error, errorStyle]}
        >{this.props.errorMsg}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'center',
    //backgroundColor: '#b8b8b8',
    //height: 120,
    marginHorizontal: 20

  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: globalTextColor,
    marginLeft: 10,
    marginBottom: 3
  },
  textInput: {
    //borderColor: 'lightgray',
    //borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    //borderRadius: 3,
    //paddingLeft: 5,
    color: globalTextColor,
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: '500',
    height: 40,
    borderRadius: 5

  },
  error: {
    fontSize: 16,
    //fontWeight: '500',
    //marginLeft: 5,
    marginVertical: 5,
    color: 'red'
  }

});

export default CustomTextInput;
