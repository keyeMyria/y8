const CTRLS = require('../controllers');

const myActivityRoutes = (router) => {
  const ctrl = new CTRLS.MyActivity();
  // Get myactivities
  router.get('/myactivity', ctrl.get);
  // Create myactivity
  router.post('/myactivity', ctrl.create);
  // Delete tag from group by activity
  router.delete('/myactivity/:activityId/:groupId/:tagId', ctrl.deleteTagFromGroupByActivity);
  // Delete group from activity
  router.delete('/myactivity/:activityId/:groupId', ctrl.deleteGroupFromActivity);
  // Update useThisGroupForActivity
  // push group to start of an array
  router.put('/myactivity', ctrl.updateGroupForActivity);
  //router.put('/myactivity', ctrl.update);
  // Delete Activity
  //router.delete('/myactivity/:id', ctrl.delete);
};

module.exports = myActivityRoutes;
