const CTRLS = require('../controllers');

const groupRoutes = (router) => {
  const ctrl = new CTRLS.Group();
  // Get myactivities
  router.get('/group', ctrl.get);
  // Get myactivities
  router.get('/group/:activityId', ctrl.getGroupsByActivity);
  // Create myactivity
  router.post('/group', ctrl.create);
  // update group
  router.put('/group', ctrl.update);
  // Delete tag from group by activity
  router.delete('/group/:groupId/:tagId/:onlyPrevGroupId/tag', ctrl.deleteTagFromGroupByActivity);
  // router.delete('/myactivity/:activityId/:groupId/:tagId', ctrl.deleteTagFromGroupByActivity);
  // Delete group from activity
  router.delete('/group/:groupId/:onlyPrevGroupId/group', ctrl.deleteGroupFromActivity);
  // // Update useThisGroupForActivity
  // // push group to start of an array
  // router.put('/myactivity', ctrl.updateGroupForActivity);
  //router.put('/myactivity', ctrl.update);
  // Delete Activity
  //router.delete('/myactivity/:id', ctrl.delete);
};

module.exports = groupRoutes;
