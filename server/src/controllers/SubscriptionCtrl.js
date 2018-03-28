'use strict'
const mongoose = require('mongoose');
const Pagination = require('../services/Pagination');
const GetSubscribers = require('../queries/GetSubscribers');

class SubscriptionCtrl {

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
      console.log('SubscriptionCtrl: ' + error);
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
        status: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const Subscription = mongoose.model('subscriptions');
      const criteria =  {};
      criteria.userId = {$eq: subUserId};
      criteria.subUserId = {$eq: userId};

      Subscription.findOne(criteria).then((result)=>{
        if (!result) {
          return Subscription.create(data)
        }else{
          result.status = 1;
          result.updatedAt = Date.now();

          return result.save();
        }
      }).then((result)=>{
        console.log('subscribed!');
        res.status(200).send('subscribed');
        next();

      }).catch((subscribeError)=>{
        console.log('subscribeError: ' + subscribeError);
        req.log.error(subscribeError.message);
        res.status(400).send('Bad request');
        next();

      });

    } catch (error) {
      console.log('SubscriptionCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }
  }

  unsubscribe(req, res, next) {
    try {
      const {
        subUserId
      } = req.body;

      //TODO: do validation here
      const { userId } = req;
      const data = {
        status: 0, updatedAt: Date.now()
      };
      const Subscription = mongoose.model('subscriptions');
      const criteria =  {};
      criteria.userId = {$eq: subUserId};
      criteria.subUserId = {$eq: userId};

      Subscription.update(criteria, { $set: { ...data } })
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
      console.log('SubscriptionCtrl: ' + error);
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
      const Subscription = mongoose.model('subscriptions');
      const criteria =  {};
      criteria.userId = {$eq: subUserId};
      criteria.subUserId = {$eq: userId};

      Subscription.findOne(criteria,{ _id: 0, userId: 1, subUserId: 1, status: 1 })
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
      console.log('SubscriptionCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }
  }

}

module.exports = SubscriptionCtrl;
