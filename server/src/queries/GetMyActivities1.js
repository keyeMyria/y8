const mongoose = require('mongoose');

module.exports = (criteria, sortBy, offset = 0, limit = 20) => {
  const Group = mongoose.model('group');

  // const counQuery  = Group.aggregate([
  //   { $match : criteria },
  //   { $group : { _id : { "activityId": "$activityId" }, "tags": { $addToSet: "$$ROOT"}} },
  // ]);
  const query = Group.aggregate([
    { $match : criteria },
    //{ "$sort": { [sortBy]: 1 } },
    {
      "$lookup": {
        "from": "canshares",
        "localField": "_id",
        "foreignField": "groupId",
        "as": "sharedWith"
      }
    },
    {
      $addFields: {
        sharedWith: { "$size": { "$ifNull": [ "$sharedWith", [] ] } } ,
      }
    },
    {
      "$lookup": {
        'from': "times",
        'let': { groupId: '$_id' },
        "pipeline": [{
          $match: {
            $expr: {
              $and: [
                { $eq: ["$groupId", '$$groupId'] },
                { $eq: ["$latest", 1] }
              ]
            }
          },
        }],
          "as": "times"
        }
    },

    // {
    //   "$lookup": {
    //     "from": "times",
    //     "localField": "_id",
    //     "foreignField": "groupId",
    //     "as": "times"
    //   }
    // },
    //{ $match: { "groupId": '062440dd-bba3-4554-8c15-e57e844a8fc1' } },
    //{$unwind: { path: "$times", preserveNullAndEmptyArrays: true }},
    //{ $sort: {"times.stoppedAt": 1} },
    //{ "$unwind": "$sharedWith" },
    // {
    //    $project: {
    //       "sharedWithCount":  {  $size:[] }//{ $size: "$sharedWith" }
    //    }
    //  },
    {
      $group : {
        _id : {
          "userId": "$userId",
          "activityId": "$activityId",
          "_id": "$_id",
          "updatedAt": "$updatedAt"
        },
        groups: {
          "$push": {
            groupId: "$_id",
            tagsGroup: "$tags",
            sharedWith: "$sharedWith",
            groupTimes: "$times"
          }
        },

        //tags: { $addToSet: "$$ROOT" },

        //tags: { $addToSet: { tags1: "$$ROOT" , sharedWith: {$sum: "1"}} } ,
      }
    },
    { "$sort": { "_id.updatedAt": -1 } },
    // {
    //   $project:{
    //     "tags": 0,
    //   }
    // }
    //{ "$skip": offset},
    //{ "$limit": limit }
  ])//.populate({path: 'fromUser', select: ['fullName', 'profileId', 'email']})
    //.populate({path: 'toUser', select: ['fullName', 'profileId', 'email']})
    //.sort({[sortBy]: -1})
    //.skip(offset)
    //.limit(limit);

  return Promise.all([query]).then((results) => {
    return {
      rows: results[0],
      //count: results[0].length,
      //count: results[1],
      //offset: offset,
      //limit: limit
    }
  });

};

/*
db.getCollection('user').aggregate([
    {$lookup: {from: "post", localField: "_id", foreignField: "userId", as: "post"}},
    {$unwind: { path: "$post", preserveNullAndEmptyArrays: true }},
    {$sort: {"post.createdAt": -1}},
    {$group: {"_id": "$_id", "name": {$first: "$name"}, "post": {$first: "$post"}},
    {$project: {"_id": 1, "name": 1, post": 1}}
])



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

*/
