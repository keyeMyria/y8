const CTRLS = require('../controllers');

const authRoutes = (router) => {
  const ctrl = new CTRLS.Auth();
  router.get('/testAuth', ctrl.testAuth);
};

module.exports = authRoutes;
