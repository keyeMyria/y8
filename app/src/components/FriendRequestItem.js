import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import TextButton from './TextButton';
import {
  globalTextColor,
} from '../styles/Global';

class FriendRequestItem extends React.PureComponent {
  static defaultProps = {
    showEditIcon: false,
    onItemPress: () => null
  }

  onItemPress = () => {
    this.props.onItemPress(this.props.id);
  }
  onEdit = () => {
    this.props.onEdit(this.props.id);
  }
  onAddFriend = () => {
    this.props.onAddFriend(this.props.id);
  }
  render() {
    const { name } = this.props;
    console.log('name', name);
    return (
      <TouchableHighlight
        underlayColor='#F4F4F4'
        onPress={this.onItemPress}
      >
        <View style={[styles.outerContainer]}>
          <View style={{ width: 20 }} />
          <View style={[styles.innerContainer]}>
            <View style={[styles.textContainer]}>
              <Text style={[styles.text]}>{name}</Text>
            </View>
            <View style={[styles.rightContainer]}>
              <TextButton
                onPress={this.onAddFriend}
                title={'Add Friend'}
                containerStyle={styles.buttonContainerStyle}
                titleStyle={styles.buttonTitleStyle}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = EStyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF'
  },
  innerContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 0.25,
    borderColor: 'gray',
    flexDirection: 'column'
  },
  textContainer: {
    flex: 1,
    flexWrap: 'wrap',
    //backgroundColor: 'skyblue',
    //height: 60,
    justifyContent: 'center',
    //alignItems: 'flex-start'
    //paddingBottom: 3

  },
  text: {
    //backgroundColor: 'lightpink',
    fontSize: 21,
    color: '$textColor',
    //justifyContent: 'flex-start',
    //alignItems: 'flex-end'
  },
  buttonTitleStyle: {
    fontSize: 14,
    color: '$iconColor'
  },
  buttonContainerStyle: {
    borderWidth: 0.3,
    borderRadius: 3,
    borderColor: '$textColor',
    height: 20,
    marginBottom: 10

    // flex: 1,
    // paddingRight: 20,
    // paddingLeft: 5,
    // justifyContent: 'center',
    //alignItems: 'flex-end'
    //backgroundColor: 'lightpink',
  },
  rightContainer: {
    //flex: 1,
    //marginRight: 10,
    flexDirection: 'row',
    //backgroundColor: 'lightblue',
    paddingHorizontal: 0,
    //alignItems: 'flex-end',
    justifyContent: 'flex-end',
  }

});

export default FriendRequestItem;
