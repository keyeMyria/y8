/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActionSheetIOS,
  TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';

class ActionSheet extends Component {
  static defaultProps = {
    show: () => {},
    title: 'Options'
  }

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      selected: false
    };
  }

  onModalHide = () => {
    if (this.state.selected !== false) {
      const index = this.state.selected;
      this.setState({
        selected: null
      }, this.props.onSelect(index));
    }
  }

  showModal = () => this.setState({ isModalVisible: !this.state.isModalVisible })

  isSelected = (index) => {
    this.setState({
      selected: index
    }, this.showModal());
  }

  show = (device) => {
    if (device === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        title: this.props.title,
        options: this.props.options,
        cancelButtonIndex: this.props.cancelIndex,
        destructiveButtonIndex: this.props.deleteIndex,
      }, this.props.onSelect);
    } else {
      this.showModal();
    }
  }

  renderList = () => (
    this.props.buttons.map((buttonText, index) => (
      <TouchableOpacity
        key={buttonText}
        onPress={() => { this.isSelected(index); }}
      >
        <View style={[styles.itemContainer]}>
          <Text
            style={{
              color: index === this.props.deleteIndex ? 'red' : '#000'
            }}
          >
          {buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    ))
  );

  render() {
    return (
      <Modal
        onModalHide={this.onModalHide}
        backdropOpacity={0.50}
        isVisible={this.state.isModalVisible}
        onBackdropPress={this.showModal}
        style={[styles.modal]}
      >
        <View style={[styles.container]}>
          {this.renderList()}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  itemContainer: {
    paddingLeft: 20,
    borderColor: 'gray',
    justifyContent: 'center',
    borderBottomWidth: 1,
    height: 50
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  }
});

export default ActionSheet;
