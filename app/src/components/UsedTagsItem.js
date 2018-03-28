import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextButton from '../components/TextButton';
import {
  globalIconColor,
  globalTextColor,
  globalBackgroundColor,
} from '../styles/Global';

class UsedTagsItem extends React.PureComponent {

  removeGroupFromActivity = (activityId, groupId) => {
    Alert.alert(
      'Confirm',
      `Delete this group?`,
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
              this.props.removeGroupFromActivity(activityId, groupId);
            });
          }
        },
      ],
      { cancelable: false }
    );
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
  onShare = () => {
    const { groupId, myActivities, activity } = this.props;

    const tags = myActivities.byActivityId[activity.id].byGroupId[groupId];

    const sentence = tags.map((id) => `${this.props.tags.byId[id].name} `);

    this.props.onShare(groupId, activity, tags, sentence);
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
        <Text style={{ fontSize: 18, marginRight: 10, color: globalTextColor }}>
          {this.props.tags.byId[tagId].name}
        </Text>
        <MaterialIcons
          name='clear'
          size={21}
          color={globalIconColor}
          onPress={() => { this.removeTagFromGroup(activityId, groupId, tagId); }}
        />
      </View>
    ));
  }


  render() {
    const { groupId, myActivities, activity } = this.props;
    const { byActivityId } = myActivities;
    return (
      <View style={styles.outerContainer}>
        <View
          style={{
            backgroundColor: 'white',
            paddingRight: 10,
            paddingTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          <MaterialIcons
            name='clear'
            size={21}
            color={globalIconColor}
            onPress={() => { this.removeGroupFromActivity(activity.id, groupId); }}
          />
        </View>
        <View style={styles.innerContainer}>
          {this.renderTagsGroup(activity.id, groupId, byActivityId[activity.id].byGroupId[groupId])}
        </View>
        <View style={styles.footer}>
          <TextButton
            containerStyle={{ marginLeft: 10 }}
            title='Share'
            onPress={this.onShare}
          />
          <TextButton
            containerStyle={{
              borderWidth: 0.3,
              borderRadius: 3,
              borderColor: '#38B211',
              height: 25,
              marginRight: 10
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

const styles = StyleSheet.create({
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
    //backgroundColor: globalBackgroundColor,
    flexDirection: 'row',
    height: 30,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  innerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  textContainer: {
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center'
  }

});

export default UsedTagsItem;
