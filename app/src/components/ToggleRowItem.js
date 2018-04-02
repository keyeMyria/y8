import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableHighlight,
} from 'react-native';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextButton from './TextButton';
import { fakePromise } from '../services/Common';

class ToggleRowItem extends React.PureComponent {
  static defaultProps = {
    onValueChange: () => null
  }
  state = {
    subscribed: false
  }
  componentDidMount() {
    this.setState({
      subscribed: this.props.subscribed
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      subscribed: nextProps.subscribed
    });
  }

  onValueChange = (subscribed) => {
    console.log(this.props);
    this.setState({
      subscribed
    }, () => {
      if (subscribed) {
        this.props.onSubscribe(this.props.userId);
      } else if (!_.isNil(this.props.subscribeId) &&
        this.props.subscribeId !== '') {
        this.props.onUnsubscribe(this.props.subscribeId);
      }
    });
    //this.props.onFriendPress(this.props.userObj);
  }

  render() {
    const { title, subtitle } = this.props;
    return (
      <TouchableHighlight
        underlayColor='#F4F4F4'
      >
        <View style={[styles.outerContainer]}>
          <View style={[styles.textContainer]}>
            <Text style={[styles.text]}>{title}</Text>
            {
              subtitle !== '' &&
              <Text style={[styles.subtitle]}>{subtitle}</Text>
            }
          </View>
          <Switch
            disabled={this.props.disabled}
            value={this.state.subscribed}
            onValueChange={this.onValueChange}
          />
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
    //height: 80,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.21,
    borderColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 5
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
    fontSize: 18,
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

export default ToggleRowItem;
