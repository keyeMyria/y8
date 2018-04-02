import _ from 'lodash';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
} from 'react-native';
import moment from 'moment';
import Card from './Card';
import CardHeader from './CardHeader';
import CardContent from './CardContent';
import CardFooter from './CardFooter';
import TextButton from './TextButton';
import {
  globalTextColor,
  globalSubTextColor
} from '../styles/Global';

class ActivityCard extends React.PureComponent {

  constructor(props) {
    super(props);
    // this.state = {
    //   started: false,
    // };
    const position = new Animated.ValueXY();
    //position.setValue({ x: 0, y: 0 });
    this.position = position;
  }
  // componentDidMount() {
  //   const { startedAt, stoppedAt } = this.props;
  //   //console.log(startedAt, stoppedAt);
  //   if (!_.isNull(startedAt) && _.isNull(stoppedAt)) {
  //     this.setState({
  //       started: true,
  //     });
  //   } else if (!_.isNull(startedAt) && !_.isNull(stoppedAt)) {
  //     this.setState({
  //       started: false,
  //     });
  //   }
  // }

  // componentDidMount() {
  //
  //   // Animated.timing(                  // Animate over time
  //   //   this.state.fadeAnim,            // The animated value to drive
  //   //   {
  //   //     toValue: 1,                   // Animate to opacity: 1 (opaque)
  //   //     duration: 800,              // Make it take a while
  //   //   }
  //   // ).start();
  // }

  componentWillReceiveProps() {
    // this.setState({
    //   fadeAnim: new Animated.Value(0)
    // });
    //

  }

  componentWillUpdate() {
    //LayoutAnimation.easeInEaseOut();
    LayoutAnimation.spring();
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      const { startedAt, stoppedAt } = this.props;
      if (!_.isNull(startedAt) && _.isNull(stoppedAt)) {
        const temp1 = moment.duration(startedAt).asSeconds();
        const temp2 = moment.duration(moment().valueOf()).asSeconds();
        const tempTimeDiff = temp2 - temp1;

        if (tempTimeDiff > 3) {
          return false;
        }

        this.position.setValue({ x: 10, y: 0 });

        Animated.spring(
          this.position,
          {
            toValue: { x: 0, y: 0 },
            bounciness: 20,
            //duration: 1500,
            //useNativeDriver: true,
          }
        ).start();
      }
    }, 100);
  }

  componentDidUpdate() {
    // const timeout = setTimeout(() => {
    //   clearTimeout(timeout);
    //   const { startedAt, stoppedAt } = this.props;
    //   if (!_.isNull(startedAt) && _.isNull(stoppedAt)) {
    //     const temp1 = moment.duration(startedAt).asSeconds();
    //     const temp2 = moment.duration(moment().valueOf()).asSeconds();
    //     const tempTimeDiff = temp2 - temp1;
    //
    //     if (tempTimeDiff > 3) {
    //       return false;
    //     }
    //
    //     this.position.setValue({ x: 20, y: 0 });
    //
    //     Animated.spring(
    //       this.position,
    //       {
    //         toValue: { x: 0, y: 0 },
    //         bounciness: 40,
    //         //duration: 1500,
    //         //useNativeDriver: true,
    //       }
    //     ).start();
    //   }
    // }, 500);
  }

  onStartStopPress = (activityId, groupId, started) => {
    //console.log(this.state.started);
    // this.setState({
    //   started: !this.state.started
    // }, () => {  });
      //console.log(this.state.started);
    const toggle = !started;
    if (toggle) {
      this.props.startActivity(this.props.timeId, activityId, groupId);
      this.props.scrollToOffset();
    } else {
      this.props.stopActivity(this.props.timeId, activityId, groupId);
    }
    //this.props.toggleActivity(id, groupId, this.state.started);
  }

  showTags = (started, individualLoading) => {
    if (!started & !individualLoading) {
      this.props.showTags(this.props.activityId, this.props.timeId, this.props.groupId);
    }
  }
  renderTagsSentence = (name, tags) => (
    tags.map((id) => `#${this.props.tags.byId[id].name.toLowerCase()} `)
  );

  render() {
    const { activityId, name, groupId, tagsGroup, startedTag, stoppedTag, individualLoading } = this.props;
    const { loading } = this.props;

    const activityName = name[0].toUpperCase() + name.slice(1).toLowerCase();

    let timeDiff = startedTag;
    let textAlign = 'right';
    if (_.isNil(startedTag) && !_.isNil(stoppedTag)) {
      textAlign = 'left';
      timeDiff = stoppedTag;
    }


    const { startedAt, stoppedAt } = this.props;
    let started = false;
    if (!_.isNil(startedAt) && _.isNil(stoppedAt)) {
      started = true;
    } else if (!_.isNil(startedAt) && !_.isNil(stoppedAt)) {
      started = false;
    }

    let btnTitle = '';
    if (individualLoading) {
      if (started) {
        btnTitle = 'Stopping...';
      } else {
        btnTitle = 'Starting...';
      }
      //btnTitle = 'Loading...';
    } else if (started) {
      btnTitle = 'STOP';
    } else {
      btnTitle = 'START';
    }


    /*let timeDiff = startedAt > 0 ? moment(startedAt).fromNow() : '';
    let prefix = 'started';
    if (!this.state.started) {
      prefix = 'stopped';
      timeDiff = stoppedAt > 0 ? moment(stoppedAt).fromNow() : '';
    }

    if (!_.isNull(startedAt)) {
      timeDiff = `${prefix} ${timeDiff}`;
    }
    let aa = 0;
    if (_.isNull(stoppedAt)) {
      aa = moment().valueOf();
    } else {
      aa = stoppedAt;
    }
    const temp = aa - startedAt;

    <CardHeader>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardHeaderName}>{name}</Text>
      </View>
    </CardHeader>

    //{tagsGroup && activityName}
    //{' '}
    */
    return (

      <Card>
        <CardHeader>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderName}>{activityName}</Text>
          </View>
        </CardHeader>
        <CardContent style={styles.cardContent}>
          <TouchableOpacity
            onPress={() => {
              this.showTags(started, individualLoading); }}
          >
            <View
              style={{
                marginVertical: 0,
                //marginHorizontal: 10,
                //borderLeftWidth: 5,
                //borderColor: 'lightgreen',
                //paddingLeft: 5
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: globalTextColor,
                  letterSpacing: 0.8,
                  //fontWeight: '400'
                }}
              >

              {tagsGroup && this.renderTagsSentence(name, tagsGroup)}
              </Text>
            </View>
          </TouchableOpacity>
          <Animated.View style={{ ...this.position.getLayout() }}>
            <Text
              style={{
                paddingTop: 10,
                //backgroundColor: 'red',
                color: globalSubTextColor,
                textAlign,
              }}
            >{timeDiff}</Text>
          </Animated.View>


        </CardContent>
        <CardFooter style={styles.cardFooter}>
          <TextButton
            disabled={loading}
            title={btnTitle}
            titleStyle={{
              fontSize: 14,
              color: started ? 'rgba(255, 51, 79,0.8)' : '#38B211',
              fontWeight: '600'
            }}
            containerStyle={{
              borderWidth: 0.3,
              borderRadius: 3,
              borderColor: started ? 'rgba(255, 51, 79,0.8)' : '#38B211',
              height: 25,
            }}
            onPress={() => { this.onStartStopPress(activityId, groupId, started); }}
          />
        </CardFooter>
      </Card>

    );
  }
}

const styles = StyleSheet.create({
  cardHeaderRow: {
    paddingHorizontal: 5,
    paddingTop: 5,
    flexDirection: 'row',
    //backgroundColor: 'lightpink',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderName: {
    fontSize: 21,
    fontWeight: '600',
    color: globalTextColor
  },
  cardContent: {
    backgroundColor: '#ffffff',
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  cardFooter: {
    //backgroundColor: '#f7f8f9'

  }
});

export default ActivityCard;
