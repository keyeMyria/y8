'use strict';
const mongoose = require('mongoose');
const FindFriendship = require('../queries/FindFriendship');
const Pagination = require('../services/Pagination');
const SearchUsers = require('../queries/SearchUsers');
const SearchFriends = require('../queries/SearchFriends');
class FriendCtrl {

  sendRequest(req, res, next) {
    let { toUser } = req.body;
    console.log(req.body);

    // check if  toUser is valid
    // if (!mongoose.Types.ObjectId.isValid(toUser)) {
    //   return next(new errs.BadRequestError('toUser must be valid'));
    // }

    // get authenticated userId
    const fromUser = req.userId;

    // Check If User Exists
    const User = mongoose.model('users');
    User.findById(toUser,{_id:1}).then((result) => {
      if(!result){
        return Promise.reject({message:'toUser must be valid'});
      }
      // check friendship
      return FindFriendship(fromUser, toUser);

    }).then((friendship) => {
      console.log(friendship);
      // 0 - Pending
      // 1 - Accepted
      // 2 - Rejected
      // 3 - Blocked
      if(friendship){
        let message = '';
        const { status } = friendship;
        if(status===0){
          message = 'Already sent';
        } else if(status===1){
          message = 'Already friends';
        }

        return Promise.reject({message});
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
        return Promise.reject({message:'Couldn\'t send friend request'});
      }
      // send the final response
      //const data  = {id: result._id};

      console.log("Friend request sent successfully");
      req.log.info("Friend request sent successfully");
      res.status(200).send('sent');
      next();

    }).catch((error) => {
      console.log(error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    });
  }

  // This is just an example like how we can implement pagination
  getRequests(req, res, next) {
    const { page, offset, limit } = Pagination(req);
    const { userId } = req;
    // build search criteria
    const criteria =  {
      $and: [
        {
          status: 0
        },
        {
          $or: [
            {
              fromUser: userId
            },
            {
              toUser: userId
            }
          ] // or
        }
      ] // and
    };

    SearchFriends(criteria, 'updatedAt', offset,limit)
      .then((friendRequests)=>{
        console.log(friendRequests);
        res.status(200).send(friendRequests);
        next();
      }).catch((err)=>{
        req.log.error(err.message);
        res.status(400).send("Bad request");
        next();
      })
  }

  // This is just an example like how we can implement pagination
  getFriends(req, res, next) {
    const { page, offset, limit } = Pagination(req);
    const { userId } = req;
    // build search criteria
    const criteria =  {
      $and: [
        {
          status: 1
        },
        {
          $or: [
            {
              fromUser: userId
            },
            {
              toUser: userId
            }
          ] // or
        }
      ] // and
    };
    console.log(userId);

    SearchFriends(criteria, 'updatedAt', offset,limit)
      .then((friendRequests)=>{
        console.log(friendRequests);
        res.status(200).send(friendRequests);
        next();
      }).catch((err)=>{
        req.log.error(err.message);
        res.status(400).send("Bad request");
        next();
      })
  }

  acceptRequest(req, res, next){

    var { requestId } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(requestId)) {
    //   return next(new errs.BadRequestError('requestId must be valid'));
    // }
    // get authenticated userId
    const userId = req.userId;

    const Friend = mongoose.model('friends');
    Friend.findOneAndUpdate({
      _id: requestId, toUser: userId, status: 0
    },{
      status: 1
    }).then((result)=>{
        // if(!result){
        //   throw new errs.BadRequestError('Failed to accept request');
        //   return Promise.reject({message:"Failed to block request"});
        // }
        console.log("Friend request accepted successfully");
        req.log.info("Friend request accepted successfully");
        res.status(200).send({id:requestId});
        next();
      })
      .catch((err)=>{
        console.log(err);
        req.log.error(err.message);
        res.status(400).send("Bad request");
        next();
      });
  }

  rejectRequest(req, res, next){

    var { requestId } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(requestId)) {
    //   return next(new errs.BadRequestError('requestId must be valid'));
    // }
    // get authenticated userId
    const userId = req.userId;

    const Friend = mongoose.model('friends');
    Friend.findOneAndUpdate({
      _id: requestId, toUser: userId, status: 0
    },{
      status: 2
    }).then((result)=>{
        // if(!result){
        //   throw new errs.BadRequestError('Failed to reject request');
        // }
        req.log.info(result,"Friend request rejected successfully");
        res.status(200).send({_id:requestId});
        next();
      })
      .catch((err)=>{
        req.log.error(err.message);
        res.status(400).send("Bad request");
        next()
      });
  }

  blockRequest(req, res, next){
    // get authenticated userId
    const userId = req.userId;
    var { requestId } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(requestId)) {
    //   res.send(400, ResponseFormat.error(400, 'requestId must be valid'));
    //   return next();
    // }

    const Friend = mongoose.model('friends');
    Friend.findOneAndUpdate({
      _id: requestId, toUser: userId
    },{
      status: 3
    }).then((result)=>{
        // if(!result){
        //   return Promise.reject({message:"Failed to block request"});
        // }
        res.status(200).send({msg:'blocked'});
        next();
      })
      .catch((error)=>{
        req.log.error(error.message);
        res.status(400).send("Bad request");
        next();
      });
  }

  unblockRequest(req, res, next){
    // get authenticated userId
    const userId = req.userId;
    var { requestId } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(requestId)) {
    //   res.send(400, ResponseFormat.error(400, 'requestId must be valid'));
    //   return next();
    // }

    const Friend = mongoose.model('friends');
    Friend.findOneAndUpdate({
      _id: requestId, toUser: userId, status: 3
    },{
      status: 1
    }).then((result)=>{
        // if(!result){
        //   return Promise.reject({message:"Failed to unblock request"});
        // }
        res.status(200).send({msg:'unblocked'});
        next();
      })
      .catch((error)=>{
        req.log.error(error.message);
        res.status(400).send("Bad request");
        next();
      });
  }

  deleteRequest(req, res, next){
    // get authenticated userId
    const userId = req.userId;
    var { requestId } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(requestId)) {
    //   res.send(400, ResponseFormat.error(400, 'requestId must be valid'));
    //   return next();
    // }

    const Friend = mongoose.model('friends');
    Friend.deleteOne({
      _id: requestId,
       $or: [ {toUser: userId}, {fromUser: userId} ]
    }).then((result)=>{
        // if(!result){
        //   return Promise.reject({message:"Failed to unblock request"});
        // }
        res.status(200).send({msg:'deleted'});
        next();
      })
      .catch((error)=>{
        req.log.debug(RequestFormatForLog.Req(req),error.message);
        res.status(200).send("Bad request");
        next();
      });
  }

  searchUser(req, res, next) {
    const { page, offset, limit } = Pagination(req);
    const { q } = req.query;
    // build search criteria
    /*const criteria =  {
      $and: [
        {
          status: 9
        },
        {
          $or: [
            {
              fullName: new RegExp(q,'ig')
            },
            {
              email: new RegExp(q,'ig')
            }
          ] // or
        }
      ] // and
    };
    */

    const userId = req.userId;

    const criteria =  {
      $and: [
        {
          status: 9
        },
        {
          email: q.toLowerCase()
        },
        {
          _id: { $ne: userId }
        }
      ] // and
    };

    let results = "";
    SearchUsers(criteria, 'fullName', page, offset,limit)
      .then((users)=>{
        console.log(users);
        results = users;
        if(users.count === 1) {
          return FindFriendship(userId, users.rows[0]._id);
        }
        return false;
      }).then((friendship)=>{
        console.log(results);
        if(friendship) {
          results.rows[0] = {...results.rows[0]._doc,['friendship']:friendship};;
        }
        res.status(200).send(results);
        next();
      }).catch((err)=>{
        req.log.error(err.message);
        res.status(400).send("Bad request");
        next();
      })





    // const { userId } = req;
    // const { q } = req.query
    // const User = mongoose.model('users');
    // console.log(userId, q);
    // User.find({$or: [ {fullName: new RegExp(q,'ig')}, {email: new RegExp(q,'ig')} ]},{
    //   id: 1,
    //   fullName: 1
    // })
    //   //.populate({path: 'fromUser', select: ['email','firstName']})
    //   //.populate({path: 'toUser', select: 'email'})
    //   //.sort({updatedAt: -1})
    //   //.skip(offset)
    //   //.limit(limit);
    //   .then((activities)=>{
    //     console.log(activities);
    //     res.status(200).send(activities);
    //     next();
    //   })
    //   .catch((error)=>{
    //     req.log.error(error.message);
    //     res.status(400).send('Bad request');
    //     next();
    //   });
  }

}

module.exports = FriendCtrl;
