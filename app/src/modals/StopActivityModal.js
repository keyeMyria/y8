import React from 'react';
import {
  View,
  ScrollView,
  Text,
  DatePickerIOS
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import TextButton from '../components/TextButton';
import {
  stopActivity,
} from '../actions/TimeActions';

class StopActivityModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date(), chosenTime: new Date() };
  }
  setDate = (newDate) => {
    this.setState({
      chosenDate: newDate,
      chosenTime: newDate
    });
  }
  setTime = (newTime) => {
    this.setState({ chosenTime: newTime });
  }
  closeModal = () => {
    this.props.navigator.dismissModal({
      animationType: 'none' // : 'slide-down'// 'none' / 'slide-down'
    });
  }

  render() {
    const { timeId, activityId, groupId } = this.props;
    let { name } = this.props.activities.byId[activityId];
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    const { tagsGroup } = this.props.myActivities.byActivityId[activityId].byGroupId[groupId];
    const sentence = tagsGroup.map((id) => `${this.props.tags.byId[id].name} `);
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.5)' }}>
      <View style={styles.container}>
      <ScrollView
        style={{
          maxHeight: 65,
        }}
      >
        <Text
          style={{
            fontSize: 21,
            fontWeight: '600',
            color: EStyleSheet.value('$textColor')
          }}
        >
        {name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: EStyleSheet.value('$textColor'),
            letterSpacing: 0.8,
          }}
        >{sentence}</Text>
        </ScrollView>
        <DatePickerIOS
          style={{ padding: 0 }}
          mode='date'
          date={this.state.chosenDate}
          onDateChange={this.setDate}
        />
        <DatePickerIOS
          mode='time'
          date={this.state.chosenTime}
          onDateChange={this.setTime}
        />
        <Text>{this.state.chosenTime.toString()}</Text>
        <View
          style={{
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
        <TextButton
          disabled={false}
          title={'Cancel'}
          titleStyle={{
            fontSize: 21,
            color: EStyleSheet.value('$textColor'),
            fontWeight: '600'
          }}
          containerStyle={{
            borderWidth: 0.3,
            borderRadius: 3,
            borderColor: EStyleSheet.value('$textColor'),
            height: 40,
          }}
          onPress={() => {
            this.closeModal();
          }}
        />
        <TextButton
          disabled={false}
          title={'STOP'}
          titleStyle={{
            fontSize: 21,
            color: true ? 'rgba(255, 51, 79,0.8)' : '#38B211',
            fontWeight: '600'
          }}
          containerStyle={{
            borderWidth: 0.3,
            borderRadius: 3,
            borderColor: true ? 'rgba(255, 51, 79,0.8)' : '#38B211',
            height: 40,
            width: 100
          }}
          onPress={() => {
            const stoppedAt = moment(this.state.newTime).valueOf();
            this.props.stopActivity(timeId, activityId, groupId, stoppedAt);
            this.closeModal();
          }}
        />
        </View>

      </View>
      </View>

    );
  }

}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
    margin: 20,
    padding: 20,
    //paddingTop: 30,
    borderRadius: 10
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
    tags: state.tags,
    myActivities: state.myActivities
  }
);
export default connect(mapStateToProps, {
  stopActivity
})(StopActivityModal);
