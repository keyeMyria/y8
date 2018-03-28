import _ from 'lodash';
import React from 'react';
import {
  Platform,
  FlatList,
  RefreshControl,
  UIManager,
  LayoutAnimation,
  View,
  Text,
  ScrollView
} from 'react-native';
//import _ from 'lodash';
//import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import ShareFriendRowItem from '../components/ShareFriendRowItem';
import TextButton from '../components/TextButton';

import {
  getSubscribers
} from '../actions/SubscriptionActions';
import {
  addTagsGroupToMyActivity,
  useThisGroupForActivity
} from '../actions/GroupActions';

class ShareScreen extends React.Component {
  static navigatorStyle = {
    navBarNoBorder: false
  };
  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.props.getSubscribers();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  // onEdit = (id) => {
  //   this.props.navigator.showModal({
  //     screen: 'app.ActivityModal',
  //     title: 'Update Activity',
  //     passProps: {
  //       activity: this.props.activities.byId[id],
  //       activities: this.props.activities
  //     },
  //     navigatorStyle: {},
  //     animationType: 'slide-up'
  //   });
  // }
  //
  // onItemPress = (activityId) => {
  //   this.props.navigator.push({
  //     screen: 'app.TagsScreen',
  //     title: 'Tags',
  //     passProps: {
  //       activity: this.props.activities.byId[activityId]
  //     },
  //     navigatorButtons: {
  //       rightButtons: [{
  //         id: 'add',
  //         icon: null,
  //         disableIconTint: true, // disable default color,
  //       }]
  //     }
  //   });
  // }
  //
  // onRefresh = () => {
  //   this.props.getSubscribers();
  // }
  //
  // showSnackBar = (msg) => {
  //   Snackbar.show({
  //       title: msg,
  //       duration: Snackbar.LENGTH_SHORT,
  //   });
  // }

  onRefresh = () => {
    this.props.getSubscribers();
  }

  renderActivityHeader = () => {
    const { activity } = this.props;
    let name = '';
    if (!_.isNull(activity) && !_.isEmpty(activity)) {
      name = activity.name;
    }
    if (name === '') {
      return null;
    }
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    return (
      <View
        style={{
          backgroundColor: EStyleSheet.value('$backgroundColor'),
          justifyContent: 'center',
          paddingBottom: 15,
          paddingTop: 5,
          paddingHorizontal: 10

        }}
      >
      <ScrollView
        style={{
          maxHeight: 80
        }}
      >
        <Text
          style={{
            fontSize: 17,
            color: EStyleSheet.value('$textColor')
            //flexGrow: 1,
          }}
        >{name} {this.props.sentence}</Text>
      </ScrollView>
      </View>
    );
  };

  renderListHeader = () => null;
  renderListFooter= () => null;
  renderRow = ({ item }) => {
    const { id, fullName, profileId } = item.subUserId;
    return (
      <ShareFriendRowItem
        userId={id}
        fullName={fullName}
        profileId={profileId}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        { this.renderActivityHeader() }
        {
          <View
            style={{
              height: 35,
              backgroundColor: EStyleSheet.value('$backgroundColor'),
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'relative',
              //borderColor: 'gray',
              //borderBottomWidth: 1
              paddingBottom: 10,
            }}
          >

          <TextButton
            containerStyle={{
              borderWidth: 0.3,
              borderRadius: 3,
              borderColor: '#38B211',
              height: 25,
              marginRight: 10
            }}
            title='START'
            titleStyle={{
              fontSize: 14,
              color: '#38B211',
              fontWeight: '600'
            }}
            onPress={() => {
              this.props.navigator.popToRoot({
                animated: true,
                animationType: 'fade',
              });
              const activity = Object.assign({}, this.props.activity);
              let selectedTags = [];
              if (this.props.selectedTags) {
                selectedTags = [...this.props.selectedTags];
              }
              if (!this.props.isExisted) {
                this.props.addTagsGroupToMyActivity(activity, selectedTags);
              } else {
                this.props.useThisGroupForActivity(activity.id, this.props.groupId);
              }
            }}
          />
          </View>
        }
        <FlatList
          //removeClippedSubviews={false}
          keyboardShouldPersistTaps='always'
          ref={(ref) => { this.flatListRef = ref; }}
          extraData={this.props.subscribers.data.rows}
          //ListHeaderComponent={this.renderListHeader}
          keyExtractor={item => item.subUserId.id}
          data={this.props.subscribers.data.rows}
          renderItem={this.renderRow}
          ListFooterComponent={this.renderListFooter}
          refreshControl={
            <RefreshControl
              refreshing={this.props.subscribers.loading}
              onRefresh={this.onRefresh}
            />
          }
        />

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

const mapStateToProps = (state) => {
  //console.log('ShareScreen:mapStateToProps:', state);
  const { subscribers } = state;
  return {
    subscribers,
  };
};
export default connect(mapStateToProps, {
  getSubscribers,
  addTagsGroupToMyActivity,
  useThisGroupForActivity
})(ShareScreen);