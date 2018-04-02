const mongoose = require('mongoose');

module.exports = (criteria, sortBy) => {
  const CanShare = mongoose.model('canshare');
  const query = CanShare.find(criteria, {
    sharedWith: 1,
  }).populate({path: 'sharedWith', select: ['fullName','profileId']})
    .sort({[sortBy]: 1})
    //.skip(offset)
    //.limit(limit);

    //, Subscription.find(criteria).count()
  return Promise.all([query]).then((results) => {
    return {
      rows: results[0],
      //count: results[1],
      //offset: offset,
      //limit: limit
    }
  });
};
