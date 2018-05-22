const mongoose = require('mongoose');

module.exports = (criteria, sortBy, page, offset = 0, limit = 20) => {
  const Time = mongoose.model('time');
  const query = Time.find(criteria, {
    //groupId: 1,
    //_id: 0,
    startedAt: 1,
    stoppedAt: 1
  })//.populate({path: 'fromUser', select: ['email','firstName']})
    //.populate({path: 'toUser', select: 'email'})
    .sort({[sortBy]: -1})
    .skip(offset)
    .limit(limit);

  return Promise.all([query, Time.find(criteria).count()]).then((results) => {
    return {
      rows: results[0],
      count: results[1],
      offset,
      limit,
      page,
      totalPages: Math.ceil(results[1]>limit?results[1]/limit:1)
    }
  });

};
