import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import TextButton from '../components/TextButton';
import {
  globalIconColor,
  globalTextColor,
  globalBackgroundColor,
} from '../styles/Global';

class SearchBar extends React.PureComponent {
  static defaultProps = {
    onClear: () => null,
    onChangeText: () => null,
    onCancel: () => null,
    onFocus: () => null
  };
  constructor(props) {
    super(props);
    this.state = { text: '', focus: false };
  }

  onChangeText = (text) => {
    this.setState({ text });
    this.props.onChangeText(text);
  }
  onClear = () => {
    this.setState({
      text: ''
    });
    this.props.onClear();
  }
  onFocus = () => {
    this.setState({
      focus: true
    });
    this.props.onFocus();
  }
  onCancel = () => {
    this.setState({
      focus: false,
      text: ''
    }, () => {
      this.textInputRef.blur();
      this.onClear();
      this.props.onCancel();
    });
  }

  render() {
    const {
      outerContainerStyle,
      placeholderText,
      placeholderTextColor,
      containerStyle,
      textInputStyle,
      searchIconStyle,
      clearIconButtonStyle,
      clearIconStyle
    } = this.props;

    return (
      <View style={[outerContainerStyle]}>
      <View style={[styles.container, containerStyle]}>

        <TextInput
          ref={(ref) => { this.textInputRef = ref; }}
          autoCorrect={false}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder={placeholderText || 'Search Item'}
          placeholderTextColor={placeholderTextColor || 'lightgray'}
          style={[styles.textInput, textInputStyle]}
          onChangeText={this.onChangeText}
          value={this.state.text}
          onFocus={this.onFocus}
        />
        <Icon
          style={[styles.searchIcon, searchIconStyle]}
          name='ios-search'
        />
        {
          this.state.text !== '' &&
          <TouchableOpacity
            style={[styles.clearIconButton, clearIconButtonStyle]}
            onPress={this.onClear}
          >
            <Icon style={[styles.clearIcon, clearIconStyle]} name='ios-close' />
          </TouchableOpacity>
        }
        {
          this.state.focus &&
          <TextButton title='Cancel' onPress={this.onCancel} />
        }
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: 'center',
    backgroundColor: globalBackgroundColor,
    height: 50,
    flexDirection: 'row'
  },
  textInput: {
    flex: 1,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingLeft: 33,
    paddingRight: 30,
  },
  searchIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    //marginLeft: -100,
    left: 18,
    top: 12,


    color: globalIconColor,
    fontSize: 25,
  },
  clearIconButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 9.1,
    right: 68,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  clearIcon: {
    color: 'gray',
    fontSize: 30,
  }

});

export default SearchBar;
