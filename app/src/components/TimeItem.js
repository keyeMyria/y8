import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';

import EStyleSheet from 'react-native-extended-stylesheet';

class TimeItem extends React.PureComponent {
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

  timeDiff = (startedAt, stoppedAt) => {
    const duration = moment.duration(stoppedAt - startedAt);
    let hrs = duration.hours();
    let mins = duration.minutes();
    let secs = duration.seconds();
    //let millisecs = duration.milliseconds();

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
    const data =  `${hrs}${mins}${secs}`;
    return data;
  };
  render() {
    const { startedAt, stoppedAt, startedTimestamp, stoppedTimestamp } = this.props.time;
    console.log(startedAt, stoppedAt, startedTimestamp, stoppedTimestamp);
    return (
      <View style={[styles.outerContainer]}>
        <View style={{ width: 15 }} />
        <View style={[styles.innerContainer]}>
          <View style={[styles.textContainer]}>
            <View
              style={{
                flexDirection: 'row'
              }}
            >
              <Text style={[styles.text]}>{startedAt}</Text>
            </View>
            {
              stoppedAt !== '' &&
              <View
                style={{
                  flexDirection: 'row'
                }}
              >
                <Text style={[styles.text]}>{stoppedAt}</Text>

              </View>
            }
            {
              <View
                style={{
                  //flexDirection: 'row',
                  paddingBottom: 5,
                  paddingHorizontal: 10
                  //backgroundColor: 'lightblue',
                }}
              >
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
    height: 65,
    backgroundColor: '#FFFFFF'
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.25,
    borderColor: 'gray',
    flexDirection: 'row'
  },
  textContainer: {
    flex: 1,
    //backgroundColor: 'skyblue',
    //height: 60,
    justifyContent: 'center',
    //alignItems: 'flex-start'
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
    textAlign: 'right'
  },
  moreButton: {
    flex: 1,
    paddingRight: 20,
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
