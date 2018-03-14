import _ from 'lodash';
import React from 'react';
import {
  View,
  Platform,
  FlatList,
  UIManager,
  RefreshControl,
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

import {
  toggleActivity
} from '../actions/TimeActions';

import {
  getActivities,
} from '../actions/ActivityActions';

import {
  getTags,
} from '../actions/TagActions';


import {
  setConnectionStatus
} from '../actions/ConnectionActions';

import {
  offlineRequest
} from '../actions/OfflineActions';

import {
  getMyActivities
} from '../actions/MyActivityActions';

import {
  loadInitData
} from '../actions/InitDataLoadingAction';

const iconColor = 'rgba(221,93,89,1)';
let ADD_ICON;
Feather.getImageSource('plus', 30, iconColor).then((source) => {
  ADD_ICON = source;
});

class DashboardScreen extends React.Component {
  static navigatorStyle = {
    //navBarBackgroundColor: 'blue'
  };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      rand: 0,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
       UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    if (this.props.navigator) {
      Feather.getImageSource('plus', 30, styles._icon.color).then((source) => {
        this.props.navigator.setButtons({
          rightButtons: [{
            id: 'add',
            icon: source,
            disableIconTint: true, // disable default color,
          }]
        });
      });
      // if you want to listen on navigator events, set this up
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
  }

  componentDidMount() {
    console.log('componentDidMount Dashboard');
  }

  async componentDidUpdate(nextProps) {
    if (nextProps.myActivities.addingMyActivity &&
      !this.props.myActivities.addingMyActivity) {
      await this.showSnackBar('Added to your activities!');
    }
    if (nextProps.myActivities.addingGroup &&
      !this.props.myActivities.addingGroup) {
      await this.showSnackBar('Added to your activities!');
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
    this.props.getMyActivities();
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false, rand: moment().valueOf() });
      //this.props.alertWithType('error', 'Fetch', 'Complete!');
    }, 800);
  }

  showSnackBar = (msg) => {
    Snackbar.show({
        title: msg,
        duration: Snackbar.LENGTH_SHORT,
    });
  }

  handleConnectionChange = (isConnected) => {
    this.props.setConnectionStatus(isConnected);
    if (isConnected) {
      this.props.getActivities();
      this.props.getTags();
    }
    if (isConnected && this.props.offlineQueue.payloads.length > 0) {
      this.props.offlineRequest();
    }
  };

  /*handleAppStateChange = (nextAppState) => {
    //if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    if (nextAppState === 'active') {
      console.log('App has come to the foreground!');
      this.props.offlineRequest();
    }
    //this.setState({ appState: nextAppState });
  }*/

  showTags = (activityId) => {
    this.props.navigator.push({
      screen: 'app.TagsScreen',
      title: 'Tags',
      passProps: {
        activity: this.props.activities.byId[activityId]
      }
    });
    // this.props.navigation.navigate('tags', {
    //   activity: this.props.activities.byId[activityId]
    // });
  }
  scrollToOffset = () => {
    this.flatListRef.scrollToIndex({ animated: true, index: 0 });
    //this.flatListRef.scrollToOffset({ x: 0, y: 0, animated: true });
  }
  renderRow = ({ item }) => {
    const { activities, tags, myActivities, times } = this.props;
    const { name } = activities.byId[item];
    const groupId = myActivities.byActivityId[item].allGroupIds[0]; // latest groupId
    let tagsGroup = myActivities.byActivityId[item].byGroupId[groupId];
    tagsGroup = Array.from(tagsGroup);


    let startedAt = null;
    let stoppedAt = null;
    if (!_.isEmpty(times.byActivityId[item]) &&
        !_.isEmpty(times.byActivityId[item][groupId]) &&
        times.byActivityId[item][groupId].length > 0) {
          startedAt = times.byActivityId[item][groupId][0].startedAt;
          stoppedAt = times.byActivityId[item][groupId][0].stoppedAt;
    }

    let startedTag = null;
    let stoppedTag = null;
    let rand = 0;

    if (!_.isNull(startedAt) && _.isNull(stoppedAt)) {
      const currSecs1 = moment.duration(moment().valueOf() - startedAt).asSeconds();
      if (currSecs1 < 1440) {
        rand = moment().valueOf();
      }
      startedTag = `started ${moment(startedAt).fromNow()}`;
    } else if (!_.isNull(startedAt) && !_.isNull(stoppedAt)) {
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
    //console.log(startedTag, stoppedTag);

    return (
      <ActivityCard
        id={item}
        name={name}
        groupId={groupId}
        tagsGroup={tagsGroup}
        tags={tags}
        startedAt={startedAt}
        stoppedAt={stoppedAt}
        startedTag={startedTag}
        stoppedTag={stoppedTag}
        showTags={this.showTags}
        toggleActivity={this.props.toggleActivity}
        scrollToOffset={this.scrollToOffset}
        rand={rand}
        //rand={this.state.refreshing}
      />
    );
  }

  render() {
    const { myActivities, tags, activities } = this.props;

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
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }

        />
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
  const { myActivities, activities, tags, times, network, offlineQueue } = state;
  return {
    myActivities,
    activities,
    tags,
    times,
    network,
    offlineQueue
  };
};
export default connect(mapStateToProps, {
  toggleActivity,
  getActivities,
  getMyActivities,
  getTags,
  setConnectionStatus,
  offlineRequest,
  loadInitData,
})(DashboardScreen);
