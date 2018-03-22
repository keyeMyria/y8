'use strict';
const mongoose = require('mongoose');
const services = require('../services');
const ResponseFormat = new services.ResponseFormat();
const RequestFormatForLog = new services.RequestFormatForLog();
const Pagination = new services.Pagination();
const ParseError = new services.ParseError();
var errs = require('restify-errors');
const {FindFriendship, SearchFriends} = require('../queries/friends');

class FriendCtrl {

  sendRequest(req, res, next) {
    let { toUser } = req.params;

    // check if  toUser is valid
    if (!mongoose.Types.ObjectId.isValid(toUser)) {
      return next(new errs.BadRequestError('toUser must be valid'));
    }

    // get authenticated userId
    const fromUser = req.auth().userId;

    // Check If User Exists
    const User = mongoose.model('users');
    User.findById(toUser,{_id:1}).then((result) => {
      if (!result) {
        return new errs.BadRequestError('toUser must be valid');
      }
      // check friendship
      return FindFriendship(fromUser, toUser);

    }).then((friendship) => {

      if (friendship) {
        throw new errs.InvalidArgumentError('Already Friends');
      }
      // create friend request
      const Friend = mongoose.model('friends');
      const data = {
        fromUser: fromUser,
        toUser: toUser,
        actionUser: fromUser
      };
      return Friend(data).save();

    }).then((result) => {

      if(!result){
        throw new errs.InternalServerError("Couldn't send friend request");
      }
      // send the final response
      const data  = {_id: result._id};
      req.log.info(data,"Friend request sent successfully");
      res.send(201,data);

    }).catch((error) => {
      req.log.debug(error.message);
      res.send(error);
    });

    return next();
  }

  // This is just an example like how we can implement pagination
  getRequests(req, res, next) {

    const { page, offset, limit } = Pagination.get(req);

    // build search criteria
    const criteria =  {}
    criteria.status = {$eq: 0};
    criteria.toUser = {$eq: req.auth().userId};

    SearchFriends(criteria, 'updatedAt', offset,limit)
      .then((friendRequests)=>{
        let statusCode = 200;
        if(friendRequests.count==0){
          statusCode = 204;
        }
        res.send(statusCode, statusCode==200?friendRequests:"");
        req.log.debug({data: friendRequests});
      }).catch((err)=>{
        req.log.error({req, res, err});
        res.send(ParseError.error(err));
      })
      return next();
  }

  acceptRequest(req, res, next){

    var { requestId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return next(new errs.BadRequestError('requestId must be valid'));
    }
    // get authenticated userId
    const userId = req.auth().userId;

    const Friend = mongoose.model('friends');
    Friend.findOneAndUpdate({
      _id: requestId, toUser: userId, status: 0
    },{
      status: 1
    }).then((result)=>{
        if(!result){
          throw new errs.BadRequestError('Failed to accept request');
        }
        res.send(200,{_id:requestId});
        req.log.info(result,"Friend request accepted successfully");
      })
      .catch((err)=>{
        console.log(err);
        req.log.error({req, res, err});
        res.send(ParseError.error(err));
      });

      return next();
  }

  rejectRequest(req, res, next){

    var { requestId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return next(new errs.BadRequestError('requestId must be valid'));
    }
    // get authenticated userId
    const userId = req.auth().userId;

    const Friend = mongoose.model('friends');
    Friend.findOneAndUpdate({
      _id: requestId, toUser: userId, status: 0
    },{
      status: 2
    }).then((result)=>{
        if(!result){
          throw new errs.BadRequestError('Failed to reject request');
        }
        res.send(200,{_id:requestId});
        req.log.info(result,"Friend request rejected successfully");
      })
      .catch((err)=>{
        req.log.error({req, res, err});
        res.send(ParseError.error(err));
      });

      return next();
  }

  blockRequest(req, res, next){
    // get authenticated userId
    const userId = req.auth().userId;
    var { requestId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.send(400, ResponseFormat.error(400, 'requestId must be valid'));
      return next();
    }

    const Friend = mongoose.model('friends');
    Friend.findOneAndUpdate({
      _id: requestId, toUser: userId
    },{
      status: 3
    }).then((result)=>{
        if(!result){
          return Promise.reject({message:"Failed to block request"});
        }
        res.send(200, ResponseFormat.success({msg:'ok'}));
      })
      .catch((error)=>{
        req.log.debug(RequestFormatForLog.Req(req),error.message);
        res.send(400, ResponseFormat.error(400, error.message));
      });

      return next();
  }

  unblockRequest(req, res, next){
    // get authenticated userId
    const userId = req.auth().userId;
    var { requestId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.send(400, ResponseFormat.error(400, 'requestId must be valid'));
      return next();
    }

    const Friend = mongoose.model('friends');
    Friend.findOneAndUpdate({
      _id: requestId, toUser: userId, status: 3
    },{
      status: 1
    }).then((result)=>{
        if(!result){
          return Promise.reject({message:"Failed to unblock request"});
        }
        res.send(200, ResponseFormat.success({msg:'ok'}));
      })
      .catch((error)=>{
        req.log.debug(RequestFormatForLog.Req(req),error.message);
        res.send(400, ResponseFormat.error(400, error.message));
      });

      return next();
  }

  deleteRequest(req, res, next){
    // get authenticated userId
    const userId = req.auth().userId;
    var { requestId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.send(400, ResponseFormat.error(400, 'requestId must be valid'));
      return next();
    }

    const Friend = mongoose.model('friends');
    Friend.deleteOne({
      _id: requestId,
       $or: [ {toUser: userId}, {fromUser: userId} ]
    }).then((result)=>{
        if(!result){
          return Promise.reject({message:"Failed to unblock request"});
        }
        res.send(200, ResponseFormat.success({msg:'ok'}));
      })
      .catch((error)=>{
        req.log.debug(RequestFormatForLog.Req(req),error.message);
        res.send(400, ResponseFormat.error(400, error.message));
      });

      return next();
  }

}

module.exports = FriendCtrl;
