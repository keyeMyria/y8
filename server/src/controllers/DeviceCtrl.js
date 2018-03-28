'use strict'
const mongoose = require('mongoose');

class DeviceCtrl {

  register(req, res, next) {
    try {
      const {
        tokenInfo
      } = req.body;
      const { token, os } = tokenInfo;

      //TODO: do validation here
      const { userId } = req;
      const data = {
        userId, token, os, createdAt: Date.now(), updatedAt: Date.now()
      };

      console.log(data);

      const Device = mongoose.model('devices');


      const criteria =  {};
      criteria.userId = {$eq: userId};
      criteria.token = {$eq: token};
      criteria.os = {$eq: os};

      Device.findOne(criteria).then((result)=>{
        if (!result) {
          return Device.create(data)
        }
        return false;
      }).then((result)=>{
        console.log('Device registered!');
        res.status(200).send('registered');
        next();

      }).catch((deviceError)=>{
        console.log('deviceError: ' + deviceError);
        req.log.error(deviceError.message);
        res.status(400).send('Bad request');
        next();

      });

      // Device.create(data).then((result)=>{
      //   console.log('Device registered!');
      //   res.status(200).send('registered');
      //   next();
      //
      // }).catch((deviceError)=>{
      //   console.log('deviceError: ' + deviceError);
      //   req.log.error(deviceError.message);
      //   res.status(400).send('Bad request');
      //   next();
      //
      // });

    } catch (error) {
      console.log('DeviceCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }

  }

}

module.exports = DeviceCtrl;
