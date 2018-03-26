'use strict'
const mongoose = require('mongoose');
const _ = require('lodash');
const services = require('../services');
const Pagination = require('../services/Pagination');
const SearchTimes = require('../queries/SearchTimes');

class TimeCtrl {

  create(req, res, next) {
    console.log(req.body);
    const {
      activityId,
      groupId,
      tags,
      startedAt,
    } = req.body;

    const { userId } = req;
    const data = {
      userId,
      activityId,
      groupId,
      tags,
      startedAt,
      stoppedAt: ''
    };

    const Time = mongoose.model('time');

    Time.create(data).then((result) => {
      if (result) {
        console.log("Activity started!");
        res.status(200).send("Activity started!");
      } else {
        console.log("Failed to start activity");
        res.status(200).send("Failed to start activity");
      }
      next();
    }).catch((timesError) => {
      console.log(timesError);
      req.log.error(timesError.message);
      res.status(400).send('Bad request');
      next();
    });
  }

  update(req, res, next) {
    console.log(req.body);
    const {
      activityId,
      groupId,
      stoppedAt,
    } = req.body;

    const { userId } = req;

    const Time = mongoose.model('time');
    Time.update(
      { userId, activityId, groupId, stoppedAt: '' },
      { $set: { stoppedAt } },
      (done)=>{
        console.log(done);
        if(!done) {
          //throw new Error('Failed to update');
        }
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
}

module.exports = TimeCtrl;
