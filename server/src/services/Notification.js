const axios = require('axios');
const mongoose = require('mongoose');

const PushNotifications = new require('node-pushnotifications');
const  apnConfig = require('../config/apn');

const exampleData = {
    title: 'New push notification', // REQUIRED
    body: 'Powered by AppFeel', // REQUIRED
    custom: {
        sender: 'AppFeel',
    },
    priority: 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
    collapseKey: '', // gcm for android, used as collapseId in apn
    contentAvailable: true, // gcm for android
    delayWhileIdle: true, // gcm for android
    restrictedPackageName: '', // gcm for android
    dryRun: false, // gcm for android
    icon: '', // gcm for android
    tag: '', // gcm for android
    color: '', // gcm for android
    clickAction: '', // gcm for android. In ios, category will be used if not supplied
    locKey: '', // gcm, apn
    bodyLocArgs: '', // gcm, apn
    titleLocKey: '', // gcm, apn
    titleLocArgs: '', // gcm, apn
    retries: 1, // gcm, apn
    encoding: '', // apn
    badge: 2, // gcm for ios, apn
    sound: 'ping.aiff', // gcm, apn
    alert: {}, // apn, will take precedence over title and body
    // alert: '', // It is also accepted a text message in alert
    titleLocKey: '', // apn and gcm for ios
    titleLocArgs: '', // apn and gcm for ios
    launchImage: '', // apn and gcm for ios
    action: '', // apn and gcm for ios
    topic: '', // apn and gcm for ios
    category: '', // apn and gcm for ios
    contentAvailable: '', // apn and gcm for ios
    mdm: '', // apn and gcm for ios
    urlArgs: '', // apn and gcm for ios
    truncateAtWordEnd: true, // apn and gcm for ios
    mutableContent: 0, // apn
    expiry: Math.floor(Date.now() / 1000) + 28 * 86400, // seconds
    timeToLive: 28 * 86400, // if both expiry and timeToLive are given, expiry will take precedency
    headers: [], // wns
    launch: '', // wns
    duration: '', // wns
    consolidationKey: 'my notification', // ADM
};


const settings = {
  apn: {
    token: {
      key: '/Users/naveenkonduru/Workspace/appkeys/AuthKey_9A8347A4Y2.p8', // optionally: fs.readFileSync('./certs/key.p8')
      keyId: '9A8347A4Y2',
      teamId: '7L833VWLF3',
    },
    production: false
  }
};

const push = new PushNotifications(settings);

const sendNotifications = (registeredIds, data) => {
  if (registeredIds.length == 0) {
    return false;
  }
  data.priority = 'high';
  data.topic = 'org.reactjs.native.example.appy7';

  push.send(registeredIds, data)
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(results);
    });
};

const getDeviceTokens = async (userId) => {
  const Device = mongoose.model('devices');
  const criteria =  {};
  criteria.userId = {$eq: userId};

  return await Device.find(criteria,{ token: 1 });
}
module.exports = {
  sendNotifications,
  getDeviceTokens
};
