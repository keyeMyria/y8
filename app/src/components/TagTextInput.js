import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';

class TagTextInput extends React.PureComponent {
  static defaultProps = {
    errorMsg: ''
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
        <Text style={[styles.label, labelStyle]}>Tag Name</Text>
        <TextInput
          autoCorrect={false}
          ref={this.props.textInputRef}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder={placeholderText || 'Enter valid name'}
          placeholderTextColor={placeholderTextColor || 'lightgray'}
          style={[styles.textInput, textInputStyle]}
          onChangeText={this.onChangeText}
          value={this.props.defaultValue ? this.props.defaultValue : this.state.text}
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
    color: '#A9A9A9'
    //marginLeft: 5,
    //marginBottom: 5
  },
  textInput: {
    borderColor: 'lightgray',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    //borderRadius: 3,
    //paddingLeft: 5,
    color: '#A7A7A7',
    paddingRight: 5,
    fontSize: 20,
    height: 40
  },
  error: {
    fontSize: 16,
    //fontWeight: '500',
    //marginLeft: 5,
    marginVertical: 5,
    color: 'red'
  }

});

export default TagTextInput;
