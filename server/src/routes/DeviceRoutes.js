const CTRLS = require('../controllers');

const deviceRoutes = (router) => {
  const ctrl = new CTRLS.Device();

  // Create Activity
  router.post('/device', ctrl.register);
  // Update Activity
  //router.put('/device', ctrl.update);
  // Delete Activity
  //router.delete('/device/:id', ctrl.delete);
};

module.exports = deviceRoutes;
