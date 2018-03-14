const CTRLS = require('../controllers');

const activityRoutes = (router) => {
  const ctrl = new CTRLS.Activity();
  // Get activities
  router.get('/activity', ctrl.get);
  // Create Activity
  router.post('/activity', ctrl.create);
  // Update Activity
  router.put('/activity', ctrl.update);
  // Delete Activity
  router.delete('/activity/:id', ctrl.delete);
};

module.exports = activityRoutes;
