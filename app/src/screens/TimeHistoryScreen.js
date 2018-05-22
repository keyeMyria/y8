import React from 'react';
import {
  Platform,
  FlatList,
  RefreshControl,
  UIManager,
  LayoutAnimation,
  View,
  Text,
  SectionList
} from 'react-native';
import _ from 'lodash';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Feather from 'react-native-vector-icons/Feather';
import TimeItem from '../components/TimeItem';

import {
  getTimesByGroup
} from '../actions/TimeActions';


const iconColor = 'rgba(221,93,89,1)';
let ADD_ICON;
Feather.getImageSource('plus', 30, iconColor).then((source) => {
  ADD_ICON = source;
});

class TimeHistoryScreen extends React.Component {
  static navigatorStyle = {
    //largeTitle: true
  };
  constructor(props) {
    super(props);

    this.state = {
    };

    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
      this.props.navigator.setStyle({
        navBarSubtitleColor: EStyleSheet.value('$subTextColor'),
        navBarSubtitleFontSize: 12,
      });
    }
  }

  componentDidMount() {
    this.props.getTimesByGroup(this.props.groupId, { page: 1 });
    this.setOfflineMode();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentDidUpdate() {
    this.setOfflineMode();
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        this.props.navigator.showModal({
          screen: 'app.ActivityModal',
          title: 'Create Activity',
          passProps: {
            activity: null,
            activities: this.props.activities
          },
          navigatorStyle: {
            navBarTextColor: EStyleSheet.value('$textColor')
          },
          animationType: 'slide-up'
        });
      }
    }
  };

  onEdit = (id) => {
    this.props.navigator.showModal({
      screen: 'app.ActivityModal',
      title: 'Update Activity',
      passProps: {
        activity: this.props.activities.byId[id],
        activities: this.props.activities
      },
      navigatorStyle: {
        navBarTextColor: EStyleSheet.value('$textColor')
      },
      animationType: 'slide-up'
    });
  }

  onItemPress = (activityId) => {
    this.props.navigator.push({
      screen: 'app.TagsScreen',
      title: 'Tags',
      passProps: {
        activity: this.props.activities.byId[activityId]
      },
      navigatorButtons: {
        rightButtons: [{
          id: 'add',
          icon: ADD_ICON,
          disableIconTint: true, // disable default color,
        }]
      }
    });
  }

  onRefresh = () => {
    this.props.getTimesByGroup(this.props.groupId, { page: 1 });
  }

  setOfflineMode = () => {
    let subtitle = null;
    if (this.props.network.offlineMode) {
      subtitle = 'offline mode';
    }
    this.props.navigator.setSubTitle({
      subtitle
    });
  }
  loadMore = () => {
    let { page } = this.props.timesByGroup;
    const { totalPages } = this.props.timesByGroup;
    page += 1;
    if (page <= totalPages) {
      this.props.getTimesByGroup(this.props.groupId, { page });
    }
  }

  showSnackBar = (msg) => {
    Snackbar.show({
        title: msg,
        duration: Snackbar.LENGTH_SHORT,
    });
  }

  searchInputRef = (input) => {
    this.textInputRef = input;
  }
  renderRow = ({ item }) => {
    const { startedAt, stoppedAt } = item;
    return (
      <TimeItem
        startedAt={startedAt}
        stoppedAt={stoppedAt}
      />
    );
  };

  renderSectionRow = ({item, index, section}) => {
    return (
      <TimeItem
        key={index}
        time={item}
      />
    )
  };
  renderActivityHeader = () => {
    const { activityName, sentence } = this.props;
    return (
      <View
        style={{
          backgroundColor: EStyleSheet.value('$backgroundColor'),
          justifyContent: 'center',
          paddingBottom: 15,
          paddingTop: 15,
          paddingHorizontal: 10
        }}
      >
        <Text
          style={{
            fontSize: 21,
            fontWeight: '600',
            color: EStyleSheet.value('$textColor')
          }}
        >
        {activityName}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: EStyleSheet.value('$textColor'),
            letterSpacing: 0.8,
          }}
        >{sentence}</Text>

      </View>
    );
  };

  renderSectionHeader = ({ section: { title } }) => {
    return (
      <View
        style={{
          //height: 60,
          //borderColor: EStyleSheet.value('$textColor'),
          //borderWidth: 1,
          backgroundColor: EStyleSheet.value('$backgroundColor'),
          justifyContent: 'center',
          padding: 10
        }}
      >
        <Text style={{ fontWeight: 'bold', color: EStyleSheet.value('$textColor') }}>{title}</Text>
      </View>
    );
  };

  renderListHeader = () => null;
  renderListFooter= () => null;
  render() {
    const { rows, sections } = this.props.timesByGroup;
    return (
      <View style={styles.container}>
        {this.renderActivityHeader()}
        <SectionList
          keyExtractor={(item, index) => item + index}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderSectionRow}
          sections={sections}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.onRefresh}
            />
          }
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.2}
        />
        {
          /*
          <FlatList
            //removeClippedSubviews={false}
            keyboardShouldPersistTaps='always'
            ref={(ref) => { this.flatListRef = ref; }}
            extraData={rows}
            ListHeaderComponent={this.renderListHeader}
            keyExtractor={item => item.id}
            data={rows}
            renderItem={this.renderRow}
            ListFooterComponent={this.renderListFooter}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
              />
            }
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.2}

          />
          */
        }

      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
  },
  icon: {
    color: '$iconColor'
  }
});

const mapStateToProps = (state) => (
  {
    network: state.network,
    timesByGroup: state.timesByGroup,
  }
);
export default connect(mapStateToProps, {
  getTimesByGroup
})(TimeHistoryScreen);
