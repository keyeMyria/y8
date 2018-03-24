const mongoose = require('mongoose');

module.exports = (criteria, sortBy, page, offset = 0, limit = 20) => {
  const User = mongoose.model('users');
  const query = User.find(criteria, {
    id: 1,
    fullName: 1,
    email: 1,
    profileId: 1
  })//.populate({path: 'fromUser', select: ['email','firstName']})
    //.populate({path: 'toUser', select: 'email'})
    .sort({[sortBy]: 1})
    .skip(offset)
    .limit(limit);

  return Promise.all([query, User.find(criteria).count()]).then((results) => {
    return {
      rows: results[0],
      count: results[1],
      offset,
      limit,
      page,
      totalPages: results[1]>limit?results[1]/limit:1
    }
  });

};
