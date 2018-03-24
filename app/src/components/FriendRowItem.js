import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextButton from './TextButton';

class FriendRowItem extends React.PureComponent {
  static defaultProps = {
    showEditIcon: false,
    onItemPress: () => null,
    acceptFriendRequest: () => null,
    sendFriendRequest: () => null,
    onFriendPress: () => null,
  }

  onItemPress = () => {
    this.props.onFriendPress(this.props.userObj);
  }

  onAccept = () => {
    this.props.acceptFriendRequest(this.props.id);
  }

  sendFriendRequest = () => {
    console.log(this.props);
    // fix id here, it can be userId or requests id
    this.props.sendFriendRequest(this.props.id);
  }

  render() {

    const { userObj, action } = this.props;
    const fullname = userObj.fullName;
    const fbApiProfileUrl = `https://graph.facebook.com/v2.12/${userObj.profileId}/picture?height=50&width=50&redirect=true`;

    let status = '';
    if (action === 'pending') {
      status = action;
    } else if (action !== 'accept' && action !== 'send') {
      status = 'show current activity here';
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
              paddingTop: 0,
              //backgroundColor: 'red'
            }}
          >
            <Image
              style={{
                borderRadius: 25,
                width: 50,
                height: 50,
                backgroundColor: EStyleSheet.value('$backgroundColor')
              }}
              source={{ uri: fbApiProfileUrl }}
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
            style={{ paddingRight: 10 }}
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
    borderBottomWidth: 0.17,
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
