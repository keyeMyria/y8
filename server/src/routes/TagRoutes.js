const CTRLS = require('../controllers');

const tagRoutes = (router) => {
  const ctrl = new CTRLS.Tag();
  // Get activities
  router.get('/tag', ctrl.get);
  // Create Tag
  router.post('/tag', ctrl.create);
  // Update Tag
  router.put('/tag', ctrl.update);
  // Delete Tag
  router.delete('/tag/:id', ctrl.delete);
};

module.exports = tagRoutes;
