const CTRLS = require('../controllers');

const sampleRoutes = (router) => {
  const ctrl = new CTRLS.Sample();
  router.get('/sample', ctrl.getList);
};

module.exports = sampleRoutes;
