'use strict'
const mongoose = require('mongoose');
const Pagination = require('../services/Pagination');
const GetSubscribers = require('../queries/GetSubscribers');

class SubscriberCtrl {

  getSubscribers(req, res, next) {
    try {
      const { page, offset, limit } = Pagination(req);
      //TODO: do validation here
      const { userId } = req;
      const criteria =  {};
      criteria.userId = {$eq: userId};
      criteria.status = {$eq: 1};

      GetSubscribers(criteria, 'updatedAt', offset,limit)
      .then((result)=>{
        console.log(result);
        res.status(200).send(result);
        next();
      }).catch((subscribeError)=>{
        console.log('subscribeError: ' + subscribeError);
        req.log.error(subscribeError.message);
        res.status(400).send('Bad request');
        next();
      });
    } catch (error) {
      console.log('SubscriberCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }
  }


  subscribe(req, res, next) {
    try {
      const {
        subUserId
      } = req.body;

      //TODO: do validation here
      const { userId } = req;
      const data = {
        userId: subUserId,
        subUserId: userId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const Subscriber = mongoose.model('subscriber');
      const criteria =  {};
      criteria.userId = {$eq: subUserId};
      criteria.subUserId = {$eq: userId};

      Subscriber.findOne(criteria).then((result)=>{
        if (!result) {
          return Subscriber.create(data)
        }else{
          result.updatedAt = Date.now();
          return result.save();
        }
      }).then((result)=>{
        console.log(result);
        console.log('subscribed!');
        res.status(200).send({id: result._id});
        next();

      }).catch((subscribeError)=>{
        console.log('subscribeError: ' + subscribeError);
        req.log.error(subscribeError.message);
        res.status(400).send('Bad request');
        next();

      });

    } catch (error) {
      console.log('SubscriberCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }
  }

  unsubscribe(req, res, next) {
    try {
      const {
        subscribeId
      } = req.body;

      //TODO: do validation here
      const { userId } = req;

      const Subscriber = mongoose.model('subscriber');
      const criteria =  {};
      criteria._id = {$eq: subscribeId};
      criteria.subUserId = {$eq: userId};

      Subscriber.deleteOne(criteria)
      .then((result)=>{
        console.log('unsubscribed!');
        res.status(200).send('unsubscribed');
        next();

      }).catch((subscribeError)=>{
        console.log('subscribeError: ' + subscribeError);
        req.log.error(subscribeError.message);
        res.status(400).send('Bad request');
        next();

      });

    } catch (error) {
      console.log('SubscriberCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }
  }

  hasSubscribed(req, res, next) {
    try {
      const {
        subUserId
      } = req.params;

      //TODO: do validation here
      const { userId } = req;
      const Subscriber = mongoose.model('subscriber');
      const criteria =  {};
      criteria.userId = {$eq: subUserId};
      criteria.subUserId = {$eq: userId};

      Subscriber.findOne(criteria,{ userId: 1, subUserId: 1 })
      .then((result)=>{
        console.log(result);
        res.status(200).send(result);
        next();

      }).catch((subscribeError)=>{
        console.log('subscribeError: ' + subscribeError);
        req.log.error(subscribeError.message);
        res.status(400).send('Bad request');
        next();

      });

    } catch (error) {
      console.log('SubscriberCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }
  }

}

module.exports = SubscriberCtrl;
