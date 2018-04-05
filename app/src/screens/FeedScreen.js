import React from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  Text,
  View,
  UIManager,
  Platform,
  FlatList,
  RefreshControl,
  LayoutAnimation,

} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  getFeed,
  updateFeedBadgeCount
} from '../actions/FeedActions';

class FeedScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log('FeedScreen screenInstanceID', props.navigator.screenInstanceID);
    this.state = {
      inCurrentScreen: false
    };
    // if (Platform.OS === 'android') {
    //   if (UIManager.setLayoutAnimationEnabledExperimental) {
    //     UIManager.setLayoutAnimationEnabledExperimental(true);
    //   }
    // }
  }
  componentDidMount() {
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
      const { badgeCount } = this.props.feed;
      if (badgeCount > 0) {
        this.props.navigator.setTabBadge({
          tabIndex: 1, // (optional) if missing, the badge will be added to this screen's tab
          badge: badgeCount, // badge value, null to remove badge
          badgeColor: 'rgba(221,93,89,1)',
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    const { badgeCount } = nextProps.feed;
    //const screenId = this.props.navigator.screenInstanceID;
    console.log(this.state.inCurrentScreen);
    if (!this.state.inCurrentScreen) {
      this.props.navigator.setTabBadge({
        tabIndex: 1, // (optional) if missing, the badge will be added to this screen's tab
        badge: badgeCount > 0 ? badgeCount : null, // badge value, null to remove badge
        badgeColor: 'rgba(221,93,89,1)',
      });
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onNavigatorEvent = (event) => {
    switch (event.id) {
      case 'willAppear':
       break;
      case 'didAppear':
        this.setState({
          inCurrentScreen: true
        });
        this.props.updateFeedBadgeCount(0);
        //const { badgeCount } = this.props.feed;
        //if (badgeCount > 0) {
          this.props.navigator.setTabBadge({
            tabIndex: 1, // (optional) if missing, the badge will be added to this screen's tab
            badge: null, // badge value, null to remove badge
            badgeColor: 'rgba(221,93,89,1)',
          });
        //}
        console.log('didAppear');
        break;
      case 'willDisappear':
        this.setState({
          inCurrentScreen: false
        });
        break;
      case 'didDisappear':
        break;
      case 'willCommitPreview':
        break;
      default:
    }
  };

  onRefresh = () => {
    this.props.getFeed();
  }
  renderRow = ({ item }) => {
    const { title, body, startedAt, stoppedAt } = item;
    let startedTag = null;
    let stoppedTag = null;

    if (!_.isNil(startedAt) && _.isNil(stoppedAt)) {
      startedTag = `${moment(startedAt).fromNow()}`;
    } else if (!_.isNil(startedAt) && !_.isNil(stoppedAt)) {
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

      stoppedTag = `${moment(stoppedAt).fromNow()} - ${diff}`;
    }
    const rand = Math.random();
    return (
      <View
        rand={rand}
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          minHeight: 50,
          flex: 1,
          padding: 10,
          backgroundColor: '#ffffff',
          flexDirection: 'column',
          borderRadius: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0.2, height: 0.4 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Text
          style={{ fontSize: 18, color: 'rgba(107, 112, 123, 1)', fontWeight: '600' }}
        >{title}</Text>
        <Text
          style={{ fontSize: 16, color: 'rgba(107, 112, 123, 1)', fontWeight: '400' }}
        >{body}</Text>
        <Text style={{ color: 'rgba(107, 112, 123, 1)', textAlign: 'right'}}>
          {startedTag !== null ? startedTag : ''}
          {stoppedTag !== null ? stoppedTag : ''}
        </Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          //removeClippedSubviews={false}
          keyboardShouldPersistTaps='always'
          ref={(ref) => { this.flatListRef = ref; }}
          extraData={this.props.feed}
          //ListHeaderComponent={this.renderListHeader}
          keyExtractor={item => item.id}
          data={this.props.feed.data}
          renderItem={this.renderRow}
          ListFooterComponent={this.renderListFooter}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '$backgroundColor',
  }
});

const mapStateToProps = (state) => {
  //console.log('TagsScreen:mapStateToProps:', state);
  const { feed } = state;
  return {
    feed
  };
};
export default connect(mapStateToProps, {
  getFeed,
  updateFeedBadgeCount
})(FeedScreen);
