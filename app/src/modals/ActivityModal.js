import React from 'react';
import {
  View,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  FlatList
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import TextButton from '../components/TextButton';
import CustomTextInput from '../components/CustomTextInput';
import ActivityItem from '../components/ActivityItem';
import { SearchActivities, isActivityExist } from '../services/ActivityService';

import {
  addActivity,
  updateActivity,
  deleteActivity
} from '../actions/ActivityActions';

import SnackBar from '../services/SnackBar';
import { fakePromise } from '../services/Common';

const ERROR_MSG = 'Only these a-zA-Z0-9_!@#$& and space are allowed';
class ActivityModal extends React.Component {


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
    if (nextProps.activities.adding === false &&
       this.props.activities.adding === true &&
      _.isNull(nextProps.activities.addingError)) {
      await this.closeModal('Activity created!');
    } else if (nextProps.activities.adding === false &&
      this.props.activities.adding === true &&
      !_.isNull(nextProps.activities.addingError) &&
      !_.isUndefined(nextProps.activities.addingError)) {
      await this.closeModal(nextProps.activities.addingError.status);
    } else if (nextProps.activities.adding === false &&
      this.props.activities.adding === true &&
      _.isUndefined(nextProps.activities.addingError)) {
      await this.closeModal('Service down, please try later');
    }

    if (!nextProps.activities.updating &&
      this.props.activities.updating &&
      _.isNull(nextProps.activities.updatingError)) {
      await this.closeModal('Activity updated!');
    } else if (!nextProps.activities.updating &&
      this.props.activities.updating &&
      !_.isNull(nextProps.activities.updatingError) &&
      !_.isUndefined(nextProps.activities.updatingError)) {
      await this.closeModal(nextProps.activities.updatingError.status);
    } else if (!nextProps.activities.updating &&
      this.props.activities.updating &&
      _.isUndefined(nextProps.activities.updatingError)) {
      await this.closeModal('Service down, please try later');
    }

    if (!nextProps.activities.deleting &&
      this.props.activities.deleting &&
      _.isNull(nextProps.activities.deletingError)) {
      await this.closeModal('Activity deleted!');
    } else if (!nextProps.activities.deleting &&
      this.props.activities.deleting &&
      !_.isNull(nextProps.activities.deletingError) &&
      !_.isUndefined(nextProps.activities.deletingError)) {
      await this.closeModal(nextProps.activities.deletingError.status);
    } else if (!nextProps.activities.deleting &&
      this.props.activities.deleting &&
      _.isUndefined(nextProps.activities.deletingError)) {
      await this.closeModal('Service down, please try later');
    }
  }

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
        if (this.props.activity !== null) {
          this.setState({
            name: this.props.activity.name,
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
    const isExist = isActivityExist(this.props.activities.byId, this.state.name);
    if (isExist) {
      if (!_.isNull(this.props.activity) &&
        this.state.name.toLowerCase() === this.props.activity.name.toLowerCase()) {
        //this.closeModal();
      } else {
        this.setState({
          isValid: false,
          errorMsg: 'Activity already exists'
        });
        this.props.navigator.setButtons({
          rightButtons: [{
            id: 'save',
            title: 'Save',
            buttonColor: EStyleSheet.value('$iconColor')
          }]
        });
      }
      return false;
    }

    if (this.state.isUpdate) {
      this.props.updateActivity({ name: this.state.name, id: this.props.activity.id });
    } else {
      this.props.addActivity({ name: this.state.name });
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

    if (name.trim().length <= 3) {
      isValid = true;
    }

    clearTimeout(this.timeout);
    let searchIds = [];
    this.timeout = setTimeout(() => {
      if (isValid) {
        searchIds = SearchActivities(this.props.activities.byId, name);
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

  onItemPress = async (activityId) => {

    await this.props.navigator.push({
      screen: 'app.TagsScreen',
      title: 'Tags',
      passProps: {
        activity: this.props.activities.byId[activityId]
      }
    });
  }

  // async componentWilUnmount() {
  //   await this.props.navigator.dismissAllModals({
  //     animationType: 'none'
  //   });
  // }

  isValid = (name) => {
    const regex = /^[a-zA-Z0-9_!@#$&*-]{3,20}$/;
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
    if (!_.isNull(this.props.activity)) {
      name = this.props.activity.name;
    } else {
      name = 'Enter activity name';
    }
    return name;
  }

  deleteActivity = () => {
    Keyboard.dismiss();
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      Alert.alert(
        'Confirm',
        `Delete this activity ${this.props.activity.name}?`,
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
                this.props.deleteActivity(this.props.activity.id);
              });
            }
          },
        ],
        { cancelable: false }
      );
    }, 100);
  }

  renderRow = ({ item }) => {
    const { id, name } = this.props.activities.byId[item];
    return (
      <ActivityItem
        id={id}
        name={name}
        showEditIcon={false}
        onItemPress={this.onItemPress}
      />
    );
  };

  render() {
    let name = null;
    if (!_.isNull(this.props.activity)) {
      name = this.props.activity.name;
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
            label='Activity Name'
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
              extraData={this.props.activities}
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
                onPress={this.deleteActivity}
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
  addActivity,
  updateActivity,
  deleteActivity
})(ActivityModal);
