const mongoose = require('mongoose');

module.exports = (criteria, sortBy, offset = 0, limit = 20) => {
  const Time = mongoose.model('time');
  const query = Time.find(criteria, {
    userId: 1,
    activityId: 1,
    groupId: 1,
    tags: 1,
    startedAt: 1,
    stoppedAt: 1
  })//.populate({path: 'fromUser', select: ['email','firstName']})
    //.populate({path: 'toUser', select: 'email'})
    .sort({[sortBy]: 1})
    .skip(offset)
    .limit(limit);

  return Promise.all([query, Time.find(criteria).count()]).then((results) => {
    return {
      rows: results[0],
      count: results[1],
      offset: offset,
      limit: limit
    }
  });

};
