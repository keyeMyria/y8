import React from 'react';
import {
  View,
  Text,
  //Alert,
  TouchableOpacity,
  Modal,
  DatePickerIOS
} from 'react-native';
import moment from 'moment';
//import _ from 'lodash';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import TextButton from '../components/TextButton';
import CustomTextInput from '../components/CustomTextInput';
import TimeIconButton from '../components/TimeIconButton';

import {
  addTime,
  updateTime,
  deleteTime
} from '../actions/TimeActions';

import SnackBar from '../services/SnackBar';
import { fakePromise } from '../services/Common';

class TimeModal extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      chosenStartTime: new Date(),
      chosenEndTime: new Date(),
      editableStartTime: true,
      editableEndTime: true,
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
  }

  /*
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
  }*/

  componentDidUpdate() {
    this.setOfflineMode();
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.closeModal('');
      } else if (event.id === 'save') {
        //this.onSave();
      }
    } else if (event.type === 'ScreenChangedEvent') {
      if (event.id === 'didAppear') {
      }
    }
  };

  onSave = () => {

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

  closeModal = async (msg) => {
    await fakePromise(100);
    SnackBar(msg);
    await this.props.navigator.dismissModal({
      animationType: msg !== '' ? 'none' : 'slide-down'// 'none' / 'slide-down'
    });
  }


  deleteTime = () => {
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

  defaultValueStartTime = () => {
    return moment(this.state.chosenStartTime).format('YYYY MMM, ddd Do, h:mm a');
  }
  defaultValueEndTime = () => {
    return moment(this.state.chosenEndTime).format('YYYY MMM, ddd Do, h:mm a');
  }

  setModalVisible = (visible, type) => {
      this.setState({ modalVisible: visible });
      if (!visible) {
        this.setState({ editableStartTime: true });
        this.setState({ editableEndTime: true });
      }
      if (type === 'start') {
        this.setState({ editableStartTime: false, startTime: true, endTime: false });
      } else if (type === 'end') {
        this.setState({ editableEndTime: false, startTime: false, endTime: true });
      }
  }
  setStartTime = (newTime) => {
    this.setState({ chosenStartTime: newTime });
  }
  setEndTime = (newTime) => {
    this.setState({ chosenEndTime: newTime });
  }
  onFocusStartTime = () => {
    this.setState({ editableStartTime: false, startTime: true, endTime: false });
    this.setModalVisible(true, 'start');
  }
  onFocusEndTime = () => {
    this.setState({ editableEndTime: false, startTime: false, endTime: true });
    this.setModalVisible(true, 'end');
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderActivityHeader()}
        <View
          style={{
            //backgroundColor: 'grey',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CustomTextInput
            editable={this.state.editableStartTime}
            containerStyle={{ width: '80%', marginHorizontal: 0, padding: 5 }}
            label='Start Time'
            placeholderText={'Start Time'}
            defaultValue={this.defaultValueStartTime()}
            textInputStyle={{ fontSize: 18 }}
            onFocus={this.onFocusStartTime}
          />
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
        </View>
        <View
          style={{
            //backgroundColor: 'lightblue',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CustomTextInput
            editable={this.state.editableEndTime}
            containerStyle={{ width: '80%', marginHorizontal: 0, padding: 5 }}
            label='End Time'
            placeholderText={'End Time'}
            defaultValue={this.defaultValueEndTime()}
            textInputStyle={{ fontSize: 18 }}
            onFocus={this.onFocusEndTime}
          />
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
        </View>

        <Modal
          style={{ backgroundColor: 'lightpink' }}
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
              marginTop: 22,
              justifyContent: 'flex-end',
              flexDirection: 'column'
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

const mapStateToProps = (state) => (
  {
    network: state.network,
    activities: state.activities,
  }
);
export default connect(mapStateToProps, {
  addTime,
  updateTime,
  deleteTime
})(TimeModal);
