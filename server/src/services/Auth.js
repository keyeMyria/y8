const _ = require('lodash');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const CONFIG = require('../config');
const keys = require('../config/keys');
class Auth {
  constructor(){
  }

  authorize(req, res, next){
    let isValidRequest = true;
    let auth_header = null;

    //console.log(req.body);
    if( _.isNull(req.headers.authorization) || _.isEmpty(req.headers.authorization)) {
      isValidRequest = false;
    }

    if(isValidRequest) {
      const bearer = req.headers.authorization;
      console.log(bearer);
      auth_header = bearer.split(' ');
      if(auth_header.length!==2 || auth_header[0] !== 'Bearer'){
        isValidRequest = false;
      }
    }

    if(isValidRequest) {
      const authToken = auth_header[1].trim();

      try {
        const decoded = jwt.verify(authToken, keys.appSecureKey);
        //console.log(decoded);
        const { userId, profileId, appId, exp, loginType } = decoded;

        const diff = exp * 1000 - moment().valueOf();
        const duration = moment.duration(diff);

        let days = 0;
        let hrs = 0;
        let mins = 0;
        let secs = 0;

        if(duration > 0){
          days = duration.days();
          hrs = duration.hours();
          mins = duration.minutes();
          secs = duration.seconds();
        }

        console.log(days+'-'+hrs+'-'+mins+'-'+secs);
        // do some database checks if necessary
        // handle facebook and google here itself
        if (mins <= 55 &&
          (
            (appId === keys.facebookAppID && loginType === 'facebook')
            ||
            (appId === keys.googleClientID && loginType === 'google')
          )
        ) {
          const payload = {
            userId,
            profileId,
            appId,
            loginType
          }

          const authToken = jwt.sign(payload, keys.appSecureKey, { expiresIn: keys.secureKeyExpiresIn }); // '30 days'
          res.set('x-app-auth-token', authToken);
          res.set('x-app-auth-0', true);
          console.log('NewToken');
        }else{
          console.log('OldToken');
          res.set('x-app-auth-0', false);
        }
        req.userId = userId;
      } catch(error) {
        console.log(error);
        req.log.error(error.message);
        isValidRequest = false;
      }
    }

    if (isValidRequest === false) {
      req.log.info('Invalid access token');
      res.status(401).send('Invalid access token');
    }else{
      next();
    }
  }
}

module.exports = Auth;
