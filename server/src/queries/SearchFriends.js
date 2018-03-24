const mongoose = require('mongoose');

module.exports = (criteria, sortBy, offset = 0, limit = 20) => {
  const Friend = mongoose.model('friends');
  const query = Friend.find(criteria, {
    fromUser: 1,
    toUser: 1,
    status: 1
  }).populate({path: 'fromUser', select: ['fullName','pic', 'profileId', 'email']})
    .populate({path: 'toUser', select: ['fullName','pic', 'profileId', 'email']})
    .sort({[sortBy]: 1})
    .skip(offset)
    .limit(limit);

  return Promise.all([query, Friend.find(criteria).count()]).then((results) => {
    return {
      rows: results[0],
      count: results[1],
      offset: offset,
      limit: limit
    }
  });

};
