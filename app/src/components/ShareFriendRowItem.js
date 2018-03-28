import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextButton from './TextButton';

class ShareFriendRowItem extends React.PureComponent {
  static defaultProps = {
    onSelect: () => null,
    onFriendInfo: () => null,
  }
  constructor(props) {
    super(props);
    this.state = {
      showCheck: false
    };
  }

  componentWillMount() {
    this.setState({
      showCheck: true//this.props.isChecked
    });
  }

  onSelect = () => {

  }
  onFriendInfo = () => {

  }

  render() {
    const { fullName, profileId } = this.props;
    const fbApiProfileUrl = `https://graph.facebook.com/v2.12/${profileId}/picture?height=50&width=50&redirect=true`;

    let status = 'show current activity here';

    return (
      <TouchableHighlight
        underlayColor='#F4F4F4'
        onPress={this.onSelect}
      >
        <View style={[styles.outerContainer]}>
          <View
            style={{
              backgroundColor: this.state.showCheck ? 'gray' : '#ffffff',
              height: 20,
              width: 20,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: 'gray',
              marginHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {
              this.state.showCheck &&
              <Ionicons
                name='ios-checkmark'
                size={25} color='#ffffff'
                style={{ paddingTop: 3, backgroundColor: 'transparent' }}
              />
            }

          </View>

          <View style={[styles.innerContainer]}>
            <Text style={[styles.text]}>{fullName}</Text>
            {
              status !== '' &&
              <Text style={[styles.subtitle]}>{status}</Text>
            }
          </View>

          <View
            style={{
              height: 80,
              //justifyContent: 'flex-start',
              justifyContent: 'center',
              paddingHorizontal: 10,
              paddingTop: 0,
              //backgroundColor: 'pink'
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

          <TouchableOpacity
              onPress={this.onFriendInfo}
              style={[styles.moreButton]}
          >
            <Ionicons
              name='ios-information-circle-outline'
              size={28} color='rgba(0,122,255,0.8)'
            />
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = EStyleSheet.create({
  outerContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.18,
    borderColor: 'gray',
  },
  innerContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    //backgroundColor: 'skyblue',
    paddingLeft: 10,
  },
  // textContainer: {
  //   flex: 1,
  //   flexWrap: 'wrap',
  //   //backgroundColor: 'red',
  //   //height: 60,
  //   justifyContent: 'center',
  //   //alignItems: 'flex-start',
  //   //paddingBottom: 3
  //   //paddingHorizontal: 5,
  //
  // },
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
  moreButton: {
    //flex: 1,
    paddingRight: 15,
    paddingLeft: 10,
    justifyContent: 'center',
    //backgroundColor: 'lightpink',
  },
});

export default ShareFriendRowItem;
