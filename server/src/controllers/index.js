const SampleCtrl = require('./SampleCtrl');
const LoginCtrl = require('./LoginCtrl');
const AuthCtrl = require('./AuthCtrl');
const ActivityCtrl = require('./ActivityCtrl');
const TagCtrl = require('./TagCtrl');
const TimeCtrl = require('./TimeCtrl');
const FriendCtrl = require('./FriendCtrl');
const GroupCtrl = require('./GroupCtrl');
const DeviceCtrl = require('./DeviceCtrl');
const SubscriptionCtrl = require('./SubscriptionCtrl');

module.exports = {
  Sample: SampleCtrl,
  Login: LoginCtrl,
  Auth: AuthCtrl,
  Activity: ActivityCtrl,
  Tag: TagCtrl,
  Time: TimeCtrl,
  Friend: FriendCtrl,
  Group: GroupCtrl,
  Device: DeviceCtrl,
  Subscription: SubscriptionCtrl
};
