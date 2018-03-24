import React from 'react';
import {
  View,
  Text,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  FlatList,
  Image,
  Switch,
  LayoutAnimation,
  Dimensions
} from 'react-native';
import axios from 'axios';

import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import SearchBar from '../components/SearchBar';
import FriendRowItem from '../components/FriendRowItem';
import Loader from '../components/Loader';
import ToggleRowItem from '../components/ToggleRowItem';

import {
  searchUsers,
  sendFriendRequest
} from '../actions/FriendActions';

const { height, width } = Dimensions.get('window');

class FriendInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePic: ''
    };
    if (this.props.navigator) {
      this.props.navigator.setButtons({
        // rightButtons: [{
        //   id: 'done',
        //   title: 'Done',
        //   disabled: true,
        //   buttonColor: EStyleSheet.value('$iconColor')
        //   //disableIconTint: true, // disable default color,
        // }],
        rightButtons: [{
          id: 'done',
          title: 'Done',
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

  closeModal = async () => {
    await this.props.navigator.dismissModal({
      animationType: 'slide-down'// 'none' / 'slide-down'
    });
  }

  isValid = (name) => {
    const regex = /^[a-zA-Z0-9_!@#$&*.]{3,35}$/;
    return regex.test(name);
  }

  render() {
    const imgHeigth = Math.ceil((30 / 100) * height); // use 30% of total height
    const fbApiProfileUrl = `https://graph.facebook.com/v2.12/${this.props.friend.profileId}/picture?height=${imgHeigth}&width=${width}&redirect=true`;
    console.log(fbApiProfileUrl);
    return (
      <View style={[styles.container]} >
        <Image style={{ height: imgHeigth, width }} source={{ uri: fbApiProfileUrl }} />
        <View style={{ padding: 10, flexDirection: 'column', }}>
          <Text
            style={{
              fontSize: 21,
              paddingTop: 10,
              color: EStyleSheet.value('$textColor') }}
          >{this.props.friend.fullName}</Text>
          <Text
            style={{
              fontSize: 16,
              paddingTop: 0,
              marginBottom: 15,
              color: EStyleSheet.value('$textColor')
            }}
          >{this.props.friend.email}</Text>
        </View>
        <ToggleRowItem
          title={'Allow notificaions'}
          subtitle={
            'when activity started or stopped, will receive a notification from this friend'
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
  const { friends } = state;
  return {
    friends
  };
};
export default connect(null, {
  searchUsers,
  sendFriendRequest
})(FriendInfoModal);
