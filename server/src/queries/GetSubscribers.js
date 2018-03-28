const mongoose = require('mongoose');

module.exports = (criteria, sortBy, offset = 0, limit = 20) => {
  const Subscription = mongoose.model('subscriptions');
  const query = Subscription.find(criteria, {
    _id: 0,
    subUserId: 1,
  }).populate({path: 'subUserId', select: ['fullName','profileId']})
    .sort({[sortBy]: 1})
    .skip(offset)
    .limit(limit);
  return Promise.all([query, Subscription.find(criteria).count()]).then((results) => {
    return {
      rows: results[0],
      count: results[1],
      offset: offset,
      limit: limit
    }
  });
};
