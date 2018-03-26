const mongoose = require('mongoose');

module.exports = (criteria, sortBy, offset = 0, limit = 20) => {
  const Group = mongoose.model('group');

  // const counQuery  = Group.aggregate([
  //   { $match : criteria },
  //   { $group : { _id : { "activityId": "$activityId" }, "tags": { $addToSet: "$$ROOT"}} },
  // ]);
  const query = Group.aggregate([
    { $match : criteria },
    { "$sort": { [sortBy]: 1 } },
    { $group : { _id : { "activityId": "$activityId" }, "tags": { $addToSet: "$$ROOT"}} },
    { "$skip": offset},
    { "$limit": limit }
  ])//.populate({path: 'fromUser', select: ['fullName', 'profileId', 'email']})
    //.populate({path: 'toUser', select: ['fullName', 'profileId', 'email']})
    //.sort({[sortBy]: -1})
    //.skip(offset)
    //.limit(limit);

  return Promise.all([query]).then((results) => {
    return {
      rows: results[0],
      count: results[0].length,
      //count: results[1],
      offset: offset,
      limit: limit
    }
  });

};
