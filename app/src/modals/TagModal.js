import React from 'react';
import {
  View,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  FlatList
} from 'react-native';
import _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import TextButton from '../components/TextButton';
import CustomTextInput from '../components/CustomTextInput';
import TagItem from '../components/TagItem';
import { SearchTags, isTagExist } from '../services/TagService';

import {
  addTag,
  updateTag,
  deleteTag
} from '../actions/TagActions';

import SnackBar from '../services/SnackBar';
import { fakePromise } from '../services/Common';

const NETWORK_ERR = 'Network error, try again';
const ERROR_MSG = 'Only these a-zA-Z0-9_!@#$& and space are allowed';
class TagModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: ERROR_MSG,
      name: '',
      isValid: true,
      isUpdate: false,
      isDelete: false,
      isEditing: false,
      searchIds: [],
      isItemPressed: false,
    };
    this.timeout = 0;

    if (this.props.navigator) {
      this.props.navigator.setButtons({
        rightButtons: [{
          id: 'save',
          title: 'Save',
          disabled: true,
          buttonColor: EStyleSheet.value('$iconColor')
          //disableIconTint: true, // disable default color,
        }],
        leftButtons: [{
          id: 'close',
          title: 'Close',
          //disabled: true,
          buttonColor: EStyleSheet.value('$iconColor')
        }]
      });
      // if you want to listen on navigator events, set this up
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.myActivities.removingTag &&
      this.props.myActivities.removingTag &&
      _.isNull(nextProps.myActivities.error)) {
      await this.closeModal('Tag removed from group');
    } else if (!nextProps.myActivities.removingTag &&
      this.props.myActivities.removingTag &&
      !_.isNil(nextProps.myActivities.error)) {
      await this.closeModal(nextProps.myActivities.error.data);
    } else if (!nextProps.myActivities.removingTag &&
      this.props.myActivities.removingTag &&
      _.isUndefined(nextProps.myActivities.error)) {
      await this.closeModal('Service down, please try later');
    }

    if (!nextProps.myActivities.removingGroup &&
      this.props.myActivities.removingGroup &&
      _.isNull(nextProps.myActivities.error)) {
      await this.closeModal('Group removed from activity');
    } else if (!nextProps.myActivities.removingGroup &&
      this.props.myActivities.removingGroup &&
      !_.isNull(nextProps.myActivities.error) &&
      !_.isUndefined(nextProps.myActivities.error)) {
      await this.closeModal(this.props.myActivities.error.data);
    } else if (!nextProps.myActivities.removingGroup &&
      this.props.myActivities.removingGroup &&
      _.isUndefined(nextProps.myActivities.error)) {
      await this.closeModal('Service down, please try later');
    }

    if (!nextProps.tags.adding &&
      this.props.tags.adding &&
      _.isNull(nextProps.tags.addingError)) {
      await this.closeModal('Tag created!');
    } else if (!nextProps.tags.adding &&
      this.props.tags.adding &&
      !_.isNull(nextProps.tags.addingError) &&
      !_.isUndefined(nextProps.tags.addingError)) {
      await this.closeModal(nextProps.tags.addingError.data);
    } else if (!nextProps.tags.adding &&
      this.props.tags.adding &&
      _.isUndefined(nextProps.tags.addingError)) {
      await this.closeModal('Service down, please try later');
    }

    if (!nextProps.tags.updating &&
      this.props.tags.updating &&
      _.isNull(nextProps.tags.updatingError)) {
      await this.closeModal('Tag updated!');
    } else if (!nextProps.tags.updating &&
      this.props.tags.updating &&
      !_.isNull(nextProps.tags.updatingError) &&
      !_.isUndefined(nextProps.tags.updatingError)) {
      await this.closeModal(nextProps.tags.updatingError.data);
    } else if (!nextProps.tags.updating &&
      this.props.tags.updating &&
      _.isUndefined(nextProps.tags.updatingError)) {
      await this.closeModal('Service down, please try later');
    }

    if (!nextProps.tags.deleting &&
      this.props.tags.deleting &&
      _.isNull(nextProps.tags.deletingError)) {
      await this.closeModal('Tag deleted!');
    } else if (!nextProps.tags.deleting &&
      this.props.tags.deleting &&
      !_.isNull(nextProps.tags.deletingError) &&
      !_.isUndefined(nextProps.tags.deletingError)) {
      await this.closeModal(nextProps.tags.deletingError.data);
    } else if (!nextProps.tags.deleting &&
      this.props.tags.deleting &&
      _.isUndefined(nextProps.tags.deletingError)) {
      await this.closeModal('Service down, please try later');
    }
  }

/*
  //componentWillReceiveProps(nextProps) {
  async componentDidUpdate(nextProps) {
    //console.log('componentDidUpdate', nextProps.tags.adding, this.props.tags.adding);
    if (nextProps.tags.adding === true &&
      this.props.tags.adding === false &&
      nextProps.tags.addingError === null) {
      await this.closeModal('Tag created!');
    } else if (nextProps.tags.adding === true &&
      this.props.tags.adding === false &&
      nextProps.tags.addingError !== null) {
      await this.closeModal('TODO:Network error');
    } else if (nextProps.tags.updating === true &&
      this.props.tags.updating === false &&
      nextProps.tags.updatingError === null) {
      await this.closeModal('Tag Updated!');
    } else if (nextProps.tags.updating === true &&
      this.props.tags.updating === false &&
      nextProps.tags.updatingError !== null) {
      await this.closeModal('TODO:Network error');
    } else if (nextProps.tags.deleting === true &&
      this.props.tags.deleting === false &&
      nextProps.tags.deletingError === null) {
      await this.closeModal('Tag deleted!');
    } else if (nextProps.tags.deleting === true &&
      this.props.tags.deleting === false &&
      nextProps.tags.deletingError !== null) {
      await this.closeModal('TODO:Network error');
    }
  }*/

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.closeModal('');
      } else if (event.id === 'save') {
        this.onSave();
      }
    } else if (event.type === 'ScreenChangedEvent') {
      if (event.id === 'didDisappear') {
        // if (onCloseModalMsg !== '') {
        //   Snackbar.show({
        //       title: onCloseModalMsg,
        //       duration: Snackbar.LENGTH_SHORT,
        //   });
        //   onCloseModalMsg = '';
        // }
      } else if (event.id === 'didAppear') {
        this.textInput.focus();
        if (this.props.tag !== null) {
          this.setState({
            name: this.props.tag.name,
            isUpdate: true
          });
        }
      }
    }
  };

  onSave = async () => {
    this.props.navigator.setButtons({
      rightButtons: [{
        id: 'loader',
        component: 'app.Loader'
      }]
    });
    Keyboard.dismiss();
    const isExist = isTagExist(this.props.tags.byId, this.state.name);
    if (isExist) {
      if (!_.isNull(this.props.tag) &&
        this.state.name.toLowerCase() === this.props.tag.name.toLowerCase()) {
        //this.closeModal();
      } else {
        this.setState({
          isValid: false,
          errorMsg: 'Tag already exists'
        });
      }
      return false;
    }

    if (this.state.isUpdate) {
      this.props.updateTag({ name: this.state.name, id: this.props.tag.id });
    } else {
      this.props.addTag({ name: this.state.name });
    }
  }
  onChangeText = (name) => {
    let isValid = this.isValid(name);
    this.props.navigator.setButtons({
      rightButtons: [{
        id: 'save',
        title: 'Save',
        disabled: !isValid,
        buttonColor: EStyleSheet.value('$iconColor')
      }]
    });

    if (name.trim().length <= 2) {
      isValid = true;
    }

    clearTimeout(this.timeout);
    let searchIds = [];
    this.timeout = setTimeout(() => {
      if (isValid) {
        searchIds = SearchTags(this.props.tags.byId, name);
        this.setState({
          searchIds
        });
      }
    }, 800);

    this.setState({
      name,
      isValid,
      isEditing: true,
      searchIds
    });
  }

  onItemPress = async (tagId) => {
    this.props.navigator.push({
      screen: 'app.TagsScreen',
      title: 'Tags',
      passProps: {
        tag: this.props.tags.byId[tagId]
      }
    });
  }

  isValid = (name) => {
    const regex = /^[a-zA-Z0-9_ !@#$&*-]{2,20}$/;

    return regex.test(name);
  }


  closeModal = async (msg) => {
    Keyboard.dismiss();
    await fakePromise(100);
    SnackBar(msg);
    await this.props.navigator.dismissModal({
      animationType: msg !== '' ? 'none' : 'slide-down'// 'none' / 'slide-down'
    });
  }

  defaultValue = () => this.state.name;

  placeholderText = () => {
    let name = '';
    if (!_.isNull(this.props.tag)) {
      name = this.props.tag.name;
    } else {
      name = 'Enter tag name';
    }
    return name;
  }

  deleteTag = () => {
    Keyboard.dismiss();
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      Alert.alert(
        'Confirm',
        `Delete this tag ${this.props.tag.name}?`,
        [
          //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {
            style: 'cancel',
            text: 'Cancel',
            onPress: () => null
          },
          {
            style: 'destructive',
            text: 'Delete',
            onPress: () => {
              this.setState({
                isDelete: true
              }, () => {
                this.props.navigator.setButtons({
                  rightButtons: [{
                    id: 'loader',
                    component: 'app.Loader'
                  }]
                });
                this.props.deleteTag(this.props.tag.id);
              });
            }
          },
        ],
        { cancelable: false }
      );
    }, 100);
  }

  renderRow = ({ item }) => {
    const { id, name } = this.props.tags.byId[item];
    return (
      <TagItem
        id={id}
        name={name}
        showEditIcon={false}
        onItemPress={this.onItemPress}
      />
    );
  };

  render() {
    let name = null;
    if (!_.isNull(this.props.tag)) {
      name = this.props.tag.name;
    }
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={50}
        ref="myRef"
      >
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <CustomTextInput
            label='Tag Name'
            placeholderText={this.placeholderText()}
            defaultValue={this.defaultValue()}
            textInputRef={(input) => { this.textInput = input; }}
            onChangeText={this.onChangeText}
            errorMsg={this.state.isValid === false ? this.state.errorMsg : ''}
          />
          {
            this.state.isEditing &&
            <FlatList
              //removeClippedSubviews={false}
              keyboardShouldPersistTaps='always'
              extraData={this.props.tags}
              keyExtractor={item => item}
              data={this.state.searchIds}
              renderItem={this.renderRow}
            />
          }
          {
            this.state.isUpdate && !this.state.isEditing &&
            <View
              style={{
                flex: 1,
                //backgroundColor: 'red',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 30
              }}
            >
            {
              !this.state.isDelete &&
              <TextButton
                containerStyle={{ padding: 10 }}
                titleStyle={{ color: 'red' }}
                title='Delete'
                onPress={this.deleteTag}
              />
            }

            </View>
          }
        </View>
      </View>
      </KeyboardAvoidingView>
    );
  }

}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
  },
  topBar: {
    paddingTop: 44,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF'
  },
  modalTitle: {
    paddingTop: 5,
    fontSize: 17.5,
    fontWeight: '600',
    color: '$textColor'
  },
  section: {
    padding: 10,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
});

// const styles = EStyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '$backgroundColor',
//   },
//   icon: {
//     color: '$iconColor'
//   }
// });
const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {
  addTag,
  updateTag,
  deleteTag
})(TagModal);
