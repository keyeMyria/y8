const CTRLS = require('../controllers');

const timeRoutes = (router) => {
  const ctrl = new CTRLS.Time();
  // Get Times
  //router.get('/time', ctrl.get);
  // Search
  router.get('/time/search', ctrl.search);

  router.get('/time', ctrl.getTimeByGroup1);
  // Create startedAt time
  router.post('/time', ctrl.startTime);
  // update stoppedAt time
  router.put('/time', ctrl.stopTime);

  router.get('/time/:groupId', ctrl.getTimeByGroup);
  router.post('/time/:groupId', ctrl.createTime);
  router.put('/time/:groupId', ctrl.updateTime);
  router.delete('/time/:groupId/:timeId', ctrl.deleteTime);
};

module.exports = timeRoutes;
