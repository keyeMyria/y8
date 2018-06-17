import React from 'react';
import {
  FlatList,
  Text,
  View,
  Dimensions,
  RefreshControl
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import EStyleSheet from 'react-native-extended-stylesheet';
//import { VictoryBar, VictoryChart, VictoryTheme, VictoryLabel } from 'victory-native';
import { connect } from 'react-redux';
import {
  getStats
} from '../actions/StatsActions';

const WINDOW = Dimensions.get('window');
class StatsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let activityId = '';
    if (!_.isNil(this.props.activity)){
      activityId = this.props.activity.id;
    }
    console.log(this.props.activity);
    this.props.getStats({ activityId });
  }

  onRefresh = () => {
    this.props.getStats({ activityId: this.props.activity.id} );
  }

  renderRow = ({ item }) => {
    const keys = Object.keys(item);
    const tagId = keys[0];
    console.log(item);
    //let barWdith = Math.ceil((item.y/100)*WINDOW.width);
    const totalWidth = WINDOW.width - 30;
    const finalWidth = totalWidth / this.props.stats.maxNoOfTimes;
    // 400
    // 30
    // if ( barWdith > WINDOW.width) {
    //   barWdith = WINDOW.width-10;
    // }

    return (
      <View
        style={{
          // alignItems: 'center',
          // flexDirection: 'row',
          // backgroundColor: EStyleSheet.value('$iconColor'),
          // width: finalWidth * item[tagId],
          marginLeft: 15,
          marginRight: 15,
          marginBottom: 8,
          // paddingLeft: 5,
          // paddingTop: 2,
          // paddingBottom: 2
        }}
      >

        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <Text
            style={{
              color: EStyleSheet.value('$textColor'),
              fontSize: 16,
              fontWeight: '500'
             }}
          >
          {this.props.tags.byId[tagId].name}
          </Text>

          <Text
            style={{
              marginLeft: 10,
              color: EStyleSheet.value('$subTextColor'),
              fontSize: 12,
              fontWeight: '400',
              paddingTop: 4,
             }}
          >•{item[tagId].noOfTimes} times
          </Text>
          <Text
            style={{
              marginLeft: 10,
              color: EStyleSheet.value('$subTextColor'),
              fontSize: 12,
              fontWeight: '400',
              paddingTop: 4,
             }}
          >{item[tagId].duration>0?'•'+this.readableTime(item[tagId].duration):''}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: item[tagId].duration>0?EStyleSheet.value('$iconColor'):'green',
            height: 3,
            width: finalWidth * item[tagId].noOfTimes,
          }}
        />
      </View>
    );
  }

  readableTime = (milliSecs) => {
    let secs = moment.duration(milliSecs).seconds();
    let mins = moment.duration(milliSecs).minutes();
    let hrs = Math.trunc(moment.duration(milliSecs).asHours());

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

    return `${hrs}${mins}${secs}`;
  }

  render() {
    let name = '';
    if (!_.isNil(this.props.activity)) {
      name = this.props.activity.name;
    }


    let activityName = '';
    if (!_.isNil(this.props.activities.byId[this.props.stats.activityId])) {
      const activity = this.props.activities.byId[this.props.stats.activityId];
      activityName = activity.name;
    }

    activityName = name;
    // const milliSecs = this.props.stats.totalMilliSecs;
    // const seconds = moment.duration(milliSecs).seconds();
    // const minutes = moment.duration(milliSecs).minutes();
    // const hours = Math.trunc(moment.duration(milliSecs).asHours());

    return (
      <View style={styles.container}>
        <View
          style={{
            padding: 15

          }}
        >
          <Text
            style={{
              fontSize: 21,
              fontWeight: '600',
              color: EStyleSheet.value('$textColor')
            }}
          >
            {
              activityName
            }
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: EStyleSheet.value('$textColor'),
              letterSpacing: 0.5,
            }}
          >
            {
              this.readableTime(this.props.stats.totalMilliSecs)
            }
          </Text>
        </View>

        <FlatList
          //removeClippedSubviews={false}
          keyboardShouldPersistTaps='always'
          ref={(ref) => { this.flatListRef = ref; }}
          extraData={this.props.stats}
          keyExtractor={item => Object.keys(item)[0]}
          data={this.props.stats.tagIds}
          renderItem={this.renderRow}
          refreshControl={
            <RefreshControl
              refreshing={this.props.stats.loading}
              onRefresh={this.onRefresh}
            />
          }
          //onEndReached={this.loadMore}
          //onEndReachedThreshold={0.2}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '$backgroundColor',
  }
});
const mapStateToProps = (state) => {
  console.log('StatsScreen###################', state);
  return {
    network: state.network,
    stats: state.stats,
    tags: state.tags,
    activities: state.activities
  };
};
export default connect(mapStateToProps, {
  getStats
})(StatsScreen);
