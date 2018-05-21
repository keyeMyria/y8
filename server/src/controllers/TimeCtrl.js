'use strict'
const mongoose = require('mongoose');
const _ = require('lodash');
const services = require('../services');
const Pagination = require('../services/Pagination');
const SearchTimes = require('../queries/SearchTimes');
const {
  SendStartActivityNotification,
  SendStopActivityNotification
} = require('../notifications/SendActivityNotification');

const {
  getDeviceTokens,
  sendNotifications
} = require('../services/Notification');

class TimeCtrl {
  //TODO: remove prevTimeId here and in app
  create(req, res, next) {
    //console.log(req.body);
    const {
      id,
      groupId,
      startedAt,
    } = req.body;

    const { userId } = req;
    const data = {
      _id: id,
      userId,
      groupId,
      latest: 1,
      startedAt,
      stoppedAt: null
    };

    const Group = mongoose.model('group');
    Group.findOneAndUpdate({_id: groupId}, { $set: { updatedAt: Date.now()}})
      .then((result) => {
        //console.log("updating group updatedAt", result, "---");

      });


    const Time = mongoose.model('time');
    //Time.update({ _id: prevTimeId, groupId }, { $set: { latest: 0 } })

    Time.update({  groupId, latest: 1 }, { $set: { latest: 0 } })
      .then((result) => {
        if(result){
          return Time.create(data);
        }
        return false;
      }).then((result) => {
        if (result) {
          SendStartActivityNotification(userId, groupId, startedAt);
          // getDeviceTokens(userId).then((tokens)=>{
          //   console.log(tokens);
          //   let registeredIds = [];
          //   _.forEach(tokens, (obj) => {
          //     registeredIds.push(obj.token);
          //   });
          //   console.log(registeredIds);
          //   const data = {
          //     title: 'Naveen Konduru',
          //     body: 'Started driving home',
          //   };
          //   sendNotifications(registeredIds,data);
          // }).catch((er)=>{
          //   console.log(er);
          // });

          console.log("Activity started!");
          res.status(200).send({id: result._id});
        } else {
          console.log("Failed to start activity");
          res.status(400).send("Failed to start activity");
        }
        next();
      }).catch((timesError) => {
        console.log(timesError);
        req.log.error(timesError.message);
        res.status(400).send('Bad request');
        next();
      });

    // Time.create(data).then((result) => {
    //   if (result) {
    //
    //     // getDeviceTokens(userId).then((tokens)=>{
    //     //   console.log(tokens);
    //     //   let registeredIds = [];
    //     //   _.forEach(tokens, (obj) => {
    //     //     registeredIds.push(obj.token);
    //     //   });
    //     //   console.log(registeredIds);
    //     //   const data = {
    //     //     title: 'Naveen Konduru',
    //     //     body: 'Started driving home',
    //     //   };
    //     //   sendNotifications(registeredIds,data);
    //     // }).catch((er)=>{
    //     //   console.log(er);
    //     // });
    //
    //     console.log("Activity started!");
    //     console.log(result);
    //     res.status(200).send({id: result._id});
    //   } else {
    //     console.log("Failed to start activity");
    //     res.status(200).send("Failed to start activity");
    //   }
    //   next();
    // }).catch((timesError) => {
    //   console.log(timesError);
    //   req.log.error(timesError.message);
    //   res.status(400).send('Bad request');
    //   next();
    // });
  }

  update(req, res, next) {

    const {
      id,
      stoppedAt,
    } = req.body;

    // console.log('STOP ACTIVITY - start');
    // console.log('update',id,stoppedAt);
    // console.log('STOP ACTIVITY - end');

    const { userId } = req;

    const Time = mongoose.model('time');
    Time.update(
      { _id: id, userId, stoppedAt: '' },
      { $set: { stoppedAt } },
      (done)=>{
        console.log(done, 1231);
        if(!done) {
          //throw new Error('Failed to update');
        }

        SendStopActivityNotification(userId, id); // id is timeId
        res.status(200).send("Activity stopped!");
        next();
      });

  }

  search(req, res, next) {
    console.log(req.body);
    const { userId } = req;
    const { activityId, groupId } = req.query;
    const { page, offset, limit } = Pagination(req);

    // build search criteria
    const criteria =  {};
    criteria.userId = { $eq: userId };
    //criteria.activityId = { $eq: activityId };
    //criteria.groupId = { $eq: groupId };
    criteria.tags = { $in: ['0e8e743e-a957-460d-96cb-a5c94a2c0096']};

    SearchTimes(criteria, 'startedAt', offset,limit)
      .then((response)=>{
        console.log(response);
        res.status(200).send(response);
        next();
      }).catch((err)=>{
        req.log.error(err);
        res.status(400).send('Bad request');
        next();
      });
  }

  getTimes(req, res, next) {
    console.log(req.body);
    const { userId } = req;
    //const { activityId, groupId } = req.query;
    const { page, offset, limit } = Pagination(req);

    // build search criteria
    const criteria =  {};
    criteria.userId = { $eq: userId };
    //criteria.activityId = { $eq: activityId };
    //criteria.groupId = { $eq: groupId };
    //criteria.tags = { $in: ['0e8e743e-a957-460d-96cb-a5c94a2c0096']};

    SearchTimes(criteria, 'startedAt', offset,limit)
      .then((response)=>{
        console.log(response);
        res.status(200).send(response);
        next();
      }).catch((err)=>{
        req.log.error(err);
        res.status(400).send('Bad request');
        next();
      });
  }

  getTimeByGroup(req, res, next) {
    console.log(req.body);
    const { userId } = req;
    const { groupId } = req.params;

    // build search criteria
    const criteria =  {};
    criteria.userId = { $eq: userId };
    criteria.groupId = { $eq: groupId };
    const Time = mongoose.model('time');
    Time.find({userId, groupId, latest: 1})
      .sort({ 'stoppedAt': -1})
      .skip(0)
      .limit(1)
      .then((result) => {
        if(result){
          res.status(200).send(result[0]);
          next();
        } else {
          res.status(200).send("");
          next();
        }
      }).catch((err)=>{
        req.log.error(err);
        res.status(400).send('Bad request');
        next();
      });
  }
}

module.exports = TimeCtrl;
