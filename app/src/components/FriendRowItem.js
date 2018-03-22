import _ from 'lodash';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextButton from './TextButton';
import {
  globalTextColor,
} from '../styles/Global';

class FriendRowItem extends React.PureComponent {
  static defaultProps = {
    showEditIcon: false,
    onItemPress: () => null,
    acceptFriendRequest: () => null,
  }

  onItemPress = () => {
    this.props.onItemPress(this.props.id);
  }

  onAccept = () => {
    this.props.acceptFriendRequest(this.props.id);
  }

  sendFriendRequest = () => {
    this.props.sendFriendRequest(this.props.id);
  }

  render() {
    const { fullname, action, picUrl, currentActivity } = this.props;
    let status = '';
    if (action === 'pending') {
      status = action;
    } else if (action !== 'accept' && action !== 'send') {
      status = 'show current activity here';
    }

    let profilePic = 'http://via.placeholder.com/50x50';
    if (!_.isNull(picUrl) && !_.isUndefined(picUrl) && picUrl !== '') {
      profilePic = picUrl;
    }

    return (
      <TouchableHighlight
        underlayColor='#F4F4F4'
        onPress={this.onItemPress}
      >
        <View style={[styles.outerContainer]}>
          <View
            style={{
              height: 80,
              //justifyContent: 'flex-start',
              justifyContent: 'center',
              paddingHorizontal: 10,
              paddingTop: 5,
              //backgroundColor: 'red'
            }}
          >
            <Image
              style={{ borderRadius: 25, width: 50, height: 50 }}
              source={{ uri: profilePic }}
            />
          </View>
          <View style={[styles.innerContainer]}>
            <View style={[styles.textContainer]}>
              <Text style={[styles.text]}>{fullname}</Text>
              {
                status !== '' &&
                <Text style={[styles.subtitle]}>{status}</Text>
              }

            </View>
            {
              action === 'accept' &&
              <View style={[styles.buttonContainer]}>

                <TextButton
                  onPress={this.onAccept}
                  title={'Accept'}
                  containerStyle={styles.textButtonContainerStyle}
                  titleStyle={styles.textButtonTitleStyle}
                />

                <TextButton
                  onPress={this.onDelete}
                  title={'Delete'}
                  containerStyle={styles.textButtonContainerStyle}
                  titleStyle={styles.textButtonTitleStyle}
                />
              </View>
            }
            {
              action === 'send' &&
              <View style={[styles.buttonContainer]}>

                <TextButton
                  onPress={this.sendFriendRequest}
                  title={'Add Friend'}
                  containerStyle={styles.textButtonContainerStyle}
                  titleStyle={styles.textButtonTitleStyle}
                />

              </View>
            }
          </View>
          <Ionicons
            name='ios-arrow-forward'
            size={25} color='lightgray'
            style={{ paddingRight: 20 }}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = EStyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.21,
    borderColor: 'gray',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    //backgroundColor: 'skyblue',
    paddingLeft: 10,
  },
  textContainer: {
    flex: 1,
    flexWrap: 'wrap',
    //backgroundColor: 'red',
    //height: 60,
    justifyContent: 'center',
    //alignItems: 'flex-start',
    //paddingBottom: 3
    //paddingHorizontal: 5,

  },
  subtitle: {
    fontSize: 12, color: '$textColor'
  },
  text: {
    //backgroundColor: 'lightpink',
    fontSize: 16,
    color: '$textColor',
    //justifyContent: 'flex-start',
    //alignItems: 'flex-end'
  },
  textButtonTitleStyle: {
    fontSize: 14,
    color: '$iconColor'
  },
  textButtonContainerStyle: {
    borderWidth: 0.3,
    borderRadius: 3,
    borderColor: '$textColor',
    height: 20,
    marginRight: 20
    //marginBottom: 10

    // flex: 1,
    // paddingRight: 20,
    // paddingLeft: 5,
    // justifyContent: 'center',
    //alignItems: 'flex-end'
    //backgroundColor: 'lightpink',
  },
  buttonContainer: {
    //flex: 1,
    //marginRight: 10,

    //paddingHorizontal: 5,
    paddingBottom: 10,
    flexDirection: 'row',
    //backgroundColor: 'lightgreen',
    //alignItems: 'flex-end',
    justifyContent: 'flex-end',
  }

});

export default FriendRowItem;
