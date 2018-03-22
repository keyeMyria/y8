'use strict'
class AuthCtrl {
  testAuth(req, res, next) {
    console.log('testAuth', req.userId);
    res.status(200).send({id:req.userId});
    next();
  }
}
module.exports = AuthCtrl;
