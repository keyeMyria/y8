'use strict'
const mongoose = require('mongoose');
const _ = require('lodash');
const GetShares = require('../queries/GetShares');

class SharedCtrl {

  createSharedWith(req, res, next) {
    const { userId } = req;
    const {
      groupId,
      //activityId,
      sharedWith,
    } = req.body;

    const data = {
      userId,
      groupId,
      sharedWith,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const Shared = mongoose.model('canshare');

    // Find activity and check if same group is isExist
    // add to array if group not isExists
    // const criteria =  {};
    // criteria.userId = {$eq: userId};
    // criteria.groupId = {$eq: groupId};
    // criteria.activityId = {$eq: activityId};

    Shared.create(data).then((result) => {
      console.log("Activity will be shared");
      res.status(200).send({id: result.id});
      next();
    }).catch((groupError) => {
      console.log(groupError);
      req.log.error(groupError.message);
      res.status(400).send('Bad request');
      next();
    });
  }

  //deleteGroupFromActivity
  removeSharedWith(req, res, next) {
    const { userId } = req;
    const {
      id
    } = req.params;

    const Shared = mongoose.model('canshare');

    const criteria =  {};
    criteria._id = {$eq: id};
    Shared.remove(criteria).then((deleted) => {
      console.log("Activity will not be shared");
      res.status(200).send('done');
      next();
    }).catch((removeSharedWithError) => {
      console.log(removeSharedWithError);
      req.log.error(myActivityError.message);
      res.status(400).send('Bad request');
      next();
    });
  }

  getSharedWith(req, res, next) {
    const { userId } = req;
    const {
      groupId
    } = req.query;

    const Shared = mongoose.model('canshare');
    const criteria =  {};
    criteria.userId = {$eq: userId}
    criteria.groupId = {$eq: groupId};
    GetShares(criteria, 'updatedAt').then((result) => {
      res.status(200).send(result);
      next();
    })
    .catch((error) => {
      console.log(error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    });
  }

}

module.exports = SharedCtrl;
