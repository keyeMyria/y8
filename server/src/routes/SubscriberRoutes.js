const CTRLS = require('../controllers');

const subscriberRoutes = (router) => {
  const ctrl = new CTRLS.Subscriber();

  // Create subscribe
  router.post('/subscribe', ctrl.subscribe);
  // Update subscribe
  router.post('/unsubscribe', ctrl.unsubscribe);
  // has subscribed
  router.get('/subscribe/:subUserId', ctrl.hasSubscribed);
  router.get('/subscribe', ctrl.getSubscribers);

  //router.put('/subscribe', ctrl.update);
  // Delete Activity
  //router.delete('/subscribe/:id', ctrl.delete);
};

module.exports = subscriberRoutes;
