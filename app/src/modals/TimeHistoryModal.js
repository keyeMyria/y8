import React from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  DatePickerIOS
} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import TextButton from '../components/TextButton';
import TimeIconButton from '../components/TimeIconButton';

import {
  createTime,
  updateTime,
  deleteTime
} from '../actions/TimeActions';

import SnackBar from '../services/SnackBar';
import { fakePromise } from '../services/Common';

class TimeHistoryModal extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      chosenStartTime: new Date(),
      chosenEndTime: new Date(),
      editableStartTime: true,
      editableEndTime: true,
      isUpdate: false,
      isDelete: false
    };

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
      this.props.navigator.setStyle({
        navBarSubtitleColor: EStyleSheet.value('$subTextColor'),
        navBarSubtitleFontSize: 12,
      });
    }
  }

  componentDidMount() {
    this.setOfflineMode();
    const { time } = this.props;
    if (!_.isNil(time)) {
      this.setState({
        chosenStartTime: new Date(time.startedTimestamp),
        chosenEndTime: new Date(time.stoppedTimestamp),
        isUpdate: true
      });
    }
  }

  componentDidUpdate(nextProps) {
    this.setOfflineMode();
    if (nextProps.timesByGroup.createLoading === true &&
       this.props.timesByGroup.createLoading === false &&
      _.isNull(nextProps.timesByGroup.error)) {
      this.closeModal('Time created!');
    } else if (nextProps.timesByGroup.createLoading === true &&
      this.props.timesByGroup.createLoading === false &&
      !_.isNull(nextProps.timesByGroup.error) &&
      !_.isUndefined(nextProps.timesByGroup.error)) {
      this.closeModal(nextProps.timesByGroup.error.status);
    } else if (nextProps.timesByGroup.createLoading === true &&
      this.props.timesByGroup.createLoading === false &&
      _.isUndefined(nextProps.timesByGroup.error)) {
      this.closeModal('Service down, please try later');
    }

    if (nextProps.timesByGroup.updateLoading === true &&
       this.props.timesByGroup.updateLoading === false &&
      _.isNull(nextProps.timesByGroup.error)) {
      this.closeModal('Time updated!');
    } else if (nextProps.timesByGroup.updateLoading === true &&
      this.props.timesByGroup.updateLoading === false &&
      !_.isNull(nextProps.timesByGroup.error) &&
      !_.isUndefined(nextProps.timesByGroup.error)) {
      this.closeModal(nextProps.timesByGroup.error.status);
    } else if (nextProps.timesByGroup.updateLoading === true &&
      this.props.timesByGroup.updateLoading === false &&
      _.isUndefined(nextProps.timesByGroup.error)) {
      this.closeModal('Service down, please try later');
    }

    if (nextProps.timesByGroup.deleteLoading === true &&
       this.props.timesByGroup.deleteLoading === false &&
      _.isNull(nextProps.timesByGroup.error)) {
      this.closeModal('Time deleted!');
    } else if (nextProps.timesByGroup.deleteLoading === true &&
      this.props.timesByGroup.deleteLoading === false &&
      !_.isNull(nextProps.timesByGroup.error) &&
      !_.isUndefined(nextProps.timesByGroup.error)) {
      this.closeModal(nextProps.timesByGroup.error.status);
    } else if (nextProps.timesByGroup.deleteLoading === true &&
      this.props.timesByGroup.deleteLoading === false &&
      _.isUndefined(nextProps.timesByGroup.error)) {
      this.closeModal('Service down, please try later');
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
      if (event.id === 'didAppear') {
      }
    }
  };

  onSave = () => {
    this.props.navigator.setButtons({
      rightButtons: [{
        id: 'loader',
        component: 'app.Loader'
      }]
    });
    const { chosenStartTime, chosenEndTime } = this.state;

    if (this.state.isUpdate) {
      this.props.updateTime(
        this.props.groupId,
        this.props.time.id,
        moment(chosenStartTime).valueOf(),
        moment(chosenEndTime).valueOf()
      );
    } else {
      this.props.createTime(
        this.props.groupId,
        moment(chosenStartTime).valueOf(),
        moment(chosenEndTime).valueOf()
      );
    }
  }

  deleteTime = () => {
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      Alert.alert(
        'Confirm',
        'Delete this entry',
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
                this.props.deleteTime(this.props.groupId, this.props.time.id);
              });
            }
          },
        ],
        { cancelable: false }
      );
    }, 100);
  }

  setOfflineMode = () => {
    let subtitle = null;
    if (this.props.network.offlineMode) {
      subtitle = 'offline mode';
    }
    this.props.navigator.setSubTitle({
      subtitle
    });
  }

  setModalVisible = (visible, type) => {
      const newState = {
        modalVisible: visible
      };

      //this.setState({ modalVisible: visible });
      if (!visible) {
        newState.editableStartTime = true;
        newState.editableEndTime = true;
        //this.setState({ editableStartTime: true });
        //this.setState({ editableEndTime: true });
      }
      if (type === 'start') {
        newState.editableStartTime = false;
        newState.startTime = true;
        newState.endTime = false;

        //this.setState({ editableStartTime: false, startTime: true, endTime: false });
      } else if (type === 'end') {
        newState.editableStartTime = false;
        newState.startTime = false;
        newState.endTime = true;
      }
      this.setState(newState);
  }
  setStartTime = (newTime) => {
    this.setState({ chosenStartTime: newTime });

    if (newTime !== this.state.chosenEndTime) {
      this.props.navigator.setButtons({
        rightButtons: [{
          id: 'save',
          title: 'Save',
          disabled: false,
          buttonColor: EStyleSheet.value('$iconColor')
        }]
      });
    }
  }
  setEndTime = (newTime) => {
    this.setState({ chosenEndTime: newTime });
    if (newTime !== this.state.chosenStartTime) {
      this.props.navigator.setButtons({
        rightButtons: [{
          id: 'save',
          title: 'Save',
          disabled: false,
          buttonColor: EStyleSheet.value('$iconColor')
        }]
      });
    }
  }

  closeModal = async (msg) => {
    await fakePromise(100);
    SnackBar(msg);
    await this.props.navigator.dismissModal({
      animationType: msg !== '' ? 'none' : 'slide-down'// 'none' / 'slide-down'
    });
  }

  defaultValueStartTime = () => {
    return moment(this.state.chosenStartTime).format('YYYY MMM, ddd Do, h:mm a');
  }
  defaultValueEndTime = () => {
    return moment(this.state.chosenEndTime).format('YYYY MMM, ddd Do, h:mm a');
  }
  renderActivityHeader = () => {
    const { activityName, sentence } = this.props;
    return (
      <View
        style={{
          backgroundColor: EStyleSheet.value('$backgroundColor'),
          justifyContent: 'center',
          paddingBottom: 15,
          paddingTop: 15,
          paddingHorizontal: 10
        }}
      >
        <Text
          style={{
            fontSize: 21,
            fontWeight: '600',
            color: EStyleSheet.value('$textColor')
          }}
        >
        {activityName}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: EStyleSheet.value('$textColor'),
            letterSpacing: 0.8,
          }}
        >{sentence}</Text>

      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderActivityHeader()}
        <View
          style={{
            paddingTop: 20,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View>
            <Text style={[styles.label]}>Start Time</Text>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true, 'start');
              }}
              style={{
                flexDirection: 'row'
              }}
            >
              <View style={[styles.timeLabel]}>
                <Text
                  style={{
                    fontSize: 18,
                    color: EStyleSheet.value('$textColor')
                  }}
                >{this.defaultValueStartTime()}</Text>
              </View>
              <TimeIconButton
                outerContainer={{
                  alignItems: 'flex-start',
                  justifyContent: 'center'
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: 0
                }}
                onPress={() => {
                  this.setModalVisible(true, 'start');
                }}
              />
              </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            paddingTop: 15,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View>
            <Text style={[styles.label]}>End Time</Text>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true, 'end');
              }}
              style={{
                flexDirection: 'row'
              }}
            >
              <View style={[styles.timeLabel]}>
                <Text
                  style={{
                    fontSize: 18,
                    color: EStyleSheet.value('$textColor')
                  }}
                >{this.defaultValueEndTime()}</Text>
              </View>
              <TimeIconButton
                outerContainer={{
                  alignItems: 'flex-start',
                  justifyContent: 'center'
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: 0
                }}
                onPress={() => {
                  this.setModalVisible(true, 'end');
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 40
            }}
          >
          {
            !this.state.isDelete &&
            <TextButton
              containerStyle={{ padding: 10 }}
              titleStyle={{ color: 'red' }}
              title='Delete'
              onPress={this.deleteTime}
            />
          }
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}
        >
          <View
            style={{
              flex: 1,
              //marginTop: 22,
              justifyContent: 'flex-end',
              flexDirection: 'column',
              backgroundColor: 'rgba(107, 112, 123, 0.3)'
            }}
          >
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderTopWidth: 0.25,
                borderTopColor: 'rgba(107, 112, 123, 0.5)',
                alignItems: 'flex-end' }}
            >
              <TextButton
                containerStyle={{ paddingTop: 5, paddingRight: 10 }}
                titleStyle={{ color: EStyleSheet.value('$iconColor') }}
                title='Done'
                onPress={() => {
                  this.setModalVisible(false, '');
                }}
              />
            </View>
            <View style={{ backgroundColor: '#FFFFFF' }}>
              {
                (this.state.startTime === true && this.state.endTime === false) &&
                <DatePickerIOS
                  maximumDate={this.state.chosenEndTime}
                  mode='datetime'
                  date={this.state.chosenStartTime}
                  onDateChange={this.setStartTime}
                />
              }
              {
                (this.state.startTime === false && this.state.endTime === true) &&
                <DatePickerIOS
                  minimumDate={this.state.chosenStartTime}
                  mode='datetime'
                  date={this.state.chosenEndTime}
                  onDateChange={this.setEndTime}
                />
              }

            </View>
          </View>
        </Modal>
      </View>
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
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '$textColor',
    marginLeft: 3,
    marginBottom: 3
  },
  timeLabel: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 5
  }
});

const mapStateToProps = (state) => (
  {
    network: state.network,
    timesByGroup: state.timesByGroup
  }
);
export default connect(mapStateToProps, {
  createTime,
  updateTime,
  deleteTime
})(TimeHistoryModal);
