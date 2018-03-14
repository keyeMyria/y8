
const router = require('express').Router();
router.use('/private', require('./private'));
router.use('/public', require('./public'));

module.exports = router;
