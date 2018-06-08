const _ = require('lodash');
const mongoose = require('mongoose');
const Group = mongoose.model('group');
const Tag = mongoose.model('tags');
const Share = mongoose.model('canshare');
const Device = mongoose.model('devices');
const Time = mongoose.model('time');
const {
  getDeviceTokens,
  sendNotifications
} = require('../services/Notification');

const SendStartActivityNotification = async (userId, groupId, startedAt) => {
  try {
    const group =
      await Group.findOne({_id: groupId})
      .populate({path: 'userId', select: ['fullName']})
      .populate({path: 'activityId', select: ['name']});

    if(!group){
      return false;
    }
    const tags  =
      await Tag.find({ _id: { $in: group.tags }}, { _id: 0, name: 1});

    let sentence = '';
    _.forEach(tags, (tag)=>{
      sentence = tag.name+' '+sentence;
    });
    sentence = sentence.trim();

    const title = group.userId.fullName;
    const body = `${group.activityId.name}▶︎ ${sentence}`;
    // ▷ ► • ▶︎

    // get can share user ids from canshares model
    const sharedWithUserIds =
      await Share.find({userId, groupId}, {_id: 0, sharedWith: 1});

    if(sharedWithUserIds.length === 0){
      return false;
    }

    let userIdsArray = [];
    _.forEach(sharedWithUserIds, (sharedWith)=>{
      userIdsArray.push(sharedWith.sharedWith);
    });

    // get registered device tokens by user ids
    const devices =
      await Device.find({userId: {$in: userIdsArray}}, {_id: 0, token: 1});

    let registeredIds = [];
    _.forEach(devices, (obj) => {
      registeredIds.push(obj.token);
    });
    //console.log(title, body, userIdsArray, registeredIds);
    const data = {
      title,
      body,
      badge: 0,
      custom: {
        payload: {
          sender: 'yactivity',
          screen: 'app.FeedScreen',
          data: {
            startedAt
          }
        },
      },
    }
    sendNotifications(registeredIds,data);
  } catch(e) {
    console.log(e);
  }
}

const SendStopActivityNotification = async (userId, timeId) => {
  try {

    const time = await Time.findOne({_id: timeId, userId});

    const groupId = time.groupId;

    const group =
      await Group.findOne({_id: groupId})
      .populate({path: 'userId', select: ['fullName']})
      .populate({path: 'activityId', select: ['name']});

    if(!group){
      return false;
    }

    const tags  =
      await Tag.find({ _id: { $in: group.tags }}, { _id: 0, name: 1});

    let sentence = '';
    _.forEach(tags, (tag)=>{
      sentence = tag.name+' '+sentence;
    });
    sentence = sentence.trim();

    const title = group.userId.fullName;
    const body = `${group.activityId.name} ${sentence} ✔︎`;

    // get can share user ids from canshares model
    const sharedWithUserIds =
      await Share.find({userId, groupId}, {_id: 0, sharedWith: 1});

    if(sharedWithUserIds.length === 0){
      return false;
    }

    let userIdsArray = [];
    _.forEach(sharedWithUserIds, (sharedWith)=>{
      userIdsArray.push(sharedWith.sharedWith);
    });

    // get registered device tokens by user ids
    const devices =
      await Device.find({userId: {$in: userIdsArray}}, {_id: 0, token: 1});

    let registeredIds = [];
    _.forEach(devices, (obj) => {
      registeredIds.push(obj.token);
    });
    //console.log(title, body, userIdsArray, registeredIds);
    const data = {
      title,
      body,
      custom: {
        payload: {
          sender: 'yactivity',
          screen: 'app.FeedScreen',
          data: {
            startedAt: time.startedAt,
            stoppedAt: time.stoppedAt
          }
        },
      },
    }
    sendNotifications(registeredIds,data);
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  SendStartActivityNotification,
  SendStopActivityNotification
};
