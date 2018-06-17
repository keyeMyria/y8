import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';

import Ionicons from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

class TimeItem extends React.PureComponent {
  static defaultProps = {
    onEdit: () => null
  }

  onEdit = () => {
    this.props.onEdit(this.props.time);
  }

  timeDiff = (startedAt, stoppedAt) => {
    const duration = moment.duration(stoppedAt - startedAt);
    let hrs = duration.hours();
    let mins = duration.minutes();
    let secs = duration.seconds();
    //console.log(stoppedAt-startedAt, stoppedAt, startedAt, duration, hrs, mins, secs);
    //let millisecs = duration.milliseconds();
    //console.log(duration._milliseconds);
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
    //millisecs = `${millisecs} milli secs`;
    const data = `${hrs}${mins}${secs}`;
    return data;
  };
  render() {
    const { startedAt, stoppedAt, startedTimestamp, stoppedTimestamp } = this.props.time;
    return (
      <View style={[styles.outerContainer]}>
        <View style={{ width: 15 }} />
        <View style={[styles.innerContainer]}>
          <View style={[styles.textContainer]}>
            <View
              style={{
                flexDirection: 'column',
              }}
            >
              <Text style={[styles.text]}>{startedAt}</Text>
              {
                stoppedAt !== '' &&
                <Text style={[styles.text]}>{stoppedAt}</Text>
              }
            </View>
            {
              <View>
                <Text
                  style={[styles.textTimeDiff]}
                >
                  {
                    stoppedAt === '' &&
                    `started ${moment(startedTimestamp).fromNow()}`
                  }
                  {
                    stoppedAt !== '' &&
                    this.timeDiff(startedTimestamp, stoppedTimestamp)
                  }
                </Text>
              </View>
            }

          </View>
          <View>
            <TouchableOpacity
              onPress={this.onEdit}
              style={[styles.moreButton]}
            >
              <Ionicons
                name='ios-information-circle-outline'
                size={28} color='rgba(0,122,255,0.8)'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  outerContainer: {
    flex: 1,
    //alignItems: 'space-between',
    justifyContent: 'center',
    flexDirection: 'row',
    //height: 65,
    backgroundColor: '#FFFFFF'
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.25,
    borderColor: 'gray',
    flexDirection: 'row',
    //backgroundColor: 'lightpink',
    padding: 5
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    //alignItems: 'space-between',
    //backgroundColor: 'red',
    //height: 60,
    justifyContent: 'center',

    //paddingBottom: 3

  },
  text: {
    //backgroundColor: 'lightpink',
    fontSize: 16,
    color: '$textColor'
    //justifyContent: 'flex-start',
    //alignItems: 'flex-end'
  },
  textTimeDiff: {
    fontSize: 14,
    color: '$textColor',
    textAlign: 'right',
    //marginRight: 10
    paddingHorizontal: 10
  },
  moreButton: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 5,
    justifyContent: 'center',
    //backgroundColor: 'lightpink',
  },
  rightContainer: {

    //backgroundColor: 'lightblue',
    paddingHorizontal: 0,
    //marginRight: 15,
    justifyContent: 'center',
  }

});

export default TimeItem;
