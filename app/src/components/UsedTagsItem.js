import React from 'react';
import {
  View,
  Text,
  Alert,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextButton from '../components/TextButton';
import ShareIconButton from './ShareIconButton';

class UsedTagsItem extends React.PureComponent {

  onShare = () => {
    const { groupId, activity, tagsGroup } = this.props;

    //const { tagsGroup } = myActivities.byActivityId[activity.id].byGroupId[groupId];

    const sentence = tagsGroup.map((id) => `${this.props.tags.byId[id].name} `);

    this.props.onShare(groupId, activity, sentence);
  }
  removeTagFromGroup = (activityId, groupId, tagId) => {
    Alert.alert(
      'Confirm',
      `remove this tag ${this.props.tags.byId[tagId].name}?`,
      [
        {
          style: 'cancel',
          text: 'Cancel',
          onPress: () => null
        },
        {
          style: 'destructive',
          text: 'Delete',
          onPress: () => {
            this.setState({
              isDelete: true
            }, () => {
              this.props.removeTagFromGroup(activityId, groupId, tagId);
            });
          }
        },
      ],
      { cancelable: false }
    );
  }

  removeGroupFromActivity = () => {
    const { activity, groupId } = this.props;
    console.log(this.props);
    Alert.alert(
      'Confirm',
      'Delete this group?',
      [
        {
          style: 'cancel',
          text: 'Cancel',
          onPress: () => null
        },
        {
          style: 'destructive',
          text: 'Delete',
          onPress: () => {
            this.setState({
              isDelete: true
            }, () => {
              this.props.removeGroupFromActivity(activity.id, groupId);
            });
          }
        },
      ],
      { cancelable: false }
    );
  }

  useThisGroupForActivity = (activityId, groupId) => {
    this.props.useThisGroupForActivity(activityId, groupId);
  }

  renderTagsGroup = (activityId, groupId, tags) => {
    return tags.map((tagId) => (
      <View
        key={tagId}
        style={styles.textContainer}
      >
        <Text style={{ fontSize: 18, marginRight: 10, color: EStyleSheet.value('$textColor') }}>
          {this.props.tags.byId[tagId].name}
        </Text>
        <MaterialIcons
          name='clear'
          size={21}
          color={EStyleSheet.value('$iconColor')}
          onPress={() => { this.removeTagFromGroup(activityId, groupId, tagId); }}
        />
      </View>
    ));
  }

  render() {
    const { groupId, activity, tagsGroup } = this.props;
    //const { byActivityId } = myActivities;
    return (
      <View style={styles.outerContainer}>
        <View
          style={{
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            backgroundColor: '#FFFFFF',
            paddingRight: 10,
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          <MaterialIcons
            name='clear'
            size={21}
            color={EStyleSheet.value('$iconColor')}
            onPress={this.removeGroupFromActivity}
          />
        </View>
        <View style={styles.innerContainer}>
          {this.renderTagsGroup(activity.id, groupId, tagsGroup)}
        </View>
        <View style={styles.footer}>
          <ShareIconButton
            offlineMode={this.props.offlineMode}
            outerContainer={{ marginLeft: 10 }}
            onSharePress={this.onShare}
            sharedWith={this.props.sharedWith}
          />
          <TextButton
            containerStyle={{
              borderWidth: 0.3,
              borderRadius: 3,
              borderColor: '#38B211',
              height: 25,
              marginRight: 10,
            }}
            titleStyle={{
              fontSize: 14,
              color: '#38B211',
              fontWeight: '600'
            }}
            title='START'
            onPress={() => {
              this.useThisGroupForActivity(activity.id, groupId);
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  outerContainer: {
    // borderWidth: 1,
    // borderColor: 'gray',
    // marginHorizontal: 10,
    // marginBottom: 10,

    borderRadius: 5,
    //borderColor: '#ddd',
    //borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0.2, height: 0.4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    //elevation: 1,
    borderWidth: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    backgroundColor: '#FFFFFF'
  },
  footer: {
    backgroundColor: 'rgba(245,246,247,1)', //'#f7f8f9',
    flexDirection: 'row',
    //height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  innerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  textContainer: {
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  loading: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }

});

export default UsedTagsItem;
