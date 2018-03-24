import React from 'react';
import {
  View,
  Platform,
  FlatList,
  Text,
  UIManager,
  ScrollView,
  RefreshControl,
  LayoutAnimation,
  KeyboardAvoidingView
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Feather from 'react-native-vector-icons/Feather';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Snackbar from 'react-native-snackbar';

import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
//import { SearchTags } from '../services/TagService';
import FriendRowItem from '../components/FriendRowItem';
import {
  getFriendRequests,
  acceptFriendRequest,
  getFriends
} from '../actions/FriendActions';

class FriendsScreen extends React.Component {
  static navigatorStyle = {
    navBarNoBorder: true
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tag: null,
      searchIds: [],
      isSearchOn: false,
      selectedTags: [],
      sentence: '',
      activity: null,
      selectedIndex: 0,
      SegmentedControlTabTopPadding: 0
    };
    this.timeout = 0;
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
       UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    if (this.props.navigator) {
      // if you want to listen on navigator events, set this up
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    //this.props.getFriendRequests();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  async componentDidUpdate(nextProps) {
    console.log('componentDidUpdate', nextProps.friendActions.sendLoading, this.props.friendActions.sendLoading, this.props.friendActions.error);
    if (nextProps.friendActions.sendLoading &&
      !this.props.friendActions.sendLoading &&
      _.isNull(this.props.friendActions.error)) {
      //this.onSendRequestModalClose();
      await this.showSnackBar('Friend request sent!');
    } else if (nextProps.friendActions.sendLoading &&
      !this.props.friendActions.sendLoading &&
      !_.isNull(this.props.friendActions.error) &&
      !_.isUndefined(this.props.friendActions.error)) {
      //this.onSendRequestModalClose();
      await this.showSnackBar(this.props.friendActions.error.data);
    } else if (nextProps.friendActions.sendLoading &&
      !this.props.friendActions.sendLoading &&
      _.isUndefined(this.props.friendActions.error)) {
      await this.showSnackBar('Service down, please try later');
    }

    if (nextProps.friendActions.acceptLoading &&
      !this.props.friendActions.acceptLoading &&
      _.isNull(this.props.friendActions.error)) {
      //this.onSendRequestModalClose();
      await this.showSnackBar('Friend request accepted!');
    } else if (nextProps.friendActions.acceptLoading &&
      !this.props.friendActions.acceptLoading &&
      !_.isNull(this.props.friendActions.error) &&
      !_.isUndefined(this.props.friendActions.error)) {
      //this.onSendRequestModalClose();
      await this.showSnackBar(this.props.friendActions.error.data);
    } else if (nextProps.friendActions.acceptLoading &&
      !this.props.friendActions.acceptLoading &&
      _.isUndefined(this.props.friendActions.error)) {
      await this.showSnackBar('Service down, please try later');
    }
  }

  onSendRequestModalClose = () => {
    this.setState({
      selectedIndex: 1
    }, () => {
      this.props.navigator.setButtons({
        rightButtons: []
      });
    });
  }
  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add' && this.props.navigator) {
        this.props.navigator.showModal({
          screen: 'app.FriendModal',
          title: 'Send Request',
          passProps: {
            onModalClose: () => {}//this.onSendRequestModalClose
          },
          navigatorStyle: {
            navBarTextColor: EStyleSheet.value('$textColor')
          },
          animationType: 'slide-up'
        });
      }
    }
  };

  onEdit = (id) => {
    this.props.navigator.showModal({
      screen: 'app.TagModal',
      title: 'Update Tag',
      passProps: {
        tag: this.props.tags.byId[id],
        tags: this.props.tags
      },
      navigatorStyle: {},
      animationType: 'slide-up'
    });
  }

  onItemPress = (checked, tagId) => {
    if (checked) {
      const selectedTags = [...this.state.selectedTags, tagId];
      //selectedTags.reverse();
      this.setState({
        selectedTags,
        sentence: selectedTags.map((id) => `${this.props.tags.byId[id].name} `)
      });
    } else {
      this.deleteTagFromSeletedTags(tagId);
    }
  }

  onSearchBarFocus = () => {
    this.setState({
      SegmentedControlTabTopPadding: 25
    }, () => {
      this.props.navigator.toggleNavBar({
        to: 'hidden', // required, 'hidden' = hide , 'shown' = show
        animated: true
      });
    });
  }

  onSearchCancel = () => {
    this.setState({
      SegmentedControlTabTopPadding: 0
    }, () => {
      this.props.navigator.toggleNavBar({
        to: 'shown', // required, 'hidden' = hide , 'shown' = show
        animated: true
      });
    });
  }

  onRefreshFriends = () => {
    this.props.getFriends();
  }

  onRefreshFriendRequests = () => {
    this.props.getFriendRequests();
  }

  showSnackBar = (msg) => {
    Snackbar.show({
        title: msg,
        duration: Snackbar.LENGTH_SHORT,
    });
  }

  deleteTagFromSeletedTags = (tagId) => {
    const selectedTags = Object.assign([], this.state.selectedTags);
    const index = selectedTags.indexOf(tagId);
    if (index !== -1) {
      selectedTags.splice(index, 1);
      this.setState({
        selectedTags,
        sentence: selectedTags.map((id) => `${this.props.tags.byId[id].name} `)
      });
    }
  }

  handleSearchChangeText = (text) => {
    clearTimeout(this.timeout);

    if (text.length === 0) {
      this.setState({
        searchIds: [],
        isSearchOn: false
      });
    } else {
      let searchIds = [];
      this.timeout = setTimeout(() => {
        //searchIds = SearchTags(this.props.tags.byId, text);
        this.setState({
          searchIds,
          isSearchOn: true
        });
      }, 800);
    }
  }

  handleSearchOnClear = () => {
    this.setState({
      searchIds: [],
      isSearchOn: false,
    });
  }

  scrollToOffset = () => {
    this.flatListRef.scrollToOffset({ x: 0, y: 0, animated: true });
  }

  useThisGroupForActivity = (activityId, tagId) => {
    this.props.navigator.popToRoot({
      animated: true,
      animationType: 'fade',
    });
    this.props.useThisGroupForActivity(activityId, tagId);
  }

  removeTagFromGroup = (activityId, groupId, tagId) => {
    this.props.removeTagFromGroup(activityId, groupId, tagId);
  }

  removeGroupFromActivity = (activityId, groupId) => {
    this.props.removeGroupFromActivity(activityId, groupId);
  }
  onFriendPress = (userObj) => {
    this.props.navigator.showModal({
      screen: 'app.FriendInfoModal',
      title: 'Profile',
      passProps: {
        friend: userObj
      },
      navigatorStyle: {},
      animationType: 'slide-up'
    });
  }
  renderListFooter = () => null;
  renderFriendRow = ({ item }) => {
    const { id, fromUser, toUser } = item;

    let userObj = toUser;
    if (toUser.id === this.props.user.userId) {
      userObj = fromUser;
    }
    return (
      <FriendRowItem
        id={id}
        userObj={userObj}
        action={''}
        onFriendPress={this.onFriendPress}
      />
    );
  };

  renderRequestRow = ({ item }) => {
    const { id, fromUser, toUser } = item;

    let userObj = toUser;
    let action = 'pending';
    if (toUser.id === this.props.user.userId) {
      action = 'accept';
      userObj = fromUser;
    }

    return (
      <FriendRowItem
        id={id}
        userObj={userObj}
        action={action}
        acceptFriendRequest={this.props.acceptFriendRequest}

      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControlTab
          tabsContainerStyle={{
            paddingTop: this.state.SegmentedControlTabTopPadding,
            paddingVertical: 10,
            paddingHorizontal: 30,
            backgroundColor: '#FFFFFF',
          }}
          tabStyle={{ borderColor: EStyleSheet.value('$iconColor') }}
          activeTabStyle={{ backgroundColor: EStyleSheet.value('$iconColor') }}
          tabTextStyle={{ color: EStyleSheet.value('$textColor'), fontWeight: '600' }}
          values={['Friends', 'Requests']}
          selectedIndex={this.state.selectedIndex}
          onTabPress={(selectedIndex) => {
            this.setState({
              selectedIndex
            });
          }}
        />
        {
          this.state.selectedIndex === 0 &&
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={17}
          >
          <SearchBar
            onChangeText={this.handleSearchChangeText}
            onClear={this.handleSearchOnClear}
            onFocus={this.onSearchBarFocus}
            onCancel={this.onSearchCancel}
          />
          <FlatList
            //removeClippedSubviews={false}
            keyboardShouldPersistTaps='always'
            //ref={(ref) => { this.flatListRef = ref; }}
            extraData={this.props.friends.data.rows}
            //ListHeaderComponent={this.renderListHeader}
            keyExtractor={item => item}
            data={this.props.friends.data.rows}
            renderItem={this.renderFriendRow}
            ListFooterComponent={this.renderListFooter}
            refreshControl={
              <RefreshControl
                refreshing={this.props.friends.loading}
                onRefresh={this.onRefreshFriends}
              />
            }
          />
        </KeyboardAvoidingView>
      }
      {
        this.state.selectedIndex === 1 &&
        <View style={{ flex: 1 }}>
          <FlatList
            //removeClippedSubviews={false}
            keyboardShouldPersistTaps='always'
            //ref={(ref) => { this.flatListRef = ref; }}
            extraData={this.props.friendRequests.data.rows}
            //ListHeaderComponent={this.renderListHeader}
            keyExtractor={item => item}
            data={this.props.friendRequests.data.rows}
            renderItem={this.renderRequestRow}
            ListFooterComponent={this.renderListFooter}
            refreshControl={
              <RefreshControl
                refreshing={this.props.friendRequests.loading}
                onRefresh={this.onRefreshFriendRequests}
              />
            }
          />
        </View>
      }

        <Loader
          visible={
            this.props.friendActions.sendLoading ||
            this.props.friendActions.acceptLoading
          }
        />
      </View>

    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
  }
});

const mapStateToProps = (state) => {
  //console.log('FriendsScreen:mapStateToProps:', state);
  const { friendActions, friendRequests, friends, user } = state;
  return {
    friendActions,
    friendRequests,
    friends,
    user
  };
};
export default connect(mapStateToProps, {
  acceptFriendRequest,
  getFriendRequests,
  getFriends
})(FriendsScreen);
