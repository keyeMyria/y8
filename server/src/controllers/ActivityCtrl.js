'use strict'
const mongoose = require('mongoose');
const Pagination = require('../services/Pagination');


class ActivityCtrl {

  create(req, res, next) {
    try {
      const {
        id, name, createdAt, updatedAt
      } = req.body;

      //TODO: do validation here
      const { userId } = req;
      const data = {
        _id: id, userId, name, createdAt, updatedAt
      };

      const Activity = mongoose.model('activities');

      Activity.create(data).then((result)=>{
        console.log('Activity Created!');
        res.status(200).send(result);
        next();

      }).catch((activityError)=>{
        console.log('activityError: ' + activityError);
        req.log.error(activityError.message);
        res.status(400).send('Bad request');
        next();

      });

    } catch (error) {
      console.log('ActivityCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }

  }

  get(req, res, next) {
    const { page, offset, limit } = Pagination(req, 'activites');
    const { userId } = req;
    const Activity = mongoose.model('activities');
    Activity.find({userId},{
      id: 1,
      name: 1,
      updatedAt: 1
    })
      //.populate({path: 'fromUser', select: ['email','firstName']})
      //.populate({path: 'toUser', select: 'email'})
      .sort({updatedAt: -1})
      .skip(offset)
      .limit(limit)
      .then((activities)=>{
        console.log(activities);
        res.status(200).send(activities);
        next();
      })
      .catch((error)=>{
        req.log.error(error.message);
        res.status(400).send('Bad request');
        next();
      });
  }

  update(req, res, next) {
    try {
      const { userId } = req;
      const { id, name, updatedAt } = req.body;
      const activity = { id, name, updatedAt };
      const Activity = mongoose.model('activities');

      Activity.update(
        { _id: id, userId },
        { $set: { name, updatedAt }},
        (done)=>{
          console.log(done);
          if(!done) {
            //throw new Error('Failed to update');
          }
          res.status(200).send(activity);
          next();
        });


      // Activity.findByIdAndUpdate(id,
      //   { $set: { name, updatedAt } }, { new: true },
      //   (err, activity) => {
      //     if (err) {
      //       throw new Error(err);
      //     }
      //     console.log(req.body);
      //     res.status(200).send(activity);
      //     next();
      // });

    } catch(error) {
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }

  }

  delete(req, res, next) {
    const { userId } = req;
    const { id } = req.params;

    const Activity = mongoose.model('activities');
    Activity.deleteOne({ _id: id, userId })
    .then((done)=>{
      if(!done){
        return Promise.reject({message:"Failed to unblock request"});
      }
      console.log(id);
      res.status(200).send({id});
      next();
    }).catch((error)=>{
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    });
  }

  getList(req, res, next){

    // const User = mongoose.model('users');
    //
    // User.create({
    //   _id: '3002a825-0667-4be4-a2fa-bfe36022a861',
    //   email:'naveen1@gmail.com',
    //   firstName:'naveen14'}).then(()=>{
    //     console.log('Temp Users Created');
    //   }).catch((error)=>{
    //     console.log('Hello'+error);
    //   });
    console.log(1234);
    console.log(req.userId);
    res.status(200).send("Im am getList() from ActivityCtrl");
    req.log.debug("hello data");
    //return next(new errs.InvalidArgumentError("I just don't like you"));
    return next();
  }
}

module.exports = ActivityCtrl;
