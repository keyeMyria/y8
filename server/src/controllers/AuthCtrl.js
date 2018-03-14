'use strict'
class AuthCtrl {
  testAuth(req, res, next) {
    res.status(200).send('ok');
    next();
  }
}
module.exports = AuthCtrl;
