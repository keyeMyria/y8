import _ from 'lodash';
import React from 'react';
import {
  View,
  Text,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  FlatList,
  LayoutAnimation
} from 'react-native';

import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import SearchBar from '../components/SearchBar';
import FriendRowItem from '../components/FriendRowItem';
import Loader from '../components/Loader';

import {
  searchUsers,
  sendFriendRequest
} from '../actions/FriendActions';

const ERROR_MSG = 'Only these a-zA-Z0-9_!@#$& and space are allowed';
class FriendModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: ERROR_MSG,
      text: '',
      isValid: true,
    };
    this.timeout = 0;

    if (this.props.navigator) {
      this.props.navigator.setButtons({
        rightButtons: [{
          id: 'find',
          title: 'Find',
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

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.closeModal('');
      } else if (event.id === 'find') {
        this.onFind();
      }
    } else if (event.type === 'ScreenChangedEvent') {
      if (event.id === 'didDisappear') {
        //this.props.onModalClose();
      } else if (event.id === 'didAppear') {
        //this.textInput.focus();
      }
    }
  };

  onFind = () => {
    this.props.searchUsers(this.state.text);
  }
  onChangeText = (text) => {
    let isValid = this.isValid(text);

    if (text.trim().length <= 3) {
      isValid = false;
    }

    this.props.navigator.setButtons({
      rightButtons: [{
        id: 'find',
        title: 'Find',
        disabled: !isValid,
        buttonColor: EStyleSheet.value('$iconColor')
      }]
    });

    this.setState({
      text,
      //isValid,
    });
  }

  onItemPress = async (tagId) => {
    this.props.navigator.push({
      screen: 'app.TagsScreen',
      title: 'Tags',
      passProps: {
        tag: this.props.tags.byId[tagId]
      }
    });
  }


  onSearchBarFocus = () => {

  }

  placeholderText = () => {
    return 'Search Friends';
  }

  closeModal = async () => {
    Keyboard.dismiss();
    await this.props.navigator.dismissModal({
      animationType: 'none'// 'none' / 'slide-down'
    });
  }

  onSearchCancel = () => {

  }

  handleSearchOnClear = () => {

  }

  onSearchBarFocus = () => {

  }

  isValid = (name) => {
    const regex = /^[a-zA-Z0-9_!@#$&*.]{3,35}$/;
    return regex.test(name);
  }

  sendFriendRequest = (userId) => {
    this.props.onModalClose();
    this.props.sendFriendRequest(userId);
    this.closeModal();
  }

  renderRow = ({ item }) => {
    console.log(item);
    const { _id, fullName, profileId, pic, friendship } = item;
    let id = _id;
    if (_.isUndefined(_id)){
      id = item.id;
    }

    const userObj = {
      id,
      fullName,
      profileId
    };

    let action = 'send';
    if (friendship) {
      if (friendship.toUser === this.props.user.userId && friendship.status === 0) {
        action = 'accept';
      } else if (friendship.fromUser === this.props.user.userId && friendship.status === 0) {
        action = 'pending';
      }
    }

    return (
      <FriendRowItem
        id={id} // this is userId here. but not in other places
        userObj={userObj}
        action={action}
        sendFriendRequest={this.sendFriendRequest}
      />
      // <FriendRequestItem
      //   id={id}
      //   name={fullName}
      //   onAddFriend={this.onAddFriend}
      // />
    );
  };

  render() {
    const { data } = this.props.users;
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
          removeClippedSubviews
          keyboardShouldPersistTaps='always'
          extraData={data.rows}
          keyExtractor={item => item.id}
          data={data.rows}
          renderItem={this.renderRow}
        />
        <Loader
          visible={
            this.props.users.loading
          }
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
  //console.log('FriendsScreen:mapStateToProps:', state);
  const { user, users, friendRequest } = state;
  return {
    user,
    users,
    friendRequest
  };
};
export default connect(mapStateToProps, {
  searchUsers,
  sendFriendRequest
})(FriendModal);
