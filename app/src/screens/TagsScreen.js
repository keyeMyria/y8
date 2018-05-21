import React from 'react';
import {
  View,
  Platform,
  FlatList,
  Text,
  UIManager,
  ScrollView,
  RefreshControl,
  LayoutAnimation,
  KeyboardAvoidingView
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Feather from 'react-native-vector-icons/Feather';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import DeviceInfo from 'react-native-device-info';

import SnackBar from '../services/SnackBar';
import TextButton from '../components/TextButton';
import TagItem from '../components/TagItem';
import SearchBar from '../components/SearchBar';
import UsedTagsItem from '../components/UsedTagsItem';
import Loading from '../components/Loading';

import { SearchTags } from '../services/TagService';
import {
  getTags,
  addTag,
  updateTag,
  deleteTag,
} from '../actions/TagActions';

import {
  addTagsGroupToMyActivity,
  useThisGroupForActivity,
  removeTagFromGroup,
  removeGroupFromActivity
} from '../actions/GroupActions';

class TagsScreen extends React.Component {
  static navigatorStyle = {
    navBarNoBorder: true
  };
  constructor(props) {
    super(props);
    const deviceId = DeviceInfo.getDeviceId();
    this.iphoneVersion = 0;
    if (deviceId.indexOf('iPhone10') !== -1) {
      this.iphoneVersion = 10;
    }
    this.state = {
      visible: false,
      tag: null,
      searchIds: [],
      isSearchOn: false,
      selectedTags: [],
      sentence: '',
      activity: null,
      selectedIndex: 0,
      SegmentedControlTabTopPadding: 0
    };
    this.timeout = 0;
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
       UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    const { activity } = this.props;
    const groups = this.props.myActivities.byActivityId[activity.id];
    let hasTags = false;
    if (!_.isEmpty(groups) && !_.isEmpty(groups.allGroupIds)) {
      hasTags = groups.allGroupIds.length > 0;
    }

    if (hasTags) {
      this.props.navigator.setButtons({
        rightButtons: []
      });
    }

    this.setState({
      activity,
      selectedIndex: hasTags ? 0 : 1
    });

    if (this.props.navigator) {
      // Feather.getImageSource('plus', 30, EStyleSheet.value('$iconColor')).then((source) => {
      //   this.props.navigator.setButtons({
      //     rightButtons: [{
      //       id: 'add',
      //       icon: source,
      //       disableIconTint: true, // disable default color,
      //     }]
      //   });
      // });
      // if you want to listen on navigator events, set this up
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
      this.props.navigator.setStyle({
        navBarSubtitleColor: EStyleSheet.value('$subTextColor'),
        navBarSubtitleFontSize: 12,
      });
    }

    //this.props.getTags();
  }

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.myActivities.removingTag.loading &&
      this.props.myActivities.removingTag.loading &&
      _.isNull(nextProps.myActivities.error)) {
      SnackBar('Tag removed from group');
    } else if (!nextProps.myActivities.removingTag.loading &&
      this.props.myActivities.removingTag.loading &&
      !_.isNil(nextProps.myActivities.error)) {
      SnackBar(nextProps.myActivities.error.data);
    } else if (!nextProps.myActivities.removingTag.loading &&
      this.props.myActivities.removingTag.loading &&
      _.isUndefined(nextProps.myActivities.error)) {
      SnackBar('Service down, please try later');
    }

    if (!nextProps.myActivities.removingGroup.loading &&
      this.props.myActivities.removingGroup.loading &&
      _.isNull(nextProps.myActivities.error)) {
      SnackBar('Group removed from activity');
    } else if (!nextProps.myActivities.removingGroup.loading &&
      this.props.myActivities.removingGroup.loading &&
      !_.isNull(nextProps.myActivities.error) &&
      !_.isUndefined(nextProps.myActivities.error)) {
      SnackBar(this.props.myActivities.error.data);
    } else if (!nextProps.myActivities.removingGroup.loading &&
      this.props.myActivities.removingGroup.loading &&
      _.isUndefined(nextProps.myActivities.error)) {
      SnackBar('Service down, please try later');
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentDidUpdate() {
    this.setOfflineMode();
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add' && this.props.navigator) {
        this.props.navigator.showModal({
          screen: 'app.TagModal',
          title: 'Create Tags',
          passProps: {
            tag: null,
            tags: this.props.tags
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
      screen: 'app.TagModal',
      title: 'Update Tag',
      passProps: {
        tag: this.props.tags.byId[id],
        tags: this.props.tags
      },
      navigatorStyle: {
        navBarTextColor: EStyleSheet.value('$textColor')
      },
      animationType: 'slide-up'
    });
  }

  onItemPress = (checked, tagId) => {
    if (checked) {
      const selectedTags = [...this.state.selectedTags, tagId];
      //selectedTags.reverse();
      this.setState({
        selectedTags,
        sentence: selectedTags.map((id) => `${this.props.tags.byId[id].name} `)
      });
    } else {
      this.deleteTagFromSeletedTags(tagId);
    }
  }

  onSearchBarFocus = () => {
    this.setState({
      SegmentedControlTabTopPadding: this.iphoneVersion === 10 ? 40 : 25
    }, () => {
      this.props.navigator.toggleNavBar({
        to: 'hidden', // required, 'hidden' = hide , 'shown' = show
        animated: true
      });
    });
  }

  onSearchCancel = () => {
    this.setState({
      SegmentedControlTabTopPadding: 0
    }, () => {
      this.props.navigator.toggleNavBar({
        to: 'shown', // required, 'hidden' = hide , 'shown' = show
        animated: true
      });
    });
  }

  onShare = (groupId, activity, sentence) => {
    //console.log(groupId, activity, sentence);
    this.props.navigator.push({
      screen: 'app.ShareScreen',
      title: 'Share',
      passProps: {
        prevGroupId: this.props.prevGroupId,
        //prevTimeId: this.props.prevTimeId,
        activity,
        isExisted: true,
        groupId,
        //selectedTags: this.state.selectedTags,
        sentence,
        started: false
      },
      //backButtonTitle: 'Back',
      navigatorButtons: {}
    });
  }

  onRefresh = () => {
    //this.props.getTags();
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

  async componentWilUnmount() {
    await this.props.navigator.dismissAllModals({
      animationType: 'none'
    });
  }

  showSnackBar = (msg) => {
    Snackbar.show({
        title: msg,
        duration: Snackbar.LENGTH_SHORT,
    });
  }

  deleteTagFromSeletedTags = (tagId) => {
    const selectedTags = Object.assign([], this.state.selectedTags);
    const index = selectedTags.indexOf(tagId);
    if (index !== -1) {
      selectedTags.splice(index, 1);
      this.setState({
        selectedTags,
        sentence: selectedTags.map((id) => `${this.props.tags.byId[id].name} `)
      });
    }
  }

  handleSearchChangeText = (text) => {
    clearTimeout(this.timeout);

    if (text.length === 0) {
      this.setState({
        searchIds: [],
        isSearchOn: false
      });
    } else {
      let searchIds = [];
      this.timeout = setTimeout(() => {
        searchIds = SearchTags(this.props.tags.byId, text);
        this.setState({
          searchIds,
          isSearchOn: true
        });
      }, 800);
    }
  }

  handleSearchOnClear = () => {
    this.setState({
      searchIds: [],
      isSearchOn: false,
    });
  }

  scrollToOffset = () => {
    this.flatListRef.scrollToOffset({ x: 0, y: 0, animated: true });
  }

  addTagsGroupToMyActivity = () => {
    const { activity, selectedTags } = this.state;
    this.props.navigator.popToRoot({
      animated: true,
      animationType: 'fade',
    });
    this.props.addTagsGroupToMyActivity(activity, selectedTags, false);
  }

  useThisGroupForActivity = (activityId, groupId) => {
    this.props.navigator.popToRoot({
      animated: true,
      animationType: 'fade',
    });

    this.props.useThisGroupForActivity(activityId, groupId);
  }

  removeTagFromGroup = (activityId, groupId, tagId) => {
    this.props.removeTagFromGroup(activityId, groupId, tagId);
  }
  removeGroupFromActivity = (activityId, groupId) => {
    this.props.removeGroupFromActivity(activityId, groupId);
  }
  renderListHeader = () => {
    const { activity } = this.state;
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
          paddingBottom: 1,
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
            fontSize: 21,
            fontWeight: '600',
            color: EStyleSheet.value('$textColor')
          }}
        >
        {name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: EStyleSheet.value('$textColor'),
            letterSpacing: 0.8,
          }}
        >{this.state.sentence}</Text>
      </ScrollView>
      </View>
    );
  };
  renderListFooter= () => null;
  renderRow = ({ item }) => {
    //console.log(item);
    const { id, name } = this.props.tags.byId[item];
    return (
      <TagItem
        id={id}
        name={name}
        showEditIcon
        onEdit={this.onEdit}
        onItemPress={this.onItemPress}
        isChecked={this.state.selectedTags.indexOf(id) !== -1}
      />
    );
  };

  renderRowGroup = ({ item }) => {
    const { tagsGroup, sharedWith } =
    this.props.myActivities.byActivityId[this.state.activity.id].byGroupId[item];

    return (
      <UsedTagsItem
        offlineMode={this.props.network.offlineMode}
        onlyPrevGroupId={null}
        sharedWith={sharedWith}
        activity={this.state.activity}
        groupId={item}
        tagsGroup={[...tagsGroup]}
        tags={this.props.tags}
        removeTagFromGroup={this.removeTagFromGroup}
        removeGroupFromActivity={this.removeGroupFromActivity}
        useThisGroupForActivity={this.useThisGroupForActivity}
        onShare={this.onShare}
      />
    );
  };


  render() {
    const { tags, myActivities } = this.props;
    const { byActivityId } = myActivities;
    const { isSearchOn, searchIds, activity, selectedTags } = this.state;
    let groupIds = [];
    if (!_.isNil(activity) && !_.isNil(byActivityId[activity.id])) {
      groupIds = byActivityId[activity.id].allGroupIds;
    }
    //console.log(groupIds);


    if (_.isNull(activity)) {
      return null;
    }
    return (
      <View style={styles.container}>
        <SegmentedControlTab
          tabsContainerStyle={{
            paddingTop: this.state.SegmentedControlTabTopPadding,
            paddingVertical: 10,
            paddingHorizontal: 30,
            backgroundColor: '#FFFFFF',
          }}
          tabStyle={{ borderColor: EStyleSheet.value('$iconColor') }}
          activeTabStyle={{ backgroundColor: EStyleSheet.value('$iconColor') }}
          tabTextStyle={{ color: EStyleSheet.value('$textColor'), fontWeight: '600' }}
          values={['Used Tags', 'Tags']}
          selectedIndex={this.state.selectedIndex}
          onTabPress={(selectedIndex) => {
            this.setState({
              selectedIndex
            }, () => {
              let showAdd = false;
              if (this.state.selectedIndex === 1) {
                showAdd = true;
              }
              if (showAdd) {
                Feather.getImageSource('plus', 30, EStyleSheet.value('$iconColor')).then((source) => {
                  this.props.navigator.setButtons({
                    rightButtons: [{
                      id: 'add',
                      icon: source,
                      disableIconTint: true, // disable default color,
                    }]
                  });
                });
              } else {
                Feather.getImageSource('plus', 30, EStyleSheet.value('$iconColor')).then((source) => {
                  this.props.navigator.setButtons({
                    rightButtons: []
                  });
                });
              }
            });
          }}
        />
        {
          this.state.selectedIndex === 1 &&

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={17}
          >
          <SearchBar
            placeholderText={'Search tags'}
            onChangeText={this.handleSearchChangeText}
            onClear={this.handleSearchOnClear}
            onFocus={this.onSearchBarFocus}
            onCancel={this.onSearchCancel}
          />
          {this.renderListHeader()}
          {
            selectedTags.length > 0 &&
            <View
              style={{
                //height: 35,
                backgroundColor: EStyleSheet.value('$backgroundColor'),
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                position: 'relative',
                //backgroundColor: 'lightpink',
                //borderColor: 'gray',
                //borderBottomWidth: 1
                paddingBottom: 10,

              }}
            >
            {
              // <TextButton
              //   containerStyle={{ marginLeft: 10 }}
              //   title='Share'
              //   onPress={() => {
              //     this.props.navigator.push({
              //       screen: 'app.ShareScreen',
              //       title: 'Subscribers',
              //       passProps: {
              //         prevGroupId: this.props.prevGroupId,
              //         prevTimeId: this.props.prevTimeId,
              //         isExisted: false,
              //         activity: this.state.activity,
              //         selectedTags: this.state.selectedTags,
              //         sentence: this.state.sentence
              //       },
              //       //backButtonTitle: 'Back',
              //       navigatorButtons: {}
              //     });
              //    }}
              // />
            }
            <TextButton
              containerStyle={{ marginRight: 10 }}
              title='Continue'
              onPress={this.addTagsGroupToMyActivity}
            />
            </View>
          }
          <FlatList
            //removeClippedSubviews={false}
            keyboardShouldPersistTaps='always'
            ref={(ref) => { this.flatListRef = ref; }}
            extraData={tags}
            //ListHeaderComponent={this.renderListHeader}
            keyExtractor={item => item}
            data={
              isSearchOn ? searchIds : tags.allIds
            }
            renderItem={this.renderRow}
            ListFooterComponent={this.renderListFooter}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={tags.loading}
            //     onRefresh={this.onRefresh}
            //   />
            // }
          />

          {/*
            <TagModal
              visible={this.state.visible}
              hideModal={this.hideModal}
              onModalHide={this.onModalHide}
              onModalShow={this.onModalShow}
              addTag={this.props.addTag}
              updateTag={this.props.updateTag}
              deleteTag={this.props.deleteTag}
              tag={this.state.tag}
              tags={tags}
            />
          */}

        </KeyboardAvoidingView>
      }
      {
        this.state.selectedIndex === 0 &&
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: EStyleSheet.value('$backgroundColor'),
              height: 40,
              justifyContent: 'center',

              //padding: 20,
              //paddingTop: 10,
              paddingLeft: 15,
              //paddingBottom: 0,
            }}
          >
            <Text
              style={{
                fontSize: 21,
                fontWeight: '600',
                color: EStyleSheet.value('$textColor')
              }}
            >
            {activity.name[0].toUpperCase() + activity.name.slice(1).toLowerCase()}
            </Text>

          </View>
          <FlatList
            //removeClippedSubviews={false}
            keyboardShouldPersistTaps='always'
            //ref={(ref) => { this.flatListRef = ref; }}
            extraData={{
              data: groupIds,
              myActivities: this.props.myActivities,
            }}
            //ListHeaderComponent={this.renderListHeader}
            keyExtractor={item => item}
            data={groupIds}
            renderItem={this.renderRowGroup}
            ListFooterComponent={this.renderListFooter}
          />
        </View>
      }
      <Loading
        show={
          this.props.myActivities.removingTag.loading ||
          this.props.myActivities.removingGroup.loading
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
  }
});

const mapStateToProps = (state) => (
  {
    network: state.network,
    tags: state.tags,
    myActivities: state.myActivities,
  }
);
export default connect(mapStateToProps, {
  getTags,
  addTag,
  updateTag,
  deleteTag,
  addTagsGroupToMyActivity,
  removeTagFromGroup,
  removeGroupFromActivity,
  useThisGroupForActivity
})(TagsScreen);
