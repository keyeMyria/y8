const CTRLS = require('../controllers');

const subscribeRoutes = (router) => {
  const ctrl = new CTRLS.Subscription();

  // Create subscribe
  router.post('/subscribe', ctrl.subscribe);

  // has subscribed
  router.get('/subscribe/:subUserId', ctrl.hasSubscribed);
  router.get('/subscribe', ctrl.getSubscribers);
  // Update subscribe
  router.post('/unsubscribe', ctrl.unsubscribe);
  //router.put('/subscribe', ctrl.update);
  // Delete Activity
  //router.delete('/subscribe/:id', ctrl.delete);
};

module.exports = subscribeRoutes;
