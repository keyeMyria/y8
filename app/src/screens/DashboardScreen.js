import _ from 'lodash';
import React from 'react';
import {
  View,
  Platform,
  FlatList,
  UIManager,
  RefreshControl,
  Text,
  Modal,
  ScrollView,
  DatePickerIOS,
  //NetInfo,
  //AppState
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Feather from 'react-native-vector-icons/Feather';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';
import ActivityCard from '../components/ActivityCard';
import PushNotifications from '../pushnotifications';
import TextButton from '../components/TextButton';

import {
  startActivity,
  stopActivity,
  toggleActivity,
} from '../actions/TimeActions';

import {
  getTags,
} from '../actions/TagActions';

import {
  setConnectionStatus
} from '../actions/ConnectionActions';

import {
  offlineRequest
} from '../actions/OfflineActions';

// import {
//   getMyActivities
// } from '../actions/MyActivityActions';

import {
  getMyActivities
} from '../actions/GroupActions';


const iconColor = 'rgba(221,93,89,1)';
let ADD_ICON;
Feather.getImageSource('plus', 30, iconColor).then((source) => {
  ADD_ICON = source;
});

class DashboardScreen extends React.Component {
  static navigatorStyle = {

  };

  constructor(props) {
    super(props);
    console.log('screenInstanceID', props.navigator.screenInstanceID);
    this.timeout = 0;
    this.state = {
      addingMyActivity: false,
      refreshing: false,
      rand: 0,
      stopModalVisible: false,
      stopModalObj: false
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
       UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    if (this.props.navigator) {
      // Feather.getImageSource('plus', 30, styles._icon.color).then((source) => {
      //   this.props.navigator.setButtons({
      //     rightButtons: [{
      //       id: 'add',
      //       icon: source,
      //       disableIconTint: true, // disable default color,
      //     }]
      //   });
      // });
      // if you want to listen on navigator events, set this up
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
      // this.props.navigator.setSubTitle({
      //   subtitle: 'offline',
      //   navBarSubtitleFontSize: 3,
      //   navBarSubtitleColor: 'red',
      // });
      // this.props.navigator.setStyle({
      //   //largeTitle: true,
      //
      //   //navBarBackgroundColor: 'blue',
      //   navBarSubtitleFontSize: 3,
      //   navBarSubtitleColor: 'red',
      // });
      this.props.navigator.setStyle({
        //largeTitle: true,
        //navBarBackgroundColor: 'lightblue',
        navBarSubtitleColor: EStyleSheet.value('$subTextColor'),
        navBarSubtitleFontSize: 12,
      });
    }
  }

  async componentDidMount() {
    console.log('componentDidMount Dashboard');
    //TODO
    //await this.props.getTimes();
    this.props.getMyActivities({ page: 1 });
    //this.props.getTags();
  }

  async componentDidUpdate(nextProps) {
    this.setOfflineMode();

    if (nextProps.myActivities.addingMyActivity &&
      !this.props.myActivities.addingMyActivity &&
      _.isNull(this.props.myActivities.error)) {
      await this.showSnackBar('Added to your activities!');
    } else if (nextProps.myActivities.addingMyActivity &&
      !this.props.myActivities.addingMyActivity &&
      !_.isNull(this.props.myActivities.error) &&
      !_.isUndefined(this.props.myActivities.error)) {
      await this.showSnackBar(this.props.myActivities.error.status);
    } else if (nextProps.myActivities.addingMyActivity &&
      !this.props.myActivities.addingMyActivity &&
      _.isUndefined(this.props.myActivities.error)) {
      await this.showSnackBar('Service down, please try later');
    }

    if (nextProps.myActivities.addingGroup &&
      !this.props.myActivities.addingGroup &&
      _.isNull(this.props.myActivities.error)) {
      await this.showSnackBar('Added to your activities!');
    } else if (nextProps.myActivities.addingGroup &&
      !this.props.myActivities.addingGroup &&
      !_.isNull(this.props.myActivities.error) &&
      !_.isUndefined(this.props.myActivities.error)) {
      await this.showSnackBar(this.props.myActivities.error.status);
    } else if (nextProps.myActivities.addingGroup &&
      !this.props.myActivities.addingGroup &&
      _.isUndefined(this.props.myActivities.error)) {
      await this.showSnackBar('Service down, please try later');
    }
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        this.props.navigator.push({
          screen: 'app.ActivitiesScreen',
          title: 'Activities',
          backButtonTitle: 'Back',
          navigatorButtons: {
            rightButtons: [{
              id: 'add',
              icon: ADD_ICON,
              disableIconTint: true, // disable default color,
            }]
          }
        });
      }
    }
  }

  onRefresh = () => {
    this.props.getMyActivities({ page: 1 });

    // console.log('onRefresh');
    // this.setState({
    //   refreshing: true
    // }, () => {
    //   this.timeout = setTimeout(() => {
    //     clearTimeout(this.timeout);
    //     this.setState({
    //       refreshing: false
    //     });
    //   }, 800);
    // });
  }


  onSharePress = (groupId, activity, sentence, started) => {
    console.log(groupId, activity, sentence);
    this.props.navigator.push({
      screen: 'app.ShareScreen',
      title: 'Share',
      passProps: {
        prevGroupId: null, //this.props.prevGroupId,
        prevTimeId: null, // remove this
        activity,
        isExisted: true,
        groupId,
        //selectedTags: this.state.selectedTags,
        sentence,
        started
      },
      //backButtonTitle: 'Back',
      navigatorButtons: {}
    });
  }
  onTimeHistoryPress = (activityId, groupId, activityName, sentence) => {
    this.props.navigator.push({
      screen: 'app.TimeHistoryScreen',
      title: 'History',
      passProps: {
        activityId, groupId, activityName, sentence
      },
      navigatorButtons: {
        rightButtons: [{
          id: 'add',
          icon: ADD_ICON,
          disableIconTint: true, // disable default color,
        }]
      }
    });
  }
  onStatsPress = (activity) => {
    this.props.navigator.push({
      screen: 'app.StatsScreen',
      title: 'Statistics',
      passProps: {
        activity
      }
    });
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


  showSnackBar = (msg) => {
    Snackbar.show({
        title: msg,
        duration: Snackbar.LENGTH_SHORT,
    });
  }

  showTags = (activityId, prevGroupId) => {
    this.props.navigator.push({
      screen: 'app.TagsScreen',
      title: 'Tags',
      passProps: {
        prevGroupId,
        //prevTimeId,
        activity: this.props.activities.byId[activityId]
      }
    });
  }
  scrollToOffset = () => {
    this.flatListRef.scrollToIndex({ animated: true, index: 0 });
    //this.flatListRef.scrollToOffset({ x: 0, y: 0, animated: true });
  }

  loadMore = () => {
    let { page } = this.props.myActivities;
    const { totalPages } = this.props.myActivities;
    page += 1;
    if (page <= totalPages) {
      //console.log('loadMore', page, totalPages);
      this.props.getMyActivities({ page });
    }
  }

  stopActivity = (timeId, activityId, groupId, activityName, sentence, timeDiff, startedAt) => {

    const maximumDate = new Date();
    this.setState({
      stopModalVisible: true,
      stopModalObj: {
        activityName,
        sentence,
        timeDiff,
        startedAt,
        timeId,
        activityId,
        groupId,
        minimumDate: new Date(startedAt),
        maximumDate,
        chosenTime: maximumDate,
      }
    });
    /*this.props.navigator.showLightBox({
      screen: 'app.StopActivityModal',
      //title: 'Create Activity',
      passProps: {
        timeId, activityId, groupId, activityName, sentence, timeDiff, startedAt
      },
      // navigatorStyle: {
      //   navBarHidden: true,
      //   navBarTextColor: EStyleSheet.value('$textColor')
      // },
      // style: {
      //   backgroundBlur: 'light', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
      //   backgroundColor: 'alpha', // tint color for the background, you can specify alpha here (optional)
      //   tapBackgroundToDismiss: true // dismisses LightBox on background taps (optional)
      // },
      //adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
      //animationType: 'none' // none , slide-up
    });
    //this.props.stopActivity(timeId, activityId, groupId);
    */
  }

  setTime = (newTime) => {
    const newState = Object.assign({}, this.state);
    newState.stopModalObj.chosenTime = newTime;
    this.setState(newState);
  }

  renderRow = ({ item }) => {
    const activityId = item;
    const { activities, tags, myActivities, times } = this.props;
    const { name } = activities.byId[activityId];

    const groupId = myActivities.byActivityId[activityId].allGroupIds[0]; // latest groupId
    const { tagsGroup, sharedWith, groupTimes } = myActivities.byActivityId[activityId].byGroupId[groupId];

    //const tagsGroup = Array.from(tagsGroup);
    //tagsGroup = Array.from(tagsGroup);

    let individualLoading = false;
    let loading = false;
    if (times.loading !== false) {
      loading = true;
      if (times.loading.activityId === activityId && times.loading.groupId === groupId) {
        individualLoading = true;
      }
    }

    let timeId = null;
    let startedAt = null;
    let stoppedAt = null;

    if (!_.isNil(groupTimes) && groupTimes.length > 0) {
      if (groupTimes[0]._id !== '') {
        timeId = groupTimes[0]._id;
      }
      if (groupTimes[0].startedAt !== '') {
        startedAt = groupTimes[0].startedAt;
      }
      if (groupTimes[0].stoppedAt !== '') {
        stoppedAt = groupTimes[0].stoppedAt;
      }
    }


    let startedTag = null;
    let stoppedTag = null;
    let rand = 0;

    if (!_.isNil(startedAt) && _.isNil(stoppedAt)) {
      const currSecs1 = moment.duration(moment().valueOf() - startedAt).asSeconds();
      if (currSecs1 < 1440) {
        rand = moment().valueOf();
      }
      startedTag = `started ${moment(startedAt).fromNow()}`;
    } else if (!_.isNil(startedAt) && !_.isNil(stoppedAt)) {
      const currSecs2 = moment.duration(moment().valueOf() - stoppedAt).asSeconds();
      if (currSecs2 < 1440) {
        rand = moment().valueOf();
      }

      const duration = moment.duration(stoppedAt - startedAt);
      let hrs = duration.hours();
      let mins = duration.minutes();
      let secs = duration.seconds();

      if (hrs !== 0) {
        hrs = `${hrs}h `;
      } else {
        hrs = '';
      }
      if (mins !== 0) {
        mins = `${mins}m `;
      } else {
        mins = '';
      }

      secs = `${secs}s `;
      const diff = `${hrs}${mins}${secs}`;

      stoppedTag = `stopped ${moment(stoppedAt).fromNow()} - ${diff}`;
    }
    //console.log('TIMEID@#$@#$@#$@#$@#asdf', timeId, startedAt, stoppedAt);

    return (
      <ActivityCard
        offlineMode={this.props.network.offlineMode}
        individualLoading={individualLoading}
        loading={loading}
        activityId={activityId}
        name={name}
        groupId={groupId}
        sharedWith={sharedWith}
        tagsGroup={tagsGroup}
        tags={tags}
        timeId={timeId}
        startedAt={startedAt}
        stoppedAt={stoppedAt}
        startedTag={startedTag}
        stoppedTag={stoppedTag}
        showTags={this.showTags}
        startActivity={this.props.startActivity}
        stopActivity={this.stopActivity}
        toggleActivity={this.props.toggleActivity}
        scrollToOffset={this.scrollToOffset}
        onSharePress={this.onSharePress}
        onTimeHistoryPress={this.onTimeHistoryPress}
        onStatsPress={this.onStatsPress}
        rand={rand}
        //rand={this.state.refreshing}
      />
    );
  }

  render() {
    const { myActivities, tags, activities } = this.props;

    //const { refreshing } = myActivities;
    return (
      <View style={styles.container}>
        <FlatList
          //removeClippedSubviews={false}
          keyboardShouldPersistTaps='always'
          ref={(ref) => { this.flatListRef = ref; }}
          extraData={{ myActivities, tags, activities, rand: this.state.rand }}
          //ListHeaderComponent={this.renderListHeader}
          keyExtractor={item => item}
          data={myActivities.allActivityIds}
          renderItem={this.renderRow}
          //ListFooterComponent={this.renderListFooter}
          refreshControl={
            <RefreshControl
              refreshing={myActivities.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.2}

        />

        <Modal
          animationType="fade"
          transparent
          visible={this.state.stopModalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}
        >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(107, 112, 123, 0.8)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              //flex: 1,
              backgroundColor: '#ffffff',
              margin: 20,
              padding: 20,
              borderRadius: 10,
            }}
          >
          <Text
            style={{
              fontSize: 21,
              fontWeight: '600',
              color: EStyleSheet.value('$textColor')
            }}
          >
          {this.state.stopModalObj.activityName}
          </Text>
          <ScrollView
            style={{
              maxHeight: 55,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: EStyleSheet.value('$textColor'),
                letterSpacing: 0.8,
              }}
            >{this.state.stopModalObj.sentence}</Text>
            </ScrollView>
            <View style={{ paddingBottom: 5, borderBottomWidth: 1, borderColor: EStyleSheet.value('$subTextColor') }}>
              <Text
                style={{
                  paddingTop: 10,
                  //backgroundColor: 'red',
                  color: EStyleSheet.value('$subTextColor'),
                  textAlign: 'right',
                }}
              >{this.state.stopModalObj.timeDiff}</Text>
            </View>
            <DatePickerIOS
              minimumDate={this.state.stopModalObj.minimumDate}
              maximumDate={this.state.stopModalObj.maximumDate}
              mode='datetime'
              date={this.state.stopModalObj.chosenTime}
              onDateChange={this.setTime}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center' }}>
              <Text
                style={{
                  color: EStyleSheet.value('$textColor'),
                  fontSize: 18
                }}
              >
                {
                  this.state.stopModalObj &&
                  moment(this.state.stopModalObj.chosenTime).format('ddd MMMM Do YYYY, h:mm:ss a')}
              </Text>
            </View>
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
                this.setState({ stopModalVisible: false });
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
                const stoppedAt = moment(this.state.stopModalObj.chosenTime).valueOf();
                this.props.stopActivity(
                  this.state.stopModalObj.timeId,
                  this.state.stopModalObj.activityId,
                  this.state.stopModalObj.groupId,
                  stoppedAt);
                  this.setState({ stopModalVisible: false });
              }}
            />
            </View>
          </View>
        </View>
        </Modal>
        <Spinner
          visible={
            this.props.myActivities.addingGroup ||
            //this.props.myActivities.removingTag ||
            //this.props.myActivities.removingGroup ||
            this.props.myActivities.addingMyActivity
          }
          color={EStyleSheet.value('$textColor')}
          textContent={'Loading...'}
          textStyle={{ color: EStyleSheet.value('$textColor') }}
        />

        <PushNotifications navigator={this.props.navigator} />

      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    backgroundColor: '$backgroundColor',
  },
  icon: {
    color: '$iconColor'
  }

});

const mapStateToProps = (state) => {
  //console.log('DashboardScreen:mapStateToProps:', state);
  const { myActivities, activities, tags, times, network, device } = state;
  return {
    myActivities,
    activities,
    tags,
    times,
    network,
    device
  };
};
export default connect(mapStateToProps, {
  stopActivity,
  startActivity,
  toggleActivity,
  getMyActivities,
  getTags,
  setConnectionStatus,
  offlineRequest,
})(DashboardScreen);
