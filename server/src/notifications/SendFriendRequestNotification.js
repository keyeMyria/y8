const _ = require('lodash');
const mongoose = require('mongoose');
const Friend = mongoose.model('friends');
const User = mongoose.model('users');
const {
  getDeviceTokens,
  sendNotifications
} = require('../services/Notification');

const SendFriendRequestNotification = async (fromUserId, toUserId) => {

  try {
    // Get toUserId device token
    const tokens = await getDeviceTokens(toUserId);
    console.log(tokens);
    let registeredIds = [];
    _.forEach(tokens, (obj) => {
      registeredIds.push(obj.token);
    });
    // Get fromUserId fullName
    const fromUser = await User.findOne({ _id: fromUserId }, {fullName: 1});

    // title: fullName
    // subtitle: sent you friend request
    const data = {
      title: fromUser.fullName,
      body: 'sent you friend request',
      custom: {
        payload: {
          sender: 'yactivity',
          screen: 'app.FriendsScreen',
          data: fromUser
        },
      },
    }
    console.log(registeredIds,data);
    sendNotifications(registeredIds,data);
  } catch(e) {
    console.log(e);
  }

}
module.exports = SendFriendRequestNotification;
