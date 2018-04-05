'use strict'
const mongoose = require('mongoose');
const _ = require('lodash');
const Pagination = require('../services/Pagination');
const getMyActivities = require('../queries/GetMyActivities');

class GroupCtrl {
  create(req, res, next) {
    const { userId } = req;
    const {
      prevGroupId,
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

    Group.findOneAndUpdate({_id: prevGroupId}, { $set: { latest: 0}})
      .then((result) => {

      });

    // Find activity and check if same group is isExist
    // add to array if group not isExists
    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.activityId = {$eq: activityId};
    criteria.tags = {$eq: sortedTags}

    Group.findOne(criteria).then((result) => {
      console.log('result', result);
      if (!result) {
        return Group.create(data);
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
      prevGroupId,
      groupId,
      updatedAt
    } = req.body;
    console.log(req.body);

    const Group = mongoose.model('group');

    Group.findOneAndUpdate({_id: prevGroupId}, { $set: { latest: 0}})
      .then((result) => {
        //if(result) {
          const criteria =  {};
          criteria._id = {$eq: groupId};
          return Group.findOneAndUpdate(criteria, { $set: { updatedAt, latest: 1 } });
        //}
        //return result;

      }).then((result) => {
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

    // Find activity and check if same group is isExist
    // add to array if group not isExists
    // const criteria =  {};
    // criteria._id = {$eq: groupId};
    //
    // Group.findOneAndUpdate(criteria, { $set: { updatedAt } }).then((result) => {
    //   console.log('result', result);
    //   if (!result || result === false) {
    //     console.log("Failed to update");
    //     res.status(400).send("Failed to update");
    //   } else {
    //     console.log("Group updated successfully");
    //     res.status(200).send("Group updated successfully");
    //   }
    //   next();
    //
    // }).catch((groupError) => {
    //   console.log(groupError);
    //   req.log.error(groupError.message);
    //   res.status(400).send('Bad request');
    //   next();
    // });
  }

  get(req, res, next) {

    /*
    Dont delete this:

    { _id: { activityId: 'db65c16a-9122-11e7-97f1-1d02b1732d86' },
  tags:
   [ { _id: 'ab4c839b-0704-4523-a539-5517d953dcee',
       userId: 'bd8e2421-557c-497e-bba9-1f9e934f9f0d',
       activityId: 'db65c16a-9122-11e7-97f1-1d02b1732d86',
       createdAt: '1522031982020',
       updatedAt: '1522031982020',
       tags: [Array],
       __v: 0 },
     { _id: '183ba495-9e8b-4c63-9bdb-3601119999ed',
       userId: 'bd8e2421-557c-497e-bba9-1f9e934f9f0d',
       activityId: 'db65c16a-9122-11e7-97f1-1d02b1732d86',
       createdAt: '1522031977356',
       updatedAt: '1522031977356',
       tags: [Array],
       __v: 0 } ] }
    */
    const { page, offset, limit } = Pagination(req);
    const { userId } = req;
    const Group = mongoose.model('group');


    // build search criteria
    const criteria =  {};
    criteria.userId = {$eq: userId};
    criteria.latest = {$eq: 1};

    getMyActivities(criteria, 'updatedAt', offset,limit).then((results) => {
      //console.log("GETGETGET" ,JSON.stringify(results));

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
    const { groupId, tagId, onlyPrevGroupId } = req.params;

    //console.log(req.params);

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

        // Group.findOneAndUpdate({_id: onlyPrevGroupId}, { $set: { latest: 1}});
        //
        //   let nextGroupLatestTime = {};
        //   const Time = mongoose.model('time');
        //   Time.findOne({userId, groupId: onlyPrevGroupId, latest: 1})
        //     .then((results) => {
        //       nextGroupLatestTime = results;
        //     });

        deleteAll = true;

        return result.remove();
      } else {
        return result.save();
      }

    }).then((updated) => {

      if(deleteAll){
        Group.findOneAndUpdate({_id: onlyPrevGroupId}, { $set: { latest: 1}}).then((result) => {

        });;

          let nextGroupLatestTime = {};
          const Time = mongoose.model('time');
          Time.findOne({userId, groupId: onlyPrevGroupId, latest: 1})
            .then((results) => {
              nextGroupLatestTime = results;
              res.status(200).send({nextGroupLatestTime});
              next();
            });
      }else{
        if (!updated) {
          console.log("Failed to delete tag from group");
          res.status(400).send("Failed to delete tag from group");
        } else {
          console.log("Tag deleted successfully from group");
          res.status(200).send("Deleted");
        }
        next();
      }


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
    const { groupId, onlyPrevGroupId } = req.params;

    //console.log(req.params);

    const Group = mongoose.model('group');

    Group.findOneAndUpdate({_id: onlyPrevGroupId}, { $set: { latest: 1}})
      .then((result) => {

      });

    let nextGroupLatestTime = {};
    const Time = mongoose.model('time');
    Time.findOne({userId, groupId: onlyPrevGroupId, latest: 1})
      .then((result) => {
        return result;
      }).then((time) => {
        nextGroupLatestTime = time;
        const criteria =  {};
        criteria._id = {$eq: groupId};
        criteria.userId = {$eq: userId};
        return Group.remove(criteria);
      }).then((deleted) => {
        if (!deleted) {
          console.log("Failed to delete group");
          res.status(400).send("Failed to delete group");
        } else {
          console.log("Group deleted successfully");
          res.status(200).send({nextGroupLatestTime});
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

    Group.find(criteria,{ tags: 1 })
    .sort({ 'updatedAt': -1})
    .then((results) => {
      //console.log(results);
      res.status(200).send(results);
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
