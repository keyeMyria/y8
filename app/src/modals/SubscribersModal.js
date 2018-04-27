import _ from 'lodash';
import React from 'react';
import {
  View,
  Text,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  FlatList,
  LayoutAnimation,
  RefreshControl
} from 'react-native';

import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Snackbar from 'react-native-snackbar';
import SearchBar from '../components/SearchBar';
import SubscriberRowItem from '../components/SubscriberRowItem';
import Loader from '../components/Loader';

import {
  getSubscribers
} from '../actions/SubscriberActions';

import {
  shareWith,
  unshare
} from '../actions/ShareActions';

class SubscribersModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFriends: [],
    };

    if (this.props.navigator) {
      this.props.navigator.setButtons({
        rightButtons: [{
          id: 'done',
          title: 'Done',
          //disabled: true,
          buttonColor: EStyleSheet.value('$iconColor')
          //disableIconTint: true, // disable default color,
        }]
      });
      // if you want to listen on navigator events, set this up
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
  }

  componentDidMount() {
    const selectedFriends = [];

    _.forEach(this.props.selectedFriends, (obj) => {
       selectedFriends.push({ id: obj.id, sharedWith: obj.sharedWith.id });
    });

    //console.log('componentDidMount', selectedFriends);
    this.setState({
      selectedFriends
    }, () => {
      this.props.getSubscribers();
    });
  }

  componentWillReceiveProps(nextProps) {
    //console.log('nextProps', nextProps);

    if (!_.isNil(nextProps.share.shareId) &&
      !nextProps.share.loading &&
      !_.isNil(nextProps.share.sharedWith)) {
      const index = _.findIndex(this.state.selectedFriends,
        (o) => o.sharedWith === nextProps.share.sharedWith);

      if (this.state.selectedFriends.length === 0 || index === -1) {
        const selectedFriends = [
          ...this.state.selectedFriends,
          {
            id: nextProps.share.shareId,
            sharedWith: nextProps.share.sharedWith
          }
        ];

        //selectedFriends.reverse();
        this.setState({
          selectedFriends,
        }, () => {
          //this.showSnackBar('Activity will be shared');
        });
      }
    }

    if (_.isNil(nextProps.share.shareId) &&
      nextProps.share.unshareDone &&
      !nextProps.share.loading) {
        //this.showSnackBar('Activity will be sharedee');
      this.deleteFriendFromSelectedFriends(nextProps.share.sharedWith);
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'done') {
        this.closeModal('');
      }
    } else if (event.type === 'ScreenChangedEvent') {
      if (event.id === 'didDisappear') {
        //this.props.onModalClose();
      } else if (event.id === 'didAppear') {
        //this.textInput.focus();
      }
    }
  };

  onSearchBarFocus = () => {

  }
  onSearchCancel = () => {

  }

  handleSearchOnClear = () => {

  }

  onRefresh = () => {
    this.props.getSubscribers();
  }


  closeModal = async () => {
    Keyboard.dismiss();
    await this.props.navigator.dismissModal({
      animationType: 'slide-down'// 'none' / 'slide-down'
    });
  }
  showSnackBar = (msg) => {
    Snackbar.show({
        title: msg,
        duration: Snackbar.LENGTH_SHORT,
    });
  }
  placeholderText = () => {
    return 'Search Friends';
  }

  deleteFriendFromSelectedFriends = (userId) => {
    //console.log(this.state.selectedFriends, userId);
    const selectedFriends = Object.assign([], this.state.selectedFriends);
    _.pullAllBy(selectedFriends, [{ sharedWith: userId }], 'sharedWith');
    this.setState({
      selectedFriends
    });
  }

  onItemPress = (checked, userId, id, sharedWithObj) => {
    if (checked) {
      this.props.shareWith(this.props.activity.id, this.props.groupId, userId, sharedWithObj);
    } else if (!_.isNil(id)) {
      this.props.unshare(this.props.activity.id, this.props.groupId, id, userId);
    }
  }

  renderRow = ({ item }) => {
    const { id, fullName, profileId } = item.subUserId;
    const userId = id;
    const index = _.findIndex(this.state.selectedFriends,
      (o) => o.sharedWith === userId);

    let shareId = null;
    if (index > -1) {
      shareId = this.state.selectedFriends[index].id;
    }

    return (
      <SubscriberRowItem
        id={shareId}
        userId={userId}
        fullName={fullName}
        profileId={profileId}
        onItemPress={this.onItemPress}
        isChecked={index > -1}
      />
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={50}
        ref="myRef"
      >
        <SearchBar
          placeholderText={'name or email'}
          onChangeText={this.onChangeText}
          onClear={this.handleSearchOnClear}
          onFocus={this.onSearchBarFocus}
          onCancel={this.onSearchCancel}
        />
        <FlatList
          //removeClippedSubviews={false}
          keyboardShouldPersistTaps='always'
          ref={(ref) => { this.flatListRef = ref; }}
          extraData={this.props.subscribers.data.rows}
          //ListHeaderComponent={this.renderListHeader}
          keyExtractor={item => item.subUserId.id}
          data={this.props.subscribers.data.rows}
          renderItem={this.renderRow}
          ListFooterComponent={this.renderListFooter}
          refreshControl={
            <RefreshControl
              refreshing={this.props.subscribers.loading}
              onRefresh={this.onRefresh}
            />
          }
        />
        <Loader
          visible={this.props.share.loading}
        />
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

const mapStateToProps = (state) => {
  //console.log('SubscribersModal:mapStateToProps:', state);
  const { subscribers, share } = state;
  return {
    subscribers,
    share
  };
};
export default connect(mapStateToProps, {
  getSubscribers,
  shareWith,
  unshare
})(SubscribersModal);
