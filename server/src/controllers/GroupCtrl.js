'use strict'
const mongoose = require('mongoose');
const _ = require('lodash');
const Pagination = require('../services/Pagination');
const getMyActivities = require('../queries/GetMyActivities');

class GroupCtrl {
  create(req, res, next) {
    const { userId } = req;
    const {
      groupId,
      activityId,
      tags,
      createdAt,
      updatedAt
    } = req.body;

    const sortedTags = tags.sort();
    const data = {
      _id: groupId,
      userId,
      activityId,
      tags: sortedTags,
      latest: 1,
      createdAt,
      updatedAt
    };

    console.log('data', data);
    const Group = mongoose.model('group');

    // Find activity and check if same group is isExist
    // add to array if group not isExists
    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.activityId = {$eq: activityId};
    criteria.tags = {$eq: sortedTags}

    Group.findOne(criteria).then((result) => {
      if (!result) {
        return Group.create(data);
      }else{
        result.updatedAt = Date.now();
        result.save();
      }
      return false;
    }).then((result) => {
      if (!result || result === false) {
        console.log("Group already exists");
        res.status(200).send("Group already exists");
      } else {
        console.log("Group created successfully");
        res.status(200).send("Group created successfully");
      }
      next();

    }).catch((groupError) => {
      console.log(groupError);
      req.log.error(groupError.message);
      res.status(400).send('Bad request');
      next();
    });

  }

  update(req, res, next) {
    const { userId } = req;
    const {
      groupId,
      updatedAt
    } = req.body;
    console.log('body: ',req.body);

    const Group = mongoose.model('group');

    const criteria =  {};
    criteria._id = {$eq: groupId};
    Group.findOneAndUpdate(criteria, { $set: { updatedAt, latest: 1 } })
      .then((result) => {
        console.log('result', result);
        if (!result || result === false) {
          console.log("Failed to update");
          res.status(400).send("Failed to update");
        } else {
          console.log("Group updated successfully");
          res.status(200).send("Group updated successfully");
        }
        next();

      }).catch((groupError) => {
        console.log(groupError);
        req.log.error(groupError.message);
        res.status(400).send('Bad request');
        next();
      });
  }

  get(req, res, next) {
    const { page, offset, limit } = Pagination(req, 'myactivites');
    const { userId } = req;
    const Group = mongoose.model('group');

    console.log(page, offset, limit);

    // build search criteria
    const criteria =  {};
    criteria.userId = {$eq: userId};

    getMyActivities(criteria, 'updatedAt', page, offset, limit).then((results) => {
      console.log('################');
      console.log(results);

      /*
      let data = {
        byActivityId: {},
        allActivityIds: [],
      };

      _.forEach(results.rows, (row) => {
        console.log(row);
        const { activityId } = row._id;
        data.allActivityIds.push(activityId);
        let allGroupIds = [];
        let byGroupId = {};
        _.forEach(row.tags, (tag)=>{
          //console.log(tag);
          allGroupIds.push(tag._id);
          byGroupId[tag._id] = tag.tags;
        });
        data.byActivityId[activityId] = { allGroupIds, byGroupId };
      });
      */

      //console.log(data);
      res.status(200).send(results);
      next();


      /*
      let data = {
        byActivityId: {},
        allActivityIds: [],
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
      */

    });

  }

  deleteTagFromGroupByActivity(req, res, next) {
    const { userId } = req;
    const { groupId, tagId } = req.params;

    const Group = mongoose.model('group');

    const criteria =  {};
    criteria._id = {$eq: groupId};
    criteria.userId = {$eq: userId};

    let deleteAll = false;
    Group.findOne(criteria, {
      tags: 1,
    }).then((result) => {
      if(!result) {
        return false;
      }

      const index = result.tags.indexOf(tagId);
      if (index !== -1) {
        result.tags.splice(index, 1);
      }
      if (result.tags.length === 0) {
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
    const { groupId } = req.params;

    //console.log(req.params);

    const Group = mongoose.model('group');

    const criteria =  {};
    criteria._id = {$eq: groupId};
    criteria.userId = {$eq: userId};
    Group.remove(criteria).then((deleted) => {
        if (!deleted) {
          console.log("Failed to delete group");
          res.status(400).send("Failed to delete group");
        } else {
          console.log("Group deleted successfully");
          res.status(200).send("");
        }
        next();
      }).catch((myActivityError) => {
        console.log(myActivityError);
        req.log.error(myActivityError.message);
        res.status(400).send('Bad request');
        next();
      });

    // const criteria =  {};
    // criteria._id = {$eq: groupId};
    // criteria.userId = {$eq: userId};
    //
    // Group.remove(criteria).then((deleted) => {
    //   if (!deleted) {
    //     console.log("Failed to delete group");
    //     res.status(400).send("Failed to delete group");
    //   } else {
    //     console.log("Group deleted successfully");
    //     res.status(200).send("Deleted");
    //   }
    //   next();
    // }).catch((myActivityError) => {
    //   console.log(myActivityError);
    //   req.log.error(myActivityError.message);
    //   res.status(400).send('Bad request');
    //   next();
    // });
  }

  getGroupsByActivity (req, res, next) {
    const { userId } = req;
    const { activityId } = req.params;
    const Group = mongoose.model('group');

    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.activityId = {$eq: activityId};

    Group.find(criteria,{tags: 1})
    .populate('cansharewith')
    .sort({ 'updatedAt': -1})
    .then((results) => {
      let finalResults = [];
      results.forEach((row)=>{
        const newRow = row.toObject();
        delete newRow._id;
        newRow.cansharewith = newRow.cansharewith.length;
        finalResults.push(newRow);
      });
      res.status(200).send(finalResults);
      next();
    }).catch((getGroupByActivityError) => {
      console.log(getGroupByActivityError);
      req.log.error(getGroupByActivityError.message);
      res.status(400).send('Bad request');
      next();
    });
  }

}

module.exports = GroupCtrl;
