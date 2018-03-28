'use strict'
const _ = require('lodash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Facebook = require('../services/Facebook');
const keys = require('../config/keys');
class LoginCtrl {
  login(req, res, next) {

    const accessToken = req.body.accessToken;
    if(_.isNull(accessToken) ||
      _.isEmpty(accessToken) ||
      _.isUndefined(accessToken)
    ){
      req.log.error("accessToken not found");
      res.status(401).send("Unauthorized");
      next();
    }

    let user = {};
    const User = mongoose.model('users');
    const loginType = req.body.loginType;
    if (loginType === 'facebook') {
      Facebook.VerifyAccessToken(accessToken)
        .then((tokenInfo) => {
          if (tokenInfo!==false ) {
            return Facebook.GetProfile(accessToken);
          } else {
            return false;
          }
        })
        .then((profile) => {
          if(profile===false) {
            throw new Error('Unable to get facebook User profile');
          }
          console.log(profile);
          user.loginType = 'facebook';
          user.profileId = profile.id;
          user.fullName = profile.name;
          user.email = profile.email;
          user.firstName = profile.first_name;
          user.lastName = profile.last_name;

          return User.findOne({ profileId: profile.id }, {_id: 1});
        }).then((result) => {
          if(_.isNull(result)) {

            req.log.info('User created successfully: '+user.fullName+' ('+user.profileId+')');
            return User.create(user);
          } else {
            return result;
          }
        }).then((data)=>{
          console.log(data);
          // create JWT and send it with reponse
          const payload = {
            userId: data._id,
            profileId: user.profileId,
            appId: keys.facebookAppID,
            loginType
          }
          const authToken = jwt.sign(payload, keys.appSecureKey, { expiresIn: keys.secureKeyExpiresIn }); // '30 days'
          res.set('x-app-auth-0', false);
          req.log.info('authToken generated successfully');
          res.status(200).send({ authToken, userId: data._id, subRequests: {}, subscribed: {} });
          next();
        }).catch((error)=>{
          console.log(error,4);
        });

    } else if (loginType === 'google') {

    } else {
      req.log.error('Invalid loginType: ' + loginType);
      res.status(403).send("Invalid loginType");
      next();
    }

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

    //res.status(200).send("Im am getList() from LoginCtrl");
    //req.log.debug("hello data");
    //return next(new errs.InvalidArgumentError("I just don't like you"));

  }

}

module.exports = LoginCtrl;
