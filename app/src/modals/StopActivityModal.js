import React from 'react';
import {
  View,
  ScrollView,
  Text,
  DatePickerIOS,
  LayoutAnimation,
  Dimensions
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import TextButton from '../components/TextButton';
import {
  stopActivity,
} from '../actions/TimeActions';

let {width, height} = Dimensions.get('window');
class StopActivityModal extends React.Component {

  constructor(props) {
    super(props);
    const maximumDate = new Date();
    this.state = {
      minimumDate: maximumDate,
      maximumDate,
      chosenTime: maximumDate,
      screenloaded: false
    };
    if (this.props.navigator) {
      // if you want to listen on navigator events, set this up
      //this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
  }
  componentDidMount() {
    this.setState({
      minimumDate: new Date(this.props.startedAt),
      screenloaded: true
    });
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onNavigatorEvent = (event) => {
    if (event.id === 'didAppear') {
      this.setState({
        screenloaded: true
      });
    }
  };


  setTime = (newTime) => {
    this.setState({ chosenTime: newTime });
  }
  closeModal = () => {
    this.props.navigator.dismissLightBox();
    // this.props.navigator.dismissModal({
    //   animationType: 'none' // : 'slide-down'// 'none' / 'slide-down'
    // });
  }

  render() {
    const { timeId, activityId, groupId, activityName, sentence, timeDiff } = this.props;

    return (
      <View style={{ width, height, flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.5)' }}>
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
        {activityName}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: EStyleSheet.value('$textColor'),
            letterSpacing: 0.8,
          }}
        >{sentence}</Text>
        </ScrollView>
        <View style={{ paddingBottom: 5, borderBottomWidth: 1, borderColor: EStyleSheet.value('$subTextColor') }}>
          <Text
            style={{
              paddingTop: 10,
              //backgroundColor: 'red',
              color: EStyleSheet.value('$subTextColor'),
              textAlign: 'right',
            }}
          >{timeDiff}</Text>
        </View>
        {
          this.state.screenloaded &&
          <DatePickerIOS
            minimumDate={this.state.minimumDate}
            maximumDate={this.state.maximumDate}
            mode='datetime'
            date={this.state.chosenTime}
            onDateChange={this.setTime}
          />
        }
        {
          this.state.screenloaded &&
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center' }}>
            <Text
              style={{
                color: EStyleSheet.value('$textColor'),
                fontSize: 14
              }}
            >
              {this.state.chosenTime.toString()}
            </Text>
          </View>

        }

        {
          this.state.screenloaded &&
          <View
            style={{
              paddingTop: 30,
              flexDirection: 'row',
              justifyContent: 'space-around'
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

            }}
            onPress={() => {
              const stoppedAt = moment(this.state.chosenTime).valueOf();
              this.props.stopActivity(timeId, activityId, groupId, stoppedAt);
              this.closeModal();
            }}
          />
          </View>
        }


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
    marginVertical: 125,
    borderRadius: 10,
  }
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
  }
);
export default connect(mapStateToProps, {
  stopActivity
})(StopActivityModal);
