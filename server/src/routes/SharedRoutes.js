const CTRLS = require('../controllers');

const sharedRoutes = (router) => {
  const ctrl = new CTRLS.Shared();
  // Get Shared with users
  router.get('/share', ctrl.getSharedWith);
  // Create shared with user
  router.post('/share', ctrl.createSharedWith);
  // Delete shared with user
  router.delete('/share/:id', ctrl.removeSharedWith);
};

module.exports = sharedRoutes;
