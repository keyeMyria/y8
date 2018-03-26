'use strict'
const mongoose = require('mongoose');
const _ = require('lodash');

class MyActivityCtrl {
  create(req, res, next) {

    //console.log(req.body);
    const {
      activityId,
      groupId,
      tags,
      createdAt,
      updatedAt
    } = req.body;

    const { userId } = req;
    const data = {
      userId,
      activityId,
      groups: [{
        groupId,
        tags: [...tags]
      }],
      createdAt,
      updatedAt
    };

    const sortedTags = tags.sort();
    const MyActivity = mongoose.model('myactivities');

    // Find activity and check if same group is isExist
    // add to array if group not isExists
    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.activityId = {$eq: activityId};
    MyActivity.findOne(criteria, {
      groups: 1,
    }).then((result) => {
      if (result) {
        let isExists = false;
        console.log(result.groups);
        const groups = result.groups;
        _.forEach(groups, (group) => {
            const oldSortedTags = group.tags.sort();
            if (_.isEqual(oldSortedTags, sortedTags)) {
              isExists = true;
            }
        });

        if (!isExists) {
          // add new group to activity
          return MyActivity.update(criteria, {
            $push: {
              groups: {
                $each: [{groupId,tags}],
                $position: 0 // push element to start of an array
              }
            }
          });
        }else{
          // group already exists
          return false;
        }

      } else {
        // create first activity with group
        return MyActivity.create(data);
      }

    }).then((result) => {

      if (!result || result === false) {
        console.log("Group already exists");
        res.status(200).send("Group already exists");
      } else {
        console.log("Group created successfully");
        res.status(200).send("Group created successfully");
      }
      next();

    }).catch((myActivityError) => {
      console.log(myActivityError);
      req.log.error(myActivityError.message);
      res.status(400).send('Bad request');
      next();
    });

  }
  create1(req, res, next) {

    //console.log(req.body);
    const {
      activityId,
      groupId,
      tags,
      createdAt,
      updatedAt
    } = req.body;

    const { userId } = req;
    const data = {
      userId,
      activityId,
      groups: [{
        groupId,
        tags: [...tags]
      }],
      createdAt,
      updatedAt
    };

    const sortedTags = tags.sort();
    const MyActivity = mongoose.model('myactivities');

    // Find activity and check if same group is isExist
    // add to array if group not isExists
    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.activityId = {$eq: activityId};
    MyActivity.findOne(criteria, {
      groups: 1,
    }).then((result) => {
      if (result) {
        let isExists = false;
        console.log(result.groups);
        const groups = result.groups;
        _.forEach(groups, (group) => {
            const oldSortedTags = group.tags.sort();
            if (_.isEqual(oldSortedTags, sortedTags)) {
              isExists = true;
            }
        });

        if (!isExists) {
          // add new group to activity
          return MyActivity.update(criteria, {
            $push: {
              groups: {
                $each: [{groupId,tags}],
                $position: 0 // push element to start of an array
              }
            }
          });
        }else{
          // group already exists
          return false;
        }

      } else {
        // create first activity with group
        return MyActivity.create(data);
      }

    }).then((result) => {

      if (!result || result === false) {
        console.log("Group already exists");
        res.status(200).send("Group already exists");
      } else {
        console.log("Group created successfully");
        res.status(200).send("Group created successfully");
      }
      next();

    }).catch((myActivityError) => {
      console.log(myActivityError);
      req.log.error(myActivityError.message);
      res.status(400).send('Bad request');
      next();
    });

  }

  get(req, res, next) {
    console.log(req.body);
    const { userId } = req;
    const MyActivity = mongoose.model('myactivities');
    const Times = mongoose.model('time');
    MyActivity.find({userId},{
      id: 1,
      activityId: 1,
      groups: 1,
      updatedAt: 1
    })//.populate('activityId', null, 'time'})
    //{path: 'times', model: Times}
      //.populate({path: 'toUser', select: 'email'})
      .sort({updatedAt: -1})
      //.skip(offset)
      //.limit(limit);
      .then((myactivities)=>{
        console.log(myactivities);

        let data = {
          byActivityId: {},
          allActivityIds: [],
          times:{}
        };
        _.forEach(myactivities,(myactivity) => {
          data.allActivityIds.push(myactivity.activityId);

          let allGroupIds = [];
          let byGroupId = {};
          _.forEach(myactivity.groups, (group) => {
            allGroupIds.push(group.groupId);
            byGroupId[group.groupId] = group.tags;
          });
          data.byActivityId[myactivity.activityId] = { allGroupIds,byGroupId };

        });

        console.log(data);
        res.status(200).send(data);
        next();
      })
      .catch((error)=>{
        req.log.error(error.message);
        res.status(400).send('Bad request');
        next();
      });
  }

  deleteTagFromGroupByActivity(req, res, next) {
    const { userId } = req;
    const { activityId, groupId, tagId } = req.params;

    const MyActivity = mongoose.model('myactivities');

    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.activityId = {$eq: activityId};

    MyActivity.findOne(criteria, {
      groups: 1,
    }).then((result) => {
      _.forEach(result.groups, (group, groupIndex) => {

        // if (!_.isUndefined(group)) {
        //   const index = group.tags.indexOf(tagId);
        //   if (index !== -1) {
        //     group.tags.splice(index, 1);
        //   }
        //   // if tags are empty, then delete group also.
        //   if (group.tags.length === 0) {
        //     //myactivity.groups.splice(groupIndex, 1);
        //     delete myactivity.groups[groupIndex];
        //   }
        // }

        if (!_.isUndefined(group)) {
          if (group.groupId === groupId) {
            const index = group.tags.indexOf(tagId);
            // is it valid?
            if (index !== -1) {
              group.tags.splice(index, 1);
            }
          }
          // if tags are empty, then delete group also.
          if (group.tags.length === 0) {
            delete result.groups[groupIndex];
            //result.groups.splice(groupIndex, 1);
          }
        }

      });
        result.groups = _.filter(result.groups);
      // if groups are empty then delete activity
      if (result.groups.length === 0) {
        return result.remove();
      } else {
        return result.save();
      }
    }).then((updated) => {
      if (!updated) {
        console.log("Failed to delete tag from group");
        res.status(400).send("Failed to delete tag from group");
      } else {
        console.log("Tag deleted successfully from group");
        res.status(200).send("Deleted");
      }
      next();
    }).catch((myActivityError) => {
      console.log(myActivityError);
      req.log.error(myActivityError.message);
      res.status(400).send('Bad request');
      next();
    });
  }

  //deleteGroupFromActivity
  deleteGroupFromActivity(req, res, next) {
    const { userId } = req;
    const { activityId, groupId } = req.params;

    const MyActivity = mongoose.model('myactivities');

    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.activityId = {$eq: activityId};

    MyActivity.findOne(criteria, {
      groups: 1,
    }).then((result) => {

       let index = -1;
      _.forEach(result.groups, (group, groupIndex) => {
          if (group.groupId == groupId) {
            index = groupIndex;
          }
      });
      // is it valid?
      if (index !== -1) {
        result.groups.splice(index, 1);
      }
      // if groups are empty then delete activity
      if (result.groups.length === 0) {
        return result.remove();
      } else {
        return result.save();
      }
    }).then((deleted) => {
      if (!deleted) {
        console.log("Failed to delete group");
        res.status(400).send("Failed to delete group");
      } else {
        console.log("Group deleted successfully");
        res.status(200).send("Deleted");
      }
      next();
    }).catch((myActivityError) => {
      console.log(myActivityError);
      req.log.error(myActivityError.message);
      res.status(400).send('Bad request');
      next();
    });
  }

  // Update useThisGroupForActivity
  // push group to start of an array
  updateGroupForActivity(req, res, next) {
    const { userId } = req;
    const { activityId, groupId } = req.body;

    const MyActivity = mongoose.model('myactivities');

    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.activityId = {$eq: activityId};

    MyActivity.findOne(criteria, {
      groups: 1,
    }).then((result) => {

       let groupIndex = -1;
      _.forEach(result.groups, (group, index) => {
          if (group.groupId == groupId) {
            groupIndex = index;
          }
      });
      // is it valid?
      if (groupIndex !== -1) {
        const tmp_group = result.groups[groupIndex];
        result.groups.splice(groupIndex, 1);
        result.groups.unshift(tmp_group);
      }
      return result.save();
    }).then((updated) => {
      if (!updated) {
        console.log("Failed to update group order");
        res.status(400).send("Failed to update group order");
      } else {
        console.log("Updated Group order successfully");
        res.status(200).send("Updated");
      }
      next();
    }).catch((myActivityError) => {
      console.log(myActivityError);
      req.log.error(myActivityError.message);
      res.status(400).send('Bad request');
      next();
    });
  }
}

module.exports = MyActivityCtrl;
