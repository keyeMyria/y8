const mongoose = require('mongoose');

module.exports = (criteria, sortBy, page, offset = 0, limit = 3) => {
  const Group = mongoose.model('group');
  const query = Group.aggregate([
    { $match : criteria },
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
    { $sort: {"updatedAt": -1} }, // dont remove this
    {
      $group : {
        _id : {
          //"userId": "$userId",
          "activityId": "$activityId",
        },
        updatedAt: {$max: '$updatedAt'},
        groups: {
          "$push": {
            groupId: "$_id",
            tagsGroup: "$tags",
            updated: "$updatedAt",
            sharedWith: "$sharedWith",
            groupTimes: "$times"
          }
        },
      }
    },
    { $sort: {"updatedAt": -1} } // dont remove this also.
  ]).skip(offset)
    .limit(limit);

  const queryCount = Group.aggregate([
    { $match : criteria },
    { $group : {
        _id : {
          "userId": "$userId",
          "activityId": "$activityId",
        },
        count: {
          $sum: 1
        }
      }
    },
  ]);

  return Promise.all([query, queryCount]).then((results) => {
    return {
      rows: results[0],
      count: results[1].length,
      offset,
      limit,
      page,
      totalPages: Math.ceil(results[1].length>limit?results[1].length/limit:1)
    }
  });

};
