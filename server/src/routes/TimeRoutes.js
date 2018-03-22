const CTRLS = require('../controllers');

const timeRoutes = (router) => {
  const ctrl = new CTRLS.Time();
  // Get Times
  //router.get('/time', ctrl.get);
  // Search
  router.get('/time/search', ctrl.search);
  // Create startedAt time
  router.post('/time', ctrl.create);
  // update stoppedAt time
  router.put('/time', ctrl.update);
};

module.exports = timeRoutes;
