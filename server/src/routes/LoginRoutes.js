const CTRLS = require('../controllers');
//const router = require('express').Router();

//const ctrl = new CTRLS.Login();
//router.post('/login', ctrl.login);

const loginRoutes = (router) => {
  const ctrl = new CTRLS.Login();
  router.post('/login', ctrl.login);
};

module.exports = loginRoutes;
