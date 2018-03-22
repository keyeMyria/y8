const CTRLS = require('../controllers');

const friendRoutes = (router) => {
  const ctrl = new CTRLS.Friend();
  router.get('/friend/user', ctrl.searchUser);
  router.get('/friend/requests', ctrl.getRequests);
  router.post('/friend/send', ctrl.sendRequest);
  router.post('/friend/accept', ctrl.acceptRequest);
  router.post('/friend/reject', ctrl.rejectRequest);

  router.post('/friend/block', ctrl.blockRequest);
  router.post('/friend/unblock', ctrl.unblockRequest);
  router.delete('/friend/delete', ctrl.deleteRequest);
};

module.exports = friendRoutes;
